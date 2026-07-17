"use client";

import { useState } from "react";
import { DetailDrawer } from "./detail-drawer";

/**
 * Safe local preview of the detail-drawer primitive for FLOW-001 (spec §15.6) — no Work
 * record is loaded; real usage arrives with FLOW-006.
 */
export function DetailDrawerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <section className="rounded-xl border border-line bg-white p-4">
      <h2 className="text-sm font-semibold text-graphite">Detail drawer primitive</h2>
      <p className="mt-1 text-sm text-secondary">
        Future Work, Project, and Client screens will open records in this right-side drawer
        without losing your place in the list behind it. Preview the primitive below — it
        isn&apos;t wired to any data yet.
      </p>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-3 inline-flex min-h-10 items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal"
      >
        Preview detail drawer
      </button>
      <DetailDrawer
        open={open}
        onClose={() => setOpen(false)}
        title="Detail drawer preview"
        description="Static local preview — no Work record is loaded."
      >
        <p className="text-sm text-secondary">
          This panel demonstrates the reusable drawer primitive: keyboard close (Escape),
          focus management, and no layout overflow. Real Work details will render here once
          FLOW-006 introduces Work items.
        </p>
      </DetailDrawer>
    </section>
  );
}
