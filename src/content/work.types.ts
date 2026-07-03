import type {
  ProofPermissionStatus,
  ProofVerificationStatus,
} from "./proof.types";

export type WorkType =
  | "case-study"
  | "sample-audit"
  | "framework"
  | "client-result"
  | "roadmap"
  | "research-output";

export type SampleAuditSlug =
  | "technical-seo-audit"
  | "ai-search-visibility-review"
  | "content-gap-map"
  | "local-seo-audit"
  | "ecommerce-search-architecture"
  | "international-seo-market-map"
  | "ppc-organic-intelligence"
  | "90-day-search-growth-roadmap";

export type WorkPageSlug =
  | "case-studies"
  | "sample-audits"
  | "search-growth-frameworks"
  | "client-results";

export type WorkRecord = {
  id: string;
  type: WorkType;
  slug: string;
  title: string;
  summary: string;
  clientName?: string;
  industry?: string;
  market?: string;
  serviceSlugs?: string[];
  industrySlugs?: string[];
  marketSlugs?: string[];
  challenge?: string;
  approach?: string[];
  deliverables?: string[];
  outcomes?: string[];
  metrics?: string[];
  timeframe?: string;
  methodology?: string[];
  sourceUrl?: string;
  assetPath?: string;
  publishedAt?: string;
  permissionStatus: ProofPermissionStatus;
  verificationStatus: ProofVerificationStatus;
  publicDisclosure: boolean;
  illustrative: boolean;
  disclosureText?: string;
  internalNotes?: string;
  requiredContextComplete?: boolean;
  measurementSource?: string;
  baselineContext?: string;
  approvedWording?: boolean;
  approvedAssets?: boolean;
};

export type WorkLink = {
  label: string;
  href: string;
  description: string;
};

export type WorkStep = {
  label: string;
  detail: string;
  status?: string;
};

export type CaseMetric = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  baseline?: string;
  endValue?: string;
  timeframe?: string;
  measurementScope?: string;
  context: string;
  category:
    | "Organic traffic"
    | "Keyword visibility"
    | "Top 3 rankings"
    | "Top 10 rankings"
    | "CTR"
    | "Bounce rate"
    | "Conversion"
    | "Local search"
    | "Google Maps visibility"
    | "Content authority"
    | "Press coverage"
    | "Social engagement"
    | "Audience growth"
    | "UX improvement";
  verificationStatus: ProofVerificationStatus;
  displayPublicly: boolean;
};

export type CaseVisual = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type CaseStudySlug =
  | "british-university-vietnam"
  | "casa-madera"
  | "the-bamboo-bar"
  | "matthew-jeffery-law-firm"
  | "skatepro"
  | "agoda"
  | "avis"
  | "novaworld"
  | "ccleaner"
  | "fwd-insurance";

export type CaseStudy = Omit<WorkRecord, "metrics" | "deliverables"> & {
  slug: CaseStudySlug;
  clientName: string;
  shortName: string;
  industrySlug: string;
  marketSlugs: string[];
  serviceSlugs: string[];
  eyebrow: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  heroSummary: string;
  overview: string;
  clientBackground: string;
  engagementPeriod: string;
  startingPoint: string;
  challenge: string;
  objectives: string[];
  strategy: string[];
  execution: WorkStep[];
  servicesDelivered: WorkStep[];
  channels: string[];
  deliverables: string[];
  results: string[];
  metrics: CaseMetric[];
  visualGallery: CaseVisual[];
  keyLearning: string;
  relatedServices: string[];
  relatedIndustries: string[];
  relatedMarkets: string[];
  relatedSampleAudits: string[];
  finalCta: { title: string; description: string; label: string; href: string };
  featuredOnHomepage: boolean;
  featuredOrder?: number;
  publicNarrativeApproved: true;
  permissionStatus: "verified-public";
  verificationStatus: "verified";
  publicDisclosure: true;
};

export type SampleAudit = WorkRecord & {
  slug: SampleAuditSlug;
  eyebrow: string;
  shortLabel: string;
  focus: string;
  buyerQuestion: string;
  visualStyle: string;
  inputs: WorkStep[];
  answers: string[];
  method: WorkStep[];
  findings: WorkStep[];
  priority: WorkStep[];
  outputPreview: WorkStep[];
  roadmap: WorkStep[];
  relatedServices: string[];
  relatedIndustries: string[];
  faq: { q: string; a: string }[];
  metaTitle: string;
  metaDescription: string;
};

export type WorkContent = {
  ui: {
    home: string;
    work: string;
    breadcrumb: string;
    disclosureLabel: string;
    illustrativeSample: string;
    verifiedCaseStudy: string;
    verifiedClientResult: string;
    confidentialEngagement: string;
    privateReference: string;
    noPublicCaseStudiesTitle: string;
    noPublicResultsTitle: string;
    noPublicRegistryBody: string;
    publicRegistry: string;
    evidenceRequired: string;
    measurementContext: string;
    explore: string;
    viewSample: string;
    getAudit: string;
    bookCall: string;
    relatedSamples: string;
    relatedServices: string;
    relatedIndustries: string;
    priority: string;
    status: string;
    input: string;
    method: string;
    output: string;
    overview: string;
    clientBackground: string;
    challenge: string;
    objectives: string;
    strategy: string;
    execution: string;
    servicesDelivered: string;
    results: string;
    keyMetrics: string;
    visualGallery: string;
    keyLearning: string;
    relatedMarkets: string;
    finalCta: string;
    readCase: string;
    filterIndustry: string;
    filterMarket: string;
    filterService: string;
    allCases: string;
    client: string;
    focus: string;
    period: string;
    startingPoint: string;
    workstream: string;
  };
  channelLinks: WorkLink[];
  sampleAuditLinks: WorkLink[];
  hub: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    h1: string;
    intro: string;
    command: WorkStep[];
    systemMap: { label: string; detail: string; connectsTo: string }[];
    actionFlow: WorkStep[];
    evidenceMatrix: WorkStep[];
    cta: { title: string; description: string; preview: string[] };
  };
  pages: Record<
    WorkPageSlug,
    {
      metaTitle: string;
      metaDescription: string;
      eyebrow: string;
      h1: string;
      intro: string;
    }
  >;
  caseStudies: {
    registryIntro: string;
    verification: WorkStep[];
    requiredEvidence: string[];
    structure: WorkStep[];
    confidential: WorkStep[];
    cta: { title: string; description: string };
  };
  sampleAudits: {
    selectorIntro: string;
    comparison: WorkStep[];
    everyAudit: string[];
    priorityFlow: WorkStep[];
    disclosureTitle: string;
    disclosureBody: string;
    cta: { title: string; description: string };
  };
  frameworks: {
    stages: WorkStep[];
    prioritization: WorkStep[];
    execution: WorkStep[];
    measurement: WorkStep[];
    governance: WorkStep[];
    serviceMapping: WorkStep[];
    industryMapping: WorkStep[];
    cta: { title: string; description: string };
  };
  clientResults: {
    registryIntro: string;
    requirements: WorkStep[];
    metricContext: WorkStep[];
    attribution: string[];
    confidential: WorkStep[];
    methodology: WorkStep[];
    cta: { title: string; description: string };
  };
  samples: Record<SampleAuditSlug, SampleAudit>;
  caseStudyDetails: Record<CaseStudySlug, CaseStudy>;
};
