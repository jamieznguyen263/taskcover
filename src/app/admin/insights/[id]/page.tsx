import { connection } from "next/server";
import { notFound } from "next/navigation";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { ArticleEditor, type EditorSibling } from "@/components/admin/article-editor";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { AdminRepository } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";
import { asLocale } from "@/lib/i18n";
import type { PublishQaResult } from "@/lib/insights/publish-qa";

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

  const [comments, workflowEvents, assignableUsers, publishedSnapshots] = await Promise.all([
    repo.listComments(articleGroup.id),
    repo.listWorkflowEvents(articleGroup.id),
    repo.listAssignableUsers(),
    repo.listPublishedSnapshots(localization.locale).catch(() => []),
  ]);

  const siblings: EditorSibling[] = articleGroup.localizations.map((item) => ({
    locale: item.locale,
    draftVersion: item.draftVersion,
    article: item.article,
    editorDocument: item.editorDocument,
  }));

  const group = raw?.group;
  const assignment = {
    ownerId: group?.ownerId ?? null,
    assigneeId: group?.assigneeId ?? null,
    reviewerId: group?.reviewerId ?? null,
    dueDate: group?.dueDate?.toISOString() ?? null,
    priority: group?.priority ?? ("normal" as const),
  };

  const rawLocalization = raw?.localizations.find((item) => item.id === localization.id);
  const storedQa = Array.isArray(rawLocalization?.publishQaSnapshot) ? (rawLocalization.publishQaSnapshot as PublishQaResult[]) : [];

  const publishedArticles = publishedSnapshots
    .filter((snapshot) => snapshot.id !== articleGroup.id)
    .map((snapshot) => ({ slug: snapshot.slug, category: snapshot.category, h1: snapshot.h1, focusKeyword: snapshot.searchStrategy.focusKeyword }));

  return (
    <AdminShell session={session}>
      <AdminPageHeader
        eyebrow="Editor"
        title={localization.article.h1}
        description="Visual multilingual editing with structured SEO/GEO forms, autosave, optimistic concurrency, and server-enforced workflow."
      />
      <ArticleEditor
        articleId={articleGroup.id}
        article={localization.article}
        editorDocument={localization.editorDocument}
        lockVersion={articleGroup.lockVersion}
        status={articleGroup.status}
        role={session.role}
        schedulerConfigured={getAdminIntegrationStatus().schedulerConfigured}
        availableLocales={articleGroup.localizations.map((item) => item.locale)}
        restoreRevisionId={restoreRevisionId}
        siblings={siblings}
        publishedSlug={localization.publishedSnapshot?.slug ?? null}
        publishedArticles={publishedArticles}
        assignment={assignment}
        assignableUsers={assignableUsers}
        comments={comments}
        workflowEvents={workflowEvents}
        storedQa={storedQa}
      />
    </AdminShell>
  );
}
