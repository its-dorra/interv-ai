import type { ExperienceLevel } from "@/drizzle/schema";

export const formatExperienceLevel = (level: ExperienceLevel) => {
  switch (level) {
    case "junior":
      return "Junior";
    case "mid-level":
      return "Mid-level";
    case "senior":
      return "Senior";
    default:
      throw new Error(`Unknown experience level: ${level as never}`);
  }
};
