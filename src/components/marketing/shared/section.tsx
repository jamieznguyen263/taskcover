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
  background?: "default" | "soft" | "tint" | "surface" | "inverse";
}) {
  const backgrounds = {
    default: "bg-tc-bg text-tc-ink",
    surface: "bg-tc-surface text-tc-ink",
    inverse: "tc-section-inverse bg-tc-inverse text-tc-surface",
    // Retain existing callers while adopting the semantic palette.
    soft: "bg-tc-bg text-tc-ink",
    tint: "bg-tc-bg text-tc-ink",
  } as const;

  return (
    <Tag
      className={cn(
        "py-16 lg:py-24",
        backgrounds[background],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}
