import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "./db";
import { rooms, type NewRoom, type Room } from "./schema";

export async function listRooms(): Promise<Room[]> {
  return getDb().select().from(rooms).orderBy(desc(rooms.updatedAt));
}

export async function getRoom(id: string): Promise<Room | undefined> {
  const rows = await getDb().select().from(rooms).where(eq(rooms.id, id));
  return rows[0];
}

export async function createRoom(name: string): Promise<Room> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nome da sala é obrigatório");
  const id = nanoid(10);
  const data: NewRoom = { id, name: trimmed };
  const [row] = await getDb().insert(rooms).values(data).returning();
  return row;
}

export async function renameRoom(
  id: string,
  name: string,
): Promise<Room | undefined> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error("Nome da sala é obrigatório");
  const [row] = await getDb()
    .update(rooms)
    .set({ name: trimmed, updatedAt: new Date() })
    .where(eq(rooms.id, id))
    .returning();
  return row;
}

export async function deleteRoom(id: string): Promise<boolean> {
  const rows = await getDb()
    .delete(rooms)
    .where(eq(rooms.id, id))
    .returning({ id: rooms.id });
  return rows.length > 0;
}
