import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const rooms = sqliteTable("rooms", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('now','subsec')*1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('now','subsec')*1000)`),
});

export const timers = sqliteTable("timers", {
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
  scheduledStart: integer("scheduled_start", { mode: "timestamp_ms" }),
  color: text("color").notNull().default("white"),
  order: integer("order").notNull().default(0),
  status: text("status", {
    enum: ["idle", "running", "paused", "finished"],
  })
    .notNull()
    .default("idle"),
  startedAt: integer("started_at", { mode: "timestamp_ms" }),
  elapsedMs: integer("elapsed_ms").notNull().default(0),
  autoAdvance: integer("auto_advance", { mode: "boolean" })
    .notNull()
    .default(false),
  wrapupAt: text("wrapup_at").notNull().default("[]"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('now','subsec')*1000)`),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('now','subsec')*1000)`),
});

export const messages = sqliteTable("messages", {
  id: text("id").primaryKey(),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  text: text("text").notNull(),
  color: text("color", { enum: ["white", "green", "red"] })
    .notNull()
    .default("white"),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('now','subsec')*1000)`),
});

export const connections = sqliteTable("connections", {
  id: text("id").primaryKey(),
  roomId: text("room_id")
    .notNull()
    .references(() => rooms.id, { onDelete: "cascade" }),
  type: text("type", {
    enum: ["controller", "viewer", "operator", "moderator", "agenda"],
  }).notNull(),
  label: text("label").notNull().default(""),
  connectedAt: integer("connected_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch('now','subsec')*1000)`),
});

export type Room = typeof rooms.$inferSelect;
export type NewRoom = typeof rooms.$inferInsert;
export type Timer = typeof timers.$inferSelect;
export type NewTimer = typeof timers.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
