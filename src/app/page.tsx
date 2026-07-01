import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { HomeView } from "@/components/marketing/home/home-view";
import { getHomeContent } from "@/lib/content";

export const metadata: Metadata = buildMetadata({
  title: "SEO Agency for Google, AI Search & Revenue Growth",
  description:
    "Taskcover Agency helps ambitious brands grow organic visibility, build authority, improve AI search readiness, and convert high-intent search demand into measurable business outcomes.",
  path: "/",
  locale: "en",
});

export default function HomePage() {
  const home = getHomeContent("en");
  return <HomeView home={home} />;
}