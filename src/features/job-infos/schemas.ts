import { experienceLevels } from "@/drizzle/schema";
import { z } from "zod";

export const JobInfoSchema = z.object({
  name: z.string().nonempty("Required"),
  jobTitle: z.string().min(1).optional(),
  experienceLevel: z.enum(experienceLevels),
  description: z.string().nonempty("Required"),
});
