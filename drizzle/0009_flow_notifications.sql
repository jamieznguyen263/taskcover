CREATE TYPE "public"."notification_kind" AS ENUM('assignment', 'mention', 'feedback', 'review_request', 'approval_request', 'deadline_warning', 'waiting_reminder', 'external_update', 'system_warning');--> statement-breakpoint
CREATE TYPE "public"."notification_state" AS ENUM('unread', 'read', 'snoozed', 'done');--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"recipient_id" uuid NOT NULL,
	"actor_id" uuid,
	"kind" "notification_kind" NOT NULL,
	"state" "notification_state" DEFAULT 'unread' NOT NULL,
	"target_type" text NOT NULL,
	"target_id" uuid NOT NULL,
	"project_id" uuid,
	"title" text NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"href" text DEFAULT '' NOT NULL,
	"snoozed_until" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_recipient_id_admin_users_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_actor_id_admin_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "notifications_recipient_state_idx" ON "notifications" USING btree ("recipient_id","state");--> statement-breakpoint
CREATE INDEX "notifications_target_idx" ON "notifications" USING btree ("target_type","target_id");