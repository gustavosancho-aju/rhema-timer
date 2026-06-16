import { NextRequest, NextResponse } from "next/server";
import { getRoom } from "@/features/timer/lib/rooms";
import { buildRoomStatePayload } from "@/features/timer/lib/realtime";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const room = await getRoom(id);
  if (!room) {
    return NextResponse.json({ error: "Sala não encontrada" }, { status: 404 });
  }
  const state = await buildRoomStatePayload(id);
  return NextResponse.json(state);
}
