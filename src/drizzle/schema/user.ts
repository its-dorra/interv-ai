import { varchar } from "drizzle-orm/pg-core";
import { createdAt, pgTable, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm/relations";
import { JobInfoTable } from "./job-info";

export const UserTable = pgTable("users", {
  id: varchar().primaryKey(),
  email: varchar().notNull().unique(),
  name: varchar().notNull(),
  imageUrl: varchar().notNull(),
  createdAt,
  updatedAt,
});

export type User = typeof UserTable.$inferSelect;
export type InsertUser = typeof UserTable.$inferInsert;

export const userRelations = relations(UserTable, ({ many }) => ({
  jobInfos: many(JobInfoTable),
}));
