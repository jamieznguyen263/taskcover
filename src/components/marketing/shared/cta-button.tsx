import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * Taskcover call-to-action button. Renders as an anchor (native <a>).
 *
 * Variants:
 *  - primary:   accent fill with white text
 *  - secondary: ink fill with white text
 *  - ghost:     underlined ink text
 *  - outline:   strong line border with ink text
 *
 * Pass `href` for navigation. Children render inside (icon + label is fine).
 */
const ctaButtonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-tc-md font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-tc-accent focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-tc-accent text-white hover:bg-tc-accent/95",
        secondary:
          "bg-tc-ink text-white hover:bg-tc-ink-2",
        outline:
          "border border-tc-line-strong bg-tc-surface text-tc-ink hover:bg-tc-surface-muted",
        ghost:
          "text-tc-ink underline underline-offset-4 hover:decoration-tc-accent",
      },
      size: {
        sm: "h-11 px-4 text-sm",
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
  const analyticsProvider = typeof props.href === "string" && props.href.includes("cal.com") ? "calcom" : undefined;

  return (
    <a
      className={cn(ctaButtonVariants({ variant, size }), className)}
      data-analytics="cta"
      data-analytics-provider={analyticsProvider}
      {...props}
    >
      {children}
    </a>
  );
}

export { ctaButtonVariants };
