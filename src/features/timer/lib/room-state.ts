import { eq } from "drizzle-orm";
import { getDb } from "./db";
import { roomState, type RoomState } from "./schema";

export interface EphemeralState {
  blackout: boolean;
  focusMode: boolean;
  currentMessage: { id: string; text: string; color: string } | null;
}

const DEFAULT: EphemeralState = {
  blackout: false,
  focusMode: false,
  currentMessage: null,
};

function toEphemeral(row: RoomState | undefined): EphemeralState {
  if (!row) return DEFAULT;
  return {
    blackout: row.blackout,
    focusMode: row.focusMode,
    currentMessage:
      row.messageId && row.messageText
        ? {
            id: row.messageId,
            text: row.messageText,
            color: row.messageColor ?? "white",
          }
        : null,
  };
}

export async function getRoomState(roomId: string): Promise<EphemeralState> {
  const rows = await getDb()
    .select()
    .from(roomState)
    .where(eq(roomState.roomId, roomId));
  return toEphemeral(rows[0]);
}

export async function setRoomState(
  roomId: string,
  patch: Partial<{
    blackout: boolean;
    focusMode: boolean;
    messageId: string | null;
    messageText: string | null;
    messageColor: string | null;
  }>,
): Promise<EphemeralState> {
  const [row] = await getDb()
    .insert(roomState)
    .values({ roomId, ...patch, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: roomState.roomId,
      set: { ...patch, updatedAt: new Date() },
    })
    .returning();
  return toEphemeral(row);
}
