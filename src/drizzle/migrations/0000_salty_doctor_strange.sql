CREATE TYPE "public"."job_info_experience_level" AS ENUM('junior', 'mid-level', 'senior');--> statement-breakpoint
CREATE TYPE "public"."questions_question_difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TABLE "meet_ai_job_info" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar,
	"name" varchar NOT NULL,
	"experienceLevel" "job_info_experience_level" NOT NULL,
	"description" varchar NOT NULL,
	"userId" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meet_ai_interview" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"jobInfoId" uuid NOT NULL,
	"duration" varchar NOT NULL,
	"humeChatId" varchar,
	"feedback" varchar,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meet_ai_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar,
	"text" varchar NOT NULL,
	"questionDifficulty" "questions_question_difficulty" NOT NULL,
	"description" varchar NOT NULL,
	"jobInfoId" uuid NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "meet_ai_users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"name" varchar NOT NULL,
	"imageUrl" varchar NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "meet_ai_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "meet_ai_job_info" ADD CONSTRAINT "meet_ai_job_info_userId_meet_ai_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."meet_ai_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meet_ai_interview" ADD CONSTRAINT "meet_ai_interview_jobInfoId_meet_ai_job_info_id_fk" FOREIGN KEY ("jobInfoId") REFERENCES "public"."meet_ai_job_info"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meet_ai_questions" ADD CONSTRAINT "meet_ai_questions_jobInfoId_meet_ai_job_info_id_fk" FOREIGN KEY ("jobInfoId") REFERENCES "public"."meet_ai_job_info"("id") ON DELETE cascade ON UPDATE no action;