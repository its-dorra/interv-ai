"use client";

import { Button } from "@/components/ui/button";
import { clientEnv } from "@/data/env/client";
import type { JobInfo } from "@/features/job-infos/types";
import { useVoice, VoiceReadyState } from "@humeai/voice-react";
import { Loader2Icon, MicIcon, MicOffIcon, PhoneOffIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import CondensedMessages from "./condensed-messages";
import { condenseChatMessages } from "../lib/condense-messages";
import {
  createInterview,
  updateInterview,
} from "@/features/interviews/actions";

import { errorToast } from "@/lib/error-toast";
import { useRouter } from "next/navigation";
import { ConsoleLogWriter } from "drizzle-orm";

interface StartCallProps {
  jobInfo: Pick<JobInfo, "id" | "title" | "description" | "experienceLevel">;
  user: { name: string; imageUrl: string };
  accessToken: string;
}

export default function StartCall({
  jobInfo,
  accessToken,
  user,
}: StartCallProps) {
  const router = useRouter();

  const { connect, readyState, chatMetadata, callDurationTimestamp } =
    useVoice();
  const [interviewId, setInterviewId] = useState<string | null>(null);
  const durationRef = useRef(callDurationTimestamp);
  durationRef.current = callDurationTimestamp;

  // Sync chat Id
  useEffect(() => {
    if (!chatMetadata?.chatId || !interviewId) return;

    updateInterview(interviewId, { humeChatId: chatMetadata.chatId });
  }, [chatMetadata?.chatId, interviewId]);

  // Sync duration
  useEffect(() => {
    if (!interviewId) return;

    const interval = setInterval(() => {
      updateInterview(interviewId, { duration: durationRef.current });
    }, 10000);

    return () => clearInterval(interval);
  }, [interviewId]);

  // Handle disconnect
  useEffect(() => {
    if (readyState !== VoiceReadyState.CLOSED || !durationRef.current) return;
    if (!interviewId) {
      return router.push(`/app/job-infos/${jobInfo.id}/interviews`);
    }

    updateInterview(interviewId, { duration: durationRef.current });
    router.push(`/app/job-infos/${jobInfo.id}/interviews/${interviewId}`);
  }, [readyState, router.push, jobInfo.id, interviewId]);

  const handleStartInterview = async () => {
    const res = await createInterview({ jobInfoId: jobInfo.id });

    if (!res.data || !res.data.success) {
      console.log("Interview creation error:", res);
      const errors =
        res.data?.error ||
        res.serverError ||
        res.validationErrors?._errors?.join(", ") ||
        "Unknown error";

      return errorToast(errors);
    }

    setInterviewId(res.data.data.id);

    connect({
      auth: { type: "accessToken", value: accessToken },
      configId: clientEnv.NEXT_PUBLIC_HUME_CONFIG_ID,
      sessionSettings: {
        type: "session_settings",
        variables: {
          userName: user.name,
          title: jobInfo.title || "Not specified",
          description: jobInfo.description,
          experienceLevel: jobInfo.experienceLevel,
        },
      },
    });
  };

  if (readyState === VoiceReadyState.IDLE) {
    return (
      <div className="flex justify-center items-center h-screen-header">
        <Button onClick={handleStartInterview} size="lg">
          Start Interview
        </Button>
      </div>
    );
  }
  if (
    readyState === VoiceReadyState.CONNECTING ||
    readyState === VoiceReadyState.CLOSED
  ) {
    return (
      <div className="container py-4 flex flex-col items-start gap-y-4 h-screen-header">
        <Loader2Icon className="animate-spin size-24 m-auto" />
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-screen-header flex flex-col-reverse">
      <div className="container py-6 flex flex-col gap-4 items-center justify-end">
        <Messages user={user} />
        <Controls />
      </div>
    </div>
  );
}

function Messages({ user }: { user: { name: string; imageUrl: string } }) {
  const { messages, fft } = useVoice();

  const condesnedMessages = useMemo(() => {
    return condenseChatMessages(messages);
  }, [messages]);

  return (
    <CondensedMessages
      messages={condesnedMessages}
      user={user}
      maxFft={Math.max(...fft)}
      className="max-w-5xl"
    />
  );
}

function Controls() {
  const { disconnect, isMuted, mute, unmute, micFft, callDurationTimestamp } =
    useVoice();
  return (
    <div className="flex gap-5 rounded border px-5 py-2 w-fit sticky bottom-6 bg-background items-center">
      <Button
        variant="ghost"
        size="icon"
        className="-mx-3"
        onClick={() => {
          isMuted ? unmute() : mute();
        }}
      >
        {isMuted ? <MicOffIcon className="text-destructive" /> : <MicIcon />}
        <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
      </Button>
      <div className="self-stretch">
        <FftVisualizer fft={micFft} />
      </div>
      <div className="text0sm text-muted-foreground tabular-nums">
        {callDurationTimestamp}
      </div>
      <Button variant="ghost" size="icon" onClick={disconnect}>
        <PhoneOffIcon className="text-destructive" />
        <span className="sr-only">End call</span>
      </Button>
    </div>
  );
}

function FftVisualizer({ fft }: { fft: number[] }) {
  return (
    <div className="flex gap-1 items-center h-full">
      {fft.map((value, index) => {
        const percent = (value / 4) * 100;
        return (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: <>
            key={index}
            className="min-h-0.5 bg-primary/75 w-0.5 rounded"
            style={{ height: `${percent < 10 ? 0 : percent}%` }}
          />
        );
      })}
    </div>
  );
}
