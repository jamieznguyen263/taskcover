import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Premium card with a controlled brand-gradient border.
 * Used sparingly for emphasis (per design system: do not overuse gradients).
 */
export function GradientBorderCard({
  className,
  children,
  as: Tag = "div",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn(
        "relative rounded-2xl bg-brand-gradient p-px shadow-sm",
        className
      )}
      {...props}
    >
      <div className="h-full w-full rounded-[15px] bg-white p-6">
        {children}
      </div>
    </Tag>
  );
}