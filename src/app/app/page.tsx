import { Card, CardContent } from "@/components/ui/card";
import { getJobInfos } from "@/features/job-infos/db";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";

export default async function AppPage() {
  const { userId, redirectToSignIn } = await getCurrentUser({ allData: false });

  if (userId == null) return redirectToSignIn();

  const jobInfos = await getJobInfos(userId);

  if (jobInfos.length === 0) {
    return <NoJobInfos />;
  }

  return <div>Home Page</div>;
}

function NoJobInfos() {
  return (
    <div className="container my-4 max-w-5xl">
      <h1 className="text-3xl md:text-4xl lg:text-5xl mb-4">
        Welcome to Meet AI
      </h1>
      <p className="mb-8 text-muted-foreground">
        To get started, enter information about the type of job you are wanting
        to apply for. This can be specific information copied directly from a
        job listing or general information such as the tech stack you want to
        work in. The more specific you are in the description the closer the
        test interview
      </p>
      <Card>
        <CardContent></CardContent>
      </Card>
    </div>
  );
}
