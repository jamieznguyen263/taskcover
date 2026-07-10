import { connection } from "next/server";
import Link from "next/link";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { AdminRepository, type ArticleSummary } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";

export default async function AdminDashboardPage() {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  const repo = new AdminRepository();

  if (session.role === "editor") {
    const [articles, changeRequestIds, feedback] = await Promise.all([
      repo.listArticleSummaries(),
      repo.listOpenChangeRequestGroupIds(),
      repo.listRecentWorkflowNotes(20),
    ]);
    const mine = (article: ArticleSummary) =>
      article.assigneeId === session.userId || article.ownerId === session.userId || article.createdBy === session.userId;
    const myArticles = articles.filter(mine);
    const myIds = new Set(myArticles.map((article) => article.id));
    const dueSoon = filterDueSoon(myArticles);

    return (
      <AdminShell session={session}>
        <AdminPageHeader eyebrow="My dashboard" title={`Welcome back, ${session.displayName}`} description="Your drafts, assignments, deadlines, and review feedback." />
        <div className="grid gap-4 xl:grid-cols-2">
          <ArticleTable title="Assigned to me" articles={articles.filter((article) => article.assigneeId === session.userId)} empty="Nothing is assigned to you right now." />
          <ArticleTable title="My drafts" articles={myArticles.filter((article) => article.status === "draft" && !changeRequestIds.has(article.id))} empty="No drafts in progress." />
          <ArticleTable
            title="Returned for changes"
            articles={myArticles.filter((article) => changeRequestIds.has(article.id))}
            empty="No open change requests."
            highlight
          />
          <ArticleTable title="Due soon" articles={dueSoon} empty="No deadlines in the next 7 days." />
          <ArticleTable title="In review" articles={myArticles.filter((article) => article.status === "in-review")} empty="Nothing waiting on review." />
          <ArticleTable title="Recently edited" articles={myArticles.slice(0, 6)} empty="No recent activity." />
        </div>
        <section className="mt-6 rounded-xl border border-line bg-white p-4">
          <h2 className="text-lg font-semibold text-graphite">Review feedback</h2>
          <ol className="mt-3 grid gap-3">
            {feedback.filter((event) => myIds.has(event.articleGroupId)).slice(0, 8).map((event) => (
              <li key={event.id} className="rounded-lg bg-surface-soft p-3 text-sm">
                <p className="font-medium text-graphite">
                  <Link href={`/admin/insights/${event.articleGroupId}`} className="hover:text-brand-teal">{event.title}</Link>
                  <span className="ml-2 text-xs font-normal text-muted">{event.fromStatus ? `${event.fromStatus} → ${event.toStatus}` : event.toStatus} · {event.actorName ?? "System"} · {event.createdAt.toLocaleDateString()}</span>
                </p>
                {event.note ? <p className="mt-1 text-secondary">{event.note}</p> : null}
              </li>
            ))}
            {feedback.filter((event) => myIds.has(event.articleGroupId)).length === 0 ? <li className="text-sm text-muted">No feedback yet.</li> : null}
          </ol>
        </section>
      </AdminShell>
    );
  }

  const [stats, articles, audits, changeRequestIds] = await Promise.all([
    repo.dashboardStats(),
    repo.listArticleSummaries(),
    repo.listAuditLogs(),
    repo.listOpenChangeRequestGroupIds(),
  ]);

  const statCards = [
    ["Total", stats.total],
    ["Draft", stats.draft],
    ["In review", stats.inReview],
    ["Approved", stats.approved],
    ["Scheduled", stats.scheduled],
    ["Published", stats.published],
  ] as const;
  const overdue = filterOverdue(articles);

  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Dashboard" title="Editorial control room" description="Workflow, assignments, translation, QA, scheduling, and security activity without fake performance metrics." />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {statCards.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-line bg-white p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-graphite">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-4 xl:grid-cols-2">
        <ArticleTable title="Awaiting review" articles={articles.filter((article) => article.status === "in-review")} empty="Nothing waiting on review." />
        <ArticleTable title="Open change requests" articles={articles.filter((article) => changeRequestIds.has(article.id))} empty="No open change requests." highlight />
        <ArticleTable title="Overdue" articles={overdue} empty="Nothing is overdue." highlight />
        <ArticleTable title="Ready to publish" articles={articles.filter((article) => article.status === "approved")} empty="Nothing approved and unpublished." />
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
                <tr><th className="py-2">Title</th><th>Status</th><th>Priority</th><th>Due</th><th>Locales</th><th>Updated</th></tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {articles.slice(0, 8).map((article) => (
                  <tr key={article.id}>
                    <td className="py-3 font-medium text-graphite">
                      <Link href={`/admin/insights/${article.id}`} className="hover:text-brand-teal">{article.title}</Link>
                    </td>
                    <td className="py-3">{article.status}</td>
                    <td className="py-3">{article.priority}</td>
                    <td className="py-3">{article.dueDate ? article.dueDate.toLocaleDateString() : "—"}</td>
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

function isOpenWork(article: ArticleSummary) {
  return article.status !== "published" && article.status !== "archived";
}

function filterDueSoon(articles: ArticleSummary[]) {
  const soon = Date.now() + 7 * 24 * 60 * 60 * 1000;
  return articles.filter((article) => article.dueDate && article.dueDate.getTime() <= soon && isOpenWork(article));
}

function filterOverdue(articles: ArticleSummary[]) {
  const now = Date.now();
  return articles.filter((article) => article.dueDate && article.dueDate.getTime() < now && isOpenWork(article));
}

function ArticleTable({ title, articles, empty, highlight }: { title: string; articles: ArticleSummary[]; empty: string; highlight?: boolean }) {
  return (
    <section className={`rounded-xl border p-4 ${highlight && articles.length > 0 ? "border-amber-200 bg-amber-50/40" : "border-line bg-white"}`}>
      <h2 className="text-base font-semibold text-graphite">{title} <span className="text-sm font-normal text-muted">({articles.length})</span></h2>
      {articles.length === 0 ? (
        <p className="mt-3 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-3 grid gap-2">
          {articles.slice(0, 6).map((article) => (
            <li key={article.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-surface-soft p-2.5 text-sm">
              <Link href={`/admin/insights/${article.id}`} className="font-medium text-graphite hover:text-brand-teal">{article.title}</Link>
              <span className="text-xs text-muted">
                {article.status}
                {article.priority !== "normal" ? ` · ${article.priority}` : ""}
                {article.dueDate ? ` · due ${article.dueDate.toLocaleDateString()}` : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
