import type z from "zod/v4";
import type { createJobInfoSchema, updateJobInfoSchema } from "./schemas";
import type { JobInfoTable } from "@/drizzle/schema/job-info";

export type CreateJobInfo = z.infer<typeof createJobInfoSchema> & {
  userId: string;
};
export type UpdateJobInfo = z.infer<typeof updateJobInfoSchema>;

export type JobInfo = typeof JobInfoTable.$inferSelect;
