import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/seo";
import { HomeView } from "@/components/marketing/home/home-view";
import { getHomeContent } from "@/lib/content";
import { locales, isLocale, type Locale } from "@/lib/i18n";

type Params = { params: Promise<{ locale: string }> };

/** Pre-render only the supported non-default locales (fr, es). */
export function generateStaticParams() {
  return locales
    .filter((l) => l !== "en")
    .map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const home = getHomeContent(locale);

  return buildMetadata({
    title: home.hero.headline,
    description: home.hero.subheadline,
    path: "/",
    locale,
  });
}

export default async function LocalizedHomePage({ params }: Params) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam) || localeParam === "en") {
    notFound();
  }
  const locale = localeParam as Locale;
  const home = getHomeContent(locale);
  return <HomeView home={home} />;
}