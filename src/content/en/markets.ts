/**
 * English markets content — hub + all 3 markets + UI strings.
 *
 * Each market is genuinely market-specific (no doorway-page duplication):
 *  - USA: highly competitive national SERPs, multi-location/franchise,
 *    SaaS/eCommerce, healthcare/legal trust, optional Spanish-language.
 *  - Canada: English/French bilingual, provincial nuance, education,
 *    immigration/legal, international SEO + localization.
 *  - Australia: high-value service niches, local + national competition,
 *    eCommerce, franchise, PPC capture for commercial SERPs.
 *
 * Credibility rules: no fabricated metrics, offices, awards, or testimonials.
 */

import type { MarketsContent } from "@/content/markets.types";

export const markets: MarketsContent = {
  hub: {
    eyebrow: "Markets",
    h1: "Regional search systems for USA, Canada, and Australia.",
    positioning:
      "One connected search growth system, tuned to how each market actually searches, trusts, and buys.",
    description:
      "Each market has different SERP competition, trust signals, local demand, language nuance, and AI search behavior. Taskcover adapts strategy, content, technical, authority, and PPC work to the market you compete in — without duplicating one generic plan everywhere.",
    primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
    secondaryCta: { label: "Book Strategy Call", href: "/book-a-call" },
    heroFigcaption:
      "Global search market command — demand, trust, and AI readiness by region.",
    selectorSection: {
      eyebrow: "Regional Intelligence Map",
      title: "Choose the market you compete in.",
      description:
        "Each market panel summarizes its search behavior, competitive pressure, and the angles where Taskcover creates the most leverage.",
    },
    comparisonSection: {
      eyebrow: "Market Comparison",
      title: "No two markets search the same way.",
      description:
        "Competition intensity, local SEO importance, bilingual need, and AI search opportunity vary sharply across the USA, Canada, and Australia. This matrix shows where each market rewards a different emphasis.",
      dimensions: [
        { key: "competition", label: "Competition intensity" },
        { key: "local", label: "Local SEO importance" },
        { key: "national", label: "National SEO opportunity" },
        { key: "multilingual", label: "Bilingual / multilingual need" },
        { key: "ppc", label: "PPC demand capture" },
        { key: "trust", label: "Trust sensitivity" },
        { key: "ai", label: "AI search opportunity" },
      ],
    },
    growthSystemsSection: {
      eyebrow: "Market Growth Systems",
      title: "A recommended growth system per market.",
      description:
        "Each market connects a different mix of services, industries, and priorities into one operating system — not the same stack copy-pasted across regions.",
      groups: [
        {
          slug: "usa-seo-agency",
          label: "USA Growth System",
          description:
            "National + local + multi-location coverage, PPC demand capture, SaaS and eCommerce authority, and AI search visibility.",
          slugs: [
            "seo-agency",
            "technical-seo",
            "ai-search-optimization",
            "ppc-management",
            "local-seo",
            "ecommerce-seo",
          ],
        },
        {
          slug: "canada-seo-agency",
          label: "Canada Growth System",
          description:
            "English/French bilingual search, international SEO, education and immigration authority, and entity clarity for AI.",
          slugs: [
            "international-seo",
            "content-marketing",
            "technical-seo",
            "ai-search-optimization",
            "local-seo",
            "seo-mentor-service",
            "seo-audit",
          ],
        },
        {
          slug: "australia-seo-agency",
          label: "Australia Growth System",
          description:
            "High-value service niches, local + national competition, eCommerce and franchise, and PPC capture for commercial SERPs.",
          slugs: [
            "seo-agency",
            "local-seo",
            "technical-seo",
            "content-marketing",
            "ppc-management",
            "ecommerce-seo",
            "seo-audit",
          ],
        },
      ],
    },
    ctaSection: {
      eyebrow: "Get a Market-Specific Audit",
      title: "See how you stack up in your market.",
      description:
        "Get a market-specific SEO growth audit: search landscape, technical snapshot, competitor visibility gap, content and authority opportunity, AI search readiness, and a 90-day roadmap.",
      auditItems: [
        "Market search landscape review",
        "Technical snapshot",
        "Competitor visibility gap",
        "Content & authority opportunity",
        "AI search readiness",
        "90-day roadmap",
      ],
    },
  },

  markets: {
    "usa-seo-agency": {
      slug: "usa-seo-agency",
      icon: "usa",
      name: "USA",
      regionLabel: "North America",
      eyebrow: "USA SEO Agency",
      h1: "SEO for the most competitive search market in the world.",
      metaTitle: "USA SEO Agency for Google, AI Search & Revenue Growth",
      metaDescription:
        "USA SEO agency services for highly competitive national and local SERPs. Technical SEO, content authority, AI search readiness, PPC capture, and multi-location growth — no fake rankings guarantees.",
      heroDescription:
        "The United States is the largest, most competitive search market Taskcover serves. National SERPs are saturated, local packs decide high-intent demand, and AI Overviews are reshaping how buyers research. We build USA SEO systems that connect national authority, local precision, and AI readiness into one growth engine.",
      marketContext:
        "USA search demand is broad, fast-moving, and intensely competitive. Buyers expect brands at the top of Google, present in AI answers, and credible through trusted third-party validation. Multi-location and franchise brands face the added complexity of scaling local presence without creating doorway pages.",
      searchLandscape: {
        title: "The USA search landscape rewards authority and depth.",
        description:
          "National SERPs are dominated by established publishers, marketplaces, and big-budget brands. Local packs decide city and service-area demand. AI Overviews increasingly summarize commercial and informational queries — favoring structured, citation-worthy content.",
        facets: [
          { label: "National SERPs", detail: "Saturated, authority-driven; category and comparison terms are heavily contested." },
          { label: "Local packs", detail: "Decide high-intent demand across cities, metros, and service areas." },
          { label: "AI Overviews", detail: "Summarize commercial and research queries; reward structured, entity-clear content." },
          { label: "Commercial PPC", detail: "Competitive ad auction; paid capture is often required where organic is slow." },
        ],
      },
      buyerBehavior: {
        title: "US buyers research hard before they convert.",
        description:
          "American buyers compare options across Google, AI tools, reviews, and marketplaces. Trust is built through authority signals, expert content, and third-party validation — not single touchpoints.",
        stages: [
          { stage: "Awareness", label: "Category search", description: "Buyers search broad category and comparison terms across Google and AI tools." },
          { stage: "Consideration", label: "Comparison", description: "Shortlists form through reviews, expert content, and third-party mentions." },
          { stage: "Validation", label: "Trust checks", description: "Credentials, case evidence, and authority signals validate the decision." },
          { stage: "Conversion", label: "Decision", description: "High-intent local or commercial queries convert via landing pages and calls." },
        ],
      },
      localSeoAngle: {
        title: "Local SEO is where US revenue often happens.",
        description:
          "City, metro, and service-area demand is decided in the local pack and on Google Business Profile. Multi-location and franchise brands need scalable, unique location architectures — not thin duplicated pages.",
      },
      nationalSeoAngle: {
        title: "National SEO is an authority contest.",
        description:
          "National category and comparison SERPs reward topical authority, structured data, and citation-worthy content. Competing means building a real content and authority system, not isolated keywords.",
      },
      aiSearchOpportunity: {
        title: "AI search is moving fastest in the US.",
        description:
          "AI Overviews and LLM answers are widely used by US buyers. Structured content, entity clarity, and third-party validation increase the odds of being cited — no one can guarantee specific citations.",
      },
      multilingualAngle: {
        title: "Spanish-language and Hispanic market opportunity.",
        description:
          "Taskcover supports Spanish content, which can help serve US Hispanic audiences. We do not overclaim Hispanic-market expertise or local presence; we build Spanish-ready content and architecture carefully.",
      },
      marketChallenges: {
        title: "Where USA SEO friction lives.",
        description:
          "The hardest parts of US search are saturation, speed of change, and the gap between traffic and revenue. These are the friction points we scan for first.",
        items: [
          { label: "National SERP saturation", detail: "Established publishers and big-budget brands dominate category terms.", severity: "high" },
          { label: "Local pack competition", detail: "High-intent demand decided by GBP, reviews, and location signals.", severity: "high" },
          { label: "Multi-location duplication", detail: "Franchise brands risk doorway pages and inconsistent location data.", severity: "medium" },
          { label: "AI Overview displacement", detail: "Summaries can reduce click-through to classic results.", severity: "medium" },
          { label: "Trust gap", detail: "Traffic without authority signals rarely converts in the US.", severity: "high" },
        ],
      },
      taskcoverApproach: {
        title: "A regional operating system for US search.",
        description:
          "We connect national authority, local precision, AI readiness, and PPC capture into one system — so organic and paid reinforce each other instead of competing.",
        layers: [
          { label: "Technical foundation", description: "Crawl, indexation, architecture, and Core Web Vitals tuned for large US catalogs and multi-location sites." },
          { label: "National authority", description: "Topical clusters, expert content, and structured data for competitive national SERPs." },
          { label: "Local precision", description: "Scalable, unique location and service-area pages that avoid doorway behavior." },
          { label: "AI readiness", description: "Entity clarity and citation-worthy content for AI Overviews and LLM answers." },
          { label: "PPC capture", description: "Demand capture for competitive commercial SERPs where organic compounds slowly." },
        ],
      },
      recommendedIndustries: [
        { slug: "saas-seo", reason: "Category and comparison SERPs are core to US SaaS demand.", fit: 5 },
        { slug: "ecommerce-seo", reason: "Large, competitive buying-intent marketplaces and catalogs.", fit: 5 },
        { slug: "healthcare-seo", reason: "High-trust, regulated local and national demand.", fit: 4 },
        { slug: "legal-immigration-seo", reason: "Case-type and jurisdiction intent with strong trust needs.", fit: 4 },
        { slug: "franchise-local-seo", reason: "Multi-location and franchise scaling across US metros.", fit: 5 },
      ],
      fitSummary: {
        title: "Why these industries fit the US market",
        rows: [
          { label: "Demand shape", value: "National category + intense local pack competition." },
          { label: "Trust bar", value: "High — expert content, reviews, and authority signals." },
          { label: "AI exposure", value: "Strong — AI Overviews widely used by US buyers." },
          { label: "Scale", value: "Large catalogs, multi-location, and franchise complexity." },
        ],
      },
      recommendedServices: [
        "seo-agency",
        "technical-seo",
        "content-marketing",
        "ai-search-optimization",
        "ppc-management",
        "local-seo",
        "ecommerce-seo",
      ],
      growthSystem: {
        title: "The USA growth stack",
        description:
          "A connected system for competing in saturated national SERPs while winning local and capturing commercial demand with PPC.",
        groups: [
          { label: "Foundation", slugs: ["seo-agency", "technical-seo", "seo-audit"] },
          { label: "Authority", slugs: ["content-marketing", "ai-search-optimization"] },
          { label: "Local & scale", slugs: ["local-seo", "ecommerce-seo"] },
          { label: "Demand capture", slugs: ["ppc-management"] },
        ],
      },
      contentAuthorityPlan: {
        title: "Content + authority for US credibility.",
        description:
          "US search rewards expert-led content clusters and third-party validation. We build topical authority and citation-worthy assets that support both Google and AI surfaces.",
        clusters: [
          "Build category and comparison pillars around buyer intent.",
          "Create expert-led, structured content AI can summarize.",
          "Connect clusters to conversion pages with strong internal linking.",
        ],
        authority: [
          "Earn relevant mentions on publications US buyers trust.",
          "Position spokespeople for expert commentary.",
          "Build citation-worthy assets AI models prefer to reference.",
        ],
      },
      ppcOpportunity: {
        title: "PPC captures demand organic can't reach fast enough.",
        description:
          "In saturated US commercial SERPs, paid search captures qualified demand while organic compounds. We align PPC with the same intent map as SEO so they reinforce each other.",
      },
      trustSignals:
        "We do not use fake testimonials or invented case metrics. We build real authority through expert content, structured data, and relevant third-party mentions.",
      outcomes: [
        { label: "Clearer national coverage", description: "Category and comparison SERPs addressed with topical authority." },
        { label: "Stronger local visibility", description: "Scalable, unique location pages without doorway risk." },
        { label: "Better qualified demand", description: "Intent-led content and PPC reach buyers earlier." },
        { label: "Stronger trust signals", description: "Expert content and relevant mentions build credibility." },
        { label: "Better AI readiness", description: "Structured, entity-clear content for AI surfaces." },
        { label: "Clearer prioritization", description: "Work ordered by revenue impact, not search volume alone." },
      ],
      faqs: [
        { q: "Is Taskcover headquartered in the USA?", a: "Taskcover serves clients in the USA. We do not claim a US headquarters or physical offices unless confirmed. Our work is built around US search behavior, demand, and trust signals." },
        { q: "Do you guarantee USA rankings?", a: "No. We focus on durable visibility, authority, and revenue outcomes we can genuinely influence and measure — not ranking guarantees." },
        { q: "Can you support Spanish-language US content?", a: "Yes. Taskcover supports Spanish content, which can help serve US Hispanic audiences. We do not overclaim Hispanic-market expertise or local presence." },
        { q: "Do you handle multi-location and franchise SEO in the US?", a: "Yes. We build scalable, unique location and service-area architectures that avoid doorway-page behavior and keep data consistent." },
        { q: "Is AI search included for the US?", a: "Yes. US buyers use AI Overviews heavily, so structured content, entity clarity, and citation-worthy authority are built in from the start." },
      ],
      finalCta: {
        title: "Get a USA SEO Growth Audit.",
        description:
          "See where you stand across national SERPs, local packs, AI Overviews, and PPC demand capture — with a prioritized 90-day roadmap.",
        auditLabel: "USA SEO Growth Audit includes",
        auditItems: [
          "Search landscape review (national + local + AI)",
          "Competitor visibility gap",
          "Technical snapshot",
          "Content & authority opportunity",
          "AI search readiness",
          "90-day roadmap",
        ],
      },
      related: ["canada-seo-agency", "australia-seo-agency"],
    },

    "canada-seo-agency": {
      slug: "canada-seo-agency",
      icon: "canada",
      name: "Canada",
      regionLabel: "North America",
      eyebrow: "Canada SEO Agency",
      h1: "Bilingual, provincial, and trust-led SEO for Canada.",
      metaTitle: "Canada SEO Agency for English/French Search & AI Readiness",
      metaDescription:
        "Canada SEO agency services for English/French bilingual search, local and national visibility, education, immigration, healthcare, and franchise. International SEO, localization, and AI search readiness — no fake guarantees.",
      heroDescription:
        "Canada is a bilingual, province-level search market. English and French demand behave differently, Quebec has its own search and trust patterns, and buyers expect clear, credible, locally relevant content. We build Canadian SEO systems that respect language, region, and trust — without overclaiming Quebec legal or compliance expertise.",
      marketContext:
        "Canadian search demand splits across English and French, with provincial nuance in Quebec and major metros. Education, immigration/legal, healthcare, and professional services are high-trust verticals where authority and clarity matter more than volume.",
      searchLandscape: {
        title: "Canada's search landscape is bilingual and regional.",
        description:
          "Google dominates, but French-language SERPs in Quebec behave differently from English SERPs in the rest of Canada. International SEO, hreflang, and localization logic decide whether the right page wins the right audience.",
        facets: [
          { label: "English SERPs", detail: "Broader national demand, similar to US patterns but less saturated." },
          { label: "French (Quebec)", detail: "Distinct language, cultural, and trust patterns; not translation-only." },
          { label: "Local packs", detail: "City and provincial demand across major metros." },
          { label: "AI surfaces", detail: "Growing; reward entity clarity and well-structured bilingual content." },
        ],
      },
      buyerBehavior: {
        title: "Canadian buyers expect local relevance and trust.",
        description:
          "Buyers research in their preferred language, expect regionally relevant content, and validate through authority signals. Immigration, education, and healthcare buyers are especially trust-sensitive.",
        stages: [
          { stage: "Awareness", label: "Language-specific search", description: "Buyers search in English or French, expecting relevant, well-written content." },
          { stage: "Consideration", label: "Provincial nuance", description: "Region, immigration status, and local providers shape shortlists." },
          { stage: "Validation", label: "Authority checks", description: "Credentials, expert content, and local trust signals validate decisions." },
          { stage: "Conversion", label: "Local intake", description: "Calls, forms, and consultations drive conversion in high-trust verticals." },
        ],
      },
      localSeoAngle: {
        title: "Local SEO spans provinces and metros.",
        description:
          "Canadian local demand is spread across major metros and provinces. GBP, citations, and consistent location data matter — especially for franchise and multi-location brands operating bilingually.",
      },
      nationalSeoAngle: {
        title: "National SEO must respect language.",
        description:
          "National English and French demand require distinct content, not duplicated translations. Proper hreflang and locale architecture prevent the wrong page ranking for the wrong audience.",
      },
      aiSearchOpportunity: {
        title: "AI rewards entity clarity in Canada.",
        description:
          "Canadian AI Overviews and LLM answers favor structured, bilingual, entity-clear content. Citation-worthy assets and consistent brand entities improve the odds of being referenced.",
      },
      multilingualAngle: {
        title: "Bilingual English/French search is core to Canada.",
        description:
          "Taskcover supports French content, which can help serve Canadian and Quebec audiences. We do not overclaim Quebec-specific legal or compliance expertise; we build localization architecture and well-written French content carefully.",
      },
      marketChallenges: {
        title: "Where Canadian SEO friction lives.",
        description:
          "The hardest parts of Canadian search are bilingual correctness, provincial nuance, and avoiding duplicate-content cannibalization between English and French.",
        items: [
          { label: "Bilingual duplication", detail: "Translated pages cannibalize each other without proper hreflang.", severity: "high" },
          { label: "Quebec nuance", detail: "French-Canadian demand is cultural, not translation-only.", severity: "medium" },
          { label: "Provincial fragmentation", detail: "Demand and competitors vary sharply by province and metro.", severity: "medium" },
          { label: "Trust gaps", detail: "Education, immigration, and healthcare buyers are highly trust-sensitive.", severity: "high" },
          { label: "Entity clarity", detail: "AI surfaces struggle with inconsistent bilingual brand entities.", severity: "medium" },
        ],
      },
      taskcoverApproach: {
        title: "A regional operating system for Canadian search.",
        description:
          "We connect international SEO, bilingual content, local precision, and AI entity clarity so English and French demand are served correctly — not duplicated.",
        layers: [
          { label: "International architecture", description: "Locale structure and hreflang so the right page wins the right audience." },
          { label: "Bilingual content", description: "Well-written English and French content, not machine translation." },
          { label: "Local precision", description: "Provincial and metro-level local SEO with consistent data." },
          { label: "Entity clarity", description: "Consistent bilingual brand entities for AI surfaces." },
          { label: "Trust building", description: "Expert content and relevant Canadian authority signals." },
        ],
      },
      recommendedIndustries: [
        { slug: "education-seo", reason: "High-trust, long-cycle demand core to Canadian search.", fit: 5 },
        { slug: "legal-immigration-seo", reason: "Case-type and jurisdiction intent with strong trust needs.", fit: 5 },
        { slug: "healthcare-seo", reason: "Local and national trust-led demand.", fit: 4 },
        { slug: "franchise-local-seo", reason: "Multi-location and bilingual franchise scaling.", fit: 4 },
        { slug: "ecommerce-seo", reason: "Growing national and cross-border buying intent.", fit: 3 },
      ],
      fitSummary: {
        title: "Why these industries fit the Canadian market",
        rows: [
          { label: "Demand shape", value: "Bilingual, provincial, and trust-led." },
          { label: "Trust bar", value: "Very high in education, immigration, and healthcare." },
          { label: "AI exposure", value: "Growing — entity clarity and bilingual structure matter." },
          { label: "Scale", value: "National + provincial + bilingual complexity." },
        ],
      },
      recommendedServices: [
        "international-seo",
        "content-marketing",
        "technical-seo",
        "ai-search-optimization",
        "local-seo",
        "seo-mentor-service",
        "seo-audit",
      ],
      growthSystem: {
        title: "The Canada growth stack",
        description:
          "A system built around bilingual correctness, international architecture, and high-trust verticals.",
        groups: [
          { label: "Foundation", slugs: ["international-seo", "technical-seo", "seo-audit"] },
          { label: "Authority", slugs: ["content-marketing", "ai-search-optimization"] },
          { label: "Local & scale", slugs: ["local-seo"] },
          { label: "Advisory", slugs: ["seo-mentor-service"] },
        ],
      },
      contentAuthorityPlan: {
        title: "Content + authority for Canadian trust.",
        description:
          "Canadian buyers reward expert-led, bilingual content and credible authority signals. We build clusters that work in both languages and support AI citation.",
        clusters: [
          "Create bilingual pillars around buyer intent, not translations.",
          "Structure content so AI surfaces can parse entities in both languages.",
          "Connect clusters to provincial and local conversion paths.",
        ],
        authority: [
          "Earn relevant mentions on Canadian publications and communities.",
          "Position bilingual spokespeople for expert commentary.",
          "Build citation-worthy assets for English and French audiences.",
        ],
      },
      ppcOpportunity: {
        title: "PPC supports demand capture across language markets.",
        description:
          "Paid search can capture qualified demand in competitive Canadian verticals while organic compounds, with campaigns structured around language and region.",
      },
      trustSignals:
        "We do not use fake testimonials or invented case metrics. We build real authority through bilingual expert content, structured data, and relevant Canadian mentions.",
      outcomes: [
        { label: "Right page, right audience", description: "English and French demand served by the correct localized page." },
        { label: "Stronger provincial visibility", description: "Local and national coverage that respects region." },
        { label: "Better qualified demand", description: "Trust-led content reaches high-intent buyers." },
        { label: "Stronger trust signals", description: "Expert content and relevant mentions build credibility." },
        { label: "Better AI readiness", description: "Consistent bilingual entities for AI surfaces." },
        { label: "Clearer prioritization", description: "Work ordered by market and language value." },
      ],
      faqs: [
        { q: "Is Taskcover headquartered in Canada?", a: "Taskcover serves clients in Canada. We do not claim a Canadian headquarters or physical offices unless confirmed. Our work is built around Canadian search behavior, bilingual demand, and trust signals." },
        { q: "Do you guarantee Canada rankings?", a: "No. We focus on durable visibility, authority, and revenue outcomes — not ranking guarantees." },
        { q: "Can you write French content for Quebec?", a: "Taskcover supports French content, which can help serve Canadian and Quebec audiences. We do not overclaim Quebec-specific legal or compliance expertise." },
        { q: "Do you handle hreflang and international SEO?", a: "Yes. Proper locale architecture and hreflang are core to Canadian work so English and French pages do not cannibalize each other." },
        { q: "Is AI search included for Canada?", a: "Yes. Entity clarity and bilingual structure are built in so AI surfaces can confidently reference your brand." },
      ],
      finalCta: {
        title: "Get a Canada SEO Growth Audit.",
        description:
          "See where you stand across English and French demand, provincial SERPs, and AI surfaces — with a prioritized 90-day roadmap.",
        auditLabel: "Canada SEO Growth Audit includes",
        auditItems: [
          "Search landscape review (English + French + AI)",
          "Competitor visibility gap",
          "Technical snapshot",
          "Content & authority opportunity",
          "AI search readiness",
          "90-day roadmap",
        ],
      },
      related: ["usa-seo-agency", "australia-seo-agency"],
    },

    "australia-seo-agency": {
      slug: "australia-seo-agency",
      icon: "australia",
      name: "Australia",
      regionLabel: "Asia-Pacific",
      eyebrow: "Australia SEO Agency",
      h1: "High-value, conversion-focused SEO for Australia.",
      metaTitle: "Australia SEO Agency for Local, National & Commercial SERPs",
      metaDescription:
        "Australia SEO agency services for high-value service niches, local and national visibility, eCommerce, franchise, and PPC demand capture. Technical SEO, content authority, and AI search readiness — no fake guarantees.",
      heroDescription:
        "Australia is a high-value search market where commercial service niches, local demand, and national competition meet. Buyers expect clear content authority and strong conversion paths, and competitive commercial SERPs often require PPC to capture demand while organic compounds.",
      marketContext:
        "Australian search demand concentrates in high-value service categories, eCommerce, and franchise/multi-location. Trust and conversion clarity matter; buyers move quickly when content is credible and the path to convert is clear.",
      searchLandscape: {
        title: "Australia's search landscape is commercial and local-led.",
        description:
          "National service SERPs are competitive and high-value, while local packs decide city and metro demand. eCommerce and franchise brands compete with marketplaces, and AI Overviews increasingly summarize service and product queries.",
        facets: [
          { label: "Commercial SERPs", detail: "High-value service terms with strong paid competition." },
          { label: "Local packs", detail: "Decide city, metro, and service-area demand." },
          { label: "eCommerce", detail: "National catalog competition with marketplaces." },
          { label: "AI surfaces", detail: "Summarize service and product queries; reward structured content." },
        ],
      },
      buyerBehavior: {
        title: "Australian buyers value clarity and credibility.",
        description:
          "Buyers research service providers, compare options, and convert when trust and conversion paths are clear. High-value niches reward expert content and strong local presence.",
        stages: [
          { stage: "Awareness", label: "Service search", description: "Buyers search high-value service and product categories." },
          { stage: "Consideration", label: "Provider comparison", description: "Shortlists form through reviews, authority, and local presence." },
          { stage: "Validation", label: "Trust checks", description: "Credentials and expert content validate the choice." },
          { stage: "Conversion", label: "Clear path", description: "Calls, forms, and bookings convert when the path is frictionless." },
        ],
      },
      localSeoAngle: {
        title: "Local SEO wins high-value Australian demand.",
        description:
          "City and metro demand in Australia is often high-value. GBP, reviews, and unique local pages decide who captures qualified local intent.",
      },
      nationalSeoAngle: {
        title: "National SEO competes on authority and clarity.",
        description:
          "National service and eCommerce SERPs reward topical authority, structured data, and clear conversion paths — not generic content.",
      },
      aiSearchOpportunity: {
        title: "AI search is growing across Australian categories.",
        description:
          "AI Overviews increasingly summarize service and product queries in Australia. Structured content and entity clarity improve citation odds — no guaranteed citations.",
      },
      marketChallenges: {
        title: "Where Australian SEO friction lives.",
        description:
          "The hardest parts of Australian search are high-value competition, the gap between traffic and conversions, and scaling local presence without duplication.",
        items: [
          { label: "Commercial SERP cost", detail: "High-value terms often require PPC capture alongside organic.", severity: "high" },
          { label: "Local pack pressure", detail: "City and metro demand is heavily contested.", severity: "high" },
          { label: "Conversion gaps", detail: "Traffic arrives but paths to convert are weak.", severity: "medium" },
          { label: "Content authority gaps", detail: "Generic content fails in high-trust service niches.", severity: "medium" },
          { label: "Multi-location duplication", detail: "Franchise brands risk thin, duplicated local pages.", severity: "medium" },
        ],
      },
      taskcoverApproach: {
        title: "A regional operating system for Australian search.",
        description:
          "We connect technical, local, content authority, AI readiness, and PPC capture so high-value demand is won and converted — not just visited.",
        layers: [
          { label: "Technical foundation", description: "Crawl, indexation, and performance for catalogs and multi-location sites." },
          { label: "Content authority", description: "Expert clusters for high-value service and product categories." },
          { label: "Local precision", description: "Scalable, unique local pages for city and metro demand." },
          { label: "AI readiness", description: "Structured content and entities for AI surfaces." },
          { label: "PPC capture", description: "Demand capture for competitive commercial SERPs." },
        ],
      },
      recommendedIndustries: [
        { slug: "ecommerce-seo", reason: "National catalog competition with marketplaces.", fit: 5 },
        { slug: "saas-seo", reason: "Category and comparison demand in APAC SaaS.", fit: 4 },
        { slug: "healthcare-seo", reason: "High-trust local and national wellness demand.", fit: 4 },
        { slug: "franchise-local-seo", reason: "Multi-location scaling across Australian metros.", fit: 5 },
        { slug: "legal-immigration-seo", reason: "High-value local service demand.", fit: 3 },
      ],
      fitSummary: {
        title: "Why these industries fit the Australian market",
        rows: [
          { label: "Demand shape", value: "High-value commercial + local-led." },
          { label: "Trust bar", value: "High in service and wellness categories." },
          { label: "AI exposure", value: "Growing across service and product queries." },
          { label: "Scale", value: "National + metro + franchise complexity." },
        ],
      },
      recommendedServices: [
        "seo-agency",
        "local-seo",
        "technical-seo",
        "content-marketing",
        "ppc-management",
        "ecommerce-seo",
        "seo-audit",
      ],
      growthSystem: {
        title: "The Australia growth stack",
        description:
          "A system for winning high-value demand, scaling local presence, and capturing commercial SERPs with PPC.",
        groups: [
          { label: "Foundation", slugs: ["seo-agency", "technical-seo", "seo-audit"] },
          { label: "Authority", slugs: ["content-marketing"] },
          { label: "Local & scale", slugs: ["local-seo", "ecommerce-seo"] },
          { label: "Demand capture", slugs: ["ppc-management"] },
        ],
      },
      contentAuthorityPlan: {
        title: "Content + authority for Australian credibility.",
        description:
          "High-value Australian niches reward expert content, clear authority signals, and structured data that supports both Google and AI surfaces.",
        clusters: [
          "Build service and product clusters around high-value intent.",
          "Structure content so AI surfaces can summarize and cite.",
          "Connect clusters to clear conversion paths.",
        ],
        authority: [
          "Earn relevant mentions on Australian publications and communities.",
          "Position spokespeople for expert commentary in APAC.",
          "Build citation-worthy assets for service and product categories.",
        ],
      },
      ppcOpportunity: {
        title: "PPC captures high-value commercial demand.",
        description:
          "Australian commercial SERPs are competitive and high-value. Paid search captures qualified demand while organic compounds, aligned with the same intent map.",
      },
      trustSignals:
        "We do not use fake testimonials or invented case metrics. We build real authority through expert content, structured data, and relevant Australian mentions.",
      outcomes: [
        { label: "Clearer market coverage", description: "National and local demand addressed coherently." },
        { label: "Stronger local visibility", description: "City and metro presence without duplication." },
        { label: "Better qualified demand", description: "Expert content reaches high-value buyers." },
        { label: "Stronger trust signals", description: "Authority and relevant mentions build credibility." },
        { label: "Better content authority", description: "Topical clusters compound over time." },
        { label: "Better AI readiness", description: "Structured content for AI surfaces." },
      ],
      faqs: [
        { q: "Is Taskcover headquartered in Australia?", a: "Taskcover serves clients in Australia. We do not claim an Australian headquarters or physical offices unless confirmed. Our work is built around Australian search behavior and trust signals." },
        { q: "Do you guarantee Australia rankings?", a: "No. We focus on durable visibility, authority, and revenue outcomes — not ranking guarantees." },
        { q: "Can you help with Australian local SEO?", a: "Yes. We build scalable, unique local pages and GBP strategies for city and metro demand across Australia." },
        { q: "Is PPC included for Australia?", a: "PPC is part of the Australian growth system because commercial SERPs are high-value and competitive. It is aligned with organic intent data." },
        { q: "Do you support eCommerce and franchise in Australia?", a: "Yes. eCommerce category architecture and franchise/multi-location local SEO are core to the Australian market." },
      ],
      finalCta: {
        title: "Get an Australia SEO Growth Audit.",
        description:
          "See where you stand across commercial SERPs, local packs, AI surfaces, and PPC demand capture — with a prioritized 90-day roadmap.",
        auditLabel: "Australia SEO Growth Audit includes",
        auditItems: [
          "Search landscape review (national + local + AI)",
          "Competitor visibility gap",
          "Technical snapshot",
          "Content & authority opportunity",
          "AI search readiness",
          "90-day roadmap",
        ],
      },
      related: ["usa-seo-agency", "canada-seo-agency"],
    },
  },

  ui: {
    breadcrumbHome: "Home",
    breadcrumbMarkets: "Markets",
    heroCtaPrimary: "Get Free SEO Audit",
    heroCtaSecondary: "Book Strategy Call",
    searchLandscapeEyebrow: "Search Landscape",
    searchLandscapeRadar: "Market intelligence map",
    buyerBehaviorEyebrow: "Buyer Behavior",
    buyerBehaviorIntentPath: "Demand journey",
    challengesEyebrow: "Market Challenges",
    challengesScanner: "Competitive friction scanner",
    challengesRiskLevel: "Risk level",
    approachEyebrow: "Taskcover Approach",
    approachOperatingModel: "Regional operating system",
    localSeoLabel: "Local SEO",
    nationalSeoLabel: "National SEO",
    aiSearchLabel: "AI Search",
    ppcLabel: "PPC",
    multilingualLabel: "Multilingual",
    industriesEyebrow: "Recommended Industries",
    industriesTitle: "Industries that fit this market",
    industriesDesc: "Where this market rewards focus, based on demand shape, trust, and scale.",
    industriesFitSummary: "Market fit summary",
    industriesFitScale: "Fit",
    servicesEyebrow: "Recommended Services",
    servicesTitle: "The search growth stack for this market",
    servicesDesc: "A connected set of services tuned to how this market searches and converts.",
    servicesGrowthStack: "Growth stack",
    contentAuthorityEyebrow: "Content & Authority",
    contentAuthorityClusters: "Content clusters",
    contentAuthorityLadder: "Authority ladder",
    outcomesEyebrow: "Outcomes",
    outcomesDesc: "Outcome categories we work toward — no fabricated metrics.",
    faqEyebrow: "FAQ",
    faqTitle: "Market buying questions",
    ctaEyebrow: "Next Step",
    ctaAuditPreview: "Audit preview",
    ctaIllustrative: "Illustrative preview — no fabricated metrics.",
    selectorViewMarket: "View",
    comparisonMarket: "Market",
    comparisonLevels: { low: "Low", medium: "Medium", high: "High", veryHigh: "Very high" },
    growthSystemsIncludes: "Includes",
    relatedEyebrow: "Related Markets",
    relatedTitle: "Explore related markets",
    exploreMarket: "Explore market",
    outcome: "Outcome",
    trustFootnote:
      "Selected team and partner experience includes global brands, campaigns, and search programs. Brand names are referenced for context only and do not imply endorsement unless explicitly stated.",
  },
};