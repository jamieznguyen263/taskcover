"use client";

import * as React from "react";
import { getAnalyticsRuntimeStatus } from "@/lib/analytics/data-layer";
import { useConsentPreferences } from "./use-consent-preferences";

export function AnalyticsDebugPanel() {
  const enabled = process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true";
  const preferences = useConsentPreferences();
  const [tick, setTick] = React.useState(0);

  React.useEffect(() => {
    if (!enabled) return;
    const onEvent = () => setTick((value) => value + 1);
    window.addEventListener("taskcover:analytics-event", onEvent);
    return () => {
      window.removeEventListener("taskcover:analytics-event", onEvent);
    };
  }, [enabled]);

  if (!enabled) return null;
  const status = getAnalyticsRuntimeStatus(preferences);

  return (
    <aside
      aria-label="Analytics debug status"
      className="fixed bottom-4 right-4 z-[70] max-w-[calc(100vw-2rem)] rounded-2xl border border-line bg-white/95 p-3 text-xs text-secondary shadow-xl backdrop-blur"
      data-analytics-debug-panel
    >
      <p className="font-semibold text-graphite">Analytics debug</p>
      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <dt>Consent</dt><dd>{preferences ? "set" : "unset"}</dd>
        <dt>Preferences</dt><dd>{String(preferences?.preferences ?? false)}</dd>
        <dt>Analytics</dt><dd>{String(status.analyticsAllowed)}</dd>
        <dt>Marketing</dt><dd>{String(status.marketingAllowed)}</dd>
        <dt>GTM</dt><dd>{status.gtmConfigured ? "configured" : "missing"}</dd>
        <dt>dataLayer</dt><dd>{status.dataLayerAvailable ? "available" : "absent"}</dd>
        <dt>Last event</dt><dd>{status.lastSafeEventName || "none"}</dd>
        <dt>Refresh</dt><dd>{tick}</dd>
      </dl>
    </aside>
  );
}
