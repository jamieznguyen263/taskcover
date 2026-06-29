import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Container for mock dashboard / command-center surfaces.
 * White card with a subtle brand-tinted glow and an optional header slot.
 */
export function DashboardCard({
  className,
  title,
  subtitle,
  action,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-line bg-white shadow-[0_1px_0_0_rgba(15,23,42,0.02)] ring-brand-glow",
        className
      )}
      {...props}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 border-b border-line-soft px-5 py-4">
          <div className="min-w-0">
            {title ? (
              <p className="truncate text-sm font-semibold text-graphite">
                {title}
              </p>
            ) : null}
            {subtitle ? (
              <p className="mt-0.5 truncate text-xs text-muted">{subtitle}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}