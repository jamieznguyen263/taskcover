import { connection } from "next/server";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { requireAdminSession } from "@/lib/admin/session";
import { CreateArticleForm } from "@/components/admin/create-article-form";
import crypto from "node:crypto";

export default async function NewInsightPage() {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="New article" title="Create multilingual article group" description="Creates an EN/FR/ES draft group. Editors can save drafts; Admin approval is required before scheduling or publishing." />
      <CreateArticleForm creationKey={crypto.randomUUID()} />
    </AdminShell>
  );
}
