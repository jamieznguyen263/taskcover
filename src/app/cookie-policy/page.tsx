import { trustMetadata, TrustPage } from "@/components/marketing/trust/trust-pages";

export const metadata = trustMetadata("cookie-policy", "en");

export default function CookiePolicyPage() {
  return <TrustPage slug="cookie-policy" locale="en" />;
}

