"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2Icon, UploadIcon } from "lucide-react";
import { type ReactNode, useRef, useState } from "react";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { toast } from "sonner";
import { AiAnalyzeSchema } from "@/services/ai/resume/schema";
import type z from "zod";
import type { DeepPartial } from "ai";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function ResumePageClient({ jobInfoId }: { jobInfoId: string }) {
  const [isDragOver, setIsDragOver] = useState(false);

  const fileRef = useRef<File | null>(null);

  const {
    object: aiAnalysis,
    isLoading,
    submit: generateAnalysis,
  } = useObject({
    api: "/api/ai/resume/analyze",
    schema: AiAnalyzeSchema,
    fetch: (url, options) => {
      const headers = new Headers(options?.headers);

      headers.delete("Content-Type");

      const formData = new FormData();

      if (fileRef.current) formData.append("resume", fileRef.current);

      formData.append("jobInfoId", jobInfoId);

      return fetch(url, { ...options, headers, body: formData });
    },
  });

  function handleFileUpload(file: File | null) {
    fileRef.current = file;
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      return toast.error("File size exceed 10MB limit");
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officdocument.wordprocessingml.document",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return toast.error("Please upload a PDF, Word Document or text file.");
    }

    generateAnalysis(null);
  }

  return (
    <div className="space-y-8 w-full">
      <Card>
        <CardHeader>
          <CardTitle>
            {isLoading ? "Analyzing your resume" : "Upload your resume"}
          </CardTitle>
          <CardDescription>
            {isLoading
              ? "This may take a couple minutes, Please wait while we analyze your resume ..."
              : "Get personalized feedback on your resume based on the job"}
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-42">
          {!isLoading ? (
            <button
              className={cn(
                "mt-2 border-2 border-dashed p-6 rounded-lg transition-colors relative w-full",
                isDragOver
                  ? "border-primary bg-primary/5"
                  : "border-muted-foreground/50 bg-muted/10"
              )}
              type="button"
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragOver(true);
              }}
              onDrop={(e) => {
                e.preventDefault();
                setIsDragOver(false);
                handleFileUpload(e.dataTransfer.files?.[0] ?? null);
              }}
            >
              <label htmlFor="resume-upload" className="sr-only">
                Upload your resume
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                id="resume-upload"
                className="opacity-0 absolute inset-0 cursor-pointer"
                onChange={(e) => {
                  handleFileUpload(e.target.files?.[0] ?? null);
                }}
              />
              <div className="flex flex-col items-center justify-center text-center gap-4">
                <UploadIcon className="size-12 text-muted-foreground" />
                <div className="space-y-2">
                  <p className="text-lg ">
                    Drag your resume here or Click to upload
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supported formated: PDF, Word docs and text files
                  </p>
                </div>
              </div>
            </button>
          ) : (
            <Loader2Icon className="size-16 animate-spin mx-auto" />
          )}
        </CardContent>
      </Card>
      <AnalysisResults aiAnalysis={aiAnalysis} isLoading={isLoading} />
    </div>
  );
}

type Keys = Exclude<keyof z.infer<typeof AiAnalyzeSchema>, "overallScore">;
type AiAnalysis = z.infer<typeof AiAnalyzeSchema>;

function AnalysisResults({
  aiAnalysis,
  isLoading,
}: {
  aiAnalysis: DeepPartial<AiAnalysis> | undefined;
  isLoading: boolean;
}) {
  if (!isLoading && !aiAnalysis) return null;

  const sections: Record<Keys, string> = {
    ats: "ATS Compatibility",
    jobMatch: "Job Match",
    writingAndFormating: "Writing and formatting",
    keywordCoverage: "Keyword Coverage",
    other: "Additional Insights",
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analysis Results</CardTitle>
        <CardDescription>
          {!aiAnalysis?.overallScore ? (
            <Skeleton className="w-32" />
          ) : (
            `Overall Score : ${aiAnalysis.overallScore}`
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple">
          {Object.entries(sections).map(([key, title]) => {
            const category = aiAnalysis?.[key as Keys];

            return (
              <AccordionItem value={title} key={key}>
                <AccordionTrigger className="!no-underline cursor-pointer">
                  <CategoryAccordionHeader
                    title={title}
                    score={category?.score}
                  />
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="text-muted-foreground">
                      {!category?.summary ? (
                        <span>
                          <Skeleton />
                          <Skeleton className="w-3/4" />
                        </span>
                      ) : (
                        category.summary
                      )}
                    </div>
                    <div className="space-y-3">
                      {!category?.feedback ? (
                        <>
                          <Skeleton className="h-16" />
                          <Skeleton className="h-16" />
                          <Skeleton className="h-16" />
                        </>
                      ) : (
                        category.feedback.map((item, index) => {
                          if (!item) return null;

                          return <FeedbackItem item={item} />;
                        })
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}

function CategoryAccordionHeader({
  title,
  score,
}: {
  title: string;
  score: number | undefined | null;
}) {
  let badge: ReactNode;

  if (score == null) badge = <Skeleton className="w-16" />;
  else if (score >= 8) badge = <Badge>Excellent</Badge>;
  else if (score >= 6) badge = <Badge variant="warning">OK</Badge>;
  else badge = <Badge variant="destructive">Needs work</Badge>;

  return (
    <div className="flex items-start justify-between w-full">
      <div className="flex flex-col items-start gap-1">
        <span>{title}</span>
        <div className="no-underline">{badge}</div>
      </div>
      {score == null ? <Skeleton className="w-12" /> : `${score}/10`}
    </div>
  );
}

function FeedbackItem({
  item: { message, name, type },
}: {
  item: Partial<AiAnalysis["ats"]["feedback"][number]>;
}) {
  if (!name || !message || !type) return null;

  const getColors = () => {
    switch (type) {
      case "strength":
        return "bg-primary/10 border border-primary/50";
      case "major-improvement":
        return "bg-destructive/10 dark:bg-destructive/2- border border-destructive/50 dark:border-destructive/70";
      case "minor-improvement":
        return "bg-warning/10 border border-warning/40";
      default:
        throw new Error(`Unknown feedback type : ${type satisfies never}`);
    }
  };

  return (
    <div
      className={cn(
        "flex items-baseline gap-3 pl-3 pr-5 py-5 rounded-lg",
        getColors()
      )}
    ></div>
  );
}
