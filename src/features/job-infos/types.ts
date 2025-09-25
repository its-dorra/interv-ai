import type z from "zod/v4";
import type { createJobInfoSchema, updateJobInfoSchema } from "./schemas";

export type CreateJobInfo = z.infer<typeof createJobInfoSchema> & {
  userId: string;
};
export type UpdateJobInfo = z.infer<typeof updateJobInfoSchema>;
