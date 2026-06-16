import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { db } from "./db";
import { messages, type Message, type NewMessage } from "./schema";

export type MessageColor = "white" | "green" | "red";

export function createMessage(
  roomId: string,
  text: string,
  color: MessageColor,
): Message {
  const id = nanoid(10);
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Mensagem vazia");
  const data: NewMessage = {
    id,
    roomId,
    text: trimmed,
    color,
    createdAt: new Date(),
  };
  db.insert(messages).values(data).run();
  return db.select().from(messages).where(eq(messages.id, id)).get()!;
}

export function listMessages(roomId: string, limit = 50): Message[] {
  return db
    .select()
    .from(messages)
    .where(eq(messages.roomId, roomId))
    .orderBy(desc(messages.createdAt))
    .limit(limit)
    .all();
}
