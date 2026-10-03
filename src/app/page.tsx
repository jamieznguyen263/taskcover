import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { DecisionHomeView } from "@/components/marketing/home/decision-home-view";

export const metadata: Metadata = buildMetadata({
  title: "Expert-led SEO, AI Search & Website Design",
  description: "Help the right people find, understand, and choose your business. Explore Taskcover’s approach to SEO, AI search, content, and website design.",
  path: "/",
  locale: "en",
});

export default function HomePage() {
  return <DecisionHomeView />;
}
