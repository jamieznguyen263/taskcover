"use client";

import * as React from "react";
import { ArrowDown } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { SectionHeader } from "@/components/marketing/shared/section-header";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { PricingPlanCard } from "./pricing-plan-card";
import { cn } from "@/lib/utils";
import { localizePath, type Locale } from "@/lib/i18n";
import type { PricingContent, PricingTabId } from "@/content/pricing.types";

export function PricingTabs({
  content,
  locale,
}: {
  content: PricingContent;
  locale: Locale;
}) {
  const [activeTab, setActiveTab] = React.useState<PricingTabId>(content.tabs.items[0].id);

  function selectTab(id: PricingTabId) {
    setActiveTab(id);
    window.requestAnimationFrame(() => {
      document.getElementById(`pricing-panel-${id}`)?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }

  return (
    <Container className="flex flex-col gap-10">
      <SectionHeader
        align="left"
        eyebrow={content.tabs.eyebrow}
        title={content.tabs.title}
        description={content.tabs.description}
        titleId="pricing-tabs-title"
      >
        <a
          href="#compare-all-plans"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-brand-teal transition hover:border-brand-teal/40 hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
        >
          {content.tabs.compareLink}
          <ArrowDown className="h-4 w-4" aria-hidden="true" />
        </a>
      </SectionHeader>

      <div
        role="tablist"
        aria-label={content.tabs.ariaLabel}
        className="flex gap-2 overflow-x-auto rounded-full border border-line bg-white p-1 shadow-sm"
      >
        {content.tabs.items.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`pricing-tab-${tab.id}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`pricing-panel-${tab.id}`}
              onClick={() => selectTab(tab.id)}
              className={cn(
                "min-h-11 shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
                selected
                  ? "bg-brand-gradient text-white shadow-[0_10px_26px_-16px_rgba(24,138,172,0.85)]"
                  : "text-secondary hover:bg-surface-tint hover:text-graphite"
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid gap-8">
        {content.tabs.items.map((tab, index) => {
          const selected = activeTab === tab.id;
          return (
            <section
              key={tab.id}
              id={`pricing-panel-${tab.id}`}
              role="tabpanel"
              aria-labelledby={`pricing-tab-${tab.id}`}
              tabIndex={selected ? 0 : -1}
              className={cn(
                "scroll-mt-24 overflow-hidden rounded-3xl border p-5 sm:p-6 lg:p-8",
                selected
                  ? "border-brand-teal/40 bg-[linear-gradient(135deg,rgba(255,255,255,1),rgba(244,248,251,0.9))] ring-brand-glow"
                  : index % 2 === 0
                    ? "border-line bg-white"
                    : "border-line bg-surface-soft"
              )}
            >
              <div className="grid gap-7 lg:grid-cols-[0.72fr_1.28fr]">
                <div className="flex flex-col gap-4">
                  <span className="inline-flex w-fit rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-teal">
                    {tab.eyebrow}
                  </span>
                  <h3 className="text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">
                    {tab.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-secondary sm:text-base">
                    {tab.intro}
                  </p>
                  {tab.subcopy ? (
                    <p className="rounded-2xl border border-line bg-white px-4 py-3 text-sm leading-relaxed text-secondary">
                      {tab.subcopy}
                    </p>
                  ) : null}
                  {tab.notes?.length ? (
                    <div className="rounded-2xl border border-line bg-white p-4">
                      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                        {content.ui.notes}
                      </p>
                      <ul className="mt-2 grid gap-2 text-sm text-secondary">
                        {tab.notes.map((note) => (
                          <li key={note} className="flex gap-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" aria-hidden="true" />
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {tab.cta ? (
                    <CTAButton href={localizePath(tab.cta.href, locale)} size="md">
                      {tab.cta.label}
                    </CTAButton>
                  ) : null}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {tab.plans.map((plan) => (
                    <PricingPlanCard
                      key={plan.id}
                      plan={plan}
                      locale={locale}
                      labels={content.ui}
                      compact={tab.plans.length > 3}
                    />
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>
    </Container>
  );
}
