import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProofHubView } from "@/components/marketing/proof/proof-hub-view";
import { buildMetadata, breadcrumbSchema, serializeJsonLd } from "@/lib/seo";
import { getProofContent } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales
    .filter((locale) => locale !== "en")
    .map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const content = getProofContent(locale);
  return buildMetadata({
    title: content.hub.metaTitle,
    description: content.hub.metaDescription,
    path: "/proof",
    locale,
  });
}

export default async function LocalizedProofHubPage({ params }: Params) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
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
              ],
              locale
            )
          ),
        }}
      />
      <ProofHubView locale={locale} />
    </>
  );
}
