"use client";

import { useCallback, useDeferredValue, useEffect, useId, useMemo, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { FlowCommand } from "@/lib/work/commands";
import { isCommandMenuShortcut } from "@/lib/work/command-menu-shortcut";

type SearchResult = { type: string; id: string; title: string; subtitle: string; href: string };
type PaletteItem = { key: string; label: string; sublabel?: string; onSelect: () => void };

/**
 * Command palette: static navigation commands plus live, permission-aware search across
 * clients / projects / work / documents (via /api/flow/search). Focus stays in the search
 * input; arrow keys move a highlighted option (aria-activedescendant), Enter selects, Escape
 * closes and restores focus. This is the ARIA combobox pattern — correct here because the
 * palette is now a filter-and-select surface, not a static action menu.
 */
export function CommandMenu({ commands, onSignOut }: { commands: FlowCommand[]; onSignOut: () => Promise<void> }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const deferredQuery = useDeferredValue(query);

  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const [, startTransition] = useTransition();
  const titleId = useId();
  const dialogId = useId();
  const listId = useId();

  const openMenu = useCallback((trigger: HTMLElement | null) => {
    previouslyFocused.current = trigger;
    setQuery("");
    setResults([]);
    setActiveIndex(0);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    previouslyFocused.current?.focus();
  }, []);

  // Ctrl/Cmd+K opens from anywhere.
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

  // Lock background scroll and focus the input while open.
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  // Live search (debounced via deferred value + a short timer), aborting stale requests.
  // When the query is too short we simply don't fetch; `items` ignores `results` below 2
  // chars, so stale results never show and there's no need to reset state here.
  useEffect(() => {
    if (!open) return;
    const q = deferredQuery.trim();
    if (q.length < 2) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/flow/search?q=${encodeURIComponent(q)}`, { signal: controller.signal });
        if (!response.ok) return;
        const data = (await response.json()) as { results: SearchResult[] };
        setResults(data.results ?? []);
      } catch {
        /* aborted or offline — leave prior results */
      }
    }, 180);
    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [deferredQuery, open]);

  const runCommand = useCallback(
    (command: FlowCommand) => {
      if (command.kind === "sign-out") startTransition(() => void onSignOut());
      else router.push(command.href);
      close();
    },
    [close, onSignOut, router]
  );

  const items = useMemo<PaletteItem[]>(() => {
    const q = query.trim().toLowerCase();
    const searchItems: PaletteItem[] =
      q.length >= 2
        ? results.map((result) => ({
            key: `s-${result.type}-${result.id}`,
            label: result.title,
            sublabel: result.subtitle,
            onSelect: () => {
              router.push(result.href);
              close();
            },
          }))
        : [];
    const commandItems: PaletteItem[] = commands
      .filter((command) => !q || command.label.toLowerCase().includes(q))
      .map((command) => ({
        key: `c-${command.id}`,
        label: command.label,
        sublabel: command.kind === "sign-out" ? undefined : "Go to",
        onSelect: () => runCommand(command),
      }));
    return [...searchItems, ...commandItems];
  }, [query, results, commands, router, close, runCommand]);

  // Derive the in-range active index at render time instead of syncing state in an effect —
  // the list length changes as search results arrive, and clamping here avoids a stale index.
  const safeActiveIndex = activeIndex < items.length ? activeIndex : 0;

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (items.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((safeActiveIndex + 1) % items.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((safeActiveIndex - 1 + items.length) % items.length);
    } else if (event.key === "Enter") {
      event.preventDefault();
      items[safeActiveIndex]?.onSelect();
    }
  }

  const activeOptionId = items[safeActiveIndex] ? `${listId}-${safeActiveIndex}` : undefined;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={dialogId}
        onClick={() => openMenu(triggerRef.current)}
        className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal"
      >
        <Search className="h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden rounded border border-line-soft bg-surface-soft px-1.5 py-0.5 text-xs text-muted sm:inline">
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
            id={dialogId}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-lg overflow-hidden rounded-xl border border-line bg-white shadow-xl"
          >
            <p id={titleId} className="sr-only">
              Command palette
            </p>
            <div className="flex items-center gap-2 border-b border-line px-3">
              <Search className="h-4 w-4 text-muted" aria-hidden="true" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={onInputKeyDown}
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={activeOptionId}
                aria-autocomplete="list"
                aria-label="Search clients, projects, work, and documents"
                placeholder="Search or jump to…"
                className="min-h-12 flex-1 bg-transparent text-sm text-graphite outline-none"
              />
            </div>
            <ul id={listId} role="listbox" aria-label="Results" className="max-h-80 overflow-y-auto p-1.5">
              {items.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted">
                  {query.trim().length >= 2 ? "No matches." : "Type to search, or pick a command below."}
                </li>
              ) : (
                items.map((item, index) => (
                  <li key={item.key}>
                    <button
                      type="button"
                      id={`${listId}-${index}`}
                      role="option"
                      aria-selected={index === safeActiveIndex}
                      data-command-item
                      tabIndex={-1}
                      onClick={item.onSelect}
                      onMouseMove={() => setActiveIndex(index)}
                      className={`flex min-h-11 w-full items-center justify-between gap-3 rounded-lg px-3 text-left text-sm font-medium ${
                        index === safeActiveIndex ? "bg-surface-tint text-brand-teal" : "text-secondary"
                      }`}
                    >
                      <span className="truncate">{item.label}</span>
                      {item.sublabel ? <span className="shrink-0 text-xs text-muted">{item.sublabel}</span> : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
