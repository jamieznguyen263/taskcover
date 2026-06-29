import * as React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Press / media feature card.
 *
 * DO NOT link to invented articles. When a real article is confirmed, pass
 * `href`. Otherwise leave `href` undefined and the card renders as a neutral
 * placeholder labeled "Coverage placeholder".
 */
export function PressCard({
  publication,
  title,
  topic,
  date,
  href,
  className,
}: {
  publication: string;
  title: string;
  topic?: string;
  date?: string;
  href?: string;
  className?: string;
}) {
  const hasLink = Boolean(href);
  const Tag = hasLink ? "a" : "div";

  return (
    <Tag
      {...(hasLink
        ? { href, target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className={cn(
        "group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-5 transition-colors",
        hasLink && "hover:border-brand-teal/40",
        className
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <span className="inline-flex items-center rounded-full border border-line bg-surface-tint px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-brand-teal">
          {publication}
        </span>
        {hasLink ? (
          <ArrowUpRight
            className="h-4 w-4 text-muted transition-colors group-hover:text-brand-teal"
            aria-hidden="true"
          />
        ) : (
          <span className="text-[11px] text-muted">Placeholder</span>
        )}
      </div>
      <p className="mt-4 text-sm font-semibold leading-snug text-graphite">
        {title}
      </p>
      <div className="mt-4 flex items-center gap-2 text-xs text-muted">
        {topic ? <span>{topic}</span> : null}
        {topic && date ? <span aria-hidden="true">·</span> : null}
        {date ? <span>{date}</span> : null}
      </div>
    </Tag>
  );
}