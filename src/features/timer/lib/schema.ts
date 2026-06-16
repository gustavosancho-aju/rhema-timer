// Schema Postgres (Supabase).
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const rooms = pgTable("rooms", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const timers = pgTable("timers", {
  id: text("id").primaryKey(),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  title: text("title").notNull().default(""),
  presenter: text("presenter").notNull().default(""),
  type: text("type", { enum: ["countdown", "countup", "time_of_day"] })
    .notNull()
    .default("countdown"),
  duration: integer("duration").notNull().default(0),
  scheduledStart: timestamp("scheduled_start", { withTimezone: true }),
  color: text("color").notNull().default("white"),
  order: integer("order").notNull().default(0),
  status: text("status", {
    enum: ["idle", "running", "paused", "finished"],
  })
    .notNull()
    .default("idle"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  elapsedMs: integer("elapsed_ms").notNull().default(0),
  autoAdvance: boolean("auto_advance").notNull().default(false),
  wrapupAt: text("wrapup_at").notNull().default("[]"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const messages = pgTable("messages", {
  id: text("id").primaryKey(),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  color: text("color", { enum: ["white", "green", "red"] })
    .notNull()
    .default("white"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Estado efêmero por sala (antes vivia na memória do servidor WebSocket).
export const roomState = pgTable("room_state", {
  roomId: text("room_id")
    .primaryKey()
    .references(() => rooms.id, { onDelete: "cascade" }),
  blackout: boolean("blackout").notNull().default(false),
  focusMode: boolean("focus_mode").notNull().default(false),
  messageId: text("message_id"),
  messageText: text("message_text"),
  messageColor: text("message_color"),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type Timer = typeof timers.$inferSelect;
export type NewTimer = typeof timers.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
export type RoomState = typeof roomState.$inferSelect;
