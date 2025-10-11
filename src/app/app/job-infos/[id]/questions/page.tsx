import { getJobInfo } from "@/features/job-infos/db";
import NewQuestionClientPage from "@/features/questions/components/new-question-client-page";
import { canCreateQuestion } from "@/features/questions/permissions";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { Loader2Icon } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

export default async function QuestionsPage({
  params,
}: PageProps<"/app/job-infos/[id]/questions">) {
  const { id: jobInfoId } = await params;

  return (
    <Suspense
      fallback={
        <div className="h-screen-header flex items-center justify-center">
          <Loader2Icon className="animate-spin size-24" />
        </div>
      }
    >
      <SuspensedPage jobInfoId={jobInfoId} />
    </Suspense>
  );
}

async function SuspensedPage({ jobInfoId }: { jobInfoId: string }) {
  const { userId, redirectToSignIn } = await getCurrentUser();

  if (!userId) return redirectToSignIn();

  if (!(await canCreateQuestion())) return redirect("/app/upgrade");

  const jobInfo = await getJobInfo(jobInfoId, userId);

  if (!jobInfo) return notFound();

  return <NewQuestionClientPage jobInfo={jobInfo} />;
}
