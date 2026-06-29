import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Taskcover call-to-action button. Renders as an anchor (native <a>).
 *
 * Variants:
 *  - primary:   brand-gradient fill, premium CTA
 *  - secondary: white surface with line border
 *  - ghost:     text-only with brand-teal underline on hover
 *  - outline:   controlled gradient border (premium accent)
 *
 * Pass `href` for navigation. Children render inside (icon + label is fine).
 */
const ctaButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-brand-gradient text-white shadow-[0_10px_30px_-12px_rgba(24,138,172,0.6)] hover:brightness-[1.03] hover:shadow-[0_14px_36px_-12px_rgba(24,138,172,0.7)]",
        secondary:
          "bg-white text-graphite border border-line hover:border-brand-teal/40 hover:bg-surface-tint",
        outline:
          "relative text-graphite border border-transparent hover:bg-surface-tint",
        ghost:
          "text-brand-teal hover:underline underline-offset-4 decoration-brand-teal/50",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-13 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "lg" },
  }
);

export type CTAButtonProps = React.AnchorHTMLAttributes<HTMLAnchorElement> &
  VariantProps<typeof ctaButtonVariants>;

export function CTAButton({
  className,
  variant,
  size,
  children,
  ...props
}: CTAButtonProps) {
  const isOutline = variant === "outline";

  // Outline variant wraps the anchor with a gradient ring for a premium border.
  if (isOutline) {
    return (
      <span className="relative inline-flex rounded-full bg-brand-gradient p-px">
        <a
          className={cn(
            ctaButtonVariants({ variant: "primary", size }),
            "bg-white text-graphite shadow-none hover:bg-surface-tint",
            "rounded-full",
            className
          )}
          {...props}
        >
          {children}
        </a>
      </span>
    );
  }

  return (
    <a
      className={cn(ctaButtonVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </a>
  );
}

export { ctaButtonVariants };