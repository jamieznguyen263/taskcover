import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/admin/actions";
import { getFlowAdminNav, getFlowPrimaryNav } from "@/lib/work/nav";
import { getFlowCommands } from "@/lib/work/commands";
import type { WorkSession } from "@/lib/work/session";
import { CommandMenu } from "./command-menu";
import { MobileNav } from "./mobile-nav";
import { QuickCreateMenu } from "./quick-create-menu";

const ROLE_LABEL: Record<WorkSession["role"], string> = { admin: "Admin", editor: "Editor" };

export function WorkHeader({ session }: { session: WorkSession }) {
  const commands = getFlowCommands(session.role);
  const primaryNav = getFlowPrimaryNav();
  const adminNav = getFlowAdminNav({ role: session.role });

  return (
    <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-line bg-white/95 px-5 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <MobileNav primary={primaryNav} adminNav={adminNav} />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-teal">Taskcover Flow</p>
          <p className="text-sm text-muted">
            {session.displayName} · {ROLE_LABEL[session.role]}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <QuickCreateMenu />
        <CommandMenu commands={commands} onSignOut={logoutAction} />
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
  );
}
