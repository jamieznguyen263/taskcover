# Ready Claude Prompt - Measurement And Technical SEO

Copy this whole file into Claude as one request. Do not send more than one batch per request.

## Operator Instruction

You are Claude. Complete only the article IDs listed in this prompt. Return a complete `articlePackages` JSON payload that passes the Taskcover validation contract below. Do not add articles outside this batch.

Batch slug: `batch-04-measurement-technical-seo`
Required article IDs: `TC-014`, `TC-016`, `TC-017`, `TC-018`, `TC-031`, `TC-032`, `TC-033`, `TC-034`

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

# Core 56 Claude Batch Brief - Measurement And Technical SEO

Use this file together with `docs/core56-claude-master-prompt.vi.md`.
Write complete English article packages only for the article IDs in this batch.

## Batch Articles

| ID | Title | Primary keyword | Money page |
|---|---|---|---|
| TC-014 | SEO KPIs That Matter: Leads, Revenue, Visibility, Share of Search, and AI Mentions | SEO KPIs | /services/seo-agency |
| TC-016 | JavaScript SEO and Next.js SEO: Crawlability, Rendering, Metadata, and Indexation | Next.js SEO | /services/technical-seo |
| TC-017 | Core Web Vitals for SEO and Conversion: What to Fix First | Core Web Vitals SEO | /services/technical-seo |
| TC-018 | Website Migration SEO Checklist: Redesigns, Replatforming, and Domain Moves | website migration SEO checklist | /services/technical-seo |
| TC-031 | Crawlability and Indexation: A Complete Diagnostic Framework | crawlability and indexation | /services/technical-seo |
| TC-032 | Canonical Tags, Duplicate Content, Pagination, and URL Parameters: A Practical SEO Guide | canonical tags duplicate content | /services/technical-seo |
| TC-033 | SEO Log File Analysis: How to See What Search Bots Actually Crawl | SEO log file analysis | /services/technical-seo |
| TC-034 | How to Prioritize SEO Audit Findings by Revenue Risk, Impact, and Effort | prioritize SEO audit findings | /services/seo-audit |

## Article Briefs

### TC-014 - SEO KPIs That Matter: Leads, Revenue, Visibility, Share of Search, and AI Mentions

#### Master row

- **Priority:** 14
- **Cluster:** Measurement & Reporting
- **Role:** Linkable Asset
- **Wave:** Wave 2
- **Primary money page:** /services/seo-agency
- **Supporting pages:** /services/ai-search-optimization; /services/ppc-management
- **Format:** KPI framework + template
- **Unique angle / information gain:** Connect technical and visibility indicators to pipeline and revenue without pretending every touchpoint is directly attributable.
- **Original asset:** Unified SEO/GEO KPI tree + reporting template
- **Target words:** 3,000–3,800
- **Provisional outline score:** 99.1
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** Exact SERP intent and competitor-gap validation required
- **Update cycle:** Quarterly
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** SEO KPIs That Matter: Leads, Revenue, Visibility, Share of Search, and AI Mentions
- **Suggested URL slug:** seo-kpis-that-matter-leads-revenue-visibility-share-of-search-and-ai-mentio
- **Meta title:** SEO KPIs That Matter
- **Meta description:** Use the checklist, scorecard or template for SEO KPIs. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** SEO KPIs
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 3,000–3,800
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Connect technical and visibility indicators to pipeline and revenue without pretending every touchpoint is directly attributable. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • What are the most important SEO KPIs?
• How do you calculate SEO ROI?
• Should rankings be included in executive reports?
• How should AI mentions be reported?
- **Unique evidence / asset:** Unified SEO/GEO KPI tree + reporting template
Information-gain requirement: Connect technical and visibility indicators to pipeline and revenue without pretending every touchpoint is directly attributable.
- **Source keys:** GAI|GEO26U|GHELP
- **Author / reviewer requirement:** Named subject-matter author with relevant experience; editor and last-reviewed date.
- **Regional localization instructions:** Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.
- **Internal links:** Primary money page: /services/seo-agency
Supporting pages: /services/ai-search-optimization; /services/ppc-management
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 branded framework diagram; 1 downloadable Unified SEO/GEO KPI tree + reporting template; 2–4 original charts/tables; no stock-only hero.
- **Conversion CTA:** CTA: download the KPI template or request reporting design.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Quarterly
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer SEO KPIs directly in 80–120 words. Connect technical and visibility indicators to pipeline and revenue without pretending every touchpoint is directly attributable.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.
2. **H2 - Build a KPI hierarchy**
  - Coverage: Business outcomes, conversion, demand capture, visibility, content/authority and technical health.
  - Evidence/output: Use source keys GAI|GEO26U|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.
3. **H2 - Leading vs lagging indicators**
  - Coverage: Indexation and impressions before clicks; qualified actions before revenue; mentions before referral traffic.
  - Evidence/output: Use source keys GAI|GEO26U|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.
4. **H2 - SEO revenue and pipeline measurement**
  - Coverage: Landing-page conversion, assisted paths, lead quality, attribution limitations and incrementality.
  - Evidence/output: Use source keys GAI|GEO26U|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.
5. **H2 - AI-search measurement**
  - Coverage: Prompt share, mentions, citations, source footprint, accuracy and repeated sampling.
  - Evidence/output: Use source keys GAI|GEO26U|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.
6. **H2 - Create an executive reporting cadence**
  - Coverage: Targets, commentary, decisions, owners and exceptions—not metric dumps.
  - Evidence/output: Use source keys GAI|GEO26U|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Unified SEO/GEO KPI tree + reporting template
  - Market handling: Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: What are the most important SEO KPIs?
How do you calculate SEO ROI?
Should rankings be included in executive reports?
How should AI mentions be reported?
  - Market handling: Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: download the KPI template or request reporting design.
  - Market handling: Segment outcomes by USA, Canada and Australia where market investment and conversion economics differ.

### TC-016 - JavaScript SEO and Next.js SEO: Crawlability, Rendering, Metadata, and Indexation

#### Master row

- **Priority:** 16
- **Cluster:** Technical SEO & Audit
- **Role:** Pillar
- **Wave:** Wave 2
- **Primary money page:** /services/technical-seo
- **Supporting pages:** /services/seo-audit
- **Format:** Technical implementation guide
- **Unique angle / information gain:** Use current Google and framework concepts to show how rendered output, status codes, metadata and links actually behave.
- **Original asset:** Next.js SEO test matrix + code examples
- **Target words:** 4,000–5,200
- **Provisional outline score:** 99.1
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Biannual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** JavaScript SEO and Next.js SEO: Crawlability, Rendering, Metadata, and Indexation
- **Suggested URL slug:** javascript-seo-and-next-js-seo-crawlability-rendering-metadata-and-indexati
- **Meta title:** JavaScript SEO and Next.js SEO
- **Meta description:** Use the framework, examples and implementation plan for Next.js SEO. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** Next.js SEO
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 4,000–5,200
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Use current Google and framework concepts to show how rendered output, status codes, metadata and links actually behave. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Can Google index client-rendered React pages?
• Is Next.js automatically SEO-friendly?
• Should canonicals be generated with JavaScript?
• How do you test a Next.js site for SEO?
- **Unique evidence / asset:** Next.js SEO test matrix + code examples
Information-gain requirement: Use current Google and framework concepts to show how rendered output, status codes, metadata and links actually behave.
- **Source keys:** GJS|GLINK|GHELP
- **Author / reviewer requirement:** Named technical SEO author; implementation examples reviewed by a developer or technical lead.
- **Regional localization instructions:** Global technical guide. Include code that works independently of country targeting.
- **Internal links:** Primary money page: /services/technical-seo
Supporting pages: /services/seo-audit
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 flagship framework diagram; 1 decision tree; 2–3 implementation tables; optional expert video or annotated example.
- **Conversion CTA:** CTA: request a JavaScript/Next.js SEO review.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Biannual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer Next.js SEO directly in 80–120 words. Use current Google and framework concepts to show how rendered output, status codes, metadata and links actually behave.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Global technical guide. Include code that works independently of country targeting.
2. **H2 - How Google processes JavaScript**
  - Coverage: Crawling, rendering, indexing, queues and why initial and rendered HTML both matter.
  - Evidence/output: Use source keys GJS|GLINK|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Global technical guide. Include code that works independently of country targeting.
3. **H2 - Choose the rendering strategy by page type**
  - Coverage: Static generation, server rendering, incremental rendering and client components.
  - Evidence/output: Use source keys GJS|GLINK|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Global technical guide. Include code that works independently of country targeting.
4. **H2 - Metadata, canonicals and status codes**
  - Coverage: Unique metadata, redirects, 404/soft-404 handling, noindex and canonical consistency.
  - Evidence/output: Use source keys GJS|GLINK|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Global technical guide. Include code that works independently of country targeting.
5. **H2 - Internal links and discoverability**
  - Coverage: Real href links, navigation, pagination, route generation and orphan prevention.
  - Evidence/output: Use source keys GJS|GLINK|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Global technical guide. Include code that works independently of country targeting.
6. **H2 - A production QA workflow**
  - Coverage: Raw HTML, rendered HTML, URL Inspection, logs, test crawls and deployment regressions.
  - Evidence/output: Use source keys GJS|GLINK|GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Global technical guide. Include code that works independently of country targeting.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Next.js SEO test matrix + code examples
  - Market handling: Global technical guide. Include code that works independently of country targeting.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Global technical guide. Include code that works independently of country targeting.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Can Google index client-rendered React pages?
Is Next.js automatically SEO-friendly?
Should canonicals be generated with JavaScript?
How do you test a Next.js site for SEO?
  - Market handling: Global technical guide. Include code that works independently of country targeting.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a JavaScript/Next.js SEO review.
  - Market handling: Global technical guide. Include code that works independently of country targeting.

### TC-017 - Core Web Vitals for SEO and Conversion: What to Fix First

#### Master row

- **Priority:** 17
- **Cluster:** Technical SEO & Audit
- **Role:** Supporting Cluster
- **Wave:** Wave 2
- **Primary money page:** /services/technical-seo
- **Supporting pages:** /services/seo-audit
- **Format:** Prioritization guide
- **Unique angle / information gain:** Treat CWV as user-experience and conversion work with SEO relevance—not a standalone ranking shortcut.
- **Original asset:** CWV diagnosis decision tree
- **Target words:** 2,800–3,600
- **Provisional outline score:** 97.6
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** Exact SERP intent and competitor-gap validation required
- **Update cycle:** Biannual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Core Web Vitals for SEO and Conversion: What to Fix First
- **Suggested URL slug:** core-web-vitals-for-seo-and-conversion-what-to-fix-first
- **Meta title:** Core Web Vitals for SEO and Conversion: What to Fix First
- **Meta description:** Learn the practical steps, risks and decision rules for Core Web Vitals SEO. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** Core Web Vitals SEO
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 2,800–3,600
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Treat CWV as user-experience and conversion work with SEO relevance—not a standalone ranking shortcut. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Are Core Web Vitals a ranking factor?
• What is a good LCP, INP and CLS?
• Why do lab and field scores differ?
• Can a site rank with poor Core Web Vitals?
- **Unique evidence / asset:** CWV diagnosis decision tree
Information-gain requirement: Treat CWV as user-experience and conversion work with SEO relevance—not a standalone ranking shortcut.
- **Source keys:** GCWV|GAI
- **Author / reviewer requirement:** Named technical SEO author; implementation examples reviewed by a developer or technical lead.
- **Regional localization instructions:** Segment field data by market/device where traffic and network conditions differ; do not create country copies.
- **Internal links:** Primary money page: /services/technical-seo
Supporting pages: /services/seo-audit
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 process/decision visual; 1 practical table; current screenshots/examples only where permissioned.
- **Conversion CTA:** CTA: request a performance and SEO diagnostic.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Biannual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer Core Web Vitals SEO directly in 80–120 words. Treat CWV as user-experience and conversion work with SEO relevance—not a standalone ranking shortcut.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Segment field data by market/device where traffic and network conditions differ; do not create country copies.
2. **H2 - What Core Web Vitals measure**
  - Coverage: LCP, INP and CLS; field vs lab data; URL groups and device differences.
  - Evidence/output: Use source keys GCWV|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Segment field data by market/device where traffic and network conditions differ; do not create country copies.
3. **H2 - Diagnose before optimizing**
  - Coverage: CrUX/Search Console, PageSpeed, performance traces, templates and third-party scripts.
  - Evidence/output: Use source keys GCWV|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Segment field data by market/device where traffic and network conditions differ; do not create country copies.
4. **H2 - Fix LCP systematically**
  - Coverage: Server response, render-blocking assets, hero media, priority and caching.
  - Evidence/output: Use source keys GCWV|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Segment field data by market/device where traffic and network conditions differ; do not create country copies.
5. **H2 - Fix INP and CLS systematically**
  - Coverage: Main-thread work, hydration, event handlers, layout reservations, fonts and embeds.
  - Evidence/output: Use source keys GCWV|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Segment field data by market/device where traffic and network conditions differ; do not create country copies.
6. **H2 - Prioritize by affected revenue and templates**
  - Coverage: High-traffic templates, mobile experience, conversion pages and regression budgets.
  - Evidence/output: Use source keys GCWV|GAI and add the original examples/visuals specified in the brief.
  - Market handling: Segment field data by market/device where traffic and network conditions differ; do not create country copies.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: CWV diagnosis decision tree
  - Market handling: Segment field data by market/device where traffic and network conditions differ; do not create country copies.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Segment field data by market/device where traffic and network conditions differ; do not create country copies.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Are Core Web Vitals a ranking factor?
What is a good LCP, INP and CLS?
Why do lab and field scores differ?
Can a site rank with poor Core Web Vitals?
  - Market handling: Segment field data by market/device where traffic and network conditions differ; do not create country copies.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a performance and SEO diagnostic.
  - Market handling: Segment field data by market/device where traffic and network conditions differ; do not create country copies.

### TC-018 - Website Migration SEO Checklist: Redesigns, Replatforming, and Domain Moves

#### Master row

- **Priority:** 18
- **Cluster:** Technical SEO & Audit
- **Role:** Linkable Asset
- **Wave:** Wave 2
- **Primary money page:** /services/technical-seo
- **Supporting pages:** /services/seo-audit
- **Format:** Checklist + risk playbook
- **Unique angle / information gain:** Provide a release-ready control system with owners, validation and rollback rather than a generic redirect list.
- **Original asset:** Migration workbook: URL map, QA checklist and launch dashboard
- **Target words:** 3,800–4,800
- **Provisional outline score:** 99.1
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** Exact SERP intent and competitor-gap validation required
- **Update cycle:** Annual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Website Migration SEO Checklist: Redesigns, Replatforming, and Domain Moves
- **Suggested URL slug:** website-migration-seo-checklist-redesigns-replatforming-and-domain-moves
- **Meta title:** Website Migration SEO Checklist
- **Meta description:** Use the checklist, scorecard or template for website migration SEO checklist. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** website migration SEO checklist
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 3,800–4,800
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Provide a release-ready control system with owners, validation and rollback rather than a generic redirect list. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • How long do rankings fluctuate after a migration?
• Should every old URL be redirected?
• When should a migration be rolled back?
• Can redesign and domain migration happen together?
- **Unique evidence / asset:** Migration workbook: URL map, QA checklist and launch dashboard
Information-gain requirement: Provide a release-ready control system with owners, validation and rollback rather than a generic redirect list.
- **Source keys:** GMIG|GHREF|GLINK
- **Author / reviewer requirement:** Named technical SEO author; implementation examples reviewed by a developer or technical lead.
- **Regional localization instructions:** For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.
- **Internal links:** Primary money page: /services/technical-seo
Supporting pages: /services/seo-audit
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; HowTo only when every visible step is represented; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 branded framework diagram; 1 downloadable Migration workbook: URL map, QA checklist and launch dashboard; 2–4 original charts/tables; no stock-only hero.
- **Conversion CTA:** CTA: request migration planning or pre-launch QA.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Annual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer website migration SEO checklist directly in 80–120 words. Provide a release-ready control system with owners, validation and rollback rather than a generic redirect list.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.
2. **H2 - Classify the migration and set guardrails**
  - Coverage: Domain, protocol, CMS, redesign, URL, international and combined migrations.
  - Evidence/output: Use source keys GMIG|GHREF|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.
3. **H2 - Pre-migration inventory and baseline**
  - Coverage: URLs, traffic, rankings, links, canonicals, templates, analytics and server behavior.
  - Evidence/output: Use source keys GMIG|GHREF|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.
4. **H2 - Build and validate the redirect and content map**
  - Coverage: One-to-one mappings, consolidation decisions, removed content and internal-link updates.
  - Evidence/output: Use source keys GMIG|GHREF|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.
5. **H2 - Launch-day controls**
  - Coverage: DNS, robots, status codes, canonicals, hreflang, sitemaps, tracking and crawl tests.
  - Evidence/output: Use source keys GMIG|GHREF|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.
6. **H2 - Post-launch monitoring and rollback**
  - Coverage: Logs, indexation, coverage, revenue pages, backlink updates, anomaly thresholds and ownership.
  - Evidence/output: Use source keys GMIG|GHREF|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Migration workbook: URL map, QA checklist and launch dashboard
  - Market handling: For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: How long do rankings fluctuate after a migration?
Should every old URL be redirected?
When should a migration be rolled back?
Can redesign and domain migration happen together?
  - Market handling: For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request migration planning or pre-launch QA.
  - Market handling: For multi-market migrations, include hreflang and regional redirect validation as a separate launch gate.

### TC-031 - Crawlability and Indexation: A Complete Diagnostic Framework

#### Master row

- **Priority:** 31
- **Cluster:** Technical SEO & Audit
- **Role:** Pillar
- **Wave:** Wave 2
- **Primary money page:** /services/technical-seo
- **Supporting pages:** /services/seo-audit
- **Format:** Diagnostic pillar
- **Unique angle / information gain:** Teach a symptom-to-evidence workflow that separates discovery, crawling, rendering, canonical selection and serving.
- **Original asset:** Indexation diagnosis flowchart
- **Target words:** 3,600–4,600
- **Provisional outline score:** 99.1
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** High authority/proof requirement
- **Update cycle:** Biannual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Crawlability and Indexation: A Complete Diagnostic Framework
- **Suggested URL slug:** crawlability-and-indexation-a-complete-diagnostic-framework
- **Meta title:** Crawlability and Indexation: A Complete Diagnostic Framework
- **Meta description:** Use the framework, examples and implementation plan for crawlability and indexation. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** crawlability and indexation
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 3,600–4,600
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Teach a symptom-to-evidence workflow that separates discovery, crawling, rendering, canonical selection and serving. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Why is Google not indexing a page?
• Does submitting a sitemap guarantee indexing?
• How long does indexing take?
• Can a page be indexed but not rank?
- **Unique evidence / asset:** Indexation diagnosis flowchart
Information-gain requirement: Teach a symptom-to-evidence workflow that separates discovery, crawling, rendering, canonical selection and serving.
- **Source keys:** GJS|GHELP|GLINK
- **Author / reviewer requirement:** Named technical SEO author; implementation examples reviewed by a developer or technical lead.
- **Regional localization instructions:** Global framework; market segmentation matters only when regional URLs or hreflang are involved.
- **Internal links:** Primary money page: /services/technical-seo
Supporting pages: /services/seo-audit
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 flagship framework diagram; 1 decision tree; 2–3 implementation tables; optional expert video or annotated example.
- **Conversion CTA:** CTA: request an indexation diagnosis.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Biannual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer crawlability and indexation directly in 80–120 words. Teach a symptom-to-evidence workflow that separates discovery, crawling, rendering, canonical selection and serving.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Global framework; market segmentation matters only when regional URLs or hreflang are involved.
2. **H2 - Separate discovery, crawling, rendering, indexing and ranking**
  - Coverage: Define each state and the evidence available for it.
  - Evidence/output: Use source keys GJS|GHELP|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Global framework; market segmentation matters only when regional URLs or hreflang are involved.
3. **H2 - Diagnose discovery failures**
  - Coverage: Internal links, sitemaps, orphan pages, URL generation and crawl traps.
  - Evidence/output: Use source keys GJS|GHELP|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Global framework; market segmentation matters only when regional URLs or hreflang are involved.
4. **H2 - Diagnose crawl and render failures**
  - Coverage: Robots, status codes, server errors, JavaScript, blocked resources and capacity.
  - Evidence/output: Use source keys GJS|GHELP|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Global framework; market segmentation matters only when regional URLs or hreflang are involved.
5. **H2 - Diagnose canonical and quality exclusions**
  - Coverage: Duplicates, soft 404s, thin/templated pages, alternate canonicals and noindex.
  - Evidence/output: Use source keys GJS|GHELP|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Global framework; market segmentation matters only when regional URLs or hreflang are involved.
6. **H2 - Build an indexation monitoring system**
  - Coverage: Template coverage, logs, Search Console samples, alerts and release QA.
  - Evidence/output: Use source keys GJS|GHELP|GLINK and add the original examples/visuals specified in the brief.
  - Market handling: Global framework; market segmentation matters only when regional URLs or hreflang are involved.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Indexation diagnosis flowchart
  - Market handling: Global framework; market segmentation matters only when regional URLs or hreflang are involved.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Global framework; market segmentation matters only when regional URLs or hreflang are involved.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Why is Google not indexing a page?
Does submitting a sitemap guarantee indexing?
How long does indexing take?
Can a page be indexed but not rank?
  - Market handling: Global framework; market segmentation matters only when regional URLs or hreflang are involved.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request an indexation diagnosis.
  - Market handling: Global framework; market segmentation matters only when regional URLs or hreflang are involved.

### TC-032 - Canonical Tags, Duplicate Content, Pagination, and URL Parameters: A Practical SEO Guide

#### Master row

- **Priority:** 32
- **Cluster:** Technical SEO & Audit
- **Role:** Supporting Cluster
- **Wave:** Wave 2
- **Primary money page:** /services/technical-seo
- **Supporting pages:** /services/seo-audit; /services/ecommerce-seo
- **Format:** Technical decision guide
- **Unique angle / information gain:** Explain when canonicals consolidate signals, when they are only hints, and when architecture must change.
- **Original asset:** Canonical and URL-control decision table
- **Target words:** 3,000–3,900
- **Provisional outline score:** 97.6
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** Exact SERP intent and competitor-gap validation required
- **Update cycle:** Biannual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** Canonical Tags, Duplicate Content, Pagination, and URL Parameters: A Practical SEO Guide
- **Suggested URL slug:** canonical-tags-duplicate-content-pagination-and-url-parameters-a-practical
- **Meta title:** Canonical Tags, Duplicate Content, Pagination, and URL Para…
- **Meta description:** Learn the practical steps, risks and decision rules for canonical tags duplicate content. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** canonical tags duplicate content
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 3,000–3,900
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Explain when canonicals consolidate signals, when they are only hints, and when architecture must change. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Are canonical tags directives or hints?
• Should paginated pages canonicalize to page one?
• Can robots.txt fix duplicate content?
• Should URL parameters be indexed?
- **Unique evidence / asset:** Canonical and URL-control decision table
Information-gain requirement: Explain when canonicals consolidate signals, when they are only hints, and when architecture must change.
- **Source keys:** GHELP|GECO|GJS
- **Author / reviewer requirement:** Named technical SEO author; implementation examples reviewed by a developer or technical lead.
- **Regional localization instructions:** Include international duplicate scenarios only where true localized alternates exist.
- **Internal links:** Primary money page: /services/technical-seo
Supporting pages: /services/seo-audit; /services/ecommerce-seo
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 process/decision visual; 1 practical table; current screenshots/examples only where permissioned.
- **Conversion CTA:** CTA: request a duplicate-content and indexation review.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Biannual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer canonical tags duplicate content directly in 80–120 words. Explain when canonicals consolidate signals, when they are only hints, and when architecture must change.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Include international duplicate scenarios only where true localized alternates exist.
2. **H2 - Identify duplicate and near-duplicate URL families**
  - Coverage: Parameters, filters, sort orders, print views, variants, tracking and pagination.
  - Evidence/output: Use source keys GHELP|GECO|GJS and add the original examples/visuals specified in the brief.
  - Market handling: Include international duplicate scenarios only where true localized alternates exist.
3. **H2 - Choose the correct control**
  - Coverage: Canonical, redirect, noindex, crawl restriction, link cleanup or unique page.
  - Evidence/output: Use source keys GHELP|GECO|GJS and add the original examples/visuals specified in the brief.
  - Market handling: Include international duplicate scenarios only where true localized alternates exist.
4. **H2 - Handle pagination and infinite loading**
  - Coverage: Crawlable component URLs, links, canonicals and content availability.
  - Evidence/output: Use source keys GHELP|GECO|GJS and add the original examples/visuals specified in the brief.
  - Market handling: Include international duplicate scenarios only where true localized alternates exist.
5. **H2 - Validate canonical consistency**
  - Coverage: HTML, sitemap, internal links, redirects, hreflang and rendered output.
  - Evidence/output: Use source keys GHELP|GECO|GJS and add the original examples/visuals specified in the brief.
  - Market handling: Include international duplicate scenarios only where true localized alternates exist.
6. **H2 - Monitor unintended indexation**
  - Coverage: Search Console patterns, site crawls, logs and release regression tests.
  - Evidence/output: Use source keys GHELP|GECO|GJS and add the original examples/visuals specified in the brief.
  - Market handling: Include international duplicate scenarios only where true localized alternates exist.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Canonical and URL-control decision table
  - Market handling: Include international duplicate scenarios only where true localized alternates exist.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Include international duplicate scenarios only where true localized alternates exist.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Are canonical tags directives or hints?
Should paginated pages canonicalize to page one?
Can robots.txt fix duplicate content?
Should URL parameters be indexed?
  - Market handling: Include international duplicate scenarios only where true localized alternates exist.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a duplicate-content and indexation review.
  - Market handling: Include international duplicate scenarios only where true localized alternates exist.

### TC-033 - SEO Log File Analysis: How to See What Search Bots Actually Crawl

#### Master row

- **Priority:** 33
- **Cluster:** Technical SEO & Audit
- **Role:** Supporting Cluster
- **Wave:** Wave 2
- **Primary money page:** /services/technical-seo
- **Supporting pages:** /services/seo-audit
- **Format:** Technical analysis guide
- **Unique angle / information gain:** Use logs to verify bot behavior and implementation impact, not to manufacture a universal crawl-budget problem.
- **Original asset:** Log-analysis query library + dashboard specification
- **Target words:** 3,000–3,900
- **Provisional outline score:** 97.6
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** Exact SERP intent and competitor-gap validation required
- **Update cycle:** Quarterly
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** SEO Log File Analysis: How to See What Search Bots Actually Crawl
- **Suggested URL slug:** seo-log-file-analysis-how-to-see-what-search-bots-actually-crawl
- **Meta title:** SEO Log File Analysis
- **Meta description:** Learn the practical steps, risks and decision rules for SEO log file analysis. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** SEO log file analysis
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 3,000–3,900
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Use logs to verify bot behavior and implementation impact, not to manufacture a universal crawl-budget problem. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Does every website need log file analysis?
• How do you verify Googlebot?
• What is crawl budget?
• How long should SEO logs be retained?
- **Unique evidence / asset:** Log-analysis query library + dashboard specification
Information-gain requirement: Use logs to verify bot behavior and implementation impact, not to manufacture a universal crawl-budget problem.
- **Source keys:** GHELP|GJS
- **Author / reviewer requirement:** Named technical SEO author; implementation examples reviewed by a developer or technical lead.
- **Regional localization instructions:** For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.
- **Internal links:** Primary money page: /services/technical-seo
Supporting pages: /services/seo-audit
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 process/decision visual; 1 practical table; current screenshots/examples only where permissioned.
- **Conversion CTA:** CTA: request a crawl and log analysis.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Quarterly
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer SEO log file analysis directly in 80–120 words. Use logs to verify bot behavior and implementation impact, not to manufacture a universal crawl-budget problem.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.
2. **H2 - What server logs can and cannot prove**
  - Coverage: Requests, status, user agent, timing and limits compared with Search Console/crawlers.
  - Evidence/output: Use source keys GHELP|GJS and add the original examples/visuals specified in the brief.
  - Market handling: For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.
3. **H2 - Collect and clean bot data safely**
  - Coverage: Retention, privacy, verified bots, fields, sampling and timezone.
  - Evidence/output: Use source keys GHELP|GJS and add the original examples/visuals specified in the brief.
  - Market handling: For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.
4. **H2 - Answer high-value crawl questions**
  - Coverage: Important URLs crawled, waste, errors, stale sections, mobile bot and recrawl after releases.
  - Evidence/output: Use source keys GHELP|GJS and add the original examples/visuals specified in the brief.
  - Market handling: For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.
5. **H2 - Segment by template and change**
  - Coverage: Directories, page types, markets, status codes and pre/post implementation.
  - Evidence/output: Use source keys GHELP|GJS and add the original examples/visuals specified in the brief.
  - Market handling: For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.
6. **H2 - Turn log findings into action**
  - Coverage: Internal links, sitemaps, errors, parameters, performance and monitoring alerts.
  - Evidence/output: Use source keys GHELP|GJS and add the original examples/visuals specified in the brief.
  - Market handling: For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: Log-analysis query library + dashboard specification
  - Market handling: For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Does every website need log file analysis?
How do you verify Googlebot?
What is crawl budget?
How long should SEO logs be retained?
  - Market handling: For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a crawl and log analysis.
  - Market handling: For international sites, segment logs by regional directory and Googlebot behavior; respect data/privacy policies.

### TC-034 - How to Prioritize SEO Audit Findings by Revenue Risk, Impact, and Effort

#### Master row

- **Priority:** 34
- **Cluster:** Technical SEO & Audit
- **Role:** Supporting Cluster
- **Wave:** Wave 2
- **Primary money page:** /services/seo-audit
- **Supporting pages:** /services/technical-seo; /services/seo-agency
- **Format:** Prioritization framework
- **Unique angle / information gain:** Turn audit outputs into an accountable delivery roadmap with confidence and validation criteria.
- **Original asset:** SEO impact–confidence–effort scoring model
- **Target words:** 2,500–3,200
- **Provisional outline score:** 97.6
- **Readiness:** PASS — outline ≥95; validate live SERP before writing
- **Primary ranking risk:** Exact SERP intent and competitor-gap validation required
- **Update cycle:** Annual
- **Status:** Outline approved

#### Writer brief

- **H1 / Final title:** How to Prioritize SEO Audit Findings by Revenue Risk, Impact, and Effort
- **Suggested URL slug:** how-to-prioritize-seo-audit-findings-by-revenue-risk-impact-and-effort
- **Meta title:** How to Prioritize SEO Audit Findings by Revenue Risk, Impac…
- **Meta description:** Learn the practical steps, risks and decision rules for prioritize SEO audit findings. Built for Google, AI Search and measurable business outcomes.
- **Primary keyword:** prioritize SEO audit findings
- **Search intent:** Informational / commercial investigation
- **Target market:** Global English
- **Target words:** 2,500–3,200
- **Opening answer requirement:** Answer the central intent in 80–120 words before background: Turn audit outputs into an accountable delivery roadmap with confidence and validation criteria. State material limitations and do not promise rankings or AI mentions.
- **Mandatory FAQs:** • Should all critical SEO errors be fixed first?
• How do you estimate SEO impact?
• Who should own technical SEO fixes?
• How do you prove an SEO fix worked?
- **Unique evidence / asset:** SEO impact–confidence–effort scoring model
Information-gain requirement: Turn audit outputs into an accountable delivery roadmap with confidence and validation criteria.
- **Source keys:** GHELP
- **Author / reviewer requirement:** Named technical SEO author; implementation examples reviewed by a developer or technical lead.
- **Regional localization instructions:** Include market-weighting when an issue affects only one regional directory or revenue market.
- **Internal links:** Primary money page: /services/seo-audit
Supporting pages: /services/technical-seo; /services/seo-agency
Also link to the most relevant pillar and two sibling articles after all URLs are live.
- **Recommended schema:** Article; BreadcrumbList; FAQPage only when FAQs are visible; rich-result display is not promised
- **Visual / data plan:** 1 process/decision visual; 1 practical table; current screenshots/examples only where permissioned.
- **Conversion CTA:** CTA: request a prioritized SEO audit.
- **Forbidden claims:** No ranking guarantee; No fabricated statistics; No unsupported causal claim; No fake client result
- **Update cycle:** Annual
- **Brief status:** FINAL — ready for live SERP validation

#### Required outline sections

1. **Opening - Executive answer**
  - Coverage: Answer prioritize SEO audit findings directly in 80–120 words. Turn audit outputs into an accountable delivery roadmap with confidence and validation criteria.
  - Evidence/output: One clear definition or decision; no throat-clearing or unsupported statistic.
  - Market handling: Include market-weighting when an issue affects only one regional directory or revenue market.
2. **H2 - Why severity labels are insufficient**
  - Coverage: Tool severity does not equal affected demand, revenue or feasibility.
  - Evidence/output: Use source keys GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Include market-weighting when an issue affects only one regional directory or revenue market.
3. **H2 - Score affected scope and business risk**
  - Coverage: Templates, traffic, conversion, market, seasonality and dependency.
  - Evidence/output: Use source keys GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Include market-weighting when an issue affects only one regional directory or revenue market.
4. **H2 - Estimate impact and confidence**
  - Coverage: Mechanism, evidence, comparable tests, uncertainty and downside.
  - Evidence/output: Use source keys GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Include market-weighting when an issue affects only one regional directory or revenue market.
5. **H2 - Estimate effort and implementation risk**
  - Coverage: Engineering, content, QA, dependencies, rollout and rollback.
  - Evidence/output: Use source keys GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Include market-weighting when an issue affects only one regional directory or revenue market.
6. **H2 - Build the roadmap and validation plan**
  - Coverage: Now/next/later, owners, acceptance criteria, monitoring and decision log.
  - Evidence/output: Use source keys GHELP and add the original examples/visuals specified in the brief.
  - Market handling: Include market-weighting when an issue affects only one regional directory or revenue market.
7. **H2 - Implementation checklist and 30/60/90-day action plan**
  - Coverage: Translate the article into sequenced actions with owners, dependencies, acceptance criteria and validation.
  - Evidence/output: SEO impact–confidence–effort scoring model
  - Market handling: Include market-weighting when an issue affects only one regional directory or revenue market.
8. **H2 - Measurement, limitations and common failure modes**
  - Coverage: Define leading and lagging metrics, uncertainty, what the method cannot prove and refresh triggers.
  - Evidence/output: At least one measurement table and one limitations box.
  - Market handling: Include market-weighting when an issue affects only one regional directory or revenue market.
9. **H2 - Frequently asked questions**
  - Coverage: Answer every mandatory FAQ in 45–90 words; add questions only when verified by SERP, PAA or sales data.
  - Evidence/output: Should all critical SEO errors be fixed first?
How do you estimate SEO impact?
Who should own technical SEO fixes?
How do you prove an SEO fix worked?
  - Market handling: Include market-weighting when an issue affects only one regional directory or revenue market.
10. **Closing - Final recommendation and CTA**
  - Coverage: Summarize the decision and route the reader to the owning money page without repeating the article.
  - Evidence/output: CTA: request a prioritized SEO audit.
  - Market handling: Include market-weighting when an issue affects only one regional directory or revenue market.

## Source Keys For This Batch

- `GAI`: Google — AI features and your website - https://developers.google.com/search/docs/appearance/ai-features
  - Used for: Google AI features: eligibility, SEO foundations, internal links, text availability and measurement.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GCWV`: Google — Core Web Vitals and Search - https://developers.google.com/search/docs/appearance/core-web-vitals
  - Used for: Core Web Vitals, user experience and search context.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GECO`: Google — Ecommerce site structure - https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure
  - Used for: Ecommerce navigation, page discovery and product/category architecture.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GEO26U`: Sielinski — Quantifying Uncertainty in AI Visibility - https://arxiv.org/abs/2603.08924
  - Used for: Repeated sampling and uncertainty in generative-search measurement.
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
- `GLINK`: Google — SEO link best practices - https://developers.google.com/search/docs/crawling-indexing/links-crawlable
  - Used for: Crawlable links, descriptive anchors and internal discovery.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
- `GMIG`: Google — Site moves and migrations - https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
  - Used for: URL mapping, redirects, launch monitoring and migration controls.
  - Editorial instruction: Use as a primary supporting source; verify the current page and update date while writing.
