import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PricingPageView } from "@/components/marketing/pricing/pricing-page-view";
import { getPricingContent } from "@/lib/content";
import { resolvePricingTabId } from "@/content/pricing.types";
import {
  breadcrumbSchema,
  buildMetadata,
  faqSchema,
  serializeJsonLd,
} from "@/lib/seo";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };
type LocalizedPricingPageProps = Params & {
  searchParams: Promise<{ tab?: string | string[] }>;
};

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const content = getPricingContent(locale);
  return buildMetadata({
    title: content.metadata.title,
    description: content.metadata.description,
    path: "/pricing",
    locale,
  });
}

export default async function LocalizedPricingPage({
  params,
  searchParams,
}: LocalizedPricingPageProps) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const content = getPricingContent(locale);
  const initialTab = resolvePricingTabId((await searchParams).tab);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: content.breadcrumbs.home, path: "/" },
                { name: content.breadcrumbs.pricing, path: "/pricing" },
              ],
              locale
            )
          ),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(faqSchema(content.faq.items)),
        }}
      />
      <PricingPageView locale={locale} initialTab={initialTab} />
    </>
  );
}
