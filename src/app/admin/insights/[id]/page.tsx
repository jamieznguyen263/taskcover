import { connection } from "next/server";
import { notFound } from "next/navigation";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { ArticleEditor } from "@/components/admin/article-editor";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { AdminRepository } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";
import { getPublishedInsights } from "@/lib/insights/content";
import type { InsightArticle } from "@/content/insights.types";

export default async function AdminInsightEditorPage({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  const articleGroup = await new AdminRepository().getArticleGroup((await params).id);
  if (!articleGroup) notFound();

  const fallbackArticle = (await getPublishedInsights("en"))[0] as InsightArticle;
  const published = articleGroup.localizations.find((item) => item.locale === "en")?.publishedSnapshot as InsightArticle | null;
  const article = published ?? { ...fallbackArticle, id: articleGroup.group.id, slug: articleGroup.group.sharedSlug, h1: articleGroup.group.sharedSlug };

  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Editor" title={article.h1} description="Structured Tiptap editing with eight SEO/content tabs, autosave states, conflict detection, and preview through the public block renderer." />
      <ArticleEditor article={article} />
    </AdminShell>
  );
}
