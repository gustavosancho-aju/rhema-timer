import type { Config } from "drizzle-kit";

// Config Drizzle para o Postgres do Supabase. Usado por `npm run db:push`
// na Fase 1 da migração. Requer DATABASE_URL no ambiente.
export default {
  schema: "./src/features/timer/lib/schema.pg.ts",
  out: "./drizzle/pg",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
} satisfies Config;
