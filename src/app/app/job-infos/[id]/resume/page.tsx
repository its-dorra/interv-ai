import JobInfoBackLink from "@/features/job-infos/components/job-info-back-link";
import { getJobInfo } from "@/features/job-infos/db";

import { canCreateQuestion } from "@/features/questions/permissions";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { Loader2Icon } from "lucide-react";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { setTimeout } from "timers/promises";

export default async function ResumePage({
  params,
}: PageProps<"/app/job-infos/[id]/resume">) {
  const { id: jobInfoId } = await params;

  return (
    <div className="container py-4 gap-y-4 h-screen-header flex flex-col items-start">
      <JobInfoBackLink jobInfoId={jobInfoId} />
      <Suspense
        fallback={<Loader2Icon className="animate-spin size-24 m-auto" />}
      >
        <SuspensedPage jobInfoId={jobInfoId} />
      </Suspense>
    </div>
  );
}

async function SuspensedPage({ jobInfoId }: { jobInfoId: string }) {
  if (!(await canRunResumeAnalysis())) return redirect("/app/upgrade");

  return <ResumePageClient jobInfoId={jobInfoId} />;
}
