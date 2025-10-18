import db from "@/drizzle/db";
import { type InsertUser, UserTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { revalidateUserCache } from "./db-cache";

export async function upsertUser(user: InsertUser) {
  await db
    .insert(UserTable)
    .values(user)
    .onConflictDoUpdate({
      target: [UserTable.id],
      set: user,
    });

  revalidateUserCache(user.id);
}

export async function deleteUser(userId: string) {
  await db.delete(UserTable).where(eq(UserTable.id, userId));

  revalidateUserCache(userId);
}
