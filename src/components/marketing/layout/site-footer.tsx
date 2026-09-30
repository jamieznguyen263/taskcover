/**
 * Site footer — locale-aware.
 *
 * Derives the active locale from the route prefix and renders localized:
 *  - footer column headings + links (hrefs localized)
 *  - tagline + markets line
 *  - credibility footnote + rights line
 *  - primary/secondary CTAs
 *  - optional language switcher
 *
 * English hrefs stay unprefixed; fr/es get prefixes.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { companyAddressLine, companyDetails } from "@/lib/company";
import { getLocalizedSite } from "@/lib/content";
import { getLocalePrefix } from "@/lib/i18n";
import { Container } from "@/components/marketing/shared/container";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { useLocale } from "./use-locale";
import { LanguageSwitcher } from "./language-switcher";

export function SiteFooter() {
  const locale = useLocale();
  const content = getLocalizedSite(locale);
  const homeHref = getLocalePrefix(locale) || "/";

  return (
    <footer className="border-t border-line bg-surface-soft">
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] xl:gap-20">
          <div className="flex flex-col gap-5">
            {/* Preserve the original logo on an open, light surface. */}
            <Link
              href={homeHref}
              aria-label={`${siteConfig.name} ${content.ui.home}`}
              className="inline-flex w-fit items-center"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteConfig.logo.horizontal}
                alt={`${siteConfig.name} logo`}
                width={700}
                height={303}
                loading="lazy"
                decoding="async"
                className="h-9 w-auto max-w-[220px] object-contain sm:h-10"
                style={{ imageRendering: "auto" }}
              />
            </Link>
            <p className="max-w-sm text-sm text-secondary">
              {content.brand.tagline}
            </p>
            <p className="max-w-sm text-sm text-muted">
              {content.brand.marketsLine}
            </p>
            <address className="not-italic text-sm leading-relaxed text-secondary">
              <span className="block font-semibold text-graphite">{companyDetails.formalName}</span>
              <span className="block">{companyAddressLine()}</span>
              <a className="block hover:text-brand-link" href={`tel:${companyDetails.phone.replace(/[^\d+]/g, "")}`}>
                {companyDetails.phone}
              </a>
              <a className="block hover:text-brand-link" href={`mailto:${companyDetails.email}`}>
                {companyDetails.email}
              </a>
            </address>
            <div className="mt-1 flex flex-wrap gap-3">
              <CTAButton size="md" href={content.primaryCta.href}>
                {content.primaryCta.label}
              </CTAButton>
              <CTAButton variant="secondary" size="md" href={content.secondaryCta.href}>
                {content.secondaryCta.label}
              </CTAButton>
            </div>
            <div className="mt-2">
              <React.Suspense fallback={<div className="h-10 w-20 rounded-full border border-line" />}>
                <LanguageSwitcher />
              </React.Suspense>
            </div>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-x-8 gap-y-10 min-[400px]:grid-cols-2 xl:grid-cols-3">
            {content.footer.groups.map((group) => (
              <nav key={group.title} aria-label={group.title}>
                <p className="text-sm font-semibold text-graphite">
                  {group.title}
                </p>
                <ul className="mt-4 flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="inline-flex min-h-9 items-center py-1 text-sm leading-relaxed text-secondary transition-colors hover:text-brand-link"
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
            &copy; {new Date().getFullYear()} {siteConfig.legalName}. {content.footer.rights}
          </p>
          <p className="max-w-2xl">
            {content.footer.footnote}
          </p>
        </div>
      </Container>
    </footer>
  );
}
