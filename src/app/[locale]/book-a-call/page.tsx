import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getLeadsContent, getSiteContent } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { BookCallPageView } from "@/components/marketing/leads/lead-pages";

type Params = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") return {};
  const content = getLeadsContent(localeParam);
  return buildMetadata({ title: content.bookCall.meta.title, description: content.bookCall.meta.description, path: "/book-a-call", locale: localeParam });
}

export default async function LocalizedBookCallPage({ params }: Params) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const content = getLeadsContent(locale);
  const site = getSiteContent(locale);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchema([{ name: site.ui.home, path: "/" }, { name: content.bookCall.h1, path: "/book-a-call" }], locale)) }} />
      <BookCallPageView content={content} locale={locale} turnstileSiteKey={process.env.TURNSTILE_SITE_KEY} />
    </>
  );
}
