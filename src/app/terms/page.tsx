import { trustMetadata, TrustPage } from "@/components/marketing/trust/trust-pages";

export const metadata = trustMetadata("terms", "en");

export default function TermsPage() {
  return <TrustPage slug="terms" locale="en" />;
}

