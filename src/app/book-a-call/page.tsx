import type { Metadata } from "next";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getLeadsContent, getSiteContent } from "@/lib/content";
import { BookCallPageView } from "@/components/marketing/leads/lead-pages";

export const metadata: Metadata = buildMetadata({
  title: getLeadsContent("en").bookCall.meta.title,
  description: getLeadsContent("en").bookCall.meta.description,
  path: "/book-a-call",
  locale: "en",
});

export default function BookCallPage() {
  const content = getLeadsContent("en");
  const site = getSiteContent("en");
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema([{ name: site.ui.home, path: "/" }, { name: content.bookCall.h1, path: "/book-a-call" }], "en")) }} />
      <BookCallPageView content={content} locale="en" turnstileSiteKey={process.env.TURNSTILE_SITE_KEY} />
    </>
  );
}
