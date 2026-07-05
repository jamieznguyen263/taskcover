import { trustMetadata, TrustPage } from "@/components/marketing/trust/trust-pages";

export const metadata = trustMetadata("about", "en");

export default function AboutPage() {
  return <TrustPage slug="about" locale="en" />;
}

