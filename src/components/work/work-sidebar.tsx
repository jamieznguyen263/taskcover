import Link from "next/link";
import { getFlowAdminNav, getFlowPrimaryNav, withInboxBadge, type FlowNavContext } from "@/lib/work/nav";
import { FlowNavList } from "./flow-nav-list";

/**
 * Persistent desktop sidebar. Hidden below `lg` — WorkHeader's MobileNav takes over
 * navigation on narrower screens so the main content isn't pushed below a full sidebar.
 */
export function WorkSidebar({ navContext, inboxUnread }: { navContext: FlowNavContext; inboxUnread: number }) {
  const primary = withInboxBadge(getFlowPrimaryNav(), inboxUnread);
  const adminNav = getFlowAdminNav(navContext);

  return (
    <aside className="hidden border-r border-line bg-white lg:block">
      <div className="flex h-16 items-center border-b border-line px-5">
        <Link href="/flow" className="text-sm font-semibold tracking-tight text-graphite">
          Taskcover Flow
        </Link>
      </div>
      <FlowNavList items={primary} ariaLabel="Flow" />
      {adminNav.length > 0 ? (
        <div className="border-t border-line">
          <p className="px-6 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">Owner &amp; Admin</p>
          <FlowNavList items={adminNav} ariaLabel="Administration" />
        </div>
      ) : null}
    </aside>
  );
}
