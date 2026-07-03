import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyTemplate } from "@/components/marketing/work/case-study-template";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getCaseStudyBySlug, getCaseStudySlugs, getWorkContent, type CaseStudySlug } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== "en")
    .flatMap((locale) => getCaseStudySlugs().map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || localeParam === "en") return {};
  const locale = localeParam as Locale;
  const study = getCaseStudyBySlug(slug, locale);
  if (!study) return {};
  return buildMetadata({
    title: study.metaTitle,
    description: study.metaDescription,
    path: `/work/case-studies/${slug}`,
    locale,
    ogImage: study.visualGallery[0]?.src,
  });
}

export default async function LocalizedCaseStudyDetailPage({ params }: Params) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const study = getCaseStudyBySlug(slug, locale);
  if (!study) notFound();
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
                { name: content.pages["case-studies"].h1, path: "/work/case-studies" },
                { name: study.clientName, path: `/work/case-studies/${slug}` },
              ],
              locale
            )
          ),
        }}
      />
      <CaseStudyTemplate slug={slug as CaseStudySlug} locale={locale} />
    </>
  );
}
