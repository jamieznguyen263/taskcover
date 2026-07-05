import { connection } from "next/server";
import Link from "next/link";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { AdminRepository } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";

export default async function AdminDashboardPage() {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  const repo = new AdminRepository();
  const [stats, articles, audits] = await Promise.all([
    repo.dashboardStats(),
    repo.listArticleSummaries(),
    repo.listAuditLogs(),
  ]);

  const statCards = [
    ["Total", stats.total],
    ["Draft", stats.draft],
    ["In review", stats.inReview],
    ["Approved", stats.approved],
    ["Scheduled", stats.scheduled],
    ["Published", stats.published],
  ];

  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Dashboard" title="Editorial control room" description="Workflow, translation, QA, scheduling, media, and security activity without fake performance metrics." />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {statCards.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-graphite">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-xl border border-line bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-graphite">Recent articles</h2>
            <Link href="/admin/insights" className="text-sm font-medium text-brand-teal">View all</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr><th className="py-2">Title</th><th>Status</th><th>Locales</th><th>Updated</th></tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {articles.slice(0, 8).map((article) => (
                  <tr key={article.id}>
                    <td className="py-3 font-medium text-graphite">{article.title}</td>
                    <td className="py-3">{article.status}</td>
                    <td className="py-3">{article.localeCount}/3</td>
                    <td className="py-3">{article.updatedAt.toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="rounded-xl border border-line bg-white p-4">
          <h2 className="text-lg font-semibold text-graphite">Recent admin activity</h2>
          <ol className="mt-3 grid gap-3">
            {audits.slice(0, 8).map((event) => (
              <li key={event.id} className="rounded-lg bg-surface-soft p-3 text-sm">
                <p className="font-medium text-graphite">{event.summary}</p>
                <p className="text-xs text-muted">{event.event} · {event.createdAt.toLocaleString()}</p>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </AdminShell>
  );
}
