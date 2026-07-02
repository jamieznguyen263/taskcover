/**
 * Shared markets content types — used by en/fr/es markets content files.
 *
 * Each locale exports a complete MarketsContent (hub + all 3 markets + UI
 * strings). Slugs are shared (English) across locales; only text is localized.
 *
 * Credibility rules (see docs/SEO_STANDARDS.md):
 *  - No fabricated metrics, testimonials, case-study numbers, or awards.
 *  - No claims of physical offices/headquarters in USA/Canada/Australia.
 *  - Taskcover is positioned as serving clients in these markets.
 */

/** Market icon key mapped in the visuals file. */
export type MarketIcon = "usa" | "canada" | "australia";

export type MarketFaq = { q: string; a: string };

export type MarketOutcome = { label: string; description: string };

/** Compact fit row for the recommended-industries matrix. */
export type MarketFitRow = {
  /** Industry slug (locale-independent). */
  slug: string;
  /** Localized fit reason. */
  reason: string;
  /** Fit level 1-5 (visual-only). */
  fit: 1 | 2 | 3 | 4 | 5;
};

/**
 * Full market object. All text fields are localized per locale.
 * `slug`, `icon`, `recommendedServices`, `recommendedIndustries`, and `related`
 * are locale-independent.
 */
export type Market = {
  slug: string;
  icon: MarketIcon;
  /** Short market name, e.g. "USA". */
  name: string;
  /** Region label shown in chips/breadcrumbs, e.g. "North America". */
  regionLabel: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  /** One-paragraph market context (what makes this market distinct). */
  marketContext: string;
  /** Section 2 — Search Landscape / Market Intelligence Map. */
  searchLandscape: {
    title: string;
    description: string;
    /** Distinct landscape facets shown on the radar/map. */
    facets: { label: string; detail: string }[];
  };
  /** Section 3 — Buyer Behavior / Demand Pattern. */
  buyerBehavior: {
    title: string;
    description: string;
    /** Demand-journey stages on the intent path. */
    stages: { stage: string; label: string; description: string }[];
  };
  /** Local SEO angle (always present — differs by market). */
  localSeoAngle: { title: string; description: string };
  /** National SEO angle (always present — differs by market). */
  nationalSeoAngle: { title: string; description: string };
  /** AI search opportunity angle. */
  aiSearchOpportunity: { title: string; description: string };
  /** Optional multilingual/bilingual angle (Canada English/French, USA Spanish). */
  multilingualAngle?: { title: string; description: string };
  /** Section 4 — Market Challenges / Competitive Friction Scanner. */
  marketChallenges: {
    title: string;
    description: string;
    items: { label: string; detail: string; severity: "high" | "medium" }[];
  };
  /** Section 4b — Leverage panel (where Taskcover creates leverage). */
  taskcoverApproach: {
    title: string;
    description: string;
    /** Connected operating layers for the market. */
    layers: { label: string; description: string }[];
  };
  /** Section 6 — Recommended Industries fit rows (locale-independent slugs). */
  recommendedIndustries: MarketFitRow[];
  /** Section 6b — Fit summary panel (compact narrative rows). */
  fitSummary: {
    title: string;
    rows: { label: string; value: string }[];
  };
  /** Section 7 — Recommended Services (service slugs, locale-independent). */
  recommendedServices: string[];
  /** Section 7b — Growth Stack bundle map (services grouped by role). */
  growthSystem: {
    title: string;
    description: string;
    groups: { label: string; slugs: string[] }[];
  };
  /** Section 8 — Content + Authority Plan. */
  contentAuthorityPlan: {
    title: string;
    description: string;
    /** Content cluster pipeline steps. */
    clusters: string[];
    /** Authority ladder tactics. */
    authority: string[];
  };
  /** PPC opportunity angle (capture demand in competitive commercial SERPs). */
  ppcOpportunity: { title: string; description: string };
  /** Trust signals narrative (no fake proof). */
  trustSignals: string;
  /** Section 9 — Outcomes / Business Impact (no fake metrics). */
  outcomes: MarketOutcome[];
  /** Section 10 — FAQ. */
  faqs: MarketFaq[];
  /** Section 11 — Final CTA. */
  finalCta: {
    title: string;
    description: string;
    auditLabel: string;
    auditItems: string[];
  };
  /** Related market slugs (locale-independent). */
  related: string[];
};

/** Localized markets hub content. */
export type MarketsHubLocalized = {
  eyebrow: string;
  h1: string;
  positioning: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  /** Hero figcaption for the global command visual. */
  heroFigcaption: string;
  selectorSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  comparisonSection: {
    eyebrow: string;
    title: string;
    description: string;
    /** Comparison dimension column keys (locale-independent keys). */
    dimensions: { key: string; label: string }[];
  };
  growthSystemsSection: {
    eyebrow: string;
    title: string;
    description: string;
    /** One group per market. */
    groups: { slug: string; label: string; description: string; slugs: string[] }[];
  };
  ctaSection: {
    eyebrow: string;
    title: string;
    description: string;
    auditItems: string[];
  };
};

/** Full localized markets content: hub + per-slug markets + UI strings. */
export type MarketsContent = {
  hub: MarketsHubLocalized;
  /** Map of slug -> full Market. Must cover all 3 market slugs. */
  markets: Record<string, Market>;
  /** Shared UI strings shown inside the hub and market templates. */
  ui: {
    breadcrumbHome: string;
    breadcrumbMarkets: string;
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    /** Search landscape section. */
    searchLandscapeEyebrow: string;
    searchLandscapeRadar: string;
    /** Buyer behavior section. */
    buyerBehaviorEyebrow: string;
    buyerBehaviorIntentPath: string;
    /** Challenges section. */
    challengesEyebrow: string;
    challengesScanner: string;
    challengesRiskLevel: string;
    /** Approach section. */
    approachEyebrow: string;
    approachOperatingModel: string;
    /** Local / national / AI / PPC / multilingual angle labels. */
    localSeoLabel: string;
    nationalSeoLabel: string;
    aiSearchLabel: string;
    ppcLabel: string;
    multilingualLabel: string;
    /** Recommended industries section. */
    industriesEyebrow: string;
    industriesTitle: string;
    industriesDesc: string;
    industriesFitSummary: string;
    industriesFitScale: string;
    /** Recommended services section. */
    servicesEyebrow: string;
    servicesTitle: string;
    servicesDesc: string;
    servicesGrowthStack: string;
    /** Content & authority section. */
    contentAuthorityEyebrow: string;
    contentAuthorityClusters: string;
    contentAuthorityLadder: string;
    /** Outcomes section. */
    outcomesEyebrow: string;
    outcomesDesc: string;
    /** FAQ section. */
    faqEyebrow: string;
    faqTitle: string;
    /** CTA section. */
    ctaEyebrow: string;
    ctaAuditPreview: string;
    ctaIllustrative: string;
    /** Hub selector labels. */
    selectorViewMarket: string;
    /** Hub comparison matrix labels. */
    comparisonMarket: string;
    comparisonLevels: { low: string; medium: string; high: string; veryHigh: string };
    /** Hub growth systems labels. */
    growthSystemsIncludes: string;
    /** Related markets. */
    relatedEyebrow: string;
    relatedTitle: string;
    exploreMarket: string;
    /** Outcome label. */
    outcome: string;
    /** Trust footnote (safe wording). */
    trustFootnote: string;
  };
};