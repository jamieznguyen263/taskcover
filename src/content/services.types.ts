/**
 * Shared services content types — used by en/fr/es services content files.
 *
 * Task 4B: all deep service body fields (problem, approach, deliverables,
 * use cases, process, outcomes, faqs) are fully localized for fr/es.
 * getServiceBySlug(slug, locale) merges the English base with localized
 * overrides for both high-visibility and deep body fields.
 */

import type { Service } from "@/data/services";

/** Deep body fields that each locale can localize per service. */
export type ServiceDeepLocalized = Pick<
  Service,
  | "problem"
  | "approach"
  | "deliverables"
  | "useCases"
  | "process"
  | "outcomes"
  | "faqs"
>;

/** Fields that each locale localizes for every service. */
export type ServiceLocalized = Pick<
  Service,
  | "title"
  | "shortLabel"
  | "h1"
  | "positioning"
  | "subheadline"
  | "summary"
  | "outcomePromise"
  | "metaTitle"
  | "metaDescription"
> &
  Partial<ServiceDeepLocalized>;

/** Localized services hub content. */
export type ServicesHubLocalized = {
  eyebrow: string;
  h1: string;
  positioning: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  connectSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
  whichServiceSection: {
    eyebrow: string;
    title: string;
    description: string;
  };
};

/** Full localized services content: hub + per-slug overrides. */
export type ServicesContent = {
  hub: ServicesHubLocalized;
  /** Map of slug -> localized short fields. Must cover all 11 service slugs. */
  services: Record<string, ServiceLocalized>;
  /** Shared UI strings shown inside the service template. */
  ui: {
    exploreService: string;
    module: string;
    outcome: string;
    auditPreview: string;
    ninetyDayPlan: string;
    illustrative: string;
    /** Decision guide scenario cards on the hub. */
    allServices: string;
    allServicesTitle: string;
    allServicesDesc: string;
    /** "Not sure which service" CTA section. */
    notSureEyebrow: string;
    notSureTitle: string;
    notSureDesc: string;
    /** Decision scenarios. */
    decisionVisibilityQ: string;
    decisionVisibilityA: string;
    decisionCaptureQ: string;
    decisionCaptureA: string;
    decisionAuthorityQ: string;
    decisionAuthorityA: string;
    decisionCapabilityQ: string;
    decisionCapabilityA: string;
    /** Service template component-level UI strings. */
    heroCtaPrimary: string;
    heroCtaSecondary: string;
    heroFigcaption: string;
    problemEyebrow: string;
    problemScanner: string;
    problemGapCount: string;
    approachEyebrow: string;
    approachModel: string;
    approachConnect: string;
    deliverablesEyebrow: string;
    deliverablesTitle: string;
    deliverablesDesc: string;
    deliverablesNumber: string;
    deliverablesDeliverable: string;
    deliverablesScope: string;
    deliverablesTier: string;
    deliverablesPreview: string;
    useCasesEyebrow: string;
    useCasesTitle: string;
    useCasesDesc: string;
    useCasesTrigger: string;
    useCasesNote: string;
    processEyebrow: string;
    processTitle: string;
    processDesc: string;
    outcomesEyebrow: string;
    outcomesDesc: string;
    relatedEyebrow: string;
    relatedTitle: string;
    relatedModule: string;
    faqEyebrow: string;
    faqTitle: string;
    ctaEyebrow: string;
    ctaTitle: string;
    ctaDesc: string;
    ctaAuditPreview: string;
    ctaIllustrative: string;
    breadcrumbHome: string;
    breadcrumbServices: string;
    /** Localized CTA audit-preview row labels, keyed by service slug. */
    ctaPreviewLabels: Record<string, string[]>;
    /** Default preview labels used when a slug isn't in ctaPreviewLabels. */
    ctaPreviewDefault: string[];
  };
};
