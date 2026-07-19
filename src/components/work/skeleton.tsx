/**
 * Skeleton primitives for Flow route loading states (Next.js loading.tsx). The pulse is
 * softened automatically under prefers-reduced-motion by the global reduced-motion rule.
 */
export function SkeletonBar({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-surface-tint ${className}`} />;
}

export function SkeletonHeader() {
  return (
    <div className="grid gap-2">
      <SkeletonBar className="h-3 w-24" />
      <SkeletonBar className="h-7 w-64" />
      <SkeletonBar className="h-4 w-80" />
    </div>
  );
}

export function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <div className="grid gap-2 rounded-xl border border-line bg-white p-4">
      <SkeletonBar className="h-4 w-1/2" />
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonBar key={index} className="h-3 w-3/4" />
      ))}
    </div>
  );
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div className="grid gap-2">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-lg border border-line-soft bg-white p-3">
          <SkeletonBar className="h-4 flex-1" />
          <SkeletonBar className="h-4 w-16" />
          <SkeletonBar className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function FlowPageSkeleton({ variant = "list" }: { variant?: "list" | "board" | "cards" }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <SkeletonHeader />
      {variant === "board" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="grid gap-2 rounded-xl border border-line-soft bg-surface-soft p-2">
              <SkeletonBar className="h-3 w-20" />
              <SkeletonCard lines={1} />
              <SkeletonCard lines={1} />
            </div>
          ))}
        </div>
      ) : variant === "cards" ? (
        <div className="grid gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <div className="rounded-xl border border-line bg-white p-4">
          <SkeletonList />
        </div>
      )}
    </div>
  );
}
