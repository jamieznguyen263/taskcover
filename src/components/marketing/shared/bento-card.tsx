import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Bento grid tile. Supports span variants for asymmetric grids.
 */
const bentoCardVariants = cva(
  "group relative overflow-hidden rounded-2xl border border-line bg-white p-6 transition-all duration-300 hover:border-brand-teal/40 hover:shadow-[0_18px_40px_-24px_rgba(24,138,172,0.35)]",
  {
    variants: {
      span: {
        default: "",
        wide: "sm:col-span-2",
        tall: "sm:row-span-2",
        feature: "sm:col-span-2 sm:row-span-2",
      },
      tone: {
        default: "",
        tint: "bg-surface-tint",
        soft: "bg-surface-soft",
      },
    },
    defaultVariants: { span: "default", tone: "default" },
  }
);

export type BentoCardProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof bentoCardVariants> & {
    as?: React.ElementType;
  };

export function BentoCard({
  className,
  span,
  tone,
  as: Tag = "div",
  children,
  ...props
}: BentoCardProps) {
  return (
    <Tag className={cn(bentoCardVariants({ span, tone }), className)} {...props}>
      {children}
    </Tag>
  );
}