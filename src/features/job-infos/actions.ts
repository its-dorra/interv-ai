"use server";

import z from "zod";
import { redirect } from "next/navigation";
import { getJobInfo, insertJobInfo, updateJobInfo } from "./db";
import { createJobInfoSchema, updateJobInfoSchema } from "./schemas";
import { authActionClient } from "@/lib/safe-action";

export const createJobInfoAction = authActionClient
  .inputSchema(createJobInfoSchema)
  .action(async ({ parsedInput, ctx: { userId } }) => {
    const jobInfo = await insertJobInfo({ ...parsedInput, userId });

    redirect(`/app/job-infos/${jobInfo.id}`);
  });

export const updateJobInfoAction = authActionClient
  .inputSchema(updateJobInfoSchema)
  .bindArgsSchemas<[id: z.ZodString]>([z.string().uuid()])
  .action(
    async ({ parsedInput, ctx: { userId }, bindArgsParsedInputs: [id] }) => {
      const existingJobInfo = await getJobInfo(id, userId);

      if (!existingJobInfo) {
        throw new Error("You are not authorized");
      }

      const jobInfo = await updateJobInfo(id, parsedInput);

      redirect(`/app/job-infos/${jobInfo.id}`);
    }
  );
