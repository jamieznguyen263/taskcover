/**
 * Shared home content types — used by en/fr/es home content files.
 * Keeping the type in a neutral location avoids cross-locale import cycles
 * and lets each locale file import the canonical type.
 */

export type CtaItem = { label: string; href: string };

export type HomeContent = {
  hero: {
    eyebrow: string;
    headline: string;
    subheadline: string;
    proofLine: string;
    primaryCta: CtaItem;
    secondaryCta: CtaItem;
  };
  searchHasChanged: {
    eyebrow: string;
    title: string;
    description: string;
    message: string;
  };
  operatingSystem: {
    eyebrow: string;
    title: string;
    description: string;
  };
  growthPlays: {
    eyebrow: string;
    title: string;
    description: string;
  };
  servicesBento: {
    eyebrow: string;
    title: string;
    description: string;
  };
  methodology: {
    eyebrow: string;
    title: string;
    description: string;
  };
  comparison: {
    eyebrow: string;
    title: string;
    description: string;
  };
  audit: {
    eyebrow: string;
    title: string;
    description: string;
    checklist: string[];
    primaryCta: CtaItem;
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
};