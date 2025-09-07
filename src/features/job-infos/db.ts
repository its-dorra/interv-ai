import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import db from "@/drizzle/db";
import { getJobInfoUserTag } from "./db-cache";

export async function getJobInfos(userId: string) {
  "use cache";
  cacheTag(getJobInfoUserTag(userId));

  return db.query.JobInfoTable.findMany({
    where: (JobInfo, { eq }) => eq(JobInfo.userId, userId),
    orderBy: (JobInfo, { desc }) => desc(JobInfo.updatedAt),
  });
}
