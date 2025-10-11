import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getInterviews } from "@/features/interviews/db";
import JobInfoBackLink from "@/features/job-infos/components/job-info-back-link";
import { formatDateTime } from "@/lib/formatters";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { ArrowRightIcon, Loader2, PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
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

  if (interviews.length === 0)
    return redirect(`/app/job-infos/${jobInfoId}/interviews/new`);

  return (
    <div className="space-y-6 w-full">
      <div className="flex gap-2 justify-between">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">Interviews</h1>
        <Button asChild>
          <Link href={`/app/job-infos/${jobInfoId}/interviews/new`}>
            <PlusIcon />
            <span>New Interview</span>
          </Link>
        </Button>
      </div>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 has-hover:*:not-hover:opacity-70">
        <Link
          className="transition-opacity"
          href={`/app/job-infos/${jobInfoId}/interviews/new`}
        >
          <Card className="h-full flex items-center justify-center border-dashed bg-transparent hover:border-primary/50 transition-colors shadow-none">
            <div className="flex items-center gap-2 text-lg">
              <PlusIcon className="size-6" />
              <span>New Interview</span>
            </div>
          </Card>
        </Link>
        {interviews.map((interview) => (
          <Link
            className="hover:scale-[1.02] transition-[transform_opacity]"
            href={`/app/job-infos/${jobInfoId}/interviews/${interview.id}`}
            key={interview.id}
          >
            <Card className="h-full">
              <div className="flex items-center justify-between h-full">
                <CardHeader className="gap-1 grow">
                  <CardTitle className="text-lg">
                    {formatDateTime(interview.createdAt)}
                  </CardTitle>
                  <CardDescription>{interview.duration}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ArrowRightIcon className="size-6" />
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
