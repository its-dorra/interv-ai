import BackLink from "@/components/back-link";
import db from "@/drizzle/db";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { Suspense } from "react";
import { getJobInfo } from "../db";
import { notFound } from "next/navigation";
import SuspendedItem from "@/components/suspended-item";

export default function JobInfoBackLink({
  jobInfoId,
  className,
}: {
  jobInfoId: string;
  className?: string;
}) {
  const jobInfo = getCurrentUser().then(
    async ({ userId, redirectToSignIn }) => {
      if (!userId) return redirectToSignIn();

      const jobInfo = await getJobInfo(jobInfoId, userId);
      if (!jobInfo) return notFound();
      return jobInfo;
    }
  );

  return (
    <BackLink
      className={cn("mb-4", className)}
      href={`/app/job-infos/${jobInfoId}`}
    >
      <SuspendedItem
        fallback="Job Description"
        item={jobInfo}
        result={(j) => j.name}
      />
    </BackLink>
  );
}
