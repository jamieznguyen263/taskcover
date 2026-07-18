import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkAllReadButton, NotificationActions } from "@/components/work/inbox/notification-actions";
import { markAllReadAction } from "@/lib/work/inbox-actions";
import {
  countsAsUnread,
  NOTIFICATION_GROUP,
  NOTIFICATION_KIND_LABEL,
} from "@/lib/work/notification-domain";
import { NotificationRepository, type NotificationRow } from "@/lib/work/notification-repository";
import { resolveWorkSession } from "@/lib/work/session";

export default async function FlowInboxPage() {
  const resolution = await resolveWorkSession();
  // Both internal and external sessions have an Inbox; only fully-blocked users are stopped
  // (the layout already handles those, but re-check deny-by-default).
  const recipientId =
    resolution.kind === "active"
      ? resolution.session.userId
      : resolution.kind === "external"
        ? resolution.session.userId
        : null;
  if (!recipientId) notFound();

  const now = new Date();
  const notifications = await new NotificationRepository().listActive(recipientId, now);

  const actionRequired = notifications.filter((n) => NOTIFICATION_GROUP[n.kind] === "action_required");
  const informational = notifications.filter((n) => NOTIFICATION_GROUP[n.kind] === "informational");
  const unreadCount = notifications.filter((n) =>
    countsAsUnread({ state: n.state, snoozedUntil: n.snoozedUntil, now })
  ).length;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Inbox</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">
            What needs your attention
          </h1>
          <p className="mt-2 text-sm text-secondary">
            {unreadCount > 0 ? `${unreadCount} unread · ` : ""}
            {notifications.length} active
          </p>
        </div>
        {unreadCount > 0 ? <MarkAllReadButton action={markAllReadAction} /> : null}
      </div>

      {notifications.length === 0 ? (
        <section className="rounded-xl border border-line bg-white p-6 text-center">
          <p className="text-sm font-medium text-graphite">You&apos;re all caught up</p>
          <p className="mt-1 text-sm text-muted">
            Assignments and review requests will appear here as work is assigned to you.
          </p>
        </section>
      ) : (
        <>
          <InboxGroup title="Action required" rows={actionRequired} now={now} emptyHidden />
          <InboxGroup title="Updates" rows={informational} now={now} emptyHidden />
        </>
      )}
    </div>
  );
}

function InboxGroup({
  title,
  rows,
  now,
  emptyHidden,
}: {
  title: string;
  rows: NotificationRow[];
  now: Date;
  emptyHidden?: boolean;
}) {
  if (rows.length === 0 && emptyHidden) return null;

  return (
    <section aria-label={title}>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{title}</h2>
      <ul className="grid gap-2">
        {rows.map((row) => {
          const unread = countsAsUnread({ state: row.state, snoozedUntil: row.snoozedUntil, now });
          return (
            <li
              key={row.id}
              className={`rounded-xl border p-4 ${unread ? "border-brand-teal/40 bg-surface-tint" : "border-line bg-white"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-xs text-muted">
                    <span className="rounded-full bg-surface-soft px-2 py-0.5 font-medium text-secondary">
                      {NOTIFICATION_KIND_LABEL[row.kind]}
                    </span>
                    <span>{new Date(row.createdAt).toLocaleString()}</span>
                  </p>
                  <p className="mt-1 text-sm font-medium text-graphite">
                    {row.href ? (
                      <Link href={row.href} className="hover:text-brand-teal">
                        {row.title}
                      </Link>
                    ) : (
                      row.title
                    )}
                  </p>
                  {row.body ? <p className="mt-0.5 text-sm text-secondary">{row.body}</p> : null}
                </div>
                {unread ? <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-teal" aria-label="Unread" /> : null}
              </div>
              <NotificationActions id={row.id} isUnread={unread} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
