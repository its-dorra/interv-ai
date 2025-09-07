import { redirect } from "next/navigation";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";
import Navbar from "./_navbar";

export default async function OnboardingPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId, user } = await getCurrentUser({ allData: true });

  if (!userId) {
    redirect("/");
  }

  if (user == null) {
    redirect("/onboarding");
  }

  return (
    <>
      <Navbar user={user} />
      {children}
    </>
  );
}
