import type { WebSocket, WebSocketServer } from "ws";
import {
  getTimer,
  listTimers,
  pauseTimer,
  resetTimer,
  resumeTimer,
  startTimer,
  stopTimer,
  updateTimer,
} from "./timers";
import { createMessage, type MessageColor } from "./messages";
import type { Timer } from "./schema";

type ClientType =
  | "controller"
  | "viewer"
  | "operator"
  | "moderator"
  | "agenda";

interface TimerClient {
  socket: WebSocket;
  roomId: string | null;
  clientType: ClientType | null;
}

interface RoomRuntime {
  clients: Set<TimerClient>;
  autoAdvanceTimeout: ReturnType<typeof setTimeout> | null;
  blackout: boolean;
  focusMode: boolean;
  lastMessage: { id: string; text: string; color: string } | null;
}

const roomRuntime = new Map<string, RoomRuntime>();
const clients = new WeakMap<WebSocket, TimerClient>();

function getRuntime(roomId: string): RoomRuntime {
  let r = roomRuntime.get(roomId);
  if (!r) {
    r = {
      clients: new Set(),
      autoAdvanceTimeout: null,
      blackout: false,
      focusMode: false,
      lastMessage: null,
    };
    roomRuntime.set(roomId, r);
  }
  return r;
}

function removeClientFromRoom(client: TimerClient) {
  if (!client.roomId) return;
  const r = roomRuntime.get(client.roomId);
  if (!r) return;
  r.clients.delete(client);
  if (r.clients.size === 0) {
    if (r.autoAdvanceTimeout) clearTimeout(r.autoAdvanceTimeout);
    roomRuntime.delete(client.roomId);
  }
}

export function broadcast(roomId: string, payload: unknown, exclude?: WebSocket) {
  const r = roomRuntime.get(roomId);
  if (!r) return;
  const msg = JSON.stringify(payload);
  for (const c of r.clients) {
    if (c.socket === exclude) continue;
    if (c.socket.readyState === 1) c.socket.send(msg);
  }
}

export function countConnections(roomId: string): number {
  return roomRuntime.get(roomId)?.clients.size ?? 0;
}

function send(ws: WebSocket, payload: unknown) {
  if (ws.readyState === 1) ws.send(JSON.stringify(payload));
}

function serializeTimer(t: Timer) {
  return {
    ...t,
    startedAt: t.startedAt ? t.startedAt.getTime() : null,
    scheduledStart: t.scheduledStart ? t.scheduledStart.getTime() : null,
    createdAt: t.createdAt.getTime(),
    updatedAt: t.updatedAt.getTime(),
  };
}

function sendRoomState(ws: WebSocket, roomId: string) {
  const timers = listTimers(roomId).map(serializeTimer);
  const active = timers.find(
    (t) => t.status === "running" || t.status === "paused",
  );
  const r = getRuntime(roomId);
  send(ws, {
    type: "room:state",
    timers,
    activeTimerId: active?.id ?? null,
    blackout: r.blackout,
    focusMode: r.focusMode,
    currentMessage: r.lastMessage,
  });
}

function broadcastTimerUpdated(roomId: string, timer: Timer | undefined) {
  if (!timer) return;
  broadcast(roomId, { type: "timer:updated", timer: serializeTimer(timer) });
}

export function broadcastRoomSync(roomId: string) {
  const timers = listTimers(roomId).map(serializeTimer);
  const active = timers.find(
    (t) => t.status === "running" || t.status === "paused",
  );
  const r = getRuntime(roomId);
  broadcast(roomId, {
    type: "room:state",
    timers,
    activeTimerId: active?.id ?? null,
    blackout: r.blackout,
    focusMode: r.focusMode,
    currentMessage: r.lastMessage,
  });
}

function scheduleAutoAdvance(roomId: string, timer: Timer) {
  const r = getRuntime(roomId);
  if (r.autoAdvanceTimeout) {
    clearTimeout(r.autoAdvanceTimeout);
    r.autoAdvanceTimeout = null;
  }
  if (timer.type !== "countdown") return;
  if (timer.status !== "running" || !timer.startedAt) return;
  const remainingMs =
    timer.duration * 1000 -
    (timer.elapsedMs + (Date.now() - timer.startedAt.getTime()));
  if (remainingMs <= 0) {
    advanceOnFinish(roomId, timer.id);
    return;
  }
  r.autoAdvanceTimeout = setTimeout(() => {
    advanceOnFinish(roomId, timer.id);
  }, remainingMs);
}

function advanceOnFinish(roomId: string, finishedId: string) {
  const finished = getTimer(finishedId);
  if (!finished || finished.status !== "running") return;

  // Mark as finished (status idle + reset)
  const ended = updateTimer(finishedId, {
    status: "finished",
    startedAt: null,
    elapsedMs: finished.duration * 1000,
  });
  broadcastTimerUpdated(roomId, ended);
  broadcast(roomId, { type: "timer:finished", timerId: finishedId });

  if (!finished.autoAdvance) return;

  // Find next timer by order
  const all = listTimers(roomId);
  const currentIdx = all.findIndex((t) => t.id === finishedId);
  const next = all.slice(currentIdx + 1).find((t) => t.status === "idle");
  if (!next) return;

  const started = startTimer(next.id);
  broadcastTimerUpdated(roomId, started);
  if (started) scheduleAutoAdvance(roomId, started);
}

export function attachWebSocketHandlers(wss: WebSocketServer) {
  wss.on("connection", (ws: WebSocket) => {
    const client: TimerClient = { socket: ws, roomId: null, clientType: null };
    clients.set(ws, client);

    ws.on("message", (raw) => {
      let msg: { type?: string; [k: string]: unknown };
      try {
        msg = JSON.parse(raw.toString());
      } catch {
        send(ws, { type: "error", message: "invalid json" });
        return;
      }

      if (msg.type === "ping") {
        send(ws, { type: "pong" });
        return;
      }

      if (msg.type === "join") {
        const roomId = String(msg.roomId ?? "");
        const clientType = String(msg.clientType ?? "") as ClientType;
        if (!roomId || !clientType) {
          send(ws, { type: "error", message: "missing roomId or clientType" });
          return;
        }
        removeClientFromRoom(client);
        client.roomId = roomId;
        client.clientType = clientType;
        getRuntime(roomId).clients.add(client);
        send(ws, { type: "joined", roomId });
        sendRoomState(ws, roomId);
        broadcast(roomId, {
          type: "connections:update",
          count: countConnections(roomId),
        });
        return;
      }

      if (!client.roomId) {
        send(ws, { type: "error", message: "not in a room" });
        return;
      }

      switch (msg.type) {
        case "timer:start":
        case "timer:pause":
        case "timer:resume":
        case "timer:stop":
        case "timer:reset": {
          const timerId = String(msg.timerId ?? "");
          if (!timerId) return;
          let updated: Timer | undefined;
          if (msg.type === "timer:start") updated = startTimer(timerId);
          else if (msg.type === "timer:pause") updated = pauseTimer(timerId);
          else if (msg.type === "timer:resume") updated = resumeTimer(timerId);
          else if (msg.type === "timer:stop") updated = stopTimer(timerId);
          else if (msg.type === "timer:reset") updated = resetTimer(timerId);

          if (!updated) return;
          if (msg.type === "timer:start") {
            const others = listTimers(client.roomId).filter(
              (t) => t.id !== timerId,
            );
            for (const other of others) broadcastTimerUpdated(client.roomId, other);
            scheduleAutoAdvance(client.roomId, updated);
          } else {
            const r = getRuntime(client.roomId);
            if (r.autoAdvanceTimeout) {
              clearTimeout(r.autoAdvanceTimeout);
              r.autoAdvanceTimeout = null;
            }
            if (updated.status === "running") {
              scheduleAutoAdvance(client.roomId, updated);
            }
          }
          broadcastTimerUpdated(client.roomId, updated);
          return;
        }

        case "timer:nudge": {
          const timerId = String(msg.timerId ?? "");
          const deltaSec = Number(msg.deltaSec ?? 0);
          if (!timerId || !Number.isFinite(deltaSec)) return;
          const t = getTimer(timerId);
          if (!t) return;
          const newDuration = Math.max(0, t.duration + deltaSec);
          const updated = updateTimer(timerId, { duration: newDuration });
          broadcastTimerUpdated(client.roomId, updated);
          if (updated && updated.status === "running") {
            scheduleAutoAdvance(client.roomId, updated);
          }
          return;
        }

        case "message:send": {
          const text = String(msg.text ?? "").trim();
          const color = (String(msg.color ?? "white") as MessageColor);
          if (!text) return;
          try {
            const m = createMessage(client.roomId, text, color);
            const runtime = getRuntime(client.roomId);
            runtime.lastMessage = { id: m.id, text: m.text, color: m.color };
            broadcast(client.roomId, {
              type: "message:received",
              message: {
                id: m.id,
                text: m.text,
                color: m.color,
                sentAt: m.createdAt.getTime(),
              },
            });
          } catch {
            /* noop */
          }
          return;
        }

        case "message:clear": {
          const runtime = getRuntime(client.roomId);
          runtime.lastMessage = null;
          broadcast(client.roomId, { type: "message:clear" });
          return;
        }

        case "display:blackout": {
          const active = Boolean(msg.active);
          getRuntime(client.roomId).blackout = active;
          broadcast(client.roomId, { type: "display:blackout", active });
          return;
        }

        case "display:focus": {
          const active = Boolean(msg.active);
          getRuntime(client.roomId).focusMode = active;
          broadcast(client.roomId, { type: "display:focus", active });
          return;
        }

        case "display:flash": {
          broadcast(client.roomId, { type: "display:flash" });
          return;
        }

        case "timer:refresh":
        case "room:refresh": {
          sendRoomState(ws, client.roomId);
          return;
        }

        case "room:sync-all": {
          // broadcast fresh room:state to all clients (useful after REST CRUD)
          const r = getRuntime(client.roomId);
          const timers = listTimers(client.roomId).map(serializeTimer);
          const active = timers.find(
            (t) => t.status === "running" || t.status === "paused",
          );
          broadcast(client.roomId, {
            type: "room:state",
            timers,
            activeTimerId: active?.id ?? null,
            blackout: r.blackout,
            focusMode: r.focusMode,
            currentMessage: r.lastMessage,
          });
          return;
        }

        default:
          send(ws, { type: "error", message: `unknown type: ${msg.type}` });
      }
    });

    ws.on("close", () => {
      const roomId = client.roomId;
      removeClientFromRoom(client);
      if (roomId) {
        broadcast(roomId, {
          type: "connections:update",
          count: countConnections(roomId),
        });
      }
    });
  });
}
