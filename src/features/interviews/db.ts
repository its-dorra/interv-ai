import { cacheTag } from "next/dist/server/use-cache/cache-tag";

export async function getInterviews(jobInfoId: string, userId: string) {
  "use cache";

  cacheTag(getInterview);
}
