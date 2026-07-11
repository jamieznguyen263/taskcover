# Ready Claude Prompt - Industry SEO

Copy this whole file into Claude as one request. Do not send more than one batch per request.

## Operator Instruction

You are Claude. Complete only the article IDs listed in this prompt. Return a complete `articlePackages` JSON payload that passes the Taskcover validation contract below. Do not add articles outside this batch.

Batch slug: `batch-08-industry-seo`
Required article IDs: `TC-025`, `TC-026`, `TC-027`, `TC-028`, `TC-029`, `TC-030`

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

# Core 56 Claude Batch Brief - Industry SEO

Use this file together with `docs/core56-claude-master-prompt.vi.md`.
Write complete English article packages only for the article IDs in this batch.

## Batch Articles

| ID | Title | Primary keyword | Money page |
|---|---|---|---|
| TC-025 | Travel SEO Strategy: Win Discovery Across Google, AI Search, and Destination Research | travel SEO strategy | /industries/travel-seo |
| TC-026 | Education SEO Strategy: Increase Program Discovery and Qualified Student Enquiries | education SEO strategy | /industries/education-seo |
| TC-027 | Healthcare SEO Strategy: Build Trust, Local Visibility, and Patient Demand | healthcare SEO strategy | /industries/healthcare-seo |
| TC-028 | Law Firm and Immigration SEO Strategy: Build Qualified Demand Without Thin Location Pages | law firm SEO strategy | /industries/legal-immigration-seo |
| TC-029 | SaaS SEO Strategy: Build Category Demand, Comparison Visibility, and Product-Led Organic Growth | SaaS SEO strategy | /industries/saas-seo |
| TC-030 | Ecommerce SEO Strategy: Category Architecture, Product Discovery, and AI Shopping Visibility | ecommerce SEO strategy | /industries/ecommerce-seo |

## Article Briefs

### TC-025 - Travel SEO Strategy: Win Discovery Across Google, AI Search, and Destination Research

#### Master row

- **Priority:** 25
- **Cluster:** Industry SEO
- **Role:** Industry / Market Guide
- **Wave:** Wave 3
- **Primary money page:** /industries/travel-seo
- **Supporting pages:** /services/international-seo; /services/ai-search-optimization
- **Format:** Industry pillar guide
- **Unique angle / information gain:** Map the long, exploratory travel journey from inspiration to booking and identify where independent sources influence choice.
- **Original asset:** Travel search-journey map + destination content matrix
- **Target words:** 3,500–4,500
- **Provisional outline score:** 99.1
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Quarterly
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Travel SEO Strategy: Win Discovery Across Google, AI Search, and Destination Research
- **Suggested URL slug:** travel-seo-strategy-win-discovery-across-google-ai-search-and-destination-r
- **Meta title:** Travel SEO Strategy
- **Meta description:** See the market-specific strategy, architecture and measurement plan for travel SEO strategy. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** travel SEO strategy
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 3,500–4,500
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Map the long, exploratory travel journey from inspiration to booking and identify where independent sources influence choice. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • How is travel SEO different from general SEO?
• Do destination guides still rank?
• How can travel brands appear in AI recommendations?
• How should seasonal travel content be updated?
- **Unique evidence / asset:** Travel search-journey map + destination content matrix
Information-gain requirement: Map the long, exploratory travel journey from inspiration to booking and identify where independent sources influence choice.
- **Source keys:** GAI|GHREF|GHELP|GEO25
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.
- **Internal links:** Primary money page: /industries/travel-seo
Supporting pages: /services/international-seo; /services/ai-search-optimization
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 industry/market journey or architecture diagram; 1 comparison matrix; 2 evidence-led examples; market labels on regional visuals.
- **Conversion CTA:** CTA: request a travel search opportunity map.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Quarterly
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer travel SEO strategy directly in 80–120 words. Map the long, exploratory travel journey from inspiration to booking and identify where independent sources influence choice.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.
2. **H2 - Map travel demand by journey stage**
  - Coverage: Inspiration, destination comparison, planning, product evaluation, booking and in-trip questions.
  - Evidence/output: Use source keys GAI|GHREF|GHELP|GEO25 and add the original examples/visuals specified in the brief.
  - Market handling: Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.
3. **H2 - Build destination and product architecture**
  - Coverage: Countries, cities, themes, seasons, routes, hotels/tours and availability.
  - Evidence/output: Use source keys GAI|GHREF|GHELP|GEO25 and add the original examples/visuals specified in the brief.
  - Market handling: Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.
4. **H2 - Create useful, trustworthy travel content**
  - Coverage: First-hand media, dates, logistics, limitations, prices, accessibility and update controls.
  - Evidence/output: Use source keys GAI|GHREF|GHELP|GEO25 and add the original examples/visuals specified in the brief.
  - Market handling: Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.
5. **H2 - Optimize for international and AI discovery**
  - Coverage: Localization, source authority, reviews, structured facts and comparison-ready passages.
  - Evidence/output: Use source keys GAI|GHREF|GHELP|GEO25 and add the original examples/visuals specified in the brief.
  - Market handling: Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.
6. **H2 - Measure beyond last-click bookings**
  - Coverage: Assisted journeys, returning users, itinerary actions, brand search and market-level demand.
  - Evidence/output: Use source keys GAI|GHREF|GHELP|GEO25 and add the original examples/visuals specified in the brief.
  - Market handling: Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Travel search-journey map + destination content matrix
  - Market handling: Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: How is travel SEO different from general SEO?
Do destination guides still rank?
How can travel brands appear in AI recommendations?
How should seasonal travel content be updated?
  - Market handling: Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a travel search opportunity map.
  - Market handling: Include market examples for outbound and inbound demand in USA, Canada and Australia; label seasonality carefully.

### TC-026 - Education SEO Strategy: Increase Program Discovery and Qualified Student Enquiries

#### Master row

- **Priority:** 26
- **Cluster:** Industry SEO
- **Role:** Industry / Market Guide
- **Wave:** Wave 3
- **Primary money page:** /industries/education-seo
- **Supporting pages:** /services/content-marketing; /services/international-seo
- **Format:** Industry strategy guide
- **Unique angle / information gain:** Structure program, admissions and international-student information around decision confidence and qualified enquiry.
- **Original asset:** Education search-journey + program-page specification
- **Target words:** 3,500–4,500
- **Provisional outline score:** 99.1
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Quarterly
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Education SEO Strategy: Increase Program Discovery and Qualified Student Enquiries
- **Suggested URL slug:** education-seo-strategy-increase-program-discovery-and-qualified-student-enq
- **Meta title:** Education SEO Strategy
- **Meta description:** See the market-specific strategy, architecture and measurement plan for education SEO strategy. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** education SEO strategy
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 3,500–4,500
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Structure program, admissions and international-student information around decision confidence and qualified enquiry. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • What should an SEO-friendly program page include?
• How can universities target international students?
• Should each intake have a separate page?
• How do you measure education SEO?
- **Unique evidence / asset:** Education search-journey + program-page specification
Information-gain requirement: Structure program, admissions and international-student information around decision confidence and qualified enquiry.
- **Source keys:** GHELP|GHREF|GAI
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.
- **Internal links:** Primary money page: /industries/education-seo
Supporting pages: /services/content-marketing; /services/international-seo
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 industry/market journey or architecture diagram; 1 comparison matrix; 2 evidence-led examples; market labels on regional visuals.
- **Conversion CTA:** CTA: request an education search and content audit.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Quarterly
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer education SEO strategy directly in 80–120 words. Structure program, admissions and international-student information around decision confidence and qualified enquiry.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.
2. **H2 - Map the student and parent decision journey**
  - Coverage: Subject discovery, institution comparison, eligibility, cost, outcomes, application and enrolment.
  - Evidence/output: Use source keys GHELP|GHREF|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.
3. **H2 - Design program and subject architecture**
  - Coverage: Program facts, campuses, modes, intakes, prerequisites, outcomes and related pathways.
  - Evidence/output: Use source keys GHELP|GHREF|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.
4. **H2 - Create trustworthy decision content**
  - Coverage: Fees, scholarships, accreditation, faculty, careers, deadlines and source ownership.
  - Evidence/output: Use source keys GHELP|GHREF|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.
5. **H2 - Build international student visibility**
  - Coverage: Country/language demand, visa-information boundaries, market pages and local recruitment proof.
  - Evidence/output: Use source keys GHELP|GHREF|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.
6. **H2 - Measure qualified recruitment outcomes**
  - Coverage: Program impressions, enquiry quality, applications, enrolments and assisted journeys.
  - Evidence/output: Use source keys GHELP|GHREF|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Education search-journey + program-page specification
  - Market handling: Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: What should an SEO-friendly program page include?
How can universities target international students?
Should each intake have a separate page?
How do you measure education SEO?
  - Market handling: Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request an education search and content audit.
  - Market handling: Use enrolment/enrollment according to market context; legal/visa information must link to official current sources.

### TC-027 - Healthcare SEO Strategy: Build Trust, Local Visibility, and Patient Demand

#### Master row

- **Priority:** 27
- **Cluster:** Industry SEO
- **Role:** Industry / Market Guide
- **Wave:** Wave 3
- **Primary money page:** /industries/healthcare-seo
- **Supporting pages:** /services/local-seo; /services/content-marketing
- **Format:** YMYL industry guide
- **Unique angle / information gain:** Make medical accuracy, clinical review and patient safety non-negotiable components of visibility.
- **Original asset:** Healthcare editorial governance + local demand map
- **Target words:** 3,800–4,800
- **Provisional outline score:** 99.6
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** YMYL: qualified expert review and jurisdiction accuracy are mandatory
- **Update cycle:** Quarterly
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Healthcare SEO Strategy: Build Trust, Local Visibility, and Patient Demand
- **Suggested URL slug:** healthcare-seo-strategy-build-trust-local-visibility-and-patient-demand
- **Meta title:** Healthcare SEO Strategy
- **Meta description:** See the market-specific strategy, architecture and measurement plan for healthcare SEO strategy. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** healthcare SEO strategy
- **Search intent:** Informational / commercial investigation
- **Target market:** USA, Canada, Australia
- **Target words:** 3,800–4,800
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Make medical accuracy, clinical review and patient safety non-negotiable components of visibility. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Does healthcare content need medical review?
• How often should medical content be updated?
• What should a clinic location page include?
• Can healthcare SEO guarantee patient growth?
- **Unique evidence / asset:** Healthcare editorial governance + local demand map
Information-gain requirement: Make medical accuracy, clinical review and patient safety non-negotiable components of visibility.
- **Source keys:** GHELP|GLOCAL|GAI|HEALTHQ
- **Author / reviewer requirement:** Named SEO strategist + qualified medical reviewer; reviewer bio, credentials, review date and source standard required.
- **Regional localization instructions:** Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.
- **Internal links:** Primary money page: /industries/healthcare-seo
Supporting pages: /services/local-seo; /services/content-marketing
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 industry/market journey or architecture diagram; 1 comparison matrix; 2 evidence-led examples; market labels on regional visuals.
- **Conversion CTA:** CTA: request a healthcare SEO and trust audit.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result; No medical/legal advice; No unreviewed jurisdiction-specific claim
- **Update cycle:** Quarterly
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer healthcare SEO strategy directly in 80–120 words. Make medical accuracy, clinical review and patient safety non-negotiable components of visibility.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.
2. **H2 - Define service, condition and local intent safely**
  - Coverage: Separate educational content from diagnosis, treatment claims and emergency guidance.
  - Evidence/output: Use source keys GHELP|GLOCAL|GAI|HEALTHQ and add the original examples/visuals specified in the brief.
  - Market handling: Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.
3. **H2 - Build healthcare information architecture**
  - Coverage: Services, conditions, clinicians, locations, insurance/payment and patient resources.
  - Evidence/output: Use source keys GHELP|GLOCAL|GAI|HEALTHQ and add the original examples/visuals specified in the brief.
  - Market handling: Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.
4. **H2 - Establish medical editorial governance**
  - Coverage: Qualified author/reviewer, evidence hierarchy, dates, conflicts, corrections and disclaimers.
  - Evidence/output: Use source keys GHELP|GLOCAL|GAI|HEALTHQ and add the original examples/visuals specified in the brief.
  - Market handling: Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.
5. **H2 - Strengthen local and entity trust**
  - Coverage: Clinician profiles, credentials, facilities, reviews, directories and consistent facts.
  - Evidence/output: Use source keys GHELP|GLOCAL|GAI|HEALTHQ and add the original examples/visuals specified in the brief.
  - Market handling: Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.
6. **H2 - Measure patient demand responsibly**
  - Coverage: Qualified appointments, calls, service/location visibility, lead quality and privacy limits.
  - Evidence/output: Use source keys GHELP|GLOCAL|GAI|HEALTHQ and add the original examples/visuals specified in the brief.
  - Market handling: Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Healthcare editorial governance + local demand map
  - Market handling: Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Does healthcare content need medical review?
How often should medical content be updated?
What should a clinic location page include?
Can healthcare SEO guarantee patient growth?
  - Market handling: Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a healthcare SEO and trust audit.
  - Market handling: Country-specific regulation and healthcare terminology must be reviewed by a qualified local expert before publication.

### TC-028 - Law Firm and Immigration SEO Strategy: Build Qualified Demand Without Thin Location Pages

#### Master row

- **Priority:** 28
- **Cluster:** Industry SEO
- **Role:** Industry / Market Guide
- **Wave:** Wave 3
- **Primary money page:** /industries/legal-immigration-seo
- **Supporting pages:** /services/local-seo; /services/content-marketing
- **Format:** YMYL industry guide
- **Unique angle / information gain:** Build practice-area and jurisdiction clarity while avoiding generic legal claims and mass-produced city pages.
- **Original asset:** Legal practice-area ownership map + review checklist
- **Target words:** 3,600–4,600
- **Provisional outline score:** 99.6
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** YMYL: qualified expert review and jurisdiction accuracy are mandatory
- **Update cycle:** Quarterly
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Law Firm and Immigration SEO Strategy: Build Qualified Demand Without Thin Location Pages
- **Suggested URL slug:** law-firm-and-immigration-seo-strategy-build-qualified-demand-without-thin-l
- **Meta title:** Law Firm and Immigration SEO Strategy
- **Meta description:** See the market-specific strategy, architecture and measurement plan for law firm SEO strategy. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** law firm SEO strategy
- **Search intent:** Informational / commercial investigation
- **Target market:** USA, Canada, Australia
- **Target words:** 3,600–4,600
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Build practice-area and jurisdiction clarity while avoiding generic legal claims and mass-produced city pages. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Should law firms create a page for every city?
• Who should write legal content?
• How often must immigration content be updated?
• What is the best SEO structure for multiple practice areas?
- **Unique evidence / asset:** Legal practice-area ownership map + review checklist
Information-gain requirement: Build practice-area and jurisdiction clarity while avoiding generic legal claims and mass-produced city pages.
- **Source keys:** GHELP|GLOCAL|GSPAM
- **Author / reviewer requirement:** Named SEO strategist + qualified legal reviewer for every jurisdiction discussed; reviewer and review date required.
- **Regional localization instructions:** Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.
- **Internal links:** Primary money page: /industries/legal-immigration-seo
Supporting pages: /services/local-seo; /services/content-marketing
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; HowTo only when every visible step is represented; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 industry/market journey or architecture diagram; 1 comparison matrix; 2 evidence-led examples; market labels on regional visuals.
- **Conversion CTA:** CTA: request a legal-search architecture review.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result; No medical/legal advice; No unreviewed jurisdiction-specific claim
- **Update cycle:** Quarterly
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer law firm SEO strategy directly in 80–120 words. Build practice-area and jurisdiction clarity while avoiding generic legal claims and mass-produced city pages.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.
2. **H2 - Map legal demand by matter and jurisdiction**
  - Coverage: Problem, procedure, eligibility, location, urgency and representation intent.
  - Evidence/output: Use source keys GHELP|GLOCAL|GSPAM and add the original examples/visuals specified in the brief.
  - Market handling: Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.
3. **H2 - Design practice-area and location architecture**
  - Coverage: Matter hubs, lawyer profiles, offices, jurisdiction pages and consultation routes.
  - Evidence/output: Use source keys GHELP|GLOCAL|GSPAM and add the original examples/visuals specified in the brief.
  - Market handling: Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.
4. **H2 - Create reliable legal content**
  - Coverage: Qualified authorship, current law sources, dates, disclaimers and factual limits.
  - Evidence/output: Use source keys GHELP|GLOCAL|GSPAM and add the original examples/visuals specified in the brief.
  - Market handling: Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.
5. **H2 - Build local and professional authority**
  - Coverage: Profiles, bar/association data, publications, reviews, citations and community evidence.
  - Evidence/output: Use source keys GHELP|GLOCAL|GSPAM and add the original examples/visuals specified in the brief.
  - Market handling: Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.
6. **H2 - Measure qualified cases—not raw leads**
  - Coverage: Matter fit, jurisdiction, consultation rate, signed cases and source attribution.
  - Evidence/output: Use source keys GHELP|GLOCAL|GSPAM and add the original examples/visuals specified in the brief.
  - Market handling: Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Legal practice-area ownership map + review checklist
  - Market handling: Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Should law firms create a page for every city?
Who should write legal content?
How often must immigration content be updated?
What is the best SEO structure for multiple practice areas?
  - Market handling: Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a legal-search architecture review.
  - Market handling: Every legal claim and jurisdiction section requires review by a qualified professional in the relevant country/state/province.

### TC-029 - SaaS SEO Strategy: Build Category Demand, Comparison Visibility, and Product-Led Organic Growth

#### Master row

- **Priority:** 29
- **Cluster:** Industry SEO
- **Role:** Industry / Market Guide
- **Wave:** Wave 3
- **Primary money page:** /industries/saas-seo
- **Supporting pages:** /services/content-marketing; /services/technical-seo
- **Format:** Industry strategy guide
- **Unique angle / information gain:** Connect category creation, product use cases, comparisons and technical product surfaces to pipeline.
- **Original asset:** SaaS search architecture + page-type matrix
- **Target words:** 3,600–4,600
- **Provisional outline score:** 99.1
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Quarterly
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** SaaS SEO Strategy: Build Category Demand, Comparison Visibility, and Product-Led Organic Growth
- **Suggested URL slug:** saas-seo-strategy-build-category-demand-comparison-visibility-and-product-l
- **Meta title:** SaaS SEO Strategy
- **Meta description:** See the market-specific strategy, architecture and measurement plan for SaaS SEO strategy. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** SaaS SEO strategy
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 3,600–4,600
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Connect category creation, product use cases, comparisons and technical product surfaces to pipeline. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Should SaaS companies publish competitor comparison pages?
• How is SaaS SEO measured?
• Should documentation be indexed?
• What content attracts SaaS backlinks?
- **Unique evidence / asset:** SaaS search architecture + page-type matrix
Information-gain requirement: Connect category creation, product use cases, comparisons and technical product surfaces to pipeline.
- **Source keys:** GJS|GHELP|GAI
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.
- **Internal links:** Primary money page: /industries/saas-seo
Supporting pages: /services/content-marketing; /services/technical-seo
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 industry/market journey or architecture diagram; 1 comparison matrix; 2 evidence-led examples; market labels on regional visuals.
- **Conversion CTA:** CTA: request a SaaS organic-growth architecture.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Quarterly
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer SaaS SEO strategy directly in 80–120 words. Connect category creation, product use cases, comparisons and technical product surfaces to pipeline.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.
2. **H2 - Map SaaS demand and buying stages**
  - Coverage: Problem awareness, category, use case, integration, comparison, validation and implementation.
  - Evidence/output: Use source keys GJS|GHELP|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.
3. **H2 - Build commercial page architecture**
  - Coverage: Features, solutions, industries, integrations, alternatives, comparisons and pricing support.
  - Evidence/output: Use source keys GJS|GHELP|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.
4. **H2 - Create defensible informational content**
  - Coverage: Product data, benchmarks, templates, workflows, expert examples and original research.
  - Evidence/output: Use source keys GJS|GHELP|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.
5. **H2 - Handle technical SaaS SEO**
  - Coverage: JavaScript apps, docs, programmatic surfaces, canonicals, gated content and subdomains.
  - Evidence/output: Use source keys GJS|GHELP|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.
6. **H2 - Measure product-led organic growth**
  - Coverage: Qualified signups, activation, assisted pipeline, category demand and sales feedback.
  - Evidence/output: Use source keys GJS|GHELP|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: SaaS search architecture + page-type matrix
  - Market handling: Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Should SaaS companies publish competitor comparison pages?
How is SaaS SEO measured?
Should documentation be indexed?
What content attracts SaaS backlinks?
  - Market handling: Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a SaaS organic-growth architecture.
  - Market handling: Use one global article with examples of regional pricing, spelling and compliance only where materially relevant.

### TC-030 - Ecommerce SEO Strategy: Category Architecture, Product Discovery, and AI Shopping Visibility

#### Master row

- **Priority:** 30
- **Cluster:** Ecommerce SEO
- **Role:** Industry / Market Guide
- **Wave:** Wave 3
- **Primary money page:** /industries/ecommerce-seo
- **Supporting pages:** /services/ecommerce-seo; /services/technical-seo
- **Format:** Industry strategy guide
- **Unique angle / information gain:** Unify category architecture, product data, faceted navigation, merchant feeds and editorial demand.
- **Original asset:** Ecommerce SEO architecture blueprint
- **Target words:** 3,800–4,800
- **Provisional outline score:** 99.4
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Quarterly
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Ecommerce SEO Strategy: Category Architecture, Product Discovery, and AI Shopping Visibility
- **Suggested URL slug:** ecommerce-seo-strategy-category-architecture-product-discovery-and-ai-shopp
- **Meta title:** Ecommerce SEO Strategy
- **Meta description:** See the market-specific strategy, architecture and measurement plan for ecommerce SEO strategy. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** ecommerce SEO strategy
- **Search intent:** Informational / commercial investigation
- **Target market:** USA, Canada, Australia
- **Target words:** 3,800–4,800
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Unify category architecture, product data, faceted navigation, merchant feeds and editorial demand. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • How many words should a category page have?
• Should filtered pages be indexed?
• How does product schema affect SEO?
• How can products appear in AI shopping results?
- **Unique evidence / asset:** Ecommerce SEO architecture blueprint
Information-gain requirement: Unify category architecture, product data, faceted navigation, merchant feeds and editorial demand.
- **Source keys:** GECO|GAI|GHELP
- **Author / reviewer requirement:** Named technical SEO author; implementation examples reviewed by a developer or technical lead.
- **Regional localization instructions:** Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.
- **Internal links:** Primary money page: /industries/ecommerce-seo
Supporting pages: /services/ecommerce-seo; /services/technical-seo
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 industry/market journey or architecture diagram; 1 comparison matrix; 2 evidence-led examples; market labels on regional visuals.
- **Conversion CTA:** CTA: request an ecommerce search architecture audit.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Quarterly
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer ecommerce SEO strategy directly in 80–120 words. Unify category architecture, product data, faceted navigation, merchant feeds and editorial demand.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.
2. **H2 - Map ecommerce demand to page types**
  - Coverage: Category, subcategory, product, brand, comparison, guide and support queries.
  - Evidence/output: Use source keys GECO|GAI|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.
3. **H2 - Build crawlable category and product architecture**
  - Coverage: Navigation, internal links, pagination, inventory and canonical rules.
  - Evidence/output: Use source keys GECO|GAI|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.
4. **H2 - Control faceted navigation and duplicate URLs**
  - Coverage: Demand-led indexation, crawl controls, canonical limitations and testing.
  - Evidence/output: Use source keys GECO|GAI|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.
5. **H2 - Improve product information for search and AI shopping**
  - Coverage: Accurate attributes, variants, reviews, availability, structured data and feeds.
  - Evidence/output: Use source keys GECO|GAI|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.
6. **H2 - Measure revenue impact**
  - Coverage: Organic revenue, category visibility, product discovery, margin, assisted paths and market segments.
  - Evidence/output: Use source keys GECO|GAI|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Ecommerce SEO architecture blueprint
  - Market handling: Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: How many words should a category page have?
Should filtered pages be indexed?
How does product schema affect SEO?
How can products appear in AI shopping results?
  - Market handling: Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request an ecommerce search architecture audit.
  - Market handling: Localize currency, shipping, returns, availability and spelling for each target market when separate storefronts truly exist.

## Source Keys For This Batch

- `GAI`: Google — AI features and your website - https://developers.google.com/search/docs/appearance/ai-features
  - Used for: Google AI features: eligibility, SEO foundations, internal links, text availability and measurement.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GECO`: Google — Ecommerce site structure - https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
  - Used for: Ecommerce navigation, page discovery and product/category architecture.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GEO25`: Chen et al. — Generative Engine Optimization: How to Dominate AI Search - https://arxiv.org/abs/2509.08919
  - Used for: Differences across engines, earned-media bias, phrasing and language variation.
  - Editorial instruction: Explain methodology and limitations; do not generalize beyond the study.
- `GHELP`: Google — Creating helpful, reliable, people-first content - https://developers.google.com/search/docs/fundamentals/creating-helpful-content
  - Used for: Originality, expertise, sourcing, authorship and people-first quality.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GHREF`: Google — Localized versions of pages - https://developers.google.com/search/docs/specialty/international/localized-versions
  - Used for: Hreflang and genuine language/region alternates.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GJS`: Google — JavaScript SEO basics - https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
  - Used for: Crawling, rendering, indexing, metadata, status codes and rendered HTML.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GLOCAL`: Google Business Profile — Improve local ranking - https://support.google.com/business/answer/7091
  - Used for: Relevance, distance, prominence, accurate information and reviews.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GSPAM`: Google — Spam policies for Web Search - https://developers.google.com/search/docs/essentials/spam-policies
  - Used for: Scaled content, doorway pages, link spam and abusive practices.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `HEALTHQ`: Schultheiß et al. — SEO and health web-page quality - https://arxiv.org/abs/2301.10105
  - Used for: Need to protect expertise and trust in health content.
  - Editorial instruction: Explain methodology and limitations; do not generalize beyond the study.
