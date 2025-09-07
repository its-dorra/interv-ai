import { serverEnv } from "@/data/env/server";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema/index.ts",
  dialect: "postgresql",
  tablesFilter: ["meet_ai_*"],
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
});
