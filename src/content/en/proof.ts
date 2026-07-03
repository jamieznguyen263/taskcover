import type { ProofContent } from "@/content/proof.types";

export const proof: ProofContent = {
  ui: {
    home: "Home",
    proof: "Proof",
    verifiedPublic: "Verified public",
    privateReference: "Private reference",
    sourceLinked: "Source-linked",
    permissioned: "Permissioned",
    disclosure: "Disclosure",
    evidenceType: "Evidence type",
    verificationStatus: "Verification status",
    requestReference: "Request a Private Reference",
    mediaInquiry: "Media inquiry",
    reviewStandard: "Review standard",
    publicEvidence: "Public evidence",
    confidentialEngagement: "Confidential engagement",
    bookStrategyCall: "Book a Strategy Call",
    noPublicEvidenceTitle: "No public evidence is published until it is verified and permissioned.",
    noPublicEvidenceBody:
      "The registry can accept reviews, media links, video stories, and profiles later. Until a record meets the public rendering rule, the public page shows the standard instead of the name.",
    publicEvidenceRule:
      "Public rendering requires verified-public permission, verified status, and explicit public disclosure.",
    privateReferenceLine:
      "Private references may be available for qualified engagements.",
    relatedProofChannels: "Related proof channels",
    evidenceLedger: "Evidence ledger",
    verificationWorkflow: "Verification workflow",
    source: "Source",
    status: "Status",
    approvedExperienceContext:
      "Selected team and partner experience across global brands, campaigns, and search programs.",
  },
  channelLinks: [
    {
      label: "Brand Experience",
      href: "/proof/brand-experience",
      description: "Approved context for team and partner experience without implying endorsement.",
    },
    {
      label: "Media Features",
      href: "/proof/media-features",
      description: "A source-linked registry for press and expert commentary when disclosure is permitted.",
    },
    {
      label: "Client Reviews",
      href: "/proof/client-reviews",
      description: "Verified feedback only, with permission status and public disclosure rules.",
    },
    {
      label: "Video Reviews",
      href: "/proof/video-reviews",
      description: "A future-ready library for approved client stories and testimonial videos.",
    },
    {
      label: "Spokesperson",
      href: "/proof/spokesperson",
      description: "Agency-level expert commentary with optional verified spokesperson profiles later.",
    },
  ],
  hub: {
    metaTitle: "Proof and Authority System | Taskcover Agency",
    metaDescription:
      "Explore Taskcover's evidence-led proof framework for brand experience, client reviews, media links, video stories, private references, and spokesperson profiles.",
    eyebrow: "Proof + Authority",
    h1: "Evidence before claims.",
    intro:
      "We separate experience, evidence, and claims so buyers know exactly what has been verified, what is private, and what is not yet public.",
    commandModules: [
      {
        label: "Public evidence",
        status: "Verified",
        detail: "Named proof appears only when permission and verification are complete.",
      },
      {
        label: "Private references",
        status: "Private",
        detail: "Confidential references are handled case by case and never exposed publicly.",
      },
      {
        label: "Experience context",
        status: "Disclosure-safe",
        detail: "Brand experience is described as context, not endorsement.",
      },
      {
        label: "Media readiness",
        status: "Source-linked",
        detail: "Media links require publication, date, source, and approved wording.",
      },
      {
        label: "Verification standard",
        status: "Permissioned",
        detail: "Every public proof item must pass a record-level evidence gate.",
      },
    ],
    authority: {
      eyebrow: "Authority framework",
      title: "A layered trust system instead of decorative social proof.",
      description:
        "Taskcover's authority model separates experience context, public evidence, private references, media commentary, video evidence, search methodology, and transparent reporting.",
      layers: [
        { label: "Team and partner experience", detail: "Relevant search environments and delivery exposure." },
        { label: "Public client evidence", detail: "Named proof only after verification and permission." },
        { label: "Private references", detail: "Introductions only where fit, consent, and confidentiality allow." },
        { label: "Media commentary", detail: "Published source links and topic context when available." },
        { label: "Video evidence", detail: "Approved identity, context, final wording, and source assets." },
        { label: "Search methodology", detail: "Repeatable strategy, technical, content, authority, and reporting systems." },
        { label: "Transparent reporting", detail: "Clear definitions for what is claimed, measured, or withheld." },
      ],
    },
    experience: {
      eyebrow: "Selected experience context",
      title: "Experience can be useful without being treated as a testimonial.",
      description:
        "The names below may be referenced only in the approved context and must not be used as client reviews, endorsements, or logo proof.",
      brands: ["Agoda", "Skyscanner", "British Council", "Avis"],
      disclosure:
        "Experience context does not imply current endorsement. Individual contribution and engagement scope may vary. Public details are shared only where disclosure is permitted.",
    },
    standards: {
      eyebrow: "Proof standards",
      title: "What Taskcover considers publishable evidence.",
      description:
        "Evidence moves through a controlled workflow before any name, quote, link, asset, or story becomes public.",
      steps: [
        "Source received",
        "Identity and context confirmed",
        "Permission checked",
        "Public wording approved",
        "Source linked",
        "Published",
      ],
    },
    channels: {
      eyebrow: "Proof channels",
      title: "An evidence map buyers can inspect.",
      description:
        "Each channel has its own disclosure rules, empty-state behavior, and future registry path.",
    },
    privatePath: {
      eyebrow: "Private reference path",
      title: "Confidential work stays confidential unless a reference is explicitly approved.",
      description:
        "Some engagements cannot be disclosed publicly. Taskcover can evaluate whether a private reference is appropriate for a qualified engagement, but availability is never guaranteed.",
      steps: [
        "Engagement fit",
        "Confidentiality check",
        "Reference availability",
        "Permission confirmation",
        "Private introduction where appropriate",
      ],
    },
    cta: {
      eyebrow: "Discuss fit",
      title: "Review the proof standard before you evaluate the work.",
      description:
        "Book a strategy call or request a private reference path. No public names are shared unless the evidence record allows it.",
    },
  },
  pages: {
    "brand-experience": {
      slug: "brand-experience",
      label: "Brand Experience",
      metaTitle: "Brand Experience Context | Taskcover Agency",
      metaDescription:
        "See how Taskcover presents selected team and partner brand experience safely without implying endorsement or direct client relationships.",
      eyebrow: "Brand experience",
      h1: "Experience across search environments.",
      intro:
        "This page explains the approved context for selected team and partner experience without treating brand names as endorsements, testimonials, or proof of direct contracting.",
    },
    "media-features": {
      slug: "media-features",
      label: "Media Features",
      metaTitle: "Media Features and Commentary | Taskcover Agency",
      metaDescription:
        "Explore Taskcover's source-linked media framework for verified press links, commentary topics, and editorial response standards.",
      eyebrow: "Media features",
      h1: "Media, commentary, and search expertise.",
      intro:
        "Verified media links are published only when a real source, publication context, date, and public disclosure permission are available.",
    },
    "client-reviews": {
      slug: "client-reviews",
      label: "Client Reviews",
      metaTitle: "Verified Client Reviews | Taskcover Agency",
      metaDescription:
        "Taskcover publishes client feedback only when identity, permission, verification, and disclosure standards are met.",
      eyebrow: "Client reviews",
      h1: "Verified feedback, not anonymous praise.",
      intro:
        "Taskcover does not invent reviews, initials, ratings, or anonymous praise. Public feedback must be permissioned, verified, and disclosure-safe.",
    },
    "video-reviews": {
      slug: "video-reviews",
      label: "Video Reviews",
      metaTitle: "Verified Video Reviews | Taskcover Agency",
      metaDescription:
        "Taskcover's framework for approved video testimonials and client stories with verified identity, context, source assets, and publication permission.",
      eyebrow: "Video reviews",
      h1: "Video evidence with context.",
      intro:
        "Public video stories are added only when participants approve their identity, context, and final published wording.",
    },
    spokesperson: {
      slug: "spokesperson",
      label: "Spokesperson",
      metaTitle: "Search and AI Spokesperson Commentary | Taskcover Agency",
      metaDescription:
        "Taskcover provides agency-level expert commentary on search and AI visibility with a future-ready verified spokesperson profile structure.",
      eyebrow: "Spokesperson",
      h1: "Expert commentary for search and AI topics.",
      intro:
        "Taskcover provides expert commentary through an approved agency representative based on topic, availability, and editorial fit.",
    },
  },
  brandExperience: {
    nameplatesTitle: "Approved nameplates",
    nameplatesDisclosure:
      "Experience may include work performed by team members or delivery partners before or alongside Taskcover. No category should be assumed to apply to every named brand.",
    sectorMapTitle: "Sector-to-capability map",
    sectorMapDescription:
      "The value of prior exposure is how it informs search judgement across complex markets, not how loudly a logo can be displayed.",
    sectors: [
      { sector: "Travel and marketplace search", signals: ["multi-market demand", "technical scale", "content depth"] },
      { sector: "Education and public-sector programs", signals: ["trust requirements", "localized journeys", "information architecture"] },
      { sector: "Mobility and consumer services", signals: ["local intent", "conversion friction", "campaign coordination"] },
    ],
    contributionTitle: "Types of contribution",
    contributionDescription:
      "These contribution areas describe possible experience categories. They are not claims about every named organization.",
    contributions: [
      "SEO strategy",
      "Content programs",
      "Technical review",
      "International search",
      "Digital campaigns",
      "Research and reporting",
      "Partner-supported delivery",
    ],
    challengesTitle: "Search challenges encountered",
    challenges: [
      { label: "International visibility", detail: "Balancing regional intent, language, and canonical search architecture." },
      { label: "Authority transfer", detail: "Turning expertise into content systems, source quality, and linkable assets." },
      { label: "Technical prioritization", detail: "Separating critical SEO blockers from cosmetic platform noise." },
      { label: "Stakeholder clarity", detail: "Making search recommendations understandable across marketing, product, and leadership." },
    ],
    methodologyTitle: "Methodology carried into Taskcover",
    methodologyDescription:
      "Experience only matters when it improves the operating system buyers receive today.",
    methodology: [
      { from: "Complex markets", to: "Search architecture", detail: "Segment demand by country, intent, language, and buyer stage." },
      { from: "Large content surfaces", to: "Editorial systems", detail: "Build briefs, clusters, and quality controls that scale without losing relevance." },
      { from: "Campaign delivery", to: "Reporting discipline", detail: "Tie activity to decisions, risks, next steps, and business context." },
    ],
    policyTitle: "Disclosure and evidence policy",
    policy: [
      "Brand names are text-only experience context unless permissioned public assets exist.",
      "Brand names are not testimonial sources.",
      "Experience context does not imply current endorsement.",
      "Public details are shared only where disclosure is permitted.",
    ],
  },
  mediaFeatures: {
    registryTitle: "Verified media registry",
    registryEmpty:
      "Verified media links are published here when public disclosure is permitted.",
    topicMapTitle: "Commentary topic map",
    topicMapDescription:
      "These are commentary areas Taskcover can evaluate for editorial fit; they are not claims of past media coverage.",
    topics: [
      "Google search changes",
      "AI search visibility",
      "Technical SEO",
      "International SEO",
      "Multilingual SEO",
      "Digital PR",
      "Content authority",
      "Local search",
      "Search measurement",
    ],
    workflowTitle: "Editorial response workflow",
    workflow: [
      "Inquiry received",
      "Topic and deadline reviewed",
      "Representative matched",
      "Commentary drafted or interview scheduled",
      "Source and quote approval checked",
      "Publication link recorded when live",
    ],
    standardsTitle: "Source and permission standards",
    standards: [
      "No publication logo is shown without a verified public asset.",
      "No press link is listed without a real source URL.",
      "Dates, titles, authors, and topic labels must match the source.",
      "Corrections or expired links are removed from public rendering.",
    ],
    ctaTitle: "Request search commentary",
    ctaDescription:
      "For media inquiries, share the topic, deadline, format, and whether the quote will be public.",
  },
  clientReviews: {
    registryTitle: "Public review registry",
    registryEmpty:
      "Public client reviews appear only after identity, permission, wording, and disclosure are verified.",
    dimensionsTitle: "Feedback dimensions",
    dimensions: [
      { label: "Strategic clarity", detail: "Whether priorities and tradeoffs are understandable." },
      { label: "Communication", detail: "How consistently progress, risks, and next steps are explained." },
      { label: "Prioritization", detail: "Whether work is sequenced by impact and feasibility." },
      { label: "Technical depth", detail: "How well audits separate critical issues from noise." },
      { label: "Reporting quality", detail: "Whether reporting supports decisions, not vanity." },
      { label: "Execution transparency", detail: "How clearly responsibilities and dependencies are surfaced." },
      { label: "Business alignment", detail: "Whether search work maps to revenue and market context." },
    ],
    methodTitle: "Verification method",
    method: [
      "Confirm the reviewer identity and organization context.",
      "Confirm permission for public display.",
      "Approve final wording before publication.",
      "Store source, status, disclosure text, and internal notes separately.",
    ],
    privatePathTitle: "Confidential/private reference pathway",
    privatePath: [
      "Qualify the engagement and reference need.",
      "Check confidentiality restrictions before any introduction.",
      "Confirm reference willingness and permitted context.",
      "Share only the approved private path where appropriate.",
    ],
    evaluationTitle: "What clients may evaluate",
    evaluation: [
      "Strategy quality",
      "Technical recommendations",
      "Execution planning",
      "Communication cadence",
      "Reporting clarity",
      "Commercial judgement",
    ],
  },
  videoReviews: {
    libraryTitle: "Verified video library",
    libraryEmpty:
      "Public videos appear only after participant approval, source validation, and publication permission.",
    usefulVideoTitle: "What a useful video review should cover",
    usefulVideo: [
      "The business context and original challenge.",
      "The workstream or collaboration scope.",
      "What changed in decision-making, visibility, or execution.",
      "Any limits on what can be publicly disclosed.",
    ],
    workflowTitle: "Permission and identity workflow",
    workflow: [
      "Participant identity confirmed",
      "Organization context approved",
      "Recording and thumbnail rights checked",
      "Final wording reviewed",
      "Video URL and publication date verified",
    ],
    privateAvailabilityTitle: "Private video/reference availability",
    privateAvailability:
      "Some video or reference material may remain private. Public pages never expose private recordings, names, thumbnails, or links.",
  },
  spokesperson: {
    areasTitle: "Commentary areas",
    areas: [
      "Google search changes",
      "AI search visibility",
      "Technical SEO",
      "International SEO",
      "Multilingual SEO",
      "Digital PR",
      "Content authority",
      "Local search",
      "Search measurement",
    ],
    formatsTitle: "Interview and contribution formats",
    formats: [
      "Written expert quote",
      "Interview",
      "Podcast discussion",
      "Webinar contribution",
      "Article review",
      "Technical briefing",
      "Panel participation",
    ],
    processTitle: "Editorial response process",
    process: [
      "Topic, audience, and deadline reviewed.",
      "Agency representative selected by fit and availability.",
      "Approved commentary prepared with source context.",
      "Public wording and attribution checked before use.",
    ],
    profileTitle: "Spokesperson verification/profile area",
    profileEmpty:
      "No verified public spokesperson identity is currently published. Taskcover provides expert commentary through an approved agency representative based on topic, availability, and editorial fit.",
    profileFields: [
      "Name",
      "Role",
      "Headshot",
      "Biography",
      "Verified credentials",
      "Approved topics",
      "Language availability",
      "Source links",
      "Public permission status",
    ],
    ctaTitle: "Send a media inquiry",
    ctaDescription:
      "Share the outlet, topic, deadline, format, and attribution needs so Taskcover can evaluate fit.",
  },
};
