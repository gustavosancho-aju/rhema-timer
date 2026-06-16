import { NextRequest, NextResponse } from "next/server";
import { createRoom, listRooms } from "@/features/timer/lib/rooms";

export const runtime = "nodejs";

export async function GET() {
  const rooms = await listRooms();
  return NextResponse.json({ rooms });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { name?: string };
    if (!body.name || !body.name.trim()) {
      return NextResponse.json(
        { error: "Campo obrigatório: name" },
        { status: 400 },
      );
    }
    const room = await createRoom(body.name);
    return NextResponse.json({ room }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
