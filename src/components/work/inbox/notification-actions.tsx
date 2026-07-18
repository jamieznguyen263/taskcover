"use client";

import {
  markNotificationDoneAction,
  markNotificationReadAction,
  snoozeNotificationAction,
} from "@/lib/work/inbox-actions";
import { SNOOZE_PRESETS } from "@/lib/work/notification-domain";

export function NotificationActions({ id, isUnread }: { id: string; isUnread: boolean }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {isUnread ? (
        <form action={markNotificationReadAction}>
          <input type="hidden" name="id" value={id} />
          <button
            type="submit"
            className="rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-secondary hover:text-brand-teal"
          >
            Mark read
          </button>
        </form>
      ) : null}
      <form action={markNotificationDoneAction}>
        <input type="hidden" name="id" value={id} />
        <button
          type="submit"
          className="rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-secondary hover:text-brand-teal"
        >
          Done
        </button>
      </form>
      <details className="relative">
        <summary className="cursor-pointer list-none rounded-lg border border-line bg-white px-2.5 py-1 text-xs font-medium text-secondary hover:text-brand-teal">
          Snooze
        </summary>
        <div className="absolute z-10 mt-1 grid gap-1 rounded-lg border border-line bg-white p-1 shadow-lg">
          {SNOOZE_PRESETS.map((preset) => (
            <form key={preset.id} action={snoozeNotificationAction}>
              <input type="hidden" name="id" value={id} />
              <input type="hidden" name="preset" value={preset.id} />
              <button
                type="submit"
                className="w-full whitespace-nowrap rounded px-2 py-1 text-left text-xs text-secondary hover:bg-surface-tint hover:text-brand-teal"
              >
                {preset.label}
              </button>
            </form>
          ))}
        </div>
      </details>
    </div>
  );
}

export function MarkAllReadButton({ action }: { action: () => Promise<unknown> }) {
  return (
    <form action={action as () => void}>
      <button
        type="submit"
        className="rounded-lg border border-line bg-white px-3 py-1.5 text-sm font-medium text-secondary hover:text-brand-teal"
      >
        Mark all read
      </button>
    </form>
  );
}
