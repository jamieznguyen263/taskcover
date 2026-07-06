# Technical SEO URL Inventory

Canonical origin: `https://taskcover.com`. English is unprefixed. French uses
`/fr`; Spanish uses `/es`. Slugs stay English across locales.

| Family | Pattern | Indexability | Sitemap | Schema | Dynamic | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| Homepage | `/`, `/fr`, `/es` | indexable | yes | Organization global | static | critical |
| Services hub | `/services` | indexable | yes | BreadcrumbList | static | critical |
| Service detail | `/services/[slug]` | indexable | yes | BreadcrumbList, visible FAQPage | static params | critical |
| Industries hub/detail | `/industries`, `/industries/[slug]` | indexable | yes | BreadcrumbList, visible FAQPage on detail | static params | high |
| Markets hub/detail | `/markets`, `/markets/[slug]` | indexable | yes | BreadcrumbList | static params | high |
| Proof hub/detail | `/proof`, `/proof/[slug]` | indexable | yes | BreadcrumbList | static params | high |
| Work hub | `/work` | indexable | yes | BreadcrumbList | static | high |
| Case studies hub/detail | `/work/case-studies`, `/work/case-studies/[slug]` | indexable | yes | BreadcrumbList | static params | high |
| Sample audits hub/detail | `/work/sample-audits`, `/work/sample-audits/[slug]` | indexable | yes | BreadcrumbList | static params | high |
| Client results | `/work/client-results` | indexable | yes | BreadcrumbList | static | medium |
| Search frameworks | `/work/search-growth-frameworks` | indexable | yes | BreadcrumbList | medium |
| Insights hub/category/article | `/insights`, `/insights/[categorySlug]`, `/insights/[categorySlug]/[articleSlug]` | indexable when published | yes | BreadcrumbList, Article, visible FAQPage where present | static params | high |
| Lead funnel | `/free-seo-audit`, `/book-a-call`, `/contact` | indexable | yes | BreadcrumbList | contact dynamic | critical |
| Pricing | `/pricing` | indexable | yes | BreadcrumbList, visible FAQPage | dynamic | critical |
| Trust/company | `/about`, `/methodology`, `/how-we-work` | indexable | yes | BreadcrumbList | static | high |
| Legal/trust | `/privacy-policy`, `/cookie-policy`, `/terms`, `/accessibility`, `/data-request`, `/cookie-preferences` | indexable | yes | BreadcrumbList | static | high |
| Thank-you | `/thank-you` | noindex | no | none | dynamic | private |
| Admin | `/admin/*` | noindex/private | no | none | dynamic | private |
| API/internal | `/api/*` | not indexable | no | none | dynamic | private |
| Preview | `/admin/insights/[id]/preview` | noindex/private | no | none | dynamic | private |
| 404 | unmatched routes | noindex | no | none | dynamic fallback | utility |

The Task 14 sitemap inventory contains 243 canonical localized public URLs.
The Next build generates 264 static pages after adding `robots.txt`.

