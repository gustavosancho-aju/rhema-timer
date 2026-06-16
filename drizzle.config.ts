import type { Config } from "drizzle-kit";

export default {
  schema: "./src/features/timer/lib/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./timer.db",
  },
} satisfies Config;
