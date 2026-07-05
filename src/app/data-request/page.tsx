import { trustMetadata, TrustPage } from "@/components/marketing/trust/trust-pages";

export const metadata = trustMetadata("data-request", "en");

export default function DataRequestPage() {
  return <TrustPage slug="data-request" locale="en" />;
}

