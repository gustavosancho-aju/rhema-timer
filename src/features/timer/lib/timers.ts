import { asc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "./db";
import { timers, type NewTimer, type Timer } from "./schema";

export type TimerType = "countdown" | "countup" | "time_of_day";
export type TimerStatus = "idle" | "running" | "paused" | "finished";

export async function listTimers(roomId: string): Promise<Timer[]> {
  return getDb()
    .select()
    .from(timers)
    .where(eq(timers.roomId, roomId))
    .orderBy(asc(timers.order));
}

export async function getTimer(id: string): Promise<Timer | undefined> {
  const rows = await getDb().select().from(timers).where(eq(timers.id, id));
  return rows[0];
}

export async function getActiveTimer(
  roomId: string,
): Promise<Timer | undefined> {
  const all = await listTimers(roomId);
  return all.find((t) => t.status === "running" || t.status === "paused");
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

export async function createTimer(input: CreateTimerInput): Promise<Timer> {
  const id = nanoid(10);
  const existing = await listTimers(input.roomId);
  const maxOrder = existing.reduce((max, t) => Math.max(max, t.order), -1);

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
  };
  const [row] = await getDb().insert(timers).values(data).returning();
  return row;
}

export async function updateTimer(
  id: string,
  patch: Partial<Omit<Timer, "id" | "roomId" | "createdAt">>,
): Promise<Timer | undefined> {
  const [row] = await getDb()
    .update(timers)
    .set({ ...patch, updatedAt: new Date() })
    .where(eq(timers.id, id))
    .returning();
  return row;
}

export async function deleteTimer(id: string): Promise<boolean> {
  const rows = await getDb()
    .delete(timers)
    .where(eq(timers.id, id))
    .returning({ id: timers.id });
  return rows.length > 0;
}

async function stopOthers(roomId: string, keepId: string): Promise<void> {
  const others = (await listTimers(roomId)).filter(
    (t) => t.id !== keepId && (t.status === "running" || t.status === "paused"),
  );
  for (const t of others) {
    await updateTimer(t.id, { status: "idle", startedAt: null, elapsedMs: 0 });
  }
}

export async function startTimer(id: string): Promise<Timer | undefined> {
  const t = await getTimer(id);
  if (!t) return undefined;
  await stopOthers(t.roomId, id);
  return updateTimer(id, {
    status: "running",
    startedAt: new Date(),
    elapsedMs: 0,
  });
}

export async function pauseTimer(id: string): Promise<Timer | undefined> {
  const t = await getTimer(id);
  if (!t || t.status !== "running" || !t.startedAt) return t;
  const elapsedMs = t.elapsedMs + (Date.now() - t.startedAt.getTime());
  return updateTimer(id, { status: "paused", startedAt: null, elapsedMs });
}

export async function resumeTimer(id: string): Promise<Timer | undefined> {
  const t = await getTimer(id);
  if (!t || t.status !== "paused") return t;
  return updateTimer(id, { status: "running", startedAt: new Date() });
}

export async function stopTimer(id: string): Promise<Timer | undefined> {
  return updateTimer(id, { status: "idle", startedAt: null, elapsedMs: 0 });
}

export async function resetTimer(id: string): Promise<Timer | undefined> {
  return stopTimer(id);
}
