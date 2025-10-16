import db from "@/drizzle/db";
import { cacheTag } from "next/dist/server/use-cache/cache-tag";
import {
  getQuestionIdTag,
  getQuestionJobInfoTag,
  revalidateQuestionsCache,
} from "./db-cache";
import { QuestionTable } from "@/drizzle/schema";
import { getJobInfoIdTag } from "../job-infos/db-cache";

export const getQuestions = async (jobInfoId: string) => {
  "use cache";

  cacheTag(getQuestionJobInfoTag(jobInfoId));

  return db.query.QuestionTable.findMany({
    where: (fields, { eq }) => eq(fields.jobInfoId, jobInfoId),
    orderBy: (fields, { asc }) => asc(fields.createdAt),
  });
};

export const getQuestion = async (id: string, userId: string) => {
  "use cache";

  cacheTag(getQuestionIdTag(id));

  const question = await db.query.QuestionTable.findFirst({
    where: (fields, { eq }) => eq(fields.id, id),
    with: {
      jobInfo: { columns: { id: true, userId: true } },
    },
  });

  if (!question || question.jobInfo.userId !== userId) return null;

  cacheTag(getJobInfoIdTag(question.jobInfo.id));

  return question;
};

export const insertQuestion = async (
  question: typeof QuestionTable.$inferInsert
) => {
  const [newQuestion] = await db
    .insert(QuestionTable)
    .values(question)
    .returning({
      id: QuestionTable.id,
      jobInfoId: QuestionTable.jobInfoId,
    });

  revalidateQuestionsCache(newQuestion);

  return newQuestion;
};
