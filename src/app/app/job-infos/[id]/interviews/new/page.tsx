import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { getJobInfo } from "@/features/job-infos/db";
import { notFound, redirect } from "next/navigation";
import { serverEnv } from "@/data/env/server";
import { fetchAccessToken } from "hume";
import { VoiceProvider } from "@humeai/voice-react";
import StartCall from "@/services/hume-ai/components/start-call";
import { canCreateInterview } from "@/features/interviews/permissions";

export const metadata = {
  title: "New Interview | IntervAI",
  description: "Create a new interview.",
};

export default async function NewInterviewPage({
  params,
}: PageProps<"/app/job-infos/[id]/interviews">) {
  const { id: jobInfoId } = await params;

  return (
    <Suspense
      fallback={
        <div className="container py-4 flex flex-col items-start gap-y-4 h-screen-header">
          <Loader2Icon className="animate-spin size-24 m-auto" />
        </div>
      }
    >
      <SuspendedPage jobInfoId={jobInfoId} />
    </Suspense>
  );
}

async function SuspendedPage({ jobInfoId }: { jobInfoId: string }) {
  const { userId, redirectToSignIn, user } = await getCurrentUser({
    allData: true,
  });

  if (!userId || !user) return redirectToSignIn();

  if (!(await canCreateInterview())) return redirect("/app/upgrade");

  const jobInfo = await getJobInfo(jobInfoId, userId);

  if (!jobInfo) return notFound();

  const accessToken = await fetchAccessToken({
    apiKey: serverEnv.HUME_API_KEY,
    secretKey: serverEnv.HUME_SECRET_KEY,
  });

  return (
    <VoiceProvider>
      <StartCall jobInfo={jobInfo} user={user} accessToken={accessToken} />
    </VoiceProvider>
  );
}
