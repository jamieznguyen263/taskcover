/**
 * English homepage content.
 * Canonical source of truth for the HomeContent shape.
 *
 * French/Spanish files import `HomeContent` and must keep the same keys.
 * Task 4B: all deep homepage arrays are localized for fr/es.
 */

import type { HomeContent } from "../home.types";
import {
  brandExperienceStrip,
  comparisonRows,
  growthPlays,
  industries,
  markets,
  mediaCommentary,
  methodologyPhases,
  operatingSystem,
  servicesBento as servicesBentoData,
  technologyCapabilities,
  videoProofFramework,
} from "@/data/home";

export const home: HomeContent = {
  hero: {
    eyebrow: "Search Growth Agency",
    headline: "SEO Built for Google, AI Search, and Revenue Growth.",
    subheadline:
      "Taskcover Agency helps brands in the USA, Canada, and Australia grow organic visibility, build authority, and convert high-intent search demand into measurable business outcomes.",
    proofLine:
      "Selected team and partner experience includes global brands such as Agoda, Skyscanner, British Council, Avis, and more.",
    primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
    secondaryCta: { label: "View Our Search System", href: "/methodology" },
  },
  searchHasChanged: {
    eyebrow: "Search has changed",
    title: "Search is no longer just Google blue links.",
    description:
      "Modern search demand is fragmented across Google, AI Overviews, ChatGPT and LLMs, local results, review platforms, YouTube, Reddit and forums, and industry publications. Winning means being visible and trusted everywhere buyers look.",
    message:
      "We do not separate SEO, GEO, AEO, content, and authority. We connect them into one search growth system.",
  },
  operatingSystem: {
    eyebrow: operatingSystem.eyebrow,
    title: operatingSystem.title,
    description: operatingSystem.description,
    steps: [...operatingSystem.steps],
  },
  growthPlays: {
    eyebrow: growthPlays.eyebrow,
    title: growthPlays.title,
    description: growthPlays.description,
    featured: growthPlays.featured,
    plays: [...growthPlays.plays],
  },
  servicesBento: {
    eyebrow: servicesBentoData.eyebrow,
    title: servicesBentoData.title,
    description: servicesBentoData.description,
    featureCard: servicesBentoData.featureCard,
    cards: [...servicesBentoData.cards],
  },
  industries: {
    eyebrow: industries.eyebrow,
    title: industries.title,
    description: industries.description,
    cards: [...industries.cards],
  },
  markets: {
    eyebrow: markets.eyebrow,
    title: markets.title,
    description: markets.description,
    cards: [...markets.cards],
  },
  methodology: {
    eyebrow: methodologyPhases.eyebrow,
    title: methodologyPhases.title,
    description: methodologyPhases.description,
    phases: [...methodologyPhases.phases],
  },
  technology: {
    eyebrow: technologyCapabilities.eyebrow,
    title: technologyCapabilities.title,
    description: technologyCapabilities.description,
    modules: [...technologyCapabilities.modules],
  },
  mediaCommentary: {
    eyebrow: mediaCommentary.eyebrow,
    title: mediaCommentary.title,
    description: mediaCommentary.description,
    categories: [...mediaCommentary.categories],
  },
  videoProof: {
    eyebrow: videoProofFramework.eyebrow,
    title: videoProofFramework.title,
    description: videoProofFramework.description,
    slots: [...videoProofFramework.slots],
  },
  comparison: {
    eyebrow: "Why Taskcover",
    title: "Traditional SEO vendor vs Taskcover Agency.",
    description: "Same budget, very different system. Here is where the approaches diverge.",
    rows: [...comparisonRows],
  },
  brandExperience: {
    caption: brandExperienceStrip.caption,
    rowBrands: [...brandExperienceStrip.rowBrands],
    rowCapabilities: [...brandExperienceStrip.rowCapabilities],
  },
  audit: {
    eyebrow: "Free SEO Growth Audit",
    title: "See exactly where your search growth is leaking.",
    description:
      "A clear, prioritized snapshot of your technical health, content authority, AI readiness, and competitive gap — with a 90-day roadmap outline.",
    checklist: [
      "Technical SEO snapshot",
      "Keyword opportunity map",
      "Competitor visibility gap",
      "Content authority gap",
      "AI search readiness check",
      "90-day roadmap",
    ],
    primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
  },
  caseStudyPreview: {
    eyebrow: "Verified case study",
    title: "British University Vietnam: +37% organic traffic.",
    description: "Explore 10 verified Taskcover Agency case studies.",
    metricLabel: "Organic traffic",
    metricValue: "+37%",
    clientName: "British University Vietnam",
    cta: { label: "View all case studies", href: "/work/case-studies" },
  },
  faq: {
    eyebrow: "FAQ",
    title: "Questions, answered directly.",
    items: [
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
    ],
  },
  finalCta: {
    eyebrow: "Start your search growth system",
    title: "Build a search system your competitors cannot easily copy.",
    description:
      "Get a clear, prioritized picture of where your visibility, authority, and conversion gaps are — and a 90-day plan to close them.",
    primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
    secondaryCta: { label: "Book Strategy Call", href: "/book-a-call" },
  },
  ui: {
    osLoopLabel: "Reporting loops insight back into Strategy",
    osStageLabel: "Stage",
    osInputLabel: "Input",
    osActionLabel: "Action",
    osOutputLabel: "Output",
    osCompoundLabel: "Each stage compounds into the next",
    featuredPlay: "Featured play",
    challengeLabel: "Challenge",
    strategyLabel: "Strategy",
    outputLabel: "Output",
    connectedToSystem: "Connected to the Search Operating System",
    coreModule: "Core module",
    roadmapLabel: "Roadmap",
    businessOutcome: "Business outcome",
    explore: "Explore",
    activeVertical: "Active vertical",
    painPoint: "Pain point",
    opportunityLabel: "Opportunity",
    taskcoverSolution: "Taskcover solution",
    intentPattern: "Intent pattern",
    trustSignals: "Trust signals",
    recommendedServices: "Recommended services",
    viewIndustry: "View",
    differentiator: "Differentiator",
    phasesLabel: "Phases",
    traditionalLabel: "Traditional SEO vendor",
    taskcoverLabel: "Taskcover Agency",
    auditTechnical: "Technical",
    auditAiReady: "AI Ready",
    auditContent: "Content",
    auditAuthority: "Authority",
    auditScored: "Scored",
  },
};
