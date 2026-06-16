"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { nanoid } from "nanoid";
import { getSupabaseBrowser } from "@/shared/lib/supabase";
import {
  selectActiveTimer,
  useTimerStore,
  type TimerState,
} from "@/features/timer/store/timer-store";

type ClientType =
  | "controller"
  | "viewer"
  | "operator"
  | "moderator"
  | "agenda";

interface RoomStatePayload {
  timers?: TimerState[];
  activeTimerId?: string | null;
  blackout?: boolean;
  focusMode?: boolean;
  currentMessage?: { id: string; text: string; color: string } | null;
}

/**
 * Sincroniza o estado da sala via Supabase Realtime (substitui o antigo
 * WebSocket). Mantém a mesma interface pública: { sendCommand, flashPulse }.
 */
export function useRealtimeTimer(roomId: string, clientType: ClientType) {
  // ID estável para presença (gerado uma vez por montagem).
  const [clientId] = useState(() => nanoid(8));

  const setRoomState = useTimerStore((s) => s.setRoomState);
  const setConnectionCount = useTimerStore((s) => s.setConnectionCount);
  const setWsConnected = useTimerStore((s) => s.setWsConnected);
  const setBlackout = useTimerStore((s) => s.setBlackout);
  const setFocusMode = useTimerStore((s) => s.setFocusMode);
  const setMessage = useTimerStore((s) => s.setMessage);
  const [flashPulse, setFlashPulse] = useState(0);

  const applyRoomState = useCallback(
    (p: RoomStatePayload) => {
      setRoomState(p.timers ?? [], p.activeTimerId ?? null);
      setBlackout(Boolean(p.blackout));
      setFocusMode(Boolean(p.focusMode));
      setMessage(p.currentMessage ?? null);
    },
    [setRoomState, setBlackout, setFocusMode, setMessage],
  );

  // Envia um comando para o endpoint de controle (muta no servidor + broadcast).
  const sendCommand = useCallback(
    (payload: Record<string, unknown>) => {
      fetch(`/api/timer/rooms/${roomId}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch(() => {});
    },
    [roomId],
  );

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    const channel = supabase.channel(`room:${roomId}`, {
      config: {
        broadcast: { self: true },
        presence: { key: clientId },
      },
    });

    channel
      .on("broadcast", { event: "room:state" }, ({ payload }) =>
        applyRoomState(payload as RoomStatePayload),
      )
      .on("broadcast", { event: "display:blackout" }, ({ payload }) =>
        setBlackout(Boolean((payload as { active?: boolean }).active)),
      )
      .on("broadcast", { event: "display:focus" }, ({ payload }) =>
        setFocusMode(Boolean((payload as { active?: boolean }).active)),
      )
      .on("broadcast", { event: "display:flash" }, () =>
        setFlashPulse((n) => n + 1),
      )
      .on("broadcast", { event: "message:received" }, ({ payload }) => {
        const m = (payload as { message?: { id: string; text: string; color: string } })
          .message;
        if (m) setMessage({ id: m.id, text: m.text, color: m.color });
      })
      .on("broadcast", { event: "message:clear" }, () => setMessage(null))
      .on("presence", { event: "sync" }, () => {
        setConnectionCount(Object.keys(channel.presenceState()).length);
      })
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setWsConnected(true);
          channel.track({ clientType });
          // Estado inicial via REST (o canal só entrega eventos futuros).
          fetch(`/api/timer/rooms/${roomId}/state`)
            .then((r) => (r.ok ? r.json() : null))
            .then((data) => {
              if (data) applyRoomState(data as RoomStatePayload);
            })
            .catch(() => {});
        } else {
          setWsConnected(false);
        }
      });

    return () => {
      setWsConnected(false);
      supabase.removeChannel(channel);
    };
  }, [
    roomId,
    clientType,
    clientId,
    applyRoomState,
    setBlackout,
    setFocusMode,
    setMessage,
    setConnectionCount,
    setWsConnected,
  ]);

  // Auto-advance: o controller detecta o countdown ativo chegando a zero e
  // dispara a troca no servidor (sem processo persistente no backend).
  const firedRef = useRef<string | null>(null);
  useEffect(() => {
    if (clientType !== "controller") return;
    const interval = setInterval(() => {
      const { timers, activeTimerId } = useTimerStore.getState();
      const active = timers.find((t) => t.id === activeTimerId);
      if (
        !active ||
        active.type !== "countdown" ||
        active.status !== "running" ||
        active.startedAt == null
      ) {
        return;
      }
      const remainingMs =
        active.duration * 1000 -
        (active.elapsedMs + (Date.now() - active.startedAt));
      if (remainingMs <= 0 && firedRef.current !== active.id) {
        firedRef.current = active.id;
        sendCommand({ type: "timer:autoadvance", timerId: active.id });
      } else if (remainingMs > 0) {
        if (firedRef.current === active.id) firedRef.current = null;
      }
    }, 500);
    return () => clearInterval(interval);
  }, [clientType, sendCommand]);

  return { sendCommand, flashPulse };
}

export function useActiveTimer(): TimerState | null {
  return useTimerStore(selectActiveTimer);
}
