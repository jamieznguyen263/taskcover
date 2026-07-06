# SEM Landing Page Readiness

Task 16 prepares SEM measurement but does not activate campaigns, deploy
production, change DNS, or configure live provider IDs.

## Measurement Rules

- Primary conversions are accepted leads, not page views or button clicks.
- Thank-you page views are supporting events only.
- Pricing tab engagement is secondary, never a primary conversion.
- Analytics events require analytics consent.
- Google Ads conversion readiness requires marketing consent plus configured
  Google Ads ID and conversion label.
- No PII, raw click IDs, full query URLs, provider IDs, or CRM deal IDs belong
  in dataLayer.

## Campaign Measurement Map

| Campaign family | Primary landing page | Primary CTA | Primary conversion event | Secondary events | Consent required | UTM convention | Google Ads conversion action | Lead quality follow-up | CRM lifecycle stage | Offline conversion candidate |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Brand | `/` | Book Strategy Call | `strategy_call_request_success` | `cta_click`, `lead_form_start` | analytics for events, marketing for Ads | `utm_campaign=brand-{market}` | Strategy Call request accepted | confirm fit and source quality | New lead -> Contacted | Qualified / call booked |
| SEO Agency | `/services/seo-agency` | Get Free SEO Audit | `free_audit_request_success` | `cta_click`, `lead_form_start`, `lead_form_step_complete` | analytics, marketing for Ads | `utm_campaign=seo-agency-{market}` | Free SEO Audit accepted | audit quality and service fit | New lead -> Qualified | Qualified / proposal sent |
| Local SEO | `/services/local-seo` | Get Free SEO Audit | `free_audit_request_success` | `service_slug`, `market_slug`, `cta_click` | analytics, marketing for Ads | `utm_campaign=local-seo-{market}` | Free SEO Audit accepted | validate local footprint and market | New lead -> Qualified | Qualified |
| National SEO | `/services/seo-agency` | Get Free SEO Audit | `free_audit_request_success` | `cta_click`, `sample_audit_view` | analytics, marketing for Ads | `utm_campaign=national-seo-{market}` | Free SEO Audit accepted | check multi-market scope | New lead -> Qualified | Opportunity |
| Global SEO | `/services/international-seo` | Book Strategy Call | `strategy_call_request_success` | `cta_click`, `market_slug` | analytics, marketing for Ads | `utm_campaign=global-seo-{market}` | Strategy Call request accepted | verify international markets and resources | New lead -> Qualified | Opportunity |
| SEO Audit | `/free-seo-audit` | Submit audit request | `free_audit_request_success` | `lead_form_view`, `lead_form_start`, `lead_form_step_complete`, `lead_form_validation_error` | analytics, marketing for Ads | `utm_campaign=seo-audit-{market}` | Free SEO Audit accepted | score audit scope and urgency | New lead -> Qualified | Qualified |
| Technical SEO | `/services/technical-seo` | Get Free SEO Audit | `free_audit_request_success` | `sample_audit_view`, `cta_click` | analytics, marketing for Ads | `utm_campaign=technical-seo-{market}` | Free SEO Audit accepted | confirm technical access and issue severity | New lead -> Qualified | Opportunity |
| AI Search / GEO | `/services/ai-search-optimization` | Get Free SEO Audit | `free_audit_request_success` | `sample_audit_view`, `insight_article_view` | analytics, marketing for Ads | `utm_campaign=ai-search-geo-{market}` | Free SEO Audit accepted | assess AI visibility need and authority gap | New lead -> Qualified | Opportunity |
| PPC Management | `/services/ppc-management` | Book Strategy Call | `strategy_call_request_success` | `cta_click`, `pricing_tab_view` | analytics, marketing for Ads | `utm_campaign=ppc-management-{market}` | Strategy Call request accepted | qualify ad spend, tracking access, and SEO/PPC fit | New lead -> Qualified | Opportunity |
| SEO Mentor | `/services/seo-mentor-service` | Book Strategy Call | `strategy_call_request_success` | `pricing_tab_view`, `pricing_decision_select`, `cta_click` | analytics, marketing for Ads | `utm_campaign=seo-mentor-{market}` | Strategy Call request accepted | confirm advisory scope and team maturity | New lead -> Contacted | Call booked |
| Market-specific SEO | `/markets/usa-seo-agency`, `/markets/canada-seo-agency`, `/markets/australia-seo-agency` | Book Strategy Call | `strategy_call_request_success` | `market_slug`, `cta_click`, `lead_form_start` | analytics, marketing for Ads | `utm_campaign=market-seo-{market}` | Strategy Call request accepted | confirm market priority and no fake local-office claims | New lead -> Qualified | Opportunity |
| Industry-specific SEO | `/industries/[slug]` | Get Free SEO Audit | `free_audit_request_success` | `industry_slug`, `cta_click`, `case_study_view` | analytics, marketing for Ads | `utm_campaign=industry-seo-{industry}-{market}` | Free SEO Audit accepted | confirm vertical fit and proof needs | New lead -> Qualified | Qualified / proposal sent |

## Readiness Status

Strongest launch candidates after provider activation:

- `/free-seo-audit`
- `/services/seo-agency`
- `/services/seo-audit`
- `/services/technical-seo`
- `/pricing` for decision-stage traffic only

Manual steps before go-live:

1. Complete legal review of consent, privacy, cookie, and ad-measurement copy.
2. Configure GTM, GA4, and Google Ads IDs in environment settings.
3. Configure conversion labels in Google Ads and GTM.
4. QA consent denied, analytics-only, marketing-only, and accept-all states.
5. Validate no PII in browser dataLayer.
6. Confirm CRM/offline conversion stages before optimizing bids.
