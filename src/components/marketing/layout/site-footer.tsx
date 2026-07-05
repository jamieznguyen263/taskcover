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
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";
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
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          <div className="flex flex-col gap-5">
            {/* Logo card — light pill surface for clear brand presence */}
            <Link
              href={homeHref}
              aria-label={`${siteConfig.name} home`}
              className="inline-flex w-fit items-center rounded-2xl border border-line bg-white px-5 py-3 shadow-sm"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={siteConfig.logo.horizontal}
                alt={`${siteConfig.name} logo`}
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
            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <CTAButton size="md" href={content.primaryCta.href}>
                {content.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
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

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {content.footer.groups.map((group) => (
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
            © {new Date().getFullYear()} {siteConfig.legalName}. {content.footer.rights}
          </p>
          <p className="max-w-2xl">
            {content.footer.footnote}
          </p>
        </div>
      </Container>
    </footer>
  );
}
