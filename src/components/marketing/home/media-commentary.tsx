import * as React from "react";
import { Newspaper } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { cn } from "@/lib/utils";

/**
 * Media & Expert Commentary.
 *
 * Reframes the old "Press" section away from placeholder publications and
 * article titles. Instead it presents neutral commentary categories that
 * communicate authority without fabricating coverage, dates, or links.
 */

export function MediaCommentary({
  eyebrow,
  title,
  description,
  categories,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  categories: readonly { label: string; detail: string }[];
  className?: string;
}) {
  return (
    <Container className={cn("flex flex-col gap-10", className)}>
      <div className="flex max-w-2xl flex-col gap-4">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-line bg-surface-tint px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-gradient" />
          {eyebrow}
        </span>
        <h2 className="text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
          {title}
        </h2>
        <p className="text-pretty text-base leading-relaxed text-secondary sm:text-lg">
          {description}
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-line bg-white">
        <ul className="divide-y divide-line-soft">
          {categories.map((cat) => (
            <li
              key={cat.label}
              className="flex flex-col gap-1 px-5 py-4 transition-colors hover:bg-surface-tint sm:flex-row sm:items-center sm:gap-4"
            >
              <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-surface-tint text-brand-teal">
                <Newspaper className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-graphite">{cat.label}</p>
                <p className="text-xs text-secondary">{cat.detail}</p>
              </div>
              <span className="inline-flex shrink-0 items-center rounded-full border border-line bg-surface-tint px-2.5 py-1 text-[11px] font-medium text-muted">
                Commentary
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  );
}