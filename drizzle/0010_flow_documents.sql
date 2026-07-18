CREATE TYPE "public"."document_kind" AS ENUM('strategy', 'brief', 'meeting_note', 'sop', 'report', 'proposal', 'research', 'decision', 'general');--> statement-breakpoint
CREATE TABLE "document_versions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"document_id" uuid NOT NULL,
	"version" integer NOT NULL,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "document_work_links" (
	"document_id" uuid NOT NULL,
	"work_item_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "document_work_links_document_id_work_item_id_pk" PRIMARY KEY("document_id","work_item_id")
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"kind" "document_kind" DEFAULT 'general' NOT NULL,
	"body" text DEFAULT '' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"visibility" "comment_visibility" DEFAULT 'internal' NOT NULL,
	"client_id" uuid,
	"project_id" uuid,
	"created_by" uuid,
	"updated_by" uuid,
	"archived_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_work_links" ADD CONSTRAINT "document_work_links_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "document_work_links" ADD CONSTRAINT "document_work_links_work_item_id_work_items_id_fk" FOREIGN KEY ("work_item_id") REFERENCES "public"."work_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_updated_by_admin_users_id_fk" FOREIGN KEY ("updated_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "document_versions_doc_version_idx" ON "document_versions" USING btree ("document_id","version");--> statement-breakpoint
CREATE INDEX "document_work_links_work_idx" ON "document_work_links" USING btree ("work_item_id");--> statement-breakpoint
CREATE INDEX "documents_client_idx" ON "documents" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "documents_project_idx" ON "documents" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "documents_kind_idx" ON "documents" USING btree ("kind");--> statement-breakpoint
-- FLOW-010 capability additions (docs:view, docs:manage for all internal levels).
-- capability_set mirrors src/lib/work/capabilities.ts (authoritative);
-- migration-consistency.test.ts replays these UPDATEs across all migrations to detect drift.
UPDATE "role_presets" SET "capability_set" = '["flow:access","teams:view","clients:view","projects:view","work:view","work:manage","internal-notes:view","docs:view","docs:manage"]'::jsonb, "updated_at" = now() WHERE "key" = 'member';--> statement-breakpoint
UPDATE "role_presets" SET "capability_set" = '["flow:access","teams:view","clients:view","projects:view","work:view","work:manage","internal-notes:view","docs:view","docs:manage","members:view","clients:manage","projects:manage"]'::jsonb, "updated_at" = now() WHERE "key" = 'manager';--> statement-breakpoint
UPDATE "role_presets" SET "capability_set" = '["flow:access","teams:view","clients:view","projects:view","work:view","work:manage","internal-notes:view","docs:view","docs:manage","members:view","clients:manage","projects:manage","teams:manage","administration:view"]'::jsonb, "updated_at" = now() WHERE "key" = 'admin';--> statement-breakpoint
UPDATE "role_presets" SET "capability_set" = '["flow:access","teams:view","clients:view","projects:view","work:view","work:manage","internal-notes:view","docs:view","docs:manage","members:view","clients:manage","projects:manage","teams:manage","administration:view"]'::jsonb, "updated_at" = now() WHERE "key" = 'owner';
