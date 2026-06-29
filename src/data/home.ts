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
 *  - Where real data is not yet available, use clearly-labeled placeholders
 *    (e.g. "—", "Coming soon", "Contact for details").
 */

import type { ComparisonRow } from "@/components/marketing/shared/comparison-table";
import type { ProcessStep } from "@/components/marketing/shared/process-timeline";

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
    "Selected team and partner experience includes global brands and partners.",
  items: [
    { name: "Agoda", note: "Team/partner experience" },
    { name: "Skyscanner", note: "Team/partner experience" },
    { name: "British Council", note: "Team/partner experience" },
    { name: "Avis", note: "Team/partner experience" },
    { name: "Press features", note: "Coming soon" },
    { name: "Video reviews", note: "Coming soon" },
  ],
} as const;

export const searchHasChanged = {
  eyebrow: "Search has changed",
  title: "Search is no longer just Google blue links.",
  description:
    "Modern search demand is fragmented across Google, AI Overviews, ChatGPT and LLMs, local results, review platforms, YouTube, Reddit and forums, and industry publications. Winning means being visible and trusted everywhere buyers look.",
  surfaces: [
    { label: "Google organic", note: "Core SERP visibility" },
    { label: "AI Overviews", note: "AI-assisted discovery" },
    { label: "ChatGPT & LLMs", note: "Generative answers" },
    { label: "Local results", note: "Maps & local pack" },
    { label: "Review platforms", note: "Trust & reputation" },
    { label: "YouTube", note: "Video search" },
    { label: "Reddit & forums", note: "Community search" },
    { label: "Industry publications", note: "Editorial authority" },
  ],
  message:
    "We do not separate SEO, GEO, AEO, content, and authority. We connect them into one search growth system.",
} as const;

export const operatingSystem = {
  eyebrow: "Taskcover Search Operating System",
  title: "One connected system across the full search journey.",
  description:
    "Each stage feeds the next, so visibility, authority, and conversion compound instead of sitting in disconnected deliverables.",
  steps: [
    {
      label: "Audit",
      description: "Technical, content, authority, and AI search baseline.",
    },
    {
      label: "Strategy",
      description: "Priorities mapped to revenue, not vanity rankings.",
    },
    {
      label: "Technical SEO",
      description: "Crawl, indexation, Core Web Vitals, and structure.",
    },
    {
      label: "Content Authority",
      description: "Expert-led topic clusters tied to buyer intent.",
    },
    {
      label: "AI Search Readiness",
      description: "Structured data, citations, and answer-optimized assets.",
    },
    {
      label: "Digital PR",
      description: "Authority signals from real publications and partners.",
    },
    {
      label: "CRO",
      description: "Convert high-intent traffic into pipeline and revenue.",
    },
    {
      label: "Reporting",
      description: "Business-impact dashboards, not just traffic reports.",
    },
  ],
} as const;

export const growthPlays = {
  eyebrow: "Growth plays",
  title: "Repeatable plays, not one-off campaigns.",
  description:
    "Each play describes the challenge we address, the strategy we apply, and the output we produce. Specific metrics are added only when verified client data is available.",
  cards: [
    {
      title: "Global Travel SEO Experience",
      challenge:
        "High-competition travel demand across multiple markets and languages.",
      strategy:
        "International SEO architecture, intent-led content clusters, and digital PR for destination authority.",
      output: "Clear market prioritization and an authority-led content roadmap.",
      cta: { label: "See the play", href: "/work/case-studies" },
    },
    {
      title: "Education & Institutional Trust Campaigns",
      challenge:
        "Building credibility for education and institutional audiences.",
      strategy:
        "Expert-led content, structured program data, and PR through trusted publications.",
      output: "Trust-first content system and authority coverage plan.",
      cta: { label: "See the play", href: "/work/case-studies" },
    },
    {
      title: "Technical SEO Recovery Play",
      challenge:
        "Sudden visibility loss from migrations, indexation, or core updates.",
      strategy:
        "Crawl and log analysis, indexation repair, and structured rollbacks.",
      output: "Recovery roadmap with prioritized technical fixes.",
      cta: { label: "See the play", href: "/services/technical-seo" },
    },
    {
      title: "AI Search Visibility Play",
      challenge: "Missing from AI Overviews, ChatGPT, and LLM answers.",
      strategy:
        "Answer-optimized content, structured data, and citation-worthy authority.",
      output: "AI readiness assessment and answer-optimized asset plan.",
      cta: { label: "See the play", href: "/services/ai-search-optimization" },
    },
    {
      title: "Digital PR & Authority Building",
      challenge: "Weak domain authority and low trusted referral signals.",
      strategy:
        "Data-led stories and relationship-driven outreach to relevant publications.",
      output: "Editorial coverage pipeline (links added when confirmed).",
      cta: { label: "See the play", href: "/services/digital-pr-link-building" },
    },
  ],
} as const;

export const servicesBento = {
  eyebrow: "Services",
  title: "Every service tied to a business outcome.",
  description:
    "No standalone deliverables. Each capability plugs into the search growth system and is measured against revenue and pipeline impact.",
  cards: [
    {
      title: "SEO Strategy",
      outcome: "A prioritized roadmap tied to revenue, not vanity rankings.",
      href: "/services/seo-agency",
      icon: "strategy",
    },
    {
      title: "Technical SEO",
      outcome: "A fast, crawlable, indexable site Google and AI can trust.",
      href: "/services/technical-seo",
      icon: "technical",
    },
    {
      title: "AI Search Optimization",
      outcome: "Visibility in AI Overviews, ChatGPT, and LLM answers.",
      href: "/services/ai-search-optimization",
      icon: "ai",
    },
    {
      title: "Content Marketing",
      outcome: "Expert-led content clusters that capture and convert intent.",
      href: "/services/content-marketing",
      icon: "content",
    },
    {
      title: "Digital PR & Link Building",
      outcome: "Authority signals from real publications and partners.",
      href: "/services/digital-pr-link-building",
      icon: "pr",
    },
    {
      title: "Local SEO",
      outcome: "Win the local pack, maps, and review surfaces.",
      href: "/services/local-seo",
      icon: "local",
    },
    {
      title: "eCommerce SEO",
      outcome: "Category and product visibility that drives revenue.",
      href: "/services/ecommerce-seo",
      icon: "ecommerce",
    },
    {
      title: "Analytics & Reporting",
      outcome: "Business-impact dashboards, not just traffic reports.",
      href: "/services/seo-audit",
      icon: "analytics",
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
      pain: "High funnel leakage to OTAs and aggregators.",
      opportunity: "Capture direct-booking demand and destination authority.",
      solution: "Intent-led destination and property content systems.",
      href: "/industries/travel-seo",
    },
    {
      title: "Education & Institutional SEO",
      pain: "Long consideration cycles and trust-heavy decisions.",
      opportunity: "Own program, outcome, and comparison intent.",
      solution: "Expert-led content clusters and structured program data.",
      href: "/industries/education-seo",
    },
    {
      title: "Healthcare & Wellness SEO",
      pain: "Strict trust and compliance requirements.",
      opportunity: "Earn visibility on condition, treatment, and provider intent.",
      solution: "E-E-A-T-led content and authoritative citations.",
      href: "/industries/healthcare-seo",
    },
    {
      title: "Legal & Immigration SEO",
      pain: "High-stakes, high-intent, reputation-driven demand.",
      opportunity: "Convert case-type and jurisdictional intent.",
      solution: "Trust-first content, reviews, and local authority.",
      href: "/industries/legal-immigration-seo",
    },
    {
      title: "SaaS & Technology SEO",
      pain: "Crowded category terms and comparison buyers.",
      opportunity: "Own category, alternative, and integration intent.",
      solution: "Comparison content, integrations SEO, and product-led pages.",
      href: "/industries/saas-seo",
    },
    {
      title: "eCommerce SEO",
      pain: "Category and product page competition.",
      opportunity: "Revenue-focused category and product visibility.",
      solution: "Technical commerce SEO and structured product data.",
      href: "/industries/ecommerce-seo",
    },
    {
      title: "Franchise & Multi-location SEO",
      pain: "Inconsistent local visibility across locations.",
      opportunity: "Win each location's local pack and maps.",
      solution: "Scaled local SEO with location authority architecture.",
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
      context:
        "Hyper-competitive national and local SERPs across 50 states, with strong AI answer adoption and review-driven trust signals.",
      href: "/markets/usa-seo-agency",
      highlights: [
        "National and local market prioritization",
        "AI answer and review surface strategy",
        "Multi-state compliance considerations",
      ],
    },
    {
      title: "Canada SEO Agency",
      context:
        "Bilingual and regional demand patterns, with strong local pack behavior and distinct provincial market dynamics.",
      href: "/markets/canada-seo-agency",
      highlights: [
        "English and French (Quebec) demand mapping",
        "Provincial and metro-level prioritization",
        "Local pack and maps optimization",
      ],
    },
    {
      title: "Australia SEO Agency",
      context:
        "Concentrated metro demand, strong local intent, and high review sensitivity across capital cities and regional hubs.",
      href: "/markets/australia-seo-agency",
      highlights: [
        "Capital city and regional market mapping",
        "Local pack and review reputation focus",
        "Cross-Tasman and APAC expansion readiness",
      ],
    },
  ],
} as const;

export const methodologySteps: ProcessStep[] = [
  {
    title: "Discovery",
    description:
      "We learn your business, buyers, revenue model, and current search position before recommending anything.",
  },
  {
    title: "SEO Growth Audit",
    description:
      "Technical, content, authority, and AI search readiness baseline with prioritized gaps.",
  },
  {
    title: "Opportunity Map",
    description:
      "Intent-led keyword and topic map tied to revenue and pipeline, not vanity traffic.",
  },
  {
    title: "90-Day Sprint",
    description:
      "Focused execution against the highest-impact opportunities with weekly momentum.",
  },
  {
    title: "Content & Authority Build",
    description:
      "Expert-led content clusters and digital PR that compound visibility and trust.",
  },
  {
    title: "Monthly Search Intelligence Review",
    description:
      "Business-impact reporting across Google, AI search, and revenue attribution.",
  },
];

export const comparisonRows: ComparisonRow[] = [
  {
    dimension: "Engagement model",
    traditional: "Monthly SEO tasks and checklists",
    taskcover: "A connected search growth system",
  },
  {
    dimension: "Success measure",
    traditional: "Rankings only",
    taskcover: "Visibility, trust, leads, and revenue",
  },
  {
    dimension: "Content",
    traditional: "Generic blog posts",
    taskcover: "Expert-led content clusters tied to intent",
  },
  {
    dimension: "Reporting",
    traditional: "Traffic report",
    taskcover: "Business-impact dashboard",
  },
  {
    dimension: "AI search",
    traditional: "Ignores AI search",
    taskcover: "Google + AI search readiness built in",
  },
  {
    dimension: "Execution transparency",
    traditional: "Black-box execution",
    taskcover: "Transparent, prioritized roadmap",
  },
];

export const technologyCapabilities = {
  eyebrow: "Search Intelligence Layer",
  title: "A technology layer that turns search data into decisions.",
  description:
    "We connect crawl analysis, intent mapping, AI visibility tracking, and reporting so strategy is always evidence-led.",
  capabilities: [
    "Technical crawl analysis",
    "Keyword and intent mapping",
    "AI visibility tracking",
    "Content gap modeling",
    "Competitor SERP analysis",
    "Reporting dashboards",
    "Conversion tracking",
    "Authority monitoring",
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