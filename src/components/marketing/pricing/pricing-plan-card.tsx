import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { CTAButton } from "@/components/marketing/shared/cta-button";
import { cn } from "@/lib/utils";
import { localizePath, type Locale } from "@/lib/i18n";
import type { PricingPlan, PricingContent } from "@/content/pricing.types";

export function PricingPlanCard({
  plan,
  locale,
  labels,
  compact = false,
}: {
  plan: PricingPlan;
  locale: Locale;
  labels: PricingContent["ui"];
  compact?: boolean;
}) {
  return (
    <article
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-2xl border bg-white p-5 shadow-[0_20px_48px_-34px_rgba(24,138,172,0.45)]",
        plan.recommended ? "border-brand-teal/50 ring-2 ring-brand-teal/10" : "border-line",
        compact && "p-4"
      )}
    >
      {plan.recommended ? (
        <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-brand-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {labels.recommended}
        </span>
      ) : null}

      <div className="flex flex-col gap-2">
        <h3 className="text-xl font-semibold tracking-tight text-graphite">{plan.name}</h3>
        <p className="text-2xl font-semibold text-brand-teal">{plan.price}</p>
        <p className="text-sm leading-relaxed text-secondary">{plan.positioning}</p>
      </div>

      <div className="mt-5 grid gap-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {labels.bestFor}
          </p>
          <ul className="mt-2 grid gap-1.5">
            {plan.bestFor.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-secondary">
                <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-brand-green" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {labels.includes}
          </p>
          <ul className="mt-2 grid gap-1.5">
            {plan.includes.map((item) => (
              <li key={item} className="flex gap-2 text-sm leading-relaxed text-secondary">
                <span
                  className="mt-1 inline-flex h-3.5 w-3.5 shrink-0 rounded-full bg-brand-gradient"
                  aria-hidden="true"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {plan.scopeGuard ? (
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-700">
            {labels.scopeGuard}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-amber-900">{plan.scopeGuard}</p>
        </div>
      ) : null}

      <div className="mt-5 grid gap-2 text-xs text-secondary">
        {plan.minimum ? (
          <p>
            <span className="font-semibold text-graphite">{labels.minimum}:</span> {plan.minimum}
          </p>
        ) : null}
        {plan.addOn ? (
          <p>
            <span className="font-semibold text-graphite">{labels.addOn}:</span> {plan.addOn}
          </p>
        ) : null}
      </div>

      {plan.cta ? (
        <div className="mt-auto pt-5">
          <CTAButton
            href={localizePath(plan.cta.href, locale)}
            size="md"
            variant={plan.recommended ? "primary" : "secondary"}
            className="w-full"
          >
            {plan.cta.label}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </CTAButton>
        </div>
      ) : null}
    </article>
  );
}
