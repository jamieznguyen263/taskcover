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
    ["Database", status.databaseConfigured ? "configured" : "unavailable"],
    ["Hyperdrive", status.hyperdriveConfigured ? "configured" : "not tested"],
    ["Resend", status.resendConfigured ? "configured" : "unavailable"],
    ["HubSpot", status.hubspotConfigured ? "configured" : "unavailable"],
    ["Cal.com", status.calcomConfigured ? "configured" : "unavailable"],
    ["Turnstile", status.turnstileConfigured ? "configured" : "unavailable"],
    ["Cloudinary", status.cloudinaryConfigured ? "configured" : "unavailable"],
    ["Rate limiting binding", status.rateLimitingConfigured ? "configured" : "unavailable"],
    ["Durable Object", status.durableObjectConfigured ? "configured" : "not tested"],
    ["Cron/scheduler", status.schedulerConfigured ? status.schedulerProvider : "unavailable"],
    ["Insights provider", status.provider],
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
