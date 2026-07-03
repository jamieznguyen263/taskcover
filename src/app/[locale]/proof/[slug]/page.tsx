import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProofPageTemplate } from "@/components/marketing/proof/proof-page-template";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import {
  getProofContent,
  getProofPageBySlug,
  getProofPageSlugs,
  type ProofPageSlug,
} from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  const slugs = getProofPageSlugs();
  return locales
    .filter((locale) => locale !== "en")
    .flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const page = getProofPageBySlug(slug, locale);
  if (!page) return {};
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: `/proof/${page.slug}`,
    locale,
  });
}

export default async function LocalizedProofDetailPage({ params }: Params) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const page = getProofPageBySlug(slug, locale);
  if (!page) notFound();
  const content = getProofContent(locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema(
              [
                { name: content.ui.home, path: "/" },
                { name: content.ui.proof, path: "/proof" },
                { name: page.label, path: `/proof/${page.slug}` },
              ],
              locale
            )
          ),
        }}
      />
      <ProofPageTemplate slug={page.slug as ProofPageSlug} locale={locale} />
    </>
  );
}
