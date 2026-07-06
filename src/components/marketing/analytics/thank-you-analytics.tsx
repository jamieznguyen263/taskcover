"use client";

import * as React from "react";
import type { Locale } from "@/lib/i18n";
import type { LeadRequestType } from "@/lib/leads/types";
import { trackLeadEvent } from "@/lib/leads/analytics";

export function ThankYouAnalytics({ locale, requestType }: { locale: Locale; requestType: LeadRequestType | "contact" }) {
  React.useEffect(() => {
    trackLeadEvent("thank_you_view", {
      formType: requestType,
      requestType,
      locale,
      pagePath: typeof window !== "undefined" ? window.location.pathname : "/thank-you",
    });
  }, [locale, requestType]);

  return null;
}
