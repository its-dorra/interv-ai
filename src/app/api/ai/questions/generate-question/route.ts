import { questionDifficulties } from "@/drizzle/schema";
import { getJobInfo } from "@/features/job-infos/db";
import { getQuestions, insertQuestion } from "@/features/questions/db";
import { canCreateQuestion } from "@/features/questions/permissions";
import { PLAN_LIMIT_MESSAGE } from "@/lib/error-toast";
import { generateAiQuestion } from "@/services/ai/questions";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import {
  createUIMessageStream,
  createUIMessageStreamResponse,
  UIMessage,
} from "ai";
import z from "zod";

// const Schema = z.object({
//   prompt: z.enum(questionDifficulties),
//   jobInfoId: z.string().min(1),
// });

export async function POST(req: Request) {
  const { messages, jobInfoId }: { messages: UIMessage[]; jobInfoId: string } =
    await req.json();

  const { userId } = await getCurrentUser();

  if (!userId) return new Response("You are not logged in", { status: 401 });

  if (!(await canCreateQuestion()))
    return new Response(PLAN_LIMIT_MESSAGE, { status: 403 });

  const jobInfo = await getJobInfo(jobInfoId, userId);

  if (!jobInfo)
    return new Response("You do no have permission to to this", {
      status: 403,
    });

  const previousQuestions = await getQuestions(jobInfoId);

  return createUIMessageStreamResponse({
    stream: createUIMessageStream({
      execute: ({ writer }) => {
        const res = generateAiQuestion({
          previousQuestions,
          jobInfo,
          // @ts-expect-error
          difficulty: messages[0].parts[0].text,
          onFinish: async (question) => {
            const { id } = await insertQuestion({
              // @ts-expect-error
              questionDifficulty: messages[0].parts[0].text,
              jobInfoId,
              text: question,
            });

            writer.write({
              type: "message-metadata",
              messageMetadata: { questionId: id },
            });
          },
        });

        writer.merge(res.toUIMessageStream());
      },
    }),
  });
}
