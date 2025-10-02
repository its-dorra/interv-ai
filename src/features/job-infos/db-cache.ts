import { revalidateTag } from "next/cache";
import { getGlobalTag, getIdTag, getUserTag } from "@/lib/data-cache";

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
