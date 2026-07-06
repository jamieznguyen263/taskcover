# Accessibility Audit

Task 15 practical WCAG 2.2 AA-oriented launch pass. This is not legal certification.

## Summary

Source-level accessibility checks pass for core public components.

## Verified

- Global layout includes header, main, and footer landmarks.
- Header desktop and mobile menu toggles expose `aria-expanded` and `aria-controls`.
- Header Escape handling closes menus and returns focus to the mobile trigger.
- Language switcher exposes named listbox/list options and preserves only safe query params.
- Pricing tabs expose tab roles, selected state, panels, and keyboard navigation.
- Pricing full comparison remains collapsed through native `details`.
- Lead forms have labels, autocomplete, error summary, first-error focus, consent controls, and direct email fallback.
- Data Request now uses custom validation, accessible error summary, field-level `aria-invalid`, and first-error focus.
- Cookie Preference controls use labels and checkbox semantics.
- Radial search-surface nodes are buttons with labels, pressed state, and focus behavior.
- FAQ accordions use Radix primitives.
- Rendered launch QA found and then verified the `/services` duplicate SVG ID fix.
- Rendered launch QA passed 221 accessibility/performance/visual checks with 0 failures.

## Fixes Applied

- Improved Data Request validation accessibility.
- Scoped service SVG gradient IDs per visual to remove duplicate rendered IDs.
- Added `npm run a11y:check`.
- Added Vitest guardrails for menus, radial nodes, forms, cookie controls, and pricing tabs.

## Manual Review Remaining

- Keyboard smoke through full header mega menu, mobile menu, pricing tabs, forms, and cookie preferences in a real browser.
- Screen reader pass for form validation copy and language switcher announcement.
- Color contrast spot check after final staging render.
- Legal review for Privacy, Cookie, Terms, Accessibility, and Data Request content.
