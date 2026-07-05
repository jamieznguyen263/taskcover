import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { getLeadsContent } from "@/lib/content";
import { safeThankYouType } from "@/lib/leads/schema";
import { ThankYouPageView } from "@/components/marketing/leads/lead-pages";

type Props = { searchParams: Promise<{ type?: string | string[] }> };

export const metadata: Metadata = buildMetadata({
  title: getLeadsContent("en").thankYou.meta.title,
  description: getLeadsContent("en").thankYou.meta.description,
  path: "/thank-you",
  locale: "en",
  noIndex: true,
});

export default async function ThankYouPage({ searchParams }: Props) {
  const params = await searchParams;
  const content = getLeadsContent("en");
  const type = safeThankYouType(Array.isArray(params.type) ? params.type[0] : params.type);
  return <ThankYouPageView content={content} locale="en" type={type} />;
}
