import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./_client";

export default async function OnboardingPage() {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (!userId) {
    redirect("/");
  }

  if (user !== null) {
    redirect("/app");
  }

  return (
    <div className="h-dvh container flex items-center justify-center gap-4">
      <h1 className="text-4xl">Creating your account ....</h1>
      <OnboardingClient userId={userId} />
    </div>
  );
}
