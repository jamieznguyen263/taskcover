export const pricingTabIds = ["local", "national", "global", "mentor", "audits"] as const;
export type PricingTabId = (typeof pricingTabIds)[number];
export const defaultPricingTabId: PricingTabId = "local";

export function isPricingTabId(value: unknown): value is PricingTabId {
  return typeof value === "string" && (pricingTabIds as readonly string[]).includes(value);
}

export function resolvePricingTabId(value: unknown): PricingTabId {
  const candidate = Array.isArray(value) ? value[0] : value;
  return isPricingTabId(candidate) ? candidate : defaultPricingTabId;
}

export type PricingPlan = {
  id: string;
  name: string;
  price: string;
  recommended?: boolean;
  positioning: string;
  bestFor: string[];
  includes: string[];
  scopeGuard?: string;
  minimum?: string;
  addOn?: string;
  cta?: { label: string; href: string };
};

export type PricingTab = {
  id: PricingTabId;
  label: string;
  eyebrow: string;
  title: string;
  intro: string;
  subcopy?: string;
  plans: PricingPlan[];
  notes?: string[];
  cta?: { label: string; href: string };
};

export type PricingFactor = {
  label: string;
  description: string;
};

export type PricingComparisonColumnId =
  | "localStarter"
  | "nationalFoundation"
  | "nationalGrowth"
  | "globalExpansion"
  | "mentorGrowth"
  | "enterpriseCustom";

export type PricingComparisonColumn = {
  id: PricingComparisonColumnId;
  label: string;
};

export type PricingComparisonRow = {
  label: string;
  values: Record<PricingComparisonColumnId, string>;
};

export type PricingDecisionPath = {
  id: string;
  tabId: PricingTabId;
  trigger: string;
  planName: string;
  startingPrice: string;
  why: string;
  cta: { label: string; href: string };
};

export type PricingProofGroup = {
  label: string;
  caseStudySlugs: string[];
};

export type PricingContent = {
  metadata: {
    title: string;
    description: string;
  };
  breadcrumbs: {
    home: string;
    pricing: string;
  };
  hero: {
    eyebrow: string;
    h1: string;
    subheadline: string;
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    signalChips: string[];
    commandPanel: {
      title: string;
      rows: { label: string; value: string }[];
      note: string;
    };
  };
  recurringNote: string;
  scopeNote: string;
  factors: {
    eyebrow: string;
    title: string;
    description: string;
    items: PricingFactor[];
  };
  tabs: {
    eyebrow: string;
    title: string;
    description: string;
    compareLink: string;
    ariaLabel: string;
    items: PricingTab[];
  };
  comparison: {
    eyebrow: string;
    title: string;
    description: string;
    contextTitle: string;
    contextDescription: string;
    fullComparisonLabel: string;
    hideFullComparisonLabel: string;
    columns: PricingComparisonColumn[];
    rows: PricingComparisonRow[];
    exactPricingNote: string;
  };
  decisionGuide: {
    eyebrow: string;
    title: string;
    description: string;
    ariaLabel: string;
    paths: PricingDecisionPath[];
  };
  drivers: {
    eyebrow: string;
    title: string;
    description: string;
    items: PricingFactor[];
  };
  includedExcluded: {
    eyebrow: string;
    title: string;
    description: string;
    includedTitle: string;
    excludedTitle: string;
    included: string[];
    excluded: string[];
  };
  customScope: {
    eyebrow: string;
    title: string;
    description: string;
    useCases: string[];
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
    note: string;
  };
  proof: {
    eyebrow: string;
    title: string;
    description: string;
    groups: PricingProofGroup[];
    cta: { label: string; href: string };
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
    primaryCta: { label: string; href: string };
    secondaryCta: { label: string; href: string };
  };
  ui: {
    bestFor: string;
    includes: string;
    minimum: string;
    addOn: string;
    recommended: string;
    scopeGuard: string;
    notes: string;
    startingPoint: string;
    viewPlan: string;
    selectPath: string;
    recommendation: string;
    compareRowHeader: string;
  };
};
