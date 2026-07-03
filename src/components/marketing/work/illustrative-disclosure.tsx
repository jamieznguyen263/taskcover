import { ShieldCheck } from "lucide-react";

export function IllustrativeDisclosure({
  label,
  text,
}: {
  label: string;
  text: string;
}) {
  return (
    <aside className="rounded-2xl border border-brand-teal/25 bg-white p-5 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
          <ShieldCheck className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-graphite">{label}</p>
          <p className="mt-1 text-sm leading-relaxed text-secondary">{text}</p>
        </div>
      </div>
    </aside>
  );
}
