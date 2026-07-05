import { trustMetadata, TrustPage } from "@/components/marketing/trust/trust-pages";

export const metadata = trustMetadata("methodology", "en");

export default function MethodologyPage() {
  return <TrustPage slug="methodology" locale="en" />;
}

