import { uuid, varchar } from "drizzle-orm/pg-core";
import { id, createdAt, pgTable, updatedAt } from "../schema-helpers";
import { JobInfoTable } from "./job-info";
import { relations } from "drizzle-orm/relations";

export const InterviewTable = pgTable("interview", {
  id,
  jobInfoId: uuid()
    .references(() => JobInfoTable.id)
    .notNull(),
  duration: varchar().notNull(),
  humeChatId: varchar(),
  feedback: varchar(),

  createdAt,
  updatedAt,
});

export const interviewRelations = relations(InterviewTable, ({ one }) => ({
  jobInfo: one(JobInfoTable, {
    fields: [InterviewTable.jobInfoId],
    references: [JobInfoTable.id],
  }),
}));
