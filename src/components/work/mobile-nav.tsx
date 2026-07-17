"use client";

import { useId, useState } from "react";
import { Menu } from "lucide-react";
import type { FlowNavItem } from "@/lib/work/nav";
import { DetailDrawer } from "./detail-drawer";
import { FlowNavList } from "./flow-nav-list";

/**
 * Below `lg`, WorkSidebar is hidden and this trigger + overlay is the only way to reach
 * navigation. Reuses the DetailDrawer primitive (left-anchored) instead of a bespoke
 * overlay implementation — Escape, backdrop close, focus trap/return, and body-scroll lock
 * all come from there.
 */
export function MobileNav({ primary, adminNav }: { primary: FlowNavItem[]; adminNav: FlowNavItem[] }) {
  const [open, setOpen] = useState(false);
  const dialogId = useId();
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        aria-label="Open navigation menu"
        onClick={() => setOpen(true)}
        className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-lg border border-line bg-white text-secondary hover:text-brand-teal lg:hidden"
      >
        <Menu className="h-4 w-4" aria-hidden="true" />
      </button>
      <div id={dialogId}>
        <DetailDrawer open={open} onClose={close} title="Taskcover Flow" side="left">
          <FlowNavList items={primary} ariaLabel="Flow" onNavigate={close} />
          {adminNav.length > 0 ? (
            <div className="border-t border-line">
              <p className="px-3 pt-3 text-xs font-semibold uppercase tracking-wide text-muted">Owner &amp; Admin</p>
              <FlowNavList items={adminNav} ariaLabel="Administration" onNavigate={close} />
            </div>
          ) : null}
        </DetailDrawer>
      </div>
    </>
  );
}
