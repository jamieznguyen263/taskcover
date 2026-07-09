/**
 * Shared home content types — used by en/fr/es home content files.
 * Keeping the type in a neutral location avoids cross-locale import cycles
 * and lets each locale file import the canonical type.
 *
 * Task 4B: deep homepage arrays (operating-system steps, growth plays,
 * services bento, industries, markets, methodology, technology, media,
 * video proof, comparison rows, brand strip) are fully localized.
 *
 * Arrays are typed `readonly` so the English canonical `as const` data in
 * src/data/home.ts satisfies the type without spreading.
 */

export type CtaItem = { label: string; href: string };

export type OperatingSystemStep = {
  label: string;
  description: string;
  input?: string;
  action?: string;
  output?: string;
};

export type GrowthPlay = {
  title: string;
  tag: string;
  challenge: string;
  strategy: string;
  output: string;
  systemStages: readonly string[];
  cta: CtaItem;
};

export type ServicesBentoCard = {
  title: string;
  outcome: string;
  href: string;
  icon: string;
  span: "wide" | "tall" | "default";
  visual: string;
};

export type ServicesBentoFeatureCard = {
  title: string;
  outcome: string;
  href: string;
  roadmap: readonly { phase: string; detail: string }[];
  chips: readonly string[];
  outcomePreview: string;
};

export type IndustryCard = {
  title: string;
  short: string;
  pain: string;
  opportunity: string;
  solution: string;
  intentPattern?: string;
  trustSignals?: string;
  recommendedServices?: readonly string[];
  href: string;
};

export type MarketCard = {
  title: string;
  region: string;
  context: string;
  href: string;
  highlights: readonly string[];
  differentiator: string;
  mapDots: readonly { x: number; y: number }[];
};

export type MethodologyPhase = {
  phase: string;
  label: string;
  detail: string;
  steps: readonly string[];
};

export type ComparisonRow = {
  dimension: string;
  traditional: string;
  taskcover: string;
};

export type TechnologyModule = {
  id: string;
  title: string;
  detail: string;
  capabilities: readonly string[];
  monitors: string;
  decision: string;
  visual: string;
};

export type MediaCategory = {
  label: string;
  detail: string;
};

export type VideoProofSlot = {
  label: string;
  detail: string;
};

export type HeroVideoContent = {
  eyebrow: string;
  title: string;
  caption: string;
  playLabel: string;
  unavailableLabel: string;
  previewTitle: string;
  modalTitle: string;
  closeLabel: string;
  fallbackTitle: string;
  fallbackBody: string;
  previewIframeUrl?: string;
  playerIframeUrl?: string;
  posterUrl?: string;
  trustChips: readonly string[];
};

export type ClientLogoProof = {
  id: string;
  clientName: string;
  shortName?: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  href: string;
  background: "dark" | "light";
  caseStudySlug: string;
  permissionStatus: "approved-case-study";
  sourceType: string;
};

export type SearchSurface = {
  id: string;
  label: string;
  shortLabel: string;
  ariaLabel: string;
  buyersSee: string;
  taskcoverImproves: string;
  growthSupport: string;
  angle: number;
};

export type SearchSurfaceLabels = {
  desktopGuidance: string;
  mobileGuidance: string;
  startHere: string;
  defaultTitle: string;
  defaultBody: string;
  buyersSee: string;
  taskcoverImproves: string;
  growthSupport: string;
};

export type SearchDashboardSignal = {
  label: string;
  value: string;
  delta: string;
  status: string;
  icon: "search" | "trend" | "sparkles" | "gauge";
  tone: "green" | "emerald" | "teal" | "blue";
};

export type SearchDashboardOpportunity = {
  label: string;
  intent: string;
  value: string;
  x: number;
  y: number;
};

export type SearchDashboardRow = {
  label: string;
  value: string;
  status: string;
};

export type SearchDashboardTask = {
  task: string;
  impact: string;
  effort: string;
  status: string;
};

export type HomeContent = {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    proofLine: string;
    primaryCta: CtaItem;
    secondaryCta: CtaItem;
  };
  dashboard: {
    title: string;
    subtitle: string;
    disclosure: string;
    signals: readonly SearchDashboardSignal[];
    opportunityTitle: string;
    opportunitySubtitle: string;
    opportunities: readonly SearchDashboardOpportunity[];
    entityTitle: string;
    entitySubtitle: string;
    entityRows: readonly SearchDashboardRow[];
    queueTitle: string;
    queueSubtitle: string;
    queueRows: readonly SearchDashboardTask[];
    pathTitle: string;
    pathSteps: readonly string[];
    labels: {
      impact: string;
      effort: string;
      value: string;
    };
  };
  heroVideo: HeroVideoContent;
  searchHasChanged: {
    eyebrow: string;
    title: string;
    description: string;
    message: string;
    surfaces: readonly SearchSurface[];
    labels: SearchSurfaceLabels;
  };
  operatingSystem: {
    eyebrow: string;
    title: string;
    description: string;
    steps: readonly OperatingSystemStep[];
  };
  growthPlays: {
    eyebrow: string;
    title: string;
    description: string;
    featured: GrowthPlay;
    plays: readonly GrowthPlay[];
  };
  servicesBento: {
    eyebrow: string;
    title: string;
    description: string;
    featureCard: ServicesBentoFeatureCard;
    cards: readonly ServicesBentoCard[];
  };
  industries: {
    eyebrow: string;
    title: string;
    description: string;
    cards: readonly IndustryCard[];
  };
  markets: {
    eyebrow: string;
    title: string;
    description: string;
    cards: readonly MarketCard[];
  };
  methodology: {
    eyebrow: string;
    title: string;
    description: string;
    phases: readonly MethodologyPhase[];
  };
  technology: {
    eyebrow: string;
    title: string;
    description: string;
    modules: readonly TechnologyModule[];
  };
  mediaCommentary: {
    eyebrow: string;
    title: string;
    description: string;
    categories: readonly MediaCategory[];
  };
  videoProof: {
    eyebrow: string;
    title: string;
    description: string;
    slots: readonly VideoProofSlot[];
  };
  comparison: {
    eyebrow: string;
    title: string;
    description: string;
    rows: readonly ComparisonRow[];
  };
  brandExperience: {
    caption: string;
    logos: readonly ClientLogoProof[];
    cta: CtaItem;
  };
  audit: {
    eyebrow: string;
    title: string;
    description: string;
    checklist: string[];
    primaryCta: CtaItem;
  };
  caseStudyPreview: {
    eyebrow: string;
    title: string;
    description: string;
    metricLabel: string;
    metricValue: string;
    clientName: string;
    cta: CtaItem;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: { q: string; a: string }[];
  };
  finalCta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryCta: CtaItem;
    secondaryCta: CtaItem;
  };
  /** Component-level UI strings rendered inside home sections. */
  ui: {
    /** Operating system pipeline */
    osLoopLabel: string;
    osStageLabel: string;
    osInputLabel: string;
    osActionLabel: string;
    osOutputLabel: string;
    osCompoundLabel: string;
    /** Growth playbook */
    featuredPlay: string;
    challengeLabel: string;
    strategyLabel: string;
    outputLabel: string;
    connectedToSystem: string;
    /** Services bento */
    coreModule: string;
    roadmapLabel: string;
    businessOutcome: string;
    explore: string;
    /** Industries */
    activeVertical: string;
    painPoint: string;
    opportunityLabel: string;
    taskcoverSolution: string;
    intentPattern: string;
    trustSignals: string;
    recommendedServices: string;
    viewIndustry: string;
    /** Markets */
    differentiator: string;
    viewMarket: string;
    /** Methodology phases */
    phasesLabel: string;
    /** Comparison */
    traditionalLabel: string;
    taskcoverLabel: string;
    /** Video proof */
    /** Media commentary */
    /** Technology */
    /** Audit block scorecards */
    auditTechnical: string;
    auditAiReady: string;
    auditContent: string;
    auditAuthority: string;
    auditScored: string;
  };
};
