import { getJobInfo } from "@/features/job-infos/db";
import { canRunResumeAnalysis } from "@/features/resume-analysis/permissions";
import { PLAN_LIMIT_MESSAGE } from "@/lib/error-toast";
import { analyzeResumeForJob } from "@/services/ai/resume/ai";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";

import type { NextRequest } from "next/server";
import { z } from "zod/v4";

const Schema = z.object({
  jobInfoId: z.uuid(),
  resume: z
    .file()
    .mime([
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "text/plain",
      "application/msword",
    ])
    .max(10 * 1024 * 1024),
});

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const result = Schema.safeParse(Object.fromEntries(formData.entries()));

  if (!result.success)
    return new Response(
      "Make sure that the file type and job info id are correct",
      { status: 422 }
    );

  const { userId } = await getCurrentUser();

  if (!userId) return new Response("You are not logged in", { status: 401 });

  if (!canRunResumeAnalysis())
    return new Response(PLAN_LIMIT_MESSAGE, {
      status: 403,
    });

  const { resume: resumeFile, jobInfoId } = result.data;

  const jobInfo = await getJobInfo(jobInfoId, userId);

  if (!jobInfo) return new Response("You do not have permission to do this");

  const aiRes = await analyzeResumeForJob({
    resumeFile,
    jobInfo,
  });

  return aiRes.toTextStreamResponse();
}
