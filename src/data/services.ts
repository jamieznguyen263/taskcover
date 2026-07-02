/**
 * Service page system — single source of truth.
 *
 * Used by:
 *  - `/services`           (hub)  -> renders `services` array as a bento overview
 *  - `/services/[slug]`    (each) -> renders a `Service` via the service template
 *
 * Credibility rules (see docs/SEO_STANDARDS.md):
 *  - No fabricated metrics, testimonials, or case-study numbers.
 *  - Outcome language only ("stronger crawlability", "clearer authority signals").
 *  - Each service page must have unique content — no swapped-keyword duplication.
 */

export type ServiceDeliverable = {
  title: string;
  description: string;
  /** Priority/status chip shown in the deliverable ledger. */
  tag?:
    | "Core"
    | "Priority"
    | "Ongoing"
    | "Foundation"
    | "Strategy"
    | "Technical"
    | "Content"
    | "Authority"
    | "Local"
    | "Analytics"
    | "Conversion"
    | "Advisory"
    | "AI Search"
    | "Execution";
};

export type ServiceUseCase = {
  audience: string;
  detail: string;
  /** "You'll recognize this if..." trigger text for the decision path layout. */
  signal?: string;
};

export type ServiceProcessPhase = {
  title: string;
  description: string;
  /** Optional short timing label (e.g. "Weeks 1-2"). */
  timing?: string;
};

export type ServiceOutcome = {
  label: string;
  description: string;
};

export type ServiceFaq = {
  q: string;
  a: string;
};

/** Service-specific leverage points shown in the "Why it matters" opportunity panel. */
export type ServiceLeveragePoint = {
  /** Short strategic bullet describing the advantage this service creates. */
  text: string;
};

export type Service = {
  slug: string;
  title: string;
  /** Short label used in cards / nav. */
  shortLabel: string;
  /** Hero H1. */
  h1: string;
  /** Hero positioning line under the H1. */
  positioning: string;
  /** Hero subheadline. */
  subheadline: string;
  /** Short summary used in cards and the hub. */
  summary: string;
  /** One-line outcome promise (no fake metrics). */
  outcomePromise: string;
  /** Icon key mapped in the service template. */
  icon:
    | "strategy"
    | "technical"
    | "ai"
    | "content"
    | "pr"
    | "local"
    | "ecommerce"
    | "international"
    | "audit"
    | "ppc"
    | "mentor";
  /** Meta title (without site suffix — the template appends it). */
  metaTitle: string;
  metaDescription: string;
  /** Problem section. */
  problem: {
    title: string;
    paragraphs: string[];
    bullets: string[];
    /** Leverage points for the "Why it matters" opportunity panel. */
    leveragePoints: ServiceLeveragePoint[];
  };
  /** Taskcover approach section. */
  approach: {
    title: string;
    paragraphs: string[];
    /** Operating-system stages emphasized for this service. */
    stages: { label: string; description: string }[];
  };
  deliverables: ServiceDeliverable[];
  useCases: ServiceUseCase[];
  process: ServiceProcessPhase[];
  outcomes: ServiceOutcome[];
  faqs: ServiceFaq[];
  /** Slugs of related services (excludes self). */
  related: string[];
};

/* -------------------------------------------------------------------------- */
/* Hub content                                                                */
/* -------------------------------------------------------------------------- */

export const servicesHub = {
  eyebrow: "Services",
  h1: "Search growth services built to work together.",
  positioning:
    "One connected system across Google, AI Search, and revenue — not a list of disconnected SEO tasks.",
  description:
    "Every Taskcover service plugs into the same search growth operating system. You can engage one capability or the full system; either way, work is measured against visibility, trust, leads, and revenue.",
  primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
  secondaryCta: { label: "View Methodology", href: "/methodology" },
  connectSection: {
    eyebrow: "One operating system",
    title: "How the services connect.",
    description:
      "Audit informs strategy. Strategy shapes technical, content, and authority work. AI search readiness runs through all of it. CRO and reporting close the loop back to revenue.",
  },
  whichServiceSection: {
    eyebrow: "Find your fit",
    title: "Which service is right for you?",
    description:
      "Not sure where to start? Use the outcomes below to find the service that maps to your biggest current gap.",
  },
} as const;

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

export const services: Service[] = [
  /* ---------------------------------------------------------------------- */
  {
    slug: "seo-agency",
    title: "SEO Strategy",
    shortLabel: "SEO Strategy",
    h1: "SEO strategy built for Google, AI Search, and revenue growth.",
    positioning:
      "A prioritized search growth roadmap — not a checklist of SEO tasks.",
    subheadline:
      "Taskcover builds SEO as a business growth system: technical, content, authority, and AI search readiness connected to revenue, not vanity rankings.",
    summary:
      "An integrated SEO strategy that aligns technical, content, authority, and AI search work to business outcomes across the USA, Canada, and Australia.",
    outcomePromise:
      "A clear, prioritized roadmap that ties search investment to pipeline and revenue.",
    icon: "strategy",
    metaTitle: "SEO Agency for Google, AI Search & Revenue Growth",
    metaDescription:
      "Taskcover is a search growth agency delivering SEO strategy across Google, AI Search, and revenue. Technical, content, authority, and AI readiness in one connected system.",
    problem: {
      title: "SEO that never connects to revenue.",
      paragraphs: [
        "Most SEO programs produce activity — reports, posts, tasks — without a clear line from search visibility to business outcomes. Organic work is scattered across disconnected tasks with no revenue-based prioritization, and AI search is treated as someone else's problem.",
        "The result is fragmented work, slow momentum, and reporting that leadership cannot tie to pipeline.",
      ],
      bullets: [
        "Organic work scattered across disconnected tasks",
        "No revenue-based prioritization — rankings move but revenue does not",
        "SEO, content, authority, and reporting handled in separate silos",
        "Leadership cannot see what matters next or why",
        "Search growth depends on random monthly deliverables",
        "AI Overviews and LLM answers are ignored entirely",
      ],
      leveragePoints: [
        { text: "Connect technical, content, authority, and AI search into one roadmap." },
        { text: "Prioritize work by revenue impact, not task volume." },
        { text: "Give leadership a clearer view of what matters next." },
        { text: "Turn search visibility into qualified pipeline." },
      ],
    },
    approach: {
      title: "A search growth system, not a task list.",
      paragraphs: [
        "We start with your business model and revenue motion, then design an SEO strategy where every workstream reinforces the others. Priorities are scored by business impact, not search volume alone.",
        "AI search readiness is built in from day one — structured data, citation-worthy content, and entity clarity — so visibility compounds across Google and AI surfaces.",
      ],
      stages: [
        { label: "Discovery & Revenue Mapping", description: "Business model, buyers, revenue motion, and current search position." },
        { label: "Growth Audit", description: "Technical, content, authority, and AI readiness baseline." },
        { label: "Strategy & Prioritization", description: "Priorities mapped to revenue and pipeline, not search volume alone." },
        { label: "Operating System Design", description: "How technical, content, authority, and AI work connect in one system." },
        { label: "AI Search Readiness", description: "Answer-optimized, structured, citation-worthy across AI surfaces." },
        { label: "Quarterly Reset", description: "Re-baseline against SERP and AI answer changes each quarter." },
      ],
    },
    deliverables: [
      { title: "Search growth strategy", description: "Prioritized 90-day and 12-month roadmap tied to revenue.", tag: "Strategy" },
      { title: "Intent map", description: "Keyword and topic clusters mapped to buyer intent and funnel stage.", tag: "Strategy" },
      { title: "Operating system design", description: "How technical, content, authority, and AI work connect.", tag: "Foundation" },
      { title: "Measurement plan", description: "Visibility, trust, leads, and revenue KPIs with attribution logic.", tag: "Analytics" },
      { title: "AI search readiness plan", description: "Structured data, entity clarity, and citation-worthy content priorities.", tag: "AI Search" },
      { title: "Priority decision framework", description: "Scoring model so future SEO decisions tie back to revenue.", tag: "Strategy" },
      { title: "Quarterly reset", description: "Re-baselining against SERP and AI answer changes.", tag: "Ongoing" },
      { title: "Business-impact reporting", description: "Dashboards that show visibility, leads, and revenue — not just traffic.", tag: "Analytics" },
    ],
    useCases: [
      { audience: "Founders & CEOs", detail: "Need search to clearly map to revenue, not vanity metrics.", signal: "Leadership asks what SEO is actually driving and no one can answer in revenue terms." },
      { audience: "Marketing leaders", detail: "Want one connected program instead of siloed SEO, content, and PR.", signal: "Your SEO, content, and PR teams work separately and results do not compound." },
      { audience: "Multi-market brands", detail: "Competing across the USA, Canada, and Australia with regional nuance.", signal: "You operate across markets but run one generic plan everywhere." },
      { audience: "Post-audit execution", detail: "Already have an audit or strategy doc but no one executing it coherently.", signal: "You have a strategy document but no prioritized 90-day execution plan." },
    ],
    process: [
      { title: "Discovery & revenue mapping", description: "Business model, buyers, revenue motion, and current search position.", timing: "Week 1" },
      { title: "Growth audit", description: "Technical, content, authority, and AI readiness baseline.", timing: "Weeks 1-2" },
      { title: "Strategy & roadmap", description: "Prioritized plan tied to pipeline and revenue.", timing: "Weeks 2-3" },
      { title: "90-day sprint", description: "Highest-impact work executed with weekly momentum.", timing: "Month 1" },
      { title: "Quarterly reset", description: "Re-baseline against SERP and AI answer changes.", timing: "Quarterly" },
    ],
    outcomes: [
      { label: "Cleaner prioritization", description: "Effort aimed at revenue, not rankings alone." },
      { label: "Connected execution", description: "Technical, content, authority, and AI in one system." },
      { label: "Better reporting decisions", description: "Visibility tied to leads and revenue, not vanity traffic." },
      { label: "AI search ready", description: "Built for Google and AI answer surfaces from day one." },
      { label: "Lower campaign waste", description: "Work that does not move revenue is deprioritized." },
    ],
    faqs: [
      { q: "Is this a full SEO retainer or just strategy?", a: "SEO Strategy is the foundation of every engagement. It can be delivered as a standalone roadmap or as the strategy layer on top of execution across technical, content, authority, and AI search work." },
      { q: "Do you work across the USA, Canada, and Australia?", a: "Yes. Strategy accounts for market-specific demand, competitors, and trust signals in each region rather than duplicating one plan." },
      { q: "Will you guarantee rankings?", a: "No. We focus on durable visibility, authority, and business outcomes we can actually influence and measure." },
      { q: "How fast will we see results?", a: "Timelines depend on market, competition, technical baseline, and content maturity. We structure work in 90-day sprints with clear priorities." },
      { q: "Do you include AI search readiness?", a: "Yes. AI Overviews and LLM answer readiness is built into strategy from the start, not bolted on later." },
      { q: "How do you measure success?", a: "We measure visibility, trust, qualified demand, and revenue impact — not rankings alone." },
    ],
    related: ["technical-seo", "content-marketing", "ai-search-optimization", "seo-audit"],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "technical-seo",
    title: "Technical SEO",
    shortLabel: "Technical SEO",
    h1: "Technical SEO that makes your website easier to crawl, understand, index, and grow.",
    positioning:
      "A fast, crawlable, indexable foundation Google and AI can trust.",
    subheadline:
      "Taskcover diagnoses and fixes the technical issues that block visibility — from crawl and indexation to architecture, Core Web Vitals, schema, and JavaScript rendering.",
    summary:
      "End-to-end technical SEO covering crawlability, indexation, site architecture, Core Web Vitals, structured data, JavaScript SEO, and migrations.",
    outcomePromise:
      "A technical foundation that removes growth ceilings and de-risks future content and authority work.",
    icon: "technical",
    metaTitle: "Technical SEO Services for Crawl, Indexation & Growth",
    metaDescription:
      "Technical SEO services covering crawlability, indexation, site architecture, Core Web Vitals, schema, JavaScript SEO, and migrations across the USA, Canada, and Australia.",
    problem: {
      title: "Great content that never gets the chance to rank.",
      paragraphs: [
        "If crawlers cannot reach, render, or understand your pages, content and authority investment is wasted. Many sites leak visibility through indexation gaps, slow rendering, thin internal architecture, or migration regressions they never detected.",
        "These problems are rarely visible in a traffic report — until a core update, migration, or release exposes them.",
      ],
      bullets: [
        "Crawl waste — Googlebot burning budget on low-value or duplicate URLs",
        "Indexation issues — priority pages excluded or thin pages indexed",
        "Weak site architecture and internal linking diluting authority",
        "JavaScript rendering risk — content invisible to crawlers and AI surfaces",
        "Schema and structured-data gaps blocking entity understanding",
        "Migration or release risk causing silent visibility loss",
      ],
      leveragePoints: [
        { text: "Improve crawl efficiency." },
        { text: "Protect indexation." },
        { text: "Remove growth ceilings before content scaling." },
        { text: "Reduce migration and release risk." },
      ],
    },
    approach: {
      title: "Engineered for crawlers, optimized for growth.",
      paragraphs: [
        "We treat technical SEO as a growth enabler, not a one-off audit. Crawl logs, render testing, and indexation analysis identify what is actually blocking Google and AI surfaces.",
        "Fixes are prioritized by visibility and revenue impact, then validated — so each change compounds rather than disappearing into a backlog.",
      ],
      stages: [
        { label: "Crawl & Index Baseline", description: "Crawl logs, render testing, indexation coverage, and Core Web Vitals baseline." },
        { label: "Architecture Mapping", description: "Site architecture, internal linking, and URL structure reviewed for authority flow." },
        { label: "Performance & Core Web Vitals", description: "Prioritized performance fixes with measurable targets." },
        { label: "Schema & Entity Validation", description: "Structured data gaps closed so Google and AI understand your entities." },
        { label: "Release / Migration QA", description: "Pre- and post-release QA to prevent silent visibility loss." },
        { label: "Technical Roadmap", description: "Ongoing prioritized technical backlog tied to visibility outcomes." },
      ],
    },
    deliverables: [
      { title: "Technical SEO audit", description: "Crawl, indexation, architecture, schema, and performance review.", tag: "Technical" },
      { title: "Crawl & log analysis", description: "What Googlebot and AI crawlers actually see and skip.", tag: "Technical" },
      { title: "Indexation strategy", description: "Clear rules for what should — and should not — be indexed.", tag: "Technical" },
      { title: "Core Web Vitals plan", description: "Prioritized performance fixes with measurable targets.", tag: "Technical" },
      { title: "Structured data layer", description: "Schema that helps Google and AI understand your entities.", tag: "AI Search" },
      { title: "Architecture & internal linking map", description: "How authority flows through your site and where it leaks.", tag: "Foundation" },
      { title: "Migration / release QA", description: "Pre- and post-migration QA to prevent visibility loss.", tag: "Priority" },
      { title: "Technical roadmap", description: "Ongoing prioritized backlog tied to visibility outcomes.", tag: "Execution" },
    ],
    useCases: [
      { audience: "Engineering & platform teams", detail: "Need clear, prioritized technical requirements translated from SEO findings.", signal: "Your engineering team gets SEO requests as a stream of disconnected tickets." },
      { audience: "JavaScript-heavy sites", detail: "Where rendering and indexation issues hide visibility from crawlers.", signal: "Your site relies on JavaScript and you have never validated how crawlers render it." },
      { audience: "Migrating or replatforming brands", detail: "Cannot afford silent visibility loss during platform changes.", signal: "Traffic dropped after a migration, redesign, or CMS change." },
      { audience: "Large or complex sites", detail: "Where crawl budget, faceted nav, and scale create indexation challenges.", signal: "You have tens of thousands of URLs and no clear view of what is actually indexed." },
    ],
    process: [
      { title: "Baseline", description: "Crawl, render, indexation, and Core Web Vitals assessment.", timing: "Week 1" },
      { title: "Diagnosis", description: "Root-cause analysis of visibility blockers.", timing: "Weeks 1-2" },
      { title: "Prioritized fixes", description: "Technical work ordered by impact and effort.", timing: "Weeks 2-4" },
      { title: "Validation", description: "Confirm each fix moves crawl, indexation, or performance.", timing: "Month 1" },
      { title: "Ongoing technical roadmap", description: "Continuous prioritization tied to releases and SERP changes.", timing: "Ongoing" },
    ],
    outcomes: [
      { label: "Better crawlability", description: "Crawlers reach and render the pages that matter." },
      { label: "Stronger indexation", description: "The right pages are indexed; crawl waste is removed." },
      { label: "Faster experiences", description: "Core Web Vitals aligned with user and search expectations." },
      { label: "Migration safety", description: "Visibility protected across platform changes and releases." },
      { label: "Better AI readiness", description: "Structured data helps AI surfaces parse and cite your entities." },
    ],
    faqs: [
      { q: "Do you work with engineering teams?", a: "Yes. We translate findings into prioritized, implementable requirements and validate fixes once shipped." },
      { q: "Can you handle JavaScript SEO?", a: "Yes. We test how content renders for crawlers and AI surfaces and fix gaps where JavaScript blocks visibility." },
      { q: "Do you support migrations?", a: "Yes. We provide pre-migration planning and post-migration QA to prevent silent visibility loss." },
      { q: "Is schema included?", a: "Yes. Structured data is part of the technical layer so Google and AI surfaces can parse and trust your entities." },
      { q: "How do you measure technical SEO success?", a: "Through crawl coverage, indexation of priority pages, Core Web Vitals, and the visibility that follows." },
    ],
    related: ["seo-agency", "ai-search-optimization", "ecommerce-seo", "seo-audit"],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "ai-search-optimization",
    title: "AI Search Optimization",
    shortLabel: "AI Search Optimization",
    h1: "AI Search Optimization for brands that want to be understood, cited, and chosen.",
    positioning:
      "Visibility in AI Overviews, ChatGPT, and LLM answers — without fake guarantees.",
    subheadline:
      "Taskcover makes your brand, entities, and content easy for AI-powered search surfaces to discover, understand, and cite — complementing, not replacing, your core SEO.",
    summary:
      "AI search readiness covering AI Overviews, LLM discoverability, entity clarity, structured content, and citation-worthy authority.",
    outcomePromise:
      "A clearer, more structured presence across AI answer surfaces.",
    icon: "ai",
    metaTitle: "AI Search Optimization Services (AI Overviews & LLMs)",
    metaDescription:
      "AI Search Optimization services for AI Overviews, ChatGPT, and LLM answers. Structured content, entity clarity, and citation-worthy authority — no fake guarantees.",
    problem: {
      title: "Your brand is invisible in the answers buyers actually read.",
      paragraphs: [
        "Search behavior is fragmenting across AI Overviews, ChatGPT, and other LLMs. Brands that only optimize for the classic ten blue links are losing share of the answers buyers actually read.",
        "AI surfaces reward structured, citation-worthy, entity-clear content with third-party validation — not keyword-stuffed pages.",
      ],
      bullets: [
        "Unclear entity signals — AI surfaces cannot confidently connect your brand to its topics",
        "Content not answer-ready — hard for AI to parse, summarize, or cite",
        "Lack of citation-worthy assets that AI models prefer to reference",
        "Missing third-party validation that AI surfaces use to corroborate claims",
        "FAQ and structured content not aligned with how buyers actually ask questions",
        "No tracking for AI visibility — you do not know where you stand",
      ],
      leveragePoints: [
        { text: "Clarify entity signals." },
        { text: "Build citation-worthy answer assets." },
        { text: "Align structured content with answer surfaces." },
        { text: "Improve brand consistency across AI search results." },
      ],
    },
    approach: {
      title: "Built to be understood and cited.",
      paragraphs: [
        "We structure content, schema, and entities so AI surfaces can confidently parse and reference your brand. Authority work ensures your site and mentions are the sources AI models prefer to cite.",
        "We do not promise specific AI citations — we build the conditions that make citations more likely.",
      ],
      stages: [
        { label: "Entity Model", description: "Define consistent brand, product, and topic entities across the web." },
        { label: "Answer Surface Mapping", description: "Map where buyers ask questions and how AI surfaces answer them." },
        { label: "Citation Asset Strategy", description: "Build assets AI models prefer to summarize and reference." },
        { label: "Structured Content", description: "Schema and formatting that make content machine-understandable." },
        { label: "Third-Party Validation", description: "Earned mentions that corroborate your entity and authority signals." },
        { label: "AI Visibility Review", description: "Ongoing tracking across AI surfaces alongside Google." },
      ],
    },
    deliverables: [
      { title: "AI visibility baseline", description: "Where you appear — and do not — across AI answer surfaces.", tag: "Analytics" },
      { title: "Entity clarity review", description: "Consistent brand, product, and topic entities across the web.", tag: "AI Search" },
      { title: "Answer-optimized content", description: "Structure and formatting AI can parse and summarize.", tag: "Content" },
      { title: "Structured data for AI", description: "Schema that helps AI understand and cite your content.", tag: "AI Search" },
      { title: "Citation asset plan", description: "Assets designed to be the source AI models reference.", tag: "Content" },
      { title: "Authority & validation plan", description: "Earned mentions that corroborate your entity and authority signals.", tag: "Authority" },
      { title: "FAQ & intent alignment", description: "Restructure Q&A content to match how buyers ask AI surfaces.", tag: "Content" },
      { title: "AI visibility tracking", description: "Ongoing monitoring across key AI surfaces.", tag: "Ongoing" },
    ],
    useCases: [
      { audience: "Brand-led companies", detail: "Need to be present and correctly represented in AI answers.", signal: "Your brand is mentioned inconsistently or not at all in AI answer surfaces." },
      { audience: "Considered purchases", detail: "Where buyers research via AI before deciding.", signal: "Buyers in your category ask AI tools for recommendations and you are not surfaced." },
      { audience: "Category leaders", detail: "Want to defend share of voice as search shifts to AI.", signal: "Competitors appear in AI Overviews and you do not." },
      { audience: "Technical content gaps", detail: "Have strong Google rankings but no AI surface presence.", signal: "You rank well in Google but are absent from AI Overviews and LLM answers." },
    ],
    process: [
      { title: "AI baseline", description: "Audit visibility across AI Overviews and LLM answers.", timing: "Week 1" },
      { title: "Entity & schema", description: "Make brand and content machine-understandable.", timing: "Weeks 1-2" },
      { title: "Answer optimization", description: "Restructure priority content to be citation-worthy.", timing: "Weeks 2-4" },
      { title: "Authority & validation", description: "Build earned signals that corroborate your entity clarity.", timing: "Month 1" },
      { title: "AI visibility review", description: "Ongoing monitoring across AI surfaces alongside Google.", timing: "Monthly" },
    ],
    outcomes: [
      { label: "Better AI readiness", description: "Content and entities structured for AI surfaces to cite." },
      { label: "Clearer entities", description: "AI surfaces understand who you are and what you offer." },
      { label: "Citation-worthy content", description: "Assets structured to be summarized and referenced." },
      { label: "Stronger authority signals", description: "Third-party validation corroborates your brand entity." },
      { label: "Visibility tracking", description: "Know where you stand across AI and Google surfaces." },
    ],
    faqs: [
      { q: "Can you guarantee AI citations?", a: "No. No one can guarantee specific AI citations. We build the structured, authoritative conditions that make citations more likely." },
      { q: "Is this different from regular SEO?", a: "It complements SEO. Many fundamentals overlap, but AI surfaces reward structured content, entity clarity, and citation-worthy authority even more strongly." },
      { q: "Which AI surfaces do you optimize for?", a: "We focus on AI Overviews and major LLM answer surfaces, with tracking to monitor how visibility evolves." },
      { q: "Do you write new content for AI?", a: "Sometimes. Often the highest-impact work is restructuring, schema, and authority rather than net-new content." },
      { q: "How do you measure AI visibility?", a: "Through targeted tracking of presence and mentions across key AI surfaces, alongside your Google visibility." },
    ],
    related: ["seo-agency", "technical-seo", "content-marketing", "digital-pr-link-building"],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "content-marketing",
    title: "Content Marketing",
    shortLabel: "Content Marketing",
    h1: "Content systems built for topical authority, trust, and conversion.",
    positioning:
      "Expert-led content clusters that capture intent and convert it.",
    subheadline:
      "Taskcover designs content systems around buyer intent — topic clusters, expert-led briefs, helpful articles, internal linking, refreshes, and conversion-oriented pages.",
    summary:
      "Intent-led content marketing: strategy, topic clusters, expert-led briefs, helpful articles, internal linking, refreshes, and conversion content.",
    outcomePromise:
      "Stronger topical authority and content that turns intent into pipeline.",
    icon: "content",
    metaTitle: "SEO Content Marketing Services for Topical Authority",
    metaDescription:
      "Content marketing services for topical authority, trust, and conversion. Intent-led clusters, expert-led briefs, internal linking, refreshes, and conversion content.",
    problem: {
      title: "Content that ranks but does not earn trust or revenue.",
      paragraphs: [
        "Most content programs chase volume. They publish generic posts, target broad keywords, and produce traffic that never converts. The result is bloated archives, weak topical authority, and content that AI surfaces ignore.",
        "Authority — especially for AI citations — favors expert-led, well-structured, internally linked content clusters, not isolated posts.",
      ],
      bullets: [
        "Content calendar not tied to demand — publishing without intent or revenue logic",
        "Thin or generic articles AI surfaces will not parse, cite, or recommend",
        "No topical authority map — clusters and pillar pages are missing or disconnected",
        "Weak expert review — content lacks the depth that earns trust and citations",
        "Poor internal linking — authority does not flow between related content",
        "Content does not convert — traffic arrives but never reaches pipeline",
      ],
      leveragePoints: [
        { text: "Build topic clusters around demand." },
        { text: "Create expert-led briefs instead of generic posts." },
        { text: "Connect content to conversion paths." },
        { text: "Refresh and link content so authority compounds." },
      ],
    },
    approach: {
      title: "Authority-first, intent-led content systems.",
      paragraphs: [
        "We map topics to buyer intent and revenue, then build expert-led clusters with strong internal linking. Every piece is designed to be helpful to people and citation-worthy for AI surfaces.",
        "Refreshes and pruning keep the archive healthy so quality signals compound.",
      ],
      stages: [
        { label: "Demand Map", description: "Intent-led topic map tied to revenue and funnel stage." },
        { label: "Topic Cluster Strategy", description: "Pillar and cluster architecture with internal linking." },
        { label: "Expert-Led Briefs", description: "Briefs grounded in real expertise and sources." },
        { label: "Editorial Production System", description: "People-first articles that earn trust and citations." },
        { label: "Internal Link Architecture", description: "How authority flows between clusters and conversion pages." },
        { label: "Refresh & Conversion Review", description: "Prune stale content and optimize for pipeline." },
      ],
    },
    deliverables: [
      { title: "Content strategy", description: "Topics mapped to intent, funnel, and revenue.", tag: "Strategy" },
      { title: "Topic clusters", description: "Pillar and cluster architecture with internal linking.", tag: "Content" },
      { title: "Expert-led briefs", description: "Briefs grounded in real expertise and sources.", tag: "Content" },
      { title: "Helpful articles", description: "People-first content that earns trust.", tag: "Content" },
      { title: "Content refreshes", description: "Update and consolidate existing assets.", tag: "Execution" },
      { title: "Conversion content", description: "Pages and CTAs built to convert intent.", tag: "Conversion" },
      { title: "Internal linking map", description: "How authority flows between clusters and money pages.", tag: "Foundation" },
      { title: "AI-readiness review", description: "Structure and formatting that make content citation-worthy.", tag: "AI Search" },
    ],
    useCases: [
      { audience: "B2B & SaaS", detail: "Need topical authority in crowded, comparison-driven categories.", signal: "You publish regularly but rankings, leads, and topic authority are not compounding." },
      { audience: "Education & institutions", detail: "Trust-heavy consideration cycles requiring expert content.", signal: "Your content lacks expert review and buyers do not trust it." },
      { audience: "Service businesses", detail: "Local and national intent captured with helpful, expert content.", signal: "Traffic comes but never reaches pipeline or revenue." },
      { audience: "Content debt cleanup", detail: "Large archive of posts that no longer earn trust or traffic.", signal: "You have hundreds of posts but most generate little value." },
    ],
    process: [
      { title: "Intent map", description: "Topics scored by intent, revenue, and authority potential.", timing: "Week 1" },
      { title: "Cluster design", description: "Pillar and supporting content with linking strategy.", timing: "Weeks 1-2" },
      { title: "Production", description: "Expert-led briefs and people-first articles.", timing: "Weeks 2-4" },
      { title: "Optimize & refresh", description: "Refresh, consolidate, and prune for quality.", timing: "Month 1" },
      { title: "Conversion review", description: "Optimize content toward pipeline and revenue.", timing: "Monthly" },
    ],
    outcomes: [
      { label: "More useful content clusters", description: "Pillar and cluster architecture that signals expertise." },
      { label: "Stronger topical authority", description: "Clusters that compound authority for search and AI." },
      { label: "Citation-worthy assets", description: "Structured content AI surfaces can summarize." },
      { label: "Higher lead quality", description: "Intent-led content reaches buyers earlier in the journey." },
      { label: "Healthier archive", description: "Quality signals compound instead of decay." },
    ],
    faqs: [
      { q: "Do you write the content?", a: "We provide strategy, briefs, and production support. Briefs are expert-led so content reflects genuine expertise." },
      { q: "How is content measured?", a: "By qualified demand, engagement, authority signals, and revenue contribution — not just pageviews." },
      { q: "Do you handle content refreshes?", a: "Yes. Refreshing and consolidating existing assets is often higher-impact than net-new content." },
      { q: "Is content optimized for AI search?", a: "Yes. Structure, formatting, and internal linking make content easier for AI surfaces to parse and cite." },
      { q: "How fast will content rank?", a: "Depends on competition, domain strength, and cluster maturity. Authority compounds over months, not days." },
    ],
    related: ["seo-agency", "ai-search-optimization", "digital-pr-link-building", "ecommerce-seo"],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "digital-pr-link-building",
    title: "Digital PR & Link Building",
    shortLabel: "Digital PR & Link Building",
    h1: "Authority building through relevant mentions, links, and trust signals.",
    positioning:
      "Earned authority from real publications and partners — never spam.",
    subheadline:
      "Taskcover builds authority with digital PR, earned links, brand mentions, third-party validation, media features, and expert commentary — never spammy backlink tactics.",
    summary:
      "Authority building through digital PR, earned links, brand mentions, third-party validation, media features, and expert commentary.",
    outcomePromise:
      "Clearer authority signals that compound visibility and trust.",
    icon: "pr",
    metaTitle: "Digital PR & Link Building Services for SEO Authority",
    metaDescription:
      "Digital PR and link building services that earn authority through relevant mentions, media features, and expert commentary. No spammy backlinks — just real trust signals.",
    problem: {
      title: "Links that do not build real authority.",
      paragraphs: [
        "Cheap link schemes and irrelevant directories no longer move authority — and increasingly put sites at risk. Real authority comes from relevant, earned mentions in publications and communities buyers already trust.",
        "AI surfaces also weight citation-worthy, authoritative sources — making earned PR more valuable, not less.",
      ],
      bullets: [
        "Weak third-party authority — few trusted mentions relative to competitors",
        "Random link building without relevance to your topics or buyers",
        "Few expert mentions — spokespeople are not cited in trusted publications",
        "No editorial narrative — no data stories or assets worth covering",
        "Authority not connected to SEO topics — links exist but not for the right terms",
        "No trust signals outside the website — AI surfaces cannot corroborate the brand",
      ],
      leveragePoints: [
        { text: "Build relevant third-party authority." },
        { text: "Earn citations and mentions that support topical trust." },
        { text: "Turn expertise into editorial opportunities." },
        { text: "Reduce dependence on low-quality link tactics." },
      ],
    },
    approach: {
      title: "Earned authority, real publications.",
      paragraphs: [
        "We run data-led digital PR and relationship-driven outreach to earn mentions and links from genuinely relevant publications. Every placement is something a real reader would value.",
        "We avoid spammy backlink language and tactics. Authority is earned, not bought.",
      ],
      stages: [
        { label: "Authority Audit", description: "Baseline links, mentions, and citation presence versus competitors." },
        { label: "Editorial Narrative", description: "Data stories and assets worth covering by real publications." },
        { label: "Relevant Outreach", description: "Relationship-driven PR to publications buyers already trust." },
        { label: "Expert Commentary", description: "Position spokespeople as cited authorities in the category." },
        { label: "AI Search Readiness", description: "Citation-worthy sources AI models prefer to reference." },
        { label: "Authority Reporting", description: "Authority growth tied to visibility and AI citation presence." },
      ],
    },
    deliverables: [
      { title: "Authority audit", description: "Where you stand versus competitors on links and mentions.", tag: "Authority" },
      { title: "Digital PR campaigns", description: "Data-led stories and outreach to relevant publications.", tag: "Authority" },
      { title: "Earned link building", description: "Relevant, editorial links from real sites.", tag: "Authority" },
      { title: "Expert commentary", description: "Position spokespeople as cited authorities.", tag: "Authority" },
      { title: "Brand mention tracking", description: "Monitor mentions across the web and AI surfaces.", tag: "Analytics" },
      { title: "Relevance-targeted outreach", description: "PR focused on publications your buyers already read.", tag: "Strategy" },
      { title: "Citation-worthy asset plan", description: "Assets designed to be referenced by AI surfaces.", tag: "AI Search" },
      { title: "Authority reporting", description: "Authority growth tied to visibility outcomes.", tag: "Ongoing" },
    ],
    useCases: [
      { audience: "Brand-led companies", detail: "Need trusted mentions to support visibility and AI citations.", signal: "Your brand has few mentions on trusted publications relative to competitors." },
      { audience: "Challenger brands", detail: "Closing an authority gap against established competitors.", signal: "Competitors are cited in industry publications and you are not." },
      { audience: "Spokesperson-led brands", detail: "Want experts cited in industry publications.", signal: "You have expert spokespeople but they are never quoted or referenced." },
      { audience: "AI citation gaps", detail: "Brand is absent from the sources AI models prefer to cite.", signal: "AI surfaces reference competitors but not your brand." },
    ],
    process: [
      { title: "Authority audit", description: "Baseline links, mentions, and citation presence.", timing: "Week 1" },
      { title: "Campaign strategy", description: "Data stories and targets worth earning.", timing: "Weeks 1-2" },
      { title: "Outreach", description: "Relationship-driven PR to relevant publications.", timing: "Weeks 2-4" },
      { title: "Expert commentary", description: "Position and pitch spokespeople for cited coverage.", timing: "Month 1" },
      { title: "Track & compound", description: "Monitor authority growth and AI citation presence.", timing: "Monthly" },
    ],
    outcomes: [
      { label: "Stronger authority signals", description: "Relevant links and mentions from trusted sources." },
      { label: "Better AI citation odds", description: "Authoritative sources AI models prefer to reference." },
      { label: "Brand trust", description: "Visibility on publications buyers already read." },
      { label: "Stronger entity validation", description: "Third-party mentions corroborate your brand entity." },
      { label: "Compounding visibility", description: "Authority supports rankings and AI presence." },
    ],
    faqs: [
      { q: "Do you buy links?", a: "No. We earn links and mentions through digital PR and outreach. We avoid spammy link schemes that put your site at risk." },
      { q: "How fast will we see links?", a: "Earned PR timelines vary by story and outlet. We focus on relevant, durable placements rather than quick, low-quality links." },
      { q: "Do you help with spokesperson commentary?", a: "Yes. We can position and pitch your experts for commentary in relevant publications." },
      { q: "Is link building still relevant with AI search?", a: "Yes — arguably more so. AI surfaces favor authoritative, citation-worthy sources, which earned PR helps build." },
      { q: "How do you measure authority?", a: "Through relevant links, mentions, domain authority trends, and presence on trusted publications and AI surfaces." },
    ],
    related: ["seo-agency", "content-marketing", "ai-search-optimization", "seo-audit"],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "local-seo",
    title: "Local SEO",
    shortLabel: "Local SEO",
    h1: "Local SEO for brands that need to win city, service-area, and map-based demand.",
    positioning:
      "Win the local pack, maps, and review surfaces.",
    subheadline:
      "Taskcover builds local SEO systems for Google Business Profile, location pages, reviews, local landing pages, multi-location SEO, citations, and service-area demand.",
    summary:
      "Local SEO covering Google Business Profile, location pages, reviews, local landing pages, multi-location SEO, citations, and service-area SEO.",
    outcomePromise:
      "Stronger presence in the local pack, maps, and review surfaces.",
    icon: "local",
    metaTitle: "Local SEO Services for Multi-Location & Service-Area Brands",
    metaDescription:
      "Local SEO services for Google Business Profile, location pages, reviews, multi-location SEO, citations, and service-area demand across the USA, Canada, and Australia.",
    problem: {
      title: "You rank nationally but lose the local pack.",
      paragraphs: [
        "Local demand is decided in the map pack, on reviews, and across location-specific intent — not on generic category pages. Many brands invest in national SEO while leaking the local demand closest to revenue.",
        "Multi-location and service-area brands face added complexity: inconsistent data across locations, weak location pages, and review gaps that are never used strategically.",
      ],
      bullets: [
        "Weak Google Business Profile structure — categories, services, and posts underused",
        "Poor local pack visibility for high-intent terms in your service areas",
        "Inconsistent city and service-area pages — thin, duplicated, or missing",
        "Review signals not used strategically — earned slowly, rarely responded to",
        "Local citations and NAP inconsistencies across directories",
        "No local conversion path — map traffic does not reach calls, forms, or visits",
      ],
      leveragePoints: [
        { text: "Strengthen Google Business Profile and local landing pages." },
        { text: "Build local trust signals." },
        { text: "Improve city/service-area search coverage." },
        { text: "Connect local visibility to calls, bookings, or leads." },
      ],
    },
    approach: {
      title: "A scalable local system, location by location.",
      paragraphs: [
        "We build a local SEO architecture that scales across locations while staying specific — GBP optimization, location and service-area pages, review strategy, and citation consistency.",
        "For multi-location and franchise brands, we design templated-but-unique pages that avoid the doorway-page trap.",
      ],
      stages: [
        { label: "Local Baseline", description: "Local visibility, GBP, review, and citation baseline." },
        { label: "GBP & Citation Structure", description: "Categories, services, posts, and consistent NAP across directories." },
        { label: "Location Architecture", description: "Scalable, unique location and service-area pages with schema." },
        { label: "Review Strategy", description: "Earn reviews ethically, respond at scale, and use them as signals." },
        { label: "Local Conversion Path", description: "Route map and pack traffic toward calls, forms, and visits." },
        { label: "Multi-Location Reporting", description: "Local pack and maps performance by location and market." },
      ],
    },
    deliverables: [
      { title: "GBP optimization", description: "Google Business Profile setup, optimization, and posts.", tag: "Local" },
      { title: "Location page architecture", description: "Scalable, unique location and service-area pages.", tag: "Local" },
      { title: "Local citation cleanup", description: "Consistent NAP across directories.", tag: "Local" },
      { title: "Review strategy", description: "Earn reviews ethically and respond at scale.", tag: "Local" },
      { title: "Local landing pages", description: "City and service-area pages tied to intent.", tag: "Conversion" },
      { title: "Local schema & markup", description: "Location, service-area, and review structured data.", tag: "Technical" },
      { title: "Multi-location reporting", description: "Performance by location and market.", tag: "Analytics" },
      { title: "Local conversion path", description: "Route map and pack traffic toward calls, forms, and visits.", tag: "Conversion" },
    ],
    useCases: [
      { audience: "Multi-location & franchise brands", detail: "Need consistent, scalable local presence.", signal: "You operate many locations but GBP, pages, and citations are inconsistent." },
      { audience: "Service-area businesses", detail: "Win demand across cities without physical locations.", signal: "You serve multiple cities but have no service-area page strategy." },
      { audience: "Local service providers", detail: "Healthcare, legal, home services, and education.", signal: "You are missing from the local pack for the terms closest to revenue." },
      { audience: "Review gaps", detail: "Few reviews relative to competitors, and no response strategy.", signal: "Competitors have more — and better-managed — reviews than you." },
    ],
    process: [
      { title: "Local audit", description: "GBP, pack, review, and citation baseline.", timing: "Week 1" },
      { title: "Architecture", description: "Location and service-area page strategy.", timing: "Weeks 1-2" },
      { title: "Optimization", description: "GBP, citations, and unique local content.", timing: "Weeks 2-4" },
      { title: "Review strategy", description: "Earn and manage reviews; respond at scale.", timing: "Month 1" },
      { title: "Reviews & reporting", description: "Track by location and market; optimize conversion paths.", timing: "Monthly" },
    ],
    outcomes: [
      { label: "Stronger local pack presence", description: "More visibility in maps and local results." },
      { label: "Scalable location pages", description: "Unique, useful pages without doorway-page risk." },
      { label: "Better reputation signals", description: "More and better-managed reviews across locations." },
      { label: "Stronger local conversion path", description: "Map and pack traffic reaches calls, forms, and visits." },
      { label: "Clear local reporting", description: "Performance visibility by location and market." },
    ],
    faqs: [
      { q: "Do you support service-area businesses without storefronts?", a: "Yes. We design service-area pages and GBP strategies for businesses that serve customers across cities without physical locations." },
      { q: "Can you handle franchise / multi-location SEO?", a: "Yes. We build scalable architectures with unique, useful location pages that avoid doorway-page problems." },
      { q: "Do you manage reviews?", a: "We provide review-earning strategies and response guidance. We do not post fake reviews." },
      { q: "Is local SEO different by country?", a: "Yes. We tailor local work to the USA, Canada, and Australia, including region-specific directories and review behaviors." },
      { q: "How long does local SEO take?", a: "Many local wins compound over weeks to months; multi-location programs are typically structured in 90-day sprints." },
    ],
    related: ["seo-agency", "ecommerce-seo", "technical-seo", "seo-audit"],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "ecommerce-seo",
    title: "eCommerce SEO",
    shortLabel: "eCommerce SEO",
    h1: "eCommerce SEO for categories, products, and buying-intent search demand.",
    positioning:
      "Revenue-focused category and product visibility.",
    subheadline:
      "Taskcover builds eCommerce SEO systems for category architecture, product page optimization, faceted navigation, technical SEO, content hubs, internal linking, and conversion paths.",
    summary:
      "eCommerce SEO covering category architecture, product pages, faceted navigation, technical SEO, content hubs, internal linking, and conversion paths.",
    outcomePromise:
      "More qualified buying-intent demand and clearer conversion paths.",
    icon: "ecommerce",
    metaTitle: "eCommerce SEO Services for Categories & Products",
    metaDescription:
      "eCommerce SEO services for category architecture, product page optimization, faceted navigation, technical SEO, content hubs, and conversion paths across the USA, Canada, and Australia.",
    problem: {
      title: "Traffic to categories that never converts.",
      paragraphs: [
        "eCommerce SEO is judged by revenue, not traffic. Many stores invest in generic category content and broad keywords while leaking buying-intent demand to competitors and marketplaces.",
        "Faceted navigation, thin product pages, and weak internal linking compound the problem — and AI surfaces increasingly surface structured product data, not bloated archives.",
      ],
      bullets: [
        "Category pages not mapped to buying intent — generic templates that never convert",
        "Product pages thin or duplicated across variants and marketplaces",
        "Faceted navigation risk — creating indexation bloat and diluted authority",
        "Poor internal linking between categories, products, and content hubs",
        "Weak technical crawl paths — large catalogs with blocked or wasted crawl budget",
        "Content not supporting product discovery — buying guides and hubs are missing",
      ],
      leveragePoints: [
        { text: "Improve category and product discovery." },
        { text: "Reduce crawl waste from faceted navigation." },
        { text: "Align buying-intent content with product architecture." },
        { text: "Support better internal linking and conversion paths." },
      ],
    },
    approach: {
      title: "Built for buying intent and revenue.",
      paragraphs: [
        "We design eCommerce SEO around buying-intent demand — category architecture, product templates, faceted navigation rules, and internal linking that funnel demand toward conversion.",
        "Structured product data helps both Google and AI surfaces understand and surface your catalog.",
      ],
      stages: [
        { label: "Catalog Baseline", description: "Category, product, faceted nav, and technical crawl baseline." },
        { label: "Category Architecture", description: "Structure that maps category pages to how people search and buy." },
        { label: "Product Page System", description: "Templates for unique, indexable, conversion-ready product pages." },
        { label: "Faceted Navigation Rules", description: "Control indexation and consolidate authority across facets." },
        { label: "Buying-Intent Content Hubs", description: "Guides and category content that capture and funnel discovery." },
        { label: "Conversion Paths", description: "Internal linking and CRO from search demand to sale." },
      ],
    },
    deliverables: [
      { title: "Category architecture", description: "Structure that matches how people search and buy.", tag: "Strategy" },
      { title: "Product page optimization", description: "Templates for unique, indexable product pages.", tag: "Conversion" },
      { title: "Faceted navigation rules", description: "Control indexation and consolidate authority.", tag: "Technical" },
      { title: "Technical commerce SEO", description: "Crawl, schema, and performance for large catalogs.", tag: "Technical" },
      { title: "Content hubs", description: "Buying guides and category content that capture intent.", tag: "Content" },
      { title: "Internal linking map", description: "Funnel demand from content to products.", tag: "Foundation" },
      { title: "Product schema layer", description: "Structured data that helps Google and AI surface your catalog.", tag: "AI Search" },
      { title: "Revenue-focused reporting", description: "Tie eCommerce SEO work to qualified demand and revenue.", tag: "Analytics" },
    ],
    useCases: [
      { audience: "DTC & retail brands", detail: "Need category and product visibility that drives revenue.", signal: "Category pages get traffic but revenue does not follow." },
      { audience: "Large catalogs", detail: "Where faceted nav and scale create indexation challenges.", signal: "Faceted navigation is creating thousands of low-value indexed URLs." },
      { audience: "Marketplace challengers", detail: "Competing with marketplaces for buying-intent demand.", signal: "You are losing buying-intent demand to Amazon or other marketplaces." },
      { audience: "Thin product pages", detail: "Products share content across variants or are duplicated.", signal: "Your product pages are thin or duplicated across variants." },
    ],
    process: [
      { title: "Catalog audit", description: "Categories, products, facets, and technical baseline.", timing: "Week 1" },
      { title: "Architecture", description: "Category structure and faceted nav rules.", timing: "Weeks 1-2" },
      { title: "Optimization", description: "Product templates, schema, and content hubs.", timing: "Weeks 2-4" },
      { title: "Conversion paths", description: "Internal linking and CRO from search to sale.", timing: "Month 1" },
      { title: "Revenue review", description: "Tie SEO work to qualified demand and revenue.", timing: "Monthly" },
    ],
    outcomes: [
      { label: "More buying-intent demand", description: "Visibility on the terms that drive revenue." },
      { label: "Cleaner indexation", description: "Right pages indexed; facets controlled." },
      { label: "Stronger product pages", description: "Unique, structured, conversion-ready." },
      { label: "Better conversion paths", description: "Demand funneled from content toward purchase." },
      { label: "Better AI surface coverage", description: "Structured product data helps AI surfaces cite and surface products." },
    ],
    faqs: [
      { q: "Do you handle large catalogs?", a: "Yes. We design faceted navigation rules and scalable templates that keep large catalogs indexable and high-quality." },
      { q: "Can you help with product page templates?", a: "Yes. We define templates for unique, indexable, conversion-oriented product pages." },
      { q: "Do you cover marketplaces?", a: "Our core focus is your own store. We can advise on marketplace visibility where it intersects with search demand." },
      { q: "Is eCommerce SEO measured by revenue?", a: "Yes. We tie work to qualified demand and revenue, not just traffic." },
      { q: "Do you handle technical commerce SEO?", a: "Yes. Crawl, schema, performance, and faceted navigation are core to the engagement." },
    ],
    related: ["seo-agency", "technical-seo", "content-marketing", "seo-audit"],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "international-seo",
    title: "International SEO",
    shortLabel: "International SEO",
    h1: "International SEO for brands competing across markets, languages, and regions.",
    positioning:
      "One system, tailored to each market.",
    subheadline:
      "Taskcover builds international SEO for the USA, Canada, and Australia — market-specific content, hreflang where relevant, regional keyword research, localization, and international site architecture.",
    summary:
      "International SEO covering USA/Canada/Australia market strategy, regional keyword research, localization, hreflang, and international site architecture.",
    outcomePromise:
      "A presence tailored to each market without duplicated content.",
    icon: "international",
    metaTitle: "International SEO Services for USA, Canada & Australia",
    metaDescription:
      "International SEO services for brands competing across the USA, Canada, and Australia. Market-specific content, hreflang, regional keyword research, and localization.",
    problem: {
      title: "One global site that under-serves every market.",
      paragraphs: [
        "Translating or duplicating content across markets rarely captures local demand. Each region — USA, Canada, Australia — has distinct search behavior, competitors, trust signals, and (in Canada) language requirements.",
        "Without proper international architecture and hreflang, the wrong page ranks in the wrong market, cannibalizing visibility.",
      ],
      bullets: [
        "Market pages duplicated — same content with the country name swapped",
        "Country and language intent not separated — one page tries to serve all locales",
        "Hreflang or regional architecture unclear — wrong page ranks in wrong market",
        "Localization treated as translation only — local demand and trust signals ignored",
        "SERP behavior not analyzed by market — one keyword set applied everywhere",
        "International content lacks local trust signals — reviews, mentions, and citations",
      ],
      leveragePoints: [
        { text: "Separate country/language intent." },
        { text: "Reduce duplicated market pages." },
        { text: "Clarify hreflang/localization architecture where relevant." },
        { text: "Build market-specific search trust." },
      ],
    },
    approach: {
      title: "Global system, local execution.",
      paragraphs: [
        "We design an international architecture that uses one connected system but delivers market-specific content, keyword targeting, and trust signals for each region.",
        "Hreflang, locale strategy, and localization are implemented correctly so the right page wins the right market.",
      ],
      stages: [
        { label: "Market Prioritization", description: "Where to invest first across USA, Canada, and Australia." },
        { label: "Locale Architecture", description: "URL structure, locale strategy, and international site architecture." },
        { label: "Hreflang & Targeting", description: "Correct targeting so the right page ranks in the right market." },
        { label: "Regional Keyword Research", description: "Demand and competitors analyzed per market, not duplicated." },
        { label: "Localization Strategy", description: "Market-specific content, trust signals, and intent — not just translation." },
        { label: "Market Reporting", description: "Visibility and revenue analyzed by market and locale." },
      ],
    },
    deliverables: [
      { title: "Market prioritization", description: "Where to invest first across USA, Canada, and Australia.", tag: "Strategy" },
      { title: "International architecture", description: "URL structure and locale strategy.", tag: "Technical" },
      { title: "Hreflang implementation", description: "Correct targeting so the right page ranks locally.", tag: "Technical" },
      { title: "Regional keyword research", description: "Demand and competitors by market.", tag: "Strategy" },
      { title: "Localization strategy", description: "Market-specific content, not just translation.", tag: "Content" },
      { title: "Market trust signal plan", description: "Local reviews, mentions, and citations per market.", tag: "Authority" },
      { title: "SERP behavior analysis", description: "How each market ranks differently for the same topic.", tag: "Analytics" },
      { title: "Market reporting", description: "Visibility and revenue by region.", tag: "Analytics" },
    ],
    useCases: [
      { audience: "Multi-market brands", detail: "Competing across the USA, Canada, and Australia.", signal: "You run one site across multiple markets and the wrong locale page keeps ranking." },
      { audience: "Canadian brands", detail: "Need bilingual English/French and provincial nuance.", signal: "You serve Canada but do not properly separate English and French (Quebec) demand." },
      { audience: "APAC expansion", detail: "Entering Australia and surrounding markets.", signal: "You are expanding into Australia but your content is US-centric." },
      { audience: "Duplicate content risk", detail: "Same pages translated with the country name swapped.", signal: "Your market pages are near-duplicates that cannibalize each other." },
    ],
    process: [
      { title: "Market mapping", description: "Prioritize markets and define locale architecture.", timing: "Week 1" },
      { title: "Architecture & hreflang", description: "Implement international structure correctly.", timing: "Weeks 1-2" },
      { title: "Regional research", description: "Market-specific keyword, competitor, and SERP analysis.", timing: "Weeks 2-3" },
      { title: "Localization", description: "Market-specific content and trust signal strategy.", timing: "Weeks 3-4" },
      { title: "Track by market", description: "Measure visibility and revenue per region.", timing: "Monthly" },
    ],
    outcomes: [
      { label: "Right page, right market", description: "Locale pages rank where they should." },
      { label: "Clearer search demand map", description: "Regional intent captured, not duplicated." },
      { label: "Cleaner architecture", description: "Scalable international structure." },
      { label: "Stronger local trust signals", description: "Reviews, mentions, and citations per market." },
      { label: "Clear market reporting", description: "Visibility and revenue analyzed by region." },
    ],
    faqs: [
      { q: "Which markets do you focus on?", a: "The USA, Canada, and Australia, with architecture that can extend to additional markets." },
      { q: "Do you handle Canadian bilingual requirements?", a: "Yes. We account for English and French (Quebec) demand and provincial nuance." },
      { q: "Is hreflang included?", a: "Yes. Where relevant, we implement hreflang and locale targeting so the right page ranks in the right market." },
      { q: "Do you translate content?", a: "We provide localization strategy. Production can be handled by your team or via partners we coordinate with." },
      { q: "How do you avoid duplicate content across markets?", a: "Through distinct market-specific content, correct architecture, and hreflang — not copied pages with the country name swapped." },
    ],
    related: ["seo-agency", "local-seo", "technical-seo", "content-marketing"],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "ppc-management",
    title: "PPC Management",
    shortLabel: "PPC Management",
    h1: "PPC Management aligned with organic search growth — not random paid media.",
    positioning:
      "Demand capture across Google Ads and Microsoft Ads, tied to your search system.",
    subheadline:
      "Taskcover runs PPC as part of search growth: local PPC, global PPC, search ads, landing page alignment, conversion tracking, and paid + organic search intelligence working together.",
    summary:
      "PPC Management covering local PPC, global PPC, search ads, landing page alignment, conversion tracking, and paid + organic search intelligence.",
    outcomePromise:
      "Paid search that captures demand efficiently and reinforces your organic growth.",
    icon: "ppc",
    metaTitle: "PPC Management Services | Google Ads & Microsoft Ads",
    metaDescription:
      "PPC management services for local PPC, global PPC, search ads, landing page alignment, and conversion tracking — aligned with organic search growth across the USA, Canada, and Australia.",
    problem: {
      title: "PPC that burns budget without a search strategy behind it.",
      paragraphs: [
        "Most PPC programs run in isolation from organic search. Bids are managed without intent context, landing pages are misaligned, and conversion tracking is incomplete — so spend goes out without a clear return.",
        "When paid and organic are disconnected, you pay for demand you could own organically, and miss demand that only paid can capture quickly.",
      ],
      bullets: [
        "Wasted spend on search terms that do not convert",
        "Fragmented SEO and PPC data across separate teams",
        "Weak landing page alignment with ad intent",
        "Poor conversion tracking hiding true ROAS",
        "No demand-capture logic between local and global campaigns",
        "Budget spread thin across the wrong intent tiers",
      ],
      leveragePoints: [
        { text: "Reduce wasted spend from poor intent matching." },
        { text: "Align campaigns with landing pages and tracking." },
        { text: "Use paid search data to inform SEO." },
        { text: "Separate local/global demand capture." },
      ],
    },
    approach: {
      title: "PPC as part of your search growth system.",
      paragraphs: [
        "We position PPC as demand capture within your broader search system — not as random paid media. Search ads, landing page alignment, and conversion tracking are connected to organic intent data so every dollar works harder.",
        "Local PPC and global PPC are structured around the same intent map that powers your organic strategy, so paid and organic reinforce each other instead of competing for the same click.",
      ],
      stages: [
        { label: "Intent Map", description: "Shared paid + organic demand map and budget logic." },
        { label: "Campaign Structure", description: "Google Ads and Microsoft Ads built around buyer intent." },
        { label: "Landing Page Alignment", description: "Pages matched to ad promises and search intent." },
        { label: "Conversion Tracking", description: "End-to-end tracking from click to revenue." },
        { label: "Paid + Organic Intelligence", description: "Shared intent data so PPC and SEO reinforce each other." },
      ],
    },
    deliverables: [
      { title: "Search ads management", description: "Google Ads and Microsoft Ads structured around intent.", tag: "Core" },
      { title: "Local PPC", description: "Geo-targeted campaigns for city and regional demand.", tag: "Core" },
      { title: "Global PPC", description: "Multi-market paid search with regional nuance.", tag: "Priority" },
      { title: "Landing page alignment", description: "Pages matched to ad intent for higher conversion.", tag: "Priority" },
      { title: "Conversion tracking", description: "End-to-end tracking from click to revenue.", tag: "Foundation" },
      { title: "Paid + organic intelligence", description: "Shared intent data so paid and SEO reinforce each other.", tag: "Ongoing" },
      { title: "Budget & bid structure", description: "Spend prioritized by intent tier and demand stage.", tag: "Foundation" },
      { title: "Search term analysis", description: "Continuous query mining to cut waste and find new intent.", tag: "Ongoing" },
    ],
    useCases: [
      { audience: "Need fast demand capture", detail: "Organic compounds over months — PPC captures qualified demand now while SEO ramps.", signal: "You are launching or scaling and cannot wait for organic to compound." },
      { audience: "Need local city/regional campaigns", detail: "Geo-targeted local PPC for city, service-area, and regional demand.", signal: "You serve specific metros or regions and need to win local intent." },
      { audience: "Need multi-market paid search", detail: "Global PPC structured for USA, Canada, and Australia with regional nuance.", signal: "You compete across multiple markets with different demand patterns." },
      { audience: "Need PPC and SEO data unified", detail: "One shared intent map so paid and organic reinforce each other.", signal: "Your PPC and SEO teams work in silos and duplicate or compete." },
      { audience: "Need conversion tracking fixed", detail: "End-to-end tracking from click to lead to revenue.", signal: "You cannot confidently tie ad spend to pipeline or revenue." },
    ],
    process: [
      { title: "Intent Map", description: "Build a shared paid + organic demand map and budget logic.", timing: "Week 1" },
      { title: "Campaign Architecture", description: "Structure Google Ads and Microsoft Ads around intent tiers.", timing: "Weeks 1-2" },
      { title: "Landing Page Alignment", description: "Match landing pages to ad promises and search intent.", timing: "Weeks 2-3" },
      { title: "Tracking & Optimization", description: "Deploy conversion tracking and begin continuous bid refinement.", timing: "Weeks 3-4" },
      { title: "Search Intelligence Review", description: "Monthly search term, waste, and paid + organic opportunity review.", timing: "Monthly" },
    ],
    outcomes: [
      { label: "Better demand capture", description: "Paid search aligned to where organic is not yet strong." },
      { label: "Cleaner paid search structure", description: "Campaigns and ad groups organized by intent tier." },
      { label: "Stronger conversion tracking", description: "End-to-end attribution from click to revenue." },
      { label: "Shared SEO/PPC intelligence", description: "One intent map informing both paid and organic decisions." },
      { label: "Better budget decisions", description: "Spend prioritized by demand stage and intent value." },
    ],
    faqs: [
      { q: "Is PPC separate from your SEO services?", a: "No. We position PPC as part of search growth. Paid and organic share the same intent data so they reinforce each other rather than competing." },
      { q: "Do you manage Google Ads and Microsoft Ads?", a: "Yes. We manage search ads across Google Ads and Microsoft Ads, structured around buyer intent and revenue." },
      { q: "Can you handle local and global PPC?", a: "Yes. We run geo-targeted local PPC and multi-market global campaigns with regional nuance." },
      { q: "Do you build landing pages?", a: "We provide landing page alignment guidance so pages match ad intent and convert better. Implementation can be handled by your team or coordinated with us." },
      { q: "How do you track PPC performance?", a: "Through end-to-end conversion tracking — from click to lead to revenue — so you see true return on ad spend." },
    ],
    related: ["seo-agency", "content-marketing", "seo-audit", "ecommerce-seo"],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "seo-mentor-service",
    title: "SEO Mentor Service",
    shortLabel: "SEO Mentor Service",
    h1: "1:1 SEO mentorship, strategy coaching, and advisory for founders and teams.",
    positioning:
      "Expert SEO guidance for founders, CMOs, and in-house teams — not a black box.",
    subheadline:
      "Taskcover provides 1:1 SEO mentorship, founder and CMO advisory, in-house team training, technical SEO guidance, content strategy review, AI search guidance, and monthly strategy reviews.",
    summary:
      "SEO mentorship covering 1:1 coaching, founder/CMO advisory, team training, technical SEO guidance, content strategy review, AI search guidance, and monthly strategy reviews.",
    outcomePromise:
      "Search growth decision support so your team can execute with confidence.",
    icon: "mentor",
    metaTitle: "SEO Mentor Service | 1:1 Coaching, Advisory & Team Training",
    metaDescription:
      "SEO mentor service for founders, CMOs, and in-house teams. 1:1 coaching, strategy advisory, technical SEO guidance, content review, AI search guidance, and monthly strategy reviews.",
    problem: {
      title: "Teams that need SEO expertise, not a full agency engagement.",
      paragraphs: [
        "Many companies have in-house teams or ambitious founders who need senior SEO guidance — not a full outsourced engagement. Without expert mentorship, teams waste cycles on low-impact work, execute random SEO tactics without a roadmap, and miss the strategic shifts that matter.",
        "AI search has made this harder: most in-house teams were not trained for AI Overviews, LLM answers, or entity optimization. The result is scattered execution, unclear priorities, and a team that cannot confidently defend its SEO decisions to leadership.",
      ],
      bullets: [
        "In-house team lacks senior SEO strategy direction",
        "Founders and CMOs need advisory, not full execution",
        "Random SEO execution without a connected roadmap",
        "No clear framework for prioritizing SEO work",
        "AI search readiness is outside the team's expertise",
        "No senior review before major technical or content decisions",
      ],
      leveragePoints: [
        { text: "Give founders/CMOs senior SEO decision support." },
        { text: "Help in-house teams avoid random execution." },
        { text: "Pressure-test technical, content, and AI search priorities." },
        { text: "Create a clearer operating rhythm." },
      ],
    },
    approach: {
      title: "Mentorship that builds your team's search capability.",
      paragraphs: [
        "We provide structured 1:1 mentorship and advisory tailored to your team's level and goals. Sessions cover strategy, technical SEO, content, AI search, and prioritization — so your team gets stronger every month and stops executing random SEO tactics.",
        "This is not a generic course. It is decision support for your specific search growth challenges, with roadmap coaching that keeps work aligned to revenue.",
      ],
      stages: [
        { label: "Roadmap Coaching", description: "Priority-setting and avoiding random SEO execution." },
        { label: "Technical Review", description: "Senior guidance on crawl, indexation, and architecture." },
        { label: "Content Review", description: "Editorial and cluster guidance from a senior lens." },
        { label: "AI Search Review", description: "AI Overviews, LLM, and entity coaching for your team." },
        { label: "Monthly Strategy Review", description: "Accountability and re-prioritization each month." },
      ],
    },
    deliverables: [
      { title: "1:1 SEO advisory", description: "Regular 1:1 sessions tailored to your goals and challenges.", tag: "Core" },
      { title: "Founder / CMO decision support", description: "Strategic guidance for leadership-level SEO decisions.", tag: "Core" },
      { title: "In-house team training", description: "Up-skill your team across technical, content, and AI search.", tag: "Priority" },
      { title: "Technical SEO review", description: "Senior review of crawl, indexation, and architecture decisions.", tag: "Priority" },
      { title: "Content & AI search review", description: "Editorial and AI-readiness review from a senior lens.", tag: "Ongoing" },
      { title: "Office hours", description: "Async + scheduled access for blocking questions.", tag: "Ongoing" },
      { title: "Monthly strategy review", description: "Accountability and roadmap re-prioritization each month.", tag: "Foundation" },
      { title: "Roadmap coaching", description: "Keep work aligned to revenue and away from random tactics.", tag: "Foundation" },
    ],
    useCases: [
      { audience: "Founders & CEOs", detail: "Need senior SEO perspective for strategic decisions without outsourcing execution.", signal: "You make SEO decisions but lack a senior SEO to pressure-test them." },
      { audience: "CMOs & marketing leaders", detail: "Want expert guidance and roadmap coaching without a full agency retainer.", signal: "You lead marketing but need senior SEO decision support." },
      { audience: "In-house SEO teams", detail: "Need mentorship, training, and senior-level review before major releases.", signal: "Your team executes SEO but has no senior reviewer." },
    ],
    process: [
      { title: "Assessment", description: "Understand team capability, goals, and current challenges.", timing: "Week 1" },
      { title: "Custom curriculum", description: "Tailor mentorship sessions to your priorities and gaps.", timing: "Week 1" },
      { title: "Monthly sessions", description: "Regular 1:1 or team coaching with action items.", timing: "Monthly" },
      { title: "Office hours", description: "Async + scheduled access for blocking questions.", timing: "Ongoing" },
      { title: "Strategy review", description: "Monthly accountability and roadmap re-prioritization.", timing: "Monthly" },
    ],
    outcomes: [
      { label: "Stronger in-house capability", description: "Your team gets measurably better at SEO." },
      { label: "Better prioritization", description: "Effort aimed at high-impact work." },
      { label: "AI search confidence", description: "Team understands and acts on AI search shifts." },
      { label: "Decision support", description: "Senior-level guidance for key search decisions." },
    ],
    faqs: [
      { q: "Is this a full SEO retainer?", a: "No. The SEO Mentor Service is mentorship and advisory. If you need full execution, we can discuss a managed engagement separately." },
      { q: "Who is this best for?", a: "Founders, CMOs, and in-house teams who want senior SEO guidance, training, and accountability without outsourcing execution." },
      { q: "Do you cover AI search in mentorship?", a: "Yes. AI search readiness is a core part of the curriculum — your team will understand AI Overviews, LLM answers, and entity optimization." },
      { q: "How often are sessions?", a: "Typically monthly, with async support between sessions. We tailor cadence to your needs." },
      { q: "Can you train our whole team?", a: "Yes. We provide 1:1 mentorship for leaders and group training for in-house teams." },
    ],
    related: ["seo-agency", "technical-seo", "ai-search-optimization", "content-marketing"],
  },

  /* ---------------------------------------------------------------------- */
  {
    slug: "seo-audit",
    title: "SEO Audit",
    shortLabel: "SEO Audit",
    h1: "SEO audits that turn hidden issues into a prioritized growth roadmap.",
    positioning:
      "A clear, prioritized snapshot — and a 90-day plan to act on it.",
    subheadline:
      "Taskcover’s SEO Growth Audit covers technical snapshot, keyword opportunity map, competitor visibility gap, content authority gap, AI search readiness check, and a 90-day roadmap.",
    summary:
      "A conversion-focused SEO Growth Audit: technical snapshot, keyword opportunity map, competitor visibility gap, content authority gap, AI readiness check, and a 90-day roadmap.",
    outcomePromise:
      "Clarity on where to act first — and a 90-day plan to close the biggest gaps.",
    icon: "audit",
    metaTitle: "Free SEO Audit & Growth Roadmap | Taskcover Agency",
    metaDescription:
      "Get a free SEO Growth Audit from Taskcover Agency. Technical snapshot, keyword opportunity map, competitor visibility gap, content authority gap, AI readiness check, and a 90-day roadmap.",
    problem: {
      title: "You know SEO matters, but not where to start.",
      paragraphs: [
        "Most audits are overwhelming PDFs — long lists of issues with no prioritization, no business impact, and no path forward. Teams are left with more confusion than clarity.",
        "Worse, most audits ignore AI search entirely, even as visibility shifts to AI Overviews and LLMs.",
      ],
      bullets: [
        "Audit reports become long lists without priority or sequencing",
        "Technical issues not tied to business impact or revenue",
        "Keyword gaps not mapped to revenue or funnel stage",
        "Competitor gaps identified but never translated into a roadmap",
        "AI readiness not evaluated — a growing blind spot",
        "No clear 90-day execution plan to act on the findings",
      ],
      leveragePoints: [
        { text: "Turn issue lists into a prioritized roadmap." },
        { text: "Tie technical, content, authority, and AI search gaps to business impact." },
        { text: "Identify the first 90-day execution path." },
        { text: "Give leadership a clearer decision document." },
      ],
    },
    approach: {
      title: "An audit you can actually act on.",
      paragraphs: [
        "We assess technical health, content authority, competitor visibility, keyword opportunity, and AI search readiness — then translate findings into a prioritized 90-day roadmap.",
        "Every recommendation is scored by impact and effort, so you know what to do first.",
      ],
      stages: [
        { label: "Discovery", description: "Goals, market, buyers, revenue motion, and current state." },
        { label: "Technical & Content Baseline", description: "Crawl, indexation, performance, schema, and content authority." },
        { label: "Competitor & Keyword Analysis", description: "Visibility gaps and revenue-mapped keyword opportunity." },
        { label: "AI Readiness Check", description: "How visible and citation-ready you are across AI surfaces." },
        { label: "Prioritization", description: "Findings scored by impact and effort, tied to business outcomes." },
        { label: "90-Day Roadmap", description: "A clear, sequenced execution plan — not just a list of issues." },
      ],
    },
    deliverables: [
      { title: "Technical SEO snapshot", description: "Crawl, indexation, performance, and schema baseline.", tag: "Technical" },
      { title: "Keyword opportunity map", description: "Highest-intent demand you are missing, mapped to revenue.", tag: "Strategy" },
      { title: "Competitor visibility gap", description: "Where competitors win and you do not.", tag: "Analytics" },
      { title: "Content authority gap", description: "Topics and clusters to build authority.", tag: "Content" },
      { title: "AI search readiness check", description: "How visible you are across AI surfaces.", tag: "AI Search" },
      { title: "Business-impact scoring", description: "Every recommendation scored by impact and effort.", tag: "Strategy" },
      { title: "90-day roadmap", description: "Prioritized actions by impact and effort.", tag: "Execution" },
      { title: "Executive summary", description: "A leadership-ready view of search opportunity and risk.", tag: "Analytics" },
    ],
    useCases: [
      { audience: "New prospects", detail: "Want a clear picture before committing to a program.", signal: "You know SEO matters but have no clear view of where to start." },
      { audience: "In-house teams", detail: "Need an external, prioritized perspective.", signal: "Your team has a backlog of SEO issues but no agreed priorities." },
      { audience: "Leadership", detail: "Require a business-impact view of search opportunity.", signal: "Leadership wants SEO framed in revenue and risk, not rankings." },
      { audience: "Post-migration or post-update", detail: "Visibility dropped and you need to find out why.", signal: "Traffic dropped after an update, migration, or redesign and you need answers." },
    ],
    process: [
      { title: "Discovery", description: "Goals, market, and current state.", timing: "Day 1" },
      { title: "Audit", description: "Technical, content, authority, and AI readiness.", timing: "Days 2-4" },
      { title: "Analysis", description: "Prioritize by impact and effort.", timing: "Days 4-5" },
      { title: "Roadmap", description: "Deliver a clear 90-day action plan.", timing: "Day 5" },
      { title: "Review call", description: "Walk through findings and priorities with your team.", timing: "Week 1" },
    ],
    outcomes: [
      { label: "Cleaner prioritization", description: "Know exactly where to act first — and why." },
      { label: "Revenue-aligned", description: "Recommendations tied to business impact, not vanity metrics." },
      { label: "Better AI readiness view", description: "AI search readiness included, not ignored." },
      { label: "Actionable plan", description: "A 90-day roadmap, not just a list of issues." },
      { label: "Lower execution risk", description: "Major risks surfaced before they compound." },
    ],
    faqs: [
      { q: "Is the SEO audit really free?", a: "Yes. The SEO Growth Audit is a free, scoped deliverable designed to give you a clear, prioritized starting point." },
      { q: "What does the audit include?", a: "A technical snapshot, keyword opportunity map, competitor visibility gap, content authority gap, AI readiness check, and a 90-day roadmap." },
      { q: "How long does the audit take?", a: "Typical turnaround is a few business days after we receive access and context, depending on scope." },
      { q: "Do I have to commit to a full engagement?", a: "No. The audit is standalone. If it makes sense to continue together, we will discuss next steps." },
      { q: "Does the audit cover AI search?", a: "Yes. AI search readiness is a core part of the audit, not an afterthought." },
      { q: "Will you share the audit with my team?", a: "Yes. The audit is delivered in a format your team can act on, with prioritized recommendations." },
      { q: "Is the audit tailored to my market?", a: "Yes. We account for USA, Canada, and Australia market context where relevant." },
    ],
    related: ["seo-agency", "technical-seo", "ai-search-optimization", "content-marketing"],
  },
];

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

export function getServiceSlugs(): string[] {
  return services.map((s) => s.slug);
}

export function getRelatedServices(service: Service): Service[] {
  return service.related
    .map((slug) => getServiceBySlug(slug))
    .filter((s): s is Service => Boolean(s));
}