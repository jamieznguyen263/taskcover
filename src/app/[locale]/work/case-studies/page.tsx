import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudiesView } from "@/components/marketing/work/case-studies-view";
import { breadcrumbSchema, buildMetadata, serializeJsonLd } from "@/lib/seo";
import { getWorkContent } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") return {};
  const locale = localeParam as Locale;
  const page = getWorkContent(locale).pages["case-studies"];
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: "/work/case-studies",
    locale,
  });
}

export default async function LocalizedCaseStudiesPage({ params }: Params) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const content = getWorkContent(locale);
  const page = content.pages["case-studies"];
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
                { name: page.h1, path: "/work/case-studies" },
              ],
              locale
            )
          ),
        }}
      />
      <CaseStudiesView locale={locale} />
    </>
  );
}
