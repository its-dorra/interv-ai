"use client";

import { useForm } from "@tanstack/react-form";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ExperienceLevel, experienceLevels } from "@/drizzle/schema/job-info";
import { Loader2Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobInfoSchema } from "../schemas";
import FieldInfo from "@/components/field-info";
import FieldDescription from "@/components/field-description";
import z from "zod";
import { formatExperienceLevel } from "../lib/formatters";

type JobInfoFormData = z.infer<typeof JobInfoSchema>;

export default function JobInfoForm() {
  const form = useForm({
    defaultValues: {
      name: "",
      jobTitle: "",
      experienceLevel: "junior",
      description: "",
    } as JobInfoFormData,
    validators: {
      // onChange: JobInfoSchema,
      onSubmit: JobInfoSchema,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="flex flex-col gap-y-4"
    >
      <div>
        <form.Field name="name">
          {(field) => (
            <div className="flex flex-col gap-y-2">
              <Label htmlFor={field.name}>Name</Label>
              <Input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter a job name"
              />
              <FieldDescription>
                A descriptive name for this job opportunity.
              </FieldDescription>
              <FieldInfo field={field} />
            </div>
          )}
        </form.Field>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <form.Field name="jobTitle">
            {(field) => (
              <div className="flex flex-col gap-y-2">
                <Label htmlFor={field.name}>Job Title</Label>
                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                />
                <FieldDescription>
                  The specific job title or position (Optional).
                </FieldDescription>

                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>
        </div>

        <div>
          <form.Field name="experienceLevel">
            {(field) => (
              <div className="flex flex-col gap-y-2">
                <Label htmlFor={field.name}>Experience Level</Label>
                <Select
                  value={field.state.value}
                  onValueChange={(value) =>
                    field.handleChange(value as ExperienceLevel)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {formatExperienceLevel(level)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldInfo field={field} />
              </div>
            )}
          </form.Field>
        </div>
      </div>

      <div>
        <form.Field name="description">
          {(field) => (
            <div className="flex flex-col gap-y-2">
              <Label htmlFor={field.name}>Description</Label>
              <Textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="A Next.js 15 and React 19 full stack web developer job that uses Drizzle ORM and PostgreSQL for the database..."
                className="resize-none"
              />
              <div className="space-y-1">
                <FieldDescription>
                  Be as specific as possible. The more information you provide,
                  te better the interviews will be.
                </FieldDescription>

                <FieldInfo field={field} />
              </div>
            </div>
          )}
        </form.Field>
      </div>

      <form.Subscribe selector={(s) => [s.isSubmitting, s.isValid]}>
        {([isSubmitting, isValid]) => (
          <Button
            className="self-end"
            type="submit"
            disabled={!form.state.isValid}
          >
            {isSubmitting && !isValid ? (
              <Loader2Icon className="animate-spin size-6" />
            ) : (
              "Submit"
            )}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
