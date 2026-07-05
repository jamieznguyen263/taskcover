"use client";

import * as React from "react";
import { ArrowRight, Compass } from "lucide-react";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { cn } from "@/lib/utils";
import { localizePath, type Locale } from "@/lib/i18n";
import type { PricingContent } from "@/content/pricing.types";

export function PricingDecisionGuide({
  content,
  locale,
}: {
  content: PricingContent;
  locale: Locale;
}) {
  const [selectedId, setSelectedId] = React.useState(content.decisionGuide.paths[0].id);
  const selected =
    content.decisionGuide.paths.find((path) => path.id === selectedId) ??
    content.decisionGuide.paths[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
      <div
        className="grid gap-2"
        role="listbox"
        aria-label={content.decisionGuide.ariaLabel}
      >
        {content.decisionGuide.paths.map((path) => {
          const active = selected.id === path.id;
          return (
            <button
              key={path.id}
              type="button"
              role="option"
              aria-selected={active}
              onClick={() => setSelectedId(path.id)}
              className={cn(
                "min-h-11 rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
                active
                  ? "border-brand-teal/50 bg-white text-graphite shadow-[0_18px_42px_-30px_rgba(24,138,172,0.6)]"
                  : "border-line bg-surface-tint/50 text-secondary hover:border-brand-teal/30 hover:bg-white"
              )}
            >
              {path.trigger}
            </button>
          );
        })}
      </div>

      <article className="relative overflow-hidden rounded-3xl border border-line bg-white p-6 depth-layered sm:p-8">
        <div aria-hidden="true" className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-brand-gradient-soft blur-3xl" />
        <div className="relative flex flex-col gap-5">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-gradient text-white">
            <Compass className="h-6 w-6" aria-hidden="true" />
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-teal">
              {content.ui.recommendation}
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-graphite">
              {selected.planName}
            </h3>
            <p className="mt-1 text-xl font-semibold text-brand-teal">
              {selected.startingPrice}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-secondary sm:text-base">{selected.why}</p>
          <CTAButton href={localizePath(selected.cta.href, locale)} size="md" className="w-fit">
            {selected.cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>
      </article>
    </div>
  );
}
