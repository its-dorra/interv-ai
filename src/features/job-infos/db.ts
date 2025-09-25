import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import db from "@/drizzle/db";
import { getJobInfoUserTag, revalidateJobInfosCache } from "./db-cache";
import type { CreateJobInfo, UpdateJobInfo } from "./types";
import { JobInfoTable } from "@/drizzle/schema";
import { and, eq } from "drizzle-orm";

export async function getJobInfos(userId: string) {
  "use cache";
  cacheTag(getJobInfoUserTag(userId));

  return db.query.JobInfoTable.findMany({
    where: (JobInfo, { eq }) => eq(JobInfo.userId, userId),
    orderBy: (JobInfo, { desc }) => desc(JobInfo.updatedAt),
  });
}

export async function insertJobInfo(data: CreateJobInfo) {
  const [newJobInfo] = await db
    .insert(JobInfoTable)
    .values(data)
    .returning({ id: JobInfoTable.id, userId: JobInfoTable.userId });

  revalidateJobInfosCache(newJobInfo);

  return newJobInfo;
}

export async function updateJobInfo(data: UpdateJobInfo) {
  const { id, ...rest } = data;

  const [updatedJobInfo] = await db
    .update(JobInfoTable)
    .set(rest)
    .where(eq(JobInfoTable.id, id))
    .returning({ id: JobInfoTable.id, userId: JobInfoTable.userId });

  revalidateJobInfosCache(updatedJobInfo);

  return updatedJobInfo;
}

export async function getExistingJobInfo(id: string, userId: string) {
  return db.query.JobInfoTable.findFirst({
    where: (t, { eq, and }) => and(eq(t.id, id), eq(t.userId, userId)),
    columns: {
      id: true,
    },
  });
}
