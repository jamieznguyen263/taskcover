import Link from "next/link";
import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/admin/actions";
import type { FlowCommand } from "@/lib/work/commands";
import { EXTERNAL_KIND_LABEL } from "@/lib/work/external-access";
import { getExternalNav } from "@/lib/work/nav";
import type { ExternalWorkSession } from "@/lib/work/session";
import { CommandMenu } from "./command-menu";
import { FlowNavList } from "./flow-nav-list";
import { MobileNav } from "./mobile-nav";

const EXTERNAL_COMMANDS: FlowCommand[] = [
  { id: "go-home", label: "Go to Home", kind: "navigate", href: "/flow" },
  { id: "sign-out", label: "Sign out", kind: "sign-out" },
];

/**
 * Shell for external collaborators (FLOW-003). Deliberately separate from WorkShell: it
 * renders only the external navigation — never internal destinations, Administration,
 * quick create, or the Content CMS link.
 */
export function ExternalWorkShell({
  session,
  children,
}: {
  session: ExternalWorkSession;
  children: React.ReactNode;
}) {
  const nav = getExternalNav();

  return (
    <div data-flow-root className="min-h-screen bg-surface-soft text-graphite">
      <div className="grid min-h-screen lg:grid-cols-[16rem_1fr]">
        <aside className="hidden border-r border-line bg-white lg:block">
          <div className="flex h-16 items-center border-b border-line px-5">
            <Link href="/flow" className="text-sm font-semibold tracking-tight text-graphite">
              Taskcover Flow
            </Link>
          </div>
          <FlowNavList items={nav} ariaLabel="Flow" />
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-line bg-white/95 px-5 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <MobileNav primary={nav} adminNav={[]} />
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-teal">Taskcover Flow</p>
                <p className="text-sm text-muted">
                  {session.displayName} · {EXTERNAL_KIND_LABEL[session.kind]}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <CommandMenu commands={EXTERNAL_COMMANDS} onSignOut={logoutAction} />
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal"
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  Sign out
                </button>
              </form>
            </div>
          </header>
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function ExternalAccessBlocked({ state }: { state: "not-started" | "expired" | "revoked" | "no-membership" }) {
  const copy: Record<typeof state, { title: string; body: string }> = {
    "not-started": {
      title: "Your access hasn't started yet",
      body: "Your Taskcover Flow access window hasn't opened. Contact your Taskcover point of contact if you believe this is a mistake.",
    },
    expired: {
      title: "Your access has expired",
      body: "Your Taskcover Flow access window has ended. Contact your Taskcover point of contact to have it extended.",
    },
    revoked: {
      title: "Your access has been revoked",
      body: "Your Taskcover Flow access was revoked by an administrator. Contact your Taskcover point of contact with any questions.",
    },
    "no-membership": {
      title: "No active collaboration",
      body: "Your account has no active Taskcover Flow collaboration. Contact your Taskcover point of contact to be invited.",
    },
  };
  const content = copy[state];

  return (
    <div data-flow-root className="min-h-screen overflow-x-hidden bg-surface-soft p-4 sm:p-6">
      <div
        className="mx-auto mt-20 w-full max-w-2xl min-w-0 overflow-hidden rounded-xl border border-line bg-white p-5 sm:p-6"
        style={{ width: "calc(100vw - 2rem)", maxWidth: "42rem" }}
      >
        <p className="break-words text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
          Access unavailable
        </p>
        <h1 className="mt-3 break-words text-xl font-semibold tracking-tight text-graphite sm:text-2xl">
          {content.title}
        </h1>
        <p className="mt-3 text-sm leading-6 text-secondary">{content.body}</p>
        <form action={logoutAction} className="mt-5">
          <button
            type="submit"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}
