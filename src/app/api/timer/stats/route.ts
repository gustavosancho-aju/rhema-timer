import { NextResponse } from "next/server";
import { listRooms } from "@/lib/timer/rooms";
import { listTimers } from "@/lib/timer/timers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}

export async function GET() {
  const rooms = listRooms();
  const now = Date.now();

  const enriched = rooms.map((r) => {
    const timers = listTimers(r.id);
    const active = timers.find(
      (t) => t.status === "running" || t.status === "paused",
    );
    const status: "live" | "idle" | "draft" = active
      ? "live"
      : timers.length === 0
        ? "draft"
        : "idle";
    return {
      id: r.id,
      name: r.name,
      lastActivity: formatRelative(r.updatedAt.getTime()),
      timersCount: timers.length,
      status,
      activeTimerId: active?.id ?? null,
    };
  });

  const totals = {
    roomsTotal: enriched.length,
    roomsLive: enriched.filter((r) => r.status === "live").length,
    timersActive: enriched.filter((r) => r.activeTimerId).length,
    connectionsLive: 0,
  };

  return NextResponse.json({ rooms: enriched, totals, generatedAt: now });
}
