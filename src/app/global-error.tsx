"use client";

import { GlobalErrorView } from "@/components/marketing/trust/trust-pages";
import { getLocaleFromPathname } from "@/lib/i18n";

export default function GlobalError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  const locale = typeof window === "undefined" ? "en" : getLocaleFromPathname(window.location.pathname);
  return (
    <html lang={locale}>
      <body>
        <GlobalErrorView locale={locale} onRetry={unstable_retry} />
      </body>
    </html>
  );
}

