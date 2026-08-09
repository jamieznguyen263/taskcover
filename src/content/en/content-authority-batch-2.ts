import type {
  InsightArticle,
  InsightBlock,
  InsightClaim,
  InsightSource,
} from "../insights.types";

type ArticleUpgrade = {
  readingTime: number;
  informationGain: string;
  sources: InsightSource[];
  claims: InsightClaim[];
  originalInsights: string[];
  blocks: InsightBlock[];
};

const auditedAt = "2026-08-09";

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
    accessedAt: auditedAt,
    primarySource: true,
    supportsClaimIds: claimIds,
    locale: "global",
  };
}

const upgrades: Record<string, ArticleUpgrade> = {
  "search-intent-analysis": {
    readingTime: 18,
    informationGain:
      "A query-to-page decision system that separates need, task, format, evidence and business fit; includes mixed-intent scoring, SERP sampling, cannibalization rules and an auditable page-decision record.",
    sources: [
      primarySource("b2-intent-helpful", "Creating helpful, reliable, people-first content", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", ["b2-intent-people-first"]),
    ],
    claims: [
      { id: "b2-intent-people-first", text: "Google recommends content made for an intended audience that leaves readers feeling they learned enough to achieve their goal.", requiresEvidence: true, sourceIds: ["b2-intent-helpful"] },
    ],
    originalInsights: [
      "Intent is a page decision, not a permanent keyword label: the same query can contain multiple needs whose relative importance changes by market, device and time.",
      "A query cluster should not become a new URL until its dominant task, evidence requirement and differentiation from existing pages are explicit.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Model intent at five levels", id: "five-level-intent-model" },
      { type: "comparison-table", caption: "A useful intent model goes beyond informational, commercial and transactional labels.", columns: ["Level", "Question", "Evidence"], rows: [
        ["Need", "What uncertainty or problem triggered the search?", "Query wording, modifiers, related searches and customer language"],
        ["Task", "What must the searcher do nextâ€”learn, compare, calculate, configure, buy or troubleshoot?", "Result-page actions, site-search refinements and journey data"],
        ["Object", "Which entity, product, category, person, place or concept is being evaluated?", "Entity relationships and required attributes"],
        ["Format", "Which representation best completes the task?", "Current SERP composition, media needs and interaction requirements"],
        ["Evidence", "What proof would make the answer trustworthy?", "Primary sources, examples, product data, methodology and expert review"],
      ] },
      { type: "evidence", claimId: "b2-intent-people-first", summary: "Google's people-first questions focus on whether content serves an intended audience and helps that audience achieve its goal; keyword classification alone does not meet that standard.", sourceIds: ["b2-intent-helpful"] },
      { type: "heading", level: 2, text: "Sample the SERP without copying it", id: "serp-sampling-protocol" },
      { type: "checklist", title: "SERP evidence record", items: [
        { label: "Context", detail: "Query, market, language, device, date, personalization state and result type sampled." },
        { label: "Result roles", detail: "Classify the top results by task and formatâ€”not merely domain or title." },
        { label: "Shared requirements", detail: "Identify facts, examples, comparison dimensions and media that appear necessary to complete the task." },
        { label: "Divergence", detail: "Record credible alternative interpretations and under-served sub-tasks instead of forcing one label." },
        { label: "Volatility", detail: "Repeat high-stakes or seasonal samples; one snapshot is evidence of current interpretation, not a permanent rule." },
      ] },
      { type: "heading", level: 2, text: "Resolve mixed intent", id: "mixed-intent-resolution" },
      { type: "decision-framework", title: "One page, section, or separate URL?", criteria: [
        { signal: "Needs share the same audience, entity, evidence and natural next step", action: "Use one page with clearly ordered sections" },
        { signal: "A secondary need is necessary but subordinate", action: "Answer it concisely in a section and link to deeper support" },
        { signal: "Needs require different proof, format, owner or conversion path", action: "Use separate pages with distinct jobs and internal relationships" },
        { signal: "An existing page already satisfies the task", action: "Improve or consolidate rather than creating a competing URL" },
        { signal: "SERP and customer evidence conflict", action: "Run a bounded test and keep the decision explicitly provisional" },
      ] },
      { type: "code", language: "text", code: "page_fit =\n  task_similarity\n  x audience_overlap\n  x evidence_overlap\n  x journey_continuity\n  - cannibalization_risk\n\nUse a documented 1â€“5 rubric. The score supports judgment;\nit does not replace a written page job and exclusion list." },
      { type: "checklist", title: "Page-decision record", items: [
        { label: "Primary job", detail: "One sentence describing the decision or task the page owns." },
        { label: "Included queries", detail: "Representative cluster and why those queries share a task." },
        { label: "Excluded queries", detail: "Nearby clusters owned by another page or intentionally unsupported." },
        { label: "Required evidence", detail: "Sources, firsthand examples, product facts, comparison fields or expert review." },
        { label: "Page format", detail: "Guide, category, comparison, calculator, documentation, landing page or hybridâ€”with rationale." },
        { label: "Validation", detail: "SERP sample, customer evidence, internal overlap check, success measure, owner and review trigger." },
      ] },
      { type: "callout", title: "Worked hypothetical: one query, two page jobs", body: "The cluster around â€˜customer support automationâ€™ mixes category education and vendor evaluation. Existing documentation already explains setup, while buyers need a solution page that compares supported channels, control, integrations and proof. The decision record assigns evaluation to the solution page, links implementation questions to docs and excludes generic â€˜what isâ€™ terms already owned by the guide. This is a method example, not a ranking claim.", tone: "blue" },
    ],
  },

  "content-governance-workflow": {
    readingTime: 19,
    informationGain:
      "A risk-tiered content operating model with RACI ownership, state transitions, evidence artifacts, service-level expectations, exception handling and maintenance metrics from idea through retirement.",
    sources: [
      primarySource("b2-governance-helpful", "Creating helpful, reliable, people-first content", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", ["b2-governance-accountability"]),
    ],
    claims: [
      { id: "b2-governance-accountability", text: "Google encourages clear authorship, sourcing, expertise and review signals where readers would expect them.", requiresEvidence: true, sourceIds: ["b2-governance-helpful"] },
    ],
    originalInsights: [
      "Governance should become stricter as claim harm, change frequency and distribution scale rise; one editorial workflow is unsafe for every content type.",
      "Every published claim set needs an evidence artifact and a retirement trigger, not only a publication date.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Tier governance by content risk", id: "content-risk-tiers" },
      { type: "comparison-table", caption: "Review depth follows potential harm and operational complexity.", columns: ["Tier", "Examples", "Required review", "Refresh trigger"], rows: [
        ["Tier 1: low risk", "Definitions, non-sensitive how-to content", "Editor plus source/link QA", "Source change, material feedback or scheduled review"],
        ["Tier 2: commercial", "Service, product, comparison and pricing-adjacent guidance", "Product/subject owner plus editor and claim evidence", "Offer, feature, market or competitor change"],
        ["Tier 3: high consequence", "Health, finance, legal, safety or regulated claims", "Qualified reviewer, compliance/legal routing and stricter source hierarchy", "Primary guidance change or short fixed review cycle"],
        ["Tier 4: scaled/dynamic", "Programmatic, feeds, templates and user-generated content", "Data contract, automated gate, sampled human review and rollback", "Input drift, anomaly threshold or template release"],
      ] },
      { type: "evidence", claimId: "b2-governance-accountability", summary: "Google's self-assessment questions explicitly ask whether authorship, sourcing and expert review are clear where readers would expect them, supporting transparent accountability rather than decorative bylines.", sourceIds: ["b2-governance-helpful"] },
      { type: "heading", level: 2, text: "Define roles with decision rights", id: "content-raci" },
      { type: "comparison-table", caption: "A person may hold multiple roles, but each decision still needs one accountable owner.", columns: ["Role", "Accountable for", "Cannot approve alone"], rows: [
        ["Requester/strategist", "Audience, page job, business need and success measure", "Claims outside their expertise"],
        ["Author", "Draft, reasoning, source capture and disclosure", "Their own high-risk factual accuracy"],
        ["Subject reviewer", "Domain accuracy, limits and unsafe interpretations", "Brand voice or publication mechanics unless assigned"],
        ["Editor", "Clarity, structure, consistency and editorial standard", "Unverified specialist claims"],
        ["SEO/distribution owner", "Search intent, internal relationships, metadata and launch monitoring", "Changing facts only to match keywords"],
        ["Publisher/system owner", "Permissions, state transition, release evidence and rollback", "Waiving required review without recorded exception authority"],
      ] },
      { type: "heading", level: 2, text: "Use explicit lifecycle states", id: "content-lifecycle-states" },
      { type: "steps", title: "From proposal to retirement", steps: [
        { title: "Proposed", body: "Page job, owner, audience, risk tier, evidence plan and expected maintenance cost are defined." },
        { title: "Drafted", body: "Claims link to captured sources; unknowns, assumptions, AI assistance and original contributions are disclosed internally." },
        { title: "Reviewed", body: "Required editor, subject and compliance decisions are recorded with requested changes resolved." },
        { title: "Approved and released", body: "Metadata, schema, links, rendering and analytics pass acceptance tests; version and rollback are preserved." },
        { title: "Monitored and refreshed", body: "Feedback, search behavior, source changes, product facts and content drift trigger owned updates." },
        { title: "Consolidated, archived or retired", body: "The final URL, redirect/status, internal links, sitemap and historical record follow an explicit disposition." },
      ] },
      { type: "checklist", title: "Evidence bundle per content item", items: [
        { label: "Decision brief", detail: "Page job, audience, exclusions, risk tier, expected value and owner." },
        { label: "Claim ledger", detail: "Material claim, source, source date, interpretation, reviewer and confidence." },
        { label: "Contribution record", detail: "Firsthand data, example, method, expert input and limitations." },
        { label: "Review log", detail: "Requested changes, approvals, exceptions and expiry dates." },
        { label: "Release proof", detail: "Public URL, version, rendered output, metadata/schema/link checks and rollback." },
        { label: "Maintenance plan", detail: "Refresh signals, SLA, monitoring metric, owner and retirement rule." },
      ] },
      { type: "comparison-table", caption: "Operating metrics expose workflow quality without rewarding output volume alone.", columns: ["Metric", "Definition", "Diagnostic use"], rows: [
        ["Review-cycle time", "Draft ready to approved, segmented by risk tier", "Find bottlenecks without bypassing necessary review"],
        ["Evidence completeness", "Material claims with valid owned sources", "Detect citation debt before publication"],
        ["Exception age", "Open waivers beyond agreed expiry", "Escalate accepted risks that became permanent"],
        ["Refresh compliance", "Due items reviewed on time by tier", "Measure maintenance capacity"],
        ["Rework/incident rate", "Material corrections or rollbacks after release", "Improve upstream briefing and review"],
      ] },
    ],
  },

  "editorial-fact-checking-sources": {
    readingTime: 19,
    informationGain:
      "A claim-level fact-checking protocol with source hierarchy, corroboration rules, quotation and date checks, conflict resolution, AI-assisted verification boundaries and a reusable claim ledger.",
    sources: [
      primarySource("b2-fact-helpful", "Creating helpful, reliable, people-first content", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", ["b2-fact-sourcing"]),
    ],
    claims: [
      { id: "b2-fact-sourcing", text: "Google's people-first guidance asks whether content presents information in a way that makes readers want to trust it, including clear sourcing and evidence of expertise.", requiresEvidence: true, sourceIds: ["b2-fact-helpful"] },
    ],
    originalInsights: [
      "Fact-check at claim level: a credible domain does not make every sentence, inference or date on a page correct.",
      "AI can help surface claims and locate candidate sources, but a human owner must open the source, verify scope and record the final interpretation.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Classify the claim before choosing evidence", id: "claim-classification" },
      { type: "comparison-table", caption: "Different claim types need different proof.", columns: ["Claim type", "Preferred evidence", "Common failure"], rows: [
        ["Definition or standard", "Current standard, regulator or specification owner", "Citing a blog that paraphrases an outdated version"],
        ["Product/company fact", "Owned system of record plus public page where appropriate", "Marketing copy conflicts with documentation or pricing"],
        ["Statistic", "Original dataset/report and methodology", "Quoting a secondary summary without denominator or field dates"],
        ["Causal claim", "Appropriate research design and limitations", "Turning correlation, before/after movement or anecdote into causation"],
        ["Expert judgment", "Named qualified expert with reasoning and scope", "Presenting opinion as universal fact"],
        ["Current event/change", "Primary announcement or authoritative live record", "Using publication date as event date or missing later correction"],
      ] },
      { type: "evidence", claimId: "b2-fact-sourcing", summary: "Google connects reader trust to clear sourcing and demonstrable expertise; a sources list is useful only when each material claim is actually supported by the linked evidence.", sourceIds: ["b2-fact-helpful"] },
      { type: "heading", level: 2, text: "Apply a source hierarchy without using it mechanically", id: "source-hierarchy" },
      { type: "numbered-list", items: [
        "Prefer the original law, standard, dataset, research paper, filing, product documentation or direct record for factual scope.",
        "Use an authoritative synthesis when the original is inaccessible or interpretation genuinely requires subject expertise; name that limitation.",
        "Use reputable reporting for events and independent context, then distinguish what the reporter observed from what a source claimed.",
        "Use practitioner examples for methods and trade-offs, not as proof that the same result will occur elsewhere.",
        "Treat search snippets, AI answers, social posts and unattributed summaries as discovery leads until their underlying source is verified.",
      ] },
      { type: "heading", level: 2, text: "Run the claim verification protocol", id: "claim-verification-protocol" },
      { type: "steps", title: "Seven checks", steps: [
        { title: "Extract", body: "List every material factual, numerical, comparative, causal and credential claim; do not check only sentences with existing links." },
        { title: "Open", body: "Access the original source and preserve title, publisher, URL, version, publication/update date and access date." },
        { title: "Match", body: "Confirm the source supports the exact wording, population, geography, time period, unit and degree of certainty." },
        { title: "Trace", body: "Follow citations to the underlying dataset or study when a source merely repeats another claim." },
        { title: "Corroborate", body: "For high-consequence, disputed or surprising claims, seek independent evidence or reduce the claim to what is established." },
        { title: "Challenge", body: "Search for corrections, retractions, later versions, conflicts of interest and plausible alternative explanations." },
        { title: "Record", body: "Store the approved wording, source excerpt location, interpretation, limitations, reviewer and refresh trigger." },
      ] },
      { type: "checklist", title: "Claim ledger fields", items: [
        { label: "Claim ID and approved text", detail: "Stable reference and the exact wording allowed in publication." },
        { label: "Risk and type", detail: "Low/commercial/high-consequence plus definition, fact, statistic, causal or judgment." },
        { label: "Evidence", detail: "Primary source, pinpoint location, publication/version dates and access date." },
        { label: "Interpretation", detail: "How the evidence supports the claim and what it does not establish." },
        { label: "Corroboration/conflict", detail: "Independent source, contradiction, correction or reason one source is sufficient." },
        { label: "Ownership", detail: "Fact checker, subject reviewer, approval date and refresh/expiry trigger." },
      ] },
      { type: "callout", title: "AI-assisted fact-checking boundary", body: "An AI system may identify candidate claims, propose search queries or summarize a source for triage. It must not be the final evidence record: open the cited material, check the relevant passage and methodology, and assume URLs, quotations and statistics may be fabricated or misread until verified.", tone: "amber" },
    ],
  },

  "author-reviewer-byline-governance": {
    readingTime: 18,
    informationGain:
      "A risk-based authorship and review model that distinguishes contribution from accountability, specifies profile evidence and schema parity, prevents honorary/fake reviewers and handles employment or identity changes.",
    sources: [
      primarySource("b2-byline-helpful", "Creating helpful, reliable, people-first content", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", ["b2-byline-clarity"]),
    ],
    claims: [
      { id: "b2-byline-clarity", text: "Google recommends accurate bylines that lead to information about the author and their relevant background where readers would expect authorship information.", requiresEvidence: true, sourceIds: ["b2-byline-helpful"] },
    ],
    originalInsights: [
      "A byline is an accountability record, not a ranking decoration; credit only people who made the stated contribution and approved the published version.",
      "Reviewer requirements should be triggered by claim risk and reviewer competence, not attached uniformly to manufacture authority.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Separate contribution roles", id: "contribution-roles" },
      { type: "comparison-table", caption: "Use labels readers can interpret accurately.", columns: ["Role", "Minimum contribution", "Required record"], rows: [
        ["Author", "Creates the argument, synthesis or substantial draft and resolves editorial questions", "Contribution scope, source record and approval of final version"],
        ["Co-author", "Makes a substantial intellectual contribution to the published work", "Distinct contribution and shared final approval"],
        ["Subject reviewer", "Checks domain accuracy, limitations and potentially harmful interpretation", "Qualifications relevant to this topic, review date and decision log"],
        ["Fact checker", "Verifies material claims against sources without necessarily judging domain practice", "Claim ledger and unresolved conflicts"],
        ["Editor", "Owns clarity, structure, standards and publication readiness", "Editorial changes and approval state"],
        ["Contributor/interviewee", "Provides bounded quotes, data or firsthand input", "Consent, wording/context approval when promised and disclosure"],
      ] },
      { type: "evidence", claimId: "b2-byline-clarity", summary: "Google's guidance asks whether expected bylines are accurate and lead to author background, which supports truthful contributor identity rather than generic team names or honorary reviewers.", sourceIds: ["b2-byline-helpful"] },
      { type: "heading", level: 2, text: "Trigger review by risk", id: "reviewer-trigger-matrix" },
      { type: "decision-framework", title: "Who must review?", criteria: [
        { signal: "Low-risk definition or process content", action: "Editorial and source review may be sufficient" },
        { signal: "Product, pricing or company claims", action: "Require the accountable product/business fact owner" },
        { signal: "Health, legal, financial, safety or regulated guidance", action: "Require a qualified practitioner/compliance owner within the exact scope" },
        { signal: "Original research or statistics", action: "Require methodology/data review in addition to editorial fact-checking" },
        { signal: "No qualified reviewer is available", action: "Reduce scope, delay publication or clearly frame the content as non-expert; never invent a review credit" },
      ] },
      { type: "checklist", title: "Public contributor profile", items: [
        { label: "Identity", detail: "Real name, role, organization relationship and stable profile URL." },
        { label: "Relevant background", detail: "Specific experience, education, certification or work that supports the covered topicsâ€”without inflated claims." },
        { label: "Scope", detail: "Topics the person authors or reviews and boundaries they do not cover." },
        { label: "Evidence", detail: "Selected attributable work, official profiles or registrations where useful and permitted." },
        { label: "Disclosures", detail: "Employment, commercial relationships, conflicts and editorial policy link." },
        { label: "Lifecycle", detail: "Current/previous status, last reviewed date, profile owner and handling after departure or name change." },
      ] },
      { type: "heading", level: 2, text: "Keep visible credits and schema consistent", id: "byline-schema-parity" },
      { type: "checklist", title: "Publication acceptance", items: [
        { label: "Visible byline", detail: "Role label, linked profile and contribution are understandable without reading source code." },
        { label: "Dates", detail: "Published, materially updated and reviewed dates reflect real events rather than cosmetic refreshes." },
        { label: "Article schema", detail: "Author/publisher entities and URLs match visible credits; do not emit a reviewer property unsupported by the vocabulary/consumer." },
        { label: "Profile entity", detail: "Name, role, organization and sameAs references are stable and non-contradictory." },
        { label: "Approval", detail: "Every credited person approved the final relevant contribution and any public credential wording." },
      ] },
      { type: "callout", title: "Prohibited pattern: honorary review", body: "Do not place a qualified person's name on dozens of pages they did not review, backdate a review, or imply a credential outside its scope. If a person leaves, preserve truthful historical authorship where appropriate, update their relationship and redirect profile URLs only to an accurate successor recordâ€”not to a different person's identity.", tone: "amber" },
    ],
  },

  "programmatic-seo-publish-gate": {
    readingTime: 20,
    informationGain:
      "A page-set viability test, source-field contract, rendered quality gate, similarity and empty-state controls, cohort release design, kill criteria and monitoring that treats programmatic SEO as a governed product system.",
    sources: [
      primarySource("b2-pseo-spam", "Spam policies for Google web search", "Google Search Central", "https://developers.google.com/search/docs/essentials/spam-policies", ["b2-pseo-scaled-abuse"]),
      primarySource("b2-pseo-helpful", "Creating helpful, reliable, people-first content", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", ["b2-pseo-value"]),
    ],
    claims: [
      { id: "b2-pseo-scaled-abuse", text: "Google defines scaled content abuse around generating many pages primarily to manipulate rankings, regardless of whether automation, humans or both created them.", requiresEvidence: true, sourceIds: ["b2-pseo-spam"] },
      { id: "b2-pseo-value", text: "Scale does not replace the requirement to serve an intended audience with useful, trustworthy content.", requiresEvidence: true, sourceIds: ["b2-pseo-helpful"] },
    ],
    originalInsights: [
      "Approve a page set only when the underlying data creates decision value that cannot be delivered better by a filter, table, tool or smaller curated set.",
      "Gate rendered pages and negative statesâ€”not template codeâ€”because missing inputs, collisions and stale data create the real scaled risk.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Pass the page-set viability test", id: "page-set-viability" },
      { type: "decision-framework", title: "Should this page set exist?", criteria: [
        { signal: "Each combination represents a distinct durable task and has reliable first-party or licensed data", action: "Proceed to a bounded prototype and define the source contract" },
        { signal: "Pages differ mainly by a location/product token while advice stays generic", action: "Consolidate into a useful hub, filter or smaller curated set" },
        { signal: "The answer can be generated interactively and users do not need an indexable persistent page", action: "Build a tool or search/filter experience instead" },
        { signal: "Inputs are sparse, volatile, restricted or unowned", action: "Do not publish until coverage, rights, freshness and failure behavior are governed" },
        { signal: "The only business case is estimated search volume", action: "Reject the set until user value, differentiation and maintenance economics are demonstrated" },
      ] },
      { type: "evidence", claimId: "b2-pseo-scaled-abuse", summary: "Google's policy focuses on purpose and value across scaled pages, not on whether the production method is AI, automation or human labor.", sourceIds: ["b2-pseo-spam"] },
      { type: "heading", level: 2, text: "Define the source-field contract", id: "programmatic-source-contract" },
      { type: "comparison-table", caption: "Every variable field needs a failure rule before page generation.", columns: ["Field", "Source/owner", "Quality rule", "Missing/stale behavior"], rows: [
        ["Entity identity", "Canonical product/location/entity registry", "Stable ID, name and relationship", "Suppress page on unresolved collision"],
        ["Decision data", "Owned or licensed operational dataset", "Minimum coverage and update timestamp", "Fallback only when still useful; otherwise no publish"],
        ["Narrative explanation", "Reviewed rules plus bounded editorial input", "Explains why differences matter", "Never fill with generic paraphrase"],
        ["Evidence/provenance", "Source registry", "Source URL/version and permitted use", "Hold page when a material claim loses support"],
        ["Commercial state", "Product/market system", "Offer, eligibility and CTA match reality", "Remove misleading conversion path"],
      ] },
      { type: "heading", level: 2, text: "Gate the rendered page", id: "rendered-publish-gate" },
      { type: "checklist", title: "Blocking checks", items: [
        { label: "Distinct job", detail: "Page purpose and query cluster do not duplicate an existing canonical page." },
        { label: "Data completeness", detail: "Required fields meet coverage thresholds; no placeholder, null or internally contradictory values." },
        { label: "Information gain", detail: "Decision data and explanation differ materially from sibling pages, not only names and numbers." },
        { label: "Rendered quality", detail: "Public raw/rendered output contains complete content, links, metadata and structured facts." },
        { label: "Similarity", detail: "Template and semantic similarity are reviewed by cohort; high similarity triggers consolidation, not automatic rewriting." },
        { label: "Lifecycle", detail: "No-data, stale, removed, duplicate and merged entity states have explicit status/canonical/sitemap behavior." },
        { label: "Rights and safety", detail: "Data license, privacy, sensitive categories and claim review pass before publication." },
      ] },
      { type: "evidence", claimId: "b2-pseo-value", summary: "Google's people-first guidance provides the same audience, trust and task-completion standard for scaled pages as for manually produced content.", sourceIds: ["b2-pseo-helpful"] },
      { type: "steps", title: "Release by evidence, not by URL count", steps: [
        { title: "Prototype", body: "Build representative best, median, sparse, duplicate and failure fixtures; review them with product, editorial and SEO owners." },
        { title: "Canary", body: "Publish a bounded cohort with a comparable holdout; record generator version and exact inventory." },
        { title: "Observe", body: "Monitor crawl, canonical/index cohorts, user task completion, data exceptions, complaints and maintenance cost." },
        { title: "Expand", body: "Scale only when quality and task guardrails hold across weak as well as strong records." },
        { title: "Stop or retract", body: "Trigger the kill plan when stale/error rates, thin cohorts, policy risk or maintenance economics cross predefined limits." },
      ] },
      { type: "callout", title: "Worked hypothetical: 20,000 integration pairs", body: "A SaaS team proposes every product-to-product integration pair. Only 640 pairs have verified compatibility data and a distinct setup path. The publish gate releases those 640 in cohorts, routes unsupported combinations to a tool, and suppresses empty pairs. This is more defensible than manufacturing generic copy for all 20,000 URLs.", tone: "blue" },
    ],
  },

  "glossary-reference-hub-strategy": {
    readingTime: 18,
    informationGain:
      "A term-URL decision model, definition template, entity and synonym governance, alphabetical/topic hub architecture, cannibalization controls and maintenance metrics for reference systems rather than thin definition pages.",
    sources: [
      primarySource("b2-glossary-links", "Link best practices for Google", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/links-crawlable", ["b2-glossary-crawlable"]),
      primarySource("b2-glossary-helpful", "Creating helpful, reliable, people-first content", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", ["b2-glossary-value"]),
    ],
    claims: [
      { id: "b2-glossary-crawlable", text: "Standard anchor links with descriptive context help users and Google understand relationships among glossary, hub and deeper pages.", requiresEvidence: true, sourceIds: ["b2-glossary-links"] },
      { id: "b2-glossary-value", text: "A definition page should provide substantial value beyond a generic summary produced mainly for search traffic.", requiresEvidence: true, sourceIds: ["b2-glossary-helpful"] },
    ],
    originalInsights: [
      "A term deserves a URL only when it owns a durable user task and can add domain-specific explanation, examples, boundaries or relationships beyond a dictionary definition.",
      "The glossary is an entity and terminology governance system: preferred labels, synonyms and deprecated terms should stay consistent across content, product and schema.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Decide whether the term deserves a URL", id: "term-url-decision" },
      { type: "decision-framework", title: "Term disposition", criteria: [
        { signal: "The definition is short, unambiguous and useful only in context", action: "Keep it inline or in the glossary hub" },
        { signal: "The term needs domain-specific examples, boundaries, calculations, misconceptions or related decisions", action: "Create a dedicated reference page" },
        { signal: "The query is really asking how to do, compare or buy", action: "Route to the appropriate guide, comparison or commercial page rather than forcing a definition URL" },
        { signal: "Two terms are true synonyms for the same user need", action: "Choose one canonical page and expose synonyms on it" },
        { signal: "A term is deprecated or ambiguous", action: "Explain the preferred replacement or split distinct meanings with clear entity context" },
      ] },
      { type: "evidence", claimId: "b2-glossary-value", summary: "Google's people-first questions challenge content that merely summarizes others without adding value; standalone definitions need a real task and contribution.", sourceIds: ["b2-glossary-helpful"] },
      { type: "heading", level: 2, text: "Use a reference-page contract", id: "reference-page-contract" },
      { type: "checklist", title: "Definition page fields", items: [
        { label: "Direct definition", detail: "One concise, qualified answer that can stand alone and avoids circular wording." },
        { label: "Scope and boundaries", detail: "What the term includes, excludes and is commonly confused with." },
        { label: "Domain example", detail: "A concrete example, calculation, diagram or decision in the site's area of expertise." },
        { label: "Why it matters", detail: "The real decision or outcome affected by the conceptâ€”without invented ranking impact." },
        { label: "Relationships", detail: "Broader, narrower, related, synonym and deprecated terms plus deeper task pages." },
        { label: "Evidence", detail: "Primary standard, documentation, research or accountable internal definition where relevant." },
        { label: "Ownership", detail: "Subject owner, last substantive review, terminology/version trigger and change log." },
      ] },
      { type: "heading", level: 2, text: "Architect the reference system", id: "glossary-architecture" },
      { type: "comparison-table", caption: "Combine browsing and topic relationships.", columns: ["Layer", "Purpose", "Link behavior"], rows: [
        ["Alphabetical index", "Fast known-term lookup", "Crawlable anchors to canonical term pages or in-page definitions"],
        ["Topic hub", "Understand a domain and its sub-concepts", "Curated learning sequence with contextual descriptions"],
        ["Term page", "Resolve one concept and its boundaries", "Links up to topic hub and outward to related decisions"],
        ["Guides/products/docs", "Complete tasks beyond definition", "Contextual links use the term naturally and point back only when clarification helps"],
      ] },
      { type: "evidence", claimId: "b2-glossary-crawlable", summary: "Google recommends crawlable anchors and descriptive anchor text, making semantic relationships more robust than JavaScript-only term explorers or generic â€˜learn moreâ€™ links.", sourceIds: ["b2-glossary-links"] },
      { type: "checklist", title: "Cannibalization and quality QA", items: [
        { label: "Distinct job", detail: "Term page does not duplicate a guide, service, feature or category page." },
        { label: "Canonical synonym", detail: "Spelling variants and synonyms resolve to one owned definition unless meanings differ." },
        { label: "No orphan definitions", detail: "Every page belongs to an alphabetical and topic context with crawlable links." },
        { label: "Useful depth", detail: "Definitions add examples, boundaries and evidence instead of padded generic prose." },
        { label: "Maintenance", detail: "Track source/version changes, zero-use terms, conflicting definitions and broken relationships." },
      ] },
    ],
  },

  "expert-commentary-system": {
    readingTime: 18,
    informationGain:
      "A newsroom-ready expert-response operating system with eligibility matrix, intake and conflict checks, evidence-backed quote construction, approval SLAs, reusable expert records and outcome learning without promised coverage.",
    sources: [
      primarySource("b2-expert-linkspam", "Spam policies for Google web search", "Google Search Central", "https://developers.google.com/search/docs/essentials/spam-policies", ["b2-expert-earned"]),
    ],
    claims: [
      { id: "b2-expert-earned", text: "Links or coverage exchanged for payment, products or other compensation require appropriate qualification and must not be represented as independent editorial endorsement.", requiresEvidence: true, sourceIds: ["b2-expert-linkspam"] },
    ],
    originalInsights: [
      "Speed comes from pre-approved expertise boundaries, evidence assets and decision rightsâ€”not from drafting opinions before finding a qualified source.",
      "A useful quote gives a clear answer, reasoning, evidence or firsthand constraint, and permission context that a journalist can verify quickly.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Build the expert eligibility matrix", id: "expert-eligibility-matrix" },
      { type: "comparison-table", caption: "Pre-qualify expertise before a deadline arrives.", columns: ["Field", "What to record", "Disqualifier"], rows: [
        ["Topic scope", "Specific subjects and decisions the person can address", "Job title alone with no relevant practice or evidence"],
        ["Experience", "Firsthand role, projects, populations and dates that can be attributed", "Confidential or unverifiable experience presented as proof"],
        ["Credentials", "Current credential, issuer, jurisdiction and scope when material", "Expired, unrelated or inflated credential"],
        ["Evidence assets", "Owned data, examples, methodology, primary sources and permitted anecdotes", "Claims that cannot be supported or disclosed"],
        ["Conflicts", "Employer, client, investment, affiliate and campaign relationships", "Undisclosed material conflict"],
        ["Availability", "Response windows, channel, backup and approval rights", "Cannot approve wording by deadline"],
      ] },
      { type: "heading", level: 2, text: "Triage the request", id: "expert-request-triage" },
      { type: "decision-framework", title: "Respond, redirect or decline", criteria: [
        { signal: "Question is inside the expert's scope and deadline permits verification", action: "Accept with named response and approval owner" },
        { signal: "A better-qualified source exists", action: "Redirect promptly without forcing the current spokesperson" },
        { signal: "Request seeks confidential data, unsupported prediction or legal/medical advice outside scope", action: "Decline or narrow the answer" },
        { signal: "Outlet or request identity cannot be verified", action: "Verify independently before sharing information or files" },
        { signal: "Placement requires payment, link or hidden commercial condition", action: "Treat as sponsored/commercial, disclose and qualify links; do not call it earned coverage" },
      ] },
      { type: "evidence", claimId: "b2-expert-earned", summary: "Google's link-spam policy covers compensated links, reinforcing the operational distinction between independent editorial commentary and sponsored placement.", sourceIds: ["b2-expert-linkspam"] },
      { type: "heading", level: 2, text: "Use the answer-reason-evidence-limit structure", id: "quote-structure" },
      { type: "steps", title: "Construct a quotable response", steps: [
        { title: "Answer", body: "Lead with one direct position that addresses the actual question rather than introducing the company." },
        { title: "Reason", body: "Explain the mechanism or trade-off in plain language; avoid slogans and absolute predictions." },
        { title: "Evidence", body: "Add one verifiable firsthand example, owned-data point with method, or primary source." },
        { title: "Limit", body: "State the boundary, exception or uncertainty a responsible reader needs." },
        { title: "Attribution pack", body: "Provide accurate name, role, organization, relevant bio, source links, contact and disclosure." },
      ] },
      { type: "checklist", title: "Rapid-response record", items: [
        { label: "Request", detail: "Outlet, journalist, verified contact, topic, exact question, deadline, intended use and link/embargo terms." },
        { label: "Expert match", detail: "Scope rationale, availability, conflicts and backup." },
        { label: "Evidence", detail: "Approved sources/data, methodology, permissions and prohibited confidential details." },
        { label: "Approvals", detail: "Expert, communications and legal/compliance decisions with timestamps." },
        { label: "Outcome", detail: "Used, edited, declined or unpublished; accuracy/link/attribution checks and correction needs." },
        { label: "Learning", detail: "Question patterns, response time, reusable evidence gaps and relationship notes." },
      ] },
      { type: "callout", title: "No coverage guarantee", body: "A fast, accurate response increases usefulness to a journalist but does not guarantee inclusion, wording, a followed link or future citation. Measure response quality and relationship learning separately from publication outcomes.", tone: "amber" },
    ],
  },

  "journalist-outreach-pitching": {
    readingTime: 19,
    informationGain:
      "A relevance-first outreach system with story gate, journalist research record, pitch anatomy, evidence-room checklist, restrained follow-up policy, suppression/privacy governance and outcome taxonomy.",
    sources: [
      primarySource("b2-pitch-linkspam", "Spam policies for Google web search", "Google Search Central", "https://developers.google.com/search/docs/essentials/spam-policies", ["b2-pitch-editorial"]),
    ],
    claims: [
      { id: "b2-pitch-editorial", text: "Paid or otherwise compensated placements and links should not be represented as independent earned editorial links.", requiresEvidence: true, sourceIds: ["b2-pitch-linkspam"] },
    ],
    originalInsights: [
      "The pitch is a compact editorial handoff: a journalist should be able to verify the claim, see the audience relevance and understand available assets without a discovery call.",
      "List quality is measured by beat and story fit, not contact volume; suppression and no-contact preferences are part of relationship quality.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Pass the story gate before building a list", id: "journalist-story-gate" },
      { type: "decision-framework", title: "Is this pitchable?", criteria: [
        { signal: "There is a timely change, original verified data, accountable expert or concrete consequence for the outlet's audience", action: "Define the headline claim, evidence pack and relevant beats" },
        { signal: "The idea is only a product announcement with no audience consequence", action: "Use owned channels or develop a real angle; do not disguise promotion as news" },
        { signal: "The headline depends on a weak sample, hidden methodology or exaggerated causal claim", action: "Repair the evidence or reduce the claim before outreach" },
        { signal: "The requested link is the primary objective and editorial value is secondary", action: "Stop; redesign around reader value and accept that coverage may not link" },
      ] },
      { type: "heading", level: 2, text: "Research the journalist, not just the outlet", id: "journalist-research-record" },
      { type: "checklist", title: "Contact qualification", items: [
        { label: "Current beat", detail: "Recent work demonstrates the relevant subject, geography, format and audience." },
        { label: "Story pattern", detail: "News, analysis, data, commentary, product review or contributed contentâ€”match what they actually publish." },
        { label: "Evidence fit", detail: "The available dataset, source, interview or visual genuinely supports their reporting style." },
        { label: "Contact route", detail: "Current work email or documented submission method, verified without scraping prohibited/private details." },
        { label: "Preferences", detail: "Deadlines, embargo rules, attachments, follow-up and no-contact requests." },
        { label: "Relationship history", detail: "Prior pitches, responses, corrections, coverage and promises; never fake familiarity." },
      ] },
      { type: "heading", level: 2, text: "Write a verifiable pitch", id: "pitch-anatomy" },
      { type: "comparison-table", caption: "Every line should help the recipient evaluate the story.", columns: ["Part", "Purpose", "Avoid"], rows: [
        ["Subject", "Specific news/insight and audience consequence", "Mystery, clickbait, false urgency or â€˜quick questionâ€™"],
        ["Opening", "Why this journalist and why now, based on real recent work", "Generic compliment or mail-merge token"],
        ["Claim", "One defensible story statement in plain language", "A list of brand messages"],
        ["Evidence", "Method, sample/timeframe, source links and limitations", "Unsupported percentage or attachment-only proof"],
        ["Offer", "Named expert, data, visuals, local cut or interview availability", "Requiring a call to learn basic facts"],
        ["Close", "Clear low-pressure next step and deadline", "Link demand, repeated chasing or manipulative scarcity"],
      ] },
      { type: "evidence", claimId: "b2-pitch-editorial", summary: "Google's spam policy distinguishes paid link placement from editorially chosen links; outreach must not hide compensation or condition participation on a link.", sourceIds: ["b2-pitch-linkspam"] },
      { type: "checklist", title: "Evidence room", items: [
        { label: "Methodology", detail: "Population, sampling/source, field dates, exclusions, weighting/calculation and limitations." },
        { label: "Claim sheet", detail: "Approved headlines and exact supporting tables/source locations." },
        { label: "Assets", detail: "Accessible charts, images, captions, rights, credits and downloadable data where appropriate." },
        { label: "Experts", detail: "Relevant bios, conflicts, availability, quote approval rules and direct contact route." },
        { label: "Company facts", detail: "Canonical description, locations, product facts and disclosureâ€”not an oversized sales deck." },
        { label: "Corrections", detail: "Named contact and process if an error is found before or after publication." },
      ] },
      { type: "steps", title: "Follow up without spam", steps: [
        { title: "Wait for a reasonable editorial window", body: "Use the deadline and publication cadence; do not interrupt breaking-news or stated no-follow-up preferences." },
        { title: "Send at most one useful follow-up by default", body: "Add new evidence, a local cut, clearer expert access or material timingâ€”not â€˜just bumping thisâ€™." },
        { title: "Close the record", body: "Mark no response, declined, future interest, accepted or covered; honor unsubscribe/no-contact requests across campaigns." },
        { title: "Learn at cohort level", body: "Review fit, response reasons, evidence gaps and relationship quality without blaming an individual journalist for non-coverage." },
      ] },
    ],
  },

  "survey-research-methodology": {
    readingTime: 20,
    informationGain:
      "A claim-backward survey design workflow with population and sampling decisions, questionnaire pretest, weighting and uncertainty rules, analysis lock, disclosure table and claim review built for reproducible digital PR.",
    sources: [
      primarySource("b2-survey-aapor", "AAPOR Code of Professional Ethics and Practices", "American Association for Public Opinion Research", "https://aapor.org/standards-and-ethics/aapor-code-of-professional-ethics-and-practices/", ["b2-survey-disclosure"]),
    ],
    claims: [
      { id: "b2-survey-disclosure", text: "Professional survey disclosure should make sponsors, populations, sampling, fieldwork, weighting and key limitations available so findings can be evaluated.", requiresEvidence: true, sourceIds: ["b2-survey-aapor"] },
    ],
    originalInsights: [
      "Design backward from the narrowest defensible claim: population, comparison and uncertainty must be valid before a headline is drafted.",
      "Pre-register the analysis and headline rules before looking at results to reduce selective cuts and post-hoc storytelling.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Design from the intended claim", id: "claim-backward-survey-design" },
      { type: "comparison-table", caption: "Turn a proposed headline into testable requirements.", columns: ["Claim element", "Design question", "Unsafe shortcut"], rows: [
        ["Population", "Exactly who may the result describe?", "Calling an opt-in customer sample â€˜Americansâ€™ or â€˜businessesâ€™"],
        ["Measure", "What construct does the question validly capture?", "Treating awareness, preference and purchase as interchangeable"],
        ["Comparison", "Which groups/time periods are comparable and adequately represented?", "Publishing tiny subgroup differences"],
        ["Uncertainty", "What sampling and non-sampling errors affect interpretation?", "Reporting a margin of error for a design where it is not justified"],
        ["Causality", "Can the design establish cause or only association/self-report?", "Turning cross-sectional correlation into â€˜X causes Yâ€™"],
      ] },
      { type: "heading", level: 2, text: "Specify population and sample", id: "population-sampling-plan" },
      { type: "checklist", title: "Sampling record", items: [
        { label: "Target population", detail: "Eligibility, geography, age/role and time frame to which claims apply." },
        { label: "Sampling frame", detail: "Where potential respondents came from and who is absent from that frame." },
        { label: "Recruitment", detail: "Probability or non-probability method, invitations, incentives, quotas and duplicate/fraud controls." },
        { label: "Achieved sample", detail: "Starts, completes, exclusions, subgroup bases and disposition/nonresponse information available." },
        { label: "Weighting", detail: "Variables, targets, trimming, effective base and unweighted bases retained for review." },
        { label: "Generalization boundary", detail: "Exact populations or causal statements the design cannot support." },
      ] },
      { type: "heading", level: 2, text: "Pretest the questionnaire", id: "questionnaire-quality" },
      { type: "comparison-table", caption: "Question defects can be larger than sampling error.", columns: ["Risk", "Test", "Correction"], rows: [
        ["Leading or loaded wording", "Ask neutral reviewers what answer the wording appears to favor", "Remove premise and emotionally directional language"],
        ["Double-barreled item", "Can a respondent agree with one part and reject another?", "Split into separate questions"],
        ["Unclear recall period", "Do respondents use the same time window?", "State a specific, realistic period"],
        ["Order/context effect", "Does prior information change interpretation?", "Randomize where valid and document order"],
        ["Missing response option", "Can all eligible respondents answer truthfully?", "Add not applicable, don't know or open option where justified"],
        ["Cross-market equivalence", "Do translations preserve construct and local meaning?", "Cognitive test and localizeâ€”not literal translation only"],
      ] },
      { type: "evidence", claimId: "b2-survey-disclosure", summary: "AAPOR's code emphasizes transparency about sponsorship, sample, fieldwork, weighting and methods so readers can evaluate the evidence behind published claims.", sourceIds: ["b2-survey-aapor"] },
      { type: "steps", title: "Lock analysis before results", steps: [
        { title: "Define primary outcomes", body: "Name questions, transformations, comparisons and minimum subgroup bases before data review." },
        { title: "Define exclusions", body: "Set speed, attention, duplicate, straight-line and inconsistent-response rules without optimizing for a desired result." },
        { title: "Define uncertainty", body: "Choose appropriate interval/testing methods, multiple-comparison handling and rounding; document where formal inference is inappropriate." },
        { title: "Define headline rules", body: "Set materiality, required base, acceptable wording and prohibited causal/general-population claims." },
        { title: "Version and preserve", body: "Store instrument, plan, field changes, cleaned data, code/tables and final claim approvals." },
      ] },
      { type: "checklist", title: "Public methodology disclosure", items: [
        { label: "Who and why", detail: "Sponsor, research/data partners, purpose and material conflicts." },
        { label: "Who was studied", detail: "Target/achieved population, sample size, subgroup bases and eligibility." },
        { label: "How and when", detail: "Sampling/recruitment mode, field dates, incentive and questionnaire access." },
        { label: "Processing", detail: "Quality exclusions, missing data, weighting, derived variables and analysis method." },
        { label: "Uncertainty", detail: "Appropriate interval/error explanation plus coverage, nonresponse, measurement and model limitations." },
        { label: "Claim trace", detail: "Each chart/headline maps to question wording, table, base and approved interpretation." },
      ] },
      { type: "callout", title: "Worked claim correction", body: "An opt-in survey of 600 software newsletter subscribers finds 58% of respondents tried an AI assistant. The defensible headline is about surveyed subscribers, not â€˜58% of professionalsâ€™. Without a probability sample of professionals, adding a conventional margin of error does not repair that population mismatch.", tone: "blue" },
    ],
  },

  "link-reclamation-unlinked-mentions": {
    readingTime: 18,
    informationGain:
      "A four-class reclamation inventory, opportunity scoring, destination and anchor rules, respectful outreach, redirect/link repair QA, suppression governance and outcome measurement that separates mentions from links.",
    sources: [
      primarySource("b2-reclaim-links", "Link best practices for Google", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/links-crawlable", ["b2-reclaim-crawlable"]),
      primarySource("b2-reclaim-spam", "Spam policies for Google web search", "Google Search Central", "https://developers.google.com/search/docs/essentials/spam-policies", ["b2-reclaim-compensation"]),
    ],
    claims: [
      { id: "b2-reclaim-crawlable", text: "A standard anchor with a resolvable href creates a crawlable relationship that a plain-text mention does not provide.", requiresEvidence: true, sourceIds: ["b2-reclaim-links"] },
      { id: "b2-reclaim-compensation", text: "A link obtained through payment, products or another material exchange should be appropriately qualified and not presented as independently editorial.", requiresEvidence: true, sourceIds: ["b2-reclaim-spam"] },
    ],
    originalInsights: [
      "Reclamation includes unlinked mentions, broken backlinks, redirected backlinks and incorrect destinations; each class needs a different fix and owner.",
      "Prioritize reader utility and factual context before authority metrics, because some mentions are correctly unlinked or should be corrected rather than converted.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Classify the opportunity", id: "reclamation-classes" },
      { type: "comparison-table", caption: "Do not send the same request for every record.", columns: ["Class", "Observed state", "Preferred resolution"], rows: [
        ["Unlinked mention", "Accurate brand/entity reference with no link", "Request a useful source link only when it helps readers verify or continue"],
        ["Broken backlink", "Publisher link points to a 404/410 or unavailable asset", "Restore the intended resource or suggest the closest true replacement"],
        ["Redirected backlink", "Link reaches a chain, generic page or wrong locale", "Fix owned redirect first; request update only when it materially improves the reference"],
        ["Incorrect attribution", "Wrong brand, person, product, claim or source URL", "Prioritize factual correction; a link is secondary"],
      ] },
      { type: "evidence", claimId: "b2-reclaim-crawlable", summary: "Google's link guidance defines reliably crawlable links as anchor elements with href destinations and recommends descriptive context; a text mention remains a different artifact.", sourceIds: ["b2-reclaim-links"] },
      { type: "heading", level: 2, text: "Qualify and score", id: "reclamation-opportunity-score" },
      { type: "code", language: "text", code: "priority =\n  reader_utility\n  x context_relevance\n  x source_quality\n  x destination_readiness\n  x relationship_confidence\n  / outreach_cost\n\nUse a documented 1â€“5 rubric. Domain authority may inform\nsource quality, but it must not override accuracy or fit." },
      { type: "checklist", title: "Qualification fields", items: [
        { label: "Identity match", detail: "Mention refers to the correct organization, product, person or asset; exclude ambiguous names." },
        { label: "Context", detail: "Page is live, indexable where relevant, editorially legitimate and contextually related." },
        { label: "Reference value", detail: "A link would help a reader verify the named source, see original data or complete a relevant task." },
        { label: "Destination", detail: "Canonical 200 page is current, accessible, specific and free of forced redirect chains." },
        { label: "Policy", detail: "Publisher linking rules, relationship history, no-contact preference and compensation are known." },
        { label: "Evidence", detail: "Screenshot/date, mentioning text, current link state, proposed URL and rationale are preserved." },
      ] },
      { type: "heading", level: 2, text: "Choose destination and anchor", id: "destination-anchor-rules" },
      { type: "decision-framework", title: "Reference design", criteria: [
        { signal: "Mention discusses original research, quote or asset", action: "Suggest the exact source page that substantiates it" },
        { signal: "Mention names the company generally", action: "Use the canonical organization/home or relevant about page only if helpful" },
        { signal: "Old URL has an exact replacement", action: "Repair a direct redirect and optionally ask for the new URL" },
        { signal: "No relevant live destination exists", action: "Restore/create the resource only if independently valuable; otherwise do not request a link" },
        { signal: "Anchor request would be awkward or keyword-manipulative", action: "Let the editor choose natural wording; brand/source title is usually sufficient" },
      ] },
      { type: "evidence", claimId: "b2-reclaim-compensation", summary: "Google's link-spam policy requires paid or exchanged links to be qualified; do not convert a reclamation request into an undisclosed transaction.", sourceIds: ["b2-reclaim-spam"] },
      { type: "steps", title: "Respectful outreach and verification", steps: [
        { title: "Fix owned defects", body: "Repair redirects, restore assets and ensure the target is worthy before contacting a publisher." },
        { title: "Contact the right editor", body: "Reference the exact passage and reader benefit; request one specific correction or link without implying obligation." },
        { title: "Follow up once when appropriate", body: "Add useful clarification, then stop and record no response or policy refusal." },
        { title: "Verify outcome", body: "Check final href, status, destination, rel attribute, anchor/context and factual accuracy; do not report a link from an email promise." },
        { title: "Honor suppression", body: "Centralize opt-outs and do-not-contact records across campaigns and vendors." },
      ] },
    ],
  },

  "digital-pr-measurement": {
    readingTime: 20,
    informationGain:
      "A five-layer PR measurement model joining artifact, distribution, referral, search and business outcomes with deduplication, source quality, link-state verification, AI citation sampling, baselines and explicit attribution limits.",
    sources: [
      primarySource("b2-pr-gsc", "Get started with Search Console", "Google Search Console Help", "https://support.google.com/webmasters/answer/10267942", ["b2-pr-search-data"]),
      primarySource("b2-pr-ga", "Traffic-source dimensions", "Google Analytics Help", "https://support.google.com/analytics/answer/11242841", ["b2-pr-referral-data"]),
    ],
    claims: [
      { id: "b2-pr-search-data", text: "Search Console reports Google Search performance such as queries, pages, countries, impressions and clicks rather than proving which PR placement caused a later outcome.", requiresEvidence: true, sourceIds: ["b2-pr-gsc"] },
      { id: "b2-pr-referral-data", text: "Analytics traffic-source dimensions depend on collected and processed attribution information and should be interpreted within the configured attribution and channel rules.", requiresEvidence: true, sourceIds: ["b2-pr-ga"] },
    ],
    originalInsights: [
      "Measure the chain from asset to placement to audience response to search/business outcome, and label where observation ends and attribution begins.",
      "A placement register is the join key: deduplicate syndicated coverage, verify live link state and preserve source context before building aggregate metrics.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Measure five layers", id: "digital-pr-measurement-layers" },
      { type: "comparison-table", caption: "No single PR metric explains the full effect.", columns: ["Layer", "Measures", "What it can support"], rows: [
        ["Asset", "Method quality, expert/source readiness, reuse and maintenance cost", "Whether the campaign created a defensible publishable resource"],
        ["Distribution", "Unique editorial placements, outlet/topic/market fit, prominence, sentiment and syndication", "Where and how the story appeared"],
        ["Link/reference", "Linked/unlinked mention, source/destination, rel, status and persistence", "The actual reference relationshipâ€”not estimated authority alone"],
        ["Audience/search", "Referral sessions/tasks, branded demand context, Search Console page/query cohorts and sampled AI citations", "Observed attention and discovery changes"],
        ["Business", "Qualified leads, assisted opportunities, expert relationships and asset reuse under an agreed model", "Contribution evidence with attribution limitations"],
      ] },
      { type: "heading", level: 2, text: "Build a placement register", id: "placement-register" },
      { type: "checklist", title: "Required fields", items: [
        { label: "Identity", detail: "Campaign/asset, canonical article URL, outlet, author, publication date, market and topic." },
        { label: "Origin", detail: "Original editorial piece, wire/syndication, republish, scrape or owned partner content." },
        { label: "Coverage", detail: "Headline/context, brand/entity accuracy, prominence, sentiment and key claim used." },
        { label: "Reference", detail: "Linked/unlinked, exact source URL, destination, anchor, rel and first/last verified status." },
        { label: "Traffic", detail: "Referral source/medium, landing page, campaign parameters where appropriate and qualified onsite task." },
        { label: "Corrections/rights", detail: "Error, correction request, asset permission, embargo and relationship notes." },
      ] },
      { type: "evidence", claimId: "b2-pr-referral-data", summary: "Google Analytics documents traffic-source dimensions and processing; missing referrers, redirects, apps and privacy controls mean referral reports are evidence, not a complete count of readership.", sourceIds: ["b2-pr-ga"] },
      { type: "heading", level: 2, text: "Deduplicate and qualify coverage", id: "coverage-deduplication" },
      { type: "decision-framework", title: "Counting rules", criteria: [
        { signal: "One original article is republished verbatim across a network", action: "Report one original plus syndicated reach count; do not call every URL independent editorial validation" },
        { signal: "A second outlet adds reporting, analysis or a new interview", action: "Count as distinct earned coverage and record the contribution" },
        { signal: "A URL is a scrape, spam page or inaccessible copy", action: "Exclude from quality coverage; retain in a diagnostic appendix if needed" },
        { signal: "A promised link is removed, redirected or nofollow/sponsored", action: "Report verified current state and history, not the outreach outcome" },
        { signal: "Brand is mentioned inaccurately", action: "Flag accuracy incident separately; visibility is not automatically positive value" },
      ] },
      { type: "evidence", claimId: "b2-pr-search-data", summary: "Search Console gives page/query/country/device performance for Google Search, but it does not identify a PR placement as the cause of a later impression, click or ranking change.", sourceIds: ["b2-pr-gsc"] },
      { type: "heading", level: 2, text: "Evaluate change without overclaiming attribution", id: "pr-evaluation-design" },
      { type: "steps", title: "Measurement sequence", steps: [
        { title: "Pre-register", body: "Define campaign thesis, target audiences/outlets, primary/guardrail metrics, attribution model and observation windows before launch." },
        { title: "Capture baseline", body: "Record prior placements, link state, branded/search cohorts, referral patterns and business seasonality." },
        { title: "Annotate events", body: "Log publication, syndication, paid activity, product launches, algorithm updates and tracking changes." },
        { title: "Compare appropriate cohorts", body: "Use asset/topic/page/market comparisons and longer trends; do not infer causality from one before/after chart." },
        { title: "Triangulate", body: "Join placement timing and quality with referrals, links, search cohorts, prompt samples and qualified business evidence." },
        { title: "State the limit", body: "Report observed association, plausible contribution or tested incrementality according to the design actually used." },
      ] },
      { type: "checklist", title: "AI answer-surface sample", items: [
        { label: "Prompt set", detail: "Versioned informational, comparison and entity prompts with markets/languages." },
        { label: "Environment", detail: "Platform/product, account state, date, model if shown and repeated runs." },
        { label: "Observation", detail: "Brand/entity mention, cited URL/outlet, claim fidelity, position/context and competing sources." },
        { label: "Interpretation", detail: "Treat as sampled visibility and source usageâ€”not proof the PR placement trained or caused the answer." },
      ] },
    ],
  },

  "product-reviews-ugc-governance": {
    readingTime: 20,
    informationGain:
      "A trust-and-safety operating model for reviews, Q&A, images and video covering collection disclosures, moderation states, fraud signals, rights/privacy, structured-data eligibility, pagination/rendering, removal appeals and measurement.",
    sources: [
      primarySource("b2-ugc-abuse", "Prevent user-generated spam on your site and platform", "Google Search Central", "https://developers.google.com/search/docs/monitor-debug/prevent-abuse", ["b2-ugc-controls"]),
      primarySource("b2-ugc-reviews", "Google Search's reviews system", "Google Search Central", "https://developers.google.com/search/docs/appearance/reviews-system", ["b2-ugc-quality"]),
    ],
    claims: [
      { id: "b2-ugc-controls", text: "Google recommends layered abuse prevention including account, moderation, reputation, nofollow/ugc link and monitoring controls for user-generated areas.", requiresEvidence: true, sourceIds: ["b2-ugc-abuse"] },
      { id: "b2-ugc-quality", text: "Google's reviews system aims to reward insightful analysis and original research written by people who know the topic rather than thin summaries.", requiresEvidence: true, sourceIds: ["b2-ugc-reviews"] },
    ],
    originalInsights: [
      "UGC quality is a state machine, not a one-time approve/delete choice; visible, limited, quarantined, rejected, appealed and removed states need audit history and search behavior.",
      "Review incentives and sampling programs must travel with the content as disclosure data, not live in a separate campaign spreadsheet.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Define UGC types and trust promises", id: "ugc-type-policy" },
      { type: "comparison-table", caption: "Each content type has different evidence and moderation needs.", columns: ["Type", "Useful contribution", "Primary risk", "Required context"], rows: [
        ["Product review/rating", "Firsthand use, fit, strengths, limits and verified transaction context", "Fabrication, incentive bias, review bombing", "Purchase/sampling/incentive disclosure and product variant"],
        ["Question and answer", "Specific compatibility, setup or policy answer", "Unsafe advice, stale product facts, seller impersonation", "Answer identity, date and official correction route"],
        ["Photo/video", "Shows real use, scale, result or limitation", "Rights, privacy, manipulation and unrelated uploads", "Consent/license, caption, product relationship and takedown"],
        ["Community/forum", "Troubleshooting and peer knowledge", "Spam links, harassment, personal data and obsolete answers", "Rules, moderation, accepted/official answer state and dates"],
      ] },
      { type: "heading", level: 2, text: "Use explicit moderation states", id: "ugc-moderation-states" },
      { type: "steps", title: "UGC state machine", steps: [
        { title: "Submitted", body: "Capture content, consent, product/entity, transaction/incentive context, account and safety signals." },
        { title: "Automated screening", body: "Check spam links, duplication, prohibited content, personal data, malware/media and suspicious patterns without making opaque final judgments alone." },
        { title: "Human review or sampled review", body: "Apply published policy consistently; escalate safety, legal, fraud and high-reach items." },
        { title: "Published or limited", body: "Expose accurate disclosure, author type/date and appropriate link attributes; limit distribution when confidence is incomplete." },
        { title: "Corrected, appealed or removed", body: "Preserve reason, actor, evidence, notification, appeal and search/cache cleanup." },
      ] },
      { type: "evidence", claimId: "b2-ugc-controls", summary: "Google recommends layered prevention, reputation and moderation for user-generated areas plus appropriate handling of user-posted links.", sourceIds: ["b2-ugc-abuse"] },
      { type: "heading", level: 2, text: "Detect patterns without declaring guilt from one signal", id: "ugc-fraud-signals" },
      { type: "checklist", title: "Review-risk signals", items: [
        { label: "Velocity", detail: "Unusual bursts relative to sales, launch, geography and historical baseline." },
        { label: "Identity/network", detail: "Shared accounts/devices/payment/shipping or coordinated behavior, handled with privacy controls." },
        { label: "Text/media", detail: "Duplicate phrasing, irrelevant content, synthetic/manipulated media or copied assets." },
        { label: "Incentive", detail: "Coupon, free sample, employee/affiliate relationship or contest disclosure missing or inconsistent." },
        { label: "Product fit", detail: "Review references a different model, impossible feature, date before availability or no experience detail." },
        { label: "Appeal evidence", detail: "Allow legitimate contributors to contest automated or moderator decisions." },
      ] },
      { type: "evidence", claimId: "b2-ugc-quality", summary: "Google's reviews guidance emphasizes original, knowledgeable analysis; quantity, star rating and keyword-rich text alone are not a quality standard.", sourceIds: ["b2-ugc-reviews"] },
      { type: "heading", level: 2, text: "Align visible reviews, rendering and schema", id: "ugc-search-implementation" },
      { type: "checklist", title: "Search and page acceptance", items: [
        { label: "Visible parity", detail: "Ratings, counts and review content represented in structured data are visible and generated from the same approved records." },
        { label: "Eligibility", detail: "Use Product/Review/AggregateRating only when applicable guidelines and ownership rules are met; never mark up imported testimonials as first-party product reviews without context." },
        { label: "Discovery", detail: "Useful review/Q&A content is available in crawlable paginated HTML; load-more interaction enhances stable URLs." },
        { label: "Links", detail: "User links use appropriate ugc/nofollow handling and moderation; promotional spam is not left as indexable authority transfer." },
        { label: "Lifecycle", detail: "Removed content no longer contributes to visible counts/schema; cached and syndicated copies follow policy." },
        { label: "Accessibility", detail: "Rating meaning, controls, media alternatives and moderation/appeal interfaces work for assistive technology." },
      ] },
      { type: "comparison-table", caption: "Measure trust and task value, not only review volume.", columns: ["Metric", "Why"], rows: [
        ["Helpful-vote and answer-resolution rate", "Indicates whether UGC completes evaluation or support tasks"],
        ["Verified/incentivized mix", "Exposes provenance and campaign dependence"],
        ["Report, removal and successful-appeal rate", "Monitors moderation quality and false positives"],
        ["Time to safety action", "Measures response to high-risk content"],
        ["Coverage by product/variant", "Finds where averages hide sparse or mismatched evidence"],
      ] },
    ],
  },

  "feature-solution-page-strategy": {
    readingTime: 19,
    informationGain:
      "A SaaS page-role architecture that distinguishes product, feature, solution, use-case, industry, integration and comparison jobs; includes evidence contracts, overlap scoring, page templates and release/measurement governance.",
    sources: [
      primarySource("b2-saas-pages-helpful", "Creating helpful, reliable, people-first content", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", ["b2-saas-pages-value"]),
      primarySource("b2-saas-pages-links", "Link best practices for Google", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/links-crawlable", ["b2-saas-pages-links-claim"]),
    ],
    claims: [
      { id: "b2-saas-pages-value", text: "A SaaS landing page should serve an intended audience and complete a distinct task rather than exist only to capture a keyword variant.", requiresEvidence: true, sourceIds: ["b2-saas-pages-helpful"] },
      { id: "b2-saas-pages-links-claim", text: "Crawlable contextual links and descriptive anchors help connect product, feature, solution and documentation relationships.", requiresEvidence: true, sourceIds: ["b2-saas-pages-links"] },
    ],
    originalInsights: [
      "A feature page owns product capability; a solution page owns a buyer problem and outcome. Merge them when the evidence and decision are the same, split them when audience, proof and next step differ.",
      "Every commercial page needs a product-evidence contract so copy, screenshots, pricing, availability and documentation cannot drift independently.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Assign one decision job to each page type", id: "saas-page-role-map" },
      { type: "comparison-table", caption: "The page type follows the buyer's question.", columns: ["Page type", "Primary question", "Required proof", "Main overlap risk"], rows: [
        ["Product/platform", "What is the product and why choose it?", "System model, core outcomes, product evidence and primary conversion", "Homepage and broad solution pages"],
        ["Feature", "Can the product perform this capability and how?", "Interface/workflow, limits, integrations, security and documentation", "Feature blog posts and docs"],
        ["Solution/use case", "How does this solve a specific problem or workflow?", "Problem mechanism, before/after process, relevant features and outcome proof", "Industry and feature pages"],
        ["Industry/role", "Does this fit my constraints and language?", "Specific workflows, regulations/integrations and relevant proof", "Generic token-swapped vertical pages"],
        ["Integration", "How do two systems work together?", "Supported objects/actions, setup, limits, ownership and status", "Programmatic empty combinations"],
        ["Comparison/alternative", "How should I choose between options?", "Fair criteria, current facts, audience fit and limitations", "Misleading competitor claims"],
      ] },
      { type: "evidence", claimId: "b2-saas-pages-value", summary: "Google's people-first framework favors pages built for a real audience and purpose; keyword variation alone is not a distinct decision job.", sourceIds: ["b2-saas-pages-helpful"] },
      { type: "heading", level: 2, text: "Decide whether to split or merge", id: "saas-page-split-merge" },
      { type: "code", language: "text", code: "overlap_risk =\n  audience_overlap\n  x query_task_overlap\n  x proof_overlap\n  x conversion_overlap\n  x current_serp_overlap\n\nHigh overlap: improve or merge.\nLow overlap with distinct evidence and journey: separate pages.\nRecord exclusions for every page so ownership stays stable." },
      { type: "decision-framework", title: "Page decision", criteria: [
        { signal: "Same audience, task, product evidence and next action", action: "Use one stronger page with clear sections" },
        { signal: "Feature implementation is technical while solution evaluation is business-led", action: "Separate feature and solution pages and connect them contextually" },
        { signal: "Industry page can only swap the industry name", action: "Do not publish; keep the relevant solution page" },
        { signal: "A use case has distinct workflow, constraints, proof and demand", action: "Create a dedicated page with accountable product inputs" },
        { signal: "An existing guide ranks for evaluation intent but cannot convert appropriately", action: "Clarify the guide job and create/strengthen a commercial page rather than rewriting the guide into a sales page" },
      ] },
      { type: "heading", level: 2, text: "Use a product-evidence contract", id: "product-evidence-contract" },
      { type: "checklist", title: "Commercial page fields", items: [
        { label: "Audience and problem", detail: "Specific role, context, trigger and excluded use cases." },
        { label: "Capability", detail: "What the product does, prerequisites, supported platforms, plan/region availability and known limits." },
        { label: "Workflow", detail: "Concrete steps or interface evidence, not abstract benefit claims." },
        { label: "Proof", detail: "Verified customer evidence, demo, benchmark methodology, security/compliance record or transparent placeholder." },
        { label: "Relationships", detail: "Relevant features, integrations, docs, pricing, comparison and case studies with crawlable links." },
        { label: "Ownership", detail: "Product fact owner, marketer/editor, release dependency, review date and deprecation rule." },
      ] },
      { type: "evidence", claimId: "b2-saas-pages-links-claim", summary: "Google recommends standard crawlable links and descriptive anchors, which should form the durable relationship between commercial pages and supporting documentation.", sourceIds: ["b2-saas-pages-links"] },
      { type: "comparison-table", caption: "Measure the page according to its job.", columns: ["Page role", "Primary success evidence", "Guardrail"], rows: [
        ["Feature", "Qualified interaction with demo/docs/trial from feature-intent entrants", "Support questions and claim accuracy"],
        ["Solution", "Movement from problem evaluation to relevant proof or sales action", "Generic/low-fit leads"],
        ["Integration", "Setup starts, activated integrations or qualified interest", "Unsupported-state visits and stale capability claims"],
        ["Comparison", "Qualified evaluation and assisted pipeline under stated attribution", "Complaints, corrections and fact freshness"],
      ] },
    ],
  },

  "documentation-help-center-seo": {
    readingTime: 20,
    informationGain:
      "A public-versus-private documentation decision, task-based information architecture, version and lifecycle policy, code/sample quality controls, raw/rendered discovery QA and measurement that separates support success from acquisition.",
    sources: [
      primarySource("b2-docs-noindex", "Block search indexing with noindex", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/block-indexing", ["b2-docs-noindex-claim"]),
      primarySource("b2-docs-links", "Link best practices for Google", "Google Search Central", "https://developers.google.com/search/docs/crawling-indexing/links-crawlable", ["b2-docs-links-claim"]),
    ],
    claims: [
      { id: "b2-docs-noindex-claim", text: "Google must be able to crawl a page to observe a noindex directive; robots.txt blocking can prevent the directive from being seen.", requiresEvidence: true, sourceIds: ["b2-docs-noindex"] },
      { id: "b2-docs-links-claim", text: "Crawlable anchor links with descriptive context support discovery across documentation tasks and product relationships.", requiresEvidence: true, sourceIds: ["b2-docs-links"] },
    ],
    originalInsights: [
      "Documentation SEO starts with access and user harm: public indexation is appropriate only when the task is safe, durable and useful before authentication.",
      "Version, plan, region and product state are part of the answer; hiding them in navigation or release notes makes even technically correct documentation misleading.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Choose public, noindex or private", id: "documentation-access-decision" },
      { type: "decision-framework", title: "Documentation visibility", criteria: [
        { signal: "Task is useful before purchase/login and exposes no sensitive implementation or account data", action: "Publish an indexable canonical page with product/version context" },
        { signal: "Page is public for sharing but low-value, duplicate, temporary or account-specific", action: "Keep accessible and use noindex when appropriate; ensure crawlers can observe it" },
        { signal: "Content contains credentials, tenant data, security-sensitive operations or contractual restrictions", action: "Require real authorization; robots/noindex are not security controls" },
        { signal: "Old version remains necessary for supported customers", action: "Keep an explicit version archive with banners, relationships and appropriate index policy" },
        { signal: "Old page has a precise current equivalent", action: "Redirect directly and update product/UI links; otherwise retain a useful migration/deprecation explanation" },
      ] },
      { type: "evidence", claimId: "b2-docs-noindex-claim", summary: "Google documents that noindex must be observed during crawling, so blocking a public documentation URL in robots.txt can conflict with the intended removal workflow.", sourceIds: ["b2-docs-noindex"] },
      { type: "heading", level: 2, text: "Architect around user tasks", id: "documentation-task-architecture" },
      { type: "comparison-table", caption: "Different doc types answer different questions.", columns: ["Type", "User job", "Required elements"], rows: [
        ["Concept", "Understand a model or constraint", "Definition, mental model, boundaries and related tasks"],
        ["Tutorial", "Reach a learning outcome end-to-end", "Prerequisites, steps, expected result and cleanup"],
        ["How-to", "Complete one specific task", "Starting state, exact procedure, verification and failure recovery"],
        ["Reference", "Look up precise behavior", "Versioned parameters, types, defaults, errors and examples"],
        ["Troubleshooting", "Diagnose and resolve a symptom", "Symptoms, causes, tests, safe fix, escalation and data to preserve"],
        ["Release/deprecation", "Understand what changed and required action", "Effective dates, affected versions, migration path and support horizon"],
      ] },
      { type: "evidence", claimId: "b2-docs-links-claim", summary: "Google's crawlable-link guidance supports task-based navigation made from real anchors rather than search boxes, client-only trees or interaction-only discovery.", sourceIds: ["b2-docs-links"] },
      { type: "heading", level: 2, text: "Treat samples as tested product artifacts", id: "documentation-sample-quality" },
      { type: "checklist", title: "Code and procedure acceptance", items: [
        { label: "Environment", detail: "Product/API version, language/runtime, plan, permissions and prerequisites are explicit." },
        { label: "Copy/paste validity", detail: "Sample is syntactically valid, tested in CI where possible and uses placeholder secrets safely." },
        { label: "Expected result", detail: "Readers can verify success with output, state or response examples." },
        { label: "Failure paths", detail: "Common errors, rate limits, retries, rollback/cleanup and escalation are covered." },
        { label: "Accessibility", detail: "Headings, anchors, tables, code controls and feedback UI are keyboard/screen-reader usable." },
        { label: "Ownership", detail: "Source-code owner, doc owner, release dependency and stale-sample alert." },
      ] },
      { type: "heading", level: 2, text: "Manage version and product lifecycle", id: "documentation-lifecycle" },
      { type: "steps", title: "Change workflow", steps: [
        { title: "Link docs to the product change", body: "Every feature/API release names affected pages, examples, screenshots and translations before deployment." },
        { title: "Publish with the release", body: "Coordinate availability, navigation, status, canonical/version and cache invalidation." },
        { title: "Signal deprecation", body: "State dates, supported versions, migration steps and consequences visibly; avoid silent outdated pages." },
        { title: "Retire deliberately", body: "Redirect only to equivalent tasks, preserve required archives and remove stale pages from links/sitemaps/search indexes according to policy." },
      ] },
      { type: "comparison-table", caption: "Measure documentation by task and risk.", columns: ["Metric", "Interpretation"], rows: [
        ["Task success / repeat search", "Whether the page resolved the need rather than only attracting a visit"],
        ["Search-to-support escalation", "Where public answers fail or intentionally route to qualified help"],
        ["Stale-version exposure", "Visits to content outside supported versions or regions"],
        ["Broken sample rate", "Release regressions in runnable code and procedures"],
        ["Acquisition assist", "Pre-purchase discovery and qualified next steps, reported separately from support deflection"],
      ] },
    ],
  },

  "free-tools-calculators-templates": {
    readingTime: 20,
    informationGain:
      "An investment gate for utility, methodological validity, search distribution, addressable outputs, privacy/security, accessibility, abuse controls, maintenance economics and measurement with transparent assumptions and uncertainty.",
    sources: [
      primarySource("b2-tools-helpful", "Creating helpful, reliable, people-first content", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", ["b2-tools-value"]),
      primarySource("b2-tools-spam", "Spam policies for Google web search", "Google Search Central", "https://developers.google.com/search/docs/essentials/spam-policies", ["b2-tools-links"]),
    ],
    claims: [
      { id: "b2-tools-value", text: "A free tool should provide substantial value to an intended audience rather than serve mainly as a search-traffic or lead-capture wrapper.", requiresEvidence: true, sourceIds: ["b2-tools-helpful"] },
      { id: "b2-tools-links", text: "Links obtained through required exchanges, widgets or distributed templates can create link-spam risk when they are not editorially chosen or appropriately qualified.", requiresEvidence: true, sourceIds: ["b2-tools-spam"] },
    ],
    originalInsights: [
      "The strongest free-tool moat is a trustworthy task modelâ€”inputs, method, uncertainty and useful outputâ€”not a generic calculator UI.",
      "Maintenance cost is part of product-market fit: a tool whose assumptions cannot be kept current should fail the investment gate before launch.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Pass the investment gate", id: "free-tool-investment-gate" },
      { type: "comparison-table", caption: "Score each dimension with evidence before building.", columns: ["Dimension", "Pass evidence", "Fail signal"], rows: [
        ["Task value", "A repeated high-friction decision with a clear user and outcome", "Idea begins with a keyword, not a task"],
        ["Method validity", "Inputs, formula/model, assumptions and uncertainty can be explained and reviewed", "A precise output rests on unknown or misleading assumptions"],
        ["Differentiation", "Owned data, workflow integration or materially better usability", "Clone of existing tools with rewritten labels"],
        ["Distribution", "Relevant search, product, partner, community or PR path", "Plan depends on â€˜it will earn linksâ€™"],
        ["Conversion fit", "Natural next step after completing the task", "Core result is hidden behind an excessive gate"],
        ["Maintenance", "Named owner, source/version triggers, support budget and retirement path", "No team owns updates after launch"],
      ] },
      { type: "evidence", claimId: "b2-tools-value", summary: "Google's people-first questions focus on audience usefulness and satisfying task completion, which a thin lead form or formula wrapper does not provide.", sourceIds: ["b2-tools-helpful"] },
      { type: "heading", level: 2, text: "Publish the method with the result", id: "tool-method-contract" },
      { type: "checklist", title: "Method and output requirements", items: [
        { label: "Inputs", detail: "Definitions, units, valid ranges, defaults, required/optional fields and data retention." },
        { label: "Method", detail: "Formula/model, source, version, exclusions, assumptions and qualified reviewer." },
        { label: "Uncertainty", detail: "Range, sensitivity, confidence or scenario behavior appropriate to the method; avoid false precision." },
        { label: "Output", detail: "Plain-language interpretation, calculation trace, downloadable/shareable result and next actions." },
        { label: "Limitations", detail: "Where the tool should not be used and when a qualified professional or richer analysis is needed." },
        { label: "Freshness", detail: "Data/model effective date, last review, change log and stale-result warning." },
      ] },
      { type: "heading", level: 2, text: "Design an indexable tool experience", id: "tool-search-architecture" },
      { type: "decision-framework", title: "URL and output policy", criteria: [
        { signal: "One tool serves one stable task", action: "Use a canonical indexable landing/tool page with server-rendered explanation and examples" },
        { signal: "Outputs contain no unique durable public value", action: "Keep result states non-indexed or client-side without generating crawlable combinations" },
        { signal: "A result can be safely shared and independently useful", action: "Create an addressable URL with privacy review, expiry/control and unique explanatory context" },
        { signal: "Templates generate arbitrary keyword combinations", action: "Block generation and use curated examples or one interactive interface" },
        { signal: "Embeds include attribution links", action: "Make attribution optional/editorial or appropriately qualify generated links; never force keyword-rich links" },
      ] },
      { type: "evidence", claimId: "b2-tools-links", summary: "Google's spam policy covers links distributed through widgets/templates or exchanges when they are not genuinely editorial, so link acquisition cannot be a hidden condition of tool use.", sourceIds: ["b2-tools-spam"] },
      { type: "checklist", title: "Product-quality gate", items: [
        { label: "Accessibility", detail: "Labels, instructions, validation, keyboard flow, result announcements, contrast and non-visual alternatives." },
        { label: "Performance", detail: "Useful initial content, bounded script cost, stable layout and resilient calculation/error states." },
        { label: "Privacy/security", detail: "Data minimization, consent, retention, access, export, deletion, injection/file risks and safe logs." },
        { label: "Abuse", detail: "Rate limits, automated misuse, unsafe generated content, resource cost and support escalation." },
        { label: "Analytics", detail: "Start, valid completion, error, result use, return use and qualified next stepâ€”without storing sensitive inputs unnecessarily." },
        { label: "Operations", detail: "Owner, dependency monitoring, incident runbook, versioning and retirement/redirect." },
      ] },
      { type: "code", language: "text", code: "tool_value =\n  successful_task_completions\n  x repeat_or_share_utility\n  x qualified_next_step_rate\n  / (build_cost + maintenance_cost + risk_cost)\n\nReport each input separately. Do not collapse the business case\ninto an invented universal score or attribute every later lead to the tool." },
      { type: "callout", title: "Worked hypothetical: ROI calculator", body: "A calculator cannot know a prospect's margin, adoption rate or implementation cost. It returns scenarios, exposes every assumption, lets users change them and labels the result as an estimate. The core result is visible without an email gate; an optional export asks only for proportionate data.", tone: "blue" },
    ],
  },

  "saas-category-creation-strategy": {
    readingTime: 20,
    informationGain:
      "A category-strategy evidence gate comparing category entry, reframing, subcategory, creation and no-claim options through buyer language, comprehension tests, product difference, competitive alternatives, resource commitment and falsification criteria.",
    sources: [
      primarySource("b2-category-helpful", "Creating helpful, reliable, people-first content", "Google Search Central", "https://developers.google.com/search/docs/fundamentals/creating-helpful-content", ["b2-category-clarity"]),
      primarySource("b2-category-spam", "Spam policies for Google web search", "Google Search Central", "https://developers.google.com/search/docs/essentials/spam-policies", ["b2-category-misrepresentation"]),
    ],
    claims: [
      { id: "b2-category-clarity", text: "Content should help its intended audience achieve a goal; unfamiliar category language that reduces buyer comprehension fails that task even when it is distinctive.", requiresEvidence: true, sourceIds: ["b2-category-helpful"] },
      { id: "b2-category-misrepresentation", text: "Category language must not misrepresent product identity, capability, relationships or evidence.", requiresEvidence: true, sourceIds: ["b2-category-spam"] },
    ],
    originalInsights: [
      "Category creation is a market-education investment, not a naming workshop; choose it only when an existing frame materially prevents buyers from understanding a genuinely different model.",
      "Independent adoption, comprehension and sales behaviorâ€”not company repetition or search volume aloneâ€”determine whether a new category is taking hold.",
    ],
    blocks: [
      { type: "heading", level: 2, text: "Diagnose the positioning problem first", id: "category-problem-diagnosis" },
      { type: "comparison-table", caption: "Different problems require different strategies.", columns: ["Observed problem", "Likely cause", "First test"], rows: [
        ["Buyers cannot place the product", "Unclear category reference or audience/problem", "Test established category language with a precise differentiator"],
        ["Buyers place it but see no reason to switch", "Weak product difference or proof", "Strengthen switching trigger, mechanism and evidenceâ€”not terminology"],
        ["Existing category implies the wrong workflow/economics", "Frame may hide a meaningful model difference", "Test a reframed category/subcategory against comprehension and evaluation"],
        ["No existing alternatives or budget owner", "True market education may be required", "Validate problem recognition, urgency and willingness to allocate budget"],
        ["Team wants novelty or analyst attention", "Internal identity goal", "Reject category creation until buyer value and organizational commitment are demonstrated"],
      ] },
      { type: "heading", level: 2, text: "Pass the Category Strategy Evidence Gate", id: "category-evidence-gate" },
      { type: "checklist", title: "Required evidence", items: [
        { label: "Buyer language", detail: "Interview/search/sales/support evidence for the problem, alternatives and decision criteria." },
        { label: "Existing frame", detail: "What current categories help buyers understand and where they systematically mislead." },
        { label: "Product difference", detail: "Distinct mechanism, workflow, economics or outcomeâ€”not a renamed feature bundle." },
        { label: "Switching trigger", detail: "Why the target buyer changes now and which incumbent behavior/budget is displaced." },
        { label: "Comprehension", detail: "Unprompted explanation, category placement, comparison accuracy and next-action testing." },
        { label: "Proof", detail: "Product evidence, customer behavior, independent validation and honest limitations." },
        { label: "Commitment", detail: "Leadership, product, sales, customer success, ecosystem and multi-year education resources." },
        { label: "Falsification", detail: "Signals and date that would cause entry, reframing, creation or no-claim strategy to change." },
      ] },
      { type: "evidence", claimId: "b2-category-clarity", summary: "Google's people-first framework asks whether content satisfies its audience; category language should therefore be tested for comprehension and decision usefulness, not only distinctiveness.", sourceIds: ["b2-category-helpful"] },
      { type: "heading", level: 2, text: "Choose among five strategies", id: "five-category-strategies" },
      { type: "comparison-table", caption: "Use the least expensive strategy that accurately improves buyer understanding.", columns: ["Strategy", "Choose when", "Messaging architecture"], rows: [
        ["Category entry", "Known category is accurate and buyers already allocate attention/budget", "Known category + specific audience/problem + differentiated mechanism/proof"],
        ["Differentiated positioning", "Category is useful but competitors sound interchangeable", "Preserve category; sharpen who, trigger, outcome and reason to believe"],
        ["Subcategory/reframe", "Known reference helps, but a narrower decision model is needed", "Anchor to known category, define the new frame and explicit boundary"],
        ["Category creation", "Problem/model is genuinely distinct and organization can fund sustained education", "Problem stakes, old-world failure, new model, category definition, product proof and ecosystem"],
        ["No category claim", "Evidence is early or labels reduce understanding", "Lead with concrete product, audience, task and proof while learning"],
      ] },
      { type: "evidence", claimId: "b2-category-misrepresentation", summary: "Google's spam policies reinforce a basic boundary: distinctive category language cannot justify misleading product identity, capability or relationships.", sourceIds: ["b2-category-spam"] },
      { type: "heading", level: 2, text: "Run comprehension and adoption tests", id: "category-tests" },
      { type: "steps", title: "Evidence sequence", steps: [
        { title: "Message comprehension", body: "Ask target buyers to explain the product, user, problem, alternative and difference without coaching." },
        { title: "Decision placement", body: "Observe which budget, competitor set and evaluation criteria the language activates." },
        { title: "Behavior", body: "Track qualified conversation quality, objection patterns, conversion steps and sales-cycle movementâ€”not clicks alone." },
        { title: "Independent adoption", body: "Record customers, partners, analysts and publishers using the term accurately without being required or paid to repeat it." },
        { title: "Falsify", body: "At the agreed date, compare evidence with thresholds and choose continue, narrow, return to a known category or drop the claim." },
      ] },
      { type: "code", language: "text", code: "category_evidence =\n  buyer_comprehension\n  x product_difference\n  x independent_adoption\n  x decision_quality\n  x organizational_commitment\n\nTrack components separately. Search volume and company usage\nare context, not proof that a market category exists." },
    ],
  },
};

function insertBeforeConversionBlocks(existing: InsightBlock[], additions: InsightBlock[]) {
  const insertionIndex = existing.findIndex((block) =>
    ["related-service", "case-study-reference", "sample-audit-reference", "faq", "cta"].includes(block.type)
  );
  if (insertionIndex === -1) return [...existing, ...additions];
  return [...existing.slice(0, insertionIndex), ...additions, ...existing.slice(insertionIndex)];
}

export function applyContentAuthorityBatch2Audit(articles: InsightArticle[]): InsightArticle[] {
  return articles.map((article) => {
    const upgrade = upgrades[article.slug];
    if (!upgrade) return article;
    const sources = [...article.contentEvidence.sources, ...upgrade.sources];
    return {
      ...article,
      readingTime: upgrade.readingTime,
      updatedAt: auditedAt,
      lastFactCheckedAt: auditedAt,
      blocks: insertBeforeConversionBlocks(article.blocks, upgrade.blocks),
      searchStrategy: { ...article.searchStrategy, uniqueInformationGain: upgrade.informationGain },
      contentEvidence: {
        ...article.contentEvidence,
        sources,
        claims: [...article.contentEvidence.claims, ...upgrade.claims],
        originalInsights: [...article.contentEvidence.originalInsights, ...upgrade.originalInsights],
      },
      schema: {
        ...article.schema,
        citationReferences: Array.from(new Set([
          ...article.schema.citationReferences,
          ...sources.map((source) => source.url),
        ])),
      },
      publishQa: {
        summary: "Batch 2 content-authority audit implemented: specialist decision support, evidence governance, reproducible examples, GEO extraction blocks, and conversion paths verified.",
        checkedAt: auditedAt,
      },
    };
  });
}
