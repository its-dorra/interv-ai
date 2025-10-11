import { auth } from "@clerk/nextjs/server";

type Permission =
  | "umlimited_resume_analysis"
  | "unlimited_interviews"
  | "unlimited_quesitons"
  | "1_interview"
  | "5_questions";

export async function hasPermission(permission: Permission) {
  const { has } = await auth();

  return has({ feature: permission });
}
