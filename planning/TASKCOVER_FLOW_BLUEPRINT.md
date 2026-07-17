# Taskcover Flow — Blueprint

Canonical product definition for Taskcover Flow, the internal agency project-management
system. This document is the source of truth for scope decisions across all FLOW-XXX
implementation slices. If a future change contradicts this document, update this document
first, in its own reviewed change.

## Product objective

Taskcover Flow is an internal project-management and agency-operation system for a
Taskcover-sized company (fewer than 50 people): CEO/Owner, Admin, Managers, internal staff,
freelancers, and agency partners.

Guiding principle:

> Client provides context. Project provides scope. Work provides execution. Inbox provides
> attention.

Taskcover Flow must combine clear task ownership, client-centered project context,
lightweight documents, fast work-attached communication, simple role-based access, templates
and smart defaults, and a polished, fast, modern interface. It must not become a heavy clone
of Asana, ClickUp, Notion, Slack, or a generic no-code platform.

## Locked scope — v1 core entities

Five primary concepts, and no more, in v1:

- **Client** — basic info, contacts, Account Manager, services, projects, work, documents,
  activity, explainable client health.
- **Project** — a specific goal, delivery cycle, or internal initiative
  (e.g. "Vivagen — SEO August 2026", "Taskcover — Next 50 Articles"). No Program, Portfolio,
  Campaign, Engagement, or Workstream entities in v1.
- **Work** — one unified object with display types: Task, Deliverable, Request, Approval,
  Milestone. Every Work item has exactly one accountable Owner, plus optional Contributors,
  Reviewer, and Watchers.
- **Document** — Strategy, Brief, Meeting note, SOP, Report, Proposal, Research, Decision,
  General document.
- **Inbox** — actionable items: Assignment, Mention, Feedback, Review request, Approval
  request, Deadline warning, Waiting reminder, External collaborator update, System warning.
  Inbox actions must be completable without forcing users through multiple pages.

## Workflow — five canonical statuses

All work uses exactly these statuses, company-wide. Departments do not get custom status
sets in v1.

```
To do
In progress
Waiting
Review
Done
```

### Waiting behavior (decision preserved, not implemented until later waves)

When work enters `Waiting`, the system will eventually require **"Waiting for whom?"**,
targeting one of: Client, Manager, Teammate, Freelancer, Partner, External party. The system
will record who/what is being waited on, surface it in a Waiting section, remind the
relevant person, escalate items waiting too long, and clear the waiting state when a
response arrives. FLOW-001 does not implement any of this — it is recorded here so later
slices build the same shape.

## User types

Internal: Owner, Admin, Manager, Member.
External collaborators: Freelancer, Partner Manager, Partner Member, Read-only Guest.

Job title (CEO, SEO Manager, Writer, Developer, Client Success Manager, ...) is separate
from access level and is never hardcoded into the authorization system.

## External collaborator rules (decision preserved for FLOW-003)

Freelancers and partners get project-scoped access only: shared projects, assigned work,
shared documents/files/comments. They never see other clients/projects, client financial
data, internal notes, internal staff discussion, team workload, administration, the Content
CMS, or company-wide reports. Every external membership must eventually support access
start/expiry dates, download/upload permissions, manual revoke, and automatic expiry.
Internal vs. shared comments must be visibly distinct. None of this is implemented in
FLOW-001.

## Navigation

Internal sidebar (target end-state):

```
Home
Inbox
Clients
Projects
Docs
```

Owner and Admin additionally see:

```
Administration
Content CMS   -> links to the existing /admin route
```

External collaborator navigation (future, FLOW-003):

```
Home
Inbox
My Work
Shared Projects
Shared Files
```

No SEO Dashboard anywhere in this navigation, ever.

## UX principles

- Primary interaction model: sidebar + main view + right-side detail drawer. Opening a Work
  item keeps the current list/board visible, opens details in a drawer, preserves filters,
  scroll position, and project context, and is reachable by a shareable URL.
- Global command menu, quick create, inline editing where safe, autosave where appropriate,
  optimistic UI only when rollback is safe, undo for reversible actions, skeleton loading
  (not disruptive spinners), full keyboard navigation, recently viewed, favorites.
- Visual direction: warm white background, graphite text, Taskcover teal accent, thin
  borders, subtle shadows, clear spacing/typography, 120–180ms motion, no decorative
  marketing animation, no excessive gradients, accessible contrast, reduced-motion support.
  `/flow` (the internal app route — see "Route decision" below) should read as a polished
  productivity application, not another CMS page, while staying visually consistent with the
  existing `/admin` brand language.

## Route decision: `/flow`, not `/work`

The canonical roadmap and AGENTS.md target architecture describe the internal app mounting
at `taskcover.com/work`. At FLOW-001 preflight, `/work` was found to already be a **public,
live marketing route** (`src/app/work/**`, mirrored under `src/app/[locale]/work/**`): case
studies, sample audits, client results, search-growth frameworks. Mounting an
authenticated internal shell there would either break public marketing pages or force
deleting live content outside FLOW-001's scope.

**Decision (confirmed with the product owner during FLOW-001 preflight):** the internal
application mounts at **`taskcover.com/flow`** instead of `/work`. The public `/work`
marketing section is untouched. Internal code that refers to the *domain concept* "Work"
(the unified Work object, `src/components/work/`, `src/lib/work/`) keeps that name — only the
URL prefix changed. Every future FLOW-XXX document and route reference should say `/flow`,
not `/work`, when referring to the internal application's URL.

## Explicitly excluded functionality (all versions unless a future decision reopens it)

SEO tracking, DataForSEO integration, Google Search Console integration, keyword rank
tracking, Site Health, AI Visibility, SEO API cost center, paid API governance, client SEO
tracking, Semrush-style replacement — see [FLOW_DECISIONS.md](./FLOW_DECISIONS.md).

Also excluded from v1: Slack-style chat, direct messages, presence indicators, client
portal, sales CRM pipeline, billing/invoicing, employee performance scoring, Gantt charts,
advanced portfolio management, arbitrary custom databases, formula/rollup systems, unlimited
custom statuses, a visual no-code automation canvas, native mobile apps, real-time
collaborative document editing, autonomous AI agents, complex field-level permissions, and
generic workflow-engine infrastructure.

## Existing codebase constraints

- Next.js + React + TypeScript, PostgreSQL + Drizzle, Cloudflare/OpenNext, Hyperdrive.
- Existing Admin authentication/sessions (`src/lib/admin/session.ts`,
  `src/lib/admin/security.ts`) and invitations are reused, not replaced. There is exactly one
  identity table and one login system; Taskcover Flow extends it in later waves rather than
  creating a second one.
- `/admin` (existing Content CMS) behavior is unchanged by Taskcover Flow work.
- Existing admin/editor users keep their access and gain `/flow` access for free in FLOW-001.
