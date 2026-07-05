import { trustMetadata, TrustPage } from "@/components/marketing/trust/trust-pages";

export const metadata = trustMetadata("privacy-policy", "en");

export default function PrivacyPolicyPage() {
  return <TrustPage slug="privacy-policy" locale="en" />;
}

