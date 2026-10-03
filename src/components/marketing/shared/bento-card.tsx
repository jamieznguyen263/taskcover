import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Bento grid tile. Supports span variants for asymmetric grids.
 */
const bentoCardVariants = cva(
  "group relative overflow-hidden rounded-tc-lg border border-tc-line bg-tc-surface p-6 text-tc-ink",
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
        tint: "bg-tc-bg",
        soft: "bg-tc-surface-muted",
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
