import type { Config } from "drizzle-kit";

export default {
  schema: "./src/lib/timer/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: "./timer.db",
  },
} satisfies Config;
