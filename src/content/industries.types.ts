/**
 * Shared industries content types — used by en/fr/es industries content files.
 *
 * Each locale exports a complete IndustriesContent (hub + all 7 industries +
 * UI strings). Slugs are shared (English) across locales; only text is
 * localized.
 */

/** Icon key mapped in the industry template / visuals. */
export type IndustryIcon =
  | "travel"
  | "education"
  | "healthcare"
  | "legal"
  | "saas"
  | "ecommerce"
  | "franchise";

export type IndustryFaq = { q: string; a: string };

export type IndustryOutcome = { label: string; description: string };

/**
 * Full industry object. All text fields are localized per locale.
 * `slug`, `icon`, `recommendedServices`, and `related` are locale-independent.
 */
export type Industry = {
  slug: string;
  icon: IndustryIcon;
  name: string;
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroDescription: string;
  marketContext: string;
  /** Section 2 — Search Behavior / Intent Map. */
  buyerSearchBehavior: string;
  searchWorkflow: {
    title: string;
    description: string;
    steps: { stage: string; label: string; description: string }[];
  };
  /** Section 3 — Pain Points / Market Friction Scanner. */
  painPoints: {
    title: string;
    description: string;
    items: { label: string; detail: string; severity: "high" | "medium" }[];
  };
  /** Section 3b — SEO Opportunities. */
  seoOpportunities: {
    title: string;
    items: string[];
  };
  /** Section 4 — Taskcover Solution / Operating Model. */
  taskcoverSolution: {
    title: string;
    description: string;
    layers: { label: string; description: string }[];
  };
  /** Section 5 — Recommended Services (service slugs, locale-independent). */
  recommendedServices: string[];
  /** Section 5b — Vertical Fit Summary (compact rows under the intro text). */
  fitSummary: {
    /** Short heading for the fit summary panel. */
    title: string;
    /** Compact fit rows shown under the recommended-services intro. */
    rows: { label: string; value: string }[];
  };
  /** Section 5c — Service Bundle Map (grouped recommended-service roles). */
  bundleMap: {
    /** Short heading for the bundle map panel. */
    title: string;
    /** Groups of services by role (Foundation / Demand / Authority / Scale). */
    groups: { label: string; slugs: string[] }[];
  };
  /** Section 6 — Content & Authority Plan / Growth System. */
  contentStrategy: {
    title: string;
    description: string;
    pillars: string[];
  };
  authorityStrategy: {
    title: string;
    description: string;
    tactics: string[];
  };
  localInternationalAngle?: {
    title: string;
    description: string;
  };
  trustSignals: string;
  /** Section 7 — Outcomes / Business Impact (no fake metrics). */
  outcomes: IndustryOutcome[];
  /** Section 8 — FAQ. */
  faqs: IndustryFaq[];
  /** Section 9 — Final CTA. */
  finalCta: {
    title: string;
    description: string;
    auditLabel: string;
    auditItems: string[];
  };
  /** Related industry slugs (locale-independent). */
  related: string[];
};

/** Localized industries hub content. */
export type IndustriesHubLocalized = {
  eyebrow: string;
  h1: string;
  positioning: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  selectorSection: {
    eyebrow: string;
    title: string;
    description: string;
    priorityBadge: string;
  };
  comparisonSection: {
    eyebrow: string;
    title: string;
    description: string;
    columns: { key: string; label: string }[];
  };
  bundlesSection: {
    eyebrow: string;
    title: string;
    description: string;
    groups: { label: string; description: string; slugs: string[] }[];
  };
  ctaSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
};

/** Full localized industries content: hub + per-slug industries + UI strings. */
export type IndustriesContent = {
  hub: IndustriesHubLocalized;
  /** Map of slug -> full Industry. Must cover all 7 industry slugs. */
  industries: Record<string, Industry>;
  /** Shared UI strings shown inside the hub and industry templates. */
  ui: {
    /** Breadcrumb labels. */
    breadcrumbHome: string;
    breadcrumbIndustries: string;
    /** Hero CTA labels. */
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    heroFigcaption: string;
    /** Search behavior section. */
    searchBehaviorEyebrow: string;
    searchBehaviorIntentMap: string;
    /** Pain points section. */
    painPointsEyebrow: string;
    painPointsScanner: string;
    painPointsRiskLevel: string;
    /** Solution section. */
    solutionEyebrow: string;
    solutionModel: string;
    /** Recommended services section. */
    servicesEyebrow: string;
    servicesTitle: string;
    servicesDesc: string;
    servicesModule: string;
    /** Vertical fit summary + bundle map panel labels. */
    servicesFitSummary: string;
    servicesBundleMap: string;
    servicesBundleFoundation: string;
    servicesBundleDemand: string;
    servicesBundleAuthority: string;
    servicesBundleScale: string;
    /** Content & authority section. */
    contentAuthorityEyebrow: string;
    contentAuthorityGrowthSystem: string;
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
    /** Hub selector / sector map labels. */
    selectorViewIndustry: string;
    selectorPriority: string;
    /** Hub comparison matrix labels. */
    comparisonIndustry: string;
    /** Hub bundle labels. */
    bundlesIncludes: string;
    /** Related industries. */
    relatedEyebrow: string;
    relatedTitle: string;
    exploreIndustry: string;
    /** Outcome label. */
    outcome: string;
  };
};