"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Filter, RotateCcw } from "lucide-react";
import type { CaseMetric, CaseVisual } from "@/content/work.types";
import { localizePath, type Locale } from "@/lib/i18n";

export type CaseStudyIndexItem = {
  slug: string;
  clientName: string;
  summary: string;
  industry?: string;
  industrySlug: string;
  market?: string;
  marketSlugs: string[];
  serviceSlugs: string[];
  metrics: Pick<CaseMetric, "id" | "label" | "value" | "context" | "category">[];
  visualGallery: CaseVisual[];
};

type FilterOption = { value: string; label: string };

type Props = {
  cases: CaseStudyIndexItem[];
  locale: Locale;
  serviceLabels: Record<string, string>;
  labels: {
    allCases: string;
    filterIndustry: string;
    filterMarket: string;
    filterService: string;
    readCase: string;
    viewCaseStudy: string;
    clearFilters: string;
    resultCount: string;
    relatedServices: string;
  };
};

function uniqueByValue(values: FilterOption[]): FilterOption[] {
  const seen = new Map<string, string>();
  for (const item of values) {
    if (!seen.has(item.value)) seen.set(item.value, item.label);
  }
  return Array.from(seen, ([value, label]) => ({ value, label })).sort((a, b) =>
    a.label.localeCompare(b.label)
  );
}

function countLabel(template: string, count: number) {
  return template.replace("{count}", String(count));
}

export function CaseStudyIndex({ cases, locale, serviceLabels, labels }: Props) {
  const [industry, setIndustry] = useState("");
  const [market, setMarket] = useState("");
  const [service, setService] = useState("");

  const filters = useMemo(
    () => ({
      industries: uniqueByValue(
        cases.map((item) => ({ value: item.industrySlug, label: item.industry ?? item.industrySlug }))
      ),
      markets: uniqueByValue(
        cases.flatMap((item) =>
          item.marketSlugs.map((slug) => ({ value: slug, label: item.market ?? slug }))
        )
      ),
      services: uniqueByValue(
        cases.flatMap((item) =>
          item.serviceSlugs.map((slug) => ({ value: slug, label: serviceLabels[slug] ?? slug }))
        )
      ),
    }),
    [cases, serviceLabels]
  );

  const filtered = cases.filter((item) => {
    const industryMatch = !industry || item.industrySlug === industry;
    const marketMatch = !market || item.marketSlugs.includes(market);
    const serviceMatch = !service || item.serviceSlugs.includes(service);
    return industryMatch && marketMatch && serviceMatch;
  });
  const hasFilters = Boolean(industry || market || service);

  return (
    <div className="grid gap-6">
      <div className="rounded-3xl border border-line bg-white p-4 shadow-soft sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-sm font-semibold text-graphite">
            {countLabel(labels.resultCount, filtered.length)}
          </p>
          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setIndustry("");
                setMarket("");
                setService("");
              }}
              className="inline-flex min-h-10 w-fit items-center gap-2 rounded-full border border-line bg-white px-3 text-sm font-semibold text-secondary transition hover:border-brand-teal hover:text-brand-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {labels.clearFilters}
            </button>
          ) : null}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[
            { label: labels.filterIndustry, value: industry, set: setIndustry, options: filters.industries },
            { label: labels.filterMarket, value: market, set: setMarket, options: filters.markets },
            { label: labels.filterService, value: service, set: setService, options: filters.services },
          ].map((filter) => (
            <label key={filter.label} className="grid gap-2 text-xs font-semibold text-muted">
              <span className="inline-flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-brand-teal" aria-hidden="true" />
                {filter.label}
              </span>
              <select
                value={filter.value}
                onChange={(event) => filter.set(event.target.value)}
                className="min-h-11 rounded-xl border border-line bg-surface-tint px-3 text-sm font-semibold text-graphite outline-none transition focus:border-brand-teal focus:ring-2 focus:ring-brand-teal/20"
              >
                <option value="">{labels.allCases}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {filtered.map((item) => {
          const image = item.visualGallery[0];
          const primaryMetric = item.metrics[0];
          return (
            <article
              key={item.slug}
              className="group grid min-w-0 overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition hover:-translate-y-0.5 hover:border-brand-teal/35"
            >
              <Link href={localizePath(`/work/case-studies/${item.slug}`, locale)} className="grid min-w-0">
                <div className="relative bg-surface-tint p-3">
                  <div className="relative aspect-[9/5] overflow-hidden rounded-2xl border border-line-soft bg-white">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="grid gap-4 p-5">
                  <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                    {item.industry ? <span>{item.industry}</span> : null}
                    {item.market ? <span>{item.market}</span> : null}
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold tracking-tight text-graphite group-hover:text-brand-teal">
                      {item.clientName}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-secondary">{item.summary}</p>
                  </div>
                  {primaryMetric ? (
                    <div className="rounded-2xl border border-brand-teal/20 bg-surface-tint p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{primaryMetric.label}</p>
                      <p className="mt-1 text-3xl font-semibold text-brand-teal">{primaryMetric.value}</p>
                      <p className="mt-2 text-xs leading-5 text-secondary">{primaryMetric.context}</p>
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {item.serviceSlugs.slice(0, 3).map((slug) => (
                      <span
                        key={slug}
                        className="rounded-full border border-line bg-white px-3 py-1 text-xs font-semibold text-secondary"
                      >
                        {serviceLabels[slug] ?? slug}
                      </span>
                    ))}
                  </div>
                  <span className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-graphite transition group-hover:border-brand-teal group-hover:text-brand-teal">
                    {labels.viewCaseStudy || labels.readCase}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
