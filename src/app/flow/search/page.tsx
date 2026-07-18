import Link from "next/link";
import { notFound } from "next/navigation";
import { SearchRepository, type SearchResult } from "@/lib/work/search-repository";
import { resolveWorkSession } from "@/lib/work/session";

const TYPE_LABEL: Record<SearchResult["type"], string> = {
  client: "Clients",
  project: "Projects",
  work: "Work",
  document: "Documents",
};
const TYPE_ORDER: SearchResult["type"][] = ["client", "project", "work", "document"];

export default async function FlowSearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const resolution = await resolveWorkSession();
  // Search is for internal staff; the capability gating inside SearchRepository also protects
  // each result type, so an under-privileged session simply gets fewer sections.
  if (resolution.kind !== "active") notFound();

  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const results = query.length >= 2 ? await new SearchRepository().search({ query, accessLevel: resolution.session.accessLevel }) : [];

  const grouped = TYPE_ORDER.map((type) => ({ type, rows: results.filter((r) => r.type === type) })).filter(
    (group) => group.rows.length > 0
  );

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Search</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">Find anything</h1>
        <p className="mt-2 text-sm text-secondary">
          Permission-aware — you only ever see results you&apos;re allowed to open.
        </p>
      </div>

      <form action="/flow/search" method="get" className="flex gap-2">
        <label className="sr-only" htmlFor="search-q">
          Search query
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Search clients, projects, work, documents…"
          className="min-h-10 flex-1 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
        <button
          type="submit"
          className="inline-flex min-h-10 items-center rounded-lg border border-line bg-white px-4 text-sm font-medium text-secondary hover:text-brand-teal"
        >
          Search
        </button>
      </form>

      {query.length >= 2 ? (
        grouped.length === 0 ? (
          <p className="text-sm text-muted">No matches for “{query}”.</p>
        ) : (
          grouped.map((group) => (
            <section key={group.type} aria-label={TYPE_LABEL[group.type]}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{TYPE_LABEL[group.type]}</h2>
              <ul className="grid gap-1">
                {group.rows.map((row) => (
                  <li key={`${row.type}-${row.id}`}>
                    <Link
                      href={row.href}
                      className="block rounded-lg border border-line-soft bg-surface-soft p-3 text-sm font-medium text-graphite hover:border-brand-teal"
                    >
                      {row.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))
        )
      ) : (
        <p className="text-sm text-muted">Type at least two characters to search.</p>
      )}
    </div>
  );
}
