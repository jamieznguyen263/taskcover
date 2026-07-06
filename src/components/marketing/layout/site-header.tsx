/**
 * Sticky site header - locale-aware.
 *
 * The active locale is derived from the route prefix (source of truth) via
 * useLocale(). Nav labels, CTA labels, and hrefs are localized accordingly.
 * English stays unprefixed; fr/es get prefixes.
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react";
import type { MegaMenuItem } from "@/content/en/site";
import { siteConfig } from "@/lib/site";
import { getLocalizedSite } from "@/lib/content";
import { getLocalePrefix } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { Container } from "@/components/marketing/shared/container";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { useLocale } from "./use-locale";
import { LanguageSwitcher, LanguageSwitcherList } from "./language-switcher";

function chipToneClass(link: MegaMenuItem["groups"][number]["links"][number]) {
  const key = `${link.href} ${link.chip ?? ""}`.toLowerCase();
  if (key.includes("technical-seo") || key.includes("foundation") || key.includes("fondation") || key.includes("base")) {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }
  if (key.includes("ai-search") || key.includes(" ai") || key.includes(" ia") || key.includes("geo")) {
    return "border-violet-200 bg-violet-50 text-violet-700";
  }
  if (key.includes("content-marketing") || key.includes("authority") || key.includes("autorite") || key.includes("autoridad")) {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }
  if (key.includes("international-seo") || key.includes("local") || key.includes("markets") || key.includes("marches") || key.includes("mercados")) {
    return "border-cyan-200 bg-cyan-50 text-cyan-700";
  }
  if (key.includes("ppc") || key.includes("paid")) {
    return "border-blue-200 bg-blue-50 text-blue-700";
  }
  if (key.includes("mentor") || key.includes("advisory") || key.includes("conseil") || key.includes("asesoria")) {
    return "border-teal-200 bg-teal-50 text-teal-700";
  }
  return "border-indigo-200 bg-indigo-50 text-indigo-700";
}

function MenuLink({
  link,
  onClick,
}: {
  link: MegaMenuItem["groups"][number]["links"][number];
  onClick?: () => void;
}) {
  return (
    <Link
      href={link.href}
      onClick={onClick}
      className="group relative block overflow-hidden rounded-xl border border-transparent px-3 py-3 transition hover:border-brand-teal/20 hover:bg-brand-teal/[0.045] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
    >
      <span
        aria-hidden="true"
        className="absolute left-0 top-3 h-7 w-1 rounded-r-full bg-brand-gradient opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span className="flex items-center justify-between gap-3">
        <span className="pl-1 text-sm font-semibold text-graphite transition group-hover:text-brand-teal">
          {link.label}
        </span>
        {link.chip && (
          <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase", chipToneClass(link))}>
            {link.chip}
          </span>
        )}
      </span>
      {link.description && (
        <span className="mt-1 block pl-1 text-xs leading-relaxed text-secondary">
          {link.description}
        </span>
      )}
    </Link>
  );
}

export function SiteHeader() {
  const locale = useLocale();
  const pathname = usePathname();
  const content = getLocalizedSite(locale);
  const homeHref = getLocalePrefix(locale) || "/";
  const [openMenuState, setOpenMenuState] = React.useState<{
    pathname: string | null;
    id: MegaMenuItem["id"] | null;
  }>({ pathname: null, id: null });
  const [mobileMenuState, setMobileMenuState] = React.useState<{
    pathname: string | null;
    open: boolean;
  }>({ pathname: null, open: false });
  const [expandedIds, setExpandedIds] = React.useState<Set<MegaMenuItem["id"]>>(
    () => new Set(["services"])
  );
  const headerRef = React.useRef<HTMLElement>(null);
  const mobileTriggerRef = React.useRef<HTMLButtonElement>(null);
  const firstMobileGroupRef = React.useRef<HTMLButtonElement>(null);
  const pointerFocusRef = React.useRef(false);

  const openMenuId = openMenuState.pathname === pathname ? openMenuState.id : null;
  const mobileOpen = mobileMenuState.pathname === pathname ? mobileMenuState.open : false;
  const openMenu = content.megaMenu.find((item) => item.id === openMenuId) ?? null;
  const directNavItems = content.navigation.filter(
    (item) => !content.megaMenu.some((menu) => menu.label === item.label)
  );

  React.useEffect(() => {
    if (!mobileOpen) return;
    firstMobileGroupRef.current?.focus();
  }, [mobileOpen, pathname]);

  React.useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (headerRef.current?.contains(event.target as Node)) return;
      setOpenMenuState({ pathname, id: null });
      setMobileMenuState({ pathname, open: false });
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpenMenuState({ pathname, id: null });
      setMobileMenuState({ pathname, open: false });
      mobileTriggerRef.current?.focus();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [pathname]);

  function toggleMobileGroup(id: MegaMenuItem["id"]) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function closeMobileMenu() {
    setMobileMenuState({ pathname, open: false });
    setOpenMenuState({ pathname, id: null });
  }

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 border-b border-line bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75"
    >
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem] lg:px-6 xl:h-[4.5rem] xl:px-8">
        <Link
          href={homeHref}
          className="inline-flex shrink-0 items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-teal"
          aria-label={`${siteConfig.name} ${content.ui.home}`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={siteConfig.logo.horizontal}
            alt={`${siteConfig.name} logo`}
            width={2721}
            height={1176}
            decoding="async"
            className="h-auto w-[clamp(6.25rem,32vw,9rem)] object-contain sm:w-[10rem] lg:w-[10.5rem] xl:w-[11rem]"
            style={{ imageRendering: "auto" }}
          />
        </Link>

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {content.megaMenu.map((item) => {
              const expanded = openMenuId === item.id;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`mega-menu-${item.id}`}
                    onClick={() => setOpenMenuState({ pathname, id: expanded ? null : item.id })}
                    onPointerDown={() => {
                      pointerFocusRef.current = true;
                    }}
                    onFocus={() => {
                      if (pointerFocusRef.current) {
                        pointerFocusRef.current = false;
                        return;
                      }
                      setOpenMenuState({ pathname, id: item.id });
                    }}
                    onMouseEnter={() => setOpenMenuState({ pathname, id: item.id })}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal xl:px-3",
                      expanded
                        ? "bg-surface-tint text-graphite"
                        : "text-secondary hover:bg-surface-tint hover:text-graphite"
                    )}
                  >
                    {item.label}
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
                      aria-hidden="true"
                    />
                  </button>
                </li>
              );
            })}
            {directNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal xl:px-3",
                    pathname === item.href
                      ? "bg-surface-tint text-graphite"
                      : "text-secondary hover:bg-surface-tint hover:text-graphite"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-2 xl:flex xl:gap-3">
          <React.Suspense fallback={<div className="h-10 w-20 rounded-full border border-line" />}>
            <LanguageSwitcher />
          </React.Suspense>
          <CTAButton size="md" href={content.primaryCta.href}>
            {content.primaryCta.label}
          </CTAButton>
        </div>

        <div className="flex items-center gap-2 xl:hidden">
          <React.Suspense fallback={<div className="h-10 w-20 rounded-full border border-line" />}>
            <LanguageSwitcher />
          </React.Suspense>
          <button
            ref={mobileTriggerRef}
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-graphite focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal xl:hidden"
            aria-label={mobileOpen ? content.ui.closeMenu : content.ui.openMenu}
            aria-expanded={mobileOpen}
            aria-controls="mobile-primary-menu"
            onClick={() =>
              setMobileMenuState((current) => ({
                pathname,
                open: !(current.pathname === pathname ? current.open : false),
              }))
            }
          >
            {mobileOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </Container>

      {openMenu && (
        <div
          id={`mega-menu-${openMenu.id}`}
          className="hidden border-t border-line bg-white shadow-[0_24px_60px_rgba(20,31,36,0.12)] xl:block"
          onMouseEnter={() => setOpenMenuState({ pathname, id: openMenu.id })}
          onMouseLeave={() => setOpenMenuState({ pathname, id: null })}
        >
          <Container className="py-6">
            <div className="grid gap-8 lg:grid-cols-[0.85fr_2.15fr]">
              <div className="flex flex-col justify-between gap-5 border-r border-line-soft pr-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                    {openMenu.label}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">
                    {openMenu.description}
                  </p>
                </div>
                {openMenu.cta && (
                  <Link
                    href={openMenu.cta.href}
                    onClick={() => setOpenMenuState({ pathname, id: null })}
                    className="group relative overflow-hidden rounded-2xl bg-brand-gradient p-px shadow-[0_20px_55px_-28px_rgba(24,138,172,0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_28px_65px_-30px_rgba(16,230,106,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
                  >
                    <span className="block rounded-[calc(1rem-1px)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(239,253,248,0.96))] p-4">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-teal">
                        {content.ui.recommendedFirstStep}
                      </span>
                      <span className="mt-2 flex items-center justify-between gap-3 text-sm font-semibold text-graphite">
                        {openMenu.cta.label}
                        <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-[0_10px_24px_-12px_rgba(24,138,172,0.9)]">
                          <ArrowRight
                            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                      <span className="mt-2 block text-xs leading-relaxed text-secondary">
                        {openMenu.cta.description}
                      </span>
                    </span>
                  </Link>
                )}
              </div>

              <div
                className={cn(
                  "grid gap-5",
                  openMenu.groups.length > 1 ? "md:grid-cols-2" : "md:grid-cols-1"
                )}
              >
                {openMenu.groups.map((group, groupIndex) => {
                  const headingId = `mega-${openMenu.id}-group-${groupIndex}`;
                  return (
                    <section key={group.title} aria-labelledby={headingId}>
                      <h2
                        id={headingId}
                        className="text-xs font-semibold uppercase tracking-wide text-muted"
                      >
                        {group.title}
                      </h2>
                      {group.description && (
                        <p className="mt-1 text-xs text-secondary">{group.description}</p>
                      )}
                      <div className="mt-3 grid gap-1">
                        {group.links.map((link) => (
                          <MenuLink
                            key={link.href}
                            link={link}
                            onClick={() => setOpenMenuState({ pathname, id: null })}
                          />
                        ))}
                      </div>
                    </section>
                  );
                })}
              </div>
            </div>
          </Container>
        </div>
      )}

      <div
        id="mobile-primary-menu"
        className={cn(
          "xl:hidden",
          mobileOpen
            ? "block max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-white shadow-lg"
            : "hidden"
        )}
      >
        <Container className="pb-6 pt-3">
          <div className="divide-y divide-line-soft rounded-xl border border-line bg-white">
            {content.megaMenu.map((item, index) => {
              const expanded = expandedIds.has(item.id);
              return (
                <section key={item.id}>
                  <button
                    ref={index === 0 ? firstMobileGroupRef : undefined}
                    type="button"
                    aria-expanded={expanded}
                    aria-controls={`mobile-menu-${item.id}`}
                    onClick={() => toggleMobileGroup(item.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-teal"
                  >
                    <span>
                      <span className="block text-sm font-semibold text-graphite">
                        {item.label}
                      </span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-secondary">
                        {item.description}
                      </span>
                    </span>
                    <ChevronDown
                      className={cn("h-4 w-4 shrink-0 text-muted transition-transform", expanded && "rotate-180")}
                      aria-hidden="true"
                    />
                  </button>

                  {expanded && (
                    <div id={`mobile-menu-${item.id}`} className="px-3 pb-4">
                      <div className="grid gap-4">
                        {item.groups.map((group) => (
                          <div key={group.title}>
                            <p className="px-1 text-[10px] font-semibold uppercase tracking-wide text-muted">
                              {group.title}
                            </p>
                            <div className="mt-1 grid gap-1">
                              {group.links.map((link) => (
                                <MenuLink
                                  key={link.href}
                                  link={link}
                                  onClick={closeMobileMenu}
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                        {item.cta && (
                          <Link
                            href={item.cta.href}
                            onClick={closeMobileMenu}
                            className="group rounded-2xl bg-brand-gradient p-px text-sm font-semibold text-graphite shadow-[0_18px_44px_-28px_rgba(24,138,172,0.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
                          >
                            <span className="block rounded-[calc(1rem-1px)] bg-[linear-gradient(135deg,rgba(255,255,255,0.98),rgba(239,253,248,0.96))] px-3 py-3">
                              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-teal">
                                {content.ui.recommendedFirstStep}
                              </span>
                              <span className="mt-1 flex items-center justify-between gap-3">
                                {item.cta.label}
                                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white">
                                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                                </span>
                              </span>
                              <span className="mt-1 block text-xs font-normal leading-relaxed text-secondary">
                                {item.cta.description}
                              </span>
                            </span>
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </section>
              );
            })}
            {directNavItems.length ? (
              <div className="px-3 py-3">
                <div className="grid gap-1">
                  {directNavItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="block rounded-xl px-3 py-3 text-sm font-semibold text-graphite transition hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-brand-teal"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="mt-4">
            <CTAButton size="lg" href={content.primaryCta.href} className="w-full">
              {content.primaryCta.label}
            </CTAButton>
          </div>
          <div className="mt-4 border-t border-line-soft pt-4">
            <React.Suspense fallback={null}>
              <LanguageSwitcherList />
            </React.Suspense>
          </div>
        </Container>
      </div>
    </header>
  );
}
