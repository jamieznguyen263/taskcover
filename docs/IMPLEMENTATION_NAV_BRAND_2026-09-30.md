# Taskcover navigation and brand foundation

Date: 2026-09-30
Status: implementation draft, not merged or deployed
Base commit: 6371d4914051b745570a9b56e167b6fad7e2fa89
Architecture: [Sitemap v1.1](https://chatgpt.com/space/page_477d89a6a0188191afdda91164db1c81)

## Implemented in this branch

- Header follows Services, Our Work, How We Work, Insights, About, with a Contact CTA. Services and Work have click/touch disclosures.
- EN/FR/ES share the same navigation destinations while retaining localized labels and the existing locale resolver.
- Five core services use the approved labels and their existing URLs. All twelve service destinations remain in the footer.
- Every previous footer destination is retained. Added hub links and the existing SEO Mentor article category; reorganized into six readable groups.
- Footer uses one column on small phones, two from 400px, and three within its link region on large screens. The original logo is retained.
- Shared CTA uses green/emerald with dark text. Raw logo gradient colors remain unchanged. Added semantic link, selected, focus and action tokens.
- Outline CTA no longer inherits the primary gradient fill.
- Removed off-brand header chip colors. Added current-location semantics. Escape returns focus to the actual desktop disclosure; focus leaving the header closes menus.
- siteConfig navigation reuses sharedNav.
- Added the architecture document to the repository as a snapshot; its status statements describe the architecture review before this implementation branch.

## Verification performed

- Parsed all three generated navigation data objects and checked the five top-level destinations and two disclosure groups.
- Compared previous/new footer destination sets: no existing destination removed in any locale.
- Reviewed the React changes for stable keys, effect cleanup, locale routing, keyboard handling and native links/buttons. No new packages.
- Computed text contrast from the actual sRGB colors: primary label 10.67:1 on green, 7.97:1 on emerald, 5.79:1 on the darker active endpoint; link text on white 5.80:1; selected text on selected surface 5.48:1. These are color calculations, not browser/a11y certification.
- Updated the existing navigation assertions; added regression scenarios for desktop Escape focus and focus leaving the header.
- Local process startup failed with sandbox provisioning failed. Typecheck, Vitest, build and browser verification have NOT run. AGENTS.md points to installed Next docs, which were inaccessible with the local runtime; the official Next 16.2.9 use-client guide and current Link/usePathname references were consulted.

## Remaining before merge

1. Compare this branch with local unpushed work before integrating. Do not overwrite the approved Decision Studio or homepage prototype.
2. Run npm run typecheck, focused tests for site-navigation and site-header, then npm run build using the existing lockfile.
3. Verify navigation and footer at 375, 768, 1280 and 1440 widths, plus 200% zoom, for EN/FR/ES. Test touch, Tab, Escape, outside click, route transitions and language switching.
4. Inspect shared CTA consumers for custom classes that override the new semantic colors.
5. Homepage v3 has since been recovered and ported on this branch. See IMPLEMENTATION_HOMEPAGE_V3_2026-09-30.md for the implementation and outstanding validation.
6. Add Engagements links only when that route is implemented. This branch deliberately links only existing routes.
7. Verify the new English homepage sections and real forms/booking before publishing; translate v3 for FR/ES.

This slice changes shared navigation and CTA styling, so the existing remote homepage also picks up those shared elements. The subsequent homepage integration covers the v3 hero and experience; this foundation document does not claim to fix every color in every page. Admin, Flow, APIs, prices, redirects, schemas and deployment configuration are untouched.
