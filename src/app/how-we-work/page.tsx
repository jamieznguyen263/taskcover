import { trustMetadata, TrustPage } from "@/components/marketing/trust/trust-pages";

export const metadata = trustMetadata("how-we-work", "en");

export default function HowWeWorkPage() {
  return <TrustPage slug="how-we-work" locale="en" />;
}

