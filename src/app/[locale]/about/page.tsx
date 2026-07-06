import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { aboutStoryMetadata, AboutStoryPage } from "@/components/marketing/about/about-story-page";
import { isLocale, locales, type Locale } from "@/lib/i18n";

type LocalizedAboutProps = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return locales.filter((locale) => locale !== "en").map((locale) => ({ locale }));
}

export async function generateMetadata(props: LocalizedAboutProps): Promise<Metadata> {
  return aboutStoryMetadata(await localizedAboutLocale(props));
}

export default async function Page(props: LocalizedAboutProps) {
  const locale = await localizedAboutLocale(props);
  return <AboutStoryPage locale={locale} />;
}

async function localizedAboutLocale({ params }: LocalizedAboutProps): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale) || locale === "en") notFound();
  return locale;
}
