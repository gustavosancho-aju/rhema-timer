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

// Para migrações usamos o endpoint direto do Neon (sem "-pooler"), que
// suporta melhor o DDL/prepared statements do drizzle-kit que o pooled.
const migrationUrl = (process.env.DATABASE_URL ?? "").replace("-pooler.", ".");

export default {
  schema: [
    "./src/features/timer/lib/schema.ts",
    "./src/features/rhema/lib/gravacoes-schema.ts",
  ],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: migrationUrl,
  },
} satisfies Config;
