import * as React from "react";
import { cn } from "@/lib/utils";

type LogoCloudItem = {
  name: string;
  /** Optional note shown under the name (e.g. "Press feature", "Partner brand"). */
  note?: string;
};

/**
 * Text-only logo cloud. Renders brand names as pills to avoid implying
 * endorsement we cannot back with permission.
 *
 * Items may be passed as plain strings or as `{ name, note }` objects for
 * backward compatibility.
 *
 * DO NOT use official logos unless (a) assets are present in /public/brand
 * and (b) usage is explicitly permitted. See docs/SEO_STANDARDS.md.
 */
export function LogoCloud({
  items,
  caption,
  className,
}: {
  items: readonly (string | LogoCloudItem)[];
  caption?: React.ReactNode;
  className?: string;
}) {
  const normalized = items.map((item) =>
    typeof item === "string" ? { name: item } : item
  );
  return (
    <div className={cn("flex flex-col items-center gap-6", className)}>
      {caption ? (
        <p className="max-w-2xl text-center text-sm text-muted">{caption}</p>
      ) : null}
      <ul className="flex flex-wrap items-center justify-center gap-3">
        {normalized.map((item) => (
          <li
            key={item.name}
            className="inline-flex flex-col items-center justify-center rounded-xl border border-line bg-white px-5 py-3 text-center shadow-sm"
          >
            <span className="text-sm font-semibold tracking-tight text-graphite">
              {item.name}
            </span>
            {item.note ? (
              <span className="mt-0.5 text-[11px] uppercase tracking-wide text-muted">
                {item.note}
              </span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}