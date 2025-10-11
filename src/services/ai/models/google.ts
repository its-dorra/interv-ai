import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { serverEnv } from "@/data/env/server";

export const google = createGoogleGenerativeAI({
  apiKey: serverEnv.GEMINI_API_KEY,
});
