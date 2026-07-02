/**
 * English services localized content.
 *
 * For English, the hub + per-service short fields are sourced directly from
 * src/data/services.ts so there is a single source of truth for English copy.
 */

import { services as allServices, servicesHub } from "@/data/services";
import type { ServicesContent } from "../services.types";

function buildEnglishServices(): ServicesContent["services"] {
  const map: ServicesContent["services"] = {};
  for (const s of allServices) {
    map[s.slug] = {
      title: s.title,
      shortLabel: s.shortLabel,
      h1: s.h1,
      positioning: s.positioning,
      subheadline: s.subheadline,
      summary: s.summary,
      outcomePromise: s.outcomePromise,
      metaTitle: s.metaTitle,
      metaDescription: s.metaDescription,
    };
  }
  return map;
}

export const services: ServicesContent = {
  hub: {
    eyebrow: servicesHub.eyebrow,
    h1: servicesHub.h1,
    positioning: servicesHub.positioning,
    description: servicesHub.description,
    primaryCta: servicesHub.primaryCta,
    secondaryCta: { label: "Book Strategy Call", href: "/book-a-call" },
    connectSection: servicesHub.connectSection,
    whichServiceSection: servicesHub.whichServiceSection,
  },
  services: buildEnglishServices(),
  ui: {
    exploreService: "Explore service",
    module: "Module",
    outcome: "Outcome",
    auditPreview: "Audit preview",
    ninetyDayPlan: "90-day plan",
    illustrative: "Illustrative — each audit is scoped to your market and goals.",
    allServices: "All services",
    allServicesTitle: "Eleven connected services. One operating system.",
    allServicesDesc:
      "Engage one capability or the full system. Either way, work is measured against visibility, trust, leads, and revenue.",
    notSureEyebrow: "Start with a clear picture",
    notSureTitle: "Not sure which service to start with?",
    notSureDesc:
      "The free SEO Growth Audit identifies your biggest visibility, authority, and conversion gaps — and recommends where to focus first.",
    decisionVisibilityQ: "Need visibility?",
    decisionVisibilityA:
      "Start with SEO Strategy or Technical SEO to build a crawlable, visible foundation.",
    decisionCaptureQ: "Need demand capture?",
    decisionCaptureA: "PPC and Local SEO capture high-intent demand fast — locally and globally.",
    decisionAuthorityQ: "Need authority?",
    decisionAuthorityA:
      "Content Marketing and Digital PR build the signals google and AI surfaces cite.",
    decisionCapabilityQ: "Need team capability?",
    decisionCapabilityA:
      "SEO Mentor Service gives founders and in-house teams senior-level guidance.",
    heroCtaPrimary: "Get Free SEO Audit",
    heroCtaSecondary: "Book Strategy Call",
    heroFigcaption: "Illustrative preview — verified client data is added only with permission.",
    problemEyebrow: "Why it matters",
    problemScanner: "Issue scanner",
    problemGapCount: "common gaps",
    problemLeverage: "Where this service creates leverage",
    approachEyebrow: "The Taskcover approach",
    approachModel: "Operating model",
    approachConnect: "Every {service} engagement connects to the same search growth operating system — visibility, authority, and revenue measured together.",
    deliverablesEyebrow: "Deliverables",
    deliverablesTitle: "What you actually get.",
    deliverablesDesc: "Concrete, service-specific outputs — prioritized by impact, not activity.",
    deliverablesNumber: "#",
    deliverablesDeliverable: "Deliverable",
    deliverablesScope: "Scope",
    deliverablesTier: "Tier",
    deliverablesPreview: "{service} delivery preview — each output is scoped to your market, goals, and current search position.",
    useCasesEyebrow: "Who this is for",
    useCasesTitle: "Find the situation that matches yours.",
    useCasesDesc: "Scenario-based fit — if you recognize the trigger, this service maps to your gap.",
    useCasesTrigger: "Trigger",
    useCasesNote: "Engagements are tailored to USA, Canada, and Australia market context where relevant.",
    processEyebrow: "How we work",
    processTitle: "Phased, prioritized, and validated.",
    processDesc: "Each phase compounds — no busywork, no black boxes.",
    outcomesEyebrow: "Business outcomes",
    outcomesDesc: "Outcome categories — no fabricated metrics. Verified results are added only with attributable data.",
    relatedEyebrow: "Next best modules",
    relatedTitle: "Connect {service} to the rest of the system.",
    relatedModule: "Related module",
    faqEyebrow: "FAQ",
    faqTitle: "{service} questions, answered.",
    ctaEyebrow: "Start your search growth system",
    ctaTitle: "See exactly where {service} can move your numbers.",
    ctaDesc: "Get a free SEO Growth Audit with a prioritized 90-day roadmap across technical, content, authority, and AI search readiness.",
    ctaAuditPreview: "Audit preview",
    ctaIllustrative: "Illustrative — each audit is scoped to your market and goals.",
    breadcrumbHome: "Home",
    breadcrumbServices: "Services",
    ctaPreviewLabels: {
      "seo-agency": [
        "Search growth roadmap",
        "Technical / content / authority prioritization",
        "Reporting and KPI alignment",
        "Opportunity map",
        "90-day sprint plan",
      ],
      "technical-seo": [
        "Crawl / indexation review",
        "Core Web Vitals snapshot",
        "Schema and architecture check",
        "Migration / release risk review",
        "Technical priority roadmap",
      ],
      "ai-search-optimization": [
        "Entity clarity check",
        "AI answer surface review",
        "Citation asset gap",
        "Structured content review",
        "AI readiness roadmap",
      ],
      "content-marketing": [
        "Topic cluster gap",
        "Content quality review",
        "Internal linking map",
        "Editorial brief sample",
        "Conversion content priorities",
      ],
      "digital-pr-link-building": [
        "Authority signal review",
        "Relevant publication gap",
        "Expert commentary opportunities",
        "Link quality risk check",
        "Digital PR roadmap",
      ],
      "local-seo": [
        "Google Business Profile review",
        "Local pack visibility snapshot",
        "Location / service-area page review",
        "Review signal analysis",
        "Local conversion path roadmap",
      ],
      "ecommerce-seo": [
        "Category architecture review",
        "Product page visibility check",
        "Faceted navigation risk",
        "Buying-intent content gap",
        "Internal link opportunity map",
      ],
      "international-seo": [
        "Market architecture review",
        "Hreflang / localization check",
        "Regional keyword map",
        "Country-specific SERP gap",
        "International rollout roadmap",
      ],
      "seo-audit": [
        "Technical SEO snapshot",
        "Keyword opportunity map",
        "Competitor visibility gap",
        "Content authority gap",
        "AI search readiness check",
        "90-day roadmap",
      ],
      "ppc-management": [
        "Campaign structure review",
        "Search term waste review",
        "Landing page alignment review",
        "Conversion tracking check",
        "Paid + organic opportunity map",
      ],
      "seo-mentor-service": [
        "Team capability assessment",
        "SEO roadmap review",
        "AI search readiness coaching plan",
        "Priority decision framework",
        "Mentorship curriculum outline",
      ],
    },
    ctaPreviewDefault: [
      "Technical health",
      "Keyword opportunity",
      "AI search readiness",
    ],
  },
};
