import { connection } from "next/server";
import { notFound } from "next/navigation";
import { AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { InsightArticleView } from "@/components/marketing/insights/insights-views";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { AdminRepository } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";
import { getPublishedInsights } from "@/lib/insights/content";
import type { InsightArticle } from "@/content/insights.types";

export const metadata = { robots: { index: false, follow: false } };

export default async function FullPagePreview({ params }: { params: Promise<{ id: string }> }) {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  const articleGroup = await new AdminRepository().getArticleGroup((await params).id);
  if (!articleGroup) notFound();
  const fallbackArticle = (await getPublishedInsights("en"))[0] as InsightArticle;
  const article = (articleGroup.localizations.find((item) => item.locale === "en")?.publishedSnapshot as InsightArticle | null) ?? fallbackArticle;
  return (
    <AdminShell session={session}>
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm font-semibold text-amber-800">Draft Preview · noindex · no-store · authenticated</div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        <InsightArticleView article={article} related={[]} locale={article.locale} />
      </div>
    </AdminShell>
  );
}
