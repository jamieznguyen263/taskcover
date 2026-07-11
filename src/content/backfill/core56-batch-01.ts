import type { InsightArticle, InsightBlock, InsightLink, InsightSource } from "@/content/insights.types";

const today = "2026-07-11";
const coverImage = "/brand/og-default.svg";

const sources = {
  googleAiFeatures: {
    id: "google-ai-features",
    title: "AI features and your website",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/appearance/ai-features",
    accessedAt: today,
    primarySource: true,
    supportsClaimIds: ["ai-features-fundamentals", "ai-features-eligibility", "ai-features-measurement"],
    locale: "global",
  },
  googleHelpfulContent: {
    id: "google-helpful-content",
    title: "Creating helpful, reliable, people-first content",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/fundamentals/creating-helpful-content",
    accessedAt: today,
    primarySource: true,
    supportsClaimIds: ["people-first-content", "eeat-authorship", "no-word-count-rule"],
    locale: "global",
  },
  googleGenAiContent: {
    id: "google-genai-content",
    title: "Google Search guidance on using generative AI content",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/fundamentals/using-gen-ai-content",
    accessedAt: today,
    primarySource: true,
    supportsClaimIds: ["genai-quality-accuracy", "scaled-content-risk"],
    locale: "global",
  },
  googleLinks: {
    id: "google-link-best-practices",
    title: "Link best practices for Google",
    publisher: "Google Search Central",
    url: "https://developers.google.com/search/docs/crawling-indexing/links-crawlable",
    accessedAt: today,
    primarySource: true,
    supportsClaimIds: ["crawlable-links", "descriptive-anchors", "internal-links"],
    locale: "global",
  },
  chenGeo: {
    id: "chen-geo-2025",
    title: "Generative Engine Optimization: How to Dominate AI Search",
    publisher: "arXiv",
    url: "https://arxiv.org/abs/2509.08919",
    accessedAt: today,
    publishedAt: "2025-09-09",
    primarySource: false,
    supportsClaimIds: ["ai-search-source-differences", "earned-media-bias"],
    locale: "global",
    notes: "Academic preprint. Use for directional research context only; do not generalize beyond the study design.",
  },
  xuAio: {
    id: "xu-aio-2026",
    title: "Measuring Google AI Overviews: Activation, Source Quality, Claim Fidelity, and Publisher Impact",
    publisher: "arXiv",
    url: "https://arxiv.org/abs/2605.14021",
    accessedAt: today,
    publishedAt: "2026-05-13",
    primarySource: false,
    supportsClaimIds: ["aio-citation-limits", "aio-claim-fidelity"],
    locale: "global",
    notes: "Under-review preprint. Use to explain measurement uncertainty, not as a universal benchmark.",
  },
} satisfies Record<string, InsightSource>;

function link(label: string, href: string, note?: string): InsightLink {
  return { label, href, note };
}

function article(input: {
  id: string;
  slug: string;
  translationGroupId: string;
  h1: string;
  excerpt: string;
  category: InsightArticle["category"];
  tags: string[];
  readingTime: number;
  blocks: InsightBlock[];
  sources: InsightSource[];
  claims: InsightArticle["contentEvidence"]["claims"];
  focusKeyword: string;
  secondaryKeywords: string[];
  primaryIntent: string;
  coreQuestion: string;
  primaryEntity: string;
  supportingEntities: string[];
  topicCluster: string;
  parentPillar: string;
  uniqueInformationGain: string;
  refreshTrigger: string;
  serviceLinks: InsightLink[];
  suggestedInternalLinks?: InsightLink[];
  relatedArticleSlugs: string[];
  metaTitle: string;
  metaDescription: string;
  breadcrumbLabel: string;
  originalInsights: string[];
  faqItems: { question: string; answer: string }[];
}): InsightArticle {
  const requiredInternalLinks = input.serviceLinks;
  const citationReferences = input.sources.map((source) => source.url);
  return {
    id: input.id,
    slug: input.slug,
    translationGroupId: input.translationGroupId,
    locale: "en",
    internalTitle: `${input.id}: ${input.h1}`,
    h1: input.h1,
    excerpt: input.excerpt,
    category: input.category,
    tags: input.tags,
    author: "Taskcover Editorial Team",
    expertReviewer: "Taskcover SEO Review",
    editor: "Taskcover Editorial Desk",
    status: "draft",
    publishedAt: today,
    updatedAt: today,
    lastFactCheckedAt: today,
    readingTime: input.readingTime,
    coverImage,
    coverImageAlt: `${input.h1} framework diagram for search-growth planning.`,
    coverImageCaption: "Taskcover editorial framework for search strategy, AI visibility, authority, and conversion planning.",
    blocks: input.blocks,
    searchStrategy: {
      focusKeyword: input.focusKeyword,
      secondaryKeywords: input.secondaryKeywords,
      primaryIntent: input.primaryIntent,
      secondaryIntents: ["commercial investigation", "implementation planning", "risk assessment"],
      targetAudience: "Founders, marketing leaders, SEO leads, content leads, and revenue teams",
      funnelStage: "consideration",
      coreQuestion: input.coreQuestion,
      primaryEntity: input.primaryEntity,
      supportingEntities: input.supportingEntities,
      topicCluster: input.topicCluster,
      parentPillar: input.parentPillar,
      targetMarkets: ["Global English", "United States", "Canada", "Australia"],
      serpObservations: [
        "Workbook Live SERP rows were still pending on 2026-07-11, so this draft uses official sources, academic context, and conservative claims until keyword-tool exports are added.",
        "Dominant intent is informational with commercial investigation because readers need a strategic framework before vendor selection.",
      ],
      featuredSnippetOpportunity: "Lead with a concise direct answer, then support it with tables, checklists, and decision criteria.",
      aiCitationOpportunity: "Use self-contained definitions, visible evidence blocks, descriptive headings, and claim-level citations.",
      uniqueInformationGain: input.uniqueInformationGain,
      refreshTrigger: input.refreshTrigger,
    },
    contentEvidence: {
      sources: input.sources,
      claims: input.claims,
      factCheckStatus: "checked",
      originalInsights: input.originalInsights,
      caseStudyReferences: [],
      complianceNotes: [
        "No ranking guarantee, no AI mention guarantee, no fabricated traffic data, and no fake client outcome.",
        "Academic AI-search studies are cited as directional evidence and not treated as universal ranking rules.",
        "Workbook keyword volume, KD, CPC, and localized top-10 SERP fields still need external tool exports before final production approval.",
      ],
    },
    internalLinking: {
      requiredInternalLinks,
      suggestedInternalLinks: input.suggestedInternalLinks ?? [],
      serviceLinks: input.serviceLinks,
      industryLinks: [],
      marketLinks: [],
      caseStudyLinks: [],
      sampleAuditLinks: [link("Sample SEO audits", "/work/sample-audits")],
      relatedArticleSlugs: input.relatedArticleSlugs,
      recommendedAnchors: requiredInternalLinks.map((item) => item.label),
    },
    metadata: {
      metaTitle: input.metaTitle,
      metaDescription: input.metaDescription,
      canonical: `/insights/${input.category}/${input.slug}`,
      robots: "index,follow",
      ogTitle: input.metaTitle,
      ogDescription: input.metaDescription,
      ogImage: coverImage,
      twitterTitle: input.metaTitle,
      twitterDescription: input.metaDescription,
      twitterImage: coverImage,
      breadcrumbLabel: input.breadcrumbLabel,
    },
    schema: {
      schemaType: "Article",
      faqItems: input.faqItems,
      aboutEntities: [input.primaryEntity, ...input.supportingEntities],
      mentions: input.tags,
      citationReferences,
    },
    localization: {
      hreflangGroup: input.translationGroupId,
      xDefaultSlug: input.slug,
      translationStatus: "complete",
      translationNotes: "English source article complete. FR/ES localization should be created only after market-specific translation review.",
      sourceLocale: "en",
      localeReviewStatus: "approved",
      localeKeyword: input.focusKeyword,
    },
    publishQa: {
      summary: "Backfill draft created from Taskcover Core 56 workbook and checked against current source guidance.",
      checkedAt: today,
    },
  };
}

const tc001Faq = [
  {
    question: "Is SEO still worth investing in?",
    answer:
      "Yes, when SEO is managed as a search-growth system rather than as isolated keyword work. Google still needs crawlable, useful, well-linked pages, and AI search still depends on source material it can retrieve, interpret, and cite. The investment should be tied to qualified demand, assisted conversions, and sales feedback, not only rank movement.",
  },
  {
    question: "Is GEO separate from SEO?",
    answer:
      "GEO is best treated as an extension of SEO, not a replacement. It adds attention to answer surfaces, citations, entity consistency, and passage clarity, but it still depends on fundamentals such as indexable pages, helpful content, crawlable links, structured data that matches visible text, and credible evidence.",
  },
  {
    question: "How should SEO performance be measured in 2026?",
    answer:
      "Use a layered scorecard: technical eligibility, query coverage, non-branded and branded demand, AI-answer visibility where measurable, qualified leads, assisted pipeline, and conversion quality. Do not present AI visibility as exact revenue attribution unless the click, lead, and sales evidence supports that claim.",
  },
  {
    question: "Which search channel should a new brand prioritize first?",
    answer:
      "A new brand should first fix technical access, offer clarity, conversion tracking, and priority service pages. PPC can test urgent commercial demand, while SEO builds durable discovery and authority. The right first channel depends on runway, category competition, margin, and how quickly the brand needs qualified pipeline.",
  },
];

const tc006Faq = [
  {
    question: "Does AI-written content rank?",
    answer:
      "AI-assisted content can perform when it is accurate, useful, original, reviewed, and created to help readers. It becomes risky when automation is used to generate many low-value pages, rewrite existing sources without added value, or manipulate rankings. Human editorial ownership and evidence remain essential.",
  },
  {
    question: "What makes content citable by AI search?",
    answer:
      "Citable content is easy to retrieve, trust, and quote. It uses clear answers, descriptive headings, definitions, source-backed claims, tables, first-party examples, and consistent entities. Citability is not guaranteed, and different AI search systems may select sources differently, so the goal is better source quality rather than a promised mention.",
  },
  {
    question: "How long should an SEO article be?",
    answer:
      "There is no fixed word count that Google prefers. The article should be as complete as the intent requires and no longer than the reader needs. Use length to solve the job: answer the main question, cover important sub-intents, show evidence, and provide the next action without padding.",
  },
  {
    question: "How do you avoid keyword stuffing?",
    answer:
      "Start with the reader's job, not a repetition target. Use natural language, related entities, examples, and descriptive internal links. If a keyword makes a sentence less clear, remove it. Strong content can include the target query while still sounding like expert guidance written for people.",
  },
];

export const core56Batch01Articles = [
  article({
    id: "core56-tc-001",
    slug: "seo-2026-google-ai-search-revenue-growth",
    translationGroupId: "core56-tc-001",
    h1: "SEO in 2026: How Google, AI Search, and Revenue Growth Work Together",
    excerpt:
      "A practical framework for managing SEO in 2026 as one measurable system across Google visibility, AI answer surfaces, authority, and revenue outcomes.",
    category: "seo-guides",
    tags: ["SEO 2026", "AI search SEO", "Search growth", "Organic revenue", "GEO"],
    readingTime: 18,
    focusKeyword: "SEO 2026",
    secondaryKeywords: ["AI search SEO", "modern SEO strategy", "organic revenue growth"],
    primaryIntent: "Informational / commercial investigation",
    coreQuestion: "How should a business connect Google SEO, AI search visibility, authority, and revenue growth in 2026?",
    primaryEntity: "Search engine optimization",
    supportingEntities: ["Google Search", "AI Overviews", "AI Mode", "Generative Engine Optimization", "internal links", "organic revenue"],
    topicCluster: "Search Growth Strategy",
    parentPillar: "SEO Guides",
    uniqueInformationGain:
      "Taskcover Search Growth System: a four-layer operating model connecting technical eligibility, demand and content, authority and entity proof, and conversion measurement.",
    refreshTrigger: "Refresh quarterly or when Google Search Central AI guidance, AI Overview reporting, or Taskcover service architecture changes.",
    sources: [sources.googleAiFeatures, sources.googleHelpfulContent, sources.googleLinks, sources.chenGeo, sources.xuAio],
    claims: [
      {
        id: "ai-features-fundamentals",
        text: "Google says SEO fundamentals remain relevant for AI Overviews and AI Mode, with no separate special optimization requirement.",
        requiresEvidence: true,
        sourceIds: ["google-ai-features"],
      },
      {
        id: "ai-features-eligibility",
        text: "A page must be indexed and eligible for a Google Search snippet to be eligible as a supporting link in Google AI features.",
        requiresEvidence: true,
        sourceIds: ["google-ai-features"],
      },
      {
        id: "people-first-content",
        text: "Google advises creators to build helpful, reliable, people-first content with original value and clear authorship.",
        requiresEvidence: true,
        sourceIds: ["google-helpful-content"],
      },
      {
        id: "crawlable-links",
        text: "Google recommends crawlable anchor elements with href attributes and descriptive anchor text.",
        requiresEvidence: true,
        sourceIds: ["google-link-best-practices"],
      },
      {
        id: "ai-search-source-differences",
        text: "Academic AI-search research reports that generative search systems can source and cite information differently from traditional web search.",
        requiresEvidence: true,
        sourceIds: ["chen-geo-2025", "xu-aio-2026"],
      },
    ],
    originalInsights: [
      "SEO in 2026 should be planned around eligibility, demand, proof, and conversion instead of a single ranking metric.",
      "AI visibility is a source-quality and entity-consistency layer on top of conventional SEO foundations.",
      "Revenue measurement should separate leading indicators from business outcomes so teams do not overclaim attribution.",
    ],
    serviceLinks: [
      link("SEO Agency", "/services/seo-agency", "Primary money page"),
      link("AI Search Optimization", "/services/ai-search-optimization"),
      link("Content Marketing", "/services/content-marketing"),
      link("PPC Management", "/services/ppc-management"),
    ],
    suggestedInternalLinks: [
      link("Technical SEO Audit Checklist", "/insights/technical-seo/technical-seo-audit-checklist-growing-websites"),
      link("Measure AI Search Visibility", "/insights/ai-search/measure-ai-search-visibility"),
    ],
    relatedArticleSlugs: ["measure-ai-search-visibility", "technical-seo-audit-checklist-growing-websites", "content-rankings-citations-leads"],
    metaTitle: "SEO in 2026: Google, AI Search & Revenue",
    metaDescription: "Use a practical SEO 2026 framework for Google visibility, AI search readiness, authority, measurement, and revenue growth.",
    breadcrumbLabel: "SEO in 2026",
    faqItems: tc001Faq,
    blocks: [
      {
        type: "direct-answer",
        title: "Executive answer",
        answer:
          "SEO in 2026 works when Google visibility, AI search readiness, authority, and revenue measurement are managed as one system. The durable work is still crawlable pages, useful content, credible proof, internal links, and clear conversion paths. The newer work is making entities, passages, sources, and commercial next steps easy for answer systems and buyers to understand. No publisher can guarantee rankings, AI citations, or revenue from a single tactic.",
      },
      {
        type: "key-takeaways",
        title: "What this guide helps you decide",
        items: [
          "Which SEO foundations must be fixed before scaling content.",
          "How AI Overviews, AI Mode, and external answer engines change visibility planning.",
          "How to prioritize by business maturity instead of following a generic checklist.",
          "Which leading indicators and business outcomes belong in a 2026 search-growth scorecard.",
        ],
      },
      { type: "heading", level: 2, text: "What SEO means in 2026", id: "what-seo-means" },
      {
        type: "paragraph",
        text:
          "SEO is no longer only the work of improving blue-link rankings. It is the work of making the right pages discoverable, understandable, trustworthy, and commercially useful across search surfaces. Classic Google results still matter. So do local packs, video and image surfaces, AI Overviews, AI Mode, comparison journeys, publishers, communities, and branded follow-up searches.",
      },
      {
        type: "evidence",
        claimId: "ai-features-fundamentals",
        sourceIds: ["google-ai-features"],
        summary:
          "Google's AI features guidance says the same foundational SEO best practices apply to AI Overviews and AI Mode; it does not describe a separate shortcut or special schema for inclusion.",
      },
      {
        type: "paragraph",
        text:
          "That means the strategic question is not whether SEO is dead. The better question is whether the business has a search system strong enough to be found, understood, cited, and chosen when the interface changes.",
      },
      { type: "heading", level: 2, text: "The four-layer Search Growth System", id: "search-growth-system" },
      {
        type: "comparison-table",
        caption: "Taskcover Search Growth System and KPI tree.",
        columns: ["Layer", "What it controls", "Leading indicators", "Business outcome"],
        rows: [
          ["Technical eligibility", "Crawl, render, indexation, snippets, page experience", "Valid indexable URLs, crawl depth, CWV risk, sitemap hygiene", "The right pages can appear and be measured"],
          ["Demand and content", "Intent fit, topical coverage, answer clarity, content freshness", "Query coverage, engagement, internal search, content gap closure", "More qualified discovery and assisted consideration"],
          ["Authority and entity proof", "Brand consistency, sources, bylines, earned mentions, internal links", "Citation readiness, referring context, entity consistency, branded demand", "Higher trust for buyers and answer systems"],
          ["Conversion and measurement", "CTA fit, lead capture, analytics, sales feedback", "Qualified lead rate, assisted conversions, pipeline notes", "Organic work is connected to revenue decisions"],
        ],
      },
      {
        type: "callout",
        title: "Material limitation",
        body:
          "This framework improves the conditions for visibility and conversion. It does not guarantee rankings, AI mentions, traffic, or sales. Search systems choose results dynamically, and AI answer surfaces can vary by query wording, location, time, and model behavior.",
        tone: "amber",
      },
      { type: "heading", level: 2, text: "How customer journeys move across search surfaces", id: "journeys" },
      {
        type: "paragraph",
        text:
          "A buyer may discover a problem through a Google result, compare options inside an AI answer, validate the brand through third-party mentions, return through a branded query, and convert after reading a service page. Treating these as unrelated channels creates weak content and noisy reporting.",
      },
      {
        type: "decision-framework",
        title: "Search-surface decision framework",
        criteria: [
          { signal: "The query asks for a definition or process", action: "Use concise direct answers, definitions, examples, and internal links to deeper resources." },
          { signal: "The query compares vendors, services, or methods", action: "Use tables, proof, limitations, and clear next actions instead of a generic article." },
          { signal: "The query is local or market-sensitive", action: "Use market-specific proof and terminology without cloning the same page for every country." },
          { signal: "The query has immediate buying intent", action: "Route the reader to service, audit, case, or contact pages with descriptive anchors." },
        ],
      },
      { type: "heading", level: 2, text: "What to prioritize by business maturity", id: "business-maturity" },
      {
        type: "comparison-table",
        caption: "Priority paths by maturity.",
        columns: ["Business type", "First priority", "Second priority", "Avoid"],
        rows: [
          ["New site", "Indexability, service clarity, analytics, first money pages", "Focused content around proven buyer problems", "Publishing a large blog before the offer is clear"],
          ["Established site", "Refresh pages already close to demand or pipeline", "Internal links, proof, technical cleanup, content consolidation", "Changing every URL because a tool exported warnings"],
          ["Local or multi-location", "Location architecture, GBP consistency, local proof", "Service-area content and review/entity hygiene", "Country or city name swapping"],
          ["SaaS", "Problem/use-case pages and integration-led intent", "Comparison content, docs links, assisted pipeline reporting", "Ranking pages that do not connect to product adoption"],
          ["Ecommerce", "Crawlable category architecture and product data", "Commercial content, reviews, schema, performance", "AI content at scale without merchandising value"],
        ],
      },
      { type: "heading", level: 2, text: "A 90-day operating model", id: "ninety-day-model" },
      {
        type: "steps",
        title: "Weekly cadence for the first 90 days",
        steps: [
          { title: "Weeks 1-2: Diagnose eligibility and tracking", body: "Confirm crawl access, indexation, canonical signals, templates, analytics events, form tracking, and sales feedback loops." },
          { title: "Weeks 3-4: Map demand and ownership", body: "Assign one owning URL per priority intent, define related entities, choose conversion paths, and remove duplicate or thin targets." },
          { title: "Weeks 5-7: Improve priority pages", body: "Add direct answers, evidence, internal links, market examples, service proof, and clear next actions to pages already close to value." },
          { title: "Weeks 8-10: Build authority assets", body: "Create reusable frameworks, checklists, data views, or comparison resources that journalists, buyers, and AI systems can understand." },
          { title: "Weeks 11-13: Validate and decide", body: "Review query coverage, AI visibility samples, qualified leads, assisted conversions, and sales notes before scaling production." },
        ],
      },
      { type: "heading", level: 2, text: "Implementation checklist and 30/60/90-day action plan", id: "implementation" },
      {
        type: "checklist",
        title: "Acceptance criteria before scaling SEO content",
        items: [
          { label: "Eligibility", detail: "Priority pages are indexable, render important text, expose crawlable links, and have no contradictory canonical or robots signals." },
          { label: "Intent ownership", detail: "Every target query has one primary URL, a clear job-to-be-done, and a defined next action." },
          { label: "Evidence", detail: "Material claims have sources, expert review, or clear methodology; opinion is labelled as interpretation." },
          { label: "Internal links", detail: "Important service, guide, market, and proof pages are linked in context with descriptive anchors." },
          { label: "Revenue path", detail: "CTAs match the reader's stage and analytics can connect the visit to qualified lead or pipeline signals." },
        ],
      },
      {
        type: "related-service",
        title: "SEO Agency",
        href: "/services/seo-agency",
        summary: "Use Taskcover's SEO Agency service when you need strategy, execution, technical cleanup, content systems, and search-growth reporting in one operating model.",
      },
      {
        type: "related-service",
        title: "AI Search Optimization",
        href: "/services/ai-search-optimization",
        summary: "Use AI Search Optimization to audit entity consistency, answer coverage, citation opportunities, and source-quality gaps.",
      },
      {
        type: "related-service",
        title: "Content Marketing",
        href: "/services/content-marketing",
        summary: "Use Content Marketing when the site needs useful, source-backed pages that answer demand and support conversion.",
      },
      {
        type: "related-service",
        title: "PPC Management",
        href: "/services/ppc-management",
        summary: "Use PPC Management to test urgent commercial demand and feed paid search learning back into organic strategy.",
      },
      { type: "heading", level: 2, text: "Measurement, limitations, and common failure modes", id: "measurement" },
      {
        type: "comparison-table",
        caption: "Measurement model for SEO 2026.",
        columns: ["Metric layer", "Use", "Do not claim"],
        rows: [
          ["Technical", "Crawl/index/render status, sitemap coverage, template health", "That fixing errors alone creates demand"],
          ["Visibility", "Rankings, impressions, AI visibility samples, source mentions", "Exact AI exposure or guaranteed citation"],
          ["Engagement", "Qualified entrances, scroll depth, internal clicks, return visits", "That every informational visit is sales-ready"],
          ["Revenue", "Form quality, assisted conversions, pipeline notes, close feedback", "That organic caused revenue without attribution evidence"],
        ],
      },
      {
        type: "evidence",
        claimId: "aio-citation-limits",
        sourceIds: ["xu-aio-2026"],
        summary:
          "Recent AI Overview measurement research reports source-selection and claim-support uncertainty, reinforcing why AI visibility should be reported as directional intelligence unless stronger attribution evidence exists.",
      },
      {
        type: "callout",
        title: "Common failure modes",
        body:
          "The most common failures are publishing before technical eligibility is stable, chasing AI terminology without source quality, overusing generic anchors, measuring only ranks, and forcing hard-sell CTAs into informational content.",
        tone: "blue",
      },
      { type: "heading", level: 2, text: "Frequently asked questions", id: "faq" },
      { type: "faq", items: tc001Faq },
      { type: "heading", level: 2, text: "Final recommendation and next action", id: "recommendation" },
      {
        type: "paragraph",
        text:
          "Treat SEO in 2026 as an operating system. Build the technical base, answer real demand, make the brand and evidence easy to understand, and measure commercial outcomes with enough humility to separate signals from proof.",
      },
      {
        type: "cta",
        title: "Turn SEO 2026 into a search-growth roadmap.",
        body: "Taskcover can map your technical risks, content gaps, AI visibility opportunities, and revenue measurement into a 90-day plan.",
        primary: link("Book a strategy call", "/book-a-call"),
        secondary: link("Explore SEO Agency", "/services/seo-agency"),
      },
    ],
  }),
  article({
    id: "core56-tc-006",
    slug: "content-rankings-ai-citations-leads",
    translationGroupId: "core56-tc-006",
    h1: "How to Create Content That Earns Rankings, AI Citations, and Leads",
    excerpt:
      "A practical content framework for earning organic rankings, improving AI citation readiness, and converting qualified readers without keyword stuffing or unsupported claims.",
    category: "content-authority",
    tags: ["Content for AI search", "SEO content strategy", "AI citations", "Content marketing", "Information gain"],
    readingTime: 17,
    focusKeyword: "content for AI search and SEO",
    secondaryKeywords: ["AI citations", "SEO content strategy", "content that earns leads"],
    primaryIntent: "Informational / commercial investigation",
    coreQuestion: "How do you create content that can rank, be cited by AI search, and generate qualified leads?",
    primaryEntity: "SEO content strategy",
    supportingEntities: ["AI search", "AI citations", "information gain", "people-first content", "digital PR", "conversion design"],
    topicCluster: "Content & Topical Authority",
    parentPillar: "Content Marketing",
    uniqueInformationGain:
      "Taskcover Content Quality Scorecard connecting intent ownership, original evidence, passage clarity, citation readiness, and conversion fit.",
    refreshTrigger: "Refresh quarterly or when Google helpful content, generative AI content guidance, or AI citation research changes.",
    sources: [sources.googleHelpfulContent, sources.googleGenAiContent, sources.googleAiFeatures, sources.chenGeo, sources.xuAio],
    claims: [
      {
        id: "people-first-content",
        text: "Google's helpful content guidance asks whether content provides original information, complete coverage, and value beyond simply rewriting sources.",
        requiresEvidence: true,
        sourceIds: ["google-helpful-content"],
      },
      {
        id: "no-word-count-rule",
        text: "Google says it does not have a preferred word count for content.",
        requiresEvidence: true,
        sourceIds: ["google-helpful-content"],
      },
      {
        id: "genai-quality-accuracy",
        text: "Google's generative AI guidance emphasizes accuracy, quality, relevance, and context when AI or automation is used.",
        requiresEvidence: true,
        sourceIds: ["google-genai-content"],
      },
      {
        id: "scaled-content-risk",
        text: "Using generative AI or similar tools to generate many pages without adding user value may violate Google's scaled content abuse policy.",
        requiresEvidence: true,
        sourceIds: ["google-genai-content"],
      },
      {
        id: "earned-media-bias",
        text: "Academic research on generative search reports that some AI search systems show different citation behavior and may favor third-party authoritative sources.",
        requiresEvidence: true,
        sourceIds: ["chen-geo-2025"],
      },
    ],
    originalInsights: [
      "The same page rarely wins rankings, AI citations, and leads by accident; each outcome needs explicit design choices.",
      "The best content brief assigns URL ownership, evidence expectations, passage-level structure, and conversion fit before drafting.",
      "A practical content quality scorecard should penalize unsupported claims and forced CTAs as much as missing subtopics.",
    ],
    serviceLinks: [
      link("Content Marketing", "/services/content-marketing", "Primary money page"),
      link("AI Search Optimization", "/services/ai-search-optimization"),
      link("Digital PR & Link Building", "/services/digital-pr-link-building"),
    ],
    suggestedInternalLinks: [
      link("SEO in 2026", "/insights/seo-guides/seo-2026-google-ai-search-revenue-growth"),
      link("Measure AI Search Visibility", "/insights/ai-search/measure-ai-search-visibility"),
    ],
    relatedArticleSlugs: ["seo-2026-google-ai-search-revenue-growth", "measure-ai-search-visibility", "technical-seo-audit-checklist-growing-websites"],
    metaTitle: "Content for AI Search, Rankings & Leads",
    metaDescription: "Build SEO content that can earn rankings, AI citations, and leads with intent, evidence, clear passages, and conversion fit.",
    breadcrumbLabel: "Content for AI search and SEO",
    faqItems: tc006Faq,
    blocks: [
      {
        type: "direct-answer",
        title: "Executive answer",
        answer:
          "Content earns rankings, AI citations, and leads when it satisfies a clear search intent, adds original evidence or expert judgment, makes useful passages easy to retrieve, and routes qualified readers to a relevant next step. Do not write to keyword density, word count, or AI-output myths. Write to the job the reader needs done, then support every material claim with visible evidence, review, or methodology.",
      },
      {
        type: "key-takeaways",
        title: "What you will be able to implement",
        items: [
          "A content quality scorecard for ranking, citation, and lead-readiness.",
          "A brief structure that separates intent, evidence, passage clarity, and conversion design.",
          "A 30/60/90-day rollout for improving priority content before scaling production.",
          "A measurement model that avoids claiming guaranteed rankings or AI citations.",
        ],
      },
      { type: "heading", level: 2, text: "The three outcomes are related but not identical", id: "three-outcomes" },
      {
        type: "paragraph",
        text:
          "Ranking, AI citation, and lead generation overlap, but they are not the same outcome. A page can rank and fail to convert. A page can be useful to buyers but too thin or hidden to be retrieved. A page can be cited by an answer engine without producing direct revenue. Strong content design makes these tradeoffs explicit instead of hoping one draft solves every job.",
      },
      {
        type: "comparison-table",
        caption: "Different outcomes require different design choices.",
        columns: ["Outcome", "What the page must do", "Risk if ignored"],
        rows: [
          ["Rankings", "Match intent, cover subtopics, stay crawlable, earn trust", "The page is invisible or mismatched to the query"],
          ["AI citations", "Use clear answers, entities, evidence, and self-contained passages", "The page is hard to retrieve or quote accurately"],
          ["Leads", "Create a relevant next step with proof and service fit", "The reader gets value but does not know what to do next"],
        ],
      },
      {
        type: "evidence",
        claimId: "people-first-content",
        sourceIds: ["google-helpful-content"],
        summary:
          "Google's helpful-content self-assessment asks whether content provides original information, comprehensive coverage, insight beyond the obvious, and value compared with other search results.",
      },
      { type: "heading", level: 2, text: "Start with ownership and intent", id: "ownership-intent" },
      {
        type: "checklist",
        title: "Brief inputs before drafting",
        items: [
          { label: "Owning URL", detail: "Choose one page that owns the intent and avoid creating near-duplicate alternatives." },
          { label: "Reader job", detail: "Define what the reader needs to decide, compare, fix, or buy after reading." },
          { label: "SERP format", detail: "Record whether top results are guides, tools, templates, videos, service pages, or data assets." },
          { label: "Next action", detail: "Choose the right conversion path before writing the CTA." },
          { label: "Evidence standard", detail: "List which claims need official documentation, data, expert review, or a clearly labelled opinion." },
        ],
      },
      {
        type: "paragraph",
        text:
          "Ownership is what keeps a content program from turning into a pile of overlapping articles. If two pages target the same job, they compete for internal links, confuse reporting, and make it harder for search systems to understand which URL deserves attention.",
      },
      { type: "heading", level: 2, text: "Add information gain and evidence", id: "information-gain" },
      {
        type: "paragraph",
        text:
          "Information gain is the reason the page deserves to exist. It can come from first-party data, expert judgment, before-and-after examples, templates, diagrams, decision frameworks, or a clearer synthesis of primary sources. It does not come from rewriting the same top-ranking pages in different words.",
      },
      {
        type: "decision-framework",
        title: "Taskcover Content Quality Scorecard",
        criteria: [
          { signal: "The page has no original example, framework, or decision support", action: "Add a table, checklist, sample workflow, or expert interpretation before publishing." },
          { signal: "A factual claim affects trust or strategy", action: "Attach a primary source, explain methodology, or mark it as opinion." },
          { signal: "The page repeats source material without adding value", action: "Rewrite around the reader's decision and add a unique operating model." },
          { signal: "The CTA interrupts the answer", action: "Move conversion prompts to contextual service references and final CTA." },
        ],
      },
      {
        type: "callout",
        title: "Before and after example",
        body:
          "Weak passage: 'AI search needs quality content.' Strong passage: 'AI citation readiness improves when a page gives a concise answer, names the entity clearly, supports material claims, and links to deeper proof in crawlable HTML.' The second version is more specific, testable, and useful.",
        tone: "green",
      },
      { type: "heading", level: 2, text: "Make the page easy to retrieve and trust", id: "retrieve-trust" },
      {
        type: "paragraph",
        text:
          "Answer systems and readers both benefit from structure. Use direct-answer blocks, descriptive headings, definitions, comparison tables, checklists, and evidence notes. Keep important content in visible text. Use structured data only when it matches what the reader can see on the page.",
      },
      {
        type: "evidence",
        claimId: "genai-quality-accuracy",
        sourceIds: ["google-genai-content"],
        summary:
          "Google's AI-content guidance says creators should focus on accuracy, quality, and relevance, including metadata, structured data, and image alt text.",
      },
      {
        type: "comparison-table",
        caption: "Passage-level clarity checks.",
        columns: ["Element", "Good pattern", "Weak pattern"],
        rows: [
          ["Definition", "One sentence that identifies the entity and boundary", "A vague intro that delays the answer"],
          ["Heading", "Names the decision or subtopic", "Uses clever wording that hides meaning"],
          ["Evidence", "Claim, source, and limitation are visible", "Statistic appears without context"],
          ["Internal link", "Anchor explains the destination", "Generic 'learn more' link"],
        ],
      },
      { type: "heading", level: 2, text: "Design conversion without weakening usefulness", id: "conversion" },
      {
        type: "paragraph",
        text:
          "A content page should not turn every paragraph into a sales pitch. The conversion path should match the reader's stage. Informational readers may need a checklist, audit, or related guide. Commercial investigators may need a service page, case reference, or strategy call. The page earns trust first, then makes the next step obvious.",
      },
      {
        type: "related-service",
        title: "Content Marketing",
        href: "/services/content-marketing",
        summary: "Use Taskcover Content Marketing when you need source-backed content systems that connect search intent, authority, and lead paths.",
      },
      {
        type: "related-service",
        title: "AI Search Optimization",
        href: "/services/ai-search-optimization",
        summary: "Use AI Search Optimization to review entity consistency, answer extractability, citation readiness, and AI visibility gaps.",
      },
      {
        type: "related-service",
        title: "Digital PR & Link Building",
        href: "/services/digital-pr-link-building",
        summary: "Use Digital PR and Link Building when content needs third-party authority, linkable assets, and earned-media support.",
      },
      { type: "heading", level: 2, text: "Implementation checklist and 30/60/90-day action plan", id: "implementation" },
      {
        type: "steps",
        title: "30/60/90-day content rollout",
        steps: [
          { title: "Days 1-30: Audit ownership and quality", body: "Map target intents to URLs, find overlaps, score existing pages, and choose the assets closest to traffic or revenue value." },
          { title: "Days 31-60: Upgrade priority pages", body: "Add direct answers, evidence blocks, examples, comparison tables, internal links, service references, and clearer CTAs." },
          { title: "Days 61-90: Build net-new assets", body: "Create frameworks, scorecards, templates, and research-backed guides only after priority pages have clean ownership." },
          { title: "Ongoing: Review and refresh", body: "Track query coverage, assisted leads, AI visibility samples, citation gaps, and sales objections before scaling more articles." },
        ],
      },
      {
        type: "checklist",
        title: "Acceptance criteria for a publishable SEO article",
        items: [
          { label: "Intent fit", detail: "The opening answer solves the main query without a long preamble." },
          { label: "Information gain", detail: "The page includes a unique framework, example, source synthesis, or operational decision aid." },
          { label: "Evidence", detail: "Material claims have sources or visible methodology and no fabricated statistics." },
          { label: "Extractability", detail: "Useful passages can be understood without reading the whole article." },
          { label: "Conversion", detail: "The next action is relevant to the reader's stage and does not weaken trust." },
        ],
      },
      { type: "heading", level: 2, text: "Measurement, limitations, and common failure modes", id: "measurement" },
      {
        type: "comparison-table",
        caption: "Measure content by outcome layer.",
        columns: ["Layer", "Useful signals", "Limitation"],
        rows: [
          ["Ranking", "Impressions, positions, query spread, page coverage", "Rankings do not prove lead quality"],
          ["AI citation readiness", "Answer coverage samples, citations, entity accuracy, source gaps", "AI answers vary and are not full attribution"],
          ["Lead quality", "Qualified form fills, assisted conversions, sales notes", "Long cycles may hide content influence"],
          ["Authority", "Earned links, mentions, branded demand, partner references", "Mentions can support trust without immediate clicks"],
        ],
      },
      {
        type: "callout",
        title: "Failure modes to avoid",
        body:
          "Do not publish AI-assisted pages without human review, source tracking, and a clear reason to exist. Do not chase word count. Do not stuff keywords into anchors. Do not add FAQ schema unless the questions and answers are visible on the page.",
        tone: "amber",
      },
      { type: "heading", level: 2, text: "Frequently asked questions", id: "faq" },
      { type: "faq", items: tc006Faq },
      { type: "heading", level: 2, text: "Final recommendation and next action", id: "recommendation" },
      {
        type: "paragraph",
        text:
          "The strongest content program starts with useful decisions, not content volume. Own the intent, add evidence, structure passages clearly, connect to the right service path, and measure what the page actually influences.",
      },
      {
        type: "cta",
        title: "Request a content and authority roadmap.",
        body: "Taskcover can help turn your priority topics into a content system built for rankings, AI citation readiness, and qualified lead paths.",
        primary: link("Explore Content Marketing", "/services/content-marketing"),
        secondary: link("Book a strategy call", "/book-a-call"),
      },
    ],
  }),
] satisfies InsightArticle[];
