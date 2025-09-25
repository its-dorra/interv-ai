import { createSafeActionClient } from "next-safe-action";
import { getCurrentUser } from "@/services/clerk/lib/get-current-user";

export const actionClient = createSafeActionClient({
  defaultValidationErrorsShape: "formatted",
});

export const authActionClient = actionClient.use(async ({ next }) => {
  const { userId } = await getCurrentUser({ allData: false });

  if (!userId) {
    throw new Error("Unauthorized");
  }

  return next({ ctx: { userId } });
});
