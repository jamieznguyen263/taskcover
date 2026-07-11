# Ready Claude Prompt - Local, Franchise, International SEO

Copy this whole file into Claude as one request. Do not send more than one batch per request.

## Operator Instruction

You are Claude. Complete only the article IDs listed in this prompt. Return a complete `articlePackages` JSON payload that passes the Taskcover validation contract below. Do not add articles outside this batch.

Batch slug: `batch-07-local-franchise-international`
Required article IDs: `TC-022`, `TC-023`, `TC-024`, `TC-044`, `TC-045`, `TC-046`, `TC-047`

If live browsing is available, verify current primary sources before writing any current Google, AI Search, schema, hreflang, Core Web Vitals, platform, or standards claim. If live browsing is unavailable, mark the exact claim/source limitation in `publishQaNotes.humanVerificationNeeded` instead of inventing facts.

The final response must include a fenced JSON block with a top-level `articlePackages` array. Every article package must include full Markdown body content, source URLs, internal links, forbidden-claims checklist, original asset plan, and publish QA notes.

---

## Master Prompt

# Core 56 Claude Master Prompt

Tai lieu nay dung de copy/paste sang Claude khi muon Claude viet noi dung cho 56 bai Core 56. Attach workbook `Taskcover_Core_56_Final_Outlines_Top10_Readiness_9_5.xlsx` cung prompt nay neu co the.

For stronger execution, send Claude one generated batch brief at a time from `docs/core56-claude-batches/` together with the Master Prompt below. Those batch files contain the article-level writer brief, required outline sections, source keys, internal links, forbidden claims, and asset requirements extracted from the workbook.

Claude must return each completed batch using `docs/core56-claude-output-contract.md` so Codex can convert the output into `InsightArticle` drafts without guessing field names or missing QA data.

## Nguyen tac khong duoc vi pham

- Viet EN truoc. FR/ES chi lam sau khi EN da publish va co QA rieng.
- Diem 9.5/10 trong workbook la outline/readiness score, khong phai ranking guarantee.
- Khong hua Top 10, khong hua traffic, revenue, backlink, AI citation, AI mention, hoac ranking.
- Khong invent statistics, client results, expert quotes, awards, ratings, reviews, case studies, logos, certifications.
- Moi factual claim quan trong phai co source key/URL, uu tien primary sources.
- Google/AI Search topics phai verify lai current sources truoc khi viet vi noi dung thay doi nhanh.
- FAQPage schema chi dung khi FAQ hien tren bai.
- Article schema va BreadcrumbList duoc phep; khong them Review, AggregateRating, fake Person, HowTo, LocalBusiness, Product/Offer schema neu khong co data that.
- Hreflang chi tao cho locale da publish. Ban EN khong duoc tu gan FR/ES alternate neu FR/ES chua live.
- Moi bai can co information gain: original framework, checklist, scorecard, table, diagnostic matrix, decision tree, hoac operating model.
- Moi bai can co CTA hop ly den money page trong workbook, khong bien bai informational thanh landing page ban hang.

## Master Prompt cho Claude

```text
You are acting as Taskcover's senior SEO Content Executive and SEO Technical Content Editor.

Project:
- Write the English-first Core 56 Insights articles for Taskcover.
- Use the attached workbook `Taskcover_Core_56_Final_Outlines_Top10_Readiness_9_5.xlsx` as the source of truth.
- The workbook contains: Core 56 Master, Final Writer Briefs, Outline Sections, QA Scorecard, Publication Roadmap, Live SERP Validation, and Sources & Governance.
- The 9.5/10 readiness score means outline quality and production readiness only. It is not a ranking guarantee.

Your job:
1. Work article-by-article or in small batches, never all 56 in one uncontrolled draft.
2. For each article, read its Final Writer Brief and Outline Sections before writing.
3. Verify current primary sources before making current SEO, Google, AI Search, schema, hreflang, Core Web Vitals, or platform-specific claims.
4. Produce a complete publish-ready English article package that Codex can convert into Taskcover Insights content.

Required output per article:
- articleId
- finalTitle
- slug
- metaTitle, max 60 characters where practical
- metaDescription, 145-160 characters where practical
- h1
- excerpt
- primaryKeyword
- secondaryKeywords
- searchIntent
- funnel
- targetMarkets
- primaryMoneyPage
- supportingPages
- recommendedSchema
- forbiddenClaimsChecklist
- sourceKeysUsed with URLs
- authorReviewerNotes
- internalLinks with suggested anchor text
- originalAssetPlan
- blocks:
  - opening answer in 80-120 words
  - H2/H3 structure exactly aligned with the workbook unless live SERP validation justifies a change
  - paragraphs, bullet lists, numbered lists, tables, checklists, and FAQ blocks where needed
  - final recommendation and CTA
- publishQaNotes:
  - evidence risks
  - cannibalization risks
  - technical SEO risks
  - claims that need human/client verification before publish

Writing standard:
- Helpful, expert-led, people-first content.
- Direct opening answer, no throat-clearing.
- Use short, self-contained passages that can be cited/extracted by AI systems.
- Use concrete decision frameworks and implementation steps.
- Explain uncertainty instead of pretending precision.
- Do not keyword-stuff.
- Do not write generic SEO advice that any competitor could publish.
- Do not cite Taskcover service pages as independent evidence; they are internal links only.
- Do not invent numbers. If a number is not source-backed, write qualitatively.
- Include USA, Canada, and Australia context only where the brief requires it, without creating doorway-style country-swapped copy.

Before finalizing each article:
- Confirm the article satisfies the workbook's mandatory FAQs, unique evidence/asset requirement, internal links, source keys, forbidden claims, update cycle, and market handling.
- List any live SERP assumptions that still need validation.
- Return the article in clean Markdown plus a structured JSON summary.
```

## Batch Prompts

Dung cac prompt batch nay lan luot. Moi batch nen duoc Claude tra ve mot file Markdown/JSON rieng de Codex import vao `src/content/backfill/core56-batch-XX.ts`. Prefer sending the matching detailed file in `docs/core56-claude-batches/` with each prompt.

### Batch 01 - Already Started / Reconcile

Articles: `TC-001`, `TC-006`.

```text
Using the Master Prompt, reconcile and improve TC-001 and TC-006 only.
Preserve the workbook briefs and outline sections.
Return any missing source-backed claims, weak sections, better original asset ideas, and final publish-ready Markdown/JSON for both articles.
Do not rewrite into generic SEO content.
Flag anything that cannot be asserted without live SERP or source validation.
```

### Batch 02 - Wave 1 AI Search Core

Articles: `TC-007`, `TC-002`, `TC-008`, `TC-009`, `TC-010`.

```text
Using the Master Prompt and attached workbook, write TC-007, TC-002, TC-008, TC-009, and TC-010.
These are fast-changing AI Search/GEO topics, so verify current primary sources and avoid guaranteed AI visibility claims.
Each article must clearly distinguish measurement, visibility, entity authority, citation uncertainty, and action planning.
Return one complete article package per article.
```

### Batch 03 - Wave 1 Search Buying And Strategy

Articles: `TC-003`, `TC-004`, `TC-005`, `TC-011`, `TC-012`, `TC-013`.

```text
Using the Master Prompt and attached workbook, write TC-003, TC-004, TC-005, TC-011, TC-012, and TC-013.
Prioritize decision frameworks, commercial investigation intent, pricing/agency due diligence clarity, and no ranking guarantees.
TC-005 must compare USA, Canada, and Australia without country-name substitution or doorway logic.
Return one complete article package per article.
```

### Batch 04 - Measurement And Technical SEO

Articles: `TC-014`, `TC-016`, `TC-017`, `TC-018`, `TC-031`, `TC-032`, `TC-033`, `TC-034`.

```text
Using the Master Prompt and attached workbook, write TC-014, TC-016, TC-017, TC-018, TC-031, TC-032, TC-033, and TC-034.
These articles require technical accuracy. Verify current Google documentation where relevant.
Focus on diagnostics, acceptance criteria, prioritization, crawl/index/render evidence, and business impact.
Return one complete article package per article.
```

### Batch 05 - Content, Topical Authority, Internal Links

Articles: `TC-019`, `TC-020`, `TC-035`, `TC-036`, `TC-037`.

```text
Using the Master Prompt and attached workbook, write TC-019, TC-020, TC-035, TC-036, and TC-037.
Make these articles operational: content systems, keyword mapping, content decay, briefs, and internal linking.
Avoid arbitrary keyword density/readability scores. Use clear evidence, page ownership, and cannibalization prevention.
Return one complete article package per article.
```

### Batch 06 - Digital PR And Authority

Articles: `TC-021`, `TC-038`, `TC-039`, `TC-040`.

```text
Using the Master Prompt and attached workbook, write TC-021, TC-038, TC-039, and TC-040.
Do not promote link buying or manipulative link schemes.
Focus on editorial value, original research, relevance, risk evaluation, and earned authority.
Return one complete article package per article.
```

### Batch 07 - Local, Franchise, International SEO

Articles: `TC-022`, `TC-023`, `TC-024`, `TC-044`, `TC-045`, `TC-046`, `TC-047`.

```text
Using the Master Prompt and attached workbook, write TC-022, TC-023, TC-024, TC-044, TC-045, TC-046, and TC-047.
Avoid doorway pages, fake offices, fake local business schema, and thin location-page advice.
For hreflang, localization, and international architecture, verify current Google documentation.
Return one complete article package per article.
```

### Batch 08 - Industry SEO

Articles: `TC-025`, `TC-026`, `TC-027`, `TC-028`, `TC-029`, `TC-030`.

```text
Using the Master Prompt and attached workbook, write TC-025, TC-026, TC-027, TC-028, TC-029, and TC-030.
Each industry guide must be genuinely differentiated.
Healthcare and legal/immigration topics are YMYL-adjacent: avoid medical/legal advice, jurisdiction claims, or unsupported compliance statements.
Return one complete article package per article.
```

### Batch 09 - Ecommerce And SaaS

Articles: `TC-048`, `TC-049`, `TC-050`, `TC-051`, `TC-052`.

```text
Using the Master Prompt and attached workbook, write TC-048, TC-049, TC-050, TC-051, and TC-052.
Cover ecommerce crawl control, category/product architecture, product structured data, SaaS comparison pages, and product-led SEO.
Do not add fake Product, Offer, AggregateRating, or review schema claims.
Return one complete article package per article.
```

### Batch 10 - PPC, Enablement, Reporting, Benchmark

Articles: `TC-053`, `TC-054`, `TC-055`, `TC-056`, plus `TC-015` if not already assigned.

```text
Using the Master Prompt and attached workbook, write TC-053, TC-054, TC-055, TC-056, and TC-015.
TC-056 is a research/linkable asset: do not fabricate benchmark data. If real dataset is unavailable, write the methodology, sample design, collection plan, and publish only as a benchmark framework until data exists.
For TC-053, explain how PPC search-term data can inform SEO without claiming paid data directly improves organic rankings.
Return one complete article package per article.
```

### Batch 11 - AI Search Entity, Prompt Research, Scorecard

Articles: `TC-041`, `TC-042`, `TC-043`.

```text
Using the Master Prompt and attached workbook, write TC-041, TC-042, and TC-043.
These are AI Search/GEO articles about entity authority, prompt research, and visibility scoring.
Avoid false precision, guaranteed AI mentions, or claims that one schema trick forces AI inclusion.
Return one complete article package per article.
```

## Core 56 Article Inventory

| # | ID | Wave | Role | Cluster | Title | Primary keyword | Money page |
|---:|---|---|---|---|---|---|---|
| 1 | TC-001 | Wave 1 | Pillar | Search Growth Strategy | SEO in 2026: How Google, AI Search, and Revenue Growth Work Together | SEO 2026 | /services/seo-agency |
| 2 | TC-002 | Wave 1 | Linkable Asset | AI Search / GEO | How to Measure AI Search Visibility Across ChatGPT, Gemini, Perplexity, and Google | measure AI search visibility | /services/ai-search-optimization |
| 3 | TC-003 | Wave 1 | Linkable Asset | Technical SEO & Audit | Technical SEO Audit Checklist for Growing Websites | technical SEO audit checklist | /services/technical-seo |
| 4 | TC-004 | Wave 1 | Supporting Cluster | Search Growth Strategy | SEO vs PPC: How to Build a Search Growth System Instead of Choosing One Channel | SEO vs PPC | /services/seo-agency |
| 5 | TC-005 | Wave 1 | Industry / Market Guide | International SEO | International SEO for the USA, Canada, and Australia | international SEO USA Canada Australia | /services/international-seo |
| 6 | TC-006 | Wave 1 | Pillar | Content & Topical Authority | How to Create Content That Earns Rankings, AI Citations, and Leads | content for AI search and SEO | /services/content-marketing |
| 7 | TC-007 | Wave 1 | Pillar | AI Search / GEO | Generative Engine Optimization (GEO): A Practical Guide for Business Growth | generative engine optimization | /services/ai-search-optimization |
| 8 | TC-008 | Wave 1 | Supporting Cluster | AI Search / GEO | GEO vs SEO vs AEO: What Is Different, What Overlaps, and What Should You Fund? | GEO vs SEO vs AEO | /services/ai-search-optimization |
| 9 | TC-009 | Wave 1 | Supporting Cluster | AI Search / GEO | How to Get Your Brand Mentioned in ChatGPT, Gemini, Perplexity, and Google AI Results | how to appear in ChatGPT results | /services/ai-search-optimization |
| 10 | TC-010 | Wave 1 | Linkable Asset | AI Search / GEO | AI Search Visibility Audit: A 30-Point Checklist for Brands | AI search visibility audit | /services/seo-audit |
| 11 | TC-011 | Wave 1 | Supporting Cluster | SEO Buying & Strategy | How to Choose an SEO Agency: A Due-Diligence Framework for Founders and Marketing Leaders | how to choose an SEO agency | /services/seo-agency |
| 12 | TC-012 | Wave 1 | Supporting Cluster | SEO Buying & Strategy | SEO Agency Pricing: What SEO Costs in the USA, Canada, and Australia | SEO agency pricing | /services/seo-agency |
| 13 | TC-013 | Wave 1 | Supporting Cluster | SEO Buying & Strategy | How Long Does SEO Take? A 30-, 90-, and 180-Day Milestone Framework | how long does SEO take | /services/seo-agency |
| 14 | TC-014 | Wave 2 | Linkable Asset | Measurement & Reporting | SEO KPIs That Matter: Leads, Revenue, Visibility, Share of Search, and AI Mentions | SEO KPIs | /services/seo-agency |
| 15 | TC-015 | Wave 2 | Supporting Cluster | SEO Consulting & Enablement | SEO Consultant vs Agency vs In-House Team: Which Model Fits Your Growth Stage? | SEO consultant vs agency | /services/seo-mentor-service |
| 16 | TC-016 | Wave 2 | Pillar | Technical SEO & Audit | JavaScript SEO and Next.js SEO: Crawlability, Rendering, Metadata, and Indexation | Next.js SEO | /services/technical-seo |
| 17 | TC-017 | Wave 2 | Supporting Cluster | Technical SEO & Audit | Core Web Vitals for SEO and Conversion: What to Fix First | Core Web Vitals SEO | /services/technical-seo |
| 18 | TC-018 | Wave 2 | Linkable Asset | Technical SEO & Audit | Website Migration SEO Checklist: Redesigns, Replatforming, and Domain Moves | website migration SEO checklist | /services/technical-seo |
| 19 | TC-019 | Wave 2 | Pillar | Content & Topical Authority | Topic Clusters and Topical Authority: How to Build a Content System That Compounds | topic clusters SEO | /services/content-marketing |
| 20 | TC-020 | Wave 2 | Linkable Asset | Content & Topical Authority | Keyword Mapping and Cannibalization: How to Give Every Page a Clear Job | keyword mapping | /services/content-marketing |
| 21 | TC-021 | Wave 2 | Supporting Cluster | Digital PR & Authority | Digital PR vs Link Building: How to Earn Authority Without Buying Risk | digital PR vs link building | /services/digital-pr-link-building |
| 22 | TC-022 | Wave 2 | Industry / Market Guide | Local SEO & Franchise | Local SEO for Multi-Location Businesses: Architecture, Reviews, Listings, and Local Content | multi-location SEO | /services/local-seo |
| 23 | TC-023 | Wave 2 | Pillar | International SEO | International SEO Architecture: Hreflang, Country Pages, Localization, and Canonicals | international SEO hreflang | /services/international-seo |
| 24 | TC-024 | Wave 3 | Industry / Market Guide | Local SEO & Franchise | Franchise SEO: How to Scale Local Visibility Without Duplicate or Doorway Pages | franchise SEO | /industries/franchise-local-seo |
| 25 | TC-025 | Wave 3 | Industry / Market Guide | Industry SEO | Travel SEO Strategy: Win Discovery Across Google, AI Search, and Destination Research | travel SEO strategy | /industries/travel-seo |
| 26 | TC-026 | Wave 3 | Industry / Market Guide | Industry SEO | Education SEO Strategy: Increase Program Discovery and Qualified Student Enquiries | education SEO strategy | /industries/education-seo |
| 27 | TC-027 | Wave 3 | Industry / Market Guide | Industry SEO | Healthcare SEO Strategy: Build Trust, Local Visibility, and Patient Demand | healthcare SEO strategy | /industries/healthcare-seo |
| 28 | TC-028 | Wave 3 | Industry / Market Guide | Industry SEO | Law Firm and Immigration SEO Strategy: Build Qualified Demand Without Thin Location Pages | law firm SEO strategy | /industries/legal-immigration-seo |
| 29 | TC-029 | Wave 3 | Industry / Market Guide | Industry SEO | SaaS SEO Strategy: Build Category Demand, Comparison Visibility, and Product-Led Organic Growth | SaaS SEO strategy | /industries/saas-seo |
| 30 | TC-030 | Wave 3 | Industry / Market Guide | Ecommerce SEO | Ecommerce SEO Strategy: Category Architecture, Product Discovery, and AI Shopping Visibility | ecommerce SEO strategy | /industries/ecommerce-seo |
| 31 | TC-031 | Wave 2 | Pillar | Technical SEO & Audit | Crawlability and Indexation: A Complete Diagnostic Framework | crawlability and indexation | /services/technical-seo |
| 32 | TC-032 | Wave 2 | Supporting Cluster | Technical SEO & Audit | Canonical Tags, Duplicate Content, Pagination, and URL Parameters: A Practical SEO Guide | canonical tags duplicate content | /services/technical-seo |
| 33 | TC-033 | Wave 2 | Supporting Cluster | Technical SEO & Audit | SEO Log File Analysis: How to See What Search Bots Actually Crawl | SEO log file analysis | /services/technical-seo |
| 34 | TC-034 | Wave 2 | Supporting Cluster | Technical SEO & Audit | How to Prioritize SEO Audit Findings by Revenue Risk, Impact, and Effort | prioritize SEO audit findings | /services/seo-audit |
| 35 | TC-035 | Wave 2 | Pillar | Content & Topical Authority | Content Audit and Decay: What to Update, Consolidate, Prune, or Keep | content audit | /services/content-marketing |
| 36 | TC-036 | Wave 2 | Supporting Cluster | Content & Topical Authority | How to Build an SEO Content Brief for Google and AI Search | SEO content brief | /services/content-marketing |
| 37 | TC-037 | Wave 2 | Supporting Cluster | Content & Topical Authority | Internal Linking Strategy: How to Build Topic Authority and Move Users to Revenue Pages | internal linking strategy | /services/content-marketing |
| 38 | TC-038 | Wave 2 | Pillar | Digital PR & Authority | How to Create Linkable Assets and Original Research That Earn Authority | linkable assets SEO | /services/digital-pr-link-building |
| 39 | TC-039 | Wave 2 | Supporting Cluster | Digital PR & Authority | Backlink Quality: How to Evaluate Relevance, Editorial Value, Traffic, and Risk | backlink quality | /services/digital-pr-link-building |
| 40 | TC-040 | Wave 2 | Supporting Cluster | Digital PR & Authority | Data-Led Digital PR: From Research Question to Earned Coverage | data-led digital PR | /services/digital-pr-link-building |
| 41 | TC-041 | Wave 2 | Pillar | AI Search / GEO | Entity Authority for AI Search: How Brands Become Clear, Consistent, and Verifiable | entity authority AI search | /services/ai-search-optimization |
| 42 | TC-042 | Wave 2 | Supporting Cluster | AI Search / GEO | AI Prompt Research: How to Map Buyer Questions, Query Fan-Out, and Source Needs | AI prompt research | /services/ai-search-optimization |
| 43 | TC-043 | Wave 2 | Linkable Asset | AI Search / GEO | AI Visibility Scorecard: Measure Mentions and Citations Without False Precision | AI visibility scorecard | /services/ai-search-optimization |
| 44 | TC-044 | Wave 3 | Supporting Cluster | Local SEO & Franchise | Local Landing Pages That Rank Without Becoming Doorway Pages | local landing pages SEO | /services/local-seo |
| 45 | TC-045 | Wave 3 | Supporting Cluster | Local SEO & Franchise | Google Business Profile, Reviews, and Local Entity Consistency: A Governance Guide | Google Business Profile optimization | /services/local-seo |
| 46 | TC-046 | Wave 3 | Pillar | International SEO | International SEO URL Structure: ccTLD vs Subfolder vs Subdomain vs One Global Site | international SEO URL structure | /services/international-seo |
| 47 | TC-047 | Wave 3 | Industry / Market Guide | International SEO | SEO Localization for USA, Canada, and Australia: Language, Trust, Offers, and Conversion | SEO localization USA Canada Australia | /services/international-seo |
| 48 | TC-048 | Wave 3 | Pillar | Ecommerce SEO | Faceted Navigation SEO: Control Crawl Space Without Hiding Valuable Demand | faceted navigation SEO | /services/ecommerce-seo |
| 49 | TC-049 | Wave 3 | Supporting Cluster | Ecommerce SEO | Category and Product Page SEO: Architecture, Content, Variants, and Internal Links | category page SEO | /services/ecommerce-seo |
| 50 | TC-050 | Wave 3 | Supporting Cluster | Ecommerce SEO | Product Structured Data, Merchant Feeds, and AI Shopping Visibility | product structured data SEO | /services/ecommerce-seo |
| 51 | TC-051 | Wave 3 | Pillar | SaaS SEO | SaaS Comparison, Alternatives, Integration, and Use-Case Pages: A Commercial SEO System | SaaS comparison pages SEO | /industries/saas-seo |
| 52 | TC-052 | Wave 3 | Supporting Cluster | SaaS SEO | Product-Led SEO for B2B SaaS: From Organic Entry Page to Activation and Pipeline | product-led SEO | /industries/saas-seo |
| 53 | TC-053 | Wave 3 | Supporting Cluster | PPC & Search Intelligence | How to Use PPC Search-Term Data to Improve SEO, Content, and Conversion | use PPC data for SEO | /services/ppc-management |
| 54 | TC-054 | Wave 3 | Pillar | SEO Consulting & Enablement | How to Build an In-House SEO Operating System: Roles, Governance, Training, and QA | in-house SEO operating model | /services/seo-mentor-service |
| 55 | TC-055 | Wave 3 | Supporting Cluster | Measurement & Reporting | SEO Reporting Dashboard: What Founders, CMOs, and Delivery Teams Need to See | SEO reporting dashboard | /services/seo-agency |
| 56 | TC-056 | Wave 3 | Linkable Asset | Search Growth Research | The State of Search Visibility: Google and AI Search Benchmark for USA, Canada, and Australia | AI search and SEO benchmark | /services/ai-search-optimization |

## Handoff tu Claude ve Codex

Sau khi Claude tra ve mot batch:

1. Codex convert tung article package thanh `InsightArticle`.
2. Luu vao `src/content/backfill/core56-batch-XX.ts`.
3. Chay `npm run insights:backfill:validate`.
4. Import draft bang `npm run insights:backfill:import`.
5. Chay `npm run insights:verify-database`.
6. Review admin preview.
7. Publish EN theo batch nho.
8. Sau publish: crawl URL, verify canonical, Article schema, BreadcrumbList, visible FAQ/FAQPage match, sitemap inclusion, and no invalid hreflang.

## Ket qua mong doi

- 56 EN article packages hoan chinh, chia thanh 11 batch.
- Moi bai co metadata, slug, structure, internal links, source log, forbidden-claim checklist, original asset plan, va publish QA notes.
- Codex co the import/QA/publish tung batch ma khong can chinh lai tu dau.
- Nen tang san sang de tu bai 57 tro di publish 1 bai/tuan voi cung quy trinh.

---

## Output Contract

# Core 56 Claude Output Contract

Use this contract when Claude returns completed article drafts. It keeps the handoff deterministic so Codex can convert each article into `InsightArticle`, import it as a draft, run QA, and publish EN in short backfill batches.

## Required Batch Package

Claude should return one batch at a time, matching one file in `docs/core56-claude-batches/`.

Each batch response must contain:

1. A short batch summary.
2. One complete article package per requested `TC-###` ID.
3. A final JSON array named `articlePackages`.

Do not merge multiple article IDs into one draft. Do not add extra article IDs that are not in the batch.

## Required Article Package

Each article must include these top-level fields:

```json
{
  "articleId": "TC-007",
  "title": "Generative Engine Optimization (GEO): A Practical Guide for Business Growth",
  "slug": "generative-engine-optimization-geo-a-practical-guide-for-business-growth",
  "metaTitle": "Generative Engine Optimization Guide",
  "metaDescription": "A practical GEO guide for building AI search visibility without relying on unsupported ranking guarantees.",
  "h1": "Generative Engine Optimization (GEO): A Practical Guide for Business Growth",
  "excerpt": "A concise summary for Insights listing pages.",
  "primaryKeyword": "generative engine optimization",
  "secondaryKeywords": ["GEO marketing", "GEO services", "generative search optimization"],
  "searchIntent": "Informational / commercial investigation",
  "targetMarket": "Global English",
  "targetWords": "3,800-4,800",
  "primaryMoneyPage": "/services/ai-search-optimization",
  "supportingPages": ["/services/content-marketing", "/services/digital-pr-link-building"],
  "recommendedSchema": ["Article", "BreadcrumbList"],
  "sourceKeysUsed": [{"key": "GAI", "url": "https://developers.google.com/search/docs/appearance/ai-features"}],
  "internalLinks": [{"url": "/services/ai-search-optimization", "anchor": "AI Search Optimization service"}],
  "forbiddenClaimsChecklist": ["No ranking guarantee", "No fabricated statistics"],
  "originalAssetPlan": "GEO operating model + maturity assessment",
  "authorReviewerNotes": "Named SEO/AI search strategist; disclose engine/date limitations.",
  "markdown": "# Full article body in Markdown",
  "faq": [{"question": "Is GEO separate from SEO?", "answer": "Short, source-safe answer."}],
  "publishQaNotes": {
    "evidenceRisks": [],
    "technicalSeoRisks": [],
    "cannibalizationRisks": [],
    "humanVerificationNeeded": []
  }
}
```

## Markdown Requirements

- Start with the H1.
- Include the 80-120 word opening answer required by the workbook.
- Follow workbook H2/H3 outline sections unless a live SERP validation note explains the change.
- Include visible FAQ questions only if `FAQPage` is recommended.
- Use tables/checklists where the workbook asks for frameworks, scorecards, or diagnostic matrices.
- Include a final recommendation and CTA aligned with the primary money page.

## Source Requirements

- Source URLs must be current and directly relevant.
- Taskcover service pages are internal links, not independent evidence sources.
- Fast-changing topics, especially Google, AI Search, schema, hreflang, Core Web Vitals, and platform features, need current primary-source verification.
- If a claim cannot be verified, write it as a recommendation or limitation, not as a fact.

## Rejection Conditions

Codex should reject or return a Claude batch for revision when:

- Any requested article ID is missing.
- Any extra article ID appears.
- A mandatory workbook FAQ, CTA, source key, internal link target, or forbidden-claim rule is ignored.
- The draft makes ranking, revenue, traffic, AI mention, or AI citation guarantees.
- The draft invents statistics, client results, reviews, author credentials, awards, or quotes.
- The JSON summary is missing or cannot be parsed.
- The article uses fake schema types or emits FAQPage without visible FAQs.
- The article gives legal, medical, or compliance advice without qualified review requirements and source limitations.

## Validation Command

After saving Claude's batch response to a local JSON or Markdown file inside the workspace, run:

```powershell
npm run core56:claude:validate -- --batch batch-02-ai-search-core --file .claude-output\claude-batch-02.md
```

The validator checks:

- requested article IDs match the batch manifest
- no missing, extra, or duplicate article packages
- required fields exist
- slug, primary keyword, and money page match the workbook manifest
- workbook source keys are present
- primary money page is included in internal links
- schema types are limited to Article, BreadcrumbList, and visible FAQPage
- obvious ranking/revenue/AI-mention guarantee language is rejected

The input file can be raw JSON or a Markdown response that contains a fenced JSON block with `articlePackages`.

## Conversion Command

Only convert after validation passes:

```powershell
npm run core56:claude:convert -- --batch batch-02-ai-search-core --file .claude-output\claude-batch-02.md --out src\content\backfill\core56-batch-02-ai-search-core.ts
```

Then run the normal backfill gate:

```powershell
npm run insights:backfill:validate
npm run insights:verify-database
```

The converter creates a typed `InsightArticle[]` module from Claude's article packages. It is still an editorial draft, not an automatic publish approval.

---

## Batch Brief

# Core 56 Claude Batch Brief - Local, Franchise, International SEO

Use this file together with `docs/core56-claude-master-prompt.vi.md`.
Write complete English article packages only for the article IDs in this batch.

## Batch Articles

| ID | Title | Primary keyword | Money page |
|---|---|---|---|
| TC-022 | Local SEO for Multi-Location Businesses: Architecture, Reviews, Listings, and Local Content | multi-location SEO | /services/local-seo |
| TC-023 | International SEO Architecture: Hreflang, Country Pages, Localization, and Canonicals | international SEO hreflang | /services/international-seo |
| TC-024 | Franchise SEO: How to Scale Local Visibility Without Duplicate or Doorway Pages | franchise SEO | /industries/franchise-local-seo |
| TC-044 | Local Landing Pages That Rank Without Becoming Doorway Pages | local landing pages SEO | /services/local-seo |
| TC-045 | Google Business Profile, Reviews, and Local Entity Consistency: A Governance Guide | Google Business Profile optimization | /services/local-seo |
| TC-046 | International SEO URL Structure: ccTLD vs Subfolder vs Subdomain vs One Global Site | international SEO URL structure | /services/international-seo |
| TC-047 | SEO Localization for USA, Canada, and Australia: Language, Trust, Offers, and Conversion | SEO localization USA Canada Australia | /services/international-seo |

## Article Briefs

### TC-022 - Local SEO for Multi-Location Businesses: Architecture, Reviews, Listings, and Local Content

#### Master row

- **Priority:** 22
- **Cluster:** Local SEO & Franchise
- **Role:** Industry / Market Guide
- **Wave:** Wave 2
- **Primary money page:** /services/local-seo
- **Supporting pages:** /industries/franchise-local-seo
- **Format:** Multi-location strategy guide
- **Unique angle / information gain:** Provide a governance model that scales unique local proof and accurate entities without doorway pages.
- **Original asset:** Multi-location governance matrix
- **Target words:** 3,600–4,600
- **Provisional outline score:** 99.4
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Biannual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Local SEO for Multi-Location Businesses: Architecture, Reviews, Listings, and Local Content
- **Suggested URL slug:** local-seo-for-multi-location-businesses-architecture-reviews-listings-and-l
- **Meta title:** Local SEO for Multi-Location Businesses
- **Meta description:** See the market-specific strategy, architecture and measurement plan for multi-location SEO. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** multi-location SEO
- **Search intent:** Informational / commercial investigation
- **Target market:** USA, Canada, Australia
- **Target words:** 3,600–4,600
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Provide a governance model that scales unique local proof and accurate entities without doorway pages. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • What should be on a location landing page?
• How do you avoid duplicate location pages?
• Should each location have its own Google Business Profile?
• How do reviews affect local SEO?
- **Unique evidence / asset:** Multi-location governance matrix
Information-gain requirement: Provide a governance model that scales unique local proof and accurate entities without doorway pages.
- **Source keys:** GLOCAL|GSPAM|GLINK
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.
- **Internal links:** Primary money page: /services/local-seo
Supporting pages: /industries/franchise-local-seo
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 industry/market journey or architecture diagram; 1 comparison matrix; 2 evidence-led examples; market labels on regional visuals.
- **Conversion CTA:** CTA: request a multi-location SEO blueprint.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Biannual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer multi-location SEO directly in 80–120 words. Provide a governance model that scales unique local proof and accurate entities without doorway pages.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.
2. **H2 - Design the multi-location information architecture**
  - Coverage: Store/office hierarchy, service areas, finders, crawl paths and ownership.
  - Evidence/output: Use source keys GLOCAL|GSPAM|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.
3. **H2 - Build useful location pages**
  - Coverage: Unique services, team, proof, availability, directions, FAQs and local conversion details.
  - Evidence/output: Use source keys GLOCAL|GSPAM|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.
4. **H2 - Govern listings and entity consistency**
  - Coverage: Business profiles, directories, NAP/service data, hours, categories and change control.
  - Evidence/output: Use source keys GLOCAL|GSPAM|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.
5. **H2 - Create an ethical review system**
  - Coverage: Request flows, response standards, issue escalation and location-level analysis.
  - Evidence/output: Use source keys GLOCAL|GSPAM|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.
6. **H2 - Measure local visibility and revenue**
  - Coverage: Local pack, organic pages, calls, bookings, store actions and location quality.
  - Evidence/output: Use source keys GLOCAL|GSPAM|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Multi-location governance matrix
  - Market handling: Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: What should be on a location landing page?
How do you avoid duplicate location pages?
Should each location have its own Google Business Profile?
How do reviews affect local SEO?
  - Market handling: Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a multi-location SEO blueprint.
  - Market handling: Use separate examples for US state/city, Canadian province/city and Australian state/city terminology.

### TC-023 - International SEO Architecture: Hreflang, Country Pages, Localization, and Canonicals

#### Master row

- **Priority:** 23
- **Cluster:** International SEO
- **Role:** Pillar
- **Wave:** Wave 2
- **Primary money page:** /services/international-seo
- **Supporting pages:** /markets
- **Format:** Technical international pillar
- **Unique angle / information gain:** Use a decision tree to distinguish language targeting, regional targeting and genuine localization.
- **Original asset:** International architecture decision tree + hreflang QA sheet
- **Target words:** 3,800–4,800
- **Provisional outline score:** 99.1
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Annual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** International SEO Architecture: Hreflang, Country Pages, Localization, and Canonicals
- **Suggested URL slug:** international-seo-architecture-hreflang-country-pages-localization-and-cano
- **Meta title:** International SEO Architecture
- **Meta description:** Use the framework, examples and implementation plan for international SEO hreflang. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** international SEO hreflang
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 3,800–4,800
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Use a decision tree to distinguish language targeting, regional targeting and genuine localization. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Do same-language country pages need hreflang?
• Can hreflang fix duplicate content?
• Should international pages use separate domains?
• What is x-default?
- **Unique evidence / asset:** International architecture decision tree + hreflang QA sheet
Information-gain requirement: Use a decision tree to distinguish language targeting, regional targeting and genuine localization.
- **Source keys:** GHREF|GMIG|GHELP
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.
- **Internal links:** Primary money page: /services/international-seo
Supporting pages: /markets
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 flagship framework diagram; 1 decision tree; 2–3 implementation tables; optional expert video or annotated example.
- **Conversion CTA:** CTA: request an international SEO architecture review.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Annual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer international SEO hreflang directly in 80–120 words. Use a decision tree to distinguish language targeting, regional targeting and genuine localization.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.
2. **H2 - Map audiences before URLs**
  - Coverage: Language, country, product availability, legal content, currency and search demand.
  - Evidence/output: Use source keys GHREF|GMIG|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.
3. **H2 - Choose an international URL model**
  - Coverage: ccTLD, subfolder, subdomain and one-global-URL tradeoffs.
  - Evidence/output: Use source keys GHREF|GMIG|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.
4. **H2 - Implement hreflang correctly**
  - Coverage: Language-region codes, reciprocal/self references, x-default and canonical compatibility.
  - Evidence/output: Use source keys GHREF|GMIG|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.
5. **H2 - Localize beyond translation**
  - Coverage: Keywords, examples, trust, offers, links, spelling, media and conversion flows.
  - Evidence/output: Use source keys GHREF|GMIG|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.
6. **H2 - QA and monitor the system**
  - Coverage: Crawls, Search Console, logs, wrong-country rankings, stale alternates and migration controls.
  - Evidence/output: Use source keys GHREF|GMIG|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: International architecture decision tree + hreflang QA sheet
  - Market handling: Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Do same-language country pages need hreflang?
Can hreflang fix duplicate content?
Should international pages use separate domains?
What is x-default?
  - Market handling: Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request an international SEO architecture review.
  - Market handling: Use Taskcover's USA/Canada/Australia architecture as a worked example, while explaining that hreflang is only appropriate for true alternates.

### TC-024 - Franchise SEO: How to Scale Local Visibility Without Duplicate or Doorway Pages

#### Master row

- **Priority:** 24
- **Cluster:** Local SEO & Franchise
- **Role:** Industry / Market Guide
- **Wave:** Wave 3
- **Primary money page:** /industries/franchise-local-seo
- **Supporting pages:** /services/local-seo
- **Format:** Industry strategy guide
- **Unique angle / information gain:** Balance franchisor governance with franchisee-specific proof, inventory and market demand.
- **Original asset:** Franchise SEO responsibility matrix
- **Target words:** 3,200–4,100
- **Provisional outline score:** 99.4
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Annual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Franchise SEO: How to Scale Local Visibility Without Duplicate or Doorway Pages
- **Suggested URL slug:** franchise-seo-how-to-scale-local-visibility-without-duplicate-or-doorway-pa
- **Meta title:** Franchise SEO
- **Meta description:** See the market-specific strategy, architecture and measurement plan for franchise SEO. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** franchise SEO
- **Search intent:** Informational / commercial investigation
- **Target market:** USA, Canada, Australia
- **Target words:** 3,200–4,100
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Balance franchisor governance with franchisee-specific proof, inventory and market demand. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Should franchisees have separate websites?
• How much local content must each franchise page contain?
• Who should own Google Business Profiles?
• How do franchises avoid doorway pages?
- **Unique evidence / asset:** Franchise SEO responsibility matrix
Information-gain requirement: Balance franchisor governance with franchisee-specific proof, inventory and market demand.
- **Source keys:** GLOCAL|GSPAM|GLINK
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** Explain differences in franchise terminology and local profile governance across the three target countries.
- **Internal links:** Primary money page: /industries/franchise-local-seo
Supporting pages: /services/local-seo
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 industry/market journey or architecture diagram; 1 comparison matrix; 2 evidence-led examples; market labels on regional visuals.
- **Conversion CTA:** CTA: request a franchise local-search framework.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Annual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer franchise SEO directly in 80–120 words. Balance franchisor governance with franchisee-specific proof, inventory and market demand.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Explain differences in franchise terminology and local profile governance across the three target countries.
2. **H2 - Define franchisor and franchisee ownership**
  - Coverage: Brand pages, local pages, content, listings, reviews, data and approvals.
  - Evidence/output: Use source keys GLOCAL|GSPAM|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Explain differences in franchise terminology and local profile governance across the three target countries.
3. **H2 - Design scalable site architecture**
  - Coverage: National/category hubs, territories, location finders and local conversion routes.
  - Evidence/output: Use source keys GLOCAL|GSPAM|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Explain differences in franchise terminology and local profile governance across the three target countries.
4. **H2 - Create genuinely differentiated local pages**
  - Coverage: People, service availability, local proof, community context and FAQs.
  - Evidence/output: Use source keys GLOCAL|GSPAM|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Explain differences in franchise terminology and local profile governance across the three target countries.
5. **H2 - Govern listings, reviews and brand consistency**
  - Coverage: Templates, data feeds, permissions, response policy and escalation.
  - Evidence/output: Use source keys GLOCAL|GSPAM|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Explain differences in franchise terminology and local profile governance across the three target countries.
6. **H2 - Measure network and location performance**
  - Coverage: Coverage, local visibility, lead quality, outliers and franchisee adoption.
  - Evidence/output: Use source keys GLOCAL|GSPAM|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Explain differences in franchise terminology and local profile governance across the three target countries.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Franchise SEO responsibility matrix
  - Market handling: Explain differences in franchise terminology and local profile governance across the three target countries.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Explain differences in franchise terminology and local profile governance across the three target countries.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Should franchisees have separate websites?
How much local content must each franchise page contain?
Who should own Google Business Profiles?
How do franchises avoid doorway pages?
  - Market handling: Explain differences in franchise terminology and local profile governance across the three target countries.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a franchise local-search framework.
  - Market handling: Explain differences in franchise terminology and local profile governance across the three target countries.

### TC-044 - Local Landing Pages That Rank Without Becoming Doorway Pages

#### Master row

- **Priority:** 44
- **Cluster:** Local SEO & Franchise
- **Role:** Supporting Cluster
- **Wave:** Wave 3
- **Primary money page:** /services/local-seo
- **Supporting pages:** /industries/franchise-local-seo
- **Format:** Page specification + QA guide
- **Unique angle / information gain:** Define the minimum unique utility and proof required before a city or location URL should exist.
- **Original asset:** Local landing-page specification and doorway-risk checklist
- **Target words:** 2,900–3,700
- **Provisional outline score:** 97.9
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** Exact SERP intent and competitor-gap validation required
- **Update cycle:** Biannual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Local Landing Pages That Rank Without Becoming Doorway Pages
- **Suggested URL slug:** local-landing-pages-that-rank-without-becoming-doorway-pages
- **Meta title:** Local Landing Pages That Rank Without Becoming Doorway Pages
- **Meta description:** Learn the practical steps, risks and decision rules for local landing pages SEO. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** local landing pages SEO
- **Search intent:** Informational / commercial investigation
- **Target market:** USA, Canada, Australia
- **Target words:** 2,900–3,700
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Define the minimum unique utility and proof required before a city or location URL should exist. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • How unique must a location page be?
• Can a service-area business create city pages?
• Are city pages doorway pages?
• Should locations use separate domains?
- **Unique evidence / asset:** Local landing-page specification and doorway-risk checklist
Information-gain requirement: Define the minimum unique utility and proof required before a city or location URL should exist.
- **Source keys:** GSPAM|GLOCAL|GLINK
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.
- **Internal links:** Primary money page: /services/local-seo
Supporting pages: /industries/franchise-local-seo
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; HowTo only when every visible step is represented; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 process/decision visual; 1 practical table; current screenshots/examples only where permissioned.
- **Conversion CTA:** CTA: request a location-page and local-architecture audit.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Biannual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer local landing pages SEO directly in 80–120 words. Define the minimum unique utility and proof required before a city or location URL should exist.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.
2. **H2 - Decide whether a local page deserves to exist**
  - Coverage: Real service, staff, proof, availability, demand and conversion path.
  - Evidence/output: Use source keys GSPAM|GLOCAL|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.
3. **H2 - Build the page around local usefulness**
  - Coverage: Location details, service differences, people, projects, reviews, directions and FAQs.
  - Evidence/output: Use source keys GSPAM|GLOCAL|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.
4. **H2 - Avoid templated duplication**
  - Coverage: No city swaps, false offices, spun copy, hidden text or mass-generated near-duplicates.
  - Evidence/output: Use source keys GSPAM|GLOCAL|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.
5. **H2 - Connect pages to the site and local entity**
  - Coverage: Finders, breadcrumbs, service hubs, profiles, listings and consistent facts.
  - Evidence/output: Use source keys GSPAM|GLOCAL|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.
6. **H2 - QA performance and consolidation decisions**
  - Coverage: Indexation, engagement, leads, overlap, stale locations and merge/remove rules.
  - Evidence/output: Use source keys GSPAM|GLOCAL|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Local landing-page specification and doorway-risk checklist
  - Market handling: Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: How unique must a location page be?
Can a service-area business create city pages?
Are city pages doorway pages?
Should locations use separate domains?
  - Market handling: Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a location-page and local-architecture audit.
  - Market handling: Local proof must be specific to the named US city/state, Canadian city/province or Australian city/state.

### TC-045 - Google Business Profile, Reviews, and Local Entity Consistency: A Governance Guide

#### Master row

- **Priority:** 45
- **Cluster:** Local SEO & Franchise
- **Role:** Supporting Cluster
- **Wave:** Wave 3
- **Primary money page:** /services/local-seo
- **Supporting pages:** /industries/franchise-local-seo
- **Format:** Governance guide
- **Unique angle / information gain:** Create repeatable controls for profile accuracy, reviews, changes and location-level accountability.
- **Original asset:** GBP/listing governance checklist
- **Target words:** 2,800–3,600
- **Provisional outline score:** 97.9
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** Exact SERP intent and competitor-gap validation required
- **Update cycle:** Monthly
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Google Business Profile, Reviews, and Local Entity Consistency: A Governance Guide
- **Suggested URL slug:** google-business-profile-reviews-and-local-entity-consistency-a-governance-g
- **Meta title:** Google Business Profile, Reviews, and Local Entity Consistency
- **Meta description:** Learn the practical steps, risks and decision rules for Google Business Profile optimization. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** Google Business Profile optimization
- **Search intent:** Informational / commercial investigation
- **Target market:** USA, Canada, Australia
- **Target words:** 2,800–3,600
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Create repeatable controls for profile accuracy, reviews, changes and location-level accountability. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • How often should Google Business Profiles be updated?
• Do keywords in reviews affect local SEO?
• Can businesses ask customers for reviews?
• How do you manage profiles for many locations?
- **Unique evidence / asset:** GBP/listing governance checklist
Information-gain requirement: Create repeatable controls for profile accuracy, reviews, changes and location-level accountability.
- **Source keys:** GLOCAL|GHELP
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** Use market-appropriate profile categories and directories; operational facts must match the actual location.
- **Internal links:** Primary money page: /services/local-seo
Supporting pages: /industries/franchise-local-seo
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; HowTo only when every visible step is represented; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 process/decision visual; 1 practical table; current screenshots/examples only where permissioned.
- **Conversion CTA:** CTA: request local-profile and review governance.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Monthly
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer Google Business Profile optimization directly in 80–120 words. Create repeatable controls for profile accuracy, reviews, changes and location-level accountability.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Use market-appropriate profile categories and directories; operational facts must match the actual location.
2. **H2 - Establish the source of truth for every location**
  - Coverage: Name, address/service area, phone, categories, hours, URLs, services and attributes.
  - Evidence/output: Use source keys GLOCAL|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Use market-appropriate profile categories and directories; operational facts must match the actual location.
3. **H2 - Optimize profiles without misrepresentation**
  - Coverage: Primary/secondary categories, descriptions, photos, products/services and landing pages.
  - Evidence/output: Use source keys GLOCAL|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Use market-appropriate profile categories and directories; operational facts must match the actual location.
4. **H2 - Build an ethical review operating system**
  - Coverage: Request timing, platform policy, responses, escalations and insight extraction.
  - Evidence/output: Use source keys GLOCAL|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Use market-appropriate profile categories and directories; operational facts must match the actual location.
5. **H2 - Synchronize important external sources**
  - Coverage: Directories, industry profiles, social pages, maps and owned location pages.
  - Evidence/output: Use source keys GLOCAL|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Use market-appropriate profile categories and directories; operational facts must match the actual location.
6. **H2 - Monitor local performance and data drift**
  - Coverage: Profile actions, local visibility, reviews, edits, suspensions and change logs.
  - Evidence/output: Use source keys GLOCAL|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Use market-appropriate profile categories and directories; operational facts must match the actual location.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: GBP/listing governance checklist
  - Market handling: Use market-appropriate profile categories and directories; operational facts must match the actual location.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Use market-appropriate profile categories and directories; operational facts must match the actual location.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: How often should Google Business Profiles be updated?
Do keywords in reviews affect local SEO?
Can businesses ask customers for reviews?
How do you manage profiles for many locations?
  - Market handling: Use market-appropriate profile categories and directories; operational facts must match the actual location.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request local-profile and review governance.
  - Market handling: Use market-appropriate profile categories and directories; operational facts must match the actual location.

### TC-046 - International SEO URL Structure: ccTLD vs Subfolder vs Subdomain vs One Global Site

#### Master row

- **Priority:** 46
- **Cluster:** International SEO
- **Role:** Pillar
- **Wave:** Wave 3
- **Primary money page:** /services/international-seo
- **Supporting pages:** /markets
- **Format:** Architecture decision pillar
- **Unique angle / information gain:** Choose architecture using business operations, localization and maintenance realities—not simplistic ranking myths.
- **Original asset:** International URL architecture decision model
- **Target words:** 3,100–4,000
- **Provisional outline score:** 99.1
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Annual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** International SEO URL Structure: ccTLD vs Subfolder vs Subdomain vs One Global Site
- **Suggested URL slug:** international-seo-url-structure-cctld-vs-subfolder-vs-subdomain-vs-one-glob
- **Meta title:** International SEO URL Structure
- **Meta description:** Use the framework, examples and implementation plan for international SEO URL structure. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** international SEO URL structure
- **Search intent:** Comparison / commercial investigation
- **Target market:** Global English
- **Target words:** 3,100–4,000
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Choose architecture using business operations, localization and maintenance realities—not simplistic ranking myths. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Do ccTLDs rank better locally?
• Are subfolders better than subdomains for SEO?
• Can one URL target multiple countries?
• When should an international site be migrated?
- **Unique evidence / asset:** International URL architecture decision model
Information-gain requirement: Choose architecture using business operations, localization and maintenance realities—not simplistic ranking myths.
- **Source keys:** GHREF|GHELP|GMIG
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** Use USA, Canada and Australia as the primary same-language case study.
- **Internal links:** Primary money page: /services/international-seo
Supporting pages: /markets
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 flagship framework diagram; 1 decision tree; 2–3 implementation tables; optional expert video or annotated example.
- **Conversion CTA:** CTA: request an international architecture recommendation.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Annual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer international SEO URL structure directly in 80–120 words. Choose architecture using business operations, localization and maintenance realities—not simplistic ranking myths.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Use USA, Canada and Australia as the primary same-language case study.
2. **H2 - Define the decisions the architecture must support**
  - Coverage: Language, country, legal entity, inventory, currency, teams and governance.
  - Evidence/output: Use source keys GHREF|GHELP|GMIG and add the original examples/visuals specified in the brief.
  - Market handling: Use USA, Canada and Australia as the primary same-language case study.
3. **H2 - ccTLD model**
  - Coverage: Market clarity, trust, cost, authority fragmentation and operational fit.
  - Evidence/output: Use source keys GHREF|GHELP|GMIG and add the original examples/visuals specified in the brief.
  - Market handling: Use USA, Canada and Australia as the primary same-language case study.
4. **H2 - Subfolder model**
  - Coverage: Consolidated authority, deployment simplicity, localization and reporting.
  - Evidence/output: Use source keys GHREF|GHELP|GMIG and add the original examples/visuals specified in the brief.
  - Market handling: Use USA, Canada and Australia as the primary same-language case study.
5. **H2 - Subdomain and one-global-URL models**
  - Coverage: Separation needs, crawl/discovery, locale adaptation risks and use cases.
  - Evidence/output: Use source keys GHREF|GHELP|GMIG and add the original examples/visuals specified in the brief.
  - Market handling: Use USA, Canada and Australia as the primary same-language case study.
6. **H2 - Make and document the decision**
  - Coverage: Weighted criteria, migration path, hreflang plan, analytics and future markets.
  - Evidence/output: Use source keys GHREF|GHELP|GMIG and add the original examples/visuals specified in the brief.
  - Market handling: Use USA, Canada and Australia as the primary same-language case study.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: International URL architecture decision model
  - Market handling: Use USA, Canada and Australia as the primary same-language case study.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Use USA, Canada and Australia as the primary same-language case study.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Do ccTLDs rank better locally?
Are subfolders better than subdomains for SEO?
Can one URL target multiple countries?
When should an international site be migrated?
  - Market handling: Use USA, Canada and Australia as the primary same-language case study.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request an international architecture recommendation.
  - Market handling: Use USA, Canada and Australia as the primary same-language case study.

### TC-047 - SEO Localization for USA, Canada, and Australia: Language, Trust, Offers, and Conversion

#### Master row

- **Priority:** 47
- **Cluster:** International SEO
- **Role:** Industry / Market Guide
- **Wave:** Wave 3
- **Primary money page:** /services/international-seo
- **Supporting pages:** /markets/usa-seo-agency; /markets/canada-seo-agency; /markets/australia-seo-agency
- **Format:** Regional localization guide
- **Unique angle / information gain:** Show that same-language markets still require differences in wording, proof, currency, offers and source ecosystems.
- **Original asset:** Three-market localization checklist
- **Target words:** 3,200–4,100
- **Provisional outline score:** 99.4
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Annual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** SEO Localization for USA, Canada, and Australia: Language, Trust, Offers, and Conversion
- **Suggested URL slug:** seo-localization-for-usa-canada-and-australia-language-trust-offers-and-con
- **Meta title:** SEO Localization for USA, Canada, and Australia
- **Meta description:** See the market-specific strategy, architecture and measurement plan for SEO localization USA Canada Australia. Built for Google, AI Search and measurable busi
- **Primary keyword:** SEO localization USA Canada Australia
- **Search intent:** Informational / commercial investigation
- **Target market:** USA, Canada, Australia
- **Target words:** 3,200–4,100
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Show that same-language markets still require differences in wording, proof, currency, offers and source ecosystems. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Is translation enough for international SEO?
• Should Canada use US or British spelling?
• Does Australian spelling affect rankings?
• When should same-language pages use hreflang?
- **Unique evidence / asset:** Three-market localization checklist
Information-gain requirement: Show that same-language markets still require differences in wording, proof, currency, offers and source ecosystems.
- **Source keys:** GHREF|GSPAM|GHELP
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** This is the localization standard for all Taskcover market content.
- **Internal links:** Primary money page: /services/international-seo
Supporting pages: /markets/usa-seo-agency; /markets/canada-seo-agency; /markets/australia-seo-agency
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; HowTo only when every visible step is represented; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 industry/market journey or architecture diagram; 1 comparison matrix; 2 evidence-led examples; market labels on regional visuals.
- **Conversion CTA:** CTA: request a localized market content plan.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Annual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer SEO localization USA Canada Australia directly in 80–120 words. Show that same-language markets still require differences in wording, proof, currency, offers and source ecosystems.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: This is the localization standard for all Taskcover market content.
2. **H2 - Decide what must be localized**
  - Coverage: Demand, spelling, terminology, legal facts, currency, pricing, proof, examples and CTAs.
  - Evidence/output: Use source keys GHREF|GSPAM|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: This is the localization standard for all Taskcover market content.
3. **H2 - USA localization checklist**
  - Coverage: US spelling, state/city context, USD, industries, publications and buyer expectations.
  - Evidence/output: Use source keys GHREF|GSPAM|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: This is the localization standard for all Taskcover market content.
4. **H2 - Canada localization checklist**
  - Coverage: Canadian spelling patterns, province context, CAD, bilingual considerations and local sources.
  - Evidence/output: Use source keys GHREF|GSPAM|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: This is the localization standard for all Taskcover market content.
5. **H2 - Australia localization checklist**
  - Coverage: Australian spelling, state/city context, AUD, local media and commercial language.
  - Evidence/output: Use source keys GHREF|GSPAM|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: This is the localization standard for all Taskcover market content.
6. **H2 - Govern same-language regional pages**
  - Coverage: Ownership, hreflang if true alternates, updates, duplication checks and conversion reporting.
  - Evidence/output: Use source keys GHREF|GSPAM|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: This is the localization standard for all Taskcover market content.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Three-market localization checklist
  - Market handling: This is the localization standard for all Taskcover market content.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: This is the localization standard for all Taskcover market content.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Is translation enough for international SEO?
Should Canada use US or British spelling?
Does Australian spelling affect rankings?
When should same-language pages use hreflang?
  - Market handling: This is the localization standard for all Taskcover market content.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a localized market content plan.
  - Market handling: This is the localization standard for all Taskcover market content.

## Source Keys For This Batch

- `GHELP`: Google — Creating helpful, reliable, people-first content - https://developers.google.com/search/docs/fundamentals/creating-helpful-content
  - Used for: Originality, expertise, sourcing, authorship and people-first quality.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GHREF`: Google — Localized versions of pages - https://developers.google.com/search/docs/specialty/international/localized-versions
  - Used for: Hreflang and genuine language/region alternates.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GLINK`: Google — SEO link best practices - https://developers.google.com/search/docs/crawling-indexing/links-crawlable
  - Used for: Crawlable links, descriptive anchors and internal discovery.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GLOCAL`: Google Business Profile — Improve local ranking - https://support.google.com/business/answer/7091
  - Used for: Relevance, distance, prominence, accurate information and reviews.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GMIG`: Google — Site moves and migrations - https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
  - Used for: URL mapping, redirects, launch monitoring and migration controls.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GSPAM`: Google — Spam policies for Web Search - https://developers.google.com/search/docs/essentials/spam-policies
  - Used for: Scaled content, doorway pages, link spam and abusive practices.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
