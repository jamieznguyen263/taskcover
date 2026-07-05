# Commercial SEO URL Inventory

This inventory classifies public URL families. Dynamic detail pages are listed by route family with their implemented slug sets. All public indexable families have EN/FR/ES availability, localized canonical URLs, hreflang alternates for `en`, `fr`, `es`, and `x-default`, and sitemap inclusion unless explicitly noted.

## Public URL Families

| URL family | Locale availability | Indexable | Page type | Primary intent | Funnel stage | Primary keyword family | Commercial strength | SEM readiness | Internal links | Cannibalization risk | Recommendation |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | EN/FR/ES | Yes | Homepage | Primary commercial | Consideration | Search growth agency | High | Needs improvement | Strong | Medium | Improve positioning without competing with `/services/seo-agency`. |
| `/services` | EN/FR/ES | Yes | Services hub | Primary commercial | Consideration | SEO services | High | Needs improvement | Strong | Medium | Keep as service-selection hub. |
| `/services/[slug]` | EN/FR/ES | Yes | Service detail | Primary commercial | Decision | Service-specific | High | Mixed | Strong/adequate | Low/medium | Keep canonical service URLs. |
| `/industries` | EN/FR/ES | Yes | Industries hub | Secondary commercial | Consideration | Industry SEO | High | Needs improvement | Strong | Low | Keep as selector. |
| `/industries/[slug]` | EN/FR/ES | Yes | Industry detail | Primary commercial | Decision | Industry-specific SEO | High | Needs improvement | Strong | Low | Keep vertical pages; avoid agency clone pages. |
| `/markets` | EN/FR/ES | Yes | Markets hub | Secondary commercial | Consideration | Market SEO | Medium | Needs improvement | Strong | Low | Keep as regional selector. |
| `/markets/[slug]` | EN/FR/ES | Yes | Market detail | Primary commercial | Decision | Market-specific SEO agency | High | Needs improvement | Strong | Medium | Keep regional pages; no city pages. |
| `/proof` | EN/FR/ES | Yes | Proof hub | Proof/support | Decision | SEO proof | Medium | Not ready | Strong | Low | Keep as support. |
| `/proof/[slug]` | EN/FR/ES | Yes | Proof detail | Proof/support | Trust | Proof channel | Medium | Not ready | Adequate | Low | Keep evidence-gated. |
| `/work` | EN/FR/ES | Yes | Work hub | Proof/support | Decision | Search growth work | Medium | Not ready | Strong | Low | Keep as work system hub. |
| `/work/case-studies` | EN/FR/ES | Yes | Case-study hub | Proof/support | Decision | SEO case studies | Medium | Not ready | Strong | Low | Keep proof role. |
| `/work/case-studies/[slug]` | EN/FR/ES | Yes | Case-study detail | Proof/support | Decision | SEO results | Medium | Not ready | Strong | Low | Support related services/industries/markets. |
| `/work/sample-audits` | EN/FR/ES | Yes | Sample audit hub | Proof/support | Decision | SEO sample audit | Medium | Not ready | Strong | Low | Keep as methodology proof. |
| `/work/sample-audits/[slug]` | EN/FR/ES | Yes | Sample audit detail | Proof/support | Decision | Audit example | Medium | Not ready | Strong | Medium | Support audit/service pages, not replace them. |
| `/work/search-growth-frameworks` | EN/FR/ES | Yes | Framework page | Proof/support | Consideration | Search growth framework | Medium | Not ready | Adequate | Low | Keep as methodology support. |
| `/work/client-results` | EN/FR/ES | Yes | Results standard | Proof/support | Trust | SEO results | Medium | Not ready | Adequate | Low | Keep evidence standard. |
| `/insights` | EN/FR/ES | Yes | Insights hub | Informational support | Awareness | SEO insights | Medium | Not ready | Strong | Low | Keep informational. |
| `/insights/[categorySlug]` | EN/FR/ES | Yes | Insight category | Informational support | Awareness | Topic cluster | Medium | Not ready | Strong | Medium | Keep supporting role. |
| `/insights/[categorySlug]/[articleSlug]` | EN/FR/ES | Yes | Article | Informational support | Awareness/consideration | Article-specific | Medium | Not ready | Strong | Medium | Link toward services without rewriting as sales pages. |
| `/free-seo-audit` | EN/FR/ES | Yes | Lead funnel | Lead conversion | Conversion | Free SEO audit | High | Needs improvement | Strong | Medium | Keep conversion path; no duplicate audit landing page. |
| `/book-a-call` | EN/FR/ES | Yes | Lead funnel | Lead conversion | Conversion | SEO strategy call | High | Needs improvement | Strong | Low | Keep conversion path. |
| `/contact` | EN/FR/ES | Yes | Contact | Lead conversion | Conversion | SEO agency contact | Medium | Needs improvement | Strong | Low | Keep support path. |
| `/about`, `/methodology`, `/how-we-work` | EN/FR/ES | Yes | Company/trust | Trust/commercial support | Consideration | Methodology/company | Medium | Not ready | Adequate | Low | Keep as trust support. |
| Legal and preference pages | EN/FR/ES | Yes | Legal/trust | Legal/trust | Trust | Privacy/cookie/data request | Low | Not ready | Adequate | Low | Keep informational/trust. |
| `/thank-you` | EN/FR/ES | No | Post-conversion | Confirmation | Conversion | None | Low | Not ready | Excluded | Low | Noindex and excluded from sitemap. |
| `/admin/**` | EN only/admin | No | Admin/private | Private | None | None | Low | Not ready | Excluded | Low | Noindex/private, excluded from sitemap. |

## Implemented Slug Sets

- Services: `seo-agency`, `technical-seo`, `ai-search-optimization`, `content-marketing`, `digital-pr-link-building`, `local-seo`, `ecommerce-seo`, `international-seo`, `ppc-management`, `seo-mentor-service`, `seo-audit`.
- Industries: `travel-seo`, `education-seo`, `healthcare-seo`, `legal-immigration-seo`, `saas-seo`, `ecommerce-seo`, `franchise-local-seo`.
- Markets: `usa-seo-agency`, `canada-seo-agency`, `australia-seo-agency`.
- Proof: `brand-experience`, `media-features`, `client-reviews`, `video-reviews`, `spokesperson`.
- Sample audits: `technical-seo-audit`, `ai-search-visibility-review`, `content-gap-map`, `local-seo-audit`, `ecommerce-search-architecture`, `international-seo-market-map`, `ppc-organic-intelligence`, `90-day-search-growth-roadmap`.
- Case studies: `british-university-vietnam`, `casa-madera`, `the-bamboo-bar`, `matthew-jeffery-law-firm`, `skatepro`, `agoda`, `avis`, `novaworld`, `ccleaner`, `fwd-insurance`.

## Current Inventory Conclusion

The existing architecture is broad enough for launch. The highest-confidence action is consolidation and internal-link clarity, not new URL creation.
