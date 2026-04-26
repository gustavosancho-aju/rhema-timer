import { NextRequest, NextResponse } from "next/server";
import { deleteRoom, getRoom, renameRoom } from "@/lib/timer/rooms";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const room = getRoom(id);
  if (!room) {
    return NextResponse.json({ error: "Sala não encontrada" }, { status: 404 });
  }
  return NextResponse.json({ room });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const body = (await req.json()) as { name?: string };
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: "Campo obrigatório: name" },
        { status: 400 },
      );
    }
    const room = renameRoom(id, body.name);
    if (!room) {
      return NextResponse.json(
        { error: "Sala não encontrada" },
        { status: 404 },
      );
    }
    return NextResponse.json({ room });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const ok = deleteRoom(id);
  if (!ok) {
    return NextResponse.json({ error: "Sala não encontrada" }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
