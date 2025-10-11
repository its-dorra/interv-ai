import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import { redirect } from "next/navigation";
import { OnboardingClient } from "./_client";

export default async function OnboardingPage() {
  const { userId, user } = await getCurrentUser({ allData: true });

  console.log({ userId, user });

  if (!userId) {
    redirect("/");
  }

  if (user) {
    redirect("/app");
  }

  return (
    <div className="h-dvh container flex items-center justify-center gap-4">
      <h1 className="text-4xl">Creating your account ....</h1>
      <OnboardingClient userId={userId} />
    </div>
  );
}
