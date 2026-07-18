# Current Flow PR

**Active slice: FLOW-012 — Hardening & Rollout** (the final slice). One PR, **no migration**
(hardening only), base `main`. This closes the 12-slice roadmap.

History: FLOW-001–011 all merged (#14, #15, #17, #18, #19, #20, #21).

## Scope

FLOW-012 adds no product features and no schema. It verifies, tightens, and documents the
system built across the previous eleven slices.

- **Security / permission audit:** confirmed every `/flow` page (10) and every server action
  (24) re-checks its capability server-side (deny-by-default; nav visibility is never
  authorization) and that external sessions are blocked from all internal mutations by
  `requireWorkSession`. Encoded the audited contract as `authorization-matrix.test.ts` so a
  future guard downgrade fails CI.
- **Migration verification:** `migration-integrity.test.ts` proves all six Flow migrations
  (0005–0010) are strictly additive — no destructive statements, and no CREATE/ALTER-ADD/
  INDEX against any pre-Flow table — so they are safe against the DB shared with the CMS.
- **External-data isolation:** re-verified the boundary (external nav carries no internal
  destinations; internal comments/docs/activity/search are repository-filtered behind
  `internal-notes:view`; `/api/admin/*` reject externals). Covered by the nav-isolation and
  visibility-resolution tests plus the rollout smoke script.
- **Accessibility:** added a "Skip to content" link to both the internal and external shells
  and a labelled `#flow-main` landmark; re-confirmed existing landmarks, focus management
  (command menu, drawers), icon-button labels, and reduced-motion support.
- **Performance:** confirmed batched queries (no N+1 in the Home/work/client repositories)
  and that client components are limited to genuinely interactive surfaces; no state library
  added.
- **Rollout:** `TASKCOVER_FLOW_ROLLOUT.md` — migration apply order + verification, staging
  and production rollout with the `WORK_APP_ENABLED` kill switch, the external-isolation
  smoke check, staff onboarding, and rollback. Roadmap marked complete.

## Non-scope

No new tables, no new capabilities, no new product surfaces. LLM-backed AI, TipTap WYSIWYG,
a global "new work" picker, waiting/deadline/mention notification emission, and Calendar view
remain the documented post-v1 enhancements (rationale in FLOW_DECISIONS.md) — FLOW-012 does
not implement them.

## Acceptance checks

1. Permission audit is complete and encoded as a test; no gap found or introduced.
2. Migration integrity is proven additive by test.
3. External isolation holds across nav, repositories, and the CMS API surface.
4. Skip links + landmarks present; no accessibility regressions.
5. `/admin`, the public site, and the external shell behave identically.
6. Full battery passes: lint, typecheck, full vitest, `next build`, Cloudflare build, dry-run.
