/**
 * English homepage content.
 * Canonical source of truth for the HomeContent shape.
 *
 * French/Spanish files import `HomeContent` and must keep the same keys.
 * For Task 4A, long descriptive copy may be translated in full (preferred)
 * or safely fall back to English where documented in docs/I18N_STRATEGY.md.
 */

import type { HomeContent } from "../home.types";

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
    eyebrow: "Taskcover Search Operating System",
    title: "One connected system across the full search journey.",
    description:
      "Each stage feeds the next, so visibility, authority, and conversion compound instead of sitting in disconnected deliverables. Reporting loops back into Strategy so the system keeps improving.",
  },
  growthPlays: {
    eyebrow: "Search Growth Playbook",
    title: "Repeatable plays, not one-off campaigns.",
    description:
      "Each play describes the challenge we address, the strategy we apply, and the output we produce — mapped to the Taskcover Search Operating System.",
  },
  servicesBento: {
    eyebrow: "Services",
    title: "Every service tied to a business outcome.",
    description:
      "No standalone deliverables. Each capability plugs into the search growth system and is measured against revenue and pipeline impact.",
  },
  methodology: {
    eyebrow: "Methodology",
    title: "The Taskcover 90-day SEO growth process.",
    description:
      "A repeatable rhythm that compounds visibility, authority, and conversion without becoming a black box.",
  },
  comparison: {
    eyebrow: "Why Taskcover",
    title: "Traditional SEO vendor vs Taskcover Agency.",
    description: "Same budget, very different system. Here is where the approaches diverge.",
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
};