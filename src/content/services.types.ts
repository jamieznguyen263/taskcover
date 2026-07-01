/**
 * Shared services content types — used by en/fr/es services content files.
 *
 * Strategy for Task 4A:
 *  - The deep English body content (problem, approach, deliverables, etc.)
 *    stays the canonical source in src/data/services.ts.
 *  - Each locale provides localized versions of the high-visibility fields:
 *    hub content, hero h1, positioning, subheadline, summary, meta.
 *  - getServiceBySlug(slug, locale) merges the English base with localized
 *    overrides so the hero and hub visibly change language, while deep body
 *    copy can temporarily fall back to English (documented in I18N_STRATEGY.md).
 */

import type { Service } from "@/data/services";

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
>;

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
  };
};