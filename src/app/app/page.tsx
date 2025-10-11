import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import JobInfoForm from "@/features/job-infos/components/job-info-form";
import { getJobInfos } from "@/features/job-infos/db";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { ArrowRightIcon, PlusIcon } from "lucide-react";
import { formatExperienceLevel } from "@/features/job-infos/lib/formatters";

export default async function AppPage() {
  const { userId, redirectToSignIn } = await getCurrentUser({ allData: false });

  if (!userId) return redirectToSignIn();

  const jobInfos = await getJobInfos(userId);

  if (jobInfos.length === 0) {
    return <NoJobInfos />;
  }

  return (
    <div className="container my-4">
      <div className="flex gap-2 justify-between mb-6">
        <h1 className="text-3xl md:text-4xl lg:text-5xl">
          Select a job description
        </h1>
        <Button asChild>
          <Link href="/app/job-infos/new">
            <PlusIcon />
            Create Job Description
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 has-hover:*:not-hover:opacity-70">
        {jobInfos.map((jobInfo) => (
          <Link
            className="hover:scale-[1.02] transition-[transform_opacity]"
            href={`/app/job-infos/${jobInfo.id}`}
            key={jobInfo.id}
          >
            <Card className="h-full">
              <div className="flex items-center justify-between h-full">
                <div className="space-y-4 h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{jobInfo.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-muted-foreground line-clamp-3">
                    {jobInfo.description}
                  </CardContent>
                  <CardFooter className="flex gap-2 flex-wrap">
                    <Badge variant="outline">
                      {formatExperienceLevel(jobInfo.experienceLevel)}
                    </Badge>
                    {jobInfo.title && (
                      <Badge variant="outline">{jobInfo.title}</Badge>
                    )}
                  </CardFooter>
                </div>
                <CardContent>
                  <ArrowRightIcon className="size-6" />
                </CardContent>
              </div>
            </Card>
          </Link>
        ))}
        <Link className="transition-opacity" href="/app/job-infos/new">
          <Card className="h-full flex items-center justify-center border-dashed border-3 bg-transparent hover:border-primary/50 transition-colors shadow-none">
            <div className="text-lg flex items-center gap-2">
              <PlusIcon className="size-6" />
              New Job Description
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

function NoJobInfos() {
  return (
    <div className="container my-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">
        Welcome to IntervAI
      </h1>
      <p className="mb-8 text-muted-foreground">
        To get started, enter information about the type of job you are wanting
        to apply for. This can be specific information copied directly from a
        job listing or general information such as the tech stack you want to
        work in. The more specific you are in the description the closer the
        test interview
      </p>
      <Card>
        <CardContent>
          <JobInfoForm />
        </CardContent>
      </Card>
    </div>
  );
}
