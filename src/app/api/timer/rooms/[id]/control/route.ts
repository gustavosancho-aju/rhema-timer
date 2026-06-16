import { NextRequest, NextResponse } from "next/server";
import {
  getTimer,
  listTimers,
  pauseTimer,
  resetTimer,
  resumeTimer,
  startTimer,
  stopTimer,
  updateTimer,
} from "@/features/timer/lib/timers";
import { createMessage, type MessageColor } from "@/features/timer/lib/messages";
import { setRoomState } from "@/features/timer/lib/room-state";
import {
  broadcastRoomState,
  broadcastToRoom,
} from "@/features/timer/lib/realtime";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

// Finaliza o timer que chegou a zero e, se autoAdvance, inicia o próximo idle.
async function advanceOnFinish(roomId: string, finishedId: string) {
  const finished = await getTimer(finishedId);
  if (!finished || finished.status !== "running") return;
  await updateTimer(finishedId, {
    status: "finished",
    startedAt: null,
    elapsedMs: finished.duration * 1000,
  });
  if (!finished.autoAdvance) return;
  const all = await listTimers(roomId);
  const idx = all.findIndex((t) => t.id === finishedId);
  const next = all.slice(idx + 1).find((t) => t.status === "idle");
  if (next) await startTimer(next.id);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { id: roomId } = await ctx.params;
    const msg = (await req.json()) as { type?: string; [k: string]: unknown };
    const type = String(msg.type ?? "");

    switch (type) {
      case "timer:start":
      case "timer:pause":
      case "timer:resume":
      case "timer:stop":
      case "timer:reset": {
        const timerId = String(msg.timerId ?? "");
        if (!timerId) break;
        if (type === "timer:start") await startTimer(timerId);
        else if (type === "timer:pause") await pauseTimer(timerId);
        else if (type === "timer:resume") await resumeTimer(timerId);
        else if (type === "timer:stop") await stopTimer(timerId);
        else if (type === "timer:reset") await resetTimer(timerId);
        await broadcastRoomState(roomId);
        break;
      }

      case "timer:autoadvance": {
        // Disparado pelo cliente controller quando o countdown ativo zera.
        const timerId = String(msg.timerId ?? "");
        if (!timerId) break;
        await advanceOnFinish(roomId, timerId);
        await broadcastRoomState(roomId);
        break;
      }

      case "timer:nudge": {
        const timerId = String(msg.timerId ?? "");
        const deltaSec = Number(msg.deltaSec ?? 0);
        if (!timerId || !Number.isFinite(deltaSec)) break;
        const t = await getTimer(timerId);
        if (!t) break;
        await updateTimer(timerId, {
          duration: Math.max(0, t.duration + deltaSec),
        });
        await broadcastRoomState(roomId);
        break;
      }

      case "message:send": {
        const text = String(msg.text ?? "").trim();
        const color = String(msg.color ?? "white") as MessageColor;
        if (!text) break;
        const m = await createMessage(roomId, text, color);
        await setRoomState(roomId, {
          messageId: m.id,
          messageText: m.text,
          messageColor: m.color,
        });
        await broadcastToRoom(roomId, "message:received", {
          message: { id: m.id, text: m.text, color: m.color, sentAt: m.createdAt.getTime() },
        });
        break;
      }

      case "message:clear": {
        await setRoomState(roomId, {
          messageId: null,
          messageText: null,
          messageColor: null,
        });
        await broadcastToRoom(roomId, "message:clear", {});
        break;
      }

      case "display:blackout": {
        const active = Boolean(msg.active);
        await setRoomState(roomId, { blackout: active });
        await broadcastToRoom(roomId, "display:blackout", { active });
        break;
      }

      case "display:focus": {
        const active = Boolean(msg.active);
        await setRoomState(roomId, { focusMode: active });
        await broadcastToRoom(roomId, "display:focus", { active });
        break;
      }

      case "display:flash": {
        await broadcastToRoom(roomId, "display:flash", {});
        break;
      }

      case "room:refresh":
      case "room:sync-all": {
        await broadcastRoomState(roomId);
        break;
      }

      default:
        return NextResponse.json(
          { error: `unknown type: ${type}` },
          { status: 400 },
        );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
