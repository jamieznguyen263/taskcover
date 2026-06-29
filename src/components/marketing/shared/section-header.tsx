import * as React from "react";
import { cn } from "@/lib/utils";
import { Container } from "./container";

/**
 * Small brand eyebrow label that sits above section headlines.
 */
export function Eyebrow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-line bg-surface-tint px-3 py-1",
        "text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal",
        className
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-brand-gradient"
      />
      {children}
    </span>
  );
}

type SectionHeaderProps = {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  children?: React.ReactNode;
  /** Optional id for aria-labelledby on the parent section. */
  titleId?: string;
};

/**
 * Standard section header used across marketing pages.
 * Renders a single semantic H2 by default (used under a page-level H1).
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  children,
  titleId,
}: SectionHeaderProps) {
  return (
    <Container
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        align === "left" && "items-start text-left",
        className
      )}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2
        id={titleId}
        className="max-w-3xl text-balance text-3xl font-semibold tracking-tight text-graphite sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]"
      >
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-pretty text-base leading-relaxed text-secondary sm:text-lg">
          {description}
        </p>
      ) : null}
      {children}
    </Container>
  );
}