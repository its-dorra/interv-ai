"use client";

import BackLink from "@/components/back-link";
import MarkdownRenderer from "@/components/markdown-renderer";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  questionDifficulties,
  type QuestionDifficulty,
} from "@/drizzle/schema";
import type { JobInfo } from "@/features/job-infos/types";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { useChat, useCompletion } from "@ai-sdk/react";
import { errorToast } from "@/lib/error-toast";
import { DefaultChatTransport } from "ai";
import z from "zod";

type Status = "awaiting-answer" | "awaiting-difficulty" | "init";

export default function NewQuestionClientPage({
  jobInfo,
}: {
  jobInfo: JobInfo;
}) {
  const [answer, setAnswer] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>("init");

  // TODO: implement it
  const [questionId, setQuestionId] = useState<string | null>(null);

  const {
    status: questionStatus,
    sendMessage: generateQuestion,
    messages: questionMessages,
    setMessages: setQuestion,
  } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/ai/questions/generate-question",
    }),
    onFinish: ({ messages }) => {
      for (const m of messages) {
        const item = m.metadata;

        if (!item) continue;

        const parsedItem = z
          .object({ quesitonId: z.string().uuid() })
          .safeParse(item);

        if (!parsedItem.success) continue;

        setQuestionId(parsedItem.data.quesitonId);
        break;
      }

      setStatus("awaiting-answer");
    },
    onError: (err) => {
      errorToast(err.message);
    },
  });

  const isGeneratingQuestion =
    questionStatus === "streaming" || questionStatus === "submitted";

  const question =
    questionMessages
      .flatMap((message) => message.parts)
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .slice(1)
      .join("") || null;

  const {
    isLoading: isGeneratingFeedback,
    complete: generateFeedback,
    completion: feedback,
    setCompletion: setFeedback,
  } = useCompletion({
    api: "/api/ai/questions/generate-feedback",
    onFinish: () => {
      setStatus("awaiting-difficulty");
    },
    onError: (err) => {
      errorToast(err.message);
    },
  });

  return (
    <div className="flex flex-col items-center gap-4 w-full max-w-[2000px] mx-auto grow h-screen-header">
      <div className="container flex gap-4 mt-4 items-center justify-between">
        <div className="grow basis-0 ">
          <BackLink href={`/app/job-infos/${jobInfo.id}`}>
            {jobInfo.name}
          </BackLink>
        </div>
        <Controls
          disableAnswerButton={!answer?.trim() || !questionId}
          reset={() => {
            setStatus("init");
            setQuestion([]);
            setFeedback("");
            setAnswer(null);
          }}
          isLoading={isGeneratingQuestion || isGeneratingFeedback}
          status={status}
          generateQuestion={(difficulty) => {
            setQuestion([]);
            setFeedback("");
            setAnswer(null);

            generateQuestion(
              { text: difficulty },
              { body: { jobInfoId: jobInfo.id } }
            );
          }}
          generateFeedback={() => {
            if (!answer?.trim() || !questionId) return;

            generateFeedback(answer.trim(), {
              body: { questionId },
            });
          }}
        />
        <div className="grow hidden md:block" />
      </div>
      <QuestionContainer
        answer={answer}
        feedback={feedback}
        question={question}
        setAnswer={setAnswer}
        status={status}
      />
    </div>
  );
}

function QuestionContainer({
  question,
  feedback,
  answer,
  status,
  setAnswer,
}: {
  question: string | null;
  feedback: string | null;
  answer: string | null;
  status: Status;
  setAnswer: (value: string) => void;
}) {
  return (
    <ResizablePanelGroup direction="horizontal" className="grow border-t">
      <ResizablePanel id="question-and-feedback" defaultSize={50} minSize={10}>
        <ResizablePanelGroup direction="vertical" className="grow">
          <ResizablePanel id="question" defaultSize={25} minSize={10}>
            <ScrollArea className="h-full min-w-48 *:h-full">
              {status === "init" && !question ? (
                <p className="text-base md:text-lg flex items-center justify-center h-full p-6">
                  Get started by selecting a question difficulty above.
                </p>
              ) : (
                question && (
                  <MarkdownRenderer className="p-6">
                    {question}
                  </MarkdownRenderer>
                )
              )}
            </ScrollArea>
          </ResizablePanel>
          {feedback && (
            <>
              <ResizableHandle withHandle />

              <ResizablePanel id="feedback" defaultSize={75} minSize={10}>
                <ScrollArea className="h-full min-w-48 *:h-full">
                  <MarkdownRenderer className="p-6">
                    {feedback}
                  </MarkdownRenderer>
                </ScrollArea>
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="answer" defaultSize={50} minSize={10}>
        <ScrollArea className="h-full min-w-48 *:h-full">
          <Textarea
            value={answer ?? ""}
            onChange={(e) => setAnswer(e.target.value)}
            disabled={status !== "awaiting-answer"}
            placeholder="Type your answer here..."
            className="w-full h-full resize-none rounded-none focus-visible:ring focus-visible:ring-inset !text-base p-6"
          />
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function Controls({
  disableAnswerButton,
  status,
  isLoading,
  generateQuestion,
  generateFeedback,
  reset,
}: {
  disableAnswerButton: boolean;
  status: Status;
  isLoading: boolean;
  generateQuestion: (difficulty: QuestionDifficulty) => void;
  generateFeedback: () => void;
  reset: () => void;
}) {
  return (
    <div className="flex gap-2">
      {status === "awaiting-answer" ? (
        <>
          <Button
            disabled={isLoading}
            onClick={reset}
            size="sm"
            variant={"outline"}
          >
            {isLoading ? (
              <Loader2Icon className="size-6 animate-spin" />
            ) : (
              "Skip"
            )}
          </Button>
          <Button
            disabled={disableAnswerButton}
            onClick={generateFeedback}
            size="sm"
          >
            {isLoading ? (
              <Loader2Icon className="size-6 animate-spin" />
            ) : (
              "Answer"
            )}
          </Button>
        </>
      ) : (
        questionDifficulties.map((diff) => (
          <Button
            key={diff}
            size="sm"
            disabled={isLoading}
            onClick={() => {
              generateQuestion(diff);
            }}
          >
            {!isLoading ? (
              diff.charAt(0).toUpperCase() + diff.slice(1)
            ) : (
              <Loader2Icon className="size-6 animate-spin" />
            )}
          </Button>
        ))
      )}
    </div>
  );
}
