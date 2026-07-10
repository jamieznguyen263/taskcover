import { connection } from "next/server";
import { notFound } from "next/navigation";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { ArticleEditor } from "@/components/admin/article-editor";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { AdminRepository } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";
import { asLocale } from "@/lib/i18n";

export default async function AdminInsightEditorPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ locale?: string }> }) {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  const repo = new AdminRepository();
  const articleGroup = await repo.getEditableArticleGroup((await params).id);
  if (!articleGroup) notFound();
  const locale = asLocale((await searchParams).locale);
  const localization = articleGroup.localizations.find((item) => item.locale === locale) ?? articleGroup.localizations[0];
  if (!localization) notFound();
  const raw = await repo.getArticleGroup(articleGroup.id);
  const restoreRevisionId = raw?.revisions.find((revision) => revision.articleSnapshot)?.id;

  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Editor" title={localization.article.h1} description="Persistent multilingual editing with optimistic concurrency, accurate autosave state, authenticated preview, and server-enforced workflow transitions." />
      <ArticleEditor articleId={articleGroup.id} article={localization.article} editorDocument={localization.editorDocument} lockVersion={articleGroup.lockVersion} status={articleGroup.status} role={session.role} schedulerConfigured={getAdminIntegrationStatus().schedulerConfigured} availableLocales={articleGroup.localizations.map((item) => item.locale)} restoreRevisionId={restoreRevisionId} />
    </AdminShell>
  );
}
