CREATE TYPE "public"."external_membership_kind" AS ENUM('freelancer', 'partner_manager', 'partner_member', 'read_only_guest');--> statement-breakpoint
ALTER TYPE "public"."admin_role" ADD VALUE 'external';--> statement-breakpoint
CREATE TABLE "external_memberships" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"external_organization_id" uuid,
	"kind" "external_membership_kind" NOT NULL,
	"access_start_at" timestamp with time zone DEFAULT now() NOT NULL,
	"access_expiry_at" timestamp with time zone,
	"can_download" boolean DEFAULT false NOT NULL,
	"can_upload" boolean DEFAULT false NOT NULL,
	"revoked_at" timestamp with time zone,
	"revoked_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "flow_external_invites" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"invite_id" uuid NOT NULL,
	"external_organization_id" uuid,
	"kind" "external_membership_kind" NOT NULL,
	"access_start_at" timestamp with time zone DEFAULT now() NOT NULL,
	"access_expiry_at" timestamp with time zone,
	"can_download" boolean DEFAULT false NOT NULL,
	"can_upload" boolean DEFAULT false NOT NULL,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "external_memberships" ADD CONSTRAINT "external_memberships_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_memberships" ADD CONSTRAINT "external_memberships_external_organization_id_external_organizations_id_fk" FOREIGN KEY ("external_organization_id") REFERENCES "public"."external_organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "external_memberships" ADD CONSTRAINT "external_memberships_revoked_by_admin_users_id_fk" FOREIGN KEY ("revoked_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flow_external_invites" ADD CONSTRAINT "flow_external_invites_invite_id_admin_invites_id_fk" FOREIGN KEY ("invite_id") REFERENCES "public"."admin_invites"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flow_external_invites" ADD CONSTRAINT "flow_external_invites_external_organization_id_external_organizations_id_fk" FOREIGN KEY ("external_organization_id") REFERENCES "public"."external_organizations"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "flow_external_invites" ADD CONSTRAINT "flow_external_invites_created_by_admin_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."admin_users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "external_memberships_user_idx" ON "external_memberships" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "external_memberships_org_idx" ON "external_memberships" USING btree ("external_organization_id");--> statement-breakpoint
CREATE UNIQUE INDEX "flow_external_invites_invite_idx" ON "flow_external_invites" USING btree ("invite_id");