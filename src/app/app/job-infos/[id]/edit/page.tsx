import { Card, CardContent } from "@/components/ui/card";
import JobInfoBackLink from "@/features/job-infos/components/job-info-back-link";
import JobInfoForm from "@/features/job-infos/components/job-info-form";
import { jobInfoPromise } from "../page";
import SuspendedItem from "@/components/suspended-item";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Edit Job Info | IntervAI",
  description: "Edit job information.",
};

export default async function JobInfoNewPage({
  params,
}: PageProps<"/app/job-infos/[id]/edit">) {
  const { id: jobInfoId } = await params;

  const jobInfo = jobInfoPromise(jobInfoId);

  return (
    <div className="container my-4 max-w-5xl space-y-8">
      <JobInfoBackLink jobInfoId={jobInfoId} />

      <h1 className="text-3xl md:text-4xl">Edit Job Description</h1>

      <Card>
        <CardContent>
          <SuspendedItem
            fallback={<Loader2 className="size-24 animate-spin mx-auto" />}
            item={jobInfo}
            result={(jobInfo) => <JobInfoForm jobInfo={jobInfo} />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
