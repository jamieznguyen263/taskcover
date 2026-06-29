import * as React from "react";
import { Video, FileText, Presentation } from "lucide-react";
import { Container } from "@/components/marketing/shared/container";
import { cn } from "@/lib/utils";

/**
 * Video proof framework.
 *
 * A compact, premium proof framework that looks intentional and public-ready.
 * It does not show "Video coming soon" placeholders. Instead it frames three
 * proof slots (spokesperson, client review, case walkthrough) as a structured
 * framework ready for permissioned assets.
 *
 * No fabricated quotes or videos.
 */

const iconMap = {
  spokesperson: Video,
  review: Video,
  case: Presentation,
} as const;

export function VideoProofFramework({
  eyebrow,
  title,
  description,
  slots,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  slots: readonly { label: string; detail: string }[];
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

      <div className="grid gap-4 md:grid-cols-3">
        {slots.map((slot, i) => {
          const Icon = i === 2 ? iconMap.case : i === 1 ? FileText : iconMap.spokesperson;
          return (
            <div
              key={slot.label}
              className="card-lift flex flex-col gap-3 rounded-2xl border border-line bg-white p-6"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold text-graphite">{slot.label}</p>
              <p className="text-xs leading-relaxed text-secondary">{slot.detail}</p>
              <div className="mt-auto inline-flex items-center gap-1.5 pt-2 text-[11px] font-medium text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-emerald" aria-hidden="true" />
                Framework ready · added with permission
              </div>
            </div>
          );
        })}
      </div>
    </Container>
  );
}