import { z } from "zod";

export const CategorySchema = z.object({
  score: z.number().min(1).max(10).describe("Score of the category from 1-10"),
  summary: z.string().describe("Short summary of the category"),
  feedback: z
    .array(
      z.object({
        type: z.enum(["strength", "minor-improvement", "major-improvement"]),
        name: z.string().describe("Name of the feedback"),
        message: z.string().describe("Description of the feedback"),
      })
    )
    .describe("Specific feedback on positives and negatives"),
});

export const AiAnalyzeSchema = z.object({
  overallScore: z
    .number()
    .min(1)
    .max(10)
    .describe("Overall score of the resume"),
  ats: CategorySchema.describe(
    "Analysis of how well the resume matches ATS requirements"
  ),
  jobMatch: CategorySchema.describe(
    "Analysis of how well the resume matches the job requirements"
  ),
  writingAndFormating: CategorySchema.describe(
    "Analysis if the writing quality and formatting of the resume (taking into account the job requirements)"
  ),
  keywordCoverage: CategorySchema.describe(
    "Analysis of the keyword coverage in the resume (taking into account the job requirements)"
  ),
  other: CategorySchema.describe(
    "Any other relevant analysis not covered by the above categories"
  ),
});
