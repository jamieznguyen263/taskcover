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
      "Content Marketing and Digital PR build the signals Google and AI surfaces cite.",
    decisionCapabilityQ: "Need team capability?",
    decisionCapabilityA:
      "SEO Mentor Service gives founders and in-house teams senior-level guidance.",
  },
};