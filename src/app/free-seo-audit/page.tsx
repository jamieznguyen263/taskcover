import type { Metadata } from "next";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getLeadsContent, getSiteContent } from "@/lib/content";
import { FreeSeoAuditPageView } from "@/components/marketing/leads/lead-pages";

export const metadata: Metadata = buildMetadata({
  title: getLeadsContent("en").freeAudit.meta.title,
  description: getLeadsContent("en").freeAudit.meta.description,
  path: "/free-seo-audit",
  locale: "en",
});

export default function FreeSeoAuditPage() {
  const content = getLeadsContent("en");
  const site = getSiteContent("en");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema([{ name: site.ui.home, path: "/" }, { name: content.freeAudit.h1, path: "/free-seo-audit" }], "en")) }} />
      <FreeSeoAuditPageView content={content} locale="en" turnstileSiteKey={process.env.TURNSTILE_SITE_KEY} />
    </>
  );
}
