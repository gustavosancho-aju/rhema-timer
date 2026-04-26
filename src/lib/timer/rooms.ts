import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./db";
import { rooms, type NewRoom, type Room } from "./schema";

export function listRooms(): Room[] {
  return db.select().from(rooms).orderBy(desc(rooms.updatedAt)).all();
}

export function getRoom(id: string): Room | undefined {
  return db.select().from(rooms).where(eq(rooms.id, id)).get();
}

export function createRoom(name: string): Room {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nome da sala é obrigatório");
  const id = nanoid(10);
  const now = new Date();
  const data: NewRoom = {
    id,
    name: trimmed,
    createdAt: now,
    updatedAt: now,
  };
  db.insert(rooms).values(data).run();
  return getRoom(id)!;
}

export function renameRoom(id: string, name: string): Room | undefined {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nome da sala é obrigatório");
  db.update(rooms)
    .set({ name: trimmed, updatedAt: new Date() })
    .where(eq(rooms.id, id))
    .run();
  return getRoom(id);
}

export function deleteRoom(id: string): boolean {
  const result = db.delete(rooms).where(eq(rooms.id, id)).run();
  return result.changes > 0;
}
