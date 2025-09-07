import { getIdTag, getGlobalTag, getUserTag } from "@/lib/data-cache";
import { revalidateTag } from "next/cache";

export function getJobInfosGlobalTag() {
  return getGlobalTag("jobInfos");
}

export function getJobInfoUserTag(userId: string) {
  return getUserTag("jobInfos", userId);
}

export function getJobInfoIdTag(jobInfoId: string) {
  return getIdTag("jobInfos", jobInfoId);
}

export function revalidateJobInfosCache({
  jobInfoId,
  userId,
}: {
  jobInfoId: string;
  userId: string;
}) {
  revalidateTag(getJobInfosGlobalTag());
  revalidateTag(getJobInfoUserTag(userId));
  revalidateTag(getJobInfoIdTag(jobInfoId));
}
