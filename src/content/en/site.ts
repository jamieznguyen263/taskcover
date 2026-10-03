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
    recommendedFirstStep: string;
  };
};

/**
 * Shared base hrefs so localized files only translate labels, not URLs.
 * English slugs are the canonical route slugs (not localized yet).
 */
export const sharedNav: NavItem[] = [
  {
    "label": "Services",
    "href": "/services"
  },
  {
    "label": "Our Work",
    "href": "/work"
  },
  {
    "label": "How We Work",
    "href": "/how-we-work"
  },
  {
    "label": "Insights",
    "href": "/insights"
  },
  {
    "label": "About",
    "href": "/about"
  }
];

export const megaMenu: MegaMenuItem[] = [
  {
    "id": "services",
    "label": "Services",
    "description": "Choose the search-growth capability that matches the buyer problem.",
    "groups": [
      {
        "title": "Core services",
        "links": [
          {
            "label": "SEO Strategy & Consulting",
            "href": "/services/seo-agency",
            "description": "Roadmaps, diagnosis, prioritization, and search-growth planning."
          },
          {
            "label": "Technical SEO",
            "href": "/services/technical-seo",
            "description": "Crawl, indexation, rendering, speed, and site architecture."
          },
          {
            "label": "Content Strategy",
            "href": "/services/content-marketing",
            "description": "Expert-led content systems mapped to revenue intent."
          },
          {
            "label": "AI Search — GEO & AEO",
            "href": "/services/ai-search-optimization",
            "description": "Answer-surface readiness, entities, citations, and source quality."
          },
          {
            "label": "Website Design & Development",
            "href": "/services/website-development",
            "description": "Search-ready websites built for SEO, AI visibility, and lead generation."
          }
        ]
      },
      {
        "title": "Explore services",
        "links": [
          {
            "label": "All services",
            "href": "/services",
            "description": "Compare all twelve services and find the right scope."
          },
          {
            "label": "How We Work",
            "href": "/how-we-work",
            "description": "Your role, our role, and what happens next."
          },
          {
            "label": "Pricing",
            "href": "/pricing",
            "description": "Starting investment, included work, and scope limits."
          }
        ]
      }
    ],
    "cta": {
      "label": "Let’s Talk",
      "href": "/contact",
      "description": "Tell us about your website and what you want to improve."
    }
  },
  {
    "id": "work",
    "label": "Our Work",
    "description": "See the questions we investigated, the work delivered, and the evidence.",
    "groups": [
      {
        "title": "Explore our work",
        "links": [
          {
            "label": "Selected Work",
            "href": "/work",
            "description": "How Taskcover turns methodology into deliverables."
          },
          {
            "label": "Case Studies",
            "href": "/work/case-studies",
            "description": "Verified public search-growth case studies."
          },
          {
            "label": "Sample Deliverables",
            "href": "/work/sample-audits",
            "description": "Illustrative deliverables that show the method."
          }
        ]
      }
    ],
    "cta": {
      "label": "Let’s Talk",
      "href": "/contact",
      "description": "Tell us about your website and what you want to improve."
    }
  }
];

export const site: SiteContent = {
  "brand": {
    "name": "Taskcover Agency",
    "tagline": "Search Growth Agency for Google, AI Search, and Revenue.",
    "marketsLine": "Serving clients in the USA, Canada, and Australia."
  },
  "navigation": sharedNav,
  "megaMenu": megaMenu,
  "primaryCta": {
    "label": "Let’s Talk",
    "href": "/contact"
  },
  "secondaryCta": {
    "label": "Book Strategy Call",
    "href": "/book-a-call"
  },
  "footer": {
    "groups": [
      {
        "title": "Services",
        "links": [
          {
            "label": "All services",
            "href": "/services"
          },
          {
            "label": "SEO Strategy & Consulting",
            "href": "/services/seo-agency"
          },
          {
            "label": "Technical SEO",
            "href": "/services/technical-seo"
          },
          {
            "label": "AI Search — GEO & AEO",
            "href": "/services/ai-search-optimization"
          },
          {
            "label": "Content Strategy",
            "href": "/services/content-marketing"
          },
          {
            "label": "Website Design & Development",
            "href": "/services/website-development"
          },
          {
            "label": "Digital PR & Link Building",
            "href": "/services/digital-pr-link-building"
          },
          {
            "label": "PPC Management",
            "href": "/services/ppc-management"
          },
          {
            "label": "Local SEO",
            "href": "/services/local-seo"
          },
          {
            "label": "eCommerce SEO",
            "href": "/services/ecommerce-seo"
          },
          {
            "label": "International SEO",
            "href": "/services/international-seo"
          },
          {
            "label": "SEO Audit",
            "href": "/services/seo-audit"
          },
          {
            "label": "SEO Mentor Service",
            "href": "/services/seo-mentor-service"
          }
        ]
      },
      {
        "title": "Work",
        "links": [
          {
            "label": "Work",
            "href": "/work"
          },
          {
            "label": "Case Studies",
            "href": "/work/case-studies"
          },
          {
            "label": "Sample Audits",
            "href": "/work/sample-audits"
          },
          {
            "label": "Search Growth Frameworks",
            "href": "/work/search-growth-frameworks"
          },
          {
            "label": "Client Results",
            "href": "/work/client-results"
          },
          {
            "label": "Proof",
            "href": "/proof"
          },
          {
            "label": "Private Reference",
            "href": "/contact?intent=private-reference"
          }
        ]
      },
      {
        "title": "Company & Working Together",
        "links": [
          {
            "label": "About",
            "href": "/about"
          },
          {
            "label": "Methodology",
            "href": "/methodology"
          },
          {
            "label": "How We Work",
            "href": "/how-we-work"
          },
          {
            "label": "Pricing",
            "href": "/pricing"
          },
          {
            "label": "Free SEO Audit",
            "href": "/free-seo-audit"
          },
          {
            "label": "Book a Call",
            "href": "/book-a-call"
          },
          {
            "label": "Contact",
            "href": "/contact"
          }
        ]
      },
      {
        "title": "Industries & Markets",
        "links": [
          {
            "label": "All industries",
            "href": "/industries"
          },
          {
            "label": "All markets",
            "href": "/markets"
          },
          {
            "label": "Travel SEO",
            "href": "/industries/travel-seo"
          },
          {
            "label": "Education SEO",
            "href": "/industries/education-seo"
          },
          {
            "label": "Healthcare SEO",
            "href": "/industries/healthcare-seo"
          },
          {
            "label": "Legal & Immigration SEO",
            "href": "/industries/legal-immigration-seo"
          },
          {
            "label": "SaaS SEO",
            "href": "/industries/saas-seo"
          },
          {
            "label": "eCommerce SEO",
            "href": "/industries/ecommerce-seo"
          },
          {
            "label": "Franchise & Local SEO",
            "href": "/industries/franchise-local-seo"
          },
          {
            "label": "USA SEO Agency",
            "href": "/markets/usa-seo-agency"
          },
          {
            "label": "Canada SEO Agency",
            "href": "/markets/canada-seo-agency"
          },
          {
            "label": "Australia SEO Agency",
            "href": "/markets/australia-seo-agency"
          }
        ]
      },
      {
        "title": "Insights",
        "links": [
          {
            "label": "Insights",
            "href": "/insights"
          },
          {
            "label": "SEO Guides",
            "href": "/insights/seo-guides"
          },
          {
            "label": "AI Search & GEO",
            "href": "/insights/ai-search"
          },
          {
            "label": "Technical SEO",
            "href": "/insights/technical-seo"
          },
          {
            "label": "Content Authority",
            "href": "/insights/content-authority"
          },
          {
            "label": "Local & International SEO",
            "href": "/insights/local-international-seo"
          },
          {
            "label": "PPC & Search Intelligence",
            "href": "/insights/ppc-search-intelligence"
          },
          {
            "label": "SEO Mentor",
            "href": "/insights/seo-mentor"
          }
        ]
      },
      {
        "title": "Policies",
        "links": [
          {
            "label": "Privacy Policy",
            "href": "/privacy-policy"
          },
          {
            "label": "Cookie Policy",
            "href": "/cookie-policy"
          },
          {
            "label": "Cookie Preferences",
            "href": "/cookie-preferences"
          },
          {
            "label": "Terms",
            "href": "/terms"
          },
          {
            "label": "Accessibility",
            "href": "/accessibility"
          },
          {
            "label": "Data Request",
            "href": "/data-request"
          }
        ]
      }
    ],
    "footnote": "Selected team and partner experience includes global brands and partners. Brand names are referenced for context only and do not imply endorsement unless explicitly stated.",
    "rights": "All rights reserved."
  },
  "ui": {
    "bookCallLabel": "Book Strategy Call",
    "exploreService": "Explore service",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "auditPreview": "Audit preview",
    "reportFormat": "Report format",
    "auditIncludes": "Audit includes",
    "module": "Module",
    "outcome": "Outcome",
    "languageLabel": "Language",
    "home": "Home",
    "services": "Services",
    "recommendedFirstStep": "Recommended first step"
  }
};
