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
};

export type ServiceUseCase = {
  audience: string;
  detail: string;
};

export type ServiceProcessPhase = {
  title: string;
  description: string;
};

export type ServiceOutcome = {
  label: string;
  description: string;
};

export type ServiceFaq = {
  q: string;
  a: string;
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
    | "audit";
  /** Meta title (without site suffix — the template appends it). */
  metaTitle: string;
  metaDescription: string;
  /** Problem section. */
  problem: {
    title: string;
    paragraphs: string[];
    bullets: string[];
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
        "Most SEO programs produce activity — reports, posts, tasks — without a clear line from search visibility to business outcomes. Strategy becomes a checklist instead of a growth system, and AI search is treated as someone else's problem.",
        "The result is fragmented work, slow momentum, and reporting that leadership cannot tie to pipeline.",
      ],
      bullets: [
        "Rankings move but revenue does not",
        "Technical, content, and authority work happen in silos",
        "AI Overviews and LLM answers are ignored",
        "Reporting measures traffic, not business impact",
      ],
    },
    approach: {
      title: "A search growth system, not a task list.",
      paragraphs: [
        "We start with your business model and revenue motion, then design an SEO strategy where every workstream reinforces the others. Priorities are scored by business impact, not search volume alone.",
        "AI search readiness is built in from day one — structured data, citation-worthy content, and entity clarity — so visibility compounds across Google and AI surfaces.",
      ],
      stages: [
        { label: "Audit", description: "Technical, content, authority, and AI readiness baseline." },
        { label: "Strategy", description: "Priorities mapped to revenue and pipeline." },
        { label: "AI Search Readiness", description: "Answer-optimized, structured, citation-worthy." },
        { label: "Reporting", description: "Business-impact dashboards, not just traffic." },
      ],
    },
    deliverables: [
      { title: "Search growth strategy", description: "Prioritized 90-day and 12-month roadmap tied to revenue." },
      { title: "Intent map", description: "Keyword and topic clusters mapped to buyer intent and funnel stage." },
      { title: "Operating system design", description: "How technical, content, authority, and AI work connect." },
      { title: "Measurement plan", description: "Visibility, trust, leads, and revenue KPIs with attribution logic." },
      { title: "Quarterly reset", description: "Re-baselining against SERP and AI answer changes." },
    ],
    useCases: [
      { audience: "Founders & CEOs", detail: "Need search to clearly map to revenue, not vanity metrics." },
      { audience: "Marketing leaders", detail: "Want one connected program instead of siloed SEO, content, and PR." },
      { audience: "Multi-market brands", detail: "Competing across the USA, Canada, and Australia with regional nuance." },
    ],
    process: [
      { title: "Discovery", description: "Business model, buyers, revenue motion, and current search position." },
      { title: "Growth audit", description: "Technical, content, authority, and AI readiness baseline." },
      { title: "Strategy & roadmap", description: "Prioritized plan tied to pipeline and revenue." },
      { title: "90-day sprint", description: "Highest-impact work executed with weekly momentum." },
    ],
    outcomes: [
      { label: "Clearer priorities", description: "Effort aimed at revenue, not rankings alone." },
      { label: "Connected execution", description: "Technical, content, authority, and AI in one system." },
      { label: "AI search ready", description: "Built for Google and AI answer surfaces." },
      { label: "Business-impact reporting", description: "Visibility tied to leads and revenue." },
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
        "These problems are rarely visible in a traffic report — until a core update or migration exposes them.",
      ],
      bullets: [
        "Pages excluded from the index without a clear reason",
        "JavaScript-rendered content invisible to crawlers",
        "Core Web Vitals holding back rankings",
        "Migrations or platform changes causing silent visibility loss",
      ],
    },
    approach: {
      title: "Engineered for crawlers, optimized for growth.",
      paragraphs: [
        "We treat technical SEO as a growth enabler, not a one-off audit. Crawl logs, render testing, and indexation analysis identify what is actually blocking Google and AI surfaces.",
        "Fixes are prioritized by visibility and revenue impact, then validated — so each change compounds rather than disappearing into a backlog.",
      ],
      stages: [
        { label: "Audit", description: "Crawl, render, indexation, and Core Web Vitals baseline." },
        { label: "Technical SEO", description: "Architecture, schema, JavaScript, and performance fixes." },
        { label: "AI Search Readiness", description: "Structured data AI surfaces can parse and cite." },
        { label: "Reporting", description: "Technical health tied to visibility outcomes." },
      ],
    },
    deliverables: [
      { title: "Technical SEO audit", description: "Crawl, indexation, architecture, schema, and performance review." },
      { title: "Crawl & log analysis", description: "What Googlebot and AI crawlers actually see and skip." },
      { title: "Indexation strategy", description: "Clear rules for what should — and should not — be indexed." },
      { title: "Core Web Vitals plan", description: "Prioritized performance fixes with measurable targets." },
      { title: "Structured data layer", description: "Schema that helps Google and AI understand your entities." },
      { title: "Migration support", description: "Pre- and post-migration QA to prevent visibility loss." },
    ],
    useCases: [
      { audience: "Engineering & platform teams", detail: "Need clear, prioritized technical requirements." },
      { audience: "JavaScript-heavy sites", detail: "Where rendering and indexation issues hide visibility." },
      { audience: "Migrating or replatforming brands", detail: "Cannot afford silent visibility loss." },
    ],
    process: [
      { title: "Baseline", description: "Crawl, render, indexation, and Core Web Vitals assessment." },
      { title: "Diagnosis", description: "Root-cause analysis of visibility blockers." },
      { title: "Prioritized fixes", description: "Technical work ordered by impact and effort." },
      { title: "Validation", description: "Confirm each fix moves crawl, indexation, or performance." },
    ],
    outcomes: [
      { label: "Better crawlability", description: "Crawlers reach and render the pages that matter." },
      { label: "Cleaner indexation", description: "The right pages are indexed; the rest are not." },
      { label: "Faster experiences", description: "Core Web Vitals aligned with user and search expectations." },
      { label: "Migration safety", description: "Visibility protected across platform changes." },
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
        "AI surfaces reward structured, citation-worthy, entity-clear content — not keyword-stuffed pages.",
      ],
      bullets: [
        "Missing from AI Overviews and LLM answers",
        "Brand and entity information is inconsistent across the web",
        "Content is hard for AI to parse, summarize, or cite",
        "No tracking for AI visibility",
      ],
    },
    approach: {
      title: "Built to be understood and cited.",
      paragraphs: [
        "We structure content, schema, and entities so AI surfaces can confidently parse and reference your brand. Authority work ensures your site and mentions are the sources AI models prefer to cite.",
        "We do not promise specific AI citations — we build the conditions that make citations more likely.",
      ],
      stages: [
        { label: "Audit", description: "AI visibility baseline and entity clarity check." },
        { label: "AI Search Readiness", description: "Structured, answer-optimized, citation-worthy." },
        { label: "Content Authority", description: "Content AI surfaces can summarize and cite." },
        { label: "Reporting", description: "AI visibility tracking alongside Google." },
      ],
    },
    deliverables: [
      { title: "AI visibility baseline", description: "Where you appear — and do not — across AI answer surfaces." },
      { title: "Entity clarity review", description: "Consistent brand, product, and topic entities across the web." },
      { title: "Answer-optimized content", description: "Structure and formatting AI can parse and summarize." },
      { title: "Structured data for AI", description: "Schema that helps AI understand and cite your content." },
      { title: "Authority & citation plan", description: "Become the source AI models prefer to reference." },
      { title: "AI visibility tracking", description: "Ongoing monitoring across key AI surfaces." },
    ],
    useCases: [
      { audience: "Brand-led companies", detail: "Need to be present and correctly represented in AI answers." },
      { audience: "Considered purchases", detail: "Where buyers research via AI before deciding." },
      { audience: "Category leaders", detail: "Want to defend share of voice as search shifts to AI." },
    ],
    process: [
      { title: "AI baseline", description: "Audit visibility across AI Overviews and LLM answers." },
      { title: "Entity & schema", description: "Make brand and content machine-understandable." },
      { title: "Answer optimization", description: "Restructure priority content to be citation-worthy." },
      { title: "Authority & tracking", description: "Build citation signals and monitor AI visibility." },
    ],
    outcomes: [
      { label: "Stronger AI presence", description: "More likely to appear in AI Overviews and LLM answers." },
      { label: "Clearer entities", description: "AI surfaces understand who you are and what you offer." },
      { label: "Citation-worthy content", description: "Structured to be summarized and referenced." },
      { label: "Visibility tracking", description: "Know where you stand across AI surfaces." },
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
        "High traffic, low pipeline",
        "Generic content AI surfaces will not cite",
        "No clear topical authority or clusters",
        "Stale archives that drag site quality down",
      ],
    },
    approach: {
      title: "Authority-first, intent-led content systems.",
      paragraphs: [
        "We map topics to buyer intent and revenue, then build expert-led clusters with strong internal linking. Every piece is designed to be helpful to people and citation-worthy for AI surfaces.",
        "Refreshes and pruning keep the archive healthy so quality signals compound.",
      ],
      stages: [
        { label: "Strategy", description: "Intent-led topic map tied to revenue." },
        { label: "Content Authority", description: "Expert-led clusters and internal linking." },
        { label: "AI Search Readiness", description: "Structured, citation-worthy content." },
        { label: "CRO", description: "Conversion-oriented pages and CTAs." },
      ],
    },
    deliverables: [
      { title: "Content strategy", description: "Topics mapped to intent, funnel, and revenue." },
      { title: "Topic clusters", description: "Pillar and cluster architecture with internal linking." },
      { title: "Expert-led briefs", description: "Briefs grounded in real expertise and sources." },
      { title: "Helpful articles", description: "People-first content that earns trust." },
      { title: "Content refreshes", description: "Update and consolidate existing assets." },
      { title: "Conversion content", description: "Pages and CTAs built to convert intent." },
    ],
    useCases: [
      { audience: "B2B & SaaS", detail: "Need topical authority in crowded, comparison-driven categories." },
      { audience: "Education & institutions", detail: "Trust-heavy consideration cycles requiring expert content." },
      { audience: "Service businesses", detail: "Local and national intent captured with helpful, expert content." },
    ],
    process: [
      { title: "Intent map", description: "Topics scored by intent, revenue, and authority potential." },
      { title: "Cluster design", description: "Pillar and supporting content with linking strategy." },
      { title: "Production", description: "Expert-led briefs and people-first articles." },
      { title: "Optimize & refresh", description: "Refresh, consolidate, and prune for quality." },
    ],
    outcomes: [
      { label: "Stronger topical authority", description: "Clusters that signal expertise to search and AI." },
      { label: "More qualified demand", description: "Intent-led content that reaches buyers earlier." },
      { label: "Citation-worthy assets", description: "Structured content AI surfaces can summarize." },
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
        "Low-quality links that do not move rankings",
        "No brand mentions on trusted publications",
        "Weak domain authority relative to competitors",
        "AI surfaces do not cite or reference the brand",
      ],
    },
    approach: {
      title: "Earned authority, real publications.",
      paragraphs: [
        "We run data-led digital PR and relationship-driven outreach to earn mentions and links from genuinely relevant publications. Every placement is something a real reader would value.",
        "We avoid spammy backlink language and tactics. Authority is earned, not bought.",
      ],
      stages: [
        { label: "Strategy", description: "Authority gap and publication targeting." },
        { label: "Content Authority", description: "Data stories and assets worth covering." },
        { label: "AI Search Readiness", description: "Citation-worthy authority sources." },
        { label: "Reporting", description: "Authority growth tied to visibility." },
      ],
    },
    deliverables: [
      { title: "Authority audit", description: "Where you stand versus competitors on links and mentions." },
      { title: "Digital PR campaigns", description: "Data-led stories and outreach to relevant publications." },
      { title: "Earned link building", description: "Relevant, editorial links from real sites." },
      { title: "Brand mention tracking", description: "Monitor mentions across the web and AI surfaces." },
      { title: "Expert commentary", description: "Position spokespeople as cited authorities." },
      { title: "Reporting", description: "Authority growth tied to visibility outcomes." },
    ],
    useCases: [
      { audience: "Brand-led companies", detail: "Need trusted mentions to support visibility and AI citations." },
      { audience: "Challenger brands", detail: "Closing an authority gap against established competitors." },
      { audience: "Spokesperson-led brands", detail: "Want experts cited in industry publications." },
    ],
    process: [
      { title: "Authority audit", description: "Baseline links, mentions, and citation presence." },
      { title: "Campaign strategy", description: "Data stories and targets worth earning." },
      { title: "Outreach", description: "Relationship-driven PR to relevant publications." },
      { title: "Track & compound", description: "Monitor authority growth and AI citation presence." },
    ],
    outcomes: [
      { label: "Stronger authority signals", description: "Relevant links and mentions from trusted sources." },
      { label: "Better AI citation odds", description: "Authoritative sources AI models prefer." },
      { label: "Brand trust", description: "Visibility on publications buyers already read." },
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
        "Multi-location and service-area brands face added complexity: inconsistent data across locations, weak location pages, and review gaps.",
      ],
      bullets: [
        "Missing from the local pack for high-intent terms",
        "Weak or thin location pages",
        "Inconsistent reviews and reputation",
        "Multi-location data spread across systems",
      ],
    },
    approach: {
      title: "A scalable local system, location by location.",
      paragraphs: [
        "We build a local SEO architecture that scales across locations while staying specific — GBP optimization, location and service-area pages, review strategy, and citation consistency.",
        "For multi-location and franchise brands, we design templated-but-unique pages that avoid the doorway-page trap.",
      ],
      stages: [
        { label: "Audit", description: "Local visibility, GBP, and review baseline." },
        { label: "Technical SEO", description: "Location architecture and schema." },
        { label: "Content Authority", description: "Unique, useful location and service-area pages." },
        { label: "Reporting", description: "Local pack and maps performance by location." },
      ],
    },
    deliverables: [
      { title: "GBP optimization", description: "Google Business Profile setup, optimization, and posts." },
      { title: "Location page architecture", description: "Scalable, unique location and service-area pages." },
      { title: "Local citation cleanup", description: "Consistent NAP across directories." },
      { title: "Review strategy", description: "Earn reviews ethically and respond at scale." },
      { title: "Local landing pages", description: "City and service-area pages tied to intent." },
      { title: "Multi-location reporting", description: "Performance by location and market." },
    ],
    useCases: [
      { audience: "Multi-location & franchise brands", detail: "Need consistent, scalable local presence." },
      { audience: "Service-area businesses", detail: "Win demand across cities without physical locations." },
      { audience: "Local service providers", detail: "Healthcare, legal, home services, and education." },
    ],
    process: [
      { title: "Local audit", description: "GBP, pack, review, and citation baseline." },
      { title: "Architecture", description: "Location and service-area page strategy." },
      { title: "Optimization", description: "GBP, citations, and unique local content." },
      { title: "Reviews & reporting", description: "Earn and manage reviews; track by location." },
    ],
    outcomes: [
      { label: "Stronger local pack presence", description: "More visibility in maps and local results." },
      { label: "Scalable location pages", description: "Unique, useful pages without doorway-page risk." },
      { label: "Better reputation", description: "More and better-managed reviews." },
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
        "Category pages with traffic but no revenue",
        "Faceted navigation creating indexation bloat",
        "Thin or duplicate product pages",
        "Weak internal linking between categories and products",
      ],
    },
    approach: {
      title: "Built for buying intent and revenue.",
      paragraphs: [
        "We design eCommerce SEO around buying-intent demand — category architecture, product templates, faceted navigation rules, and internal linking that funnel demand toward conversion.",
        "Structured product data helps both Google and AI surfaces understand and surface your catalog.",
      ],
      stages: [
        { label: "Audit", description: "Category, product, and faceted nav baseline." },
        { label: "Technical SEO", description: "Architecture, schema, and faceted nav rules." },
        { label: "Content Authority", description: "Content hubs and buying guides." },
        { label: "CRO", description: "Conversion paths from search to sale." },
      ],
    },
    deliverables: [
      { title: "Category architecture", description: "Structure that matches how people search and buy." },
      { title: "Product page optimization", description: "Templates for unique, indexable product pages." },
      { title: "Faceted navigation rules", description: "Control indexation and consolidate authority." },
      { title: "Technical commerce SEO", description: "Crawl, schema, and performance for large catalogs." },
      { title: "Content hubs", description: "Buying guides and category content that capture intent." },
      { title: "Internal linking", description: "Funnel demand from content to products." },
    ],
    useCases: [
      { audience: "DTC & retail brands", detail: "Need category and product visibility that drives revenue." },
      { audience: "Large catalogs", detail: "Where faceted nav and scale create indexation challenges." },
      { audience: "Marketplace challengers", detail: "Competing with marketplaces for buying-intent demand." },
    ],
    process: [
      { title: "Catalog audit", description: "Categories, products, facets, and technical baseline." },
      { title: "Architecture", description: "Category structure and faceted nav rules." },
      { title: "Optimization", description: "Product templates, schema, and content hubs." },
      { title: "Conversion paths", description: "Internal linking and CRO from search to sale." },
    ],
    outcomes: [
      { label: "More buying-intent demand", description: "Visibility on the terms that drive revenue." },
      { label: "Cleaner indexation", description: "Right pages indexed; facets controlled." },
      { label: "Stronger product pages", description: "Unique, structured, conversion-ready." },
      { label: "Better conversion paths", description: "Demand funneled toward purchase." },
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
        "Same content duplicated across regions",
        "Wrong locale page ranking in the wrong market",
        "No region-specific keyword or competitor research",
        "Missing hreflang or broken international targeting",
      ],
    },
    approach: {
      title: "Global system, local execution.",
      paragraphs: [
        "We design an international architecture that uses one connected system but delivers market-specific content, keyword targeting, and trust signals for each region.",
        "Hreflang, locale strategy, and localization are implemented correctly so the right page wins the right market.",
      ],
      stages: [
        { label: "Strategy", description: "Market prioritization and locale architecture." },
        { label: "Technical SEO", description: "Hreflang, locale URLs, and international structure." },
        { label: "Content Authority", description: "Localized, market-specific content." },
        { label: "Reporting", description: "Performance by market and locale." },
      ],
    },
    deliverables: [
      { title: "Market prioritization", description: "Where to invest first across USA, Canada, and Australia." },
      { title: "International architecture", description: "URL structure and locale strategy." },
      { title: "Hreflang implementation", description: "Correct targeting so the right page ranks locally." },
      { title: "Regional keyword research", description: "Demand and competitors by market." },
      { title: "Localization", description: "Market-specific content, not just translation." },
      { title: "Market reporting", description: "Visibility and revenue by region." },
    ],
    useCases: [
      { audience: "Multi-market brands", detail: "Competing across the USA, Canada, and Australia." },
      { audience: "Canadian brands", detail: "Need bilingual English/French and provincial nuance." },
      { audience: "APAC expansion", detail: "Entering Australia and surrounding markets." },
    ],
    process: [
      { title: "Market mapping", description: "Prioritize markets and define locale architecture." },
      { title: "Architecture & hreflang", description: "Implement international structure correctly." },
      { title: "Localization", description: "Market-specific keyword and content strategy." },
      { title: "Track by market", description: "Measure visibility and revenue per region." },
    ],
    outcomes: [
      { label: "Right page, right market", description: "Locale pages rank where they should." },
      { label: "Market-specific demand", description: "Regional intent captured, not duplicated." },
      { label: "Cleaner architecture", description: "Scalable international structure." },
      { label: "Clear market reporting", description: "Visibility and revenue by region." },
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
        "Audits full of issues, short on priorities",
        "No clear link to revenue",
        "AI search readiness not assessed",
        "No 90-day plan to act on",
      ],
    },
    approach: {
      title: "An audit you can actually act on.",
      paragraphs: [
        "We assess technical health, content authority, competitor visibility, keyword opportunity, and AI search readiness — then translate findings into a prioritized 90-day roadmap.",
        "Every recommendation is scored by impact and effort, so you know what to do first.",
      ],
      stages: [
        { label: "Audit", description: "Technical, content, authority, and AI readiness baseline." },
        { label: "Strategy", description: "Prioritized 90-day roadmap." },
        { label: "Reporting", description: "Clear, business-impact framing." },
      ],
    },
    deliverables: [
      { title: "Technical SEO snapshot", description: "Crawl, indexation, performance, and schema baseline." },
      { title: "Keyword opportunity map", description: "Highest-intent demand you are missing." },
      { title: "Competitor visibility gap", description: "Where competitors win and you do not." },
      { title: "Content authority gap", description: "Topics and clusters to build authority." },
      { title: "AI search readiness check", description: "How visible you are across AI surfaces." },
      { title: "90-day roadmap", description: "Prioritized actions by impact and effort." },
    ],
    useCases: [
      { audience: "New prospects", detail: "Want a clear picture before committing to a program." },
      { audience: "In-house teams", detail: "Need an external, prioritized perspective." },
      { audience: "Leadership", detail: "Require a business-impact view of search opportunity." },
    ],
    process: [
      { title: "Discovery", description: "Goals, market, and current state." },
      { title: "Audit", description: "Technical, content, authority, and AI readiness." },
      { title: "Analysis", description: "Prioritize by impact and effort." },
      { title: "Roadmap", description: "Deliver a clear 90-day action plan." },
    ],
    outcomes: [
      { label: "Clear priorities", description: "Know exactly where to act first." },
      { label: "Revenue-aligned", description: "Recommendations tied to business impact." },
      { label: "AI-ready view", description: "AI search readiness included, not ignored." },
      { label: "Actionable plan", description: "A 90-day roadmap, not just a list of issues." },
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