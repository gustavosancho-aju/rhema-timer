import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./db";
import { timers, type NewTimer, type Timer } from "./schema";

export type TimerType = "countdown" | "countup" | "time_of_day";
export type TimerStatus = "idle" | "running" | "paused" | "finished";

export function listTimers(roomId: string): Timer[] {
  return db
    .select()
    .from(timers)
    .where(eq(timers.roomId, roomId))
    .orderBy(asc(timers.order))
    .all();
}

export function getTimer(id: string): Timer | undefined {
  return db.select().from(timers).where(eq(timers.id, id)).get();
}

export function getActiveTimer(roomId: string): Timer | undefined {
  return db
    .select()
    .from(timers)
    .where(eq(timers.roomId, roomId))
    .all()
    .find((t) => t.status === "running" || t.status === "paused");
}

export interface CreateTimerInput {
  roomId: string;
  title?: string;
  presenter?: string;
  type?: TimerType;
  duration?: number;
  color?: string;
  order?: number;
  autoAdvance?: boolean;
}

export function createTimer(input: CreateTimerInput): Timer {
  const id = nanoid(10);
  const now = new Date();
  const maxOrder = db
    .select()
    .from(timers)
    .where(eq(timers.roomId, input.roomId))
    .all()
    .reduce((max, t) => Math.max(max, t.order), -1);

  const data: NewTimer = {
    id,
    roomId: input.roomId,
    title: input.title ?? "",
    presenter: input.presenter ?? "",
    type: input.type ?? "countdown",
    duration: input.duration ?? 0,
    color: input.color ?? "white",
    order: input.order ?? maxOrder + 1,
    status: "idle",
    elapsedMs: 0,
    autoAdvance: input.autoAdvance ?? false,
    wrapupAt: "[]",
    createdAt: now,
    updatedAt: now,
  };
  db.insert(timers).values(data).run();
  return getTimer(id)!;
}

export function updateTimer(
  id: string,
  patch: Partial<Omit<Timer, "id" | "roomId" | "createdAt">>,
): Timer | undefined {
  db.update(timers)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(timers.id, id))
    .run();
  return getTimer(id);
}

export function deleteTimer(id: string): boolean {
  const r = db.delete(timers).where(eq(timers.id, id)).run();
  return r.changes > 0;
}

function stopOthers(roomId: string, keepId: string) {
  const others = listTimers(roomId).filter(
    (t) => t.id !== keepId && (t.status === "running" || t.status === "paused"),
  );
  for (const t of others) {
    updateTimer(t.id, { status: "idle", startedAt: null, elapsedMs: 0 });
  }
}

export function startTimer(id: string): Timer | undefined {
  const t = getTimer(id);
  if (!t) return undefined;
  stopOthers(t.roomId, id);
  return updateTimer(id, {
    status: "running",
    startedAt: new Date(),
    elapsedMs: 0,
  });
}

export function pauseTimer(id: string): Timer | undefined {
  const t = getTimer(id);
  if (!t || t.status !== "running" || !t.startedAt) return t;
  const elapsedMs = t.elapsedMs + (Date.now() - t.startedAt.getTime());
  return updateTimer(id, {
    status: "paused",
    startedAt: null,
    elapsedMs,
  });
}

export function resumeTimer(id: string): Timer | undefined {
  const t = getTimer(id);
  if (!t || t.status !== "paused") return t;
  return updateTimer(id, {
    status: "running",
    startedAt: new Date(),
  });
}

export function stopTimer(id: string): Timer | undefined {
  return updateTimer(id, {
    status: "idle",
    startedAt: null,
    elapsedMs: 0,
  });
}

export function resetTimer(id: string): Timer | undefined {
  return stopTimer(id);
}
