# Homepage v3 integration

Status: draft PR implementation. Not merged or deployed.

## What changed

The English root homepage now uses the approved hero and Decision Studio, followed by the client showcase, introduction video and British Council evidence. It continues with the five core services, the separate Skyscanner technical investigation, people and partnership, engagement discussion and contact CTA, following sitemap v1.1.

- Recovered the original local v3 HTML, including its inline office image and video poster. Retained a self-contained reference under prototypes/decision-studio.
- Ported the interaction into React components with local state. No embedded homepage iframe, runtime HTML injection or document-wide event listeners.
- Preserved all 27 scenario/stage/choice combinations, before/after views, buyer reasoning, working notes, measurement discussion, destination briefs and practice forms.
- Questions can be kept across audiences, removed, reviewed, included in a personal brief, copied, downloaded or opened as an email draft. Nothing is submitted by this experience. State lasts for the current page visit only.
- Main business CTAs use /contact. All five service links use their existing routes. Client case links use existing published slugs.
- Client-strip pause control, inert duplicate track, reduced-motion CSS, native modal dialogs, focus restoration, keyboard case tabs, and live status announcements are retained.
- Video iframe is created only after explicit play and removed when the dialog closes.
- Initial journey and case panels are rendered as React content, including on the server, rather than initially empty JavaScript targets.
- Scoped homepage CSS uses shared green/emerald action, dark label, link and focus tokens. The original agency logo remains in the shared header/footer and dialogs.
- English is the implementation language of the approved v3. Existing French and Spanish localized home views remain in place pending equivalent content translation.

## Evidence boundaries

British Council figures describe analysis and prioritisation: 21,323 query–page relationships, 995 URLs, 1.66M impressions, 10,277 clicks, 989 opportunities, 32 high and 26 medium priorities, and a 288-prompt framework. No traffic growth, completed-fix count, prompt list, priority scoring criteria or unprovided measurement period has been invented.

The Skyscanner technical case remains distinct from portfolio performance. Taskcover diagnosed, defined requirements and verified; the Platform team implemented. The page does not attribute the separate 9.5% comparable-scope click result to the caching fix.

## Validation performed

- Recovered prototype inline JavaScript parsed successfully.
- Evaluated the original and ported decision functions for all 27 combinations: exact parity across every decision field; 27 unique question keys.
- Confirmed all linked existing client slugs against src/content/en/case-studies.ts and checked route inventory for primary destinations.
- Checked CSS scoping, React state ownership, generated-content escaping, modal cleanup, no eager video iframe, local asset references and absence of new dependencies.
- Added focused model and React interaction tests for all journey paths, cross-audience question retention, escaped brief text, clipboard failure, practice reset, modal focus, video teardown and keyboard evidence tabs.

## Validation follow-up on 2026-10-01

The user approved the Windows local fallback after the requested cloud environment was unavailable. Validation used Windows 11, Node 24.16.0, npm 11.13.0 and Chrome. GitHub Actions was not used.

- `npm ci` and `npx next typegen` completed successfully.
- The original 18 homepage/navigation tests passed. The expanded homepage/navigation run passes 22 tests, including the existing ecosystem-map checks and a new SSR/hydration regression test.
- Executed checks found and repaired DOM type conflicts with Cloudflare declarations, Windows/space-safe Vitest aliases, missing jsdom dialog methods, and the Next Link lint error in the no-JavaScript fallback.
- Browser checks exposed reduced-motion hydration mismatches in the existing FR/ES homepage. A small homepage hook now keeps the first client render consistent with SSR before applying the browser preference. The regression test failed before the fix and passes afterward. Fresh FR/ES browser sessions report zero JavaScript exceptions and zero console errors with reduced motion enabled.
- `npm run typecheck`, `npm run lint` and the final production `npm run build` all passed; the build generated 329 static pages.
- All 27 browser journeys passed before/after comparison, working notes, measurement plans, question retention across audiences, removal, escaped brief output, manual clipboard fallback and email-draft content. Playwright confirmed a downloaded text brief matches the entered content. Sample completion/reset, dialog Escape, focus restoration, native modal background focus blocking, evidence keyboard tabs, client pause/inert duplication, and reduced motion were exercised.
- Inspected 375, 768, 1280 and 1440 CSS-pixel widths for EN/FR/ES, plus 720x500 at DPR 2 as the reflow equivalent of a 1440x1000 desktop at 200% zoom. No horizontal page overflow was found. Tested language switching, localized contact routing and navigation away/back with visit-only state reset.
- Desktop/mobile and full-page screenshots are stored outside the checkout in the local `../pr33-qa/` directory and supplied in the Codex chat for design review. They are local preview evidence, not deployment screenshots.

The introduction player is created on explicit play and removed on close. Cloudflare Stream rejects the local `127.0.0.1` origin with an allowed-domain message, so actual playback remains unverified here; verify it on an approved domain before publishing. Provider allowlists were not changed. Real lead submission and Cloudflare packaging/deployment were not part of this local validation.

Commands for repeatable validation (the broader homepage filter includes the hydration regression):

```sh
npm ci
npx next typegen
npm run typecheck
npm run test -- src/components/marketing/home src/components/marketing/layout/site-header.test.tsx src/content/site-navigation.test.ts
npm run lint
npm run build
```

Inspect 375, 768, 1280 and 1440 widths and 200% zoom. Verify all 27 journeys, question removal, sample reset, clipboard fallback/download/email draft, video playback and close, reduced motion, keyboard dialogs/tabs, route navigation away and back, and FR/ES language switching. Validate the real contact flow independently before publishing.

## Remaining website work

- Translate and review the v3 experience for FR/ES.
- Publish dedicated British Council and two Skyscanner case pages when their complete case content is ready.
- Build /engagements before adding it as a navigation destination.
- Review the new lower-page editorial sections visually with the restored v3, then complete the broader service/work page rollout.
