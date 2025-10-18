import JobInfoBackLink from "@/features/job-infos/components/job-info-back-link";
import ResumePageClient from "@/features/resume-analysis/components/resume-page-client";
import { canRunResumeAnalysis } from "@/features/resume-analysis/permissions";

import { Loader2Icon } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export const metadata = {
  title: "Resume | IntervAI",
  description: "Resume for this job.",
};

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
