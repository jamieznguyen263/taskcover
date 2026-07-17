"use client";

import { useCallback, useEffect, useId, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { FlowCommand } from "@/lib/work/commands";
import { isCommandMenuShortcut } from "@/lib/work/command-menu-shortcut";

export function CommandMenu({
  commands,
  onSignOut,
}: {
  commands: FlowCommand[];
  onSignOut: () => Promise<void>;
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const titleId = useId();

  const openMenu = useCallback((trigger: HTMLElement | null) => {
    previouslyFocused.current = trigger;
    setActiveIndex(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    previouslyFocused.current?.focus();
  }, []);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (isCommandMenuShortcut(event)) {
        event.preventDefault();
        openMenu(document.activeElement as HTMLElement | null);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openMenu]);

  useEffect(() => {
    if (!open) return;
    const items = dialogRef.current?.querySelectorAll<HTMLButtonElement>("[data-command-item]");
    items?.[activeIndex]?.focus();
  }, [open, activeIndex]);

  const runCommand = useCallback(
    (command: FlowCommand) => {
      if (command.kind === "sign-out") {
        startTransition(() => {
          void onSignOut();
        });
      } else {
        router.push(command.href);
      }
      close();
    },
    [close, onSignOut, router]
  );

  function onDialogKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
      event.preventDefault();
      setActiveIndex((index) => (index + 1) % commands.length);
      return;
    }
    if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + commands.length) % commands.length);
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      runCommand(commands[activeIndex]);
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => openMenu(triggerRef.current)}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span>Command menu</span>
        <kbd className="rounded border border-line-soft bg-surface-soft px-1.5 py-0.5 text-xs text-muted">
          Ctrl K
        </kbd>
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-graphite/40 p-4 pt-24"
          onClick={close}
          data-command-menu-backdrop
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
            onKeyDown={onDialogKeyDown}
            className="w-full max-w-md rounded-xl border border-line bg-white p-2 shadow-xl"
          >
            <p id={titleId} className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted">
              Command menu
            </p>
            <ul role="listbox" aria-label="Commands" className="grid gap-0.5">
              {commands.map((command, index) => (
                <li key={command.id}>
                  <button
                    type="button"
                    data-command-item
                    role="option"
                    aria-selected={index === activeIndex}
                    tabIndex={index === activeIndex ? 0 : -1}
                    onClick={() => runCommand(command)}
                    onFocus={() => setActiveIndex(index)}
                    className={`flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium ${
                      index === activeIndex ? "bg-surface-tint text-brand-teal" : "text-secondary"
                    }`}
                  >
                    {command.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
