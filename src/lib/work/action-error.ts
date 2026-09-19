/**
 * Every Flow server action answers the user with a short, friendly message — but the original
 * failure used to be discarded by a bare `catch {}`, which left production incidents with no
 * evidence at all (a create could fail and the only trace was "Could not create the project.").
 * This helper keeps the friendly message *and* writes the real cause to the Worker log.
 *
 * Context is deliberately ids-and-flags only: never form values, emails, or tokens, because
 * these lines land in Cloudflare's log stream.
 */
export type ActionErrorContext = Record<string, string | number | boolean | null | undefined>;

export function describeError(error: unknown): string {
  if (error instanceof Error) return `${error.name}: ${error.message}`;
  if (typeof error === "string") return error;
  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}

export function reportActionFailure(action: string, error: unknown, context: ActionErrorContext = {}): void {
  const entries = Object.entries(context).filter(([, value]) => value !== undefined && value !== null);
  const suffix = entries.length > 0 ? ` ${entries.map(([key, value]) => `${key}=${value}`).join(" ")}` : "";
  console.error(`[flow-action] ${action} failed — ${describeError(error)}${suffix}`);
  if (error instanceof Error && error.stack) console.error(error.stack);
}
