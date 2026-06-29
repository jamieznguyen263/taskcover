import * as React from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ComparisonRow = {
  dimension: string;
  traditional: React.ReactNode;
  taskcover: React.ReactNode;
};

/**
 * Three-column comparison table: dimension | traditional | Taskcover.
 */
export function ComparisonTable({
  rows,
  className,
}: {
  rows: ComparisonRow[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-line bg-white",
        className
      )}
    >
      <div className="grid grid-cols-[1.4fr_1fr_1fr] border-b border-line bg-surface-tint text-xs font-semibold uppercase tracking-wide text-muted">
        <div className="px-4 py-3">Dimension</div>
        <div className="px-4 py-3">Traditional SEO vendor</div>
        <div className="px-4 py-3 text-graphite">Taskcover Agency</div>
      </div>
      <ul className="divide-y divide-line-soft">
        {rows.map((row) => (
          <li
            key={row.dimension}
            className="grid grid-cols-[1.4fr_1fr_1fr] items-start"
          >
            <div className="px-4 py-4 text-sm font-medium text-graphite">
              {row.dimension}
            </div>
            <div className="flex items-start gap-2 px-4 py-4 text-sm text-secondary">
              <X
                className="mt-0.5 h-4 w-4 shrink-0 text-muted"
                aria-hidden="true"
              />
              <span>{row.traditional}</span>
            </div>
            <div className="flex items-start gap-2 bg-surface-tint/50 px-4 py-4 text-sm text-graphite">
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-brand-teal"
                aria-hidden="true"
              />
              <span>{row.taskcover}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}