export function EmptyState({
  eyebrow,
  title,
  description,
  items,
}: {
  eyebrow: string;
  title: string;
  description: string;
  items?: { label: string; note: string }[];
}) {
  return (
    <section className="rounded-xl border border-line bg-white p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-secondary">{description}</p>
      {items && items.length > 0 ? (
        <dl className="mt-6 grid gap-3 sm:grid-cols-2">
          {items.map((item) => (
            <div key={item.label} className="rounded-lg border border-line-soft bg-surface-soft p-3">
              <dt className="text-sm font-medium text-graphite">{item.label}</dt>
              <dd className="mt-1 text-xs text-muted">{item.note}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </section>
  );
}
