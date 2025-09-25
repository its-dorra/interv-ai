import { experienceLevels, JobInfoTable } from "@/drizzle/schema";
import { z } from "zod";
import { createInsertSchema, createUpdateSchema } from "drizzle-zod";

export const JobInfoSchema = z.object({
  name: z.string().nonempty("Required"),
  title: z.string().nullable(),
  experienceLevel: z.enum(experienceLevels),
  description: z.string().nonempty("Required"),
});

export const createJobInfoSchema = createInsertSchema(JobInfoTable).omit({
  createdAt: true,
  updatedAt: true,
  id: true,
  userId: true,
});

export const updateJobInfoSchema = createUpdateSchema(JobInfoTable)
  .required({ id: true })
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    userId: true,
  });
