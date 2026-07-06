"use client";

import * as React from "react";
import { getConsentPreferences, onConsentChange, type ConsentPreferences } from "@/lib/consent/preferences";

export function useConsentPreferences(): ConsentPreferences | null {
  return React.useSyncExternalStore(
    onConsentChange,
    getConsentPreferences,
    () => null
  );
}
