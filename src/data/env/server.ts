import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    ARCJET_KEY: z.string().min(1, "ARCJET_KEY is required"),
    CLERK_SECRET_KEY: z.string().min(1, "CLERK_SECRET_KEY is required"),
    DATABASE_URL: z.url(),
  },
  emptyStringAsUndefined: true,
  experimental__runtimeEnv: process.env,
});
