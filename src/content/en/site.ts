/**
 * English site UI strings (navigation, CTAs, footer, common labels).
 * This is the canonical source of truth for the SiteContent shape.
 *
 * French/Spanish files import the `SiteContent` type and must keep the same keys.
 */

export type NavItem = { label: string; href: string };

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
  { label: "Industries", href: "/industries" },
  { label: "Markets", href: "/markets" },
  { label: "Work", href: "/work" },
  { label: "Proof", href: "/proof" },
  { label: "Insights", href: "/insights" },
  { label: "About", href: "/about" },
];

export const site: SiteContent = {
  brand: {
    name: "Taskcover Agency",
    tagline: "Search Growth Agency for Google, AI Search, and Revenue.",
    marketsLine: "Serving clients in the USA, Canada, and Australia.",
  },
  navigation: sharedNav,
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
        title: "Industries",
        links: [
          { label: "Travel SEO", href: "/industries/travel-seo" },
          { label: "Education SEO", href: "/industries/education-seo" },
          { label: "Healthcare SEO", href: "/industries/healthcare-seo" },
          { label: "Legal & Immigration SEO", href: "/industries/legal-immigration-seo" },
          { label: "SaaS SEO", href: "/industries/saas-seo" },
          { label: "eCommerce SEO", href: "/industries/ecommerce-seo" },
          { label: "Franchise & Local SEO", href: "/industries/franchise-local-seo" },
        ],
      },
      {
        title: "Markets",
        links: [
          { label: "USA SEO Agency", href: "/markets/usa-seo-agency" },
          { label: "Canada SEO Agency", href: "/markets/canada-seo-agency" },
          { label: "Australia SEO Agency", href: "/markets/australia-seo-agency" },
        ],
      },
      {
        title: "Proof",
        links: [
          { label: "Brand Experience", href: "/proof/brand-experience" },
          { label: "Case Studies", href: "/work/case-studies" },
          { label: "Client Results", href: "/work/client-results" },
          { label: "Video Testimonials", href: "/work/video-testimonials" },
          { label: "Press & Media", href: "/proof/press" },
          { label: "Client Reviews", href: "/proof/client-reviews" },
        ],
      },
      {
        title: "Company",
        links: [
          { label: "Methodology", href: "/methodology" },
          { label: "Technology", href: "/technology" },
          { label: "Insights", href: "/insights" },
          { label: "Free SEO Audit", href: "/free-seo-audit" },
          { label: "Book a Call", href: "/book-a-call" },
          { label: "Contact", href: "/contact" },
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