import { revalidateTag } from "next/cache";
import { getGlobalTag, getIdTag, getJobInfoTag } from "@/lib/data-cache";
import { getJobInfoIdTag, getJobInfosGlobalTag } from "../job-infos/db-cache";

export function getInterviewsGlobalTag() {
  return getGlobalTag("interviews");
}

export function getInterviewJobInfoTag(jobInfoId: string) {
  return getJobInfoTag("interviews", jobInfoId);
}

export function getInterviewIdTag(interviewId: string) {
  return getIdTag("interviews", interviewId);
}

export function revalidateInterviewsCache({
  id,
  jobInfoId,
}: {
  id: string;

  jobInfoId: string;
}) {
  revalidateTag(getJobInfosGlobalTag());
  revalidateTag(getInterviewJobInfoTag(jobInfoId));
  revalidateTag(getJobInfoIdTag(id));
}
