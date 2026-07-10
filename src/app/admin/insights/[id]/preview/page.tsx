import { connection } from "next/server";
import { notFound } from "next/navigation";
import { AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { InsightBlockRenderer } from "@/components/marketing/insights/insight-block-renderer";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { AdminRepository } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";
import { asLocale } from "@/lib/i18n";

export const metadata = { robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FullPagePreview({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ locale?: string }> }) {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  const articleGroup = await new AdminRepository().getEditableArticleGroup((await params).id);
  if (!articleGroup) notFound();
  const locale = asLocale((await searchParams).locale);
  const article = articleGroup.localizations.find((item) => item.locale === locale)?.article;
  if (!article) notFound();
  return (
    <AdminShell session={session}>
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">Draft Preview · noindex · no-store · authenticated</div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <article className="mx-auto max-w-4xl p-6">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-teal">{article.locale.toUpperCase()} draft</p>
          <h1 className="mt-3 text-4xl font-semibold text-graphite">{article.h1}</h1>
          <p className="mt-4 text-lg text-secondary">{article.excerpt}</p>
          <div className="mt-8"><InsightBlockRenderer article={article} locale={article.locale} /></div>
        </article>
      </div>
    </AdminShell>
  );
}
