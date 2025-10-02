import { getInterviews } from "@/features/interviews/db";
import JobInfoBackLink from "@/features/job-infos/components/job-info-back-link";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { Loader2 } from "lucide-react";
import { Suspense } from "react";

export default async function InterviewPage({
  params,
}: PageProps<"/app/job-infos/[id]/interviews">) {
  const { id: jobInfoId } = await params;

  return (
    <div className="container py-4 flex flex-col items-start gap-y-4 h-screen-header">
      <JobInfoBackLink jobInfoId={jobInfoId} />

      <Suspense fallback={<Loader2 className="animate-spin size-24 m-auto" />}>
        <SuspendedPage jobInfoId={jobInfoId} />
      </Suspense>
    </div>
  );
}

async function SuspendedPage({ jobInfoId }: { jobInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser();

  if (!userId) return redirectToSignIn();

  const interviews = await getInterviews(jobInfoId, userId);

  return null;
}
