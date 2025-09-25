"use server";

import { authActionClient } from "@/lib/safe-action";
import { createJobInfoSchema, updateJobInfoSchema } from "./schemas";
import { getExistingJobInfo, insertJobInfo, updateJobInfo } from "./db";
import { redirect } from "next/navigation";
import z from "zod";

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
      const existingJobInfo = await getExistingJobInfo(id, userId);

      if (!existingJobInfo) {
        throw new Error("You are not authorized");
      }

      const jobInfo = await updateJobInfo(parsedInput);

      redirect(`/app/job-infos/${jobInfo.id}`);
    },
  );
