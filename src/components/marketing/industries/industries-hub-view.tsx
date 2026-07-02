/**
 * Shared industries hub view — renders from localized IndustriesContent.
 *
 * Used by:
 *  - app/industries/page.tsx            (English, unprefixed)
 *  - app/[locale]/industries/page.tsx    (fr / es)
 *
 * Distinct sections (no two share the same layout):
 *  1. Hero — split with floating sector signal dashboard
 *  2. Sector map — interactive vertical rail + detail preview panel
 *  3. Comparison matrix — table-style search behavior grid
 *  4. Service bundles — horizontal grouped rails (not a card grid)
 *  5. CTA — premium conversion panel
 */

"use client";

import * as React from "react";
import { motion, useReducedMotion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Compass, Check, Sparkles } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader, Eyebrow } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { SectorSignalDashboard } from "@/components/marketing/industries/industry-visuals";
import type { Locale } from "@/lib/i18n";
import { localizePath } from "@/lib/i18n";
import {
  getIndustriesContent,
  getIndustries,
  getServiceBySlug,
  isPriorityIndustry,
} from "@/lib/content";

/** Comparison matrix values per industry (visual-only bars, not metrics). */
const comparisonData: Record<
  string,
  { intent: string; trust: number; content: number; demand: string; authority: number; cycle: string }
> = {
  "travel-seo": { intent: "Destination / comparison", trust: 3, content: 4, demand: "International", authority: 3, cycle: "Medium" },
  "education-seo": { intent: "Program / outcome", trust: 5, content: 4, demand: "National + intl", authority: 4, cycle: "Long" },
  "healthcare-seo": { intent: "Condition / local", trust: 5, content: 4, demand: "Local", authority: 4, cycle: "Medium" },
  "legal-immigration-seo": { intent: "Case-type / local", trust: 5, content: 3, demand: "Local", authority: 4, cycle: "Medium" },
  "saas-seo": { intent: "Category / comparison", trust: 3, content: 5, demand: "National / global", authority: 3, cycle: "Short" },
  "ecommerce-seo": { intent: "Category / transaction", trust: 3, content: 4, demand: "National / global", authority: 3, cycle: "Short" },
  "franchise-local-seo": { intent: "Near-me / location", trust: 4, content: 3, demand: "Local", authority: 3, cycle: "Short" },
};

function LevelBars({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-hidden="true">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-2 w-1 rounded-full",
            i < level ? "bg-brand-gradient" : "bg-line"
          )}
        />
      ))}
    </span>
  );
}

// Inline cn to avoid extra import cycles in this client component.
function cn(...classes: (string | false | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function IndustriesHubView({ locale }: { locale: Locale }) {
  const content = getIndustriesContent(locale);
  const industries = getIndustries(locale);
  const loc = (p: string) => localizePath(p, locale);
  const reduceMotion = useReducedMotion();
  const [activeSector, setActiveSector] = React.useState(0);
  const current = industries[activeSector];

  const homeCrumb = locale === "en" ? "/" : `/${locale}`;

  return (
    <>
      {/* 1. Hero — split with floating sector signal dashboard */}
      <Section background="tint" className="relative overflow-hidden pt-16 sm:pt-20 lg:pt-24">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-line-grid opacity-70" />
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
        <Container className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col gap-6">
            <nav aria-label="Breadcrumb" className="text-xs text-muted">
              <ol className="flex flex-wrap items-center gap-1.5">
                <li className="inline-flex items-center gap-1.5">
                  <Link href={homeCrumb} className="text-muted transition-colors hover:text-brand-teal">
                    {content.ui.breadcrumbHome}
                  </Link>
                  <span aria-hidden="true">/</span>
                </li>
                <li>
                  <span aria-current="page" className="text-secondary">
                    {content.ui.breadcrumbIndustries}
                  </span>
                </li>
              </ol>
            </nav>
            <Eyebrow>{content.hub.eyebrow}</Eyebrow>
            <h1 className="max-w-2xl text-balance text-4xl font-semibold leading-[1.08] tracking-tight text-graphite sm:text-5xl lg:text-6xl">
              {content.hub.h1}
            </h1>
            <p className="max-w-xl text-base font-medium text-graphite sm:text-lg">
              {content.hub.positioning}
            </p>
            <p className="max-w-xl text-pretty text-secondary sm:text-lg">
              {content.hub.description}
            </p>
            <div className="mt-1 flex flex-col gap-3 sm:flex-row">
              <CTAButton size="lg" href={loc(content.hub.primaryCta.href)}>
                {content.hub.primaryCta.label}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href={loc("/book-a-call")}>
                {content.hub.secondaryCta.label}
              </CTAButton>
            </div>
          </div>
          {/* Floating sector signal dashboard */}
          <div className="relative">
            <div className="absolute inset-0 -m-6 rounded-[2rem] bg-brand-gradient-soft opacity-60 blur-2xl" aria-hidden="true" />
            <figure className="relative depth-layered overflow-hidden rounded-3xl border border-line bg-white p-4 ring-brand-glow">
              <SectorSignalDashboard className="h-auto w-full" />
              <figcaption className="mt-1 text-center text-[11px] text-muted">
                {content.hub.selectorSection.description}
              </figcaption>
            </figure>
          </div>
        </Container>
      </Section>

      {/* 2. Sector map — interactive vertical rail + detail preview panel */}
      <Section background="default" aria-labelledby="sector-map-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.hub.selectorSection.eyebrow}
            titleId="sector-map-title"
            title={content.hub.selectorSection.title}
            description={content.hub.selectorSection.description}
          />
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            {/* Sector rail */}
            <div role="tablist" aria-label={content.hub.eyebrow} className="flex flex-col gap-1">
              {industries.map((ind, i) => {
                const isActive = activeSector === i;
                const priority = isPriorityIndustry(ind.slug);
                return (
                  <button
                    key={ind.slug}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActiveSector(i)}
                    onMouseEnter={() => setActiveSector(i)}
                    onFocus={() => setActiveSector(i)}
                    className={cn(
                      "group flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200",
                      isActive
                        ? "border-brand-teal/40 bg-white shadow-[0_8px_24px_-16px_rgba(24,138,172,0.4)]"
                        : "border-transparent bg-transparent hover:bg-white/60"
                    )}
                  >
                    <span className="flex flex-col gap-0.5">
                      <span className={cn("text-sm font-semibold transition-colors", isActive ? "text-graphite" : "text-secondary")}>
                        {ind.name}
                      </span>
                      {priority && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                          <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
                          {content.hub.selectorSection.priorityBadge}
                        </span>
                      )}
                    </span>
                    <span
                      className={cn(
                        "h-6 w-1 rounded-full transition-all duration-300",
                        isActive ? "bg-brand-gradient" : "bg-transparent"
                      )}
                      aria-hidden="true"
                    />
                  </button>
                );
              })}
            </div>

            {/* Detail panel */}
            <div className="relative min-h-[360px] overflow-hidden rounded-2xl border border-line bg-surface-tint p-6 sm:p-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSector}
                  initial={{ opacity: 0, x: reduceMotion ? 0 : 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: reduceMotion ? 0 : -12 }}
                  transition={{ duration: 0.25 }}
                  className="flex h-full flex-col gap-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
                        {current.eyebrow}
                      </p>
                      <h3 className="mt-1 text-xl font-semibold text-graphite">
                        {current.name}
                      </h3>
                    </div>
                    {isPriorityIndustry(current.slug) && (
                      <span className="inline-flex items-center gap-1 rounded-full border border-brand-teal/20 bg-brand-teal/[0.04] px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                        <Sparkles className="h-3 w-3" aria-hidden="true" />
                        {content.hub.selectorSection.priorityBadge}
                      </span>
                    )}
                  </div>

                  {/* Market context + search behavior */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-line-soft bg-white p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {content.ui.searchBehaviorEyebrow}
                      </p>
                      <p className="mt-1.5 text-sm text-secondary">
                        {current.buyerSearchBehavior}
                      </p>
                    </div>
                    <div className="rounded-xl border border-line-soft bg-white p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {content.ui.outcome}
                      </p>
                      <p className="mt-1.5 text-sm text-secondary">
                        {current.trustSignals}
                      </p>
                    </div>
                  </div>

                  {/* Pain points preview */}
                  <div className="rounded-xl border border-amber-200/60 bg-amber-50/60 p-4">
                    <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
                      {content.ui.painPointsEyebrow}
                    </p>
                    <p className="mt-1.5 text-sm text-secondary">
                      {current.painPoints.items[0].detail}
                    </p>
                  </div>

                  <div className="mt-auto pt-2">
                    <Link
                      href={loc(`/industries/${current.slug}`)}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal hover:underline"
                    >
                      {content.ui.selectorViewIndustry} {current.name}
                      <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Container>
      </Section>

      {/* 3. Comparison matrix — table-style search behavior grid */}
      <Section background="soft" aria-labelledby="comparison-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.hub.comparisonSection.eyebrow}
            titleId="comparison-title"
            title={content.hub.comparisonSection.title}
            description={content.hub.comparisonSection.description}
          />
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[640px] border-collapse">
              <thead>
                <tr className="border-b border-line bg-surface-tint">
                  <th scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-muted">
                    {content.ui.comparisonIndustry}
                  </th>
                  {content.hub.comparisonSection.columns.map((col) => (
                    <th key={col.key} scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-muted">
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {industries.map((ind, i) => {
                  const data = comparisonData[ind.slug];
                  if (!data) return null;
                  return (
                    <tr
                      key={ind.slug}
                      className={cn("border-b border-line-soft last:border-b-0", i % 2 === 1 && "bg-surface-soft/40")}
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={loc(`/industries/${ind.slug}`)}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-graphite transition-colors hover:text-brand-teal"
                        >
                          {ind.name}
                          <ArrowUpRight className="h-3 w-3 text-brand-teal" aria-hidden="true" />
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-xs text-secondary">{data.intent}</td>
                      <td className="px-4 py-3"><LevelBars level={data.trust} /></td>
                      <td className="px-4 py-3"><LevelBars level={data.content} /></td>
                      <td className="px-4 py-3 text-xs text-secondary">{data.demand}</td>
                      <td className="px-4 py-3"><LevelBars level={data.authority} /></td>
                      <td className="px-4 py-3 text-xs text-secondary">{data.cycle}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Container>
      </Section>

      {/* 4. Service bundles — horizontal grouped rails */}
      <Section background="default" aria-labelledby="bundles-title">
        <Container className="flex flex-col gap-10">
          <SectionHeader
            align="left"
            eyebrow={content.hub.bundlesSection.eyebrow}
            titleId="bundles-title"
            title={content.hub.bundlesSection.title}
            description={content.hub.bundlesSection.description}
          />
          <div className="flex flex-col gap-4">
            {content.hub.bundlesSection.groups.map((group, gi) => {
              const linked = group.slugs
                .map((slug) => getServiceBySlug(slug, locale))
                .filter((s): s is NonNullable<typeof s> => Boolean(s));
              return (
                <div
                  key={group.label}
                  className={cn(
                    "rounded-2xl border border-line p-5 sm:p-6",
                    gi % 2 === 0 ? "bg-white" : "bg-surface-soft/40"
                  )}
                >
                  <div className="grid items-start gap-4 sm:grid-cols-[200px_1fr]">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
                          <Compass className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <span className="text-sm font-semibold text-graphite">{group.label}</span>
                      </div>
                      <p className="text-xs text-muted">{group.description}</p>
                    </div>
                    {/* horizontal chip rail */}
                    <div className="flex flex-wrap gap-2">
                      {linked.map((s) => (
                        <Link
                          key={s.slug}
                          href={loc(`/services/${s.slug}`)}
                          className="card-lift inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-2 text-xs font-medium text-graphite transition-colors hover:border-brand-teal/40 hover:text-brand-teal"
                        >
                          <Check className="h-3 w-3 text-brand-green" aria-hidden="true" />
                          {s.shortLabel}
                          <ArrowUpRight className="h-3 w-3 text-brand-teal" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      {/* 5. CTA — premium conversion panel */}
      <Section background="tint">
        <Container>
          <div className="relative overflow-hidden rounded-3xl border border-line bg-white depth-layered">
            <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-brand-gradient-soft blur-3xl" />
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-brand-gradient-soft opacity-50 blur-3xl" />
            <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="flex flex-col items-start gap-5">
                <Eyebrow>{content.hub.ctaSection.eyebrow}</Eyebrow>
                <h2 className="max-w-xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl">
                  {content.hub.ctaSection.title}
                </h2>
                <p className="max-w-lg text-secondary">
                  {content.hub.ctaSection.description}
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <CTAButton size="lg" href={loc("/free-seo-audit")}>
                    {content.hub.primaryCta.label}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </CTAButton>
                  <CTAButton variant="secondary" size="lg" href={loc("/book-a-call")}>
                    {content.hub.secondaryCta.label}
                  </CTAButton>
                </div>
              </div>
              <div className="flex flex-col gap-3 rounded-2xl border border-line bg-surface-tint p-5">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
                  {content.ui.ctaAuditPreview}
                </p>
                {content.industries["travel-seo"].finalCta.auditItems.map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-secondary">
                    <span className="inline-flex h-5 w-5 items-center justify-center rounded-md bg-brand-gradient text-[10px] font-bold text-white">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                    {item}
                  </div>
                ))}
                <p className="mt-auto text-center text-[10px] text-muted">
                  {content.ui.ctaIllustrative}
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}