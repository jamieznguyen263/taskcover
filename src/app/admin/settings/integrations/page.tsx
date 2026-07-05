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
    integrationRow("Neon", status.databaseConfigured, "Database URL or Hyperdrive runtime binding is available.", "Set DATABASE_URL locally or configure Hyperdrive."),
    integrationRow("Hyperdrive", status.hyperdriveConfigured, "Runtime binding exposes a connection string.", "Set the HYPERDRIVE binding and local preview variable."),
    integrationRow("Insights provider", true, `Provider: ${status.provider}.`, "Keep production on local until database verification passes."),
    integrationRow("Resend", status.resendConfigured, "Sender, reply-to, recipient, and API key are present.", "Verify domain and run the explicit Resend test."),
    integrationRow("HubSpot", status.hubspotConfigured, "Private App token, pipeline, and stage IDs are present.", "Confirm pipeline/stage IDs before live CRM tests."),
    integrationRow("Cal.com", status.calcomConfigured, "Booking CTA URL is present.", "Configure an HTTPS booking URL or keep CTA hidden."),
    integrationRow("Turnstile", status.turnstileConfigured, "Site and secret keys are present.", "Use real hostnames outside local development."),
    integrationRow("Cloudinary", status.cloudinaryConfigured, "Signed upload credentials are present.", "Configure signed uploads and folder isolation."),
    integrationRow("Rate Limiting", status.rateLimitingConfigured, "Rate limiting provider can run in this environment.", "Use Cloudflare bindings for production."),
    integrationRow("Durable Objects", status.durableObjectConfigured, "Rate limit coordinator binding is available.", "Deploy Durable Object migration with Worker deploy."),
    integrationRow("Cron scheduler", status.schedulerConfigured, `Provider: ${status.schedulerProvider}.`, "Enable Cron only after staging validation."),
  ];
  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Settings" title="Integration health" description="Unavailable integrations are explicit; the admin UI does not pretend uploads or scheduler automation are active." />
      <div className="grid gap-3 md:grid-cols-2">
        {rows.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line bg-white p-4" data-status={value.status}>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-2 text-lg font-semibold text-graphite">{value.status}</p>
            <p className="mt-2 text-sm text-muted">{value.completeness}</p>
            <p className="mt-3 text-xs text-muted">Last checked: request time</p>
            <p className="mt-1 text-xs text-muted">Safe error category: {value.errorCategory}</p>
            <p className="mt-3 text-sm text-graphite">{value.nextAction}</p>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}

function integrationRow(label: string, configured: boolean, completeness: string, nextAction: string) {
  return [
    label,
    {
      status: configured ? "configured" : "unavailable",
      completeness,
      errorCategory: configured ? "none" : "configuration",
      nextAction,
    },
  ] as const;
}
