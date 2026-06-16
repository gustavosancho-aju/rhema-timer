// Conexão Drizzle com o Postgres do Supabase (server-side), compartilhada entre
// features. Inicialização preguiçosa: só conecta quando `getDb()` é chamado,
// evitando abrir conexão durante o build.
//
// Sem schema fixo: as features definem suas próprias tabelas e consultam via
// `getDb().select().from(tabela)`. (db.query relacional não é usado.)
import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let db: PostgresJsDatabase | null = null;

export function getDb(): PostgresJsDatabase {
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
  db = drizzle(sql);
  return db;
}
