/**
 * Homepage content arrays.
 *
 * Source of truth for the homepage so copy and structure are easy to update
 * without touching component code.
 *
 * IMPORTANT — credibility rules (see docs/SEO_STANDARDS.md):
 *  - Do NOT invent testimonials, metrics, or case-study numbers.
 *  - "Brand experience" names are referenced as selected team/partner
 *    experience only. They do not imply endorsement.
 *  - No "placeholder", "coming soon", or internal dev wording on the public
 *    homepage. A single subtle illustrative disclaimer is allowed where needed.
 */

export const heroContent = {
  eyebrow: "Search Growth Agency",
  headline: "SEO Built for Google, AI Search, and Revenue Growth.",
  subheadline:
    "Taskcover Agency helps brands in the USA, Canada, and Australia grow organic visibility, build authority, and convert high-intent search demand into measurable business outcomes.",
  proofLine:
    "Selected team and partner experience includes global brands such as Agoda, Skyscanner, British Council, Avis, and more.",
  primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
  secondaryCta: { label: "View Our Search System", href: "/methodology" },
} as const;

export const brandExperienceStrip = {
  caption:
    "Selected team and partner experience across global brands, campaigns, and search programs.",
  items: [
    "Agoda",
    "Skyscanner",
    "British Council",
    "Avis",
    "Travel SEO",
    "Education SEO",
    "SEO Campaigns",
    "Digital PR",
    "AI Search",
    "Media Features",
    "Video Reviews",
    "Spokesperson",
  ],
} as const;

export const searchHasChanged = {
  eyebrow: "Search has changed",
  title: "Search is no longer just Google blue links.",
  description:
    "Modern search demand is fragmented across Google, AI Overviews, ChatGPT and LLMs, local results, review platforms, YouTube, Reddit and forums, and industry publications. Winning means being visible and trusted everywhere buyers look.",
  message:
    "We do not separate SEO, GEO, AEO, content, and authority. We connect them into one search growth system.",
} as const;

export const operatingSystem = {
  eyebrow: "Taskcover Search Operating System",
  title: "One connected system across the full search journey.",
  description:
    "Each stage feeds the next, so visibility, authority, and conversion compound instead of sitting in disconnected deliverables. Reporting loops back into Strategy so the system keeps improving.",
  steps: [
    {
      label: "Audit",
      description: "Technical, content, authority, and AI search baseline.",
      input: "Crawl data, analytics, SERP snapshots, and competitor signals.",
      action: "Map technical health, content gaps, authority gaps, and AI readiness.",
      output: "Prioritized baseline with the highest-impact opportunities flagged.",
    },
    {
      label: "Strategy",
      description: "Priorities mapped to revenue, not vanity rankings.",
      input: "Audit findings, revenue model, and buyer intent data.",
      action: "Build an opportunity map tied to pipeline and business outcomes.",
      output: "A 90-day prioritized roadmap with clear ownership.",
    },
    {
      label: "Technical SEO",
      description: "Crawl, indexation, Core Web Vitals, and structure.",
      input: "Log files, render audits, and indexation reports.",
      action: "Fix crawl waste, improve structure, and strengthen trust signals.",
      output: "A fast, crawlable, indexable site Google and AI can trust.",
    },
    {
      label: "Content Authority",
      description: "Expert-led topic clusters tied to buyer intent.",
      input: "Intent map and gap analysis against competitors.",
      action: "Build expert-led clusters that capture and convert demand.",
      output: "A compounding content system tied to revenue intent.",
    },
    {
      label: "AI Search Readiness",
      description: "Structured data, citations, and answer-optimized assets.",
      input: "Entity model, schema audit, and answer-format review.",
      action: "Optimize for AI Overviews, ChatGPT, and LLM citations.",
      output: "Answer-ready assets that AI surfaces can find and cite.",
    },
    {
      label: "Digital PR",
      description: "Authority signals from real publications and partners.",
      input: "Authority baseline and relevance-led target list.",
      action: "Run data-led outreach and relationship-driven coverage.",
      output: "Trusted referral and authority signals (links added when confirmed).",
    },
    {
      label: "CRO",
      description: "Convert high-intent traffic into pipeline and revenue.",
      input: "Funnel analytics, heatmaps, and conversion paths.",
      action: "Remove friction and strengthen calls to action on key pages.",
      output: "Higher conversion on qualified search demand.",
    },
    {
      label: "Reporting",
      description: "Business-impact dashboards, not just traffic reports.",
      input: "Performance data across Google, AI, and revenue attribution.",
      action: "Translate signals into decisions and the next sprint plan.",
      output: "A clear review that loops insight back into Strategy.",
    },
  ],
} as const;

export const growthPlays = {
  eyebrow: "Search Growth Playbook",
  title: "Repeatable plays, not one-off campaigns.",
  description:
    "Each play describes the challenge we address, the strategy we apply, and the output we produce — mapped to the Taskcover Search Operating System.",
  featured: {
    title: "Global Travel SEO Play",
    tag: "Travel",
    challenge:
      "High-competition travel demand across multiple markets, languages, and aggregator surfaces.",
    strategy:
      "International SEO architecture, intent-led destination clusters, and digital PR for destination authority.",
    output:
      "Clear market prioritization, a direct-booking demand map, and an authority-led content roadmap.",
    systemStages: ["Audit", "Technical SEO", "Content Authority", "Digital PR"],
    cta: { label: "See the play", href: "/work/case-studies" },
  },
  plays: [
    {
      title: "Education & Institutional Trust",
      tag: "Education",
      challenge: "Building credibility for education and institutional audiences.",
      strategy:
        "Expert-led content, structured program data, and PR through trusted publications.",
      output: "Trust-first content system and authority coverage plan.",
      systemStages: ["Strategy", "Content Authority", "Digital PR"],
      cta: { label: "See the play", href: "/work/case-studies" },
    },
    {
      title: "Technical SEO Recovery",
      tag: "Technical Recovery",
      challenge:
        "Sudden visibility loss from migrations, indexation, or core updates.",
      strategy:
        "Crawl and log analysis, indexation repair, and structured rollbacks.",
      output: "Recovery roadmap with prioritized technical fixes.",
      systemStages: ["Audit", "Technical SEO", "Reporting"],
      cta: { label: "See the play", href: "/services/technical-seo" },
    },
    {
      title: "AI Search Visibility",
      tag: "AI Search",
      challenge: "Missing from AI Overviews, ChatGPT, and LLM answers.",
      strategy:
        "Answer-optimized content, structured data, and citation-worthy authority.",
      output: "AI readiness assessment and answer-optimized asset plan.",
      systemStages: ["AI Search Readiness", "Content Authority"],
      cta: { label: "See the play", href: "/services/ai-search-optimization" },
    },
    {
      title: "Digital PR & Authority",
      tag: "Digital PR",
      challenge: "Weak domain authority and low trusted referral signals.",
      strategy:
        "Data-led stories and relationship-driven outreach to relevant publications.",
      output: "Editorial coverage pipeline (links added when confirmed).",
      systemStages: ["Digital PR", "Content Authority"],
      cta: { label: "See the play", href: "/services/digital-pr-link-building" },
    },
  ],
} as const;

export const servicesBento = {
  eyebrow: "Services",
  title: "Every service tied to a business outcome.",
  description:
    "No standalone deliverables. Each capability plugs into the search growth system and is measured against revenue and pipeline impact.",
  featureCard: {
    title: "SEO Strategy",
    outcome: "A prioritized roadmap tied to revenue, not vanity rankings.",
    href: "/services/seo-agency",
    roadmap: [
      { phase: "Diagnose", detail: "Technical, content, authority, and AI baseline." },
      { phase: "Prioritize", detail: "Opportunities ranked by revenue impact." },
      { phase: "Sequence", detail: "90-day sprints with clear ownership." },
      { phase: "Compound", detail: "Authority and visibility that build over time." },
    ],
    chips: [
      "Intent mapping",
      "Revenue attribution",
      "90-day roadmap",
      "Quarterly re-plan",
    ],
    outcomePreview:
      "A decision-ready search growth roadmap your team can execute with confidence.",
  },
  cards: [
    {
      title: "Technical SEO",
      outcome: "A fast, crawlable, indexable site Google and AI can trust.",
      href: "/services/technical-seo",
      icon: "technical",
      span: "default",
      visual: "crawl",
    },
    {
      title: "AI Search Optimization",
      outcome: "Visibility in AI Overviews, ChatGPT, and LLM answers.",
      href: "/services/ai-search-optimization",
      icon: "ai",
      span: "default",
      visual: "citation",
    },
    {
      title: "Content Marketing",
      outcome: "Expert-led content clusters that capture and convert intent.",
      href: "/services/content-marketing",
      icon: "content",
      span: "wide",
      visual: "cluster",
    },
    {
      title: "Digital PR & Link Building",
      outcome: "Authority signals from real publications and partners.",
      href: "/services/digital-pr-link-building",
      icon: "pr",
      span: "default",
      visual: "authority",
    },
    {
      title: "Local SEO",
      outcome: "Win the local pack, maps, and review surfaces.",
      href: "/services/local-seo",
      icon: "local",
      span: "default",
      visual: "pins",
    },
    {
      title: "eCommerce SEO",
      outcome: "Category and product visibility that drives revenue.",
      href: "/services/ecommerce-seo",
      icon: "ecommerce",
      span: "default",
      visual: "products",
    },
    {
      title: "Analytics & Reporting",
      outcome: "Business-impact dashboards, not just traffic reports.",
      href: "/services/seo-audit",
      icon: "analytics",
      span: "wide",
      visual: "dashboard",
    },
  ],
} as const;

export const industries = {
  eyebrow: "Industries",
  title: "Built for industries where search drives revenue.",
  description:
    "Each vertical has different intent patterns, competitors, and trust signals. We tailor the system accordingly.",
  cards: [
    {
      title: "Travel & Hospitality SEO",
      short: "Travel",
      pain: "High funnel leakage to OTAs and aggregators.",
      opportunity: "Capture direct-booking demand and destination authority.",
      solution: "Intent-led destination and property content systems.",
      intentPattern: "Destination, property, and comparison-heavy demand.",
      trustSignals: "Reviews, editorial coverage, and destination authority.",
      recommendedServices: ["Technical SEO", "Content Authority", "Digital PR"],
      href: "/industries/travel-seo",
    },
    {
      title: "Education & Institutional SEO",
      short: "Education",
      pain: "Long consideration cycles and trust-heavy decisions.",
      opportunity: "Own program, outcome, and comparison intent.",
      solution: "Expert-led content clusters and structured program data.",
      intentPattern: "Program, outcome, and comparison-led research journeys.",
      trustSignals: "Accreditation, outcomes, and expert commentary.",
      recommendedServices: ["SEO Strategy", "Content Authority", "AI Search Readiness"],
      href: "/industries/education-seo",
    },
    {
      title: "Healthcare & Wellness SEO",
      short: "Healthcare",
      pain: "Strict trust and compliance requirements.",
      opportunity: "Earn visibility on condition, treatment, and provider intent.",
      solution: "E-E-A-T-led content and authoritative citations.",
      intentPattern: "Condition, treatment, and provider-led demand.",
      trustSignals: "Clinical authority, citations, and E-E-A-T signals.",
      recommendedServices: ["Technical SEO", "Content Authority", "Digital PR"],
      href: "/industries/healthcare-seo",
    },
    {
      title: "Legal & Immigration SEO",
      short: "Legal",
      pain: "High-stakes, high-intent, reputation-driven demand.",
      opportunity: "Convert case-type and jurisdictional intent.",
      solution: "Trust-first content, reviews, and local authority.",
      intentPattern: "Case-type, jurisdiction, and urgent-intent demand.",
      trustSignals: "Reviews, bar credentials, and local authority.",
      recommendedServices: ["Local SEO", "Content Authority", "Digital PR"],
      href: "/industries/legal-immigration-seo",
    },
    {
      title: "SaaS & Technology SEO",
      short: "SaaS",
      pain: "Crowded category terms and comparison buyers.",
      opportunity: "Own category, alternative, and integration intent.",
      solution: "Comparison content, integrations SEO, and product-led pages.",
      intentPattern: "Category, alternative, and integration-led research.",
      trustSignals: "Product proof, integrations, and expert reviews.",
      recommendedServices: ["SEO Strategy", "Content Authority", "AI Search Readiness"],
      href: "/industries/saas-seo",
    },
    {
      title: "eCommerce SEO",
      short: "eCommerce",
      pain: "Category and product page competition.",
      opportunity: "Revenue-focused category and product visibility.",
      solution: "Technical commerce SEO and structured product data.",
      intentPattern: "Category, product, and transactional demand.",
      trustSignals: "Reviews, structured data, and fulfillment trust.",
      recommendedServices: ["Technical SEO", "CRO", "Analytics & Reporting"],
      href: "/industries/ecommerce-seo",
    },
    {
      title: "Franchise & Multi-location SEO",
      short: "Franchise",
      pain: "Inconsistent local visibility across locations.",
      opportunity: "Win each location's local pack and maps.",
      solution: "Scaled local SEO with location authority architecture.",
      intentPattern: "Near-me and location-specific demand.",
      trustSignals: "Location reviews and consistent business data.",
      recommendedServices: ["Local SEO", "Technical SEO", "Content Authority"],
      href: "/industries/franchise-local-seo",
    },
  ],
} as const;

export const markets = {
  eyebrow: "Markets",
  title: "Local context for the USA, Canada, and Australia.",
  description:
    "Each market has its own search behavior, competitors, and trust signals. We do not duplicate copy across regions.",
  cards: [
    {
      title: "USA SEO Agency",
      region: "United States",
      context:
        "Hyper-competitive national and local SERPs across 50 states, with strong AI answer adoption and review-driven trust signals.",
      href: "/markets/usa-seo-agency",
      highlights: [
        "National and local market prioritization",
        "AI answer and review surface strategy",
        "Multi-state compliance considerations",
      ],
      differentiator: "Scale and AI-answer adoption",
      mapDots: [
        { x: 25, y: 40 },
        { x: 50, y: 55 },
        { x: 75, y: 35 },
      ],
    },
    {
      title: "Canada SEO Agency",
      region: "Canada",
      context:
        "Bilingual and regional demand patterns, with strong local pack behavior and distinct provincial market dynamics. Full-site support planned for English, French, and Spanish.",
      href: "/markets/canada-seo-agency",
      highlights: [
        "English and French (Quebec) demand mapping",
        "Provincial and metro-level prioritization",
        "Bilingual content and local pack optimization",
      ],
      differentiator: "Bilingual EN/FR context",
      mapDots: [
        { x: 30, y: 30 },
        { x: 55, y: 45 },
        { x: 70, y: 25 },
      ],
    },
    {
      title: "Australia SEO Agency",
      region: "Australia",
      context:
        "Concentrated metro demand, strong local intent, and high review sensitivity across capital cities and regional hubs.",
      href: "/markets/australia-seo-agency",
      highlights: [
        "Capital city and regional market mapping",
        "Local pack and review reputation focus",
        "Cross-Tasman and APAC expansion readiness",
      ],
      differentiator: "Concentrated metro demand",
      mapDots: [
        { x: 40, y: 55 },
        { x: 60, y: 40 },
        { x: 75, y: 65 },
      ],
    },
  ],
} as const;

export const methodologyPhases = {
  eyebrow: "Methodology",
  title: "The Taskcover 90-day SEO growth process.",
  description:
    "A repeatable rhythm that compounds visibility, authority, and conversion without becoming a black box.",
  phases: [
    {
      phase: "Days 1–30",
      label: "Diagnose & Map",
      detail:
        "Baseline technical health, content, authority, and AI readiness. Map opportunities to revenue.",
      steps: ["Discovery", "SEO Growth Audit", "Opportunity Map"],
    },
    {
      phase: "Days 31–60",
      label: "Build & Fix",
      detail:
        "Execute technical fixes and build expert-led content clusters tied to buyer intent.",
      steps: ["90-Day Sprint", "Content & Authority Build"],
    },
    {
      phase: "Days 61–90",
      label: "Authority & Conversion",
      detail:
        "Compound authority with digital PR and convert qualified demand through CRO and clear reporting.",
      steps: ["Digital PR", "CRO", "Monthly Search Intelligence Review"],
    },
  ],
} as const;

export const comparisonRows = [
  {
    dimension: "Engagement model",
    traditional:
      "Monthly task checklist with unclear business priority.",
    taskcover:
      "A prioritized search growth system tied to visibility, trust, and revenue.",
  },
  {
    dimension: "Success measure",
    traditional: "Rankings reported in isolation from business outcomes.",
    taskcover:
      "Visibility, trust, qualified demand, and revenue signals tracked together.",
  },
  {
    dimension: "Content strategy",
    traditional: "Generic blog posts disconnected from buyer intent.",
    taskcover:
      "Expert-led content clusters mapped to intent and revenue.",
  },
  {
    dimension: "Reporting",
    traditional: "A traffic report with little connection to pipeline.",
    taskcover:
      "Business-impact dashboards across Google, AI search, and attribution.",
  },
  {
    dimension: "AI search",
    traditional: "Treats AI search as out of scope or ignored.",
    taskcover:
      "Google and AI search readiness built into every engagement.",
  },
  {
    dimension: "Execution transparency",
    traditional: "Black-box execution with limited visibility into priorities.",
    taskcover:
      "A transparent, prioritized roadmap with clear ownership.",
  },
  {
    dimension: "Authority signals",
    traditional: "Low-quality or volume-driven link tactics.",
    taskcover:
      "Relationship-driven digital PR with real publications and partners.",
  },
  {
    dimension: "Conversion / lead quality",
    traditional: "Traffic volume prioritized over qualified demand.",
    taskcover:
      "CRO focus on converting high-intent search demand into pipeline.",
  },
  {
    dimension: "Strategic roadmap",
    traditional: "Reactive, month-to-month task lists.",
    taskcover:
      "A 90-day roadmap that compounds and re-plans each quarter.",
  },
];

export const technologyCapabilities = {
  eyebrow: "Search Intelligence Layer",
  title: "A technology layer that turns search data into decisions.",
  description:
    "We connect crawl analysis, intent mapping, AI visibility tracking, and reporting so strategy is always evidence-led.",
  modules: [
    {
      id: "technical",
      title: "Technical crawl analysis",
      detail:
        "Render-aware crawl audits, log analysis, and indexation monitoring surface structural issues before they cost visibility.",
    },
    {
      id: "intent",
      title: "Keyword and intent mapping",
      detail:
        "Demand mapped by intent stage and tied to revenue so content targets qualified buyers, not vanity volume.",
    },
    {
      id: "ai",
      title: "AI visibility tracking",
      detail:
        "Monitoring across AI Overviews and LLM answers to see where your brand is cited — and where competitors are winning.",
    },
    {
      id: "content",
      title: "Content gap modeling",
      detail:
        "Cluster and gap analysis against competitors to prioritize the content that compounds authority.",
    },
    {
      id: "serp",
      title: "Competitor SERP analysis",
      detail:
        "SERP feature and competitor share tracking to understand the surfaces that actually drive demand.",
    },
    {
      id: "reporting",
      title: "Reporting dashboards",
      detail:
        "Business-impact reporting that connects search performance to pipeline and revenue.",
    },
    {
      id: "conversion",
      title: "Conversion tracking",
      detail:
        "Funnel and conversion-path analysis to turn qualified search demand into leads and customers.",
    },
    {
      id: "authority",
      title: "Authority monitoring",
      detail:
        "Referral, citation, and authority-signal tracking to measure the compounding effect of digital PR.",
    },
  ],
} as const;

export const mediaCommentary = {
  eyebrow: "Media & Expert Commentary",
  title: "Authority signals across search intelligence.",
  description:
    "We provide expert commentary across search intelligence, AI search, SEO strategy, and digital PR — without fabricating publications or coverage.",
  categories: [
    {
      label: "Search Intelligence Commentary",
      detail:
        "Perspective on algorithm shifts, SERP features, and organic visibility trends.",
    },
    {
      label: "AI Search Perspective",
      detail:
        "Analysis of AI Overviews, LLM answers, and how brands can earn citations.",
    },
    {
      label: "SEO Strategy Analysis",
      detail:
        "Commentary on roadmap design, intent mapping, and revenue-led search programs.",
    },
    {
      label: "Digital PR & Authority",
      detail:
        "Insight on authority signals, editorial coverage, and brand trust building.",
    },
  ],
} as const;

export const videoProofFramework = {
  eyebrow: "Trust on record",
  title: "A proof framework built for permissioned assets.",
  description:
    "We do not fabricate testimonials or videos. This framework is ready for spokesperson introductions, client review clips, and case walkthroughs when permissioned assets are provided.",
  slots: [
    {
      label: "Spokesperson intro",
      detail: "Who leads the work and why the system works.",
    },
    {
      label: "Client review clip",
      detail: "A client walks through what changed and why it mattered.",
    },
    {
      label: "Case walkthrough",
      detail: "A guided walkthrough of a search growth engagement.",
    },
  ],
} as const;

export const faqs = [
  {
    q: "What does Taskcover Agency do?",
    a: "Taskcover Agency is a search growth agency. We help brands grow organic visibility, build authority, improve AI search readiness, and convert high-intent search demand into measurable business outcomes across Google and AI-powered search surfaces.",
  },
  {
    q: "What makes Taskcover different from a traditional SEO agency?",
    a: "We treat SEO, content, authority, and AI search as one connected system rather than isolated deliverables, and we measure success against visibility, trust, leads, and revenue rather than rankings alone.",
  },
  {
    q: "Do you work with companies in the USA, Canada, and Australia?",
    a: "Yes. We work with clients across the United States, Canada, and Australia, with market-specific context for each region rather than duplicated copy.",
  },
  {
    q: "Do you guarantee rankings?",
    a: "No reputable agency can guarantee specific rankings, and we do not make ranking guarantees. We focus on durable visibility, authority, and business outcomes we can actually influence and measure.",
  },
  {
    q: "What is AI Search Optimization?",
    a: "AI Search Optimization is the practice of making your content and structured data easy for AI-powered surfaces — such as AI Overviews and LLM answers — to find, cite, and trust. It complements rather than replaces traditional SEO.",
  },
  {
    q: "How long does SEO take?",
    a: "Timelines depend on your market, competition, technical baseline, and content maturity. We typically structure work in 90-day sprints with clear priorities, while building compounding authority over the longer term.",
  },
  {
    q: "Can you support technical SEO and content together?",
    a: "Yes. Technical SEO, content, authority, and AI search readiness are delivered as one connected system, not as separate workstreams.",
  },
  {
    q: "What is included in the free SEO audit?",
    a: "The free SEO Growth Audit includes a technical snapshot, keyword opportunity map, competitor visibility gap, content authority gap, AI search readiness check, and a 90-day roadmap outline.",
  },
];

export const finalCta = {
  eyebrow: "Start your search growth system",
  title: "Build a search system your competitors cannot easily copy.",
  description:
    "Get a clear, prioritized picture of where your visibility, authority, and conversion gaps are — and a 90-day plan to close them.",
  primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
  secondaryCta: { label: "Book Strategy Call", href: "/book-a-call" },
} as const;