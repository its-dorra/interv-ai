import { pgEnum, uuid, varchar } from "drizzle-orm/pg-core";
import { createdAt, id, pgTable, updatedAt } from "../schema-helpers";
import { relations } from "drizzle-orm";
import { JobInfoTable } from "./job-info";

export const questionDifficulties = ["east", "medium", "hard"] as const;
export type QuestionDifficulty = (typeof questionDifficulties)[number];
export const questionDifficultyEnum = pgEnum(
  "questions_question_difficulty",
  questionDifficulties,
);

export const QuestionTable = pgTable("questions", {
  id,
  title: varchar(),
  text: varchar().notNull(),
  questionDifficulty: questionDifficultyEnum().notNull(),
  description: varchar().notNull(),
  jobInfoId: uuid()
    .references(() => JobInfoTable.id, { onDelete: "cascade" })
    .notNull(),
  createdAt,
  updatedAt,
});

export const questionRelations = relations(QuestionTable, ({ one }) => ({
  jobInfo: one(JobInfoTable, {
    fields: [QuestionTable.jobInfoId],
    references: [JobInfoTable.id],
  }),
}));
