import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Generic card for proof surfaces (testimonials, case-study teasers, etc.)
 *
 * IMPORTANT: this component renders whatever content is passed in. It does
 * NOT inject fabricated quotes, names, or metrics. When real proof is not yet
 * available, pass clearly-labeled placeholder content from a data file.
 */
export function ProofCard({
  className,
  eyebrow,
  children,
  footer,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  eyebrow?: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <figure
      className={cn(
        "flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-6",
        "transition-colors hover:border-brand-teal/30",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-3">
        {eyebrow ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-brand-teal">
            {eyebrow}
          </span>
        ) : null}
        <div className="text-sm leading-relaxed text-secondary">{children}</div>
      </div>
      {footer ? (
        <figcaption className="mt-5 border-t border-line-soft pt-4 text-xs text-muted">
          {footer}
        </figcaption>
      ) : null}
    </figure>
  );
}