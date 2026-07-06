"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { Section } from "@/components/marketing/shared/section";
import { SectionHeader } from "@/components/marketing/shared/section-header";
import { PricingDecisionGuide } from "./pricing-decision-guide";
import { PricingTabs } from "./pricing-tabs";
import {
  defaultPricingTabId,
  resolvePricingTabId,
  type PricingContent,
  type PricingPlan,
  type PricingTabId,
} from "@/content/pricing.types";
import { type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const contextPlanIds: Record<PricingTabId, string[]> = {
  local: ["local-starter", "local-growth", "national-foundation"],
  national: ["national-foundation", "national-growth", "global-expansion"],
  global: ["global-expansion", "enterprise-authority"],
  mentor: [
    "mentor-office-hours",
    "mentor-growth-advisory",
    "mentor-team-enablement",
    "executive-advisory",
  ],
  audits: [
    "free-audit",
    "search-growth-audit",
    "technical-audit",
    "ai-search-review",
    "ppc-organic-review",
  ],
};

function getAllPlans(content: PricingContent): PricingPlan[] {
  return content.tabs.items.flatMap((tab) => tab.plans);
}

function getContextPlans(content: PricingContent, activeTab: PricingTabId): PricingPlan[] {
  const plans = getAllPlans(content);
  return contextPlanIds[activeTab]
    .map((id) => plans.find((plan) => plan.id === id))
    .filter((plan): plan is PricingPlan => Boolean(plan));
}

function readTabFromLocation(): PricingTabId {
  if (typeof window === "undefined") return defaultPricingTabId;
  return resolvePricingTabId(new URL(window.location.href).searchParams.get("tab"));
}

function writeTabToUrl(tabId: PricingTabId) {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.set("tab", tabId);
  window.history.pushState({ pricingTab: tabId }, "", `${url.pathname}${url.search}${url.hash}`);
}

function PricingContextComparison({
  content,
  activeTab,
}: {
  content: PricingContent;
  activeTab: PricingTabId;
}) {
  const contextPlans = getContextPlans(content, activeTab);

  return (
    <Container className="flex flex-col gap-8">
      <SectionHeader
        align="left"
        eyebrow={content.comparison.eyebrow}
        titleId="pricing-comparison-title"
        title={content.comparison.contextTitle}
        description={content.comparison.contextDescription}
      />

      <div
        className={cn(
          "grid gap-4",
          contextPlans.length <= 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3"
        )}
      >
        {contextPlans.map((plan) => (
          <article
            key={plan.id}
            className={cn(
              "rounded-2xl border bg-white p-5 shadow-[0_18px_44px_-34px_rgba(24,138,172,0.45)]",
              plan.recommended ? "border-brand-teal/50 ring-2 ring-brand-teal/10" : "border-line"
            )}
          >
            {plan.recommended ? (
              <span className="mb-3 inline-flex rounded-full bg-brand-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                {content.ui.recommended}
              </span>
            ) : null}
            <h3 className="text-lg font-semibold tracking-tight text-graphite">{plan.name}</h3>
            <p className="mt-1 text-xl font-semibold text-brand-teal">{plan.price}</p>
            <p className="mt-2 text-sm leading-relaxed text-secondary">{plan.positioning}</p>
            <div className="mt-4 grid gap-3 text-sm text-secondary">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {content.ui.bestFor}
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {plan.bestFor.slice(0, 2).map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-green" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
                  {content.ui.includes}
                </p>
                <ul className="mt-2 grid gap-1.5">
                  {plan.includes.slice(0, 3).map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-teal" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </article>
        ))}
      </div>

      <details className="group overflow-hidden rounded-2xl border border-line bg-white">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-graphite transition-colors hover:bg-surface-tint focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal">
          <span>
            <span className="group-open:hidden">{content.comparison.fullComparisonLabel}</span>
            <span className="hidden group-open:inline">{content.comparison.hideFullComparisonLabel}</span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-brand-teal transition group-open:rotate-180" aria-hidden="true" />
        </summary>
        <div className="border-t border-line-soft p-4">
          <div className="overflow-x-auto rounded-2xl border border-line bg-white">
            <table className="w-full min-w-[980px] border-collapse">
              <caption className="sr-only">{content.comparison.title}</caption>
              <thead>
                <tr className="border-b border-line bg-surface-tint">
                  <th scope="col" className="sticky left-0 z-10 bg-surface-tint px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-muted">
                    {content.ui.compareRowHeader}
                  </th>
                  {content.comparison.columns.map((column) => (
                    <th key={column.id} scope="col" className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wide text-muted">
                      {column.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {content.comparison.rows.map((row, index) => (
                  <tr key={row.label} className={index % 2 === 0 ? "bg-white" : "bg-surface-soft/50"}>
                    <th scope="row" className="sticky left-0 z-10 border-t border-line-soft bg-inherit px-4 py-3 text-left text-sm font-semibold text-graphite">
                      {row.label}
                    </th>
                    {content.comparison.columns.map((column) => (
                      <td key={column.id} className="border-t border-line-soft px-4 py-3 text-sm leading-relaxed text-secondary">
                        {row.values[column.id]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 rounded-2xl border border-brand-teal/20 bg-surface-tint px-5 py-4 text-sm font-medium leading-relaxed text-graphite">
            {content.comparison.exactPricingNote}
          </p>
        </div>
      </details>

      <p className="rounded-2xl border border-brand-teal/20 bg-surface-tint px-5 py-4 text-sm font-medium leading-relaxed text-graphite">
        {content.recurringNote}
      </p>
    </Container>
  );
}

export function PricingInteractiveFlow({
  content,
  locale,
  initialTab,
}: {
  content: PricingContent;
  locale: Locale;
  initialTab: PricingTabId;
}) {
  const [activeTab, setActiveTab] = React.useState<PricingTabId>(initialTab);

  React.useEffect(() => {
    function onPopState() {
      setActiveTab(readTabFromLocation());
    }

    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  function selectTab(tabId: PricingTabId) {
    setActiveTab(tabId);
    writeTabToUrl(tabId);
  }

  return (
    <>
      <Section background="soft" aria-labelledby="pricing-tabs-title">
        <PricingTabs content={content} locale={locale} activeTab={activeTab} onTabChange={selectTab}>
          <PricingDecisionGuide
            content={content}
            locale={locale}
            activeTab={activeTab}
            onSelectTab={selectTab}
          />
        </PricingTabs>
      </Section>

      <Section background="default" aria-labelledby="pricing-comparison-title">
        <PricingContextComparison content={content} activeTab={activeTab} />
      </Section>
    </>
  );
}
