"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

// href set once the destination's creation flow exists (FLOW-005 enabled projects).
const QUICK_CREATE_OPTIONS: { id: string; label: string; href?: string }[] = [
  { id: "work", label: "New work" },
  { id: "project", label: "New project", href: "/flow/projects" },
  { id: "document", label: "New document" },
];

export function QuickCreateMenu() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Quick create
      </button>
      {open ? (
        <div
          role="menu"
          aria-label="Quick create"
          className="absolute right-0 z-30 mt-2 w-56 rounded-xl border border-line bg-white p-2 shadow-xl"
        >
          {QUICK_CREATE_OPTIONS.map((option) =>
            option.href ? (
              <Link
                key={option.id}
                role="menuitem"
                href={option.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-medium text-secondary hover:bg-surface-tint hover:text-brand-teal"
              >
                {option.label}
              </Link>
            ) : (
              <div
                key={option.id}
                role="menuitem"
                aria-disabled="true"
                className="flex min-h-11 cursor-not-allowed items-center justify-between rounded-lg px-3 text-sm font-medium text-muted"
              >
                <span>{option.label}</span>
                <span className="text-xs text-muted">Coming in a later slice</span>
              </div>
            )
          )}
        </div>
      ) : null}
    </div>
  );
}
