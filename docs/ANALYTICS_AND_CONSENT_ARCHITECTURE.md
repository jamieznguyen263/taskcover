# Analytics And Consent Architecture

Task 16 adds a consent-aware measurement layer without deploying production,
changing DNS, activating ads, or committing provider IDs.

## Consent Model

The shared helper is `src/lib/consent/preferences.ts`.

Categories:

- `strictly_necessary`: always enabled for security, forms, Admin sessions,
  preferences, anti-spam, rate limiting, and basic functionality.
- `preferences`: non-essential browser UI choices.
- `analytics`: GA4/GTM-safe analytics measurement.
- `marketing`: Google Ads conversion measurement and future ad tags.

Saved state includes category decisions, version, locale, source
(`banner`, `preferences_page`, or `reset`), `global` region mode, timestamp,
and updated time. It does not store identity.

Preferences are localStorage-only under `taskcover_cookie_preferences`.

## Banner And Preferences

`ConsentAnalyticsManager` renders:

- `ConsentBanner`
- `AnalyticsDebugPanel` in development or when
  `NEXT_PUBLIC_ANALYTICS_DEBUG=true`

The banner appears on public routes when no saved choice exists. It is excluded
from Admin, API, preview, invite, internal, and debug routes. Non-essential
categories default off. Accept all, reject non-essential, and customize actions
write through the same helper used by `/cookie-preferences`.

## GTM Loading

GTM is controlled by `src/lib/analytics/data-layer.ts`.

Rules:

- `NEXT_PUBLIC_GTM_ID` is required.
- `NEXT_PUBLIC_GTM_ENABLED=false` disables loading.
- GTM never loads on excluded routes.
- GTM does not load until analytics or marketing consent exists.
- DataLayer pushes are centralized through `pushDataLayerEvent`.

No GTM ID, GA4 ID, Google Ads ID, conversion label, secret, token, or API key is
hardcoded.

## Consent Mode Mapping

Default before choice:

- `security_storage`: granted
- `functionality_storage`: denied
- `analytics_storage`: denied
- `ad_storage`: denied
- `ad_user_data`: denied
- `ad_personalization`: denied

After choice:

- analytics controls `analytics_storage`
- marketing controls `ad_storage`, `ad_user_data`, and `ad_personalization`
- preferences controls `functionality_storage`
- security remains granted

This is an implementation plan and technical guardrail, not a legal compliance
certification. Final legal and provider review remains required before launch.

## Route Exclusions

Tracking excludes Admin, API, internal, invite, preview, debug, and `_next`
paths. Thank-you pages can emit a supporting `thank_you_view` only; they never
emit primary conversion success.

## Debug QA

The debug panel shows only:

- consent set/unset
- category booleans
- GTM configured yes/no
- analytics and marketing allowed yes/no
- last safe event name
- dataLayer availability

It does not show secrets, IDs, PII, provider references, or raw click IDs.

## Task 17 Status

`production:check` reports Consent Mode readiness as configured and GTM/GA4/Google Ads as not required in the current mode because GTM is disabled and IDs are unset. This is acceptable for staging readiness, but browser QA must still confirm:

- default denied Consent Mode before choice
- GTM does not load before analytics or marketing consent
- no tracking on Admin, API, preview, invite, internal, debug, or `_next` routes
- no PII or raw click IDs in `dataLayer`
