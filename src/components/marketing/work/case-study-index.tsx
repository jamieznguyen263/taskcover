"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Filter } from "lucide-react";
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
  metrics: Pick<CaseMetric, "id" | "label" | "value">[];
  visualGallery: CaseVisual[];
};

type Props = {
  cases: CaseStudyIndexItem[];
  locale: Locale;
  labels: {
    allCases: string;
    filterIndustry: string;
    filterMarket: string;
    filterService: string;
    readCase: string;
  };
};

function unique(values: string[]): string[] {
  return Array.from(new Set(values)).sort((a, b) => a.localeCompare(b));
}

export function CaseStudyIndex({ cases, locale, labels }: Props) {
  const [industry, setIndustry] = useState(labels.allCases);
  const [market, setMarket] = useState(labels.allCases);
  const [service, setService] = useState(labels.allCases);

  const filters = useMemo(
    () => ({
      industries: unique(cases.map((item) => item.industry ?? item.industrySlug)),
      markets: unique(cases.flatMap((item) => [item.market ?? "", ...item.marketSlugs]).filter(Boolean)),
      services: unique(cases.flatMap((item) => item.serviceSlugs)),
    }),
    [cases]
  );

  const filtered = cases.filter((item) => {
    const industryMatch = industry === labels.allCases || item.industry === industry || item.industrySlug === industry;
    const marketMatch = market === labels.allCases || item.market === market || item.marketSlugs.includes(market);
    const serviceMatch = service === labels.allCases || item.serviceSlugs.includes(service);
    return industryMatch && marketMatch && serviceMatch;
  });

  return (
    <div className="grid gap-6">
      <div className="grid gap-3 rounded-2xl border border-line bg-white p-4 sm:grid-cols-3">
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
              <option>{labels.allCases}</option>
              {filter.options.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </label>
        ))}
      </div>

      <div className="grid gap-4">
        {filtered.map((item) => {
          const image = item.visualGallery[0];
          return (
            <article
              key={item.slug}
              className="grid overflow-hidden rounded-2xl border border-line bg-white shadow-soft sm:grid-cols-[180px_1fr]"
            >
              <div className="relative min-h-44 bg-surface-tint sm:min-h-full">
                <Image src={image.src} alt={image.alt} fill sizes="(max-width: 640px) 100vw, 180px" className="object-cover" />
              </div>
              <div className="grid gap-4 p-5">
                <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  <span>{item.industry}</span>
                  <span aria-hidden="true">/</span>
                  <span>{item.market}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold tracking-tight text-graphite">{item.clientName}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary">{item.summary}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {item.metrics.slice(0, 2).map((metric) => (
                    <span key={metric.id} className="rounded-full border border-brand-teal/25 bg-surface-tint px-3 py-1 text-xs font-semibold text-brand-teal">
                      {metric.label}: {metric.value}
                    </span>
                  ))}
                </div>
                <Link href={localizePath(`/work/case-studies/${item.slug}`, locale)} className="inline-flex min-h-11 w-fit items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-graphite transition hover:border-brand-teal hover:text-brand-teal focus:outline-none focus:ring-2 focus:ring-brand-teal/30">
                  {labels.readCase}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
