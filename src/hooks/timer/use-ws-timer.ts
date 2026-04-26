"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  selectActiveTimer,
  useTimerStore,
  type TimerState,
} from "@/store/timer-store";

type ClientType =
  | "controller"
  | "viewer"
  | "operator"
  | "moderator"
  | "agenda";

const RECONNECT_DELAY_MS = 1500;
const PING_INTERVAL_MS = 20000;

export function useWsTimer(roomId: string, clientType: ClientType) {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const closedByUserRef = useRef(false);
  const connectRef = useRef<() => void>(() => {});

  const setRoomState = useTimerStore((s) => s.setRoomState);
  const upsertTimer = useTimerStore((s) => s.upsertTimer);
  const setConnectionCount = useTimerStore((s) => s.setConnectionCount);
  const setWsConnected = useTimerStore((s) => s.setWsConnected);
  const setBlackout = useTimerStore((s) => s.setBlackout);
  const setFocusMode = useTimerStore((s) => s.setFocusMode);
  const setMessage = useTimerStore((s) => s.setMessage);
  const [flashPulse, setFlashPulse] = useState(0);

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;
    if (closedByUserRef.current) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const url = `${protocol}//${window.location.host}/ws/timer`;
    const ws = new WebSocket(url);
    socketRef.current = ws;

    ws.onopen = () => {
      setWsConnected(true);
      ws.send(JSON.stringify({ type: "join", roomId, clientType }));
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === 1) ws.send(JSON.stringify({ type: "ping" }));
      }, PING_INTERVAL_MS);
    };

    ws.onmessage = (ev) => {
      let msg: { type?: string; [k: string]: unknown };
      try {
        msg = JSON.parse(ev.data);
      } catch {
        return;
      }

      switch (msg.type) {
        case "room:state": {
          const timers = (msg.timers as TimerState[]) ?? [];
          setRoomState(timers, (msg.activeTimerId as string | null) ?? null);
          setBlackout(Boolean(msg.blackout));
          setFocusMode(Boolean(msg.focusMode));
          setMessage(
            (msg.currentMessage as { id: string; text: string; color: string } | null) ??
              null,
          );
          break;
        }
        case "timer:updated": {
          const timer = msg.timer as TimerState | undefined;
          if (timer) upsertTimer(timer);
          break;
        }
        case "connections:update": {
          setConnectionCount((msg.count as number) ?? 0);
          break;
        }
        case "display:blackout":
          setBlackout(Boolean(msg.active));
          break;
        case "display:focus":
          setFocusMode(Boolean(msg.active));
          break;
        case "display:flash":
          setFlashPulse((n) => n + 1);
          break;
        case "message:received": {
          const m = msg.message as { id: string; text: string; color: string } | undefined;
          if (m) setMessage(m);
          break;
        }
        case "message:clear":
          setMessage(null);
          break;
      }
    };

    ws.onclose = () => {
      setWsConnected(false);
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      if (!closedByUserRef.current) {
        reconnectTimerRef.current = setTimeout(
          () => connectRef.current(),
          RECONNECT_DELAY_MS,
        );
      }
    };

    ws.onerror = () => {
      try {
        ws.close();
      } catch {
        /* noop */
      }
    };
  }, [
    roomId,
    clientType,
    setRoomState,
    upsertTimer,
    setConnectionCount,
    setWsConnected,
    setBlackout,
    setFocusMode,
    setMessage,
  ]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    closedByUserRef.current = false;
    connect();
    return () => {
      closedByUserRef.current = true;
      if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [connect]);

  const sendCommand = useCallback((payload: Record<string, unknown>) => {
    const ws = socketRef.current;
    if (ws && ws.readyState === 1) ws.send(JSON.stringify(payload));
  }, []);

  return { sendCommand, flashPulse };
}

export function useActiveTimer(): TimerState | null {
  return useTimerStore(selectActiveTimer);
}
