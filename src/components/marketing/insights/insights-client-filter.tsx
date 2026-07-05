"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import type { InsightCategorySlug } from "@/content/insights.types";
import { cn } from "@/lib/utils";

export type InsightFilterItem = {
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  category: InsightCategorySlug;
  categoryLabel: string;
  tags: string[];
  services: string[];
  readingTime: number;
};

type FilterUi = {
  searchPlaceholder: string;
  filterByCategory: string;
  filterByTopic: string;
  filterByService: string;
  allCategories: string;
  noResults: string;
  readArticle: string;
  minutes: string;
};

export function InsightsClientFilter({
  items,
  categories,
  ui,
}: {
  items: InsightFilterItem[];
  categories: { slug: InsightCategorySlug; label: string }[];
  ui: FilterUi;
}) {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("all");
  const [topic, setTopic] = React.useState<string>("all");
  const [service, setService] = React.useState<string>("all");

  const topics = React.useMemo(
    () => Array.from(new Set(items.flatMap((item) => item.tags))).sort(),
    [items]
  );
  const services = React.useMemo(
    () => Array.from(new Set(items.flatMap((item) => item.services))).sort(),
    [items]
  );

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = items.filter((item) => {
    if (category !== "all" && item.category !== category) return false;
    if (topic !== "all" && !item.tags.includes(topic)) return false;
    if (service !== "all" && !item.services.includes(service)) return false;
    if (!normalizedQuery) return true;
    return [item.title, item.excerpt, item.categoryLabel, item.tags.join(" "), item.services.join(" ")]
      .join(" ")
      .toLowerCase()
      .includes(normalizedQuery);
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 rounded-2xl border border-line bg-white p-4 depth-layered lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <label className="relative block">
          <span className="sr-only">{ui.searchPlaceholder}</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={ui.searchPlaceholder}
            className="min-h-11 w-full rounded-xl border border-line bg-surface-soft py-2 pl-10 pr-3 text-sm text-graphite outline-none transition focus:border-brand-teal"
          />
        </label>
        <Select label={ui.filterByCategory} value={category} onChange={setCategory}>
          <option value="all">{ui.allCategories}</option>
          {categories.map((item) => (
            <option key={item.slug} value={item.slug}>
              {item.label}
            </option>
          ))}
        </Select>
        <Select label={ui.filterByTopic} value={topic} onChange={setTopic}>
          <option value="all">{ui.filterByTopic}</option>
          {topics.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select label={ui.filterByService} value={service} onChange={setService}>
          <option value="all">{ui.filterByService}</option>
          {services.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-line bg-surface-soft p-5 text-sm text-secondary">
          {ui.noResults}
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((item, index) => (
            <Link
              key={item.slug}
              href={item.href}
              className={cn(
                "card-lift group flex min-h-56 flex-col gap-4 rounded-2xl border border-line bg-white p-5 hover:border-brand-teal/40",
                index === 0 && "lg:row-span-2 lg:min-h-[29rem]"
              )}
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-brand-gradient px-3 py-1 text-xs font-semibold text-white">
                  {item.categoryLabel}
                </span>
                <span className="text-xs font-medium text-muted">
                  {item.readingTime} {ui.minutes}
                </span>
              </div>
              <h3 className={cn("text-xl font-semibold tracking-tight text-graphite", index === 0 && "text-3xl")}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-secondary">{item.excerpt}</p>
              <div className="mt-auto flex flex-wrap gap-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full border border-line bg-surface-tint px-2.5 py-1 text-[11px] font-medium text-secondary">
                    {tag}
                  </span>
                ))}
              </div>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-brand-teal">
                {ui.readArticle}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-xl border border-line bg-surface-soft px-3 py-2 text-sm font-medium text-graphite outline-none transition focus:border-brand-teal"
      >
        {children}
      </select>
    </label>
  );
}
