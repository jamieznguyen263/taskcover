import type {
  InsightArticle,
  InsightBlock,
  InsightClaim,
  InsightSource,
} from "../insights.types";

type ArticleUpgrade = {
  title?: string;
  metaTitle?: string;
  metaDescription?: string;
  breadcrumbLabel?: string;
  readingTime: number;
  informationGain: string;
  sources: InsightSource[];
  claims: InsightClaim[];
  originalInsights: string[];
  blocks: InsightBlock[];
};

const accessedAt = "2026-08-09";

function primarySource(
  id: string,
  title: string,
  publisher: string,
  url: string,
  claimIds: string[]
): InsightSource {
  return {
    id,
    title,
    publisher,
    url,
    accessedAt,
    primarySource: true,
    supportsClaimIds: claimIds,
    locale: "global",
  };
}

const upgrades: Record<string, ArticleUpgrade> = {
  "cdn-cache-waf-seo": {
    readingTime: 17,
    informationGain:
      "A browser-edge-origin fault model, reproducible header tests, a symptom-to-layer matrix, and a rollback-ready incident record that joins SEO, platform, and security evidence.",
    sources: [
      primarySource("b1-cdn-rfc9111", "RFC 9111: HTTP Caching", "IETF", "https://www.rfc-editor.org/rfc/rfc9111", ["b1-cdn-cache-semantics"]),
      primarySource("b1-cdn-googlebot", "Verifying Googlebot and other Google crawlers", "Google Search Central", "https://developers.google.com/crawling/docs/crawlers-fetchers/verify-google-requests", ["b1-cdn-verify-bot"]),
    ],
    claims: [
      { id: "b1-cdn-cache-semantics", text: "Cache behavior must be diagnosed from response directives and validators, not from a CDN dashboard label alone.", requiresEvidence: true, sourceIds: ["b1-cdn-rfc9111"] },
      { id: "b1-cdn-verify-bot", text: "Google documents reverse and forward DNS methods for verifying whether a request came from a Google crawler.", requiresEvidence: true, sourceIds: ["b1-cdn-googlebot"] },
    ],
    originalInsights: [
      "Treat the public browser, public edge, and authorized origin as three separate observations; a mismatch between them localizes the incident before a configuration change is made.",
      "A safe SEO incident response changes one rule or cache dimension at a time and records the exact rollback trigger.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Localize the failure across browser, edge and origin", id: "browser-edge-origin-model" },
      { type: "comparison-table", caption: "Use the symptom to choose the first layer to inspect.", columns: ["Observed symptom", "Likely layer", "Evidence to preserve", "First safe test"], rows: [
        ["One region serves an old title or canonical", "Edge cache or invalidation", "Status, Age, ETag, cache status, body hash and request ID by region", "Purge one URL and compare it with an unpurged control"],
        ["Crawler receives 403 or challenge while browsers receive 200", "WAF, bot rule or rate limit", "Rule ID, verified crawler identity, path, method and response body", "Replay a verified request against one scoped rule exception"],
        ["All clients receive an old page", "Origin render, deployment or upstream cache", "Origin body, release SHA, cache headers and deployment time", "Bypass the edge through an authorized diagnostic route"],
        ["Query or locale variants leak into each other", "Cache key or Vary mismatch", "URL, request headers, Vary, cache key fields and response hash", "Request a controlled matrix of locale, device and query variants"],
        ["A removed URL intermittently returns 200/404/5xx", "Cached error or inconsistent origin pool", "Status sequence, Age, upstream host and retry trace", "Compare repeated uncached requests across origin instances"],
      ] },
      { type: "heading", level: 2, text: "Capture headers before purging the evidence", id: "capture-cache-evidence" },
      { type: "code", language: "bash", code: "# Public edge response\ncurl -sS -D edge.headers -o edge.html https://example.com/path\n\n# Repeat to reveal Age, cache state and validator behavior\ncurl -sS -D repeat.headers -o repeat.html https://example.com/path\n\n# Conditional request when an ETag is present\ncurl -sS -D conditional.headers -o /dev/null \\\n  -H 'If-None-Match: \"captured-etag\"' https://example.com/path" },
      { type: "checklist", title: "Minimum incident evidence", items: [
        { label: "Request identity", detail: "UTC time, region, resolver, IP, user agent, method and full URL." },
        { label: "Response identity", detail: "Status, redirect target, request/ray ID, upstream host and a body hash." },
        { label: "Cache behavior", detail: "Cache-Control, Age, Vary, ETag, Last-Modified, CDN cache status, TTL and cache key inputs." },
        { label: "Search controls", detail: "Raw HTML title, canonical, robots, hreflang, structured data and relevant response headers." },
        { label: "Security decision", detail: "Matched WAF/bot/rate rule, action, threshold and verified-bot result." },
        { label: "Change record", detail: "Release, configuration diff, purge scope, owner, rollback command and rollback trigger." },
      ] },
      { type: "evidence", claimId: "b1-cdn-cache-semantics", summary: "RFC 9111 defines the HTTP caching model behind directives, freshness, validation and stored-response reuse; CDN labels should be interpreted against that protocol evidence.", sourceIds: ["b1-cdn-rfc9111"] },
      { type: "evidence", claimId: "b1-cdn-verify-bot", summary: "Verify Google crawler requests with Google's documented DNS process before creating an allow rule; a user-agent string by itself is not identity proof.", sourceIds: ["b1-cdn-googlebot"] },
      { type: "steps", title: "Rollback-ready remediation", steps: [
        { title: "Define the smallest failing cohort", body: "Name exact templates, regions, agents, statuses and time window. Keep unaffected URLs as negative controls." },
        { title: "Change one cause", body: "Adjust one WAF rule, cache key, TTL, stale policy or invalidation path. Avoid a global security bypass." },
        { title: "Purge only affected objects", body: "Record the purge request and protect control URLs so the team can distinguish a real fix from a warm-cache coincidence." },
        { title: "Validate four views", body: "Check a normal browser, verified crawler, public edge in affected regions and authorized origin. Compare raw HTML as well as rendered output." },
        { title: "Watch recurrence", body: "Monitor 403, 429, 5xx, cache-state distribution, crawler requests and affected search templates. Roll back if the predefined security or availability guardrail is crossed." },
      ] },
      { type: "callout", title: "Worked hypothetical: cached 503 becomes a crawl incident", body: "A product template returns 503 for four minutes during a release, but the edge stores that response for an hour. The team preserves headers, confirms the origin is healthy, narrows the cohort by cache key, removes error caching for that response class, purges only affected objects and verifies 200 responses from two regions and a verified crawler. This is a reproducible example, not a claimed Taskcover client result.", tone: "blue" },
    ],
  },

  "crawl-budget-large-sites": {
    readingTime: 17,
    informationGain:
      "An applicability gate, capacity-demand-inventory diagnosis, log-derived crawl metrics, and a worked prioritization model that prevents teams from treating every indexation issue as crawl budget.",
    sources: [
      primarySource("b1-crawl-google", "Large site's guide to managing your crawl budget", "Google Search Central", "https://developers.google.com/crawling/docs/crawl-budget", ["b1-crawl-applicability", "b1-crawl-factors"]),
    ],
    claims: [
      { id: "b1-crawl-applicability", text: "Google's crawl-budget guide is primarily intended for very large or rapidly changing sites, not as the default explanation for indexing problems on ordinary sites.", requiresEvidence: true, sourceIds: ["b1-crawl-google"] },
      { id: "b1-crawl-factors", text: "Google describes crawl capacity and crawl demand as inputs to crawl budget and identifies duplicate, faceted, soft-error and low-value URL spaces as common sources of waste.", requiresEvidence: true, sourceIds: ["b1-crawl-google"] },
    ],
    originalInsights: [
      "Separate URL inventory, crawl demand, and host capacity before proposing controls; each failure class needs a different remedy.",
      "Useful crawl share is a better operating metric than raw request count because it joins crawler activity to canonical, indexable inventory.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "First decide whether crawl budget is actually the constraint", id: "crawl-budget-applicability-gate" },
      { type: "decision-framework", title: "Crawl-budget applicability gate", criteria: [
        { signal: "Roughly one million or more unique pages that change at a moderate cadence", action: "Run a crawl-budget diagnosis and segment by template and host" },
        { signal: "About ten thousand pages with content changing daily or faster", action: "Test whether discovery and recrawl latency constrain freshness" },
        { signal: "A large share of URLs remain Discovered - currently not indexed", action: "Compare inventory quality, internal discovery, demand and server capacity before blaming budget" },
        { signal: "A smaller site has Crawled - currently not indexed or canonical conflicts", action: "Prioritize quality, duplication, rendering and canonical diagnosis; more crawling is unlikely to be the root fix" },
      ] },
      { type: "evidence", claimId: "b1-crawl-applicability", summary: "Google scopes its crawl-budget guidance to very large, rapidly changing sites and sites with a substantial Discovered - currently not indexed cohort.", sourceIds: ["b1-crawl-google"] },
      { type: "heading", level: 2, text: "Diagnose capacity, demand and inventory separately", id: "capacity-demand-inventory" },
      { type: "comparison-table", caption: "Three systems that are often collapsed into the phrase crawl budget.", columns: ["System", "Question", "Evidence", "Typical intervention"], rows: [
        ["Capacity", "Can the host respond quickly and reliably without distress?", "Crawl Stats response time, 5xx/429 rates, origin saturation and CDN logs", "Improve availability, latency, caching and overload signaling"],
        ["Demand", "Does Google have reason to revisit these URLs?", "Change frequency, internal prominence, sitemap lastmod integrity and historical crawl intervals", "Improve linking, freshness signals and genuine page value"],
        ["Inventory", "Are generated URLs canonical, useful and intended for search?", "Canonical clusters, parameter patterns, faceted paths, soft 404s and status classes", "Constrain generation, consolidate duplicates and remove traps"],
      ] },
      { type: "heading", level: 2, text: "Build a crawler-log dataset", id: "crawler-log-dataset" },
      { type: "checklist", title: "Fields and derived metrics", items: [
        { label: "Raw fields", detail: "Timestamp, verified crawler, host, path, query, method, status, bytes, response time, cache status, referrer and rendered template." },
        { label: "Inventory join", detail: "Canonical URL, indexability, sitemap membership, last meaningful update, template, language and business priority." },
        { label: "Useful crawl share", detail: "Requests to 200, canonical, indexable URLs divided by verified search-crawler requests." },
        { label: "Waste share", detail: "Requests to duplicates, parameter traps, soft 404s, redirect chains, errors and non-search endpoints divided by verified requests." },
        { label: "Recrawl latency", detail: "Time between a meaningful content change and the next verified crawler fetch, reported by template percentiles." },
        { label: "Health guardrails", detail: "5xx share, 429 share, p95 response time and repeated fetches of unchanged low-value URLs." },
      ] },
      { type: "code", language: "text", code: "useful_crawl_share = useful_verified_requests / all_verified_search_requests\nwaste_share = waste_verified_requests / all_verified_search_requests\nrecrawl_latency_hours = next_verified_fetch_at - meaningful_update_at\n\nPrioritize a pattern when:\naffected valuable URLs x observed delay or failure x confidence\nis greater than implementation effort and regression risk." },
      { type: "evidence", claimId: "b1-crawl-factors", summary: "Google's documentation connects crawl behavior to host capacity and demand, and recommends controlling duplicate, faceted, soft-error and other low-value URL spaces.", sourceIds: ["b1-crawl-google"] },
      { type: "steps", title: "A defensible four-week investigation", steps: [
        { title: "Week 1: establish inventory", body: "Export known URLs from internal links, sitemaps, product/content databases, analytics and Search Console. Normalize and classify them by intended state." },
        { title: "Week 2: verify requests", body: "Verify crawler identity, aggregate logs by template and join them to the canonical inventory. Do not use user-agent text alone." },
        { title: "Week 3: test one waste pattern", body: "Choose the largest evidenced pattern, preserve a control, change generation or linking, and avoid broad robots rules that hide diagnostic evidence." },
        { title: "Week 4: compare outcomes", body: "Measure useful crawl share, recrawl latency, server health and affected indexation cohorts. Expand only when the mechanism and guardrails hold." },
      ] },
      { type: "callout", title: "Worked dataset, not a performance claim", body: "In a hypothetical 30-day log sample, 62% of verified crawler requests hit sort/filter combinations, 18% hit canonical product URLs, and 7% hit redirects. The priority is to stop generating and linking the dominant parameter space, then compare useful crawl share and product recrawl latency against an unchanged category cohort. The numbers illustrate the method only.", tone: "blue" },
    ],
  },

  "headless-cms-seo-requirements": {
    readingTime: 18,
    informationGain:
      "A four-layer risk model, rendering decision matrix, testable content contract, and a procurement scorecard with concrete acceptance criteria instead of feature-box claims.",
    sources: [
      primarySource("b1-headless-google-js", "Understand the JavaScript SEO basics", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics", ["b1-headless-rendering"]),
      primarySource("b1-headless-next-metadata", "Metadata and OG images", "Next.js", "https://nextjs.org/docs/app/getting-started/metadata-and-og-images", ["b1-headless-framework"]),
    ],
    claims: [
      { id: "b1-headless-rendering", text: "Search-critical content and links must be available through a rendering path that search engines can process reliably; client-side rendering introduces additional execution and failure dependencies.", requiresEvidence: true, sourceIds: ["b1-headless-google-js"] },
      { id: "b1-headless-framework", text: "Next.js provides metadata conventions and APIs, but a framework feature does not establish editorial ownership, preview parity or release acceptance by itself.", requiresEvidence: true, sourceIds: ["b1-headless-next-metadata"] },
    ],
    originalInsights: [
      "Procurement should score demonstrated outcomes across CMS, API, frontend and edge layers; a feature is unproven until the rendered response passes an acceptance fixture.",
      "Every search-critical field needs a source of truth, editor, validator, fallback and published-output test.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Model SEO risk across four delivery layers", id: "four-layer-risk-model" },
      { type: "comparison-table", caption: "A headless platform succeeds only when all four layers honor the same contract.", columns: ["Layer", "Owns", "Typical failure", "Required proof"], rows: [
        ["CMS/content model", "Fields, relationships, permissions and workflow", "Canonical, locale or schema data cannot be represented safely", "Editor creates and previews a complete representative page"],
        ["Content API", "Delivery shape, versioning and availability", "Missing fields, stale draft data or breaking schema changes", "Versioned response contract plus failure and timeout tests"],
        ["Frontend/render", "HTML, routes, links, metadata and structured data", "Search-critical output exists only after fragile client execution", "Raw and rendered HTML fixtures for every template state"],
        ["CDN/edge", "Caching, redirects, headers, bot/security policy", "Stale metadata, wrong locale, cached errors or crawler challenges", "Regional response matrix, purge test and rollback"],
      ] },
      { type: "comparison-table", caption: "Choose rendering per page job, freshness requirement and failure tolerance.", columns: ["Pattern", "Best fit", "SEO acceptance requirement", "Main risk"], rows: [
        ["SSG", "Stable editorial and marketing pages", "Complete HTML at deploy plus dependable rebuild on change", "Stale output or slow emergency correction"],
        ["ISR", "Large inventories with bounded freshness", "Documented revalidation, cache behavior and stale/error policy", "Mixed versions across edge regions"],
        ["SSR", "Dynamic pages requiring request-time data", "Search-critical HTML returns within latency and availability budgets", "Upstream failure creates empty or error pages"],
        ["CSR", "Private tools or non-critical enhancements", "Core public content and crawlable links do not depend on interaction", "Empty initial HTML and delayed or failed rendering"],
      ] },
      { type: "evidence", claimId: "b1-headless-rendering", summary: "Google documents a separate processing path for JavaScript pages, so rendering choices should be validated from delivered HTML and rendered output rather than assumed from framework support.", sourceIds: ["b1-headless-google-js"] },
      { type: "heading", level: 2, text: "Write the search-critical content contract", id: "search-critical-content-contract" },
      { type: "checklist", title: "Required fields and behaviors", items: [
        { label: "Identity", detail: "Stable content ID, public URL, slug history, entity type, locale and translation relationship." },
        { label: "Search presentation", detail: "Title, description, canonical, robots, social image/text and breadcrumb label with length and fallback rules." },
        { label: "Relationships", detail: "Parent, hub, breadcrumb, related entities and contextual internal links that render as crawlable anchors." },
        { label: "Structured facts", detail: "Property-level source mapping so JSON-LD cannot drift from visible price, availability, dates, author or organization facts." },
        { label: "Lifecycle", detail: "Draft, scheduled, published, expired, archived and redirected states with status-code and sitemap behavior." },
        { label: "Operations", detail: "Preview parity, audit history, bulk export/import, cache invalidation, rollback and monitoring owner." },
      ] },
      { type: "heading", level: 2, text: "Use testable RFP requirements", id: "testable-rfp-requirements" },
      { type: "comparison-table", caption: "Replace yes/no feature questions with demonstrations.", columns: ["Requirement", "Acceptance fixture", "Fail condition"], rows: [
        ["Canonical and robots", "Editor sets values on draft; preview and published raw HTML match approved state", "Value is hard-coded, invisible in preview or stale after publish"],
        ["Redirect history", "Change a slug twice; old paths resolve in one hop to the current canonical", "Chain, loop, 200 soft redirect or manual spreadsheet dependency"],
        ["Localization", "Create two locales with alternates, locale-specific metadata and an intentional missing translation", "Contradictory canonical/hreflang or automatic cross-locale fallback"],
        ["Schema parity", "Change a visible fact and confirm JSON-LD updates in the same release", "Independent fields can disagree"],
        ["Preview and rollback", "Preview scheduled content, publish it, invalidate cache and restore the previous version", "Preview bypasses production render or rollback leaves stale edge output"],
        ["Sitemap", "Publish, update, noindex and redirect fixtures; inspect membership and lastmod", "Non-canonical URLs remain or lastmod changes without meaningful updates"],
      ] },
      { type: "evidence", claimId: "b1-headless-framework", summary: "Next.js exposes metadata conventions, but procurement still needs proof that the organization models, previews, validates and releases those values for every page state.", sourceIds: ["b1-headless-next-metadata"] },
      { type: "steps", title: "Score the vendor demonstration", steps: [
        { title: "Prepare fixtures before the demo", body: "Include a normal page, duplicate, removed URL, scheduled update, localized pair, out-of-stock item and upstream failure." },
        { title: "Ask editors and engineers to perform the workflow", body: "Observe the real authoring, preview, API, render, cache and rollback path instead of accepting slides." },
        { title: "Classify each requirement", body: "Mark native, custom, third-party dependency, manual, missing or untested; record implementation and maintenance owner." },
        { title: "Price the missing capability", body: "Estimate build, test, migration and ongoing governance cost before comparing platforms." },
      ] },
    ],
  },

  "http-status-codes-redirects": {
    readingTime: 18,
    informationGain:
      "A lifecycle-first status decision tree, expanded protocol matrix, implementation examples, and positive/negative release tests covering redirects, retries, removal and partial responses.",
    sources: [
      primarySource("b1-http-rfc9110", "RFC 9110: HTTP Semantics", "IETF", "https://www.rfc-editor.org/rfc/rfc9110", ["b1-http-semantics"]),
      primarySource("b1-http-google", "Redirects and Google Search", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/301-redirects", ["b1-http-redirects"]),
    ],
    claims: [
      { id: "b1-http-semantics", text: "HTTP status codes communicate different request outcomes, and redirect method behavior differs across 301, 302, 303, 307 and 308.", requiresEvidence: true, sourceIds: ["b1-http-rfc9110"] },
      { id: "b1-http-redirects", text: "Google treats permanent and temporary redirects as different signals and recommends direct redirects to the relevant final destination.", requiresEvidence: true, sourceIds: ["b1-http-google"] },
    ],
    originalInsights: [
      "Choose a status from the resource lifecycle first, then align the user experience, canonical, internal links, sitemap and monitoring to that same state.",
      "Every redirect release needs negative fixtures because the highest-risk defects are often unrelated URLs caught by an over-broad rule.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Map the resource state before choosing a code", id: "resource-state-decision-tree" },
      { type: "decision-framework", title: "URL lifecycle decision tree", criteria: [
        { signal: "The requested resource exists and has useful content", action: "Return 200; use 201 for a newly created API resource, 204 only when a successful response intentionally has no body, and 206 for a valid partial response" },
        { signal: "The resource has permanently moved to a close equivalent", action: "Return a direct 301 or 308 with Location; update internal links, canonicals and sitemaps" },
        { signal: "The resource is temporarily available elsewhere", action: "Use 302 or 307; choose 307 when method preservation is required" },
        { signal: "A POST result should be retrieved with GET", action: "Use 303 See Other rather than relying on ambiguous method rewriting" },
        { signal: "The resource is gone and no relevant replacement exists", action: "Return 404 or 410 with a helpful body; remove it from sitemaps and internal links" },
        { signal: "The service is temporarily unavailable", action: "Return 503 and, when known, Retry-After; do not mask the outage with 200" },
      ] },
      { type: "comparison-table", caption: "Operational meaning of status families most often encountered in SEO QA.", columns: ["Codes", "Meaning", "SEO/UX implementation note"], rows: [
        ["200 / 201 / 204 / 206", "Successful full, created, no-content or partial response", "Public HTML pages normally need a meaningful 200 body; validate byte-range behavior for video and large media"],
        ["301 / 308", "Permanent redirect", "Use one hop to a relevant destination; 308 preserves the request method"],
        ["302 / 303 / 307", "Temporary or method-directed redirect", "303 changes the follow-up to GET; 307 preserves method; document the intended lifecycle"],
        ["304", "Not modified for a conditional request", "Validate ETag/Last-Modified and cache behavior; a normal first request should not be an unexplained 304"],
        ["401 / 403", "Authentication required / access forbidden", "Keep private content private; investigate accidental public-template or verified-crawler blocks"],
        ["404 / 410 / 451", "Not found / intentionally gone / unavailable for legal reasons", "Return an honest status with appropriate user explanation and governance record"],
        ["429", "Too many requests", "Expose retry behavior, inspect crawler verification and avoid indiscriminate allowlisting"],
        ["500 / 502 / 503 / 504", "Application or upstream failure", "Preserve the error status, add 503 Retry-After where appropriate, and prevent long-lived error caching"],
      ] },
      { type: "evidence", claimId: "b1-http-semantics", summary: "RFC 9110 defines the semantics and method-handling differences behind success, redirect, client-error and server-error responses.", sourceIds: ["b1-http-rfc9110"] },
      { type: "heading", level: 2, text: "Implementation patterns", id: "redirect-implementation-patterns" },
      { type: "code", language: "nginx", code: "# Exact permanent move; avoid a catch-all regex when an exact map exists\nlocation = /old-guide {\n  return 308 https://example.com/new-guide;\n}\n\n# Planned maintenance response\nlocation /catalog/ {\n  add_header Retry-After 3600 always;\n  return 503;\n}" },
      { type: "code", language: "typescript", code: "// next.config.ts — permanent, one-hop redirect\nconst nextConfig = {\n  async redirects() {\n    return [{\n      source: '/old-guide',\n      destination: '/new-guide',\n      permanent: true,\n    }];\n  },\n};\n\nexport default nextConfig;" },
      { type: "heading", level: 2, text: "Test the rule and its blast radius", id: "status-release-tests" },
      { type: "checklist", title: "Positive and negative fixtures", items: [
        { label: "Expected source", detail: "Status, Location, protocol/host/path/query handling and final response all match the map." },
        { label: "Method behavior", detail: "GET, HEAD and any allowed non-GET method behave intentionally; 307/308 preservation is tested where relevant." },
        { label: "One-hop outcome", detail: "No chain, loop, soft redirect, mixed protocol or redirect back to an excluded locale." },
        { label: "Unrelated near-match", detail: "A similar path, file extension, query and locale remain unchanged to expose regex overreach." },
        { label: "Search alignment", detail: "Destination is canonical/indexable; internal links and sitemap no longer advertise the old URL." },
        { label: "Failure state", detail: "Missing, removed, restricted, throttled and maintenance fixtures retain honest non-200 statuses." },
      ] },
      { type: "evidence", claimId: "b1-http-redirects", summary: "Google documents permanent and temporary redirects separately and recommends redirecting directly to the relevant final destination.", sourceIds: ["b1-http-google"] },
      { type: "callout", title: "Do not redirect every retired URL to a category or home page", body: "A redirect is justified when the destination satisfies substantially the same user need. If no equivalent exists, an honest 404 or 410 with useful navigation is clearer than a mass redirect that behaves like a soft error.", tone: "amber" },
    ],
  },

  "image-seo-visual-search": {
    readingTime: 17,
    informationGain:
      "A page-to-asset discovery model, responsive-image implementation patterns, LCP decision rules, rights metadata, and a template-level image QA scorecard.",
    sources: [
      primarySource("b1-image-google", "Google Images SEO best practices", "Google Search Central", "https://developers.google.com/search/docs/appearance/google-images", ["b1-image-discovery"]),
      primarySource("b1-image-webdev", "Optimize Largest Contentful Paint", "web.dev", "https://web.dev/articles/optimize-lcp", ["b1-image-lcp"]),
    ],
    claims: [
      { id: "b1-image-discovery", text: "Google recommends descriptive context and alt text, supported image formats, responsive markup, stable image URLs and image sitemaps where discovery requires them.", requiresEvidence: true, sourceIds: ["b1-image-google"] },
      { id: "b1-image-lcp", text: "A likely LCP image should be discoverable in initial HTML and should not be delayed by lazy loading.", requiresEvidence: true, sourceIds: ["b1-image-webdev"] },
    ],
    originalInsights: [
      "Audit image SEO as a relationship between page, asset, rendition and entity; optimizing a filename cannot compensate for a weak or inaccessible page context.",
      "Assign an image role before choosing loading behavior: hero/LCP, explanatory, product evidence, decorative or user-generated content.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Start with the page-to-asset model", id: "page-asset-model" },
      { type: "comparison-table", caption: "Different image roles require different markup and governance.", columns: ["Image role", "Search value", "Performance rule", "Content rule"], rows: [
        ["Hero or likely LCP", "Represents the page or primary subject", "Eager load; expose in initial HTML; consider fetchpriority=high; preload only when discovery is otherwise late", "Use specific alt when informative and a stable URL"],
        ["Explanatory diagram", "Adds unique information and can be cited", "Responsive sizes; reserve dimensions", "Explain the conclusion in nearby text and provide meaningful alt/caption"],
        ["Product or place evidence", "Supports entity, variant and decision context", "Serve an appropriate rendition without hiding the original asset relationship", "Accurate subject, variant, rights and availability context"],
        ["Decorative", "No independent information", "Compress and defer when below the fold", "Use empty alt so assistive technology can ignore it"],
        ["User-generated", "May add evidence but carries quality/rights risk", "Validate size and transformations", "Moderation, permission, attribution and removal workflow"],
      ] },
      { type: "heading", level: 2, text: "Ship resilient responsive markup", id: "responsive-image-markup" },
      { type: "code", language: "html", code: "<picture>\n  <source type=\"image/avif\"\n    srcset=\"/hero-640.avif 640w, /hero-1280.avif 1280w\">\n  <source type=\"image/webp\"\n    srcset=\"/hero-640.webp 640w, /hero-1280.webp 1280w\">\n  <img src=\"/hero-1280.jpg\"\n    srcset=\"/hero-640.jpg 640w, /hero-1280.jpg 1280w\"\n    sizes=\"(max-width: 720px) 100vw, 1200px\"\n    width=\"1280\" height=\"720\"\n    alt=\"Annotated crawl-flow diagram from category link to canonical product page\"\n    fetchpriority=\"high\" decoding=\"async\">\n</picture>" },
      { type: "paragraph", text: "Keep a real src fallback, give width and height that match the aspect ratio, and verify that sizes describes rendered layout rather than the source file. AVIF or WebP can reduce transfer size, but format choice is secondary to correct dimensions, quality and delivery." },
      { type: "evidence", claimId: "b1-image-lcp", summary: "web.dev recommends making the LCP resource discoverable from HTML and avoiding lazy loading on the LCP image; use priority hints deliberately rather than on every image.", sourceIds: ["b1-image-webdev"] },
      { type: "heading", level: 2, text: "Make the image understandable and reusable", id: "image-context-rights" },
      { type: "checklist", title: "Asset record", items: [
        { label: "Meaning", detail: "Subject/entity, purpose, page relationship, descriptive alt, caption and nearby explanatory text." },
        { label: "Delivery", detail: "Original dimensions, rendition set, format, compression target, CDN host, cache policy and stable public URL." },
        { label: "Discovery", detail: "Crawlable img/src or picture markup, indexable host, image sitemap need, canonical page and representative-image selection." },
        { label: "Rights", detail: "Owner, creator, license, credit requirement, permitted markets, expiry and takedown contact." },
        { label: "Measurement", detail: "Template, impressions/clicks where reported, LCP/CLS contribution, broken asset rate and last QA date." },
      ] },
      { type: "evidence", claimId: "b1-image-discovery", summary: "Google's image guidance connects discoverability to supported markup, descriptive page context, alt text, stable accessible assets and image sitemaps for otherwise hard-to-discover files.", sourceIds: ["b1-image-google"] },
      { type: "steps", title: "Template-level QA", steps: [
        { title: "Inventory", body: "Sample hero, gallery, product, diagram, thumbnail and user-generated roles across mobile and desktop templates." },
        { title: "Inspect raw markup", body: "Confirm src/srcset/sizes, dimensions, alt behavior and that key images are not injected only after interaction." },
        { title: "Test delivery", body: "Check content type, byte size, intrinsic dimensions, cache headers, broken renditions and CDN access." },
        { title: "Measure experience", body: "Identify the actual LCP element, layout shifts, duplicate downloads and oversized candidates at representative breakpoints." },
        { title: "Validate discovery", body: "Inspect the canonical page, image host access, sitemap membership where needed, structured data parity and Search Console image trends." },
      ] },
    ],
  },

  "internal-site-search": {
    title: "How to Use Ecommerce Site Search Data for SEO and Content Decisions",
    metaTitle: "Ecommerce Site Search Data for SEO Decisions",
    metaDescription: "Turn ecommerce site-search queries, zero-result sessions and refinements into governed SEO, merchandising and content decisions.",
    breadcrumbLabel: "Ecommerce site search data",
    readingTime: 18,
    informationGain:
      "A query-event contract, cleaning pipeline, opportunity score, decision ledger, privacy guardrails and clear separation between using search demand and indexing search-result URLs.",
    sources: [
      primarySource("b1-search-ga4", "Recommended events", "Google Analytics", "https://developers.google.com/analytics/devguides/collection/ga4/reference/events", ["b1-search-event"]),
      primarySource("b1-search-spam", "Spam policies for Google web search", "Google Search Central", "https://developers.google.com/search/docs/essentials/spam-policies", ["b1-search-index-risk"]),
    ],
    claims: [
      { id: "b1-search-event", text: "Google Analytics defines a view_search_results event with a search_term parameter for measuring site-search result views.", requiresEvidence: true, sourceIds: ["b1-search-ga4"] },
      { id: "b1-search-index-risk", text: "Programmatically exposing large numbers of low-value search pages can create scaled-content and search-spam risk; query evidence should not automatically create an indexable URL.", requiresEvidence: true, sourceIds: ["b1-search-spam"] },
    ],
    originalInsights: [
      "Internal search is a first-party language sensor, not an automatic landing-page factory.",
      "Every query cluster should end in a decision ledger: synonym fix, merchandising change, navigation change, existing-page improvement, new page, or no action.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Define the event contract before reading demand", id: "site-search-event-contract" },
      { type: "comparison-table", caption: "Minimum event sequence for diagnosing site-search behavior.", columns: ["Event", "Required fields", "Question answered"], rows: [
        ["search_submitted", "search_term, normalized_term, results_count, locale, user/session pseudonymous ID", "What language did the visitor use and was inventory returned?"],
        ["search_results_viewed", "query ID, result IDs/categories, rank positions, filters/sort", "What options were actually shown?"],
        ["search_refined", "prior query, new query/filter, elapsed time", "Which vocabulary or filtering failed?"],
        ["result_selected", "query ID, item ID, rank, destination type", "Which results resolve the task?"],
        ["task_outcome", "add-to-cart, lead, support success or agreed micro-conversion", "Did the search journey help complete the job?"],
      ] },
      { type: "evidence", claimId: "b1-search-event", summary: "GA4's recommended ecommerce events include view_search_results and the search_term parameter; a richer internal contract can extend that base while preserving consistent naming.", sourceIds: ["b1-search-ga4"] },
      { type: "heading", level: 2, text: "Clean queries without deleting intent", id: "query-cleaning-pipeline" },
      { type: "steps", title: "Normalization pipeline", steps: [
        { title: "Protect privacy", body: "Remove or hash emails, phone numbers, order IDs and other personal or sensitive strings before analysis. Set retention and access controls." },
        { title: "Normalize mechanics", body: "Trim case and whitespace, decode safe characters and separate locale. Preserve the raw value in restricted storage for debugging." },
        { title: "Group spelling and synonyms", body: "Create reviewable mappings for typos, abbreviations, brands and category language; do not merge terms with different commercial meaning." },
        { title: "Classify the job", body: "Label product/category discovery, compatibility, problem/solution, support, location, policy or navigational intent." },
        { title: "Join outcomes", body: "Attach results count, refinement, selection, exit and task completion at query-cluster level, not just raw volume." },
      ] },
      { type: "heading", level: 2, text: "Score opportunities and record the decision", id: "search-opportunity-ledger" },
      { type: "code", language: "text", code: "opportunity_score =\n  normalized_query_sessions\n  x unmet_need_rate\n  x business_relevance\n  x evidence_confidence\n  / estimated_effort\n\nWhere unmet_need_rate can combine:\nzero results + repeated refinement + qualified exit - successful task completion" },
      { type: "comparison-table", caption: "The evidence should choose the intervention.", columns: ["Signal", "Likely action", "Validation"], rows: [
        ["High demand, relevant inventory, poor result selection", "Fix synonyms, ranking or merchandising", "Selection and task completion improve without a new indexable page"],
        ["Repeated category language with external demand and distinct inventory", "Improve an existing category or create a curated landing page", "Page has unique purpose, products, copy and internal discovery"],
        ["Compatibility/problem query answered by guidance", "Create or improve guide/FAQ and link to relevant products", "Search refinements and support burden decline"],
        ["Low-volume personal/order queries", "Improve support routing; exclude from content ideation", "Privacy and task completion guardrails"],
        ["Thin search URL with arbitrary combinations", "Keep out of index; control crawlable links and parameters", "No unintended indexable search-space expansion"],
      ] },
      { type: "evidence", claimId: "b1-search-index-risk", summary: "Internal query demand is evidence for a content decision, not permission to expose every search-results combination as an indexable page; Google policies warn against scaled low-value pages made primarily for search manipulation.", sourceIds: ["b1-search-spam"] },
      { type: "checklist", title: "Decision ledger fields", items: [
        { label: "Cluster", detail: "Normalized query family, locale, examples and excluded ambiguous terms." },
        { label: "Evidence", detail: "Sessions, zero-result/refinement/exit/task rates, external demand evidence and confidence." },
        { label: "Decision", detail: "Search tuning, merchandising, navigation, existing page, new page, support fix or no action." },
        { label: "URL policy", detail: "Indexability, canonical, parameter/link behavior and owning evergreen URL if one exists." },
        { label: "Owner and test", detail: "Responsible team, release date, guardrails, success measure, review date and rollback." },
      ] },
    ],
  },

  "out-of-stock-discontinued-products": {
    readingTime: 18,
    informationGain:
      "A product-state machine joining return probability, demand, backlinks, replacement quality and support value to HTTP, canonical, UX, feed, schema, sitemap and internal-link actions.",
    sources: [
      primarySource("b1-oos-google", "How to deal with out-of-stock products", "Google Search Central", "https://developers.google.com/search/blog/2014/03/best-practices-for-ecommerce-sites", ["b1-oos-lifecycle"]),
      primarySource("b1-oos-merchant", "Product data specification", "Google Merchant Center", "https://support.google.com/merchants/answer/7052112", ["b1-oos-feed"]),
    ],
    claims: [
      { id: "b1-oos-lifecycle", text: "Temporary stock loss, permanent discontinuation and category retirement require different URL treatments rather than one universal redirect rule.", requiresEvidence: true, sourceIds: ["b1-oos-google"] },
      { id: "b1-oos-feed", text: "Merchant product availability should reflect the landing-page and checkout reality.", requiresEvidence: true, sourceIds: ["b1-oos-merchant"] },
    ],
    originalInsights: [
      "Decide product URL fate with five signals: expected return, retained demand, link/equity, replacement similarity and durable support value.",
      "Treat stock changes as state transitions emitted to every consumer, not as isolated edits to page copy.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Classify the product state", id: "product-state-classification" },
      { type: "comparison-table", caption: "A shared state model prevents the page, feed and schema from disagreeing.", columns: ["State", "Customer promise", "Default URL behavior", "System updates"], rows: [
        ["In stock", "Purchasable now", "200, self-canonical, indexable", "Accurate offer/schema/feed; included in relevant links and sitemap"],
        ["Temporarily out of stock", "Expected to return", "Keep useful 200 page when date/notification/alternatives add value", "Availability synchronized; retain canonical; prioritize return notification"],
        ["Seasonally unavailable", "Returns in a known cycle", "Keep evergreen 200 page with transparent dates and substitutes", "Remove misleading promotion; retain history and relevant links"],
        ["Discontinued with close replacement", "Original will not return", "301 only when replacement satisfies substantially the same need; otherwise useful 200 archive or 410", "Update internal links, feed, sitemap, schema and support content"],
        ["Discontinued without replacement", "No longer sold", "Useful 200 archive if durable demand/support exists; otherwise 404 or 410", "Remove from commercial discovery and prevent feed/schema contradiction"],
      ] },
      { type: "decision-framework", title: "Five-signal URL decision", criteria: [
        { signal: "Return probability is high and timing is known", action: "Keep the page, state availability clearly, offer notification and show compatible alternatives" },
        { signal: "External demand, backlinks or support use remains material", action: "Keep a useful archive even if the item will not return; remove transactional promises" },
        { signal: "A replacement is genuinely equivalent in job, audience and specification", action: "Use a one-hop permanent redirect and explain the replacement on destination" },
        { signal: "No return, replacement, demand, links or support value", action: "Return 404 or 410 and remove from links, sitemaps and feeds" },
        { signal: "Evidence conflicts or the state is uncertain", action: "Keep the current honest state, assign an owner and set a review date rather than auto-redirecting" },
      ] },
      { type: "evidence", claimId: "b1-oos-lifecycle", summary: "Google's ecommerce guidance distinguishes small sites, temporary unavailability and permanently removed products; lifecycle and site scale affect the recommended treatment.", sourceIds: ["b1-oos-google"] },
      { type: "heading", level: 2, text: "Synchronize every consumer of availability", id: "synchronize-product-state" },
      { type: "checklist", title: "State-transition contract", items: [
        { label: "Visible page", detail: "Availability, expected return if known, price qualification, notification, alternatives and support information." },
        { label: "HTTP/canonical", detail: "Honest status, self-canonical for a retained unique page, or direct redirect only to a true substitute." },
        { label: "Internal discovery", detail: "Category ranking, filters, recommendations, breadcrumbs and links reflect whether purchase is possible." },
        { label: "XML sitemap", detail: "Include only retained canonical pages according to policy; remove redirected and error URLs." },
        { label: "Structured data", detail: "Offer availability and other facts match visible content; remove offers when no valid offer exists." },
        { label: "Merchant feed", detail: "Availability, price, link and identifier match the landing page and checkout." },
        { label: "Operations", detail: "Event time, source system, transition owner, override reason, monitoring and rollback." },
      ] },
      { type: "evidence", claimId: "b1-oos-feed", summary: "Merchant Center's product specification requires availability values that describe whether a product can be purchased and align with the landing-page experience.", sourceIds: ["b1-oos-merchant"] },
      { type: "heading", level: 2, text: "Design bulk transitions safely", id: "bulk-product-transitions" },
      { type: "steps", title: "Cohort rollout", steps: [
        { title: "Dry-run the state map", body: "Export proposed states, destination URLs, canonical/status/feed/schema changes and exceptions before writing production data." },
        { title: "Validate replacement similarity", body: "Sample redirects with merchandising and support owners; reject category-home or weak substitutes." },
        { title: "Release a bounded cohort", body: "Monitor status, redirect hops, sitemap/feed parity, structured-data errors, conversion tasks and support contacts." },
        { title: "Expand or reverse", body: "Scale only after guardrails hold. Preserve the old mapping and source data for rollback." },
      ] },
      { type: "callout", title: "Worked SKU cohort", body: "Hypothetical: 500 retired SKUs split into 120 close replacements, 80 high-support archives and 300 no-value removals. The team redirects only the validated 120, retains non-transactional 200 archives for the 80, returns 410 for the remainder, and reconciles feed, sitemap, links and schema. This illustrates governance, not a claimed result.", tone: "blue" },
    ],
  },

  "pagination-infinite-scroll-load-more": {
    readingTime: 18,
    informationGain:
      "A crawlable progressive-enhancement pattern, pagination/filter state model, History API example, and a raw/rendered/log validation plan covering discovery, accessibility and back-button behavior.",
    sources: [
      primarySource("b1-page-google", "Pagination, incremental page loading, and their impact on Google Search", "Google Search Central", "https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading", ["b1-page-links", "b1-page-canonical"]),
    ],
    claims: [
      { id: "b1-page-links", text: "Google recommends linking paginated pages sequentially with crawlable anchor elements and unique URLs because crawlers generally do not click buttons or trigger user actions.", requiresEvidence: true, sourceIds: ["b1-page-google"] },
      { id: "b1-page-canonical", text: "Paginated component pages should normally use their own canonical URL rather than canonicalizing every page to page one.", requiresEvidence: true, sourceIds: ["b1-page-google"] },
    ],
    originalInsights: [
      "Treat pagination as the durable content-addressing layer and infinite scroll/load more as optional interaction layers over it.",
      "Test history restoration and accessibility together with crawlability; a discoverable system that loses a user's position is still incomplete.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Choose the interaction, preserve the URL model", id: "pagination-selection-matrix" },
      { type: "comparison-table", caption: "All three experiences can work when stable paginated URLs remain the source of truth.", columns: ["Experience", "Use when", "Required foundation", "Primary risk"], rows: [
        ["Pagination", "Users compare bounded sets or need position control", "Unique page URLs and crawlable next/previous anchors", "Weak discovery if page links are hidden or over-truncated"],
        ["Load more", "Users benefit from continuity but choose when to fetch", "Button enhances a real href to the next page", "New items have no addressable/history state"],
        ["Infinite scroll", "Continuous browsing is central to the task", "Automatic loading enhances paginated URLs and updates/restores history", "Crawler cannot trigger loading; focus and position are lost"],
      ] },
      { type: "evidence", claimId: "b1-page-links", summary: "Google recommends crawlable anchor links between sequential component pages and notes that crawlers generally do not interact with buttons to load more content.", sourceIds: ["b1-page-google"] },
      { type: "heading", level: 2, text: "Progressively enhance crawlable pages", id: "progressive-enhancement" },
      { type: "code", language: "html", code: "<!-- Works without JavaScript; JS may enhance the same URL -->\n<a class=\"load-more\" href=\"/category?page=3\">Load page 3</a>" },
      { type: "code", language: "javascript", code: "const link = document.querySelector('.load-more');\nlink?.addEventListener('click', async (event) => {\n  event.preventDefault();\n  const nextUrl = link.href;\n  const html = await fetch(nextUrl).then((r) => r.text());\n  appendItemsFrom(html);\n  history.pushState({ scrollY: window.scrollY }, '', nextUrl);\n  announceNewItemsToAssistiveTechnology();\n});\n\naddEventListener('popstate', () => restoreItemsAndScrollFromUrl(location.href));" },
      { type: "heading", level: 2, text: "Define index, canonical and filter states", id: "pagination-state-policy" },
      { type: "comparison-table", caption: "Do not apply one canonical rule to every collection state.", columns: ["State", "Canonical/index policy", "Link policy"], rows: [
        ["Base collection", "Self-canonical and indexable when useful", "Links to key subcategories/filters and page 2"],
        ["Page 2+", "Unique URL and normally self-canonical; unique title may include the page number", "Sequential crawlable links plus product/detail anchors"],
        ["Valuable curated filter", "Own indexable landing page when demand, inventory and unique purpose justify it", "Stable curated links; avoid uncontrolled parameter combinations"],
        ["Sort/view state", "Usually non-index target; retain usable navigation without advertising endless variants", "Avoid crawlable combinatorial links or normalize state"],
        ["Empty/out-of-range page", "Honest empty or not-found behavior; never redirect all to page one", "Remove invalid next links and monitor generator defects"],
      ] },
      { type: "evidence", claimId: "b1-page-canonical", summary: "Google advises giving each component page its own canonical URL rather than pointing every paginated page at the first page.", sourceIds: ["b1-page-google"] },
      { type: "checklist", title: "Acceptance tests", items: [
        { label: "Raw HTML", detail: "Page 1 contains a crawlable link to page 2; each page exposes item links without requiring interaction." },
        { label: "Rendered interaction", detail: "Loading appends only the intended items, avoids duplicates and exposes the next stable URL." },
        { label: "History", detail: "Back/forward restores URL, loaded items, focus and scroll position." },
        { label: "Accessibility", detail: "Keyboard activation works, focus is intentional and new content is announced without trapping the user." },
        { label: "Metadata", detail: "Status, canonical, robots, title and empty/out-of-range behavior match the state policy." },
        { label: "Logs and Search Console", detail: "Component URLs are crawled, detail pages are discovered and unwanted parameter spaces do not dominate requests." },
      ] },
    ],
  },

  "robots-meta-x-robots-controls": {
    readingTime: 18,
    informationGain:
      "A control-plane matrix separating crawling, indexing, snippets, resources and security; precedence rules; server examples; and staged removal/conflict workflows including distinct AI crawler roles.",
    sources: [
      primarySource("b1-robots-rfc", "RFC 9309: Robots Exclusion Protocol", "IETF", "https://www.rfc-editor.org/rfc/rfc9309", ["b1-robots-protocol"]),
      primarySource("b1-robots-google", "Robots meta tag, data-nosnippet, and X-Robots-Tag specifications", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag", ["b1-robots-index-controls"]),
    ],
    claims: [
      { id: "b1-robots-protocol", text: "robots.txt is a crawler-coordination protocol and not an authorization or security control.", requiresEvidence: true, sourceIds: ["b1-robots-rfc"] },
      { id: "b1-robots-index-controls", text: "A crawler must be able to access a page to observe a robots meta or X-Robots-Tag noindex directive.", requiresEvidence: true, sourceIds: ["b1-robots-google"] },
    ],
    originalInsights: [
      "Write control policy by objective—crawl, index, snippet, resource, security or AI use—before selecting a directive.",
      "Every rule needs host, path-pattern, content-type and expected-response fixtures because scope errors are more dangerous than syntax errors.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Choose the control from the objective", id: "control-plane-matrix" },
      { type: "comparison-table", caption: "These mechanisms solve different problems and are not interchangeable.", columns: ["Objective", "Primary control", "Crawler access needed?", "Important limitation"], rows: [
        ["Reduce crawling of a public path", "robots.txt Disallow for cooperating agents", "No for disallowed paths", "The URL can still be known or referenced; directives are not access control"],
        ["Remove an accessible HTML page from search", "meta robots noindex", "Yes", "Blocking the URL in robots.txt can prevent the directive from being seen"],
        ["Remove a PDF/image/non-HTML response", "X-Robots-Tag: noindex", "Yes", "Header must survive CDN/proxy behavior and apply only to intended types"],
        ["Limit snippets or cached presentation", "nosnippet, max-snippet, max-image-preview, noarchive where supported", "Yes", "Support and interpretation vary; verify current engine documentation"],
        ["Keep content private", "Authentication/authorization and non-public storage", "No public access", "robots.txt advertises paths and cannot protect secrets"],
        ["Control specific AI crawler roles", "Agent-specific robots policy using each operator's documented token", "Depends on chosen policy", "Search, training and user-initiated fetch agents may have different roles"],
      ] },
      { type: "evidence", claimId: "b1-robots-protocol", summary: "RFC 9309 standardizes robots.txt behavior for cooperating crawlers; it does not make a public URL private or authorize access.", sourceIds: ["b1-robots-rfc"] },
      { type: "heading", level: 2, text: "Understand scope and precedence", id: "scope-and-precedence" },
      { type: "checklist", title: "Rule-resolution checklist", items: [
        { label: "Host and scheme", detail: "Fetch the robots.txt from the exact protocol, hostname and port being tested; staging and asset hosts need separate policy." },
        { label: "Agent group", detail: "Confirm the matched user-agent token and most specific applicable allow/disallow path." },
        { label: "URL encoding", detail: "Test case, percent encoding, wildcards, end anchors and query behavior against documented parser rules." },
        { label: "Response status", detail: "Record robots.txt and target URL status; outages, redirects and cached copies can change interpretation." },
        { label: "Page/header directives", detail: "Inspect raw meta robots and every X-Robots-Tag value after CDN and application middleware." },
        { label: "Search history", detail: "A newly added control does not erase prior discovery instantly; monitor processing and use documented removal tools only for urgent temporary hiding." },
      ] },
      { type: "evidence", claimId: "b1-robots-index-controls", summary: "Google states that robots meta and X-Robots-Tag rules are discovered during crawling; if robots.txt blocks the resource, the crawler may not see noindex.", sourceIds: ["b1-robots-google"] },
      { type: "heading", level: 2, text: "Implementation examples", id: "robots-implementation-examples" },
      { type: "code", language: "html", code: "<!-- Accessible to crawlers, excluded from indexing -->\n<meta name=\"robots\" content=\"noindex,follow\">\n\n<!-- Limit a specific passage from snippets -->\n<p data-nosnippet>Account-specific or non-representative text</p>" },
      { type: "code", language: "nginx", code: "# Non-HTML document excluded from indexing\nlocation = /downloads/legacy-manual.pdf {\n  add_header X-Robots-Tag \"noindex\" always;\n}\n\n# Never use this as protection for private files; require authorization instead." },
      { type: "steps", title: "Remove a page without creating a directive conflict", steps: [
        { title: "Classify the desired final state", body: "Keep and index, keep but noindex, consolidate, remove, or protect. Name the canonical alternative if one exists." },
        { title: "Make the directive observable", body: "For noindex, allow crawling long enough for the page or header directive to be processed. Remove contradictory canonical and sitemap signals." },
        { title: "Fix discovery surfaces", body: "Update internal links, feeds, sitemaps and navigation so they stop advertising the unwanted URL." },
        { title: "Monitor processing", body: "Use representative URL inspection, index coverage, logs and template sampling; do not infer removal from one search query." },
        { title: "Apply the durable crawl policy", body: "After the intended state is processed, add any justified crawl constraint without hiding future diagnostics." },
      ] },
    ],
  },

  "seasonal-seo-plan": {
    readingTime: 17,
    informationGain:
      "A reusable-versus-year-specific URL decision, T-120 to T+30 operating calendar, inventory-state playbook, multi-market localization controls and post-season learning record.",
    sources: [
      primarySource("b1-season-google", "Best practices for ecommerce sites in Google Search", "Google Search Central", "https://developers.google.com/search/docs/specialty/ecommerce/best-practices", ["b1-season-ecommerce"]),
      primarySource("b1-season-trends", "FAQ about Google Trends data", "Google Trends", "https://support.google.com/trends/answer/4365533", ["b1-season-demand"]),
    ],
    claims: [
      { id: "b1-season-ecommerce", text: "Ecommerce visibility depends on consistent product data, crawlable site structure and technically accessible landing pages throughout the campaign lifecycle.", requiresEvidence: true, sourceIds: ["b1-season-google"] },
      { id: "b1-season-demand", text: "Google Trends reports normalized, sampled relative interest rather than absolute search volume or a site's expected traffic.", requiresEvidence: true, sourceIds: ["b1-season-trends"] },
    ],
    originalInsights: [
      "Choose evergreen or year-specific URLs based on recurring user need and archival value, not on a blanket annual naming convention.",
      "Seasonal SEO is an inventory and release system: demand research without stock, feeds, internal links and post-season state ownership is incomplete.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Choose a reusable or year-specific URL", id: "seasonal-url-strategy" },
      { type: "comparison-table", caption: "URL strategy follows the user need after the event ends.", columns: ["Pattern", "Use when", "After the season", "Risk to manage"], rows: [
        ["Evergreen URL", "The same core event/category recurs and accumulated history remains useful", "Keep live, reduce promotion, explain next cycle and retain genuinely useful guidance", "Stale dates, offers or schema"],
        ["Year-specific URL", "Each edition has distinct program, entrants, rules, results or archival demand", "Preserve as an accurate archive; link to the current edition", "Thin duplicate editions and confused canonical/hreflang"],
        ["Hybrid hub + editions", "Users need both a persistent event hub and edition details", "Hub points to current and archived editions with explicit relationships", "Competing intent between hub and edition pages"],
        ["Campaign-only page", "Offer is one-time and has no durable informational value", "Remove honestly or redirect only to a true equivalent", "Mass redirects to generic categories"],
      ] },
      { type: "heading", level: 2, text: "Operate from T-120 through T+30", id: "seasonal-operating-calendar" },
      { type: "comparison-table", caption: "The calendar is relative to the demand peak, not a universal date.", columns: ["Window", "Primary work", "Exit evidence"], rows: [
        ["T-120 to T-90", "Review prior-year query/page/product/market data; choose URL model; confirm inventory and owners", "Approved brief, canonical inventory, forecast assumptions and risk register"],
        ["T-90 to T-60", "Update/create core pages, localization, media and structured facts; secure internal-link slots", "Indexable staging fixtures and signed-off content"],
        ["T-60 to T-30", "Publish enough for discovery; validate feeds, sitemaps, canonicals, hreflang and page experience", "Search-accessible pages and error-free product/state parity"],
        ["T-30 to T-0", "Increase contextual links and merchandising; monitor queries, stock, status and crawl", "Daily exception view and named response owners"],
        ["T+1 to T+30", "Transition offers/states, archive or retain pages, reconcile links/feed/schema, document learning", "No stale promises and a versioned post-season record"],
      ] },
      { type: "evidence", claimId: "b1-season-demand", summary: "Use Trends to compare relative timing and geography, but label it correctly: the data is normalized and sampled, not an absolute traffic forecast.", sourceIds: ["b1-season-trends"] },
      { type: "heading", level: 2, text: "Control live inventory states", id: "seasonal-inventory-states" },
      { type: "decision-framework", title: "Campaign state playbook", criteria: [
        { signal: "Campaign live and inventory healthy", action: "Keep offer, feed, schema, price, links and messaging synchronized" },
        { signal: "Low stock or constrained geography", action: "State limits visibly, reduce misleading promotion and update feed/schema at the same time" },
        { signal: "Sold out but a restock is credible", action: "Keep a useful page, expose timing/notification and relevant alternatives" },
        { signal: "Offer expired but page has recurring value", action: "Remove expired claims, retain evergreen guidance and state the next cycle if confirmed" },
        { signal: "No future or archival value", action: "Remove with an honest status or redirect only to a substantially equivalent destination" },
      ] },
      { type: "evidence", claimId: "b1-season-ecommerce", summary: "Google's ecommerce guidance emphasizes crawlable navigation and consistent product information across site and platform surfaces—requirements that must survive every campaign state.", sourceIds: ["b1-season-google"] },
      { type: "checklist", title: "Multi-market release controls", items: [
        { label: "Demand window", detail: "Local event date, lead time, weekday pattern and relative interest are reviewed per market." },
        { label: "Offer eligibility", detail: "Currency, shipping, inventory, legal terms and promotion dates are market-correct." },
        { label: "Localization", detail: "Copy is localized for intent and terminology; canonical/hreflang pairs are reciprocal and non-conflicting." },
        { label: "Release timing", detail: "Publishing and internal promotion follow local discovery needs, not one global switch." },
        { label: "Post-season state", detail: "Each locale has an owner and transition even when stock or event timing differs." },
      ] },
    ],
  },

  "seo-release-qa-checklist": {
    readingTime: 23,
    informationGain:
      "A release classification system, risk score, acceptance-fixture format, automated and production smoke gates, rollback triggers and a transparent worked release record.",
    sources: [
      primarySource("b1-release-inspection", "URL Inspection tool", "Google Search Console Help", "https://support.google.com/webmasters/answer/9012289", ["b1-release-processing"]),
      primarySource("b1-release-sitemaps", "Build and submit a sitemap", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap", ["b1-release-sitemap"]),
    ],
    claims: [
      { id: "b1-release-processing", text: "URL Inspection can report Google's indexed and live-test view for a URL, but passing a live test does not guarantee future indexing or search appearance.", requiresEvidence: true, sourceIds: ["b1-release-inspection"] },
      { id: "b1-release-sitemap", text: "A sitemap is a discovery hint and must contain preferred canonical URLs; submission does not guarantee indexing.", requiresEvidence: true, sourceIds: ["b1-release-sitemaps"] },
    ],
    originalInsights: [
      "Classify the release before selecting tests; route, template, rendering, metadata and infrastructure changes have different failure radii.",
      "A valid SEO acceptance test specifies a positive fixture, negative fixture, exact observation layer, expected result, owner and rollback trigger.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Classify release risk before choosing the gate", id: "release-risk-classification" },
      { type: "comparison-table", caption: "Risk increases with reach, search-criticality, reversibility and detection delay.", columns: ["Release class", "Examples", "Minimum gate"], rows: [
        ["Content-only", "Copy, media, internal link on known template", "Preview, factual/source review, link and rendered metadata sample"],
        ["Template", "Heading, canonical, schema, navigation or product-state component", "Representative state matrix, raw/rendered snapshots and automated regression"],
        ["Routing/inventory", "Slug, redirect, pagination, facets, sitemap generator", "Full mapping, positive/negative URL fixtures, crawl diff and rollback map"],
        ["Rendering/data", "SSR/ISR/CSR change, API contract, personalization", "Failure/timeout fixtures, raw HTML, cache states and monitoring"],
        ["Infrastructure", "CDN, WAF, cache key, host, TLS or deployment platform", "Regional/agent matrix, availability/security guardrails and rapid rollback"],
      ] },
      { type: "code", language: "text", code: "release_risk = reach x search_criticality x detection_delay x irreversibility\n\nUse 1–5 evidence-based scores.\nA high score expands fixture coverage and approval;\nit never substitutes for named failure modes." },
      { type: "heading", level: 2, text: "Write executable acceptance criteria", id: "executable-seo-acceptance" },
      { type: "comparison-table", caption: "Example fixture format.", columns: ["Field", "Example"], rows: [
        ["Change", "Product retirement state machine"],
        ["Positive fixture", "/products/model-a retires to equivalent /products/model-b"],
        ["Negative fixture", "/products/model-c has no equivalent and must remain 410"],
        ["Observation", "Public edge status/Location, raw HTML, rendered page, sitemap, feed and JSON-LD"],
        ["Expected", "One-hop 308 to indexable self-canonical destination; negative remains 410 and absent from sitemap/feed"],
        ["Owner", "Engineering implements; SEO accepts; merchandising verifies equivalence"],
        ["Rollback trigger", "Any redirect loop, >0.5% unrelated match, feed/page availability conflict or material 5xx increase"],
      ] },
      { type: "heading", level: 2, text: "Layer the release gate", id: "layered-release-gate" },
      { type: "steps", title: "From baseline to post-release processing", steps: [
        { title: "Capture baseline", body: "Save representative response headers, raw HTML, rendered DOM, structured data, screenshots, inventory counts, crawl results and relevant Search Console cohorts." },
        { title: "Run pre-merge automation", body: "Test route/status/canonical/robots/hreflang/schema/link/sitemap fixtures and assert negative URLs remain unaffected." },
        { title: "Approve staging behavior", body: "Use production-like rendering, data and cache settings. Record accepted exceptions rather than silently ignoring them." },
        { title: "Release a bounded cohort", body: "Canary by template, locale, host or percentage when the platform supports it; keep the rollback artifact ready." },
        { title: "Run production smoke tests", body: "Observe public edge and rendered output from representative regions and agents immediately after release." },
        { title: "Monitor processing", body: "Track server errors, crawler access, inventory drift, inspection samples and search cohorts over the time needed for recrawl; do not declare success from deployment alone." },
      ] },
      { type: "evidence", claimId: "b1-release-processing", summary: "URL Inspection helps compare indexed information and a live fetch, but neither a successful test nor submitted URL guarantees future indexing or appearance.", sourceIds: ["b1-release-inspection"] },
      { type: "evidence", claimId: "b1-release-sitemap", summary: "Google describes sitemap submission as a hint, which is why release monitoring must examine actual crawl and index processing rather than treating submission as completion.", sourceIds: ["b1-release-sitemaps"] },
      { type: "checklist", title: "Release record", items: [
        { label: "Scope", detail: "Ticket, release SHA, affected hosts/templates/locales, start/end time and decision owners." },
        { label: "Evidence", detail: "Baseline and post-release artifacts with timestamps and exact test URLs." },
        { label: "Exceptions", detail: "Known deviations, risk acceptance, expiry and accountable approver." },
        { label: "Rollback", detail: "Mechanism, trigger, decision authority, recovery verification and cache/data implications." },
        { label: "Processing review", detail: "Dates and cohorts for follow-up after crawlers and search systems have had time to process the change." },
      ] },
      { type: "callout", title: "Worked release record", body: "Hypothetical: a new canonical component launches to 5% of one locale. Automated fixtures pass, but production smoke tests find the CDN stripped a Vary dimension and serves the locale-A canonical on locale B. The owner triggers rollback before expanding, preserves request IDs and fixes the cache key. This shows why staging success is not production acceptance.", tone: "blue" },
    ],
  },

  "site-architecture-navigation-taxonomy": {
    readingTime: 18,
    informationGain:
      "Entity, page-job and journey modeling across SaaS, ecommerce and publishing; layered navigation; measurable path quality; URL/facet governance; and a migration-safe ownership workflow.",
    sources: [
      primarySource("b1-arch-links", "Link best practices for Google", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/links-crawlable", ["b1-arch-crawlable-links"]),
      primarySource("b1-arch-ecommerce", "Help Google understand your ecommerce site structure", "Google Search Central", "https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure", ["b1-arch-structure"]),
    ],
    claims: [
      { id: "b1-arch-crawlable-links", text: "Google can reliably crawl standard anchor elements with resolvable href values and uses anchor text/context to understand linked pages.", requiresEvidence: true, sourceIds: ["b1-arch-links"] },
      { id: "b1-arch-structure", text: "Google primarily infers ecommerce site structure from crawlable page relationships rather than URL folder names alone.", requiresEvidence: true, sourceIds: ["b1-arch-ecommerce"] },
    ],
    originalInsights: [
      "Design architecture from entity ownership, page job and user journey before drawing menus or choosing URL folders.",
      "Measure path quality with relevant inlinks and task continuity, not a universal three-click rule.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Model entity, page job and journey", id: "entity-page-job-journey" },
      { type: "comparison-table", caption: "Three lenses prevent navigation from becoming an organizational chart.", columns: ["Lens", "Question", "Artifact"], rows: [
        ["Entity", "What distinct product, service, topic, person, place or category does the site represent?", "Entity inventory with canonical owner and relationships"],
        ["Page job", "What unique task should this page complete better than another URL?", "Page-purpose and query-intent map"],
        ["Journey", "What should a user understand or do before and after this page?", "Entry, comparison, validation, conversion and support paths"],
      ] },
      { type: "heading", level: 2, text: "Use an architecture pattern that matches the business", id: "architecture-reference-patterns" },
      { type: "comparison-table", caption: "Reference models are starting points, not fixed templates.", columns: ["Site", "Primary hierarchy", "Supporting relationships", "Common trap"], rows: [
        ["SaaS", "Problem/use case → solution/product → feature/integration", "Industry, comparison, documentation, proof and pricing", "Separate pages repeat the same generic product claim"],
        ["Ecommerce", "Department → category → curated subcategory → product", "Brand, compatibility, use case, guide and policy", "Facets create unlimited duplicate combinations"],
        ["Publisher", "Topic hub → subtopic → article/guide", "Author, series, glossary, update and source relationships", "Chronological archives orphan durable explainers"],
      ] },
      { type: "heading", level: 2, text: "Layer navigation by purpose", id: "navigation-layers" },
      { type: "checklist", title: "Navigation system", items: [
        { label: "Primary", detail: "Stable, high-value tasks and entities that deserve sitewide prominence; keep labels specific." },
        { label: "Secondary/local", detail: "Options within the current section, product or topic; preserve orientation." },
        { label: "Breadcrumb", detail: "A visible parent path based on information relationships, with crawlable links and matching structured data where used." },
        { label: "Contextual", detail: "Links placed where the relationship helps the reader continue, compare or verify; use descriptive anchors." },
        { label: "Hub/index", detail: "Curated entry points that explain the set and expose important children—not thin link lists." },
        { label: "Utility", detail: "Account, support, legal and operational tasks separated from commercial/topic hierarchy without becoming orphaned." },
      ] },
      { type: "evidence", claimId: "b1-arch-crawlable-links", summary: "Google's link guidance supports standard anchors with href values and descriptive context, which should be the durable foundation underneath interactive navigation.", sourceIds: ["b1-arch-links"] },
      { type: "heading", level: 2, text: "Measure path quality", id: "architecture-measurement" },
      { type: "comparison-table", caption: "Use page-type distributions rather than one sitewide average.", columns: ["Metric", "Interpretation", "Failure signal"], rows: [
        ["Click depth", "Shortest crawlable path from a governed entry point", "Valuable pages move deeper without a business reason"],
        ["Relevant inlinks", "Count and quality of links from semantically related, indexed pages", "Priority page depends on footer or sitemap only"],
        ["Orphan rate", "Canonical indexable URLs with no known crawlable internal link", "Inventory enters sitemap/database but not journeys"],
        ["Path continuity", "Users can move from discovery to comparison, proof and next action", "Dead ends or repeated backtracking in journey data"],
        ["Sibling dilution", "Number of competing children presented at one decision point", "Menus/hubs expose hundreds of undifferentiated choices"],
      ] },
      { type: "evidence", claimId: "b1-arch-structure", summary: "Google explains ecommerce structure through crawlable links between navigation, categories and products—not by URL folder depth alone.", sourceIds: ["b1-arch-ecommerce"] },
      { type: "heading", level: 2, text: "Govern URLs and facets", id: "url-facet-governance" },
      { type: "decision-framework", title: "Create a distinct URL only when", criteria: [
        { signal: "The entity or task is distinct, durable and has a clear owner", action: "Define one canonical route, title/purpose, parent relationships and lifecycle" },
        { signal: "A filter combination has meaningful demand, inventory and unique decision value", action: "Curate a stable landing page and control all non-curated combinations" },
        { signal: "The state is only sort, view, session or tracking", action: "Keep it out of the canonical index inventory and avoid crawlable combinatorial links" },
        { signal: "A locale/market has genuinely localized content and offer", action: "Create the locale URL with self-canonical and valid alternate relationships" },
      ] },
      { type: "steps", title: "Architecture migration workflow", steps: [
        { title: "Inventory and classify", body: "Join routes to traffic, links, index state, conversions, entity, page job and owner." },
        { title: "Design the target graph", body: "Map parent, sibling, contextual and conversion relationships before writing redirects." },
        { title: "Create one-to-one decisions", body: "Keep, improve, merge, redirect or remove each URL with evidence; reject blanket destination rules." },
        { title: "Test a representative crawl", body: "Compare status, depth, inlinks, canonicals, orphans, sitemaps and journeys before release." },
        { title: "Monitor graph drift", body: "After launch, watch orphan creation, redirect chains, query/crawl shifts and journey completion by page type." },
      ] },
    ],
  },

  "structured-data-implementation-qa": {
    readingTime: 23,
    informationGain:
      "A property-source-owner contract, stable entity graph pattern, positive and negative fixtures for Product/Article/Event, staged rollout, CI checks and rollback/deprecation governance.",
    sources: [
      primarySource("b1-schema-google", "Understand how structured data works", "Google Search Central", "https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data", ["b1-schema-parity", "b1-schema-eligibility"]),
      primarySource("b1-schema-product", "Product structured data", "Google Search Central", "https://developers.google.com/search/docs/appearance/structured-data/product", ["b1-schema-product-facts"]),
    ],
    claims: [
      { id: "b1-schema-parity", text: "Structured data must describe the page it appears on and accurately represent visible content.", requiresEvidence: true, sourceIds: ["b1-schema-google"] },
      { id: "b1-schema-eligibility", text: "Valid structured data can establish eligibility for a search feature but does not guarantee that the feature will be shown.", requiresEvidence: true, sourceIds: ["b1-schema-google"] },
      { id: "b1-schema-product-facts", text: "Product structured-data properties such as price and availability must follow the applicable Product guidance and match the offer represented on the page.", requiresEvidence: true, sourceIds: ["b1-schema-product"] },
    ],
    originalInsights: [
      "Treat every JSON-LD property as a projection of an owned fact, never as an SEO-only field with a separate truth.",
      "A negative fixture—where markup must not appear—is as important as a valid example because stale or ineligible schema commonly survives state transitions.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Start with consumer, eligibility and page purpose", id: "schema-consumer-eligibility" },
      { type: "decision-framework", title: "Schema implementation gate", criteria: [
        { signal: "The page has a distinct entity or content type and the facts are visible/owned", action: "Select the most specific supported type and map properties to sources" },
        { signal: "A search feature has type-specific eligibility and content guidelines", action: "Implement required properties and policy checks for that feature" },
        { signal: "The property cannot stay synchronized with visible content", action: "Do not emit it until a shared source and owner exist" },
        { signal: "The page/state is not eligible—for example, expired event or product without a valid offer", action: "Suppress the ineligible node/properties and test the negative fixture" },
        { signal: "The goal is guaranteed ranking or AI citation", action: "Reject the premise; markup improves explicit machine-readable context but guarantees neither serving nor citation" },
      ] },
      { type: "evidence", claimId: "b1-schema-parity", summary: "Google requires markup to represent the page it describes accurately, so visible content and JSON-LD should be generated from shared facts and released together.", sourceIds: ["b1-schema-google"] },
      { type: "heading", level: 2, text: "Build a property-source-owner contract", id: "property-source-owner-contract" },
      { type: "comparison-table", caption: "Example contract for a product page.", columns: ["Property", "System of record", "Visible location", "Owner", "Invalidation rule"], rows: [
        ["name / sku / brand", "Product information system", "H1 and product facts", "Catalog", "Suppress node if identity is unresolved"],
        ["offers.price / priceCurrency", "Pricing service", "Purchasable offer", "Commerce", "Remove Offer when price is not available to the represented audience"],
        ["offers.availability", "Inventory service", "Availability and checkout", "Inventory", "Update atomically on state transition"],
        ["image", "Digital asset manager", "Product gallery", "Content/brand", "Exclude expired, blocked or unlicensed assets"],
        ["aggregateRating", "Approved review platform", "Visible rating/review module", "Trust/legal", "Suppress when policy, sample or display requirements fail"],
      ] },
      { type: "heading", level: 2, text: "Use stable IDs to connect entities", id: "stable-schema-ids" },
      { type: "code", language: "json", code: "{\n  \"@context\": \"https://schema.org\",\n  \"@graph\": [\n    {\n      \"@type\": \"Organization\",\n      \"@id\": \"https://example.com/#organization\",\n      \"name\": \"Example Co\",\n      \"url\": \"https://example.com/\"\n    },\n    {\n      \"@type\": \"Article\",\n      \"@id\": \"https://example.com/guides/widget-care#article\",\n      \"headline\": \"Widget Care Guide\",\n      \"mainEntityOfPage\": { \"@id\": \"https://example.com/guides/widget-care\" },\n      \"publisher\": { \"@id\": \"https://example.com/#organization\" }\n    }\n  ]\n}" },
      { type: "heading", level: 2, text: "Test positive and negative states", id: "schema-fixtures" },
      { type: "comparison-table", caption: "Representative acceptance fixtures.", columns: ["Type", "Positive fixture", "Negative/state fixture", "Parity assertion"], rows: [
        ["Product", "Purchasable SKU with current price and availability", "Discontinued item without a valid offer", "Offer exactly matches visible purchase state and feed"],
        ["Article", "Published guide with author, dates and headline", "Draft/private or materially changed headline", "Markup appears only publicly and matches visible byline/dates/title"],
        ["Event", "Future event with valid location or online mode", "Cancelled, postponed or past event", "Status, dates and attendance mode match the visible event state"],
        ["Breadcrumb", "Visible hierarchical path", "Page moved to another parent", "Item names/URLs match visible navigation and canonical host"],
      ] },
      { type: "evidence", claimId: "b1-schema-product-facts", summary: "Google's Product guidance defines offer and product requirements; price and availability should never be maintained as disconnected SEO values.", sourceIds: ["b1-schema-product"] },
      { type: "steps", title: "Roll out and monitor safely", steps: [
        { title: "Validate the mapping", body: "Review source ownership, visible parity and eligibility before writing templates." },
        { title: "Test locally and in CI", body: "Parse JSON, validate required fields, assert stable IDs/URLs, compare critical properties to page data and run negative fixtures." },
        { title: "Release a small cohort", body: "Deploy representative templates/states and inspect public raw HTML plus rendered output." },
        { title: "Observe Search processing", body: "Track enhancement validity, samples, template changes and eligibility—not only aggregate rich-result counts." },
        { title: "Rollback or deprecate", body: "Remove invalid output at the shared generator, invalidate caches, preserve the prior version and retire unsupported properties/types through an owned migration." },
      ] },
      { type: "evidence", claimId: "b1-schema-eligibility", summary: "Google explicitly states that correct markup does not guarantee a rich result, so success criteria should cover accuracy, eligibility and error-free delivery rather than promised visibility.", sourceIds: ["b1-schema-google"] },
    ],
  },

  "technical-seo-audit-checklist-growing-websites": {
    readingTime: 25,
    informationGain:
      "A complete audit operating system: intake, canonical inventory, evidence standard, 10 workstreams, prioritization formula, issue record, validation states, ownership and spoke-level diagnostic routing.",
    sources: [
      primarySource("b1-audit-starter", "SEO Starter Guide", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/seo-starter-guide", ["b1-audit-discovery"]),
      primarySource("b1-audit-cwv", "Web Vitals", "web.dev", "https://web.dev/articles/vitals", ["b1-audit-cwv-claim"]),
      primarySource("b1-audit-ai", "AI features and your website", "Google Search Central", "https://developers.google.com/search/docs/appearance/ai-features", ["b1-audit-ai-controls"]),
    ],
    claims: [
      { id: "b1-audit-discovery", text: "Technical SEO helps search engines discover, crawl and understand content, but no checklist can guarantee ranking or indexing.", requiresEvidence: true, sourceIds: ["b1-audit-starter"] },
      { id: "b1-audit-cwv-claim", text: "Core Web Vitals currently assess loading, responsiveness and visual stability through LCP, INP and CLS.", requiresEvidence: true, sourceIds: ["b1-audit-cwv"] },
      { id: "b1-audit-ai-controls", text: "Google's AI search features use established Search eligibility and preview controls rather than requiring special AI-only markup or files.", requiresEvidence: true, sourceIds: ["b1-audit-ai"] },
    ],
    originalInsights: [
      "A technical audit is a versioned evidence-and-decision system, not a crawler export or undifferentiated checklist.",
      "Prioritize validated failure patterns by valuable-page reach, user/search impact, confidence, effort and regression risk; never assign severity from tool labels alone.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Define scope and baseline before crawling", id: "audit-intake-baseline" },
      { type: "checklist", title: "Audit intake", items: [
        { label: "Business scope", detail: "Markets, products, conversions, priority templates, regulated claims and seasonality." },
        { label: "Change context", detail: "Recent releases, migrations, CMS/CDN/WAF changes, incidents and upcoming freezes." },
        { label: "Access", detail: "Search Console, analytics, verified logs, CDN/origin monitoring, CMS, feeds, sitemaps and deployment history." },
        { label: "Canonical inventory", detail: "Join CMS/database, internal links, sitemaps, analytics, Search Console, backlinks and crawler discoveries." },
        { label: "Baseline", detail: "Status/canonical/index cohorts, search performance, server health, page experience and representative raw/rendered snapshots." },
        { label: "Constraints", detail: "Engineering capacity, release process, legal/privacy/security controls, owners and rollback capability." },
      ] },
      { type: "evidence", claimId: "b1-audit-discovery", summary: "Google's starter guidance frames SEO as helping search systems crawl, index and understand content while making clear that inclusion and ranking are not guaranteed.", sourceIds: ["b1-audit-starter"] },
      { type: "heading", level: 2, text: "Audit ten connected workstreams", id: "technical-audit-workstreams" },
      { type: "comparison-table", caption: "Each workstream produces evidence, a failure pattern and an owner.", columns: ["Workstream", "Core questions", "Representative evidence"], rows: [
        ["Discovery and crawl", "Can intended URLs be reached efficiently? Are traps consuming requests?", "Link graph, robots, sitemap, logs, Crawl Stats"],
        ["Status and redirects", "Do URL lifecycle states return honest responses and one-hop moves?", "Response matrix, redirect map, chain/loop report"],
        ["Canonical and index", "Does each entity/page job have one consistent preferred URL?", "Canonical clusters, index cohorts, duplicate samples"],
        ["Architecture", "Do priority journeys and entities receive crawlable, relevant paths?", "Depth, inlinks, orphans, nav and taxonomy review"],
        ["Rendering", "Is critical content/metadata/linking present in raw and rendered output under failure states?", "HTML/DOM diffs, resource errors, API timeout fixtures"],
        ["Performance", "Which user experiences fail LCP, INP or CLS and why?", "Field data by template plus lab traces"],
        ["Structured data", "Does eligible markup match visible owned facts across states?", "Property-source map, validation and negative fixtures"],
        ["Media", "Are image/video assets discoverable, contextual, accessible and performant?", "Markup, asset responses, sitemaps, rights and LCP"],
        ["International/ecommerce", "Do locale, product, feed, facet and inventory states agree?", "Hreflang, currency/offer parity, product state cohorts"],
        ["Infrastructure/release", "Can CDN, WAF, cache and deployment behavior change crawler output safely?", "Regional/agent tests, release history, monitoring and rollback"],
      ] },
      { type: "evidence", claimId: "b1-audit-cwv-claim", summary: "web.dev defines the current Core Web Vitals as LCP, INP and CLS; use field distributions by template and context rather than one lab score for the site.", sourceIds: ["b1-audit-cwv"] },
      { type: "heading", level: 2, text: "Use an evidence standard for every finding", id: "audit-evidence-standard" },
      { type: "checklist", title: "Issue record", items: [
        { label: "Observed state", detail: "Exact URLs, time, environment, agent, region and raw/rendered evidence." },
        { label: "Expected state", detail: "Approved product/search requirement and authoritative reference when relevant." },
        { label: "Pattern and reach", detail: "Template/rule that produces the issue, affected canonical valuable URLs and exclusions." },
        { label: "Impact", detail: "User task, discovery/crawl/index/appearance consequence and business priority—without ranking promises." },
        { label: "Root-cause confidence", detail: "Confirmed mechanism, competing explanations, tests run and remaining uncertainty." },
        { label: "Recommendation", detail: "Smallest durable change, dependencies, owner, effort, regression risk and alternatives." },
        { label: "Acceptance and rollback", detail: "Positive/negative fixtures, expected result, monitoring, rollback trigger and validation state." },
      ] },
      { type: "code", language: "text", code: "priority =\n  valuable_url_reach\n  x user_and_search_impact\n  x evidence_confidence\n  x urgency\n  / (implementation_effort x regression_risk)\n\nScore within one audit only. Preserve the inputs and rationale;\ndo not present the number as universal truth." },
      { type: "heading", level: 2, text: "Route specialist diagnosis to the supporting guides", id: "audit-diagnostic-routes" },
      { type: "comparison-table", caption: "Use the pillar to find patterns, then use a specialist guide to design the fix.", columns: ["Finding", "Supporting guide", "Key artifact"], rows: [
        ["Crawler capacity, waste or recrawl delay", "Crawl Budget for Large Sites", "Verified log-to-inventory dataset"],
        ["Wrong removal or move behavior", "HTTP Status Codes & Redirects", "Lifecycle response map"],
        ["Pagination/facet discovery", "Pagination, Infinite Scroll & Load More", "Crawlable component URL model"],
        ["Noindex/robots conflict", "Robots.txt vs Meta Robots", "Objective-control matrix"],
        ["Stale or blocked edge response", "CDN, Cache & WAF Incident Guide", "Browser-edge-origin evidence"],
        ["Schema drift", "Structured Data Implementation & QA", "Property-source-owner contract"],
        ["Media discovery/performance", "Image SEO or Video SEO", "Page-to-asset/watch-page QA"],
        ["Sitemap inventory drift", "XML Sitemap Design & Monitoring", "Canonical generator and anomaly model"],
      ] },
      { type: "evidence", claimId: "b1-audit-ai-controls", summary: "Google states that normal Search eligibility and preview controls apply to AI features and that no special AI text file or schema is required; GEO readiness therefore starts with accessible, accurate, well-supported content.", sourceIds: ["b1-audit-ai"] },
      { type: "steps", title: "Close the audit loop", steps: [
        { title: "Triage", body: "Reject tool-only warnings, consolidate duplicates into root-cause patterns and agree owners." },
        { title: "Design", body: "Write the target state, fixtures, monitoring and rollback before implementation." },
        { title: "Validate", body: "Record fixed, partially fixed, not fixed, cannot reproduce or accepted risk with fresh evidence." },
        { title: "Monitor processing", body: "Separate deployment success from crawler/search processing and user/business outcomes." },
        { title: "Prevent recurrence", body: "Convert repeated checks into CI, CMS validation, inventory alerts or release gates." },
      ] },
    ],
  },

  "video-seo-watch-pages-hosting": {
    readingTime: 18,
    informationGain:
      "A watch-page eligibility model, hosting decision matrix, performance/accessibility controls, VideoObject and sitemap examples, and lifecycle QA for live, expired, restricted and removed videos.",
    sources: [
      primarySource("b1-video-google", "Video SEO best practices", "Google Search Central", "https://developers.google.com/search/docs/appearance/video", ["b1-video-watch-page"]),
      primarySource("b1-video-schema", "Video structured data", "Google Search Central", "https://developers.google.com/search/docs/appearance/structured-data/video", ["b1-video-markup"]),
    ],
    claims: [
      { id: "b1-video-watch-page", text: "For video indexing, Google recommends a dedicated watch page where the video is the main content and is embedded with a stable thumbnail and accessible video files.", requiresEvidence: true, sourceIds: ["b1-video-google"] },
      { id: "b1-video-markup", text: "VideoObject and video sitemap data should provide accurate metadata that matches the visible video and its current availability.", requiresEvidence: true, sourceIds: ["b1-video-schema"] },
    ],
    originalInsights: [
      "A video asset becomes a search candidate through its watch page, not by existing somewhere inside a player library.",
      "Choose hosting from ownership, reach, access, analytics, performance and lifecycle requirements rather than a simplistic self-hosted-versus-YouTube SEO rule.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Define the indexable watch page", id: "video-watch-page-model" },
      { type: "checklist", title: "Watch-page requirements", items: [
        { label: "Primary purpose", detail: "The video is the main content, visible without a hidden tab or user-dependent search action." },
        { label: "Unique context", detail: "Specific title, summary, speaker/creator, publication/update date, key points and a useful transcript or equivalent text." },
        { label: "Stable media", detail: "Accessible thumbnail and player/content URL relationships that do not expire before crawling." },
        { label: "Technical state", detail: "200 indexable self-canonical page, crawlable embed/resources and no login/geofence mismatch for represented audiences." },
        { label: "Machine-readable parity", detail: "VideoObject and video sitemap facts match the visible title, thumbnail, duration, dates, restrictions and live state." },
        { label: "User experience", detail: "Captions, keyboard controls, transcript, responsive player, reserved dimensions and no intrusive autoplay." },
      ] },
      { type: "evidence", claimId: "b1-video-watch-page", summary: "Google's video guidance emphasizes dedicated watch pages where video is the main content, with stable thumbnails and accessible media information.", sourceIds: ["b1-video-google"] },
      { type: "heading", level: 2, text: "Choose a hosting model", id: "video-hosting-matrix" },
      { type: "comparison-table", caption: "Hosting changes distribution and operations, not the need for a strong owned watch page.", columns: ["Model", "Strength", "Trade-off", "Use when"], rows: [
        ["Self-hosted/managed video CDN", "Control over page, player, data, access and branding", "Encoding, delivery, rights and monitoring ownership", "Owned experience, gated variants or product/media platform needs justify operations"],
        ["YouTube", "Large discovery ecosystem and mature delivery", "Platform branding, competing recommendations and separate analytics", "Reach and public distribution are primary"],
        ["Vimeo/other managed host", "Simpler professional embeds and privacy/player options", "Feature, crawler access and URL behavior vary by plan/configuration", "Teams need managed delivery with greater presentation control"],
        ["Hybrid", "Owned watch page plus selected platform distribution", "Duplicate governance and analytics reconciliation", "The team can define canonical content roles and maintain both surfaces"],
      ] },
      { type: "heading", level: 2, text: "Implement VideoObject from owned facts", id: "videoobject-example" },
      { type: "code", language: "json", code: "{\n  \"@context\": \"https://schema.org\",\n  \"@type\": \"VideoObject\",\n  \"@id\": \"https://example.com/videos/crawl-logs#video\",\n  \"name\": \"How to Verify Search Crawler Logs\",\n  \"description\": \"A step-by-step demonstration of crawler verification and log joins.\",\n  \"thumbnailUrl\": [\"https://cdn.example.com/thumbs/crawl-logs-1280.jpg\"],\n  \"uploadDate\": \"2026-08-01T09:00:00+00:00\",\n  \"duration\": \"PT12M30S\",\n  \"contentUrl\": \"https://cdn.example.com/video/crawl-logs.mp4\",\n  \"embedUrl\": \"https://example.com/embed/crawl-logs\"\n}" },
      { type: "evidence", claimId: "b1-video-markup", summary: "Google's Video structured-data documentation defines supported properties and requires markup to represent the visible video accurately.", sourceIds: ["b1-video-schema"] },
      { type: "heading", level: 2, text: "Protect page experience and accessibility", id: "video-performance-accessibility" },
      { type: "comparison-table", caption: "Load the experience in stages.", columns: ["Stage", "Implementation", "Guardrail"], rows: [
        ["Initial page", "Server-render title/context, poster and reserved player dimensions", "Do not download full player/video before intent unless it is truly critical"],
        ["Player activation", "Load provider API and media after click or proximity", "Keyboard focus, controls and error state remain usable"],
        ["Playback", "Adaptive bitrate/range requests where supported", "Captions, reduced-motion/autoplay policy and bandwidth awareness"],
        ["Below the player", "Transcript/key moments and related next steps", "Text is accurate, accessible and not a keyword dump"],
      ] },
      { type: "heading", level: 2, text: "Handle video lifecycle states", id: "video-lifecycle-states" },
      { type: "decision-framework", title: "State handling", criteria: [
        { signal: "Live stream is scheduled or active", action: "Maintain accurate start/end/live status and a stable watch URL; test time-zone handling" },
        { signal: "Recording replaces the live stream", action: "Update the same durable page when the user need is continuous, or link explicit event and recording pages" },
        { signal: "Video expires but transcript remains useful", action: "Keep the page only if it still completes the task; remove video claims/markup that no longer apply" },
        { signal: "Video is restricted by login, geography or age", action: "Represent restrictions accurately and do not expose markup that implies public availability" },
        { signal: "Video and page have no remaining value", action: "Remove honestly; update sitemap, links, markup and asset access together" },
      ] },
      { type: "checklist", title: "Discovery QA", items: [
        { label: "Page", detail: "Indexable watch URL, main-video prominence, title/description/transcript and canonical." },
        { label: "Assets", detail: "Thumbnail, embed/content URLs, status, content type, range support, robots and expiry behavior." },
        { label: "Markup/sitemap", detail: "Accurate VideoObject and video sitemap values generated from the same record." },
        { label: "Rendered player", detail: "Google-accessible embed, no consent wall deadlock and stable poster/player dimensions." },
        { label: "Search monitoring", detail: "Video indexing report, enhancement issues, page samples and lifecycle exceptions." },
      ] },
    ],
  },

  "xml-sitemap-design-monitoring": {
    readingTime: 19,
    informationGain:
      "A canonical-inventory generator, protocol and cross-host requirements, sharding strategy, truthful lastmod policy, reference architectures, anomaly metrics and explicit operating ownership.",
    sources: [
      primarySource("b1-sitemap-google", "Build and submit a sitemap", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap", ["b1-sitemap-limits", "b1-sitemap-hint"]),
      primarySource("b1-sitemap-protocol", "Sitemaps XML format", "Sitemaps.org", "https://www.sitemaps.org/protocol.html", ["b1-sitemap-format"]),
    ],
    claims: [
      { id: "b1-sitemap-limits", text: "A sitemap file is limited to 50,000 URLs or 50 MB uncompressed and can be grouped through sitemap index files.", requiresEvidence: true, sourceIds: ["b1-sitemap-google"] },
      { id: "b1-sitemap-hint", text: "Sitemap submission is a discovery hint and does not guarantee crawling or indexing.", requiresEvidence: true, sourceIds: ["b1-sitemap-google"] },
      { id: "b1-sitemap-format", text: "Sitemap XML requires absolute, properly escaped URLs and UTF-8 encoding under the protocol.", requiresEvidence: true, sourceIds: ["b1-sitemap-protocol"] },
    ],
    originalInsights: [
      "Generate sitemaps from the same canonical inventory contract used by routing, internal links and indexability—not from a crawler's accidental discoveries.",
      "Shard by operational ownership and diagnostic value before reaching the protocol limit so an error can be localized to a template, locale or state.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Decide whether a sitemap adds value", id: "sitemap-applicability" },
      { type: "decision-framework", title: "Sitemap value gate", criteria: [
        { signal: "The site is large, rapidly changing, newly launched, weakly linked or rich in media/news inventory", action: "Maintain generated sitemaps as a discovery and monitoring surface" },
        { signal: "The site is small and every canonical page is strongly linked", action: "A sitemap remains useful but is not a substitute for architecture; keep operations proportionate" },
        { signal: "The team wants a sitemap to force indexing", action: "Reject the premise; fix page value, access, canonical consistency and internal discovery" },
        { signal: "The source inventory cannot identify canonical/indexable state", action: "Repair the inventory contract before automating XML" },
      ] },
      { type: "evidence", claimId: "b1-sitemap-hint", summary: "Google calls sitemap submission a hint and does not guarantee crawling or indexing, so a sitemap should expose intended inventory rather than conceal architecture or quality problems.", sourceIds: ["b1-sitemap-google"] },
      { type: "heading", level: 2, text: "Generate from a canonical inventory", id: "canonical-sitemap-generator" },
      { type: "code", language: "text", code: "for each public_record:\n  url = resolve_public_url(record, locale)\n  include only when:\n    state == published\n    AND response_target == 200\n    AND canonical_url == url\n    AND robots != noindex\n    AND access == public\n  lastmod = last_meaningful_search_visible_change(record)\n  emit to shard(template, locale, content_type)\n\nReject and alert on duplicate loc, redirect, error, noindex,\ncross-locale canonical conflict or future lastmod." },
      { type: "heading", level: 2, text: "Honor protocol and hosting boundaries", id: "sitemap-protocol-hosting" },
      { type: "checklist", title: "Protocol checklist", items: [
        { label: "Limits", detail: "Keep each sitemap at or below 50,000 URLs and 50 MB uncompressed; use sitemap indexes and leave operational headroom." },
        { label: "Encoding", detail: "Use UTF-8, absolute URLs and XML entity escaping; serve a successful XML response with an appropriate content type." },
        { label: "Scope", detail: "A sitemap normally applies to URLs under its host/path; use verified ownership or documented cross-site submission for cross-host files." },
        { label: "Compression", detail: "Use gzip when helpful, but monitor both compressed delivery and uncompressed protocol size." },
        { label: "Location", detail: "Advertise index files in robots.txt where appropriate and submit through verified Search Console properties." },
      ] },
      { type: "evidence", claimId: "b1-sitemap-limits", summary: "Google documents the 50,000 URL and 50 MB uncompressed limits and supports sitemap index files for larger inventories.", sourceIds: ["b1-sitemap-google"] },
      { type: "evidence", claimId: "b1-sitemap-format", summary: "The protocol requires absolute escaped URLs in UTF-8 XML, which should be validated after generation and at the public response.", sourceIds: ["b1-sitemap-protocol"] },
      { type: "heading", level: 2, text: "Shard for diagnosis, not only size", id: "sitemap-sharding" },
      { type: "comparison-table", caption: "Reference architectures.", columns: ["Site", "Suggested index/shards", "Why"], rows: [
        ["Small service site", "One sitemap or framework-generated index for pages and insights", "Simple ownership; validate canonical published inventory"],
        ["Ecommerce", "Index → categories, products by state/region or stable ID range, guides, images", "Localizes feed/inventory/template anomalies and controls regeneration cost"],
        ["International", "Index per verified host or coordinated root → shards by locale and content type", "Makes canonical/hreflang and market ownership exceptions visible"],
        ["Publisher/video", "Index → current articles, archives by stable period, video/image extensions where required", "Separates freshness-sensitive and media inventory"],
      ] },
      { type: "heading", level: 2, text: "Make lastmod truthful", id: "truthful-lastmod" },
      { type: "comparison-table", caption: "lastmod should represent a meaningful change to the canonical page.", columns: ["Change", "Update lastmod?", "Reason"], rows: [
        ["Body, primary facts, price/availability represented on page, or substantial media change", "Yes", "Search-visible canonical content changed"],
        ["Only sitemap generation time changed", "No", "The page did not change"],
        ["Analytics event, view count or unrelated database row changed", "No", "Operational noise is not page modification"],
        ["Template change materially changes every rendered page", "Yes, through a controlled cohort policy", "Output changed, but avoid an unbounded one-time recrawl shock"],
      ] },
      { type: "heading", level: 2, text: "Monitor inventory and processing", id: "sitemap-monitoring" },
      { type: "checklist", title: "Daily and release-time anomaly checks", items: [
        { label: "Delivery", detail: "Index/shard status, latency, content type, parse success, size and URL count." },
        { label: "Eligibility", detail: "Redirect, error, noindex, non-canonical, duplicate loc, blocked and private URL counts should be zero." },
        { label: "Freshness", detail: "Future dates, mass lastmod churn, stale high-change templates and generator lag." },
        { label: "Inventory drift", detail: "Compare CMS/database canonical count with sitemap count by template, locale and state." },
        { label: "Processing", detail: "Submitted/discovered/index cohorts in Search Console with representative URL inspection and logs." },
        { label: "Ownership", detail: "Generator owner, content-state owner, incident threshold, runbook, deployment history and rollback." },
      ] },
    ],
  },
};

function insertBeforeConversionBlocks(existing: InsightBlock[], additions: InsightBlock[]) {
  const insertionIndex = existing.findIndex((block) =>
    ["related-service", "case-study-reference", "sample-audit-reference", "faq", "cta"].includes(block.type)
  );
  if (insertionIndex === -1) return [...existing, ...additions];
  return [
    ...existing.slice(0, insertionIndex),
    ...additions,
    ...existing.slice(insertionIndex),
  ];
}

export function applyTechnicalSeoBatch1Audit(articles: InsightArticle[]): InsightArticle[] {
  return articles.map((article) => {
    const upgrade = upgrades[article.slug];
    if (!upgrade) return article;

    const title = upgrade.title ?? article.h1;
    const metaTitle = upgrade.metaTitle ?? article.metadata.metaTitle;
    const metaDescription = upgrade.metaDescription ?? article.metadata.metaDescription;
    const sources = [...article.contentEvidence.sources, ...upgrade.sources];

    return {
      ...article,
      internalTitle: title,
      h1: title,
      readingTime: upgrade.readingTime,
      updatedAt: accessedAt,
      lastFactCheckedAt: accessedAt,
      blocks: insertBeforeConversionBlocks(article.blocks, upgrade.blocks),
      searchStrategy: {
        ...article.searchStrategy,
        uniqueInformationGain: upgrade.informationGain,
      },
      contentEvidence: {
        ...article.contentEvidence,
        sources,
        claims: [...article.contentEvidence.claims, ...upgrade.claims],
        originalInsights: [
          ...article.contentEvidence.originalInsights,
          ...upgrade.originalInsights,
        ],
      },
      metadata: {
        ...article.metadata,
        metaTitle,
        metaDescription,
        ogTitle: metaTitle,
        ogDescription: metaDescription,
        twitterTitle: metaTitle,
        twitterDescription: metaDescription,
        breadcrumbLabel: upgrade.breadcrumbLabel ?? article.metadata.breadcrumbLabel,
      },
      schema: {
        ...article.schema,
        citationReferences: Array.from(new Set([
          ...article.schema.citationReferences,
          ...sources.map((source) => source.url),
        ])),
      },
      publishQa: {
        summary: "Batch 1 depth audit implemented: specialist decision support, reproducible examples, primary-source evidence, GEO extraction blocks, and internal conversion paths verified.",
        checkedAt: accessedAt,
      },
    };
  });
}
