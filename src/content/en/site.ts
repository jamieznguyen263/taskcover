/**
 * English site UI strings (navigation, CTAs, footer, common labels).
 * This is the canonical source of truth for the SiteContent shape.
 *
 * French/Spanish files import the `SiteContent` type and must keep the same keys.
 */

export type NavItem = {
  label: string;
  href: string;
  description?: string;
  chip?: string;
};

export type MegaMenuGroup = {
  title: string;
  description?: string;
  links: NavItem[];
};

export type MegaMenuItem = {
  id: "services" | "solutions" | "work" | "insights" | "company";
  label: string;
  description: string;
  groups: MegaMenuGroup[];
  cta?: {
    label: string;
    href: string;
    description: string;
  };
};

export type SiteContent = {
  /** Brand-level strings shown in header/footer/SEO defaults. */
  brand: {
    name: string;
    tagline: string;
    /** Short footer markets line. */
    marketsLine: string;
  };
  /** Primary header nav. */
  navigation: NavItem[];
  /** Grouped desktop/mobile navigation. */
  megaMenu: MegaMenuItem[];
  /** Primary + secondary calls to action. */
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  /** Footer column groups. */
  footer: {
    groups: { title: string; links: NavItem[] }[];
    /** Footer credibility footnote. */
    footnote: string;
    /** "All rights reserved." line. */
    rights: string;
  };
  /** Common shared UI strings. */
  ui: {
    bookCallLabel: string;
    exploreService: string;
    /** Mobile menu open/close aria. */
    openMenu: string;
    closeMenu: string;
    /** Audit preview / report labels. */
    auditPreview: string;
    reportFormat: string;
    auditIncludes: string;
    /** "Module" chip on service hub cards. */
    module: string;
    outcome: string;
    /** Language switcher aria label. */
    languageLabel: string;
    /** Breadcrumb labels. */
    home: string;
    services: string;
  };
};

/**
 * Shared base hrefs so localized files only translate labels, not URLs.
 * English slugs are the canonical route slugs (not localized yet).
 */
export const sharedNav: NavItem[] = [
  { label: "Services", href: "/services" },
  { label: "Solutions", href: "/industries" },
  { label: "Work", href: "/work" },
  { label: "Insights", href: "/insights" },
  { label: "Company", href: "/about" },
];

export const megaMenu: MegaMenuItem[] = [
  {
    id: "services",
    label: "Services",
    description: "Choose the search-growth capability that matches the buyer problem.",
    groups: [
      {
        title: "Core services",
        links: [
          {
            label: "SEO Strategy & Audit",
            href: "/services/seo-agency",
            description: "Roadmaps, diagnosis, prioritization, and search-growth planning.",
            chip: "Strategy",
          },
          {
            label: "Technical SEO",
            href: "/services/technical-seo",
            description: "Crawl, indexation, rendering, speed, and site architecture.",
            chip: "Foundation",
          },
          {
            label: "AI Search / GEO",
            href: "/services/ai-search-optimization",
            description: "Answer-surface readiness, entities, citations, and source quality.",
            chip: "AI",
          },
          {
            label: "Content Authority",
            href: "/services/content-marketing",
            description: "Expert-led content systems mapped to revenue intent.",
            chip: "Authority",
          },
        ],
      },
      {
        title: "Growth channels",
        links: [
          {
            label: "Local & International SEO",
            href: "/services/international-seo",
            description: "Multi-market architecture, local visibility, and hreflang-safe scale.",
            chip: "Markets",
          },
          {
            label: "PPC Management",
            href: "/services/ppc-management",
            description: "Paid search demand capture aligned with organic intelligence.",
            chip: "Paid",
          },
          {
            label: "SEO Mentor",
            href: "/services/seo-mentor-service",
            description: "Advisory, founder coaching, and team capability building.",
            chip: "Advisory",
          },
        ],
      },
    ],
    cta: {
      label: "Start with a Free SEO Audit",
      href: "/free-seo-audit",
      description: "Not sure what you need? Get a prioritized diagnostic first.",
    },
  },
  {
    id: "solutions",
    label: "Solutions",
    description: "Explore search-growth systems by industry and market.",
    groups: [
      {
        title: "By industry",
        links: [
          { label: "Travel & Hospitality", href: "/industries/travel-seo", description: "Destination, hotel, restaurant, and booking demand." },
          { label: "Education", href: "/industries/education-seo", description: "Program, institution, trust, and enrollment search journeys." },
          { label: "Healthcare & Wellness", href: "/industries/healthcare-seo", description: "High-trust local and authority-led health search." },
          { label: "Legal & Immigration", href: "/industries/legal-immigration-seo", description: "Reputation, jurisdiction, and high-intent case demand." },
          { label: "SaaS & Technology", href: "/industries/saas-seo", description: "Category, alternative, integration, and AI visibility." },
          { label: "eCommerce", href: "/industries/ecommerce-seo", description: "Category, product, and transaction-led search architecture." },
          { label: "Franchise & Multi-location", href: "/industries/franchise-local-seo", description: "Location-scale search systems without doorway pages." },
        ],
      },
      {
        title: "By market",
        links: [
          { label: "USA", href: "/markets/usa-seo-agency", description: "National, local, review-led, PPC, and AI-search competition." },
          { label: "Canada", href: "/markets/canada-seo-agency", description: "Bilingual and provincial search behavior across EN/FR contexts." },
          { label: "Australia", href: "/markets/australia-seo-agency", description: "Metro demand, local packs, reputation, and paid search overlap." },
          { label: "International SEO / Multi-market search", href: "/services/international-seo", description: "Architecture for cross-market growth without duplicate content." },
        ],
      },
    ],
  },
  {
    id: "work",
    label: "Work",
    description: "Review verified case studies, sample deliverables, proof standards, and private reference paths.",
    groups: [
      {
        title: "Work and proof",
        links: [
          { label: "Work Hub", href: "/work", description: "How Taskcover turns methodology into deliverables." },
          { label: "Case Studies", href: "/work/case-studies", description: "Verified public search-growth case studies." },
          { label: "Sample Audits", href: "/work/sample-audits", description: "Illustrative deliverables that show the method." },
          { label: "Client Results", href: "/work/client-results", description: "Result publication standards and verified-result handling." },
          { label: "Proof System", href: "/proof", description: "Evidence rules, authority standards, and trust pathways." },
          { label: "Search Growth Frameworks", href: "/work/search-growth-frameworks", description: "Operating models and strategic frameworks." },
        ],
      },
    ],
    cta: {
      label: "Request a Private Reference",
      href: "/contact?intent=private-reference",
      description: "Qualified private references are handled case by case and permission-bound.",
    },
  },
  {
    id: "insights",
    label: "Insights",
    description: "Read practical guidance by search-growth topic.",
    groups: [
      {
        title: "Editorial categories",
        links: [
          { label: "SEO Guides", href: "/insights/seo-guides", description: "Search strategy, revenue growth, and modern SEO guides." },
          { label: "AI Search & GEO", href: "/insights/ai-search", description: "AI visibility, citations, answer surfaces, and measurement." },
          { label: "Technical SEO", href: "/insights/technical-seo", description: "Crawl, rendering, performance, and indexation systems." },
          { label: "Content Authority", href: "/insights/content-authority", description: "Information gain, topical authority, and citations." },
          { label: "Local & International SEO", href: "/insights/local-international-seo", description: "Market expansion, local search, and multilingual structure." },
          { label: "PPC & Search Intelligence", href: "/insights/ppc-search-intelligence", description: "Paid and organic signal alignment." },
          { label: "SEO Mentor", href: "/insights/seo-mentor", description: "Advisory, training, and search leadership guidance." },
        ],
      },
    ],
    cta: {
      label: "Explore the Insights Hub",
      href: "/insights",
      description: "Use articles to support the right commercial page, not replace it.",
    },
  },
  {
    id: "company",
    label: "Company",
    description: "Understand Taskcover's operating model, trust standards, and contact paths.",
    groups: [
      {
        title: "Company",
        links: [
          { label: "About", href: "/about", description: "Company identity, operating principles, and proof rules." },
          { label: "Methodology", href: "/methodology", description: "Search Growth Operating System and diagnostic approach." },
          { label: "How We Work", href: "/how-we-work", description: "Engagement flow, inputs, approvals, and collaboration rhythm." },
          { label: "Contact", href: "/contact", description: "Sales, media, partnership, and general request routing." },
          { label: "Accessibility", href: "/accessibility", description: "Accessibility approach and feedback channel." },
          { label: "Data Request", href: "/data-request", description: "Privacy and data request pathway." },
        ],
      },
    ],
  },
];

export const site: SiteContent = {
  brand: {
    name: "Taskcover Agency",
    tagline: "Search Growth Agency for Google, AI Search, and Revenue.",
    marketsLine: "Serving clients in the USA, Canada, and Australia.",
  },
  navigation: sharedNav,
  megaMenu,
  primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
  secondaryCta: { label: "Book Strategy Call", href: "/book-a-call" },
  footer: {
    groups: [
      {
        title: "Services",
        links: [
          { label: "SEO Strategy", href: "/services/seo-agency" },
          { label: "Technical SEO", href: "/services/technical-seo" },
          { label: "AI Search Optimization", href: "/services/ai-search-optimization" },
          { label: "Content Marketing", href: "/services/content-marketing" },
          { label: "Digital PR & Link Building", href: "/services/digital-pr-link-building" },
          { label: "PPC Management", href: "/services/ppc-management" },
          { label: "Local SEO", href: "/services/local-seo" },
          { label: "eCommerce SEO", href: "/services/ecommerce-seo" },
          { label: "International SEO", href: "/services/international-seo" },
          { label: "SEO Audit", href: "/services/seo-audit" },
          { label: "SEO Mentor Service", href: "/services/seo-mentor-service" },
        ],
      },
      {
        title: "Solutions",
        links: [
          { label: "Travel SEO", href: "/industries/travel-seo" },
          { label: "Education SEO", href: "/industries/education-seo" },
          { label: "Healthcare SEO", href: "/industries/healthcare-seo" },
          { label: "Legal & Immigration SEO", href: "/industries/legal-immigration-seo" },
          { label: "SaaS SEO", href: "/industries/saas-seo" },
          { label: "eCommerce SEO", href: "/industries/ecommerce-seo" },
          { label: "Franchise & Local SEO", href: "/industries/franchise-local-seo" },
          { label: "USA SEO Agency", href: "/markets/usa-seo-agency" },
          { label: "Canada SEO Agency", href: "/markets/canada-seo-agency" },
          { label: "Australia SEO Agency", href: "/markets/australia-seo-agency" },
        ],
      },
      {
        title: "Work",
        links: [
          { label: "Work", href: "/work" },
          { label: "Case Studies", href: "/work/case-studies" },
          { label: "Sample Audits", href: "/work/sample-audits" },
          { label: "Search Growth Frameworks", href: "/work/search-growth-frameworks" },
          { label: "Client Results", href: "/work/client-results" },
          { label: "Proof", href: "/proof" },
          { label: "Private Reference", href: "/contact?intent=private-reference" },
        ],
      },
      {
        title: "Insights",
        links: [
          { label: "SEO Guides", href: "/insights/seo-guides" },
          { label: "AI Search & GEO", href: "/insights/ai-search" },
          { label: "Technical SEO", href: "/insights/technical-seo" },
          { label: "Content Authority", href: "/insights/content-authority" },
          { label: "Local & International SEO", href: "/insights/local-international-seo" },
          { label: "PPC & Search Intelligence", href: "/insights/ppc-search-intelligence" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "About", href: "/about" },
          { label: "Methodology", href: "/methodology" },
          { label: "How We Work", href: "/how-we-work" },
          { label: "Free SEO Audit", href: "/free-seo-audit" },
          { label: "Book a Call", href: "/book-a-call" },
          { label: "Contact", href: "/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", href: "/privacy-policy" },
          { label: "Cookie Policy", href: "/cookie-policy" },
          { label: "Cookie Preferences", href: "/cookie-preferences" },
          { label: "Terms", href: "/terms" },
          { label: "Accessibility", href: "/accessibility" },
          { label: "Data Request", href: "/data-request" },
        ],
      },
    ],
    footnote:
      "Selected team and partner experience includes global brands and partners. Brand names are referenced for context only and do not imply endorsement unless explicitly stated.",
    rights: "All rights reserved.",
  },
  ui: {
    bookCallLabel: "Book Strategy Call",
    exploreService: "Explore service",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    auditPreview: "Audit preview",
    reportFormat: "Report format",
    auditIncludes: "Audit includes",
    module: "Module",
    outcome: "Outcome",
    languageLabel: "Language",
    home: "Home",
    services: "Services",
  },
};
