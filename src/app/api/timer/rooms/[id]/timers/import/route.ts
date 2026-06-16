import { NextRequest, NextResponse } from "next/server";
import { createTimer } from "@/features/timer/lib/timers";
import { getRoom } from "@/features/timer/lib/rooms";
import { broadcastRoomState } from "@/features/timer/lib/realtime";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

interface ImportRow {
  title: string;
  presenter?: string;
  type?: "countdown" | "countup" | "time_of_day";
  duration?: number;
  color?: string;
  autoAdvance?: boolean;
}

export async function POST(req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    if (!(await getRoom(id))) {
      return NextResponse.json({ error: "Sala não encontrada" }, { status: 404 });
    }
    const body = (await req.json()) as { rows?: ImportRow[] };
    if (!Array.isArray(body.rows)) {
      return NextResponse.json({ error: "rows array required" }, { status: 400 });
    }
    const rows = body.rows.filter((r) => r.title && r.title.trim());
    for (const r of rows) {
      await createTimer({
        roomId: id,
        title: r.title,
        presenter: r.presenter ?? "",
        type: r.type ?? "countdown",
        duration: r.duration ?? 0,
        color: r.color ?? "white",
        autoAdvance: r.autoAdvance ?? false,
      });
    }
    await broadcastRoomState(id);
    return NextResponse.json({ imported: rows.length }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
