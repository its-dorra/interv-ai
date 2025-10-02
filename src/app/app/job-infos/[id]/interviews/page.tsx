import SuspendedItem from "@/components/suspended-item";
import JobInfoBackLink from "@/features/job-infos/components/job-info-back-link";
import { Loader2 } from "lucide-react";
import { setTimeout } from "timers/promises";

export default async function InterviewPage({
  params,
}: PageProps<"/app/job-infos/[id]/interviews">) {
  const { id: jobInfoId } = await params;

  return (
    <div className="container py-4 flex flex-col items-start gap-y-4 h-screen-header">
      <JobInfoBackLink jobInfoId={jobInfoId} />

      <SuspendedItem
        fallback={<Loader2 className="animate-spin size-24 m-auto" />}
        item={setTimeout(2000)}
        result={() => <div>Interviews for job info id : {jobInfoId}</div>}
      />
    </div>
  );
}
