import * as React from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProcessStep = {
  title: string;
  description: React.ReactNode;
};

/**
 * Vertical timeline used for methodology / process sections.
 */
export function ProcessTimeline({
  steps,
  className,
}: {
  steps: ProcessStep[];
  className?: string;
}) {
  return (
    <ol className={cn("relative flex flex-col gap-8", className)}>
      <span
        aria-hidden="true"
        className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-green via-brand-teal to-brand-blue"
      />
      {steps.map((step, index) => (
        <li key={step.title} className="relative flex gap-5">
          <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-xs font-semibold text-white shadow-[0_4px_12px_-4px_rgba(24,138,172,0.6)]">
            {index + 1}
          </span>
          <div className="flex-1 pt-1">
            <h3 className="text-base font-semibold text-graphite">
              {step.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-secondary">
              {step.description}
            </p>
          </div>
        </li>
      ))}
      <li className="relative flex gap-5">
        <span className="relative z-10 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-brand-teal bg-white text-brand-teal">
          <Check className="h-4 w-4" aria-hidden="true" />
        </span>
        <div className="flex-1 pt-1">
          <h3 className="text-base font-semibold text-graphite">
            Quarterly strategy reset
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-secondary">
            We re-baseline priorities against market shifts, SERP changes, and
            AI answer evolution so the roadmap stays current.
          </p>
        </div>
      </li>
    </ol>
  );
}
