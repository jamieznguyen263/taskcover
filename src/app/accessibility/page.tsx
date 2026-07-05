import { trustMetadata, TrustPage } from "@/components/marketing/trust/trust-pages";

export const metadata = trustMetadata("accessibility", "en");

export default function AccessibilityPage() {
  return <TrustPage slug="accessibility" locale="en" />;
}

