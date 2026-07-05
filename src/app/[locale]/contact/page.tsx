import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getLeadsContent, getSiteContent } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { safeContactIntent } from "@/lib/leads/schema";
import { ContactPageView } from "@/components/marketing/leads/lead-pages";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ intent?: string | string[] }>;
};

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") return {};
  const content = getLeadsContent(localeParam);
  return buildMetadata({ title: content.contact.meta.title, description: content.contact.meta.description, path: "/contact", locale: localeParam });
}

export default async function LocalizedContactPage({ params, searchParams }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const sp = await searchParams;
  const content = getLeadsContent(locale);
  const site = getSiteContent(locale);
  const intent = safeContactIntent(Array.isArray(sp.intent) ? sp.intent[0] : sp.intent);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema([{ name: site.ui.home, path: "/" }, { name: content.contact.h1, path: "/contact" }], locale)) }} />
      <ContactPageView content={content} locale={locale} initialIntent={intent} turnstileSiteKey={process.env.TURNSTILE_SITE_KEY} />
    </>
  );
}
