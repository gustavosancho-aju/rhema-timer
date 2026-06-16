// Conexão Drizzle com o Postgres do Supabase (server-side).
// Inicialização preguiçosa: só conecta quando `getDb()` é chamado, evitando
// abrir conexão durante o build.
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let db: PostgresJsDatabase<typeof schema> | null = null;

export function getDb(): PostgresJsDatabase<typeof schema> {
  if (db) return db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL não definida. Configure a connection string do Postgres " +
        "do Supabase (.env.local / Vercel).",
    );
  }

  // prepare:false é recomendado para o pooler (porta 6543) do Supabase.
  const sql = postgres(url, { prepare: false });
  db = drizzle(sql, { schema });
  return db;
}
