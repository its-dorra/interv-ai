"use server";

import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getUserIdTag } from "./db-cache";
import db from "@/drizzle/db";

export async function getUser(userId: string) {
  "use cache";
  cacheTag(getUserIdTag(userId));

  return db.query.UserTable.findFirst({
    where: (User, { eq }) => eq(User.id, userId),
  });
}
