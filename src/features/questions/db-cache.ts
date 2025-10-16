import { revalidateTag } from "next/cache";
import { getGlobalTag, getIdTag, getJobInfoTag } from "@/lib/data-cache";
import { getJobInfoIdTag, getJobInfosGlobalTag } from "../job-infos/db-cache";

export function getQuestionsGlobalTag() {
  return getGlobalTag("questions");
}

export function getQuestionJobInfoTag(jobInfoId: string) {
  return getJobInfoTag("questions", jobInfoId);
}

export function getQuestionIdTag(questionId: string) {
  return getIdTag("questions", questionId);
}

export function revalidateQuestionsCache({
  id,
  jobInfoId,
}: {
  id: string;

  jobInfoId: string;
}) {
  revalidateTag(getJobInfosGlobalTag());
  revalidateTag(getQuestionJobInfoTag(jobInfoId));
  revalidateTag(getJobInfoIdTag(id));
}
