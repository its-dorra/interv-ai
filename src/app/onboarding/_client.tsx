"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2Icon } from "lucide-react";
import { getUser } from "@/features/users/actions";

export function OnboardingClient({ userId }: { userId: string }) {
  const router = useRouter();
  console.log("OnboardingClient", { userId });
  useEffect(() => {
    const intervalId = setInterval(async () => {
      const user = await getUser(userId);
      if (!user) return;
      router.replace("/app");
      clearInterval(intervalId);
    }, 300);

    return () => clearInterval(intervalId);
  }, [userId, router.replace]);

  return <Loader2Icon className="animate-spin size-24" />;
}
