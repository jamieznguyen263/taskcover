import { aboutStoryMetadata, AboutStoryPage } from "@/components/marketing/about/about-story-page";

export const metadata = aboutStoryMetadata("en");

export default function AboutPage() {
  return <AboutStoryPage locale="en" />;
}
