import { trustMetadata, TrustPage } from "@/components/marketing/trust/trust-pages";

export const metadata = trustMetadata("cookie-preferences", "en");

export default function CookiePreferencesPage() {
  return <TrustPage slug="cookie-preferences" locale="en" />;
}

