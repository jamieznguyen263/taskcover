import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Centered max-width content container used across marketing sections.
 */
export function Container({
  className,
  children,
  as: Tag = "div",
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  as?: React.ElementType;
}) {
  return (
    <Tag
      className={cn("mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}