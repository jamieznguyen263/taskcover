import Link from "next/link";
import { BarChart3, FileText, Image, ListChecks, LogOut, Settings, Shield, Users } from "lucide-react";
import { logoutAction } from "@/lib/admin/actions";
import type { AdminUserSession } from "@/lib/admin/repository";

const nav = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/insights", label: "Insights", icon: FileText },
  { href: "/admin/media", label: "Media", icon: Image },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
  { href: "/admin/audit-log", label: "Audit log", icon: Shield, adminOnly: true },
  { href: "/admin/settings/integrations", label: "Integrations", icon: Settings, adminOnly: true },
  { href: "/admin/settings/publishing", label: "Publishing", icon: ListChecks, adminOnly: true },
];

export function AdminShell({ children, session }: { children: React.ReactNode; session: AdminUserSession }) {
  return (
    <div data-admin-root className="min-h-screen bg-surface-soft text-graphite">
      <div className="grid min-h-screen lg:grid-cols-[16rem_1fr]">
        <aside className="border-r border-line bg-white">
          <div className="flex h-16 items-center border-b border-line px-5">
            <Link href="/admin" className="text-sm font-semibold tracking-tight text-graphite">Taskcover Admin</Link>
          </div>
          <nav className="grid gap-1 p-3" aria-label="Admin">
            {nav.filter((item) => !item.adminOnly || session.role === "admin").map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className="flex min-h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-secondary hover:bg-surface-tint hover:text-brand-teal">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-line bg-white/95 px-5 backdrop-blur">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-teal">Content operating system</p>
              <p className="text-sm text-muted">{session.displayName} · {session.role}</p>
            </div>
            <form action={logoutAction}>
              <button className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal">
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </button>
            </form>
          </header>
          <main className="p-4 sm:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function AdminUnavailable() {
  return (
    <div data-admin-root className="min-h-screen overflow-x-hidden bg-surface-soft p-4 sm:p-6">
      <div
        className="mx-auto mt-20 w-full max-w-2xl min-w-0 overflow-hidden rounded-xl border border-line bg-white p-5 sm:p-6"
        style={{ width: "calc(100vw - 2rem)", maxWidth: "42rem" }}
      >
        <p className="break-words text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Configuration unavailable</p>
        <h1 className="mt-3 break-words text-xl font-semibold tracking-tight text-graphite sm:text-2xl">Admin database is not configured</h1>
        <p className="mt-3 text-sm leading-6 text-secondary">
          Set `DATABASE_URL`, run migrations, create the first Admin, then sign in. The public site continues to use the local Insights provider while database mode is unavailable.
        </p>
      </div>
    </div>
  );
}

export function AdminPageHeader({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string }) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">{eyebrow}</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">{title}</h1>
      {description ? <p className="mt-2 max-w-3xl text-sm leading-6 text-secondary">{description}</p> : null}
    </div>
  );
}
