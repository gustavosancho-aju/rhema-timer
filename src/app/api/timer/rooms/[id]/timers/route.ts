import { NextRequest, NextResponse } from "next/server";
import { createTimer, listTimers } from "@/features/timer/lib/timers";
import { getRoom } from "@/features/timer/lib/rooms";
import { broadcastRoomState } from "@/features/timer/lib/realtime";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const room = await getRoom(id);
  if (!room)
    return NextResponse.json({ error: "Sala não encontrada" }, { status: 404 });
  return NextResponse.json({ timers: await listTimers(id) });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const room = await getRoom(id);
    if (!room)
      return NextResponse.json(
        { error: "Sala não encontrada" },
        { status: 404 },
      );
    const body = (await req.json()) as {
      title?: string;
      presenter?: string;
      type?: "countdown" | "countup" | "time_of_day";
      duration?: number;
      color?: string;
      autoAdvance?: boolean;
    };
    const timer = await createTimer({ roomId: id, ...body });
    await broadcastRoomState(id);
    return NextResponse.json({ timer }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
