import db from "@/drizzle/db";
import { getUserIdTag } from "@/features/users/db-cache";
import { auth } from "@clerk/nextjs/server";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { cache } from "react";

export const getCurrentUser = cache(
  async ({
    allData = false,
  }: {
    allData?: boolean;
  } = {}) => {
    const { userId, redirectToSignIn } = await auth();

    return {
      userId,
      redirectToSignIn,
      user: allData && userId ? await getUser(userId) : null,
    };
  }
);

async function getUser(userId: string) {
  "use cache";
  cacheTag(getUserIdTag(userId));

  return db.query.UserTable.findFirst({
    where: (User, { eq }) => eq(User.id, userId),
  });
}
