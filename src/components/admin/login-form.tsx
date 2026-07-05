"use client";

import { useActionState } from "react";
import { loginAction, type LoginState, acceptInviteAction } from "@/lib/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {});
  return (
    <form action={action} className="grid gap-4" noValidate>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-graphite" htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required className="min-h-11 rounded-lg border border-line bg-white px-3 text-sm" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-graphite" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required minLength={12} className="min-h-11 rounded-lg border border-line bg-white px-3 text-sm" />
      </div>
      {state.error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.error}</p> : null}
      <button disabled={pending} className="min-h-11 rounded-lg bg-brand-teal px-4 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}

export function AcceptInviteForm({ token }: { token: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(acceptInviteAction, {});
  return (
    <form action={action} className="grid gap-4" noValidate>
      <input type="hidden" name="token" value={token} />
      <div className="grid gap-2">
        <label className="text-sm font-medium text-graphite" htmlFor="displayName">Display name</label>
        <input id="displayName" name="displayName" autoComplete="name" required className="min-h-11 rounded-lg border border-line bg-white px-3 text-sm" />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium text-graphite" htmlFor="password">Password</label>
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={12} maxLength={256} className="min-h-11 rounded-lg border border-line bg-white px-3 text-sm" />
      </div>
      {state.error ? <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{state.error}</p> : null}
      <button disabled={pending} className="min-h-11 rounded-lg bg-brand-teal px-4 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Creating account" : "Accept invitation"}
      </button>
    </form>
  );
}
