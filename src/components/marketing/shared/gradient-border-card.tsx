import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Legacy export retained as a plain bordered card.
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
        "relative rounded-tc-lg border border-tc-line bg-tc-surface p-6 text-tc-ink",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
