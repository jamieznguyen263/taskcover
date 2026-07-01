import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { Container } from "@/components/marketing/shared/container";
import { CTAButton } from "@/components/marketing/shared/cta-button";

const footerGroups: { title: string; links: { label: string; href: string }[] }[] = [
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
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-soft">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex flex-col gap-5">
            {/* Logo card — light pill surface for clear brand presence */}
            <div className="inline-flex w-fit items-center rounded-2xl border border-line bg-white px-5 py-3 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteConfig.logo.horizontal}
                alt={`${siteConfig.name} logo`}
                className="h-9 w-auto max-w-[220px] object-contain sm:h-10"
                style={{ imageRendering: "auto" }}
              />
            </div>
            <p className="max-w-sm text-sm text-secondary">
              {siteConfig.tagline}
            </p>
            <p className="max-w-sm text-sm text-muted">
              Serving clients in the USA, Canada, and Australia.
            </p>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <CTAButton size="md" href={siteConfig.primaryCta.href}>
                {siteConfig.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton variant="secondary" size="md" href={siteConfig.secondaryCta.href}>
                {siteConfig.secondaryCta.label}
              </CTAButton>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {footerGroups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  {group.title}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-secondary transition-colors hover:text-brand-teal"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-line-soft pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <p className="max-w-2xl">
            Selected team and partner experience includes global brands and
            partners. Brand names are referenced for context only and do not
            imply endorsement unless explicitly stated.
          </p>
        </div>
      </Container>
    </footer>
  );
}