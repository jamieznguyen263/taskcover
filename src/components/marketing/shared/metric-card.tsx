import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Metric display card for dashboard mockups and result previews.
 *
 * IMPORTANT: pass `placeholder` when no verified number exists yet.
 * Do not fabricate metrics. See docs/SEO_STANDARDS.md.
 */
const metricToneVariants = cva("text-3xl font-semibold tracking-tight sm:text-4xl", {
  variants: {
    tone: {
      default: "text-graphite",
      brand: "text-brand-gradient",
      teal: "text-brand-teal",
    },
  },
  defaultVariants: { tone: "default" },
});

export type MetricCardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof metricToneVariants> & {
    label: string;
    /** Use a clear placeholder (e.g. "—" or "TBD") when no verified value exists. */
    value: React.ReactNode;
    delta?: { value: string; trend?: "up" | "down" | "flat" };
    footnote?: React.ReactNode;
  };

export function MetricCard({
  label,
  value,
  delta,
  footnote,
  tone,
  className,
  ...props
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-line bg-white p-4",
        className
      )}
      {...props}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {label}
      </p>
      <p className={cn("mt-2", metricToneVariants({ tone }))}>{value}</p>
      {delta ? (
        <p
          className={cn(
            "mt-1 inline-flex items-center gap-1 text-xs font-medium",
            delta.trend === "up" && "text-brand-emerald",
            delta.trend === "down" && "text-rose-500",
            (!delta.trend || delta.trend === "flat") && "text-muted"
          )}
        >
          {delta.trend === "up" ? "▲" : delta.trend === "down" ? "▼" : "•"}
          {delta.value}
        </p>
      ) : null}
      {footnote ? (
        <p className="mt-2 text-xs text-muted">{footnote}</p>
      ) : null}
    </div>
  );
}