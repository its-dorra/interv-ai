import type { UserTable } from "@/drizzle/schema";

export type User = typeof UserTable.$inferSelect;
