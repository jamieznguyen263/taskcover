import { connection } from "next/server";
import Link from "next/link";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { AdminRepository } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";

export default async function AdminInsightsPage() {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  const articles = await new AdminRepository().listArticleSummaries();

  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Insights" title="Article groups" description="Searchable, filter-ready editorial list with locale completeness, workflow state, publication state, and QA signals." />
      <div className="mb-4 flex flex-wrap gap-3 rounded-xl border border-line bg-white p-3">
        <input aria-label="Search articles" placeholder="Search articles" className="min-h-10 flex-1 rounded-lg border border-line px-3 text-sm" />
        <select aria-label="Status filter" className="min-h-10 rounded-lg border border-line px-3 text-sm"><option>All statuses</option></select>
        <select aria-label="Locale completeness filter" className="min-h-10 rounded-lg border border-line px-3 text-sm"><option>Any locale completeness</option></select>
        <Link href="/admin/insights/new" className="inline-flex min-h-10 items-center rounded-lg bg-brand-teal px-4 text-sm font-semibold text-white">New article</Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="bg-surface-tint text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="px-4 py-3">Title</th><th>Category</th><th>Status</th><th>Live state</th><th>Locales</th><th>QA</th><th>Scheduled</th><th>Updated</th><th>Owner</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {articles.map((article) => (
              <tr key={article.id}>
                <td className="px-4 py-3"><Link href={`/admin/insights/${article.id}`} className="font-medium text-graphite hover:text-brand-teal">{article.title}</Link></td>
                <td>{article.category}</td>
                <td>{article.status}</td>
                <td>{article.hasPublishedSnapshot && article.status !== "published" ? "Published + draft changes" : article.hasPublishedSnapshot ? "Published" : "Not live"}</td>
                <td>{article.localeCount}/3</td>
                <td>Run QA</td>
                <td>{article.scheduledAt?.toLocaleString() ?? "None"}</td>
                <td>{article.updatedAt.toLocaleString()}</td>
                <td>{session.displayName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
