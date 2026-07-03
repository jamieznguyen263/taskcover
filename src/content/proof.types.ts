import type { Locale } from "@/lib/i18n";

export type ProofType =
  | "brand-experience"
  | "media-feature"
  | "client-review"
  | "video-review"
  | "spokesperson-profile"
  | "private-reference";

export type ProofPermissionStatus =
  | "verified-public"
  | "private-reference"
  | "internal-only"
  | "pending";

export type ProofVerificationStatus =
  | "verified"
  | "unverified"
  | "expired"
  | "not-applicable";

export type ProofRecord = {
  id: string;
  type: ProofType;
  title: string;
  organizationName?: string;
  personName?: string;
  personRole?: string;
  summary?: string;
  quote?: string;
  sourceUrl?: string;
  assetPath?: string;
  thumbnailPath?: string;
  videoUrl?: string;
  publicationName?: string;
  publishedAt?: string;
  locale?: Locale;
  permissionStatus: ProofPermissionStatus;
  verificationStatus: ProofVerificationStatus;
  publicDisclosure: boolean;
  disclosureText?: string;
  internalNotes?: string;
};

export type SpokespersonProfile = {
  name?: string;
  role?: string;
  headshot?: string;
  biography?: string;
  verifiedCredentials?: string[];
  approvedTopics?: string[];
  languageAvailability?: string[];
  sourceLinks?: string[];
  publicPermissionStatus?: ProofPermissionStatus;
};

export type ProofPageSlug =
  | "brand-experience"
  | "media-features"
  | "client-reviews"
  | "video-reviews"
  | "spokesperson";

export type ProofLink = {
  label: string;
  href: string;
  description: string;
};

export type ProofLocalizedPage = {
  slug: ProofPageSlug;
  label: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  intro: string;
};

export type ProofContent = {
  ui: {
    home: string;
    proof: string;
    verifiedPublic: string;
    privateReference: string;
    sourceLinked: string;
    permissioned: string;
    disclosure: string;
    evidenceType: string;
    verificationStatus: string;
    requestReference: string;
    mediaInquiry: string;
    reviewStandard: string;
    publicEvidence: string;
    confidentialEngagement: string;
    bookStrategyCall: string;
    noPublicEvidenceTitle: string;
    noPublicEvidenceBody: string;
    publicEvidenceRule: string;
    privateReferenceLine: string;
    relatedProofChannels: string;
    evidenceLedger: string;
    verificationWorkflow: string;
    source: string;
    status: string;
    approvedExperienceContext: string;
  };
  channelLinks: ProofLink[];
  hub: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    h1: string;
    intro: string;
    commandModules: { label: string; status: string; detail: string }[];
    authority: {
      eyebrow: string;
      title: string;
      description: string;
      layers: { label: string; detail: string }[];
    };
    experience: {
      eyebrow: string;
      title: string;
      description: string;
      brands: string[];
      disclosure: string;
    };
    standards: {
      eyebrow: string;
      title: string;
      description: string;
      steps: string[];
    };
    channels: {
      eyebrow: string;
      title: string;
      description: string;
    };
    privatePath: {
      eyebrow: string;
      title: string;
      description: string;
      steps: string[];
    };
    cta: {
      eyebrow: string;
      title: string;
      description: string;
    };
  };
  pages: Record<ProofPageSlug, ProofLocalizedPage>;
  brandExperience: {
    nameplatesTitle: string;
    nameplatesDisclosure: string;
    sectorMapTitle: string;
    sectorMapDescription: string;
    sectors: { sector: string; signals: string[] }[];
    contributionTitle: string;
    contributionDescription: string;
    contributions: string[];
    challengesTitle: string;
    challenges: { label: string; detail: string }[];
    methodologyTitle: string;
    methodologyDescription: string;
    methodology: { from: string; to: string; detail: string }[];
    policyTitle: string;
    policy: string[];
  };
  mediaFeatures: {
    registryTitle: string;
    registryEmpty: string;
    topicMapTitle: string;
    topicMapDescription: string;
    topics: string[];
    workflowTitle: string;
    workflow: string[];
    standardsTitle: string;
    standards: string[];
    ctaTitle: string;
    ctaDescription: string;
  };
  clientReviews: {
    registryTitle: string;
    registryEmpty: string;
    dimensionsTitle: string;
    dimensions: { label: string; detail: string }[];
    methodTitle: string;
    method: string[];
    privatePathTitle: string;
    privatePath: string[];
    evaluationTitle: string;
    evaluation: string[];
  };
  videoReviews: {
    libraryTitle: string;
    libraryEmpty: string;
    usefulVideoTitle: string;
    usefulVideo: string[];
    workflowTitle: string;
    workflow: string[];
    privateAvailabilityTitle: string;
    privateAvailability: string;
  };
  spokesperson: {
    areasTitle: string;
    areas: string[];
    formatsTitle: string;
    formats: string[];
    processTitle: string;
    process: string[];
    profileTitle: string;
    profileEmpty: string;
    profileFields: string[];
    ctaTitle: string;
    ctaDescription: string;
  };
};
