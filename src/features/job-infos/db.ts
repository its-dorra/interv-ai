import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import db from "@/drizzle/db";
import {
  getJobInfoIdTag,
  getJobInfoUserTag,
  revalidateJobInfosCache,
} from "./db-cache";
import type { CreateJobInfo, UpdateJobInfo } from "./types";
import { JobInfoTable } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { cache } from "react";

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

export async function updateJobInfo(id: string, data: UpdateJobInfo) {
  const [updatedJobInfo] = await db
    .update(JobInfoTable)
    .set(data)
    .where(eq(JobInfoTable.id, id))
    .returning({ id: JobInfoTable.id, userId: JobInfoTable.userId });

  revalidateJobInfosCache(updatedJobInfo);

  return updatedJobInfo;
}

export const getJobInfo = cache(async (id: string, userId: string) => {
  "use cache";
  cacheTag(getJobInfoIdTag(id));

  return db.query.JobInfoTable.findFirst({
    where: (fields, { eq, and }) =>
      and(eq(fields.id, id), eq(fields.userId, userId)),
  });
});
