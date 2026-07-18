import { NotificationRepository } from "@/lib/work/notification-repository";
import type { WorkSession } from "@/lib/work/session";
import { WorkHeader } from "./work-header";
import { WorkSidebar } from "./work-sidebar";

export async function WorkShell({ session, children }: { session: WorkSession; children: React.ReactNode }) {
  const inboxUnread = await new NotificationRepository().unreadCount(session.userId);
  return (
    <div data-flow-root className="min-h-screen bg-surface-soft text-graphite">
      <div className="grid min-h-screen lg:grid-cols-[16rem_1fr]">
        <WorkSidebar
          navContext={{ accessLevel: session.accessLevel, legacyRole: session.legacyRole }}
          inboxUnread={inboxUnread}
        />
        <div className="min-w-0">
          <WorkHeader session={session} inboxUnread={inboxUnread} />
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function WorkAccessDisabled() {
  return (
    <div data-flow-root className="min-h-screen overflow-x-hidden bg-surface-soft p-4 sm:p-6">
      <div
        className="mx-auto mt-20 w-full max-w-2xl min-w-0 overflow-hidden rounded-xl border border-line bg-white p-5 sm:p-6"
        style={{ width: "calc(100vw - 2rem)", maxWidth: "42rem" }}
      >
        <p className="break-words text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
          Access disabled
        </p>
        <h1 className="mt-3 break-words text-xl font-semibold tracking-tight text-graphite sm:text-2xl">
          Your Taskcover Flow access is disabled
        </h1>
        <p className="mt-3 text-sm leading-6 text-secondary">
          Your account is signed in, but its Taskcover Flow membership has been disabled by an
          administrator. Contact an Owner or Admin if you believe this is a mistake.
        </p>
      </div>
    </div>
  );
}

export function WorkUnavailable() {
  return (
    <div data-flow-root className="min-h-screen overflow-x-hidden bg-surface-soft p-4 sm:p-6">
      <div
        className="mx-auto mt-20 w-full max-w-2xl min-w-0 overflow-hidden rounded-xl border border-line bg-white p-5 sm:p-6"
        style={{ width: "calc(100vw - 2rem)", maxWidth: "42rem" }}
      >
        <p className="break-words text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
          Configuration unavailable
        </p>
        <h1 className="mt-3 break-words text-xl font-semibold tracking-tight text-graphite sm:text-2xl">
          Taskcover Flow database is not configured
        </h1>
        <p className="mt-3 text-sm leading-6 text-secondary">
          Set `DATABASE_URL`, run migrations, and sign in with an existing Admin or Editor
          account to use Taskcover Flow. The public site and Content CMS are unaffected.
        </p>
      </div>
    </div>
  );
}
