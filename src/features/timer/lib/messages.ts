import { desc, eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { getDb } from "@/shared/lib/db";
import { messages, type Message, type NewMessage } from "./schema";

export type MessageColor = "white" | "green" | "red";

export async function createMessage(
  roomId: string,
  text: string,
  color: MessageColor,
): Promise<Message> {
  const trimmed = text.trim();
  if (!trimmed) throw new Error("Mensagem vazia");
  const data: NewMessage = { id: nanoid(10), roomId, text: trimmed, color };
  const [row] = await getDb().insert(messages).values(data).returning();
  return row;
}

export async function listMessages(
  roomId: string,
  limit = 50,
): Promise<Message[]> {
  return getDb()
    .select()
    .from(messages)
    .where(eq(messages.roomId, roomId))
    .orderBy(desc(messages.createdAt))
    .limit(limit);
}
