import { connection } from "next/server";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { assertPermission } from "@/lib/admin/permissions";
import { AdminRepository } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";

export default async function AdminAuditPage() {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  assertPermission(session.role, "audit:view");
  const logs = await new AdminRepository().listAuditLogs();

  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Audit" title="Security and publishing audit log" description="Structured events without raw passwords, tokens, session cookies, secrets, or full article bodies." />
      <ol className="grid gap-3">
        {logs.map((log) => (
          <li key={log.id} className="rounded-xl border border-line bg-white p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <p className="font-semibold text-graphite">{log.summary}</p>
              <p className="text-xs text-muted">{log.createdAt.toLocaleString()}</p>
            </div>
            <p className="mt-1 text-sm text-secondary">{log.event} · {log.targetType ?? "system"} · {log.targetId ?? "none"}</p>
          </li>
        ))}
      </ol>
    </AdminShell>
  );
}
