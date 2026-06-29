import * as React from "react";
import { PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Placeholder video card. Renders a poster slot + play affordance.
 *
 * When a real video is confirmed, provide `src`/`title`/`duration`. Until then
 * the card renders a clearly-labeled "Video coming soon" placeholder so we do
 * not imply a testimonial or spokesperson video that does not yet exist.
 *
 * Pair real videos with VideoObject JSON-LD on the page that hosts them.
 */
export function VideoCard({
  title,
  description,
  duration,
  posterUrl,
  className,
}: {
  title: string;
  description?: string;
  duration?: string;
  posterUrl?: string;
  className?: string;
}) {
  const hasPoster = Boolean(posterUrl);
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line bg-white",
        className
      )}
    >
      <div
        className={cn(
          "relative flex aspect-video items-center justify-center bg-surface-tint bg-dot-grid",
          hasPoster && "bg-none"
        )}
        style={hasPoster ? { backgroundImage: `url(${posterUrl})` } : undefined}
      >
        <span className="sr-only">Video placeholder</span>
        <span className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-graphite shadow-sm backdrop-blur">
          <PlayCircle className="h-4 w-4 text-brand-teal" aria-hidden="true" />
          {duration ? `${duration} · ` : ""}Video coming soon
        </span>
      </div>
      <div className="border-t border-line-soft p-5">
        <p className="text-sm font-semibold text-graphite">{title}</p>
        {description ? (
          <p className="mt-1 text-sm text-secondary">{description}</p>
        ) : null}
      </div>
    </div>
  );
}