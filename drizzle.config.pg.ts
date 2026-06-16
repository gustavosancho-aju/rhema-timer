import type { Config } from "drizzle-kit";

// Carrega .env.local quando rodando localmente (Node 20.6+/22). Em ambientes
// sem o arquivo (ex.: Vercel), as variáveis já vêm do process.env.
try {
  (
    process as unknown as { loadEnvFile?: (p: string) => void }
  ).loadEnvFile?.(".env.local");
} catch {
  /* arquivo ausente — ok */
}

// Para migrações usamos o pooler de sessão (5432), não o de transação (6543),
// que não suporta bem o DDL/prepared statements do drizzle-kit.
const migrationUrl = (process.env.DATABASE_URL ?? "")
  .replace(":6543", ":5432")
  .replace("?pgbouncer=true", "");

// Config Drizzle para o Postgres do Supabase. Usado por `npm run db:push:pg`.
export default {
  schema: "./src/features/timer/lib/schema.pg.ts",
  out: "./drizzle/pg",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
} satisfies Config;
