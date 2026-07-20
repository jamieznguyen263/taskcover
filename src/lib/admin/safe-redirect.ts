/**
 * Resolves the post-login destination from an untrusted `next` value.
 *
 * Only same-origin absolute paths are allowed. Anything that could send a user off-site —
 * an absolute URL, a protocol-relative `//evil.com`, or a backslash trick — falls back to
 * the default. This keeps the "return me where I was going" convenience from becoming an
 * open-redirect hole in the login flow.
 */
export function resolveSafeRedirect(next: string | null | undefined, fallback = "/admin"): string {
  if (!next) return fallback;
  const value = next.trim();
  if (!value.startsWith("/")) return fallback; // absolute URLs, "javascript:", etc.
  if (value.startsWith("//")) return fallback; // protocol-relative → off-site
  if (value.includes("\\")) return fallback; // backslash normalisation tricks
  if (value.includes("\n") || value.includes("\r")) return fallback; // header injection
  return value;
}
