import { LogOut } from "lucide-react";
import { logoutAction } from "@/lib/admin/actions";
import { getFlowAdminNav, getFlowPrimaryNav } from "@/lib/work/nav";
import { getFlowCommands } from "@/lib/work/commands";
import type { WorkAccessLevel } from "@/lib/work/capabilities";
import type { WorkSession } from "@/lib/work/session";
import { CommandMenu } from "./command-menu";
import { MobileNav } from "./mobile-nav";
import { QuickCreateMenu } from "./quick-create-menu";

const ACCESS_LEVEL_LABEL: Record<WorkAccessLevel, string> = {
  owner: "Owner",
  admin: "Admin",
  manager: "Manager",
  member: "Member",
};

export function WorkHeader({ session }: { session: WorkSession }) {
  const navContext = { accessLevel: session.accessLevel, legacyRole: session.legacyRole };
  const commands = getFlowCommands(navContext);
  const primaryNav = getFlowPrimaryNav();
  const adminNav = getFlowAdminNav(navContext);

  return (
    <header className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center justify-between gap-3 border-b border-line bg-white/95 px-5 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <MobileNav primary={primaryNav} adminNav={adminNav} />
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-teal">Taskcover Flow</p>
          <p className="text-sm text-muted">
            {session.displayName} · {ACCESS_LEVEL_LABEL[session.accessLevel]}
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
