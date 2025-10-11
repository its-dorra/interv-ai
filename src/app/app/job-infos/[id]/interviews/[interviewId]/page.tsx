import SuspendedItem from "@/components/suspended-item";
import BackLink from "@/components/back-link";
import { Skeleton } from "@/components/ui/skeleton";
import { notFound } from "next/navigation";
import { getInterview } from "@/features/interviews/db";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { formatDateTime } from "@/lib/formatters";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import MarkdownRenderer from "@/components/markdown-renderer";
import { Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import CondensedMessages from "@/services/hume-ai/components/condensed-messages";
import { condenseChatMessages } from "@/services/hume-ai/lib/condense-messages";
import { fetchChatMessages } from "@/services/hume-ai/lib/api";

export default async function InterviewPage({
  params,
}: PageProps<"/app/job-infos/[id]/interviews/[interviewId]">) {
  const { id: jobInfoId, interviewId } = await params;

  const interview = getCurrentUser().then(
    async ({ userId, redirectToSignIn }) => {
      if (!userId) return redirectToSignIn();

      const interview = await getInterview(interviewId, userId);
      if (!interview || interview.jobInfoId !== jobInfoId) return notFound();

      return interview;
    }
  );

  return (
    <div className="container my-4 space-y-4">
      <BackLink href={`/app/job-infos/${jobInfoId}/interviews`}>
        All Interviews
      </BackLink>
      <div className="space-y-6">
        <div className="flex gap-2 justify-between">
          <div className="space-y-2 mb-6">
            <h1 className="text-3xl md:text-4xl">
              Interviews:{" "}
              <SuspendedItem
                item={interview}
                fallback={<Skeleton className="w-48" />}
                result={(i) => formatDateTime(i.createdAt)}
              />
            </h1>
            <p className="text-muted-foreground">
              <SuspendedItem
                item={interview}
                fallback={<Skeleton className="w-24" />}
                result={(i) => i.duration}
              />
            </p>
          </div>
          <SuspendedItem
            item={interview}
            fallback={<Skeleton className="w-32" />}
            result={(i) =>
              !i.feedback ? null : ( // TODO: generate feedback button
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>View Feedback</Button>
                  </DialogTrigger>
                  <DialogContent className="md:max-w-3xl lg:max-w-4xl max-h-[calc(100% - 2rem)] overflow-y-auto flex flex-col">
                    <DialogTitle>Feedback</DialogTitle>
                    <MarkdownRenderer>{i.feedback}</MarkdownRenderer>
                  </DialogContent>
                </Dialog>
              )
            }
          />
        </div>
        <Suspense
          fallback={<Loader2Icon className="animate-spin size-24 mx-auto" />}
        >
          <Messages interview={interview} />
        </Suspense>
      </div>
    </div>
  );
}

async function Messages({
  interview,
}: {
  interview: Promise<{ humeChatId: string | null }>;
}) {
  const { user, redirectToSignIn } = await getCurrentUser({ allData: true });

  if (!user) return redirectToSignIn();

  const { humeChatId } = await interview;

  if (!humeChatId) return notFound();

  const condensedMessages = condenseChatMessages(
    await fetchChatMessages(humeChatId)
  );

  return (
    <CondensedMessages
      messages={condensedMessages}
      user={user}
      className="max-w-5xl mx-auto"
      maxFft={0}
    />
  );
}
