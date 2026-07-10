"use client";

import { useActionState } from "react";
import { createArticleAction, type ContentActionState } from "@/lib/admin/content-actions";
import { insightCategorySlugs } from "@/content/insights.types";

export function CreateArticleForm({ creationKey }: { creationKey: string }) {
  const [state, action, pending] = useActionState<ContentActionState, FormData>(createArticleAction, {});
  return (
    <form action={action} className="grid max-w-3xl gap-4 rounded-xl border border-line bg-white p-5">
      <input type="hidden" name="creationKey" value={creationKey} />
      <label className="grid gap-2 text-sm font-medium text-graphite">
        Shared slug
        <input name="sharedSlug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" className="min-h-11 rounded-lg border border-line px-3" />
      </label>
      <label className="grid gap-2 text-sm font-medium text-graphite">
        Category
        <select name="category" className="min-h-11 rounded-lg border border-line px-3">
          {insightCategorySlugs.map((slug) => <option key={slug} value={slug}>{slug}</option>)}
        </select>
      </label>
      {state.error ? <p role="alert" className="text-sm text-red-700">{state.error}</p> : null}
      <button disabled={pending} className="min-h-11 rounded-lg bg-brand-teal px-4 text-sm font-semibold text-white disabled:opacity-60">
        {pending ? "Creating…" : "Create draft group"}
      </button>
    </form>
  );
}
