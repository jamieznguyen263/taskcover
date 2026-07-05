# Homepage Dashboard V2 Direction

Task 13B upgrades the homepage right-side visual from a generic analytics
dashboard into a more distinctive Taskcover Search Intelligence Cockpit.

## Current Baseline

The current dashboard is clean and on-brand, with:

- Top KPI row.
- Organic visibility trend chart.
- Score rows.
- Keyword opportunities.
- Intent distribution.
- Single illustrative disclosure.

Weaknesses found in rendered/code review:

- It still reads like a common SaaS analytics template.
- It uses hardcoded English labels on `/fr` and `/es`.
- It emphasizes passive reporting more than action prioritization.
- It does not yet tell the full search-growth story:
  Demand -> Visibility -> Authority -> AI Citations -> Lead Quality.

## V2 Concept

Name: Taskcover Search Intelligence Cockpit.

The cockpit should show a connected decision system:

1. Signal bar for quick health and movement.
2. Opportunity map for demand and intent clusters.
3. AI citation/entity panel.
4. Priority queue.
5. Revenue path rail.

This should stay light, premium, and illustrative. It must not imply real
client data or verified measured results.

## Dashboard Content Principles

- Use qualitative or illustrative labels, not fake client claims.
- Keep one disclosure: illustrative preview; verified client data is added only
  with permission.
- Localize all visible labels in EN/FR/ES.
- Use Taskcover green, emerald, teal, and blue.
- Avoid heavy chart dependencies beyond what already exists.
- Prefer CSS/SVG/HTML primitives over new client libraries.
- Keep decorative visuals hidden from screen readers where appropriate.

## V2 Modules

### Signal Bar

Signals:

- Search Demand
- Organic Visibility
- AI Citation Coverage
- Technical Health
- Revenue Intent

Each signal can include a status chip, tiny sparkline, and movement indicator.

### Opportunity Map

Central visual should feel like a search demand map instead of a generic line
chart. Suggested nodes:

- AI search audit
- Technical SEO
- International SEO
- Content authority
- PPC overlap

Node types can represent commercial, informational, and transactional intent.

### AI Citation / Entity Panel

Compact panel showing:

- Brand entity
- Source coverage
- Citation quality
- Answer-surface readiness
- Source gaps

This should communicate AI visibility readiness without claiming live
measurement.

### Priority Queue

Action rows:

- Fix crawl blockers
- Expand authority cluster
- Improve AI citation source coverage
- Test paid-organic landing page

Rows should show impact, effort, and status chips.

### Revenue Path Rail

Flow:

Query -> Landing Page -> Lead -> CRM -> Qualified Opportunity

This reinforces Taskcover's revenue-growth positioning.

## Mobile Direction

- Stack modules in a readable order.
- Avoid tiny chart axes and labels.
- Keep the signal bar as two-column cards or horizontal scroll only if needed.
- Preserve the disclosure.
- No horizontal overflow.

## Implementation Boundary

V2 should update the existing `SearchDashboardMockup` and localized homepage
content. It should not add a new chart library, new pages, or new data source.

## Implemented V2

Task 13B replaced the hardcoded chart mockup with a localized cockpit rendered
from `HomeContent.dashboard`.

Implemented modules:

- Signal cards for search demand, organic visibility, AI citation coverage,
  and technical health.
- Opportunity map with demand/intent nodes.
- Entity and citation coverage panel.
- Next sprint queue with impact and effort labels.
- Conversion path rail.
- One localized illustrative disclosure.

The component now uses CSS/SVG/motion primitives and removes visible
hardcoded English labels from `/fr` and `/es`. The data remains illustrative
and permission-bound, not real client performance reporting.
