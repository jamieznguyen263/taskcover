# Taskcover Global UI / IA Audit

Task 13B pre-implementation audit. Reviewed after pulling `origin/main` to
`98c1b4b`.

## Reviewed Sources

- Local Next 16 docs for App Router linking, client boundaries, and CSS before
  editing.
- Existing standards: homepage vibe, site architecture, SEO, i18n, commercial
  SEO architecture, keyword-to-URL map, cannibalization audit, internal linking,
  SEM readiness, visitor readiness, trust/legal, lead funnel, Insights, Work,
  and Proof standards.
- Rendered local routes on `http://127.0.0.1:3000`, including homepage,
  localized homepages, services, industries, markets, Work, Proof, case studies,
  sample audits, Insights, lead funnel, trust/legal pages, and a 404 route.
- Key implementation files:
  `src/components/marketing/layout/site-header.tsx`,
  `src/components/marketing/layout/site-footer.tsx`,
  `src/components/marketing/home/search-dashboard-mockup.tsx`,
  `src/content/{en,fr,es}/site.ts`, and
  `src/content/{en,fr,es}/home.ts`.

## Current Strengths

- Public routes are broad and mature across EN/FR/ES, with localized metadata,
  canonical/hreflang generation, and sitemap inclusion.
- Services, industries, markets, Work, Proof, Insights, lead funnel, and trust
  pages already use shared templates, which keeps section rhythm consistent
  without page-by-page hacks.
- Page families generally follow the bright premium system: white and soft
  surfaces, green/teal/blue accents, semantic sections, and restrained motion.
- Case studies and proof pages respect the verified-proof rules. No new fake
  testimonials, awards, or unsupported ratings were observed in the reviewed
  components.
- Lead funnel and trust/legal pages keep Data Request separate from sales CTAs.
- Task 13 commercial SEO ownership is documented and enforced by a typed URL
  intent map and tests.

## Current Weaknesses

- Header IA is still flat: Services, Industries, Markets, Work, Proof,
  Insights, About. This makes the site feel wider than necessary and does not
  match the requested buyer mental model.
- Mobile navigation is a single long link list. It exposes important routes but
  does not group services, solutions, proof, company, and insights in a
  scannable way.
- Footer grouping still mirrors the old IA with separate Industries, Markets,
  and Proof columns. Legal links are present, but the grouping is dense.
- Homepage dashboard is polished but still resembles a generic SaaS analytics
  dashboard: KPI row, trend chart, score rows, keyword list, and intent bars.
- The homepage dashboard contains hardcoded English labels that render on
  `/fr` and `/es` (`Search Intelligence Command Center`, `Organic visibility
  trend`, `Keyword opportunities`, and the illustrative disclosure).
- Homepage hero proof line still uses "selected team and partner experience"
  wording, which is safe in the proof standard but weaker beside the new public
  verified case-study system.
- Some interactive page-family selectors use hover/focus to change active
  panels. They also have click handlers, so they are usable, but this reinforces
  the need for stronger explicit mobile nav behavior.

## Navigation Clarity

The requested top-level IA should reduce cognitive load:

- Services: capability selection.
- Solutions: Industries plus Markets.
- Work: Work plus Proof and private reference path.
- Insights: editorial/category navigation.
- Company: About, Methodology, How We Work, Contact, Accessibility, Data
  Request.
- Header CTA: Free SEO Audit.

This preserves every existing route and moves Proof from top-level navigation
to a Work mega-menu group.

## Page Hierarchy

Rendered route checks returned 200 for all representative public routes and 404
for a missing route. One H1 per page is handled by page templates. The main
hierarchy issue is not route-level SEO, but navigation hierarchy: old header
labels present peer-level Industries/Markets/Proof/About even though Task 13
now treats Industries and Markets as solution support, Proof as Work support,
and trust/legal as footer-first.

## Repeated UI Patterns

Shared templates already protect most page families from repeating identical
sections within a single page. The main repeated pattern still visible across
families is the final rounded CTA panel with audit preview rows. This is safe
because it is a global conversion primitive, but it should not be expanded into
more pages during this task.

## Spacing And Visual Rhythm

- Section rhythm is generally strong through the shared `Section` component.
- Header dropdowns and mobile navigation need their own spacing rules so the
  new IA does not feel like a link dump.
- Footer needs denser but clearer grouping, with Work/Proof and
  Solutions/Markets consolidated.

## Mobile Issues

- Current mobile header has a hamburger and language switcher, but no accordion
  groups.
- Mobile menu does not lock or manage focus while open.
- Route selection closes the menu, but Escape and outside-click behavior are
  not implemented for the mobile menu.
- Long FR/ES labels need grouped rows and compact descriptions to avoid
  horizontal overflow.

## CTA Consistency

- Services and industry pages generally route to localized Free SEO Audit plus
  Book Strategy Call.
- Work/Proof routes use Book Strategy Call and private reference where
  appropriate.
- Contact includes Data Request as privacy context, not a sales CTA.
- The header should keep a single premium Free SEO Audit CTA. Mega-menu
  contextual CTAs can point to localized Free SEO Audit or private reference
  paths without making every link identical.

## Pages Requiring Minor Polish

- Homepage hero dashboard and proof line.
- Header and mobile navigation.
- Footer grouping and density.
- Work/Proof navigation labels after Proof moves under Work.
- Insights mega-menu labels that map to existing category routes.

## Pages Not Changed In This Task

- No new commercial SEO pages.
- No route deletions, route merges, canonical changes, or keyword ownership
  changes.
- No Admin authentication, provider secrets, migrations, analytics, GTM, GA4,
  ads, cookie banner, deployment, or DNS work.
- No fake proof, testimonials, awards, offices, rankings, or metrics.

## Initial Route Review

Representative routes checked locally before implementation:

- Home: `/`, `/fr`, `/es`.
- Services: `/services` plus six service detail pages.
- Industries: `/industries` plus five industry detail pages.
- Markets: `/markets`, `/markets/usa-seo-agency`,
  `/markets/canada-seo-agency`, `/markets/australia-seo-agency`.
- Work/Proof: `/work`, `/proof`, `/work/case-studies`, two case studies,
  `/work/sample-audits`, two sample audits.
- Insights: `/insights`, two category pages, three articles.
- Lead/trust/legal: `/free-seo-audit`, `/book-a-call`, `/contact`,
  `/data-request`, `/about`, `/methodology`, `/how-we-work`,
  `/privacy-policy`, `/cookie-policy`, `/terms`, `/cookie-preferences`.
- 404: `/missing-taskcover-route`.

All representative public routes returned expected statuses on the local dev
server. Post-edit QA must rerun route checks from a fresh build.

## Post-Implementation Notes

Task 13B implemented the audit recommendations without route architecture
changes:

- Header IA now uses five grouped top-level entries: Services, Solutions,
  Work, Insights, and Company.
- Desktop navigation renders localized mega-menu groups from
  `src/content/{en,fr,es}/site.ts`.
- Mobile navigation now mirrors the same IA with accordion groups, Escape
  handling, focus movement into the menu, route-close behavior, and a retained
  language switcher.
- Footer groups now consolidate old Industries/Markets under Solutions and
  old Proof links under Work, with a separate Legal column.
- Homepage hero dashboard now renders a localized Search Growth Cockpit:
  signals, opportunity map, entity/citation coverage, sprint queue, conversion
  path, and one illustrative disclosure.
- Homepage hero proof line now points to verified case-study coverage rather
  than selected-experience brand wording.
- `src/content/site-navigation.test.ts` now guards the top-level IA, localized
  nested links, footer legal visibility, dashboard localization, and duplicate
  root-level commercial URL avoidance.
