import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { getLeadsContent } from "@/lib/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { safeThankYouType } from "@/lib/leads/schema";
import { ThankYouPageView } from "@/components/marketing/leads/lead-pages";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string | string[] }>;
};

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") return {};
  const content = getLeadsContent(localeParam);
  return buildMetadata({ title: content.thankYou.meta.title, description: content.thankYou.meta.description, path: "/thank-you", locale: localeParam, noIndex: true });
}

export default async function LocalizedThankYouPage({ params, searchParams }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") notFound();
  const locale = localeParam as Locale;
  const sp = await searchParams;
  const content = getLeadsContent(locale);
  const type = safeThankYouType(Array.isArray(sp.type) ? sp.type[0] : sp.type);
  return <ThankYouPageView content={content} locale={locale} type={type} />;
}
