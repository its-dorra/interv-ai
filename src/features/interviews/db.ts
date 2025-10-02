import db from "@/drizzle/db";
import { InterviewTable, JobInfoTable } from "@/drizzle/schema";
import { and, eq, getTableColumns, isNotNull } from "drizzle-orm";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import { getInterviewJobInfoTag } from "./db-cache";

export async function getInterviews(jobInfoId: string, userId: string) {
  "use cache";

  cacheTag(getInterviewJobInfoTag(jobInfoId));

  return db
    .select({ ...getTableColumns(InterviewTable) })
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
