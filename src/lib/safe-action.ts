import { createSafeActionClient } from "next-safe-action";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "formatted",
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const { userId, user, redirectToSignIn } = await getCurrentUser({
    allData: true,
  });

  if (!userId || !user) {
    return redirectToSignIn();
  }

  return next({ ctx: { userId, user } });
});
