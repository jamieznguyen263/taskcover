import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WorkHubView } from "@/components/marketing/work/work-hub-view";
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
  const content = getWorkContent(locale);
  return buildMetadata({
    title: content.hub.metaTitle,
    description: content.hub.metaDescription,
    path: "/work",
    locale,
  });
}

export default async function LocalizedWorkPage({ params }: Params) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
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
              ],
              locale
            )
          ),
        }}
      />
      <WorkHubView locale={locale} />
    </>
  );
}
