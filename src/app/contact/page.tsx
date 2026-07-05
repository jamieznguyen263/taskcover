import type { Metadata } from "next";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getLeadsContent, getSiteContent } from "@/lib/content";
import { safeContactIntent } from "@/lib/leads/schema";
import { ContactPageView } from "@/components/marketing/leads/lead-pages";

type Props = { searchParams: Promise<{ intent?: string | string[] }> };

export const metadata: Metadata = buildMetadata({
  title: getLeadsContent("en").contact.meta.title,
  description: getLeadsContent("en").contact.meta.description,
  path: "/contact",
  locale: "en",
});

export default async function ContactPage({ searchParams }: Props) {
  const params = await searchParams;
  const content = getLeadsContent("en");
  const site = getSiteContent("en");
  const intent = safeContactIntent(Array.isArray(params.intent) ? params.intent[0] : params.intent);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema([{ name: site.ui.home, path: "/" }, { name: content.contact.h1, path: "/contact" }], "en")) }} />
      <ContactPageView content={content} locale="en" initialIntent={intent} turnstileSiteKey={process.env.TURNSTILE_SITE_KEY} />
    </>
  );
}
