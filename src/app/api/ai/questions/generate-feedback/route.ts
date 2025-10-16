import { getQuestion } from "@/features/questions/db";
import { generateAiQuestionFeedback } from "@/services/ai/questions";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { NextRequest } from "next/server";
import z from "zod";

const Schema = z.object({
  prompt: z.string().min(1),
  questionId: z.string().uuid(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();

  const result = Schema.safeParse(body);

  if (!result.success)
    return new Response("Error getting your feedback", { status: 400 });

  const { userId } = await getCurrentUser();

  if (!userId) return new Response("You are not logged in", { status: 401 });
  const { prompt: answer, questionId } = result.data;

  const question = await getQuestion(questionId, userId);

  if (!question)
    return new Response("You do not have permission to do this", {
      status: 403,
    });

  const res = generateAiQuestionFeedback({
    question: question.text,
    answer,
  });

  return res.toUIMessageStreamResponse();
}
