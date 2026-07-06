# Consent Preferences Architecture

The provider-neutral helper lives at `src/lib/consent/preferences.ts`.

It supports reading, saving, resetting, category checks, forcing strictly
necessary on, defaulting non-essential categories off, dispatching
`taskcover:consent-preferences-change`, and mapping the state to a Google
Consent Mode-style object.

Preferences are stored in localStorage under `taskcover_cookie_preferences`.

## Task 16 Model

Categories:

- `strictly_necessary`: always enabled.
- `preferences`: non-essential UI/browser choices.
- `analytics`: GA4/GTM measurement.
- `marketing`: ad conversion measurement and future marketing tags.

Saved state includes category decisions, version, locale, source, region mode,
timestamp, and updated time. It does not store identity.

## Shared UI

The consent banner and `/cookie-preferences` page use this same helper. The
banner is now the public first-choice UI; the preferences page remains the
long-form management UI with save and reset controls.

Analytics loads only when `hasConsent("analytics")` is true. Google Ads
conversion readiness requires `hasConsent("marketing")`. GTM IDs, conversion
labels, GA4 setup, and ad providers remain environment-driven and empty by
default.

This architecture is not a legal compliance certification. Final legal review
is still required before launch.
