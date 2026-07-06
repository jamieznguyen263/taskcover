# SEM Measurement Plan

Task 16 prepares consent-aware SEM measurement. It does not deploy production,
modify DNS, activate live ads, or configure provider secrets.

## Measurement Stack

- Consent helper: `src/lib/consent/preferences.ts`
- Banner: `src/components/marketing/analytics/consent-banner.tsx`
- DataLayer and GTM helper: `src/lib/analytics/data-layer.ts`
- Event taxonomy: `src/lib/analytics/events.ts`
- Sanitizer: `src/lib/analytics/sanitize.ts`
- Attribution: `src/lib/analytics/attribution.ts`
- Google Ads readiness: `src/lib/analytics/google-ads.ts`

## Consent Required

- Analytics events require analytics consent.
- Google Ads conversion readiness requires marketing consent.
- GTM requires `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GTM_ENABLED` not false, and
  analytics or marketing consent.
- Attribution storage requires analytics or marketing consent.

## UTM Convention

Recommended convention:

- `utm_source`: `google`, `microsoft`, `linkedin`, `newsletter`, or partner
- `utm_medium`: `cpc`, `paid-social`, `organic-social`, `email`, or referral
- `utm_campaign`: lowercase campaign family plus market, e.g.
  `seo-agency-us`
- `utm_content`: ad group or creative variant
- `utm_term`: keyword or audience theme where available

Captured keys:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `gclid`
- `gbraid`
- `wbraid`
- `msclkid`

`fbclid` and `li_fat_id` are intentionally not captured in Task 16.

Attribution retention is 60 days. Raw click IDs are not pushed into dataLayer.

## Microsoft Ads And LinkedIn

Reserved public variables:

- `NEXT_PUBLIC_MICROSOFT_UET_ID`
- `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`

Default is disabled. Do not load Microsoft UET or LinkedIn Insight Tag until
provider configuration, consent rules, and legal review are complete.

## QA Before SEM Go-Live

1. Confirm consent banner EN/FR/ES copy and controls.
2. Confirm reject non-essential prevents GTM and event pushes.
3. Confirm accept all permits configured GTM only on public routes.
4. Confirm marketing-denied blocks Google Ads conversion readiness.
5. Confirm missing Google Ads ID/label blocks conversion readiness.
6. Confirm lead success events fire only after durable acceptance.
7. Confirm thank-you direct visits emit only supporting view events.
8. Confirm no PII appears in dataLayer.
9. Confirm Admin, API, preview, invite, internal, and debug routes are excluded.
10. Complete legal and provider review. This plan is not a compliance
    certification.
