import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SampleAuditTemplate } from "@/components/marketing/work/sample-audit-template";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import {
  getSampleAuditBySlug,
  getSampleAuditSlugs,
  getWorkContent,
  type SampleAuditSlug,
} from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== "en")
    .flatMap((locale) => getSampleAuditSlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || localeParam === "en") return {};
  const locale = localeParam as Locale;
  const sample = getSampleAuditBySlug(slug, locale);
  if (!sample) return {};
  return buildMetadata({
    title: sample.metaTitle,
    description: sample.metaDescription,
    path: `/work/sample-audits/${slug}`,
    locale,
  });
}

export default async function LocalizedSampleAuditDetailPage({ params }: Params) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const sample = getSampleAuditBySlug(slug, locale);
  if (!sample) notFound();
  const content = getWorkContent(locale);
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: content.ui.home, path: "/" },
                { name: content.ui.work, path: "/work" },
                { name: content.pages["sample-audits"].h1, path: "/work/sample-audits" },
                { name: sample.title, path: `/work/sample-audits/${slug}` },
              ],
              locale
            )
          ),
        }}
      />
      <SampleAuditTemplate slug={slug as SampleAuditSlug} locale={locale} />
    </>
  );
}
