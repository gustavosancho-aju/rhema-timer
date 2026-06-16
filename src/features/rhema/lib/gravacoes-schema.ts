// Schema Postgres (Supabase) da feature rhema: gravações salvas com tipo de
// culto e legendas geradas. Usado pelo db:push e pela data layer.
import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export type CultoTipo = "sozo" | "familia" | "quarta";

export interface LegendaJson {
  texto: string;
  direcionamento: "emotiva" | "reflexiva" | "biblica";
  justificativa: string;
}

export const gravacoes = pgTable("gravacoes", {
  id: text("id").primaryKey(),
  cultoTipo: text("culto_tipo", { enum: ["sozo", "familia", "quarta"] })
    .notNull(),
  legendas: jsonb("legendas").$type<LegendaJson[]>().notNull().default([]),
  // Índice da legenda escolhida em `legendas` (null = nenhuma escolhida ainda).
  escolhidaIdx: integer("escolhida_idx"),
  duracaoMs: integer("duracao_ms").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Gravacao = typeof gravacoes.$inferSelect;
export type NewGravacao = typeof gravacoes.$inferInsert;
