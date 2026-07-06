# Technical SEO Defect Log

| ID | Route family | Issue | Severity | Fix/status | QA evidence |
| --- | --- | --- | --- | --- | --- |
| T14-001 | `/robots.txt` | No generated robots route existed for launch crawler guidance. | Critical | Fixed: added `src/app/robots.ts`. | `seo:check`, rendered crawl. |
| T14-002 | `/fr`, `/es` homepage | Homepage CTA/module links could point to unprefixed EN paths. | High | Fixed: `HomeView` localizes links. | `technical-seo.test.ts`, rendered crawl. |
| T14-003 | FR/ES service detail | Related service rail links were unprefixed. | High | Fixed: related links localize by locale. | rendered crawl, tests. |
| T14-004 | FR/ES homepage markets | `View market` was hardcoded English. | High | Fixed: locale-owned `viewMarket` label. | `technical-seo.test.ts`. |
| T14-005 | Insights hub/category | Metadata did not use shared SEO helper. | High | Fixed: shared `buildMetadata()` restored. | rendered crawl. |
| T14-006 | Static SEO checker | Proof detail routes were missing from checker inventory. | Medium | Fixed: checker mirrors sitemap proof detail URLs. | `seo:check` now 243 URLs. |
| T14-007 | SEO crawler args/probes | `--base-url=value` was ignored and private probes could create false public link failures. | Medium | Fixed: inline arg parsing and indexable-only public link failures. | rendered crawl 0 critical/high. |
| T14-008 | Mobile article/404 templates | Grid children lacked explicit shrink containment. | Low | Fixed: added `min-w-0`/wrapping. | CDP viewport QA. |
| T14-009 | Raw server html lang | Static root layout serves `lang="en"` before pre-paint correction. | Info | Deferred: rendered language is corrected; future architecture review if server-only lang becomes mandatory. | rendered crawl info only. |

All Critical and High findings discovered in Task 14 are fixed.

