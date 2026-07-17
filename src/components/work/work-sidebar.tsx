import Link from "next/link";
import { getFlowAdminNav, getFlowPrimaryNav, type FlowNavItem } from "@/lib/work/nav";

function NavList({ items, ariaLabel }: { items: FlowNavItem[]; ariaLabel: string }) {
  return (
    <nav className="grid gap-1 p-3" aria-label={ariaLabel}>
      {items.map((item) =>
        item.enabled ? (
          <Link
            key={item.href}
            href={item.href}
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

export function WorkSidebar({ role }: { role: "admin" | "editor" }) {
  const primary = getFlowPrimaryNav();
  const adminNav = getFlowAdminNav({ role });

  return (
    <aside className="border-r border-line bg-white">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Link href="/flow" className="text-sm font-semibold tracking-tight text-graphite">
          Taskcover Flow
        </Link>
      </div>
      <NavList items={primary} ariaLabel="Flow" />
      {adminNav.length > 0 ? (
        <div className="border-t border-line">
          <p className="px-6 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">Owner &amp; Admin</p>
          <NavList items={adminNav} ariaLabel="Administration" />
        </div>
      ) : null}
    </aside>
  );
}
