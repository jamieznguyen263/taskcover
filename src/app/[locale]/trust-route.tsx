import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { trustMetadata, TrustPage } from "@/components/marketing/trust/trust-pages";
import type { TrustPageSlug } from "@/content/trust";
import { isLocale, locales, type Locale } from "@/lib/i18n";

export type LocalizedTrustProps = { params: Promise<{ locale: string }> };

export function generateLocalizedTrustStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function localizedTrustMetadata(slug: TrustPageSlug, props: LocalizedTrustProps): Promise<Metadata> {
  const locale = await localizedTrustLocale(props);
  return trustMetadata(slug, locale);
}

export async function LocalizedTrustPage({ slug, props }: { slug: TrustPageSlug; props: LocalizedTrustProps }) {
  const locale = await localizedTrustLocale(props);
  return <TrustPage slug={slug} locale={locale} />;
}

async function localizedTrustLocale({ params }: LocalizedTrustProps): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return locale;
}

