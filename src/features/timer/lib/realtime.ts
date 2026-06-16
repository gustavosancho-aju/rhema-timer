// Broadcast server-side para o canal Realtime de uma sala, via REST do Supabase
// (não precisa de conexão WebSocket persistente — ideal para serverless/Vercel).
import { getRoomState } from "./room-state";
import { listTimers } from "./timers";
import type { Timer } from "./schema";

export function roomTopic(roomId: string): string {
  return `room:${roomId}`;
}

export function serializeTimer(t: Timer) {
  return {
    ...t,
    startedAt: t.startedAt ? t.startedAt.getTime() : null,
    scheduledStart: t.scheduledStart ? t.scheduledStart.getTime() : null,
    createdAt: t.createdAt.getTime(),
    updatedAt: t.updatedAt.getTime(),
  };
}

/** Monta o payload completo de estado da sala (timers + estado efêmero). */
export async function buildRoomStatePayload(roomId: string) {
  const [timers, ephemeral] = await Promise.all([
    listTimers(roomId),
    getRoomState(roomId),
  ]);
  const serialized = timers.map(serializeTimer);
  const active = serialized.find(
    (t) => t.status === "running" || t.status === "paused",
  );
  return {
    type: "room:state" as const,
    timers: serialized,
    activeTimerId: active?.id ?? null,
    blackout: ephemeral.blackout,
    focusMode: ephemeral.focusMode,
    currentMessage: ephemeral.currentMessage,
  };
}

/** Envia um evento de broadcast para todos os clientes inscritos na sala. */
export async function broadcastToRoom(
  roomId: string,
  event: string,
  payload: unknown,
): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return; // Supabase não configurado — no-op

  try {
    await fetch(`${url}/realtime/v1/api/broadcast`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: key,
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        messages: [
          { topic: roomTopic(roomId), event, payload: payload ?? {} },
        ],
      }),
    });
  } catch {
    /* falha de broadcast não deve quebrar a mutação */
  }
}

/** Atalho: rebroadcast do estado completo da sala. */
export async function broadcastRoomState(roomId: string): Promise<void> {
  const payload = await buildRoomStatePayload(roomId);
  await broadcastToRoom(roomId, "room:state", payload);
}
