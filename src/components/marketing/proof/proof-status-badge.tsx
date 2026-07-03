import { CheckCircle2, EyeOff, FileCheck2, LockKeyhole, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

type ProofStatusBadgeProps = {
  label: string;
  tone?: "verified" | "private" | "source" | "permission" | "neutral";
  className?: string;
};

const toneClass = {
  verified: "border-emerald-200 bg-emerald-50 text-emerald-700",
  private: "border-sky-200 bg-sky-50 text-sky-700",
  source: "border-brand-teal/25 bg-surface-tint text-brand-teal",
  permission: "border-brand-blue/20 bg-blue-50 text-brand-blue",
  neutral: "border-line bg-white text-secondary",
};

const iconMap = {
  verified: ShieldCheck,
  private: LockKeyhole,
  source: FileCheck2,
  permission: CheckCircle2,
  neutral: EyeOff,
};

export function ProofStatusBadge({
  label,
  tone = "neutral",
  className,
}: ProofStatusBadgeProps) {
  const Icon = iconMap[tone];
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold",
        toneClass[tone],
        className
      )}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </span>
  );
}
