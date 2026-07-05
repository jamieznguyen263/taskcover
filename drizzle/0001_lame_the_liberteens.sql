CREATE TYPE "public"."lead_delivery_job_status" AS ENUM('pending', 'processing', 'succeeded', 'retrying', 'dead-letter', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."lead_delivery_job_type" AS ENUM('resend-internal-notification', 'resend-visitor-confirmation', 'hubspot-contact-sync', 'hubspot-company-sync', 'hubspot-deal-sync');--> statement-breakpoint
CREATE TYPE "public"."lead_delivery_provider" AS ENUM('resend', 'hubspot');--> statement-breakpoint
CREATE TYPE "public"."lead_submission_status" AS ENUM('accepted', 'processing', 'completed', 'needs_attention', 'cancelled');--> statement-breakpoint
ALTER TYPE "public"."admin_audit_event" ADD VALUE 'integration_test';--> statement-breakpoint
CREATE TABLE "lead_delivery_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"provider" "lead_delivery_provider" NOT NULL,
	"job_type" "lead_delivery_job_type" NOT NULL,
	"result" text NOT NULL,
	"error_category" text,
	"status_code_category" text,
	"duration_ms" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_delivery_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"provider" "lead_delivery_provider" NOT NULL,
	"job_type" "lead_delivery_job_type" NOT NULL,
	"idempotency_key" text NOT NULL,
	"status" "lead_delivery_job_status" DEFAULT 'pending' NOT NULL,
	"attempt_count" integer DEFAULT 0 NOT NULL,
	"next_attempt_at" timestamp with time zone DEFAULT now() NOT NULL,
	"locked_at" timestamp with time zone,
	"locked_by" text,
	"last_error_category" text,
	"last_error_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_provider_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"provider" "lead_delivery_provider" NOT NULL,
	"link_type" text NOT NULL,
	"provider_id" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_status_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"lead_id" uuid NOT NULL,
	"event_type" text NOT NULL,
	"summary" text NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "lead_submissions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"idempotency_key" text NOT NULL,
	"request_type" text NOT NULL,
	"locale" "locale" NOT NULL,
	"name" text NOT NULL,
	"normalized_email" text NOT NULL,
	"company" text,
	"role" text,
	"website_url" text,
	"market" text,
	"industry" text,
	"service_interests" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"primary_challenge" text,
	"goals" text,
	"timeline" text,
	"investment_range" text,
	"current_traffic_range" text,
	"paid_search_activity" text,
	"preferred_time_zone" text,
	"preferred_call_windows" text[] DEFAULT ARRAY[]::text[] NOT NULL,
	"message" text,
	"consent_version" text DEFAULT '2026-07-05' NOT NULL,
	"source_path" text NOT NULL,
	"landing_path" text,
	"referrer_domain" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"utm_content" text,
	"utm_term" text,
	"click_identifiers" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"status" "lead_submission_status" DEFAULT 'accepted' NOT NULL,
	"accepted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_delivery_attempts" ADD CONSTRAINT "lead_delivery_attempts_job_id_lead_delivery_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."lead_delivery_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_delivery_jobs" ADD CONSTRAINT "lead_delivery_jobs_lead_id_lead_submissions_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."lead_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_provider_links" ADD CONSTRAINT "lead_provider_links_lead_id_lead_submissions_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."lead_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "lead_status_events" ADD CONSTRAINT "lead_status_events_lead_id_lead_submissions_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."lead_submissions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lead_delivery_attempts_job_idx" ON "lead_delivery_attempts" USING btree ("job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lead_delivery_jobs_idempotency_idx" ON "lead_delivery_jobs" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "lead_delivery_jobs_due_idx" ON "lead_delivery_jobs" USING btree ("status","next_attempt_at");--> statement-breakpoint
CREATE INDEX "lead_delivery_jobs_lead_idx" ON "lead_delivery_jobs" USING btree ("lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lead_provider_links_unique_idx" ON "lead_provider_links" USING btree ("lead_id","provider","link_type");--> statement-breakpoint
CREATE INDEX "lead_provider_links_provider_id_idx" ON "lead_provider_links" USING btree ("provider","provider_id");--> statement-breakpoint
CREATE INDEX "lead_status_events_lead_idx" ON "lead_status_events" USING btree ("lead_id");--> statement-breakpoint
CREATE UNIQUE INDEX "lead_submissions_idempotency_idx" ON "lead_submissions" USING btree ("idempotency_key");--> statement-breakpoint
CREATE INDEX "lead_submissions_email_idx" ON "lead_submissions" USING btree ("normalized_email");--> statement-breakpoint
CREATE INDEX "lead_submissions_status_idx" ON "lead_submissions" USING btree ("status");--> statement-breakpoint
CREATE INDEX "lead_submissions_created_at_idx" ON "lead_submissions" USING btree ("created_at");