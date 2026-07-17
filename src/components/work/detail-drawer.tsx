"use client";

import { useEffect, useId, useRef } from "react";
import { X } from "lucide-react";

/**
 * Reusable right-side drawer primitive for future Work/Project/Client detail screens.
 * FLOW-001 only demonstrates it (see detail-drawer-demo.tsx) — no records are loaded here.
 */
export function DetailDrawer({
  open,
  onClose,
  title,
  description,
  children,
  side = "right",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  side?: "left" | "right";
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    previouslyFocused.current = document.activeElement as HTMLElement | null;
    closeButtonRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
      previouslyFocused.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const sideClasses =
    side === "left"
      ? "left-0 border-r flow-drawer-panel-left"
      : "right-0 border-l flow-drawer-panel";

  return (
    <div className="fixed inset-0 z-40 overflow-hidden">
      <div className="absolute inset-0 bg-graphite/40" onClick={onClose} aria-hidden="true" data-drawer-backdrop />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        data-drawer-panel
        className={`absolute inset-y-0 flex w-full max-w-md flex-col border-line bg-white shadow-xl ${sideClasses}`}
      >
        <div className="flex items-start justify-between gap-3 border-b border-line p-4">
          <div>
            <h2 id={titleId} className="text-base font-semibold text-graphite">
              {title}
            </h2>
            {description ? <p className="mt-1 text-sm text-secondary">{description}</p> : null}
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line text-secondary hover:text-brand-teal"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
