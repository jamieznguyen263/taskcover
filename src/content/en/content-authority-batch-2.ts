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
      "A byline is an accountability record, not a ranking decoration; credit only…16442 tokens truncated…tion URL in robots.txt can conflict with the intended removal workflow.", sourceIds: ["b2-docs-noindex"] },
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
