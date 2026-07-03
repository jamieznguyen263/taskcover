import { cn } from "@/lib/utils";

export function WorkStatusBadge({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "verified" | "private" | "sample" | "warning";
}) {
  const tones = {
    default: "border-line bg-white text-secondary",
    verified: "border-brand-teal/25 bg-brand-teal/[0.06] text-brand-teal",
    private: "border-graphite/10 bg-graphite/[0.04] text-graphite",
    sample: "border-brand-green/30 bg-brand-green/[0.08] text-graphite",
    warning: "border-brand-blue/25 bg-brand-blue/[0.06] text-brand-blue",
  } as const;

  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full border px-3 py-1 text-xs font-semibold",
        tones[tone]
      )}
    >
      {label}
    </span>
  );
}
