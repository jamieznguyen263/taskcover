import { connection } from "next/server";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { requireAdminSession } from "@/lib/admin/session";
import { assertPermission } from "@/lib/admin/permissions";

export default async function PublishingSettingsPage() {
  await connection();
  const status = getAdminIntegrationStatus();
  if (!status.databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  assertPermission(session.role, "users:manage");
  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Publishing" title="Scheduling and cron" description="Approved content can be scheduled, but automatic publishing is only active when `PUBLISH_CRON_SECRET` and a scheduler provider are configured." />
      <section className="rounded-xl border border-line bg-white p-5">
        <h2 className="text-lg font-semibold text-graphite">{status.schedulerConfigured ? "Automation configured" : "Scheduling automation is not configured"}</h2>
        <p className="mt-2 text-sm leading-6 text-secondary">Manual Admin publishing remains available through authenticated controls. External schedulers should POST to `/api/internal/publishing/run` with the scheduler secret.</p>
      </section>
    </AdminShell>
  );
}
