# Navigation And Mega Menu Architecture

Task 13B defines a new global navigation IA without creating or removing any
public routes.

## Top-Level Header IA

Desktop header top-level items:

- Services
- Solutions
- Work
- Insights
- Company
- Get Free SEO Audit

The language switcher remains visible. English remains unprefixed; French and
Spanish use `/fr` and `/es` with English slugs.

## Services Menu

Buyer need grouping:

- SEO Strategy & Audit
- Technical SEO
- AI Search / GEO
- Content Authority
- Local & International SEO
- PPC Management
- SEO Mentor

Contextual CTA:

- EN: Not sure what you need? Start with a Free SEO Audit.
- FR/ES equivalents are stored in localized site content.

## Solutions Menu

Solutions groups existing Industries and Markets routes.

By Industry:

- Travel & Hospitality
- Education
- Healthcare & Wellness
- Legal & Immigration
- SaaS & Technology
- eCommerce
- Franchise & Multi-location

By Market:

- USA
- Canada
- Australia
- International SEO / Multi-market search

No industry or market route changes are allowed.

## Work Menu

Work groups delivery, proof, examples, and private-reference routes:

- Work hub
- Case Studies
- Sample Audits
- Client Results
- Proof System
- Search Growth Frameworks
- Private Reference Request

`/proof` remains live but is no longer a top-level header item.

## Insights Menu

Links to existing Insights category routes:

- SEO Guides
- AI Search & GEO
- Technical SEO
- Content Authority
- Local & International SEO
- PPC & Search Intelligence
- SEO Mentor

## Company Menu

Company includes trust and contact routes:

- About
- Methodology
- How We Work
- Contact
- Accessibility
- Data Request

Legal pages remain primarily in the footer:

- Privacy Policy
- Cookie Policy
- Cookie Preferences
- Terms

## Desktop Behavior

- Menus open on hover, focus, and click.
- Escape closes the menu.
- Click outside closes the menu.
- Route selection closes the menu.
- Active top-level menu indicates open state with `aria-expanded`.
- Menus use practical columns and concise descriptions.
- Menu panel width is constrained; it should not cover the whole viewport.
- No dark menu surfaces.
- Reduced motion is respected through CSS and simple transitions.

## Mobile Behavior

- Hamburger opens a full-width mobile panel.
- Close button and Escape close the menu.
- Focus moves into the menu on open and back to the trigger on close.
- Accordion groups mirror desktop top-level IA.
- CTA remains visible above or below the accordion groups.
- Language switcher remains accessible.
- Selecting any link closes the menu.
- The panel can scroll if content exceeds viewport height.
- No hover-only interaction.

## Accessibility Notes

- Header remains a semantic `header` with primary `nav`.
- Mega-menu triggers are buttons, not links without behavior.
- Menu links are regular Next `Link` anchors for client navigation.
- Focus states use the global brand focus ring.
- Touch targets stay around 44px.
- Decorative dashboard/menu details must remain `aria-hidden`.

## SEO Safety

The navigation is an internal-linking improvement only. It does not change:

- Canonical URLs.
- Hreflang.
- Sitemap generation.
- Keyword-to-URL primary ownership.
- Public route indexability.
- Admin/preview/thank-you exclusion.

## Implemented Sources

Task 13B implementation lives in:

- `src/content/en/site.ts`, `src/content/fr/site.ts`, and
  `src/content/es/site.ts` for localized top-level navigation, mega-menu
  groups, contextual CTAs, and regrouped footer links.
- `src/lib/content.ts` for localized nested `megaMenu` and footer hrefs.
- `src/components/marketing/layout/site-header.tsx` for desktop flyouts and
  mobile accordions.
- `src/components/marketing/layout/site-footer.tsx` for consolidated footer
  group rendering.
- `src/components/marketing/layout/language-switcher.tsx` for localized
  language labels.
- `src/content/site-navigation.test.ts` for IA and route-safety tests.
