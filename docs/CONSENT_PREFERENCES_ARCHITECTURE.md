# Consent Preferences Architecture

Task 12 adds a provider-neutral helper at `src/lib/consent/preferences.ts`.

It supports reading, saving, resetting, category checks, forcing strictly necessary on, defaulting non-essential categories off, and dispatching `taskcover:consent-preferences-change`.

Preferences are stored in localStorage under `taskcover_cookie_preferences`.

## Task 16 Integration

Task 16 should load analytics only when `hasConsent("analytics")` is true and marketing or advertising tags only when `hasConsent("marketing")` is true. It should listen for preference changes, avoid PII in analytics payloads, and keep lead events provider-neutral until consent-aware providers are configured.

This is not a full consent banner or CMP. It is the preference architecture that a later banner and tag manager can consume.

