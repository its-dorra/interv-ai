import db from "@/drizzle/db";
import { InterviewTable, JobInfoTable } from "@/drizzle/schema";
import { and, eq, getTableColumns, isNotNull } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getInterviewIdTag,
  getInterviewJobInfoTag,
  revalidateInterviewsCache,
} from "./db-cache";
import { Job } from "hume/wrapper/expressionMeasurement/batch/Job";

export async function getInterviews(jobInfoId: string, userId: string) {
  "use cache";

  cacheTag(getInterviewJobInfoTag(jobInfoId));

  return db
    .select({
      ...getTableColumns(InterviewTable),
    })
    .from(InterviewTable)
    .innerJoin(JobInfoTable, eq(InterviewTable.jobInfoId, JobInfoTable.id))
    .where(
      and(
        eq(InterviewTable.jobInfoId, jobInfoId),
        isNotNull(InterviewTable.humeChatId),
        eq(JobInfoTable.userId, userId)
      )
    );
}

export async function getInterview(id: string, userId: string) {
  "use cache";
  cacheTag(getInterviewIdTag(id));

  const interview = await db
    .select({
      ...getTableColumns(InterviewTable),
      jobInfo: {
        id: JobInfoTable.id,
        userId: JobInfoTable.userId,
        title: JobInfoTable.title,
        experienceLevel: JobInfoTable.experienceLevel,
        description: JobInfoTable.description,
      },
    })
    .from(InterviewTable)
    .innerJoin(JobInfoTable, eq(InterviewTable.jobInfoId, JobInfoTable.id))
    .where(and(eq(InterviewTable.id, id), eq(JobInfoTable.userId, userId)))
    .limit(1)
    .then((res) => res[0]);

  if (!interview) return null;

  cacheTag(getInterviewJobInfoTag(interview.jobInfo.id));

  return interview;
}

export async function insertInterview(
  interview: typeof InterviewTable.$inferInsert
) {
  const [newInterview] = await db
    .insert(InterviewTable)
    .values(interview)
    .returning({ id: InterviewTable.id, jobInfoId: InterviewTable.jobInfoId });

  revalidateInterviewsCache(newInterview);

  return newInterview;
}

export async function updateInterview(
  id: string,
  interview: Partial<typeof InterviewTable.$inferInsert>
) {
  const [newInterview] = await db
    .update(InterviewTable)
    .set(interview)
    .where(eq(InterviewTable.id, id))
    .returning({ id: InterviewTable.id, jobInfoId: InterviewTable.jobInfoId });

  revalidateInterviewsCache(newInterview);

  return newInterview;
}
