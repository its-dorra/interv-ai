import db from "@/drizzle/db";
import { type InsertUser, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export async function upsertUser(user: InsertUser) {
  return db
    .insert(UserTable)
    .values(user)
    .onConflictDoUpdate({
      target: [UserTable.id],
      set: user,
    });
}

export async function deleteUser(userId: string) {
  return db.delete(UserTable).where(eq(UserTable.id, userId));
}
