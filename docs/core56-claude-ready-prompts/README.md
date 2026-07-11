# Core 56 Ready Claude Prompts

These files are generated one-file prompts for Claude. Each prompt includes the master instructions, output contract, and one batch brief, so the operator does not need to assemble multiple documents manually.

Regenerate prompts after changing the master prompt, output contract, or batch briefs:

```powershell
npm run core56:claude:prompts
```

Validate the generated prompts are current:

```powershell
npm run core56:claude:prompts:validate
```

Recommended execution order:

| Order | Batch | Articles | Prompt file |
|---:|---|---|---|
| 1 | Already Started / Reconcile | TC-001, TC-006 | `batch-01-reconcile.md` |
| 2 | Wave 1 AI Search Core | TC-007, TC-002, TC-008, TC-009, TC-010 | `batch-02-ai-search-core.md` |
| 3 | Wave 1 Search Buying And Strategy | TC-003, TC-004, TC-005, TC-011, TC-012, TC-013 | `batch-03-wave1-search-buying-strategy.md` |
| 4 | Measurement And Technical SEO | TC-014, TC-016, TC-017, TC-018, TC-031, TC-032, TC-033, TC-034 | `batch-04-measurement-technical-seo.md` |
| 5 | Content, Topical Authority, Internal Links | TC-019, TC-020, TC-035, TC-036, TC-037 | `batch-05-content-topical-authority.md` |
| 6 | Digital PR And Authority | TC-021, TC-038, TC-039, TC-040 | `batch-06-digital-pr-authority.md` |
| 7 | Local, Franchise, International SEO | TC-022, TC-023, TC-024, TC-044, TC-045, TC-046, TC-047 | `batch-07-local-franchise-international.md` |
| 8 | Industry SEO | TC-025, TC-026, TC-027, TC-028, TC-029, TC-030 | `batch-08-industry-seo.md` |
| 9 | Ecommerce And SaaS | TC-048, TC-049, TC-050, TC-051, TC-052 | `batch-09-ecommerce-saas.md` |
| 10 | PPC, Enablement, Reporting, Benchmark | TC-053, TC-054, TC-055, TC-056, TC-015 | `batch-10-ppc-enablement-reporting-benchmark.md` |
| 11 | AI Search Entity, Prompt Research, Scorecard | TC-041, TC-042, TC-043 | `batch-11-ai-search-entity-prompt-scorecard.md` |

After Claude returns a batch, save the response to `.claude-output/claude-<batch>.md`, then run the matching validation and conversion commands from `docs/core56-backfill-publication-runbook.vi.md`.
