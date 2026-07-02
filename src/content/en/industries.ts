/**
 * English industries content — hub + all 7 industry detail objects + UI strings.
 *
 * Credibility rules (see docs/SEO_STANDARDS.md):
 *  - No fabricated metrics, testimonials, or case-study numbers.
 *  - Brand names referenced only as selected team/partner experience context.
 *  - Safe wording: "Selected team and partner experience includes..."
 */

import type { IndustriesContent } from "../industries.types";

export const industries: IndustriesContent = {
  hub: {
    eyebrow: "Industries",
    h1: "Industry SEO systems built around how buyers actually search.",
    positioning:
      "Each vertical has different intent patterns, trust signals, content needs, and conversion paths. We tailor the system to how your market actually searches.",
    description:
      "Generic SEO stops working when search intent changes by industry. Travel, education, healthcare, legal, SaaS, eCommerce, and franchise each reward a different mix of technical, content, authority, local, and AI search work.",
    primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
    secondaryCta: { label: "Book Strategy Call", href: "/book-a-call" },
    selectorSection: {
      eyebrow: "Sector map",
      title: "Find the vertical that matches your search challenge.",
      description:
        "Travel and Education are priority sectors where Taskcover has relevant team and partner experience context. Every vertical below gets a tailored system, not a template.",
      priorityBadge: "Priority sector",
    },
    comparisonSection: {
      eyebrow: "Search behavior matrix",
      title: "How industries differ in search.",
      description:
        "The same SEO task produces different results in different verticals. This matrix shows where the real friction is — so you know what to prioritize.",
      columns: [
        { key: "intent", label: "Search intent" },
        { key: "trust", label: "Trust sensitivity" },
        { key: "content", label: "Content depth" },
        { key: "demand", label: "Local vs national" },
        { key: "authority", label: "Authority needs" },
        { key: "cycle", label: "Conversion cycle" },
      ],
    },
    bundlesSection: {
      eyebrow: "Service bundles",
      title: "Recommended service bundles by need.",
      description:
        "Most industries need a connected stack — not one service. These bundles group Taskcover capabilities by the outcome each vertical needs most.",
      groups: [
        {
          label: "Technical foundation",
          description: "Crawl, indexation, architecture, and Core Web Vitals.",
          slugs: ["technical-seo", "seo-audit", "seo-agency"],
        },
        {
          label: "Content authority",
          description: "Expert-led clusters, internal linking, and topical depth.",
          slugs: ["content-marketing", "digital-pr-link-building", "ai-search-optimization"],
        },
        {
          label: "AI / search visibility",
          description: "Entity clarity, structured data, and citation-worthy assets.",
          slugs: ["ai-search-optimization", "technical-seo", "content-marketing"],
        },
        {
          label: "Local or international growth",
          description: "Location pages, multi-market architecture, and hreflang.",
          slugs: ["local-seo", "international-seo", "technical-seo"],
        },
        {
          label: "Paid demand capture",
          description: "Search ads aligned with organic intent for fast capture.",
          slugs: ["ppc-management", "seo-agency"],
        },
      ],
    },
    ctaSection: {
      eyebrow: "Start with a vertical audit",
      title: "Get an industry-specific SEO Growth Audit.",
      description:
        "Tell us your vertical and we'll review technical health, search demand, competitor gaps, content authority, and AI readiness — then map a 90-day plan.",
    },
  },

  industries: {
    /* ------------------------------------------------------------------ */
    "travel-seo": {
      slug: "travel-seo",
      icon: "travel",
      name: "Travel & Hospitality SEO",
      eyebrow: "Travel & Hospitality",
      h1: "Travel SEO for destination authority, direct bookings, and multi-language demand.",
      metaTitle: "Travel & Hospitality SEO Services for Destinations & Bookings",
      metaDescription:
        "Travel SEO for destination SERPs, aggregator competition, seasonal demand, international search, and AI travel answers. Tailored systems, not templates.",
      heroDescription:
        "Travel search is fragmented across OTAs, aggregators, review platforms, and AI answers. Taskcover builds destination authority, direct-booking demand, and multi-language visibility — selected team and partner experience includes global travel brands and campaigns across Agoda and Skyscanner.",
      marketContext:
        "Travel buyers research destinations, compare properties, read reviews, and ask AI tools for recommendations before booking. SERPs are dominated by aggregators, OTAs, and marketplaces — so direct brands must win authority, structured data, and destination content to compete.",
      buyerSearchBehavior:
        "Demand splits across destination queries (\"things to do in Kyoto\"), property and route comparisons (\"Agoda vs Booking.com\"), seasonal intent (\"best time to visit Bali\"), and AI recommendation queries (\"where to stay in Lisbon\"). Each query type needs different content, structure, and trust signals.",
      searchWorkflow: {
        title: "How travel buyers search",
        description:
          "The travel search journey moves from inspiration to comparison to booking — each stage rewards different SEO work.",
        steps: [
          { stage: "Inspiration", label: "Destination discovery", description: "Buyers explore \"best places to visit\" and seasonal content — destination authority and guides win." },
          { stage: "Research", label: "Property and route comparison", description: "Buyers compare properties, routes, and prices — structured data and comparison content win." },
          { stage: "Validation", label: "Reviews and trust checks", description: "Buyers cross-check reviews and authority signals before booking." },
          { stage: "Booking", label: "Direct vs aggregator decision", description: "Buyers decide between direct booking and OTAs — conversion content and trust win." },
          { stage: "AI answers", label: "AI travel recommendations", description: "Buyers ask AI tools for destination and property advice — citation-worthy content wins." },
        ],
      },
      painPoints: {
        title: "Where travel brands leak search demand.",
        description:
          "Travel SERPs are among the most competitive. These are the friction points that cost direct bookings and destination authority.",
        items: [
          { label: "Destination competition", detail: "Aggregators and OTAs dominate destination and property SERPs, pushing direct brands below the fold.", severity: "high" },
          { label: "Aggregator SERP dominance", detail: "Comparison and booking aggregators own transactional intent, leaving direct brands with awareness-stage demand.", severity: "high" },
          { label: "Multi-language demand", detail: "Travel buyers search in their native language — most direct brands serve one language and lose international demand.", severity: "medium" },
          { label: "Seasonality volatility", detail: "Demand spikes and drops seasonally — content and technical readiness must anticipate cycles, not react to them.", severity: "medium" },
          { label: "Review trust gaps", detail: "Buyers validate with reviews across platforms — inconsistent review strategy erodes trust at the booking moment.", severity: "medium" },
          { label: "AI travel answer absence", detail: "AI tools increasingly recommend destinations and properties — brands absent from citation-worthy content lose share.", severity: "high" },
        ],
      },
      seoOpportunities: {
        title: "Where travel brands can win.",
        items: [
          "Own destination content authority where aggregators have thin, templated pages",
          "Capture direct-booking demand with structured property and pricing data",
          "Win multi-language and multi-market demand with proper international architecture",
          "Earn AI travel answer citations with destination guides and expert-led content",
          "Anticipate seasonal demand with content timed to booking cycles",
          "Build destination authority through digital PR with travel publications",
        ],
      },
      taskcoverSolution: {
        title: "A connected travel SEO operating model.",
        description:
          "We connect technical, content, authority, international, AI search, and conversion into one system — each layer reinforcing the next.",
        layers: [
          { label: "Technical foundation", description: "Crawl, indexation, and architecture built for large destination and property catalogs." },
          { label: "Destination content authority", description: "Expert-led destination guides, property pages, and comparison content structured for search and AI." },
          { label: "International architecture", description: "Hreflang, locale strategy, and multi-language content for cross-market travel demand." },
          { label: "Digital PR authority", description: "Earned mentions in travel publications that build destination and brand authority." },
          { label: "AI search readiness", description: "Structured data and citation-worthy assets for AI travel answer surfaces." },
          { label: "Conversion paths", description: "Internal linking and CRO that move destination intent toward direct bookings." },
        ],
      },
      recommendedServices: ["international-seo", "content-marketing", "technical-seo", "digital-pr-link-building", "ai-search-optimization", "ppc-management"],
      contentStrategy: {
        title: "Destination content that compounds authority.",
        description:
          "Travel content must serve inspiration, comparison, and booking intent. We build destination clusters with internal linking that funnels demand toward conversion.",
        pillars: [
          "Destination guides that own \"best places to visit\" and \"things to do\" intent",
          "Property and property-type pages with structured data for comparison queries",
          "Seasonal and itinerary content timed to booking cycles",
          "Comparison content that captures \"vs\" and alternative intent",
          "Trust and review content that validates the booking decision",
        ],
      },
      authorityStrategy: {
        title: "Destination authority through earned coverage.",
        description:
          "Travel authority comes from relevant publications, destination mentions, and expert commentary — never spammy link tactics.",
        tactics: [
          "Digital PR with travel publications and destination media",
          "Data-led travel stories (seasonal trends, booking patterns, destination insights)",
          "Expert spokesperson commentary on travel and hospitality trends",
          "Citation-worthy destination assets that AI surfaces reference",
        ],
      },
      localInternationalAngle: {
        title: "International and multi-language travel demand",
        description:
          "Travel is inherently international. We design hreflang architecture, locale strategy, and localized content so the right page wins demand in each market and language.",
      },
      trustSignals:
        "Reviews, editorial coverage, destination authority, and structured data that validate booking decisions across platforms and AI surfaces.",
      outcomes: [
        { label: "Clearer search coverage", description: "Destination, property, and comparison intent captured across the funnel." },
        { label: "Stronger trust signals", description: "Reviews, mentions, and authority that validate booking decisions." },
        { label: "Better qualified demand", description: "Content reaches buyers at inspiration, research, and booking stages." },
        { label: "Stronger international visibility", description: "Multi-language and multi-market architecture captures cross-border demand." },
        { label: "Better AI travel readiness", description: "Citation-worthy content structured for AI answer surfaces." },
      ],
      faqs: [
        { q: "Do you have travel SEO experience?", a: "Selected team and partner experience includes global brands and campaigns across travel and search growth, including Agoda and Skyscanner context. Brand names are referenced as experience context only and do not imply endorsement." },
        { q: "Can you help with OTA and aggregator competition?", a: "Yes. We build destination authority, structured data, and direct-booking content that helps direct brands compete with aggregators and OTAs on the queries that matter." },
        { q: "Do you handle multi-language travel SEO?", a: "Yes. International architecture, hreflang, and localized content are core to travel SEO — travel demand is inherently cross-border and multilingual." },
        { q: "How do you address AI travel answers?", a: "We structure destination and property content so AI surfaces can parse, summarize, and cite it — building the conditions that make citations more likely." },
        { q: "Do you guarantee direct booking increases?", a: "No. We focus on durable visibility, authority, and conversion paths we can influence and measure — not specific booking guarantees." },
      ],
      finalCta: {
        title: "Get a Travel SEO Growth Audit.",
        description:
          "See exactly where your destination, property, and direct-booking visibility stands — and get a 90-day plan to close the gaps.",
        auditLabel: "Your travel audit includes:",
        auditItems: [
          "Technical snapshot",
          "Search demand map (destination, property, comparison)",
          "Competitor gap vs aggregators and OTAs",
          "Content authority gap",
          "AI travel readiness check",
          "90-day roadmap",
        ],
      },
      related: ["education-seo", "saas-seo", "ecommerce-seo"],
    },

    /* ------------------------------------------------------------------ */
    "education-seo": {
      slug: "education-seo",
      icon: "education",
      name: "Education & Institutional SEO",
      eyebrow: "Education & Institutions",
      h1: "Education SEO for program visibility, institutional trust, and long decision cycles.",
      metaTitle: "Education & Institutional SEO Services for Programs & Trust",
      metaDescription:
        "Education SEO for program search, comparison intent, institutional trust, long decision cycles, and international student demand. Tailored systems for education.",
      heroDescription:
        "Education decisions are trust-heavy and research-driven. Taskcover builds program authority, structured data, and expert-led content for long consideration cycles — selected team and partner experience includes global education and institutional context across British Council.",
      marketContext:
        "Students and families research programs, compare institutions, validate outcomes, and seek expert guidance over weeks or months. Trust signals — accreditation, outcomes, faculty authority — weigh heavily in both Google and AI answer surfaces.",
      buyerSearchBehavior:
        "Education demand centers on program queries (\"MBA programs in Canada\"), comparison intent (\"university vs college\"), outcome questions (\"is this degree worth it\"), and international student research. Each stage needs different trust signals and content depth.",
      searchWorkflow: {
        title: "How education buyers search",
        description:
          "The education journey is long and trust-driven. Each stage rewards different content and authority work.",
        steps: [
          { stage: "Discovery", label: "Program and field exploration", description: "Students explore fields and program types — broad program and outcome content wins." },
          { stage: "Comparison", label: "Institution and program comparison", description: "Students compare programs, costs, and outcomes — structured program data wins." },
          { stage: "Validation", label: "Accreditation and trust checks", description: "Students and families verify accreditation, outcomes, and reputation." },
          { stage: "Decision", label: "Application and enrollment", description: "Students move toward application — conversion content and clear pathways win." },
          { stage: "International", label: "Cross-border student research", description: "International students research in their language — localized content and trust win." },
        ],
      },
      painPoints: {
        title: "Where education institutions leak search demand.",
        description:
          "Education SEO fails when institutions treat it like generic content marketing. These are the friction points that cost enrollments and authority.",
        items: [
          { label: "Long decision cycles", detail: "Students research for weeks or months — content must sustain authority across the entire journey, not just a single visit.", severity: "high" },
          { label: "Program comparison gaps", detail: "Students compare programs across institutions — most sites lack structured program data and comparison content.", severity: "high" },
          { label: "Institutional trust deficits", detail: "Accreditation, outcomes, and faculty authority are thin or missing — eroding trust at the decision moment.", severity: "high" },
          { label: "Outcome question gaps", detail: "Students ask \"is this worth it\" — most institutions lack outcome and value content that answers honestly.", severity: "medium" },
          { label: "International student demand", detail: "International students search in their language and context — most institutions serve one locale and lose demand.", severity: "medium" },
          { label: "Unstructured program data", detail: "Program details are buried in PDFs or generic pages — making them invisible to search and AI surfaces.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Where education institutions can win.",
        items: [
          "Own program and field-of-study authority with expert-led content clusters",
          "Capture comparison intent with structured program data and honest comparisons",
          "Build trust with accreditation, outcome, and faculty authority content",
          "Win international student demand with localized content and architecture",
          "Earn AI answer citations with structured, citation-worthy program content",
          "Sustain authority across long decision cycles with refresh and nurture content",
        ],
      },
      taskcoverSolution: {
        title: "A trust-first education SEO operating model.",
        description:
          "We connect technical, content, authority, AI search, and international work into a system built for long education decision cycles.",
        layers: [
          { label: "Technical foundation", description: "Crawl, indexation, and architecture for large program and course catalogs." },
          { label: "Program content authority", description: "Expert-led program, outcome, and field-of-study clusters that build trust." },
          { label: "Structured program data", description: "Schema and structured content that make programs machine-understandable for search and AI." },
          { label: "Institutional authority", description: "Digital PR and expert commentary that build institutional and faculty credibility." },
          { label: "AI search readiness", description: "Citation-worthy education content for AI answer surfaces." },
          { label: "International student reach", description: "Localized content and architecture for cross-border education demand." },
        ],
      },
      recommendedServices: ["content-marketing", "technical-seo", "ai-search-optimization", "digital-pr-link-building", "international-seo", "seo-mentor-service"],
      contentStrategy: {
        title: "Content that builds trust across long cycles.",
        description:
          "Education content must answer program, outcome, and comparison questions with genuine expertise. We build clusters that sustain authority across the full decision journey.",
        pillars: [
          "Program and course pages with structured data for search and AI",
          "Field-of-study clusters that own broad discovery and comparison intent",
          "Outcome and value content that answers \"is this worth it\" honestly",
          "Accreditation, faculty, and institutional authority content",
          "International student content localized for cross-border demand",
        ],
      },
      authorityStrategy: {
        title: "Institutional authority through expertise and coverage.",
        description:
          "Education authority comes from accreditation, faculty expertise, and coverage in trusted publications — not link schemes.",
        tactics: [
          "Digital PR with education and industry publications",
          "Faculty and expert commentary on education and career trends",
          "Data-led stories on outcomes, enrollment, and education trends",
          "Citation-worthy program and outcome assets that AI surfaces reference",
        ],
      },
      localInternationalAngle: {
        title: "International student demand",
        description:
          "International students are a major demand segment. We design localized content and architecture so institutions reach students across markets and languages.",
      },
      trustSignals:
        "Accreditation, outcomes, faculty authority, expert commentary, and structured program data that validate education decisions across search and AI surfaces.",
      outcomes: [
        { label: "Clearer search coverage", description: "Program, field, and comparison intent captured across the journey." },
        { label: "Stronger trust signals", description: "Accreditation, outcomes, and expertise that validate decisions." },
        { label: "Better qualified demand", description: "Content reaches students at discovery, comparison, and decision stages." },
        { label: "Stronger international reach", description: "Localized content captures cross-border student demand." },
        { label: "Better AI search readiness", description: "Structured program content for AI answer surfaces." },
      ],
      faqs: [
        { q: "Do you have education SEO experience?", a: "Selected team and partner experience includes global education and institutional context, including British Council context. Brand names are referenced as experience context only and do not imply endorsement." },
        { q: "Can you help with program comparison content?", a: "Yes. We build structured program data and honest comparison content that captures the comparison intent students actually search for." },
        { q: "Do you handle international student SEO?", a: "Yes. International architecture, localization, and cross-border content strategy are core to education SEO." },
        { q: "How do you address long decision cycles?", a: "We build content clusters that sustain authority across the full journey — discovery, comparison, validation, and decision — with refresh and nurture content." },
        { q: "Do you guarantee enrollment increases?", a: "No. We focus on durable visibility, authority, and qualified demand we can influence and measure — not enrollment guarantees." },
      ],
      finalCta: {
        title: "Get an Education SEO Growth Audit.",
        description:
          "See exactly where your program, institutional, and outcome visibility stands — and get a 90-day plan to build trust and capture demand.",
        auditLabel: "Your education audit includes:",
        auditItems: [
          "Technical snapshot",
          "Search demand map (program, field, comparison)",
          "Competitor gap",
          "Content authority and trust gap",
          "AI readiness check",
          "90-day roadmap",
        ],
      },
      related: ["travel-seo", "healthcare-seo", "saas-seo"],
    },

    /* ------------------------------------------------------------------ */
    "healthcare-seo": {
      slug: "healthcare-seo",
      icon: "healthcare",
      name: "Healthcare & Wellness SEO",
      eyebrow: "Healthcare & Wellness",
      h1: "Healthcare SEO for trust, expert credibility, and local service demand.",
      metaTitle: "Healthcare & Wellness SEO Services for Trust & Local Demand",
      metaDescription:
        "Healthcare SEO for trust sensitivity, expert credibility, local demand, service pages, and compliance-aware content. No medical claims — authority-led systems.",
      heroDescription:
        "Healthcare search is trust-sensitive and locally driven. Taskcover builds expert-led content, service-area visibility, and reputation signals — with compliance-aware messaging that avoids medical claims.",
      marketContext:
        "Patients and families search for conditions, treatments, providers, and local services. Trust signals — expert review, credentials, reputation — weigh heavily, and compliance requirements shape what can and cannot be claimed.",
      buyerSearchBehavior:
        "Healthcare demand splits across condition queries, treatment research, provider searches, and local service intent (\"near me\"). Each type needs different trust signals, content depth, and local visibility.",
      searchWorkflow: {
        title: "How healthcare buyers search",
        description:
          "The healthcare journey moves from symptom research to provider selection — each stage rewards trust and local visibility.",
        steps: [
          { stage: "Research", label: "Condition and treatment exploration", description: "Patients research conditions and treatments — expert-reviewed, authoritative content wins." },
          { stage: "Evaluation", label: "Provider and clinic comparison", description: "Patients compare providers and clinics — structured service pages win." },
          { stage: "Local", label: "Near-me service searches", description: "Patients search for nearby providers and services — local pack and GBP win." },
          { stage: "Validation", label: "Review and reputation checks", description: "Patients validate with reviews and reputation before booking." },
          { stage: "Decision", label: "Booking and contact", description: "Patients move toward booking — clear conversion paths and trust win." },
        ],
      },
      painPoints: {
        title: "Where healthcare brands leak search demand.",
        description:
          "Healthcare SEO fails when trust signals are weak or content makes claims it cannot support. These are the friction points that cost patients and authority.",
        items: [
          { label: "Trust and compliance sensitivity", detail: "Healthcare content must be accurate, expert-reviewed, and compliance-aware — weak claims erode trust and risk penalties.", severity: "high" },
          { label: "Local intent gaps", detail: "Patients search \"near me\" — weak GBP, location pages, and local pack presence cost nearby demand.", severity: "high" },
          { label: "Expert credibility deficits", detail: "Content lacks expert review or credentials — failing the trust signals healthcare demands.", severity: "high" },
          { label: "Service page thinness", detail: "Service and treatment pages are thin or templated — losing visibility on high-intent queries.", severity: "medium" },
          { label: "Reputation signal gaps", detail: "Reviews are earned slowly and managed rarely — weakening trust at the booking moment.", severity: "medium" },
          { label: "AI answer absence", detail: "AI surfaces increasingly answer health questions — brands without citation-worthy content lose share.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Where healthcare brands can win.",
        items: [
          "Own condition and treatment authority with expert-reviewed content",
          "Win local demand with GBP, location pages, and service-area strategy",
          "Build trust with credentials, expert review, and reputation signals",
          "Capture provider and service intent with structured service pages",
          "Earn AI answer citations with authoritative, citation-worthy health content",
          "Strengthen conversion paths from local search to booking",
        ],
      },
      taskcoverSolution: {
        title: "A trust-led healthcare SEO operating model.",
        description:
          "We connect technical, content, authority, local, and AI search work into a system built for healthcare trust and compliance.",
        layers: [
          { label: "Technical foundation", description: "Crawl, indexation, and architecture for service and provider catalogs." },
          { label: "Expert-reviewed content", description: "Condition, treatment, and service content reviewed for accuracy and trust." },
          { label: "Local visibility", description: "GBP, location pages, and service-area strategy for near-me demand." },
          { label: "Reputation signals", description: "Review strategy and management that build trust at the booking moment." },
          { label: "AI search readiness", description: "Citation-worthy health content structured for AI answer surfaces." },
          { label: "Compliance-aware messaging", description: "Content guidance that avoids medical claims and respects compliance boundaries." },
        ],
      },
      recommendedServices: ["local-seo", "content-marketing", "technical-seo", "seo-audit", "ai-search-optimization"],
      contentStrategy: {
        title: "Content that earns healthcare trust.",
        description:
          "Healthcare content must be expert-reviewed, accurate, and genuinely helpful. We build condition and service clusters that trust signals validate.",
        pillars: [
          "Condition and treatment content reviewed for accuracy and authority",
          "Service and provider pages with structured data for search and AI",
          "Local and service-area content for near-me demand",
          "Trust and credential content that validates expertise",
          "Patient journey content from research to booking",
        ],
      },
      authorityStrategy: {
        title: "Authority through expertise and reputation.",
        description:
          "Healthcare authority comes from expert review, credentials, and reputation — not aggressive link tactics.",
        tactics: [
          "Expert-reviewed content that demonstrates genuine expertise",
          "Digital PR with health and wellness publications",
          "Reputation and review strategy that builds trust",
          "Citation-worthy health assets that AI surfaces reference",
        ],
      },
      trustSignals:
        "Expert review, credentials, accreditation, reputation, and structured data that validate healthcare decisions across search and AI surfaces.",
      outcomes: [
        { label: "Clearer search coverage", description: "Condition, treatment, service, and provider intent captured." },
        { label: "Stronger trust signals", description: "Expertise, credentials, and reputation that validate decisions." },
        { label: "Better local visibility", description: "GBP, location pages, and local pack presence for near-me demand." },
        { label: "Better qualified demand", description: "Content reaches patients at research, evaluation, and booking stages." },
        { label: "Better AI search readiness", description: "Citation-worthy health content for AI answer surfaces." },
      ],
      faqs: [
        { q: "Do you make medical claims in content?", a: "No. We avoid medical claims and compliance-risky messaging. Content is expert-reviewed where appropriate and focuses on helpful, authoritative information." },
        { q: "Can you help with local healthcare SEO?", a: "Yes. GBP optimization, location pages, service-area strategy, and local pack visibility are core to healthcare demand capture." },
        { q: "How do you handle expert review?", a: "We build content systems designed for expert review and provide guidance on demonstrating expertise and credentials in search-visible ways." },
        { q: "Do you manage healthcare reviews?", a: "We provide review strategy and response guidance. We do not post fake reviews." },
        { q: "Do you guarantee patient increases?", a: "No. We focus on durable visibility, authority, and qualified demand we can influence and measure — not patient guarantees." },
      ],
      finalCta: {
        title: "Get a Healthcare SEO Growth Audit.",
        description:
          "See exactly where your service, local, and trust visibility stands — and get a 90-day plan to capture healthcare demand safely.",
        auditLabel: "Your healthcare audit includes:",
        auditItems: [
          "Technical snapshot",
          "Search demand map (condition, service, local)",
          "Competitor gap",
          "Content authority and trust gap",
          "AI readiness check",
          "90-day roadmap",
        ],
      },
      related: ["legal-immigration-seo", "franchise-local-seo", "education-seo"],
    },

    /* ------------------------------------------------------------------ */
    "legal-immigration-seo": {
      slug: "legal-immigration-seo",
      icon: "legal",
      name: "Legal & Immigration SEO",
      eyebrow: "Legal & Immigration",
      h1: "Legal & Immigration SEO for high-trust demand, service-area visibility, and intake conversion.",
      metaTitle: "Legal & Immigration SEO Services for Trust & Intake",
      metaDescription:
        "Legal and immigration SEO for high-trust consultative demand, service-area pages, long-tail questions, local authority, and intake conversion. No legal guarantees.",
      heroDescription:
        "Legal and immigration decisions are high-stakes and trust-driven. Taskcover builds service-area visibility, trust-first content, and authority signals for consultative demand — without legal guarantees.",
      marketContext:
        "Clients search for case types, jurisdictions, and local legal services with high trust sensitivity. Demand is consultative, reputation-driven, and often urgent — making trust signals and local visibility critical.",
      buyerSearchBehavior:
        "Legal demand centers on case-type queries, jurisdiction-specific searches, long-tail questions (\"how to apply for...\"), and local service intent. Each type needs different trust signals and content depth.",
      searchWorkflow: {
        title: "How legal and immigration clients search",
        description:
          "The legal journey moves from question research to consultation — each stage rewards trust and local authority.",
        steps: [
          { stage: "Research", label: "Case-type and process questions", description: "Clients research case types and processes — long-tail Q&A content wins." },
          { stage: "Evaluation", label: "Firm and service comparison", description: "Clients compare firms and services — structured service pages win." },
          { stage: "Local", label: "Jurisdiction and near-me searches", description: "Clients search for local and jurisdiction-specific services — local pages win." },
          { stage: "Validation", label: "Review and credential checks", description: "Clients validate with reviews, credentials, and reputation." },
          { stage: "Intake", label: "Consultation and contact", description: "Clients move toward consultation — clear intake paths and trust win." },
        ],
      },
      painPoints: {
        title: "Where legal and immigration firms leak search demand.",
        description:
          "Legal SEO fails when trust is weak or local visibility is missing. These are the friction points that cost consultations and authority.",
        items: [
          { label: "High-trust decision behavior", detail: "Legal decisions are high-stakes — weak trust signals and credentials cost consultations at the evaluation moment.", severity: "high" },
          { label: "Service-area visibility gaps", detail: "Clients search by jurisdiction and location — thin service-area pages and weak GBP cost local demand.", severity: "high" },
          { label: "Long-tail question gaps", detail: "Clients ask detailed process questions — most firms lack the Q&A content that captures this demand.", severity: "medium" },
          { label: "Local page duplication", detail: "Location pages are thin or duplicated — failing to capture jurisdiction-specific intent.", severity: "medium" },
          { label: "Authority and credential deficits", detail: "Bar credentials, case results, and expertise are thin — eroding trust at the consultation moment.", severity: "high" },
          { label: "Intake conversion friction", detail: "Consultation and contact paths are unclear — leaking qualified demand at the final step.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Where legal and immigration firms can win.",
        items: [
          "Own case-type and process authority with expert-led Q&A content",
          "Win local demand with service-area pages, GBP, and jurisdiction content",
          "Build trust with credentials, expertise, and reputation signals",
          "Capture long-tail question intent with structured FAQ content",
          "Strengthen intake conversion from search to consultation",
          "Earn authority through digital PR with legal and immigration publications",
        ],
      },
      taskcoverSolution: {
        title: "A trust-first legal SEO operating model.",
        description:
          "We connect technical, content, authority, local, and conversion work into a system built for high-trust legal demand.",
        layers: [
          { label: "Technical foundation", description: "Crawl, indexation, and architecture for service and location catalogs." },
          { label: "Trust-first content", description: "Case-type, process, and FAQ content that demonstrates genuine expertise." },
          { label: "Service-area visibility", description: "Location pages, GBP, and jurisdiction content for local and regional demand." },
          { label: "Authority and credentials", description: "Digital PR and credential visibility that build trust at the consultation moment." },
          { label: "Intake conversion", description: "Clear consultation and contact paths from search to intake." },
          { label: "Reputation signals", description: "Review strategy and management that validate firm trustworthiness." },
        ],
      },
      recommendedServices: ["local-seo", "content-marketing", "technical-seo", "digital-pr-link-building", "ppc-management"],
      contentStrategy: {
        title: "Content that builds legal trust.",
        description:
          "Legal content must answer detailed questions with genuine expertise. We build case-type and process clusters that trust signals validate.",
        pillars: [
          "Case-type and practice-area pages with structured data",
          "Process and how-to Q&A content for long-tail question demand",
          "Location and jurisdiction pages for service-area visibility",
          "Credential, expertise, and authority content that validates trust",
          "Client journey content from research to consultation",
        ],
      },
      authorityStrategy: {
        title: "Authority through credentials and coverage.",
        description:
          "Legal authority comes from credentials, expertise, and coverage in trusted publications — not link schemes.",
        tactics: [
          "Digital PR with legal and immigration publications",
          "Expert commentary on legal and immigration trends",
          "Credential and expertise visibility that demonstrates authority",
          "Citation-worthy legal content that AI surfaces reference",
        ],
      },
      trustSignals:
        "Bar credentials, expertise, reputation, reviews, and structured data that validate legal and immigration decisions across search and AI surfaces.",
      outcomes: [
        { label: "Clearer search coverage", description: "Case-type, process, and local intent captured across the journey." },
        { label: "Stronger trust signals", description: "Credentials, expertise, and reputation that validate decisions." },
        { label: "Better local visibility", description: "Service-area pages, GBP, and jurisdiction content for regional demand." },
        { label: "Better qualified demand", description: "Content reaches clients at research, evaluation, and intake stages." },
        { label: "Better intake conversion", description: "Clear paths from search to consultation and contact." },
      ],
      faqs: [
        { q: "Do you make legal guarantees?", a: "No. We avoid legal guarantees and outcome promises. Content focuses on demonstrating expertise and capturing qualified demand." },
        { q: "Can you help with service-area SEO?", a: "Yes. Location pages, GBP, jurisdiction content, and service-area strategy are core to legal and immigration demand capture." },
        { q: "Do you handle immigration-specific SEO?", a: "Yes. Immigration demand has distinct trust, jurisdiction, and long-tail question patterns that we tailor content and architecture to." },
        { q: "How do you address high-trust behavior?", a: "We build trust-first content, credential visibility, and authority signals that validate decisions at the consultation moment." },
        { q: "Do you guarantee consultation increases?", a: "No. We focus on durable visibility, authority, and qualified demand we can influence and measure — not consultation guarantees." },
      ],
      finalCta: {
        title: "Get a Legal & Immigration SEO Growth Audit.",
        description:
          "See exactly where your case-type, local, and trust visibility stands — and get a 90-day plan to capture consultative demand.",
        auditLabel: "Your legal audit includes:",
        auditItems: [
          "Technical snapshot",
          "Search demand map (case-type, process, local)",
          "Competitor gap",
          "Content authority and trust gap",
          "AI readiness check",
          "90-day roadmap",
        ],
      },
      related: ["healthcare-seo", "franchise-local-seo", "saas-seo"],
    },

    /* ------------------------------------------------------------------ */
    "saas-seo": {
      slug: "saas-seo",
      icon: "saas",
      name: "SaaS & Technology SEO",
      eyebrow: "SaaS & Technology",
      h1: "SaaS SEO for category authority, comparison intent, and product-led content.",
      metaTitle: "SaaS & Technology SEO Services for Categories & Comparison",
      metaDescription:
        "SaaS SEO for category pages, comparison intent, product-led content, technical documentation, competitor SERPs, AI search, and conversion content.",
      heroDescription:
        "SaaS categories are crowded and comparison-driven. Taskcover builds category authority, comparison content, and product-led pages that capture buyers researching alternatives and integrations.",
      marketContext:
        "SaaS buyers research categories, compare alternatives, evaluate integrations, and seek product proof before converting. SERPs are competitive, comparison-heavy, and increasingly answered by AI surfaces.",
      buyerSearchBehavior:
        "SaaS demand centers on category queries (\"best CRM software\"), comparison intent (\"Tool A vs Tool B\"), alternative searches (\"Tool A alternatives\"), and integration questions. Each type needs different content and authority signals.",
      searchWorkflow: {
        title: "How SaaS buyers search",
        description:
          "The SaaS journey moves from category research to comparison to trial — each stage rewards different content depth.",
        steps: [
          { stage: "Discovery", label: "Category and solution research", description: "Buyers explore categories and solution types — category and buyer-guide content wins." },
          { stage: "Comparison", label: "Tool and alternative comparison", description: "Buyers compare tools and alternatives — comparison and \"vs\" content wins." },
          { stage: "Integration", label: "Integration and compatibility checks", description: "Buyers check integrations and compatibility — technical and integration content wins." },
          { stage: "Validation", label: "Proof and review checks", description: "Buyers validate with reviews, case proof, and expert commentary." },
          { stage: "Trial", label: "Sign-up and trial conversion", description: "Buyers move toward trial — product-led and conversion content win." },
        ],
      },
      painPoints: {
        title: "Where SaaS brands leak search demand.",
        description:
          "SaaS SEO fails when category and comparison content is thin or absent. These are the friction points that cost trials and authority.",
        items: [
          { label: "Category competition", detail: "SaaS category SERPs are crowded — thin category pages lose visibility to competitors and listicle sites.", severity: "high" },
          { label: "Comparison intent gaps", detail: "Buyers compare tools — most SaaS sites lack the \"vs\" and alternative content that captures this demand.", severity: "high" },
          { label: "Product-led content deficits", detail: "Content is marketing-fluff, not product-led — failing to reach buyers evaluating features and use cases.", severity: "medium" },
          { label: "Technical documentation gaps", detail: "Docs and integration content are poorly optimized — losing visibility on developer and integration queries.", severity: "medium" },
          { label: "Competitor SERP dominance", detail: "Competitors and aggregator review sites own comparison and alternative queries.", severity: "high" },
          { label: "AI answer absence", detail: "AI surfaces increasingly recommend tools — brands without structured, citation-worthy content lose share.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Where SaaS brands can win.",
        items: [
          "Own category authority with deep, expert-led category content",
          "Capture comparison and alternative intent with honest \"vs\" content",
          "Win developer and integration queries with optimized documentation",
          "Build product-led content that reaches buyers evaluating features",
          "Earn AI answer citations with structured product and comparison content",
          "Strengthen trial conversion paths from search to sign-up",
        ],
      },
      taskcoverSolution: {
        title: "A category-led SaaS SEO operating model.",
        description:
          "We connect technical, content, authority, AI search, and conversion work into a system built for SaaS category competition.",
        layers: [
          { label: "Technical foundation", description: "Crawl, indexation, and architecture for product, docs, and content catalogs." },
          { label: "Category content authority", description: "Expert-led category, buyer-guide, and use-case clusters that build authority." },
          { label: "Comparison content", description: "Honest \"vs\", alternative, and comparison content that captures evaluation intent." },
          { label: "Product-led content", description: "Feature, use-case, and integration content that reaches buyers evaluating products." },
          { label: "AI search readiness", description: "Structured product and comparison content for AI answer surfaces." },
          { label: "Conversion paths", description: "Internal linking and CRO that move evaluation intent toward trial and sign-up." },
        ],
      },
      recommendedServices: ["seo-agency", "technical-seo", "content-marketing", "ai-search-optimization", "ppc-management", "seo-mentor-service"],
      contentStrategy: {
        title: "Content that wins SaaS categories.",
        description:
          "SaaS content must serve category, comparison, and evaluation intent with genuine product depth. We build clusters that capture buyers across the evaluation journey.",
        pillars: [
          "Category and buyer-guide content that owns broad discovery intent",
          "Comparison and alternative content that captures evaluation queries",
          "Product-led feature and use-case content for feature-specific demand",
          "Technical documentation optimized for developer and integration queries",
          "Proof and review content that validates the trial decision",
        ],
      },
      authorityStrategy: {
        title: "Authority through product proof and coverage.",
        description:
          "SaaS authority comes from product proof, expert reviews, and coverage in trusted publications — not link schemes.",
        tactics: [
          "Digital PR with technology and SaaS publications",
          "Expert commentary on SaaS and technology trends",
          "Product proof and integration visibility that demonstrates authority",
          "Citation-worthy product content that AI surfaces reference",
        ],
      },
      trustSignals:
        "Product proof, integrations, expert reviews, and coverage in trusted publications that validate SaaS decisions across search and AI surfaces.",
      outcomes: [
        { label: "Clearer search coverage", description: "Category, comparison, and integration intent captured." },
        { label: "Stronger category authority", description: "Expert-led content that owns category and evaluation queries." },
        { label: "Better qualified demand", description: "Content reaches buyers at discovery, comparison, and trial stages." },
        { label: "Better AI search readiness", description: "Structured product content for AI answer surfaces." },
        { label: "Better trial conversion", description: "Clear paths from search to sign-up and trial." },
      ],
      faqs: [
        { q: "Can you help with comparison and alternative content?", a: "Yes. Honest \"vs\" and alternative content is core to SaaS SEO — we build it to capture evaluation intent without misleading buyers." },
        { q: "Do you optimize technical documentation?", a: "Yes. We optimize docs and integration content for developer and integration queries — a major SaaS demand segment." },
        { q: "How do you handle category competition?", a: "We build deep, expert-led category content and authority signals that compete with listicle sites and competitors on quality." },
        { q: "Do you address AI search for SaaS?", a: "Yes. AI surfaces increasingly recommend tools — we structure product and comparison content to be citation-worthy." },
        { q: "Do you guarantee trial increases?", a: "No. We focus on durable visibility, authority, and qualified demand we can influence and measure — not trial guarantees." },
      ],
      finalCta: {
        title: "Get a SaaS SEO Growth Audit.",
        description:
          "See exactly where your category, comparison, and product visibility stands — and get a 90-day plan to win SaaS demand.",
        auditLabel: "Your SaaS audit includes:",
        auditItems: [
          "Technical snapshot",
          "Search demand map (category, comparison, integration)",
          "Competitor gap",
          "Content authority gap",
          "AI readiness check",
          "90-day roadmap",
        ],
      },
      related: ["travel-seo", "ecommerce-seo", "education-seo"],
    },

    /* ------------------------------------------------------------------ */
    "ecommerce-seo": {
      slug: "ecommerce-seo",
      icon: "ecommerce",
      name: "eCommerce SEO",
      eyebrow: "eCommerce",
      h1: "eCommerce SEO for category architecture, product pages, and buying-intent demand.",
      metaTitle: "eCommerce SEO Services for Categories, Products & Revenue",
      metaDescription:
        "eCommerce SEO for category architecture, product pages, faceted navigation, buying-intent content, internal links, and merchandising search demand.",
      heroDescription:
        "eCommerce SEO is judged by revenue, not traffic. Taskcover builds category architecture, product page systems, and buying-intent content that captures and converts transactional demand.",
      marketContext:
        "eCommerce buyers search categories, compare products, read reviews, and expect structured product data. SERPs are competitive, faceted navigation creates indexation challenges, and marketplaces capture significant demand.",
      buyerSearchBehavior:
        "eCommerce demand centers on category queries, product-specific searches, comparison intent, and transactional (\"buy\") queries. Each type needs different architecture, content, and structured data.",
      searchWorkflow: {
        title: "How eCommerce buyers search",
        description:
          "The eCommerce journey moves from category browsing to product comparison to purchase — each stage rewards architecture and content.",
        steps: [
          { stage: "Browse", label: "Category and product discovery", description: "Buyers browse categories and products — well-structured category pages win." },
          { stage: "Compare", label: "Product and feature comparison", description: "Buyers compare products and features — structured product pages win." },
          { stage: "Validate", label: "Review and rating checks", description: "Buyers validate with reviews and ratings before purchase." },
          { stage: "Transaction", label: "Buy-intent searches", description: "Buyers search with transactional intent — buying-intent content and pages win." },
          { stage: "Discovery+", label: "Guide and hub research", description: "Buyers research via guides and hubs — content that supports discovery wins." },
        ],
      },
      painPoints: {
        title: "Where eCommerce stores leak search demand.",
        description:
          "eCommerce SEO fails when architecture and product data are weak. These are the friction points that cost revenue.",
        items: [
          { label: "Category architecture gaps", detail: "Categories are not mapped to buying intent — generic templates never convert.", severity: "high" },
          { label: "Thin product pages", detail: "Product pages are thin or duplicated across variants — losing visibility and trust.", severity: "high" },
          { label: "Faceted navigation risk", detail: "Faceted nav creates indexation bloat and diluted authority across thousands of low-value URLs.", severity: "high" },
          { label: "Internal linking weakness", detail: "Poor linking between categories, products, and hubs — demand doesn't flow toward conversion.", severity: "medium" },
          { label: "Buying-intent content absence", detail: "Guides and hubs that capture discovery demand are missing.", severity: "medium" },
          { label: "Marketplace demand loss", detail: "Buying-intent demand leaks to marketplaces — structured data and architecture must compete.", severity: "medium" },
        ],
      },
      seoOpportunities: {
        title: "Where eCommerce stores can win.",
        items: [
          "Map category architecture to how buyers search and buy",
          "Build unique, structured product pages that convert",
          "Control faceted navigation to consolidate authority",
          "Create buying-intent content hubs that capture discovery",
          "Strengthen internal linking from content to products",
          "Compete with marketplaces on structured data and product depth",
        ],
      },
      taskcoverSolution: {
        title: "A revenue-focused eCommerce SEO operating model.",
        description:
          "We connect technical, content, architecture, and conversion work into a system built for eCommerce revenue.",
        layers: [
          { label: "Technical foundation", description: "Crawl, indexation, and performance for large product catalogs." },
          { label: "Category architecture", description: "Structure that maps categories to how people search and buy." },
          { label: "Product page system", description: "Templates for unique, indexable, conversion-ready product pages." },
          { label: "Faceted navigation control", description: "Indexation rules that consolidate authority across facets." },
          { label: "Buying-intent content", description: "Guides and hubs that capture and funnel discovery demand." },
          { label: "Conversion paths", description: "Internal linking and CRO from search demand to sale." },
        ],
      },
      recommendedServices: ["ecommerce-seo", "technical-seo", "content-marketing", "ppc-management", "seo-audit"],
      contentStrategy: {
        title: "Content that drives eCommerce revenue.",
        description:
          "eCommerce content must support product discovery and conversion. We build buying guides and hubs that funnel demand toward products.",
        pillars: [
          "Category content that captures browsing and discovery intent",
          "Buying guides and hubs that support product decisions",
          "Product page content that is unique, structured, and conversion-ready",
          "Comparison content that captures evaluation queries",
          "Internal linking that funnels content demand toward products",
        ],
      },
      authorityStrategy: {
        title: "Authority through product depth and structure.",
        description:
          "eCommerce authority comes from structured product data, reviews, and content depth — not link schemes.",
        tactics: [
          "Structured product data that helps Google and AI surface products",
          "Review strategy that builds product trust",
          "Content depth that signals category authority",
          "Citation-worthy product and guide content for AI surfaces",
        ],
      },
      trustSignals:
        "Reviews, structured data, fulfillment trust, and product depth that validate purchase decisions across search and AI surfaces.",
      outcomes: [
        { label: "More buying-intent demand", description: "Visibility on the category and product terms that drive revenue." },
        { label: "Cleaner indexation", description: "Right pages indexed; facets controlled and authority consolidated." },
        { label: "Stronger product pages", description: "Unique, structured, and conversion-ready product content." },
        { label: "Better conversion paths", description: "Demand funneled from content toward purchase." },
        { label: "Better AI surface coverage", description: "Structured product data helps AI surfaces cite and surface products." },
      ],
      faqs: [
        { q: "Can you handle large product catalogs?", a: "Yes. We design faceted navigation rules and scalable templates that keep large catalogs indexable and high-quality." },
        { q: "Do you optimize product page templates?", a: "Yes. We define templates for unique, indexable, conversion-oriented product pages." },
        { q: "How do you address faceted navigation?", a: "We design indexation rules that control facets and consolidate authority — preventing indexation bloat." },
        { q: "Can you compete with marketplaces?", a: "Our focus is your own store. We build structured data and product depth that helps you compete for buying-intent demand." },
        { q: "Is eCommerce SEO measured by revenue?", a: "Yes. We tie work to qualified demand and revenue, not just traffic." },
      ],
      finalCta: {
        title: "Get an eCommerce SEO Growth Audit.",
        description:
          "See exactly where your category, product, and revenue visibility stands — and get a 90-day plan to capture buying-intent demand.",
        auditLabel: "Your eCommerce audit includes:",
        auditItems: [
          "Technical snapshot",
          "Search demand map (category, product, transactional)",
          "Competitor gap",
          "Content and architecture gap",
          "AI readiness check",
          "90-day roadmap",
        ],
      },
      related: ["saas-seo", "travel-seo", "franchise-local-seo"],
    },

    /* ------------------------------------------------------------------ */
    "franchise-local-seo": {
      slug: "franchise-local-seo",
      icon: "franchise",
      name: "Franchise & Multi-location SEO",
      eyebrow: "Franchise & Multi-location",
      h1: "Franchise SEO for location consistency, local authority, and multi-market visibility.",
      metaTitle: "Franchise & Multi-location SEO Services for Local Consistency",
      metaDescription:
        "Franchise and multi-location SEO for location consistency, local pages, Google Business Profile, reviews, NAP citations, duplication risk, and multi-market reporting.",
      heroDescription:
        "Multi-location and franchise brands need consistent local visibility at scale. Taskcover builds location architecture, GBP strategy, and review systems that win each location's local pack and maps.",
      marketContext:
        "Franchise and multi-location demand is decided in local packs, on maps, and across location-specific reviews. Consistency across locations — while staying specific — is the core challenge.",
      buyerSearchBehavior:
        "Franchise demand centers on near-me queries, location-specific service searches, and map-based discovery. Each location needs its own local authority and presence.",
      searchWorkflow: {
        title: "How franchise and multi-location buyers search",
        description:
          "The franchise journey is inherently local — each location must win its own pack, maps, and reviews.",
        steps: [
          { stage: "Local", label: "Near-me and location searches", description: "Buyers search near-me and location-specific terms — GBP and local pages win." },
          { stage: "Map", label: "Map-based discovery", description: "Buyers discover locations via maps — map presence and accuracy win." },
          { stage: "Compare", label: "Location and service comparison", description: "Buyers compare locations and services — structured location pages win." },
          { stage: "Validate", label: "Review and rating checks", description: "Buyers validate with location-specific reviews before visiting." },
          { stage: "Visit", label: "Direction and contact intent", description: "Buyers seek directions and contact — accurate NAP and location data win." },
        ],
      },
      painPoints: {
        title: "Where franchise and multi-location brands leak search demand.",
        description:
          "Franchise SEO fails when locations are inconsistent or duplicated. These are the friction points that cost local demand.",
        items: [
          { label: "Location consistency gaps", detail: "GBP, pages, and citations are inconsistent across locations — eroding local trust and visibility.", severity: "high" },
          { label: "Local page duplication", detail: "Location pages are duplicated or thin — failing to capture location-specific intent and risking doorway-page problems.", severity: "high" },
          { label: "Review signal inconsistency", detail: "Reviews are earned slowly and managed rarely across locations — weakening local trust.", severity: "medium" },
          { label: "NAP and citation errors", detail: "Name, address, and phone inconsistencies across directories confuse local signals.", severity: "medium" },
          { label: "Multi-market reporting gaps", detail: "Performance visibility by location is missing — making prioritization impossible.", severity: "medium" },
          { label: "Local authority deficits", detail: "Individual locations lack the local authority needed to win their own packs.", severity: "high" },
        ],
      },
      seoOpportunities: {
        title: "Where franchise and multi-location brands can win.",
        items: [
          "Build consistent, unique location pages at scale",
          "Win each location's local pack with GBP optimization",
          "Strengthen review strategy across all locations",
          "Fix NAP and citation consistency across directories",
          "Build local authority for each location",
          "Gain multi-market performance visibility by location",
        ],
      },
      taskcoverSolution: {
        title: "A scalable local SEO operating model.",
        description:
          "We connect location architecture, GBP, reviews, citations, and reporting into a system that scales across locations while staying specific.",
        layers: [
          { label: "Technical foundation", description: "Crawl, indexation, and architecture for location and service catalogs." },
          { label: "Location architecture", description: "Scalable, unique location and service-area pages with schema." },
          { label: "GBP optimization", description: "Categories, services, posts, and consistent management across locations." },
          { label: "Review strategy", description: "Earn reviews ethically and respond at scale across locations." },
          { label: "Citation consistency", description: "NAP cleanup and citation management across directories." },
          { label: "Multi-location reporting", description: "Performance visibility by location and market." },
        ],
      },
      recommendedServices: ["local-seo", "technical-seo", "content-marketing", "ppc-management", "seo-audit"],
      contentStrategy: {
        title: "Content that scales across locations.",
        description:
          "Franchise content must be scalable yet specific. We build location and service-area content that avoids duplication while capturing local intent.",
        pillars: [
          "Unique location pages that capture location-specific intent",
          "Service-area content for near-me and regional demand",
          "Local trust and community content that builds location authority",
          "Review and reputation content that validates location decisions",
          "Multi-location internal linking that strengthens local pages",
        ],
      },
      authorityStrategy: {
        title: "Local authority at scale.",
        description:
          "Franchise authority comes from local relevance, reviews, and citations — not generic link schemes.",
        tactics: [
          "Local citation and NAP consistency across directories",
          "Review strategy that builds local trust at each location",
          "Local digital PR and community presence",
          "Location-specific authority that wins individual local packs",
        ],
      },
      trustSignals:
        "Location reviews, consistent NAP, GBP accuracy, and local authority that validate franchise decisions across search and maps.",
      outcomes: [
        { label: "Stronger local pack presence", description: "More visibility in maps and local results per location." },
        { label: "Scalable location pages", description: "Unique, useful pages without doorway-page risk." },
        { label: "Better reputation signals", description: "More and better-managed reviews across locations." },
        { label: "Clear local reporting", description: "Performance visibility by location and market." },
        { label: "Stronger local conversion", description: "Map and pack traffic reaches calls, forms, and visits." },
      ],
      faqs: [
        { q: "Can you handle franchise and multi-location SEO at scale?", a: "Yes. We build scalable architectures with unique, useful location pages that avoid doorway-page problems." },
        { q: "Do you manage Google Business Profile across locations?", a: "Yes. We provide GBP optimization and management guidance across all locations for consistency." },
        { q: "How do you avoid location page duplication?", a: "We design templated-but-unique pages with genuine local content — avoiding the thin duplication that creates doorway-page risk." },
        { q: "Do you handle NAP and citation cleanup?", a: "Yes. Citation consistency and NAP cleanup are core to multi-location local SEO." },
        { q: "How do you report across locations?", a: "We provide multi-location reporting that shows pack, maps, and performance by location and market." },
      ],
      finalCta: {
        title: "Get a Franchise & Multi-location SEO Growth Audit.",
        description:
          "See exactly where your location consistency, local authority, and multi-market visibility stands — and get a 90-day plan.",
        auditLabel: "Your franchise audit includes:",
        auditItems: [
          "Technical snapshot",
          "Search demand map (local, service-area)",
          "Location consistency gap",
          "Content authority gap",
          "AI readiness check",
          "90-day roadmap",
        ],
      },
      related: ["healthcare-seo", "legal-immigration-seo", "ecommerce-seo"],
    },
  },

  ui: {
    breadcrumbHome: "Home",
    breadcrumbIndustries: "Industries",
    heroCtaPrimary: "Get Free SEO Audit",
    heroCtaSecondary: "Book Strategy Call",
    heroFigcaption: "Illustrative — verified client data is added only with permission.",
    searchBehaviorEyebrow: "Search behavior",
    searchBehaviorIntentMap: "Intent map",
    painPointsEyebrow: "Market friction",
    painPointsScanner: "Risk scanner",
    painPointsRiskLevel: "Risk level",
    solutionEyebrow: "The Taskcover solution",
    solutionModel: "Operating model",
    servicesEyebrow: "Recommended services",
    servicesTitle: "The modules that fit this vertical.",
    servicesDesc: "Connected service modules — not a generic list — tailored to how this industry searches and converts.",
    servicesModule: "Module",
    contentAuthorityEyebrow: "Content & authority plan",
    contentAuthorityGrowthSystem: "Growth system",
    outcomesEyebrow: "Business outcomes",
    outcomesDesc: "Outcome categories — no fabricated metrics. Verified results are added only with attributable data.",
    faqEyebrow: "FAQ",
    faqTitle: "{industry} questions, answered.",
    ctaEyebrow: "Start your industry growth system",
    ctaAuditPreview: "Audit preview",
    ctaIllustrative: "Illustrative — each audit is scoped to your market and goals.",
    selectorViewIndustry: "View",
    selectorPriority: "Priority sector",
    comparisonIndustry: "Industry",
    bundlesIncludes: "Includes",
    relatedEyebrow: "Related industries",
    relatedTitle: "Explore related verticals.",
    exploreIndustry: "Explore industry",
    outcome: "Outcome",
  },
};