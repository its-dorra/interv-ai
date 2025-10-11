"use server";

import z from "zod";
import { authActionClient } from "@/lib/safe-action";
import { getJobInfo } from "../job-infos/db";
import {
  getInterview,
  insertInterview,
  updateInterview as updateInterviewDb,
} from "./db";
import { canCreateInterview } from "./permissions";
import { PLAN_LIMIT_MESSAGE, RATE_LIMIT_MESSAGE } from "@/lib/error-toast";
import arcjet, { request, tokenBucket } from "@arcjet/next";
import { serverEnv } from "@/data/env/server";

const aj = arcjet({
  characteristics: ["userId"],
  key: serverEnv.ARCJET_KEY,
  rules: [
    tokenBucket({ capacity: 12, refillRate: 4, interval: "1d", mode: "LIVE" }),
  ],
});

export const createInterview = authActionClient
  .inputSchema(z.object({ jobInfoId: z.string().uuid() }))
  .action(async ({ parsedInput: { jobInfoId }, ctx: { userId } }) => {
    if (!(await canCreateInterview())) {
      return {
        success: false,
        error: PLAN_LIMIT_MESSAGE,
        data: null,
      } as const;
    }

    const decision = await aj.protect(await request(), {
      userId,
      requested: 1,
    });

    if (decision.isDenied()) {
      return { success: false, error: RATE_LIMIT_MESSAGE, data: null } as const;
    }

    const exisitngJobInfo = await getJobInfo(jobInfoId, userId);

    if (!exisitngJobInfo) {
      return {
        success: false,
        error: "You are not authorized",
        data: null,
      } as const;
    }

    // create interview in db
    const interview = await insertInterview({
      jobInfoId,
      duration: "00:00:00",
    });

    return {
      success: true,
      error: null,
      data: interview,
    } as const;
  });

export const updateInterview = authActionClient
  .inputSchema(
    z.object({
      humeChatId: z.string().min(1).nullish(),
      duration: z
        .string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$/)
        .nullish(),
    })
  )
  .bindArgsSchemas<[id: z.ZodString]>([z.string().uuid()])
  .action(
    async ({
      parsedInput: { humeChatId, duration },
      bindArgsParsedInputs: [id],
      ctx: { userId },
    }) => {
      const interview = await getInterview(id, userId);

      if (!interview) {
        throw new Error("You are not authorized");
      }

      const updatedInterview = await updateInterviewDb(id, {
        humeChatId,
        duration,
      });

      if (!updatedInterview) {
        throw new Error("Failed to update interview");
      }

      return updatedInterview;
    }
  );
