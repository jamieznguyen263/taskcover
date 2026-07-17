import Link from "next/link";
import type { FlowNavItem } from "@/lib/work/nav";

/**
 * Shared nav rendering for the desktop sidebar (work-sidebar.tsx) and the mobile overlay
 * (mobile-nav.tsx) so the two never drift. onNavigate lets the mobile overlay close itself
 * after a link is followed; the desktop sidebar has no need for it.
 */
export function FlowNavList({
  items,
  ariaLabel,
  onNavigate,
}: {
  items: FlowNavItem[];
  ariaLabel: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="grid gap-1 p-3" aria-label={ariaLabel}>
      {items.map((item) =>
        item.enabled ? (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-secondary hover:bg-surface-tint hover:text-brand-teal"
          >
            {item.label}
          </Link>
        ) : (
          <span
            key={item.href}
            aria-disabled="true"
            className="flex min-h-11 items-center justify-between gap-3 rounded-lg px-3 text-sm font-medium text-muted"
          >
            {item.label}
            <span className="rounded-full bg-surface-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted">
              Soon
            </span>
          </span>
        )
      )}
    </nav>
  );
}
