import { revalidateTag } from "next/cache";
import { getGlobalTag, getIdTag, getUserTag } from "@/lib/data-cache";
import {
  getJobInfoIdTag,
  getJobInfosGlobalTag,
  getJobInfoUserTag,
} from "../job-infos/db-cache";

export function getInterviewsGlobalTag() {
  return getGlobalTag("interviews");
}

export function getInterviewUserTag(userId: string) {
  return getUserTag("interviews", userId);
}

export function getInterviewIdTag(interviewId: string) {
  return getIdTag("interviews", interviewId);
}

export function revalidateInterviewsCache({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  revalidateTag(getJobInfosGlobalTag());
  revalidateTag(getJobInfoUserTag(userId));
  revalidateTag(getJobInfoIdTag(id));
}
