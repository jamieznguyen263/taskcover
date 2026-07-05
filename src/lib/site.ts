/**
 * Central site configuration.
 * Used for metadata, schema, navigation, and footer.
 *
 * Replace placeholder fields (email, phone, addresses) with real values
 * when they are confirmed. Do NOT invent fake contact details.
 */
export const siteConfig = {
  name: "Taskcover Agency",
  legalName: "Taskcover Agency",
  tagline: "Search Growth Agency for Google, AI Search, and Revenue.",
  shortDescription:
    "Search growth agency helping brands in the USA, Canada, and Australia grow organic visibility, build authority, and convert high-intent search demand into measurable business outcomes.",
  description:
    "Taskcover Agency helps ambitious brands grow organic visibility, build authority, improve AI search readiness, and convert high-intent search demand into measurable business outcomes through SEO Strategy, Technical SEO, AI Search Optimization, Content Marketing, Digital PR / Authority Building, Local SEO, eCommerce SEO, International SEO, and Analytics & Reporting.",
  url: "https://taskcover.com", // TODO: confirm canonical production domain
  locale: "en_US",
  markets: ["United States", "Canada", "Australia"],
  marketSlugs: ["usa", "canada", "australia"],
  contact: {
    // TODO: replace with verified contact details before launch
    email: "business@taskcover.com",
    phone: "", // do not invent
    formPath: "/book-a-call",
    auditPath: "/free-seo-audit",
  },
  social: {
    // TODO: replace with real profile URLs; leave empty until verified
    linkedin: "",
    x: "",
    youtube: "",
    instagram: "",
  },
  ogImage: "/brand/og-default.svg",
  logo: {
    // Official white-background variants from brand-source/Taskcover Logo.zip
    horizontal: "/brand/taskcover-horizontal.png",
    icon: "/brand/taskcover-icon.png",
  },
  navigation: [
    { label: "Services", href: "/services" },
    { label: "Industries", href: "/industries" },
    { label: "Markets", href: "/markets" },
    { label: "Work", href: "/work" },
    { label: "Proof", href: "/proof" },
    { label: "Insights", href: "/insights" },
    { label: "About", href: "/about" },
  ],
  primaryCta: { label: "Get Free SEO Audit", href: "/free-seo-audit" },
  secondaryCta: { label: "Book Strategy Call", href: "/book-a-call" },
} as const;

export type SiteConfig = typeof siteConfig;
