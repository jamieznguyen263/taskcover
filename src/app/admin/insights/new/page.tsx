import { connection } from "next/server";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { requireAdminSession } from "@/lib/admin/session";

export default async function NewInsightPage() {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="New article" title="Create multilingual article group" description="Creates an EN/FR/ES draft group. Editors can save drafts; Admin approval is required before scheduling or publishing." />
      <form className="grid max-w-3xl gap-4 rounded-xl border border-line bg-white p-5">
        <label className="grid gap-2 text-sm font-medium text-graphite">Shared slug<input className="min-h-11 rounded-lg border border-line px-3" /></label>
        <label className="grid gap-2 text-sm font-medium text-graphite">Category<select className="min-h-11 rounded-lg border border-line px-3"><option>seo-guides</option><option>ai-search</option><option>technical-seo</option></select></label>
        <button className="min-h-11 rounded-lg bg-brand-teal px-4 text-sm font-semibold text-white" type="button">Create draft group</button>
      </form>
    </AdminShell>
  );
}
