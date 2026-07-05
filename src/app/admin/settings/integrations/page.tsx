import { connection } from "next/server";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { requireAdminSession } from "@/lib/admin/session";

export default async function IntegrationsPage() {
  await connection();
  const status = getAdminIntegrationStatus();
  if (!status.databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  const rows = [
    ["Database", status.databaseConfigured ? "Configured" : "Unavailable"],
    ["Public provider", status.provider],
    ["Cloudinary", status.cloudinaryConfigured ? "Configured" : "Unavailable"],
    ["Scheduler", status.schedulerConfigured ? status.schedulerProvider : "disabled"],
  ];
  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Settings" title="Integration health" description="Unavailable integrations are explicit; the admin UI does not pretend uploads or scheduler automation are active." />
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-2 text-lg font-semibold text-graphite">{value}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
