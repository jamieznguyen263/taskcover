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
      className={cn("mx-auto w-full max-w-[1200px] px-6 max-[400px]:px-4", className)}
      {...props}
    >
      {children}
    </Tag>
  );
}
