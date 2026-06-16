import { NextRequest, NextResponse } from "next/server";
import { deleteTimer, getTimer, updateTimer } from "@/features/timer/lib/timers";
import { broadcastRoomSync } from "@/features/timer/lib/ws-handler";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string; timerId: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { timerId } = await ctx.params;
  const timer = getTimer(timerId);
  if (!timer)
    return NextResponse.json(
      { error: "Timer não encontrado" },
      { status: 404 },
    );
  return NextResponse.json({ timer });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { timerId } = await ctx.params;
    const body = (await req.json()) as Record<string, unknown>;
    const allowed = [
      "title",
      "presenter",
      "type",
      "duration",
      "color",
      "order",
      "autoAdvance",
      "wrapupAt",
      "scheduledStart",
    ] as const;
    const patch: Record<string, unknown> = {};
    for (const k of allowed) {
      if (k in body) patch[k] = body[k];
    }
    if (
      typeof patch.scheduledStart === "number" ||
      typeof patch.scheduledStart === "string"
    ) {
      const n = Number(patch.scheduledStart);
      patch.scheduledStart = Number.isFinite(n) ? new Date(n) : null;
    }
    const timer = updateTimer(timerId, patch);
    if (!timer)
      return NextResponse.json(
        { error: "Timer não encontrado" },
        { status: 404 },
      );
    broadcastRoomSync(timer.roomId);
    return NextResponse.json({ timer });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id, timerId } = await ctx.params;
  const ok = deleteTimer(timerId);
  if (!ok)
    return NextResponse.json(
      { error: "Timer não encontrado" },
      { status: 404 },
    );
  broadcastRoomSync(id);
  return NextResponse.json({ ok: true });
}
