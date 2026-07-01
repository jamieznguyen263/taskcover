/**
 * Sticky site header — locale-aware.
 *
 * The active locale is derived from the route prefix (source of truth) via
 * useLocale(). Nav labels, CTA labels, and hrefs are localized accordingly.
 * English stays unprefixed; fr/es get prefixes.
 *
 * Includes:
 *  - Logo (links to localized home)
 *  - Primary nav (localized labels + hrefs)
 *  - Desktop language switcher
 *  - Mobile menu with localized nav + language switcher list
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { getLocalizedSite } from "@/lib/content";
import { getLocalePrefix } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Container } from "@/components/marketing/shared/container";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { useLocale } from "./use-locale";
import { LanguageSwitcher, LanguageSwitcherList } from "./language-switcher";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  const locale = useLocale();
  const content = getLocalizedSite(locale);
  const homeHref = getLocalePrefix(locale) || "/";

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/70">
      <Container className="flex h-16 items-center justify-between gap-4">
        <Link
          href={homeHref}
          className="inline-flex shrink-0 items-center gap-2"
          aria-label={`${siteConfig.name} home`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={siteConfig.logo.horizontal}
            alt={`${siteConfig.name} logo`}
            className="h-9 w-auto max-w-[200px] object-contain sm:h-11 sm:max-w-[240px]"
            style={{ imageRendering: "auto" }}
          />
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {content.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-full px-3 py-2 text-sm font-medium text-secondary transition-colors hover:bg-surface-tint hover:text-graphite"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <LanguageSwitcher />
          <CTAButton size="md" href={content.primaryCta.href}>
            {content.primaryCta.label}
          </CTAButton>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-graphite lg:hidden"
            aria-label={open ? content.ui.closeMenu : content.ui.openMenu}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {/* Mobile menu */}
      <div className={cn("lg:hidden", open ? "block" : "hidden")}>
        <Container className="pb-6 pt-2">
          <ul className="flex flex-col gap-1">
            {content.navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-xl px-4 py-3 text-base font-medium text-graphite hover:bg-surface-tint"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <CTAButton
              size="lg"
              href={content.primaryCta.href}
              className="w-full"
            >
              {content.primaryCta.label}
            </CTAButton>
          </div>
          <div className="mt-4 border-t border-line-soft pt-4">
            <LanguageSwitcherList />
          </div>
        </Container>
      </div>
    </header>
  );
}