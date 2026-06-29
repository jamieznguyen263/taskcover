import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Marketing section wrapper with consistent vertical rhythm.
 */
export function Section({
  className,
  children,
  as: Tag = "section",
  background = "default",
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  as?: React.ElementType;
  background?: "default" | "soft" | "tint";
}) {
  const backgrounds = {
    default: "bg-white",
    soft: "bg-surface-soft",
    tint: "bg-surface-tint",
  } as const;

  return (
    <Tag
      className={cn(
        "py-20 sm:py-24 lg:py-28",
        backgrounds[background],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}