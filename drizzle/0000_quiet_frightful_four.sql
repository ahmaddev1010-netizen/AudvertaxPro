CREATE TYPE "public"."application_status" AS ENUM('draft', 'in_progress', 'review', 'checkout', 'submitted', 'processing', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."application_type" AS ENUM('usa_llc', 'uk_ltd', 'other');--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_slug" text NOT NULL,
	"application_type" "application_type" NOT NULL,
	"status" "application_status" DEFAULT 'draft' NOT NULL,
	"package_slug" text,
	"formation_state" text,
	"current_step" integer DEFAULT 0 NOT NULL,
	"answers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"customer_email" text,
	"customer_name" text,
	"is_paid" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"submitted_at" timestamp with time zone
);
