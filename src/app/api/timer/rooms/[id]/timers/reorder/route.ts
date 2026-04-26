import { NextRequest, NextResponse } from "next/server";
import { updateTimer } from "@/lib/timer/timers";
import { broadcastRoomSync } from "@/lib/timer/ws-handler";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as { ids: string[] };
    if (!Array.isArray(body.ids)) {
      return NextResponse.json({ error: "ids array required" }, { status: 400 });
    }
    body.ids.forEach((timerId, idx) => {
      updateTimer(timerId, { order: idx });
    });
    broadcastRoomSync(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
