import BackLink from "@/components/back-link";
import SuspendedItem from "@/components/suspended-item";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getJobInfo } from "@/features/job-infos/db";
import { formatExperienceLevel } from "@/features/job-infos/lib/formatters";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

const options = [
  {
    label: "Answer Technical Questions",
    description:
      "Challenge yourself with practice questions tailored to your job description.",
    href: "question",
  },
  {
    label: "Practice Interviewing",
    description: "Simulate a real interview with AI-powered mock interviews.",
    href: "interviews",
  },
  {
    label: "Refine Your Resume",
    description:
      "Get expert feedback on your resume and improve your chances of landing an interview.",
    href: "resume",
  },
  {
    label: "Update Job Description",
    description: "This should only be used for minor updates.",
    href: "edit",
  },
] as const;

export const jobInfoPromise = (jobInfoId: string) =>
  getCurrentUser().then(async ({ userId, redirectToSignIn }) => {
    if (!userId) return redirectToSignIn();

    const jobInfo = await getJobInfo(jobInfoId, userId);
    if (!jobInfo) return notFound();

    return jobInfo;
  });
export default async function JobInfoPage({
  params,
}: PageProps<"/app/job-infos/[id]">) {
  const { id: jobInfoId } = await params;

  const jobInfo = jobInfoPromise(jobInfoId);

  return (
    <div className="container my-4 space-y-4">
      <BackLink href="/app">Dashboard</BackLink>
      <div className="space-y-6">
        <header className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl">
              {
                <SuspendedItem
                  fallback={<Skeleton className="h-8 w-3/4" />}
                  item={jobInfo}
                  result={(j) => j.name}
                />
              }
            </h1>
            <p className="flex gap-2">
              <SuspendedItem
                fallback={<Skeleton className="h-6 w-12" />}
                item={jobInfo}
                result={(j) => (
                  <Badge variant="secondary">
                    {formatExperienceLevel(j.experienceLevel)}
                  </Badge>
                )}
              />

              <SuspendedItem
                item={jobInfo}
                fallback={null}
                result={(j) =>
                  j.title && <Badge variant="secondary">{j.title}</Badge>
                }
              />
            </p>
          </div>
          <div className="text-muted-foreground line-clamp-3">
            <SuspendedItem
              fallback={<Skeleton className="h-6 w-full line-clamp-3" />}
              item={jobInfo}
              result={(j) => j.description}
            />
          </div>
        </header>
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 has-hover:*:not-hover:opacity-70">
          {options.map((option) => (
            <Link
              className="hover:scale-[1.02] transition-[transform_opacity]"
              href={`/app/job-infos/${jobInfoId}/${option.href}`}
              key={option.href}
            >
              <Card className="h-full flex items-start justify-between flex-row">
                <CardHeader className="grow">
                  <CardTitle>{option.label}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <ArrowRightIcon className="size-6" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
