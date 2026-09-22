/**
 * Sprint S00 — shared Core 56 article-group identity rules.
 *
 * The only thing this module knows about is the creation-key naming
 * convention (`core56-tc-###`) and the invariant that exactly TC-001
 * through TC-056 must exist with no duplicates and no gaps. It intentionally
 * does not depend on the (unmerged, PR #8) batch-authoring pipeline, its
 * manifest/tracker files, or the generated backfill content modules.
 */

const CREATION_KEY_PATTERN = /^core56-tc-(\d{3})$/;
export const CORE56_ARTICLE_COUNT = 56;

export function isCore56CreationKey(creationKey: string | null | undefined): boolean {
  return typeof creationKey === "string" && CREATION_KEY_PATTERN.test(creationKey);
}

/** "core56-tc-007" -> "TC-007". Returns null for anything not matching the strict pattern. */
export function articleIdFromCreationKey(creationKey: string | null | undefined): string | null {
  if (!creationKey) return null;
  const match = CREATION_KEY_PATTERN.exec(creationKey);
  return match ? `TC-${match[1]}` : null;
}

export function creationKeyFromArticleId(articleId: string): string {
  const match = /^TC-(\d{3})$/.exec(articleId);
  if (!match) throw new Error(`Invalid Core 56 article id: ${articleId}`);
  return `core56-tc-${match[1]}`;
}

export function expectedArticleIds(): string[] {
  return Array.from({ length: CORE56_ARTICLE_COUNT }, (_, index) => `TC-${String(index + 1).padStart(3, "0")}`);
}

export type IdentityAssertionResult =
  | { ok: true; articleIds: string[] }
  | { ok: false; reason: string; duplicates: string[]; missing: string[]; unexpected: string[] };

/**
 * Task 2: assert exactly 56 unique English article groups matching
 * TC-001..TC-056, no duplicates, no gaps. Callers must refuse to continue
 * (audit read-only excepted, which may still run but must report the
 * failure) when this returns `ok: false`.
 */
export function assertCore56Identity(creationKeys: string[]): IdentityAssertionResult {
  const articleIds = creationKeys.map(articleIdFromCreationKey).filter((id): id is string => id !== null);
  const unexpected = creationKeys.filter((key) => articleIdFromCreationKey(key) === null);

  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const id of articleIds) {
    if (seen.has(id)) duplicates.add(id);
    seen.add(id);
  }

  const expected = new Set(expectedArticleIds());
  const missing = expectedArticleIds().filter((id) => !seen.has(id));
  const extraIds = [...seen].filter((id) => !expected.has(id));

  const ok = duplicates.size === 0 && missing.length === 0 && extraIds.length === 0 && unexpected.length === 0 && seen.size === CORE56_ARTICLE_COUNT;

  if (ok) {
    return { ok: true, articleIds: expectedArticleIds() };
  }
  return {
    ok: false,
    reason: `Expected exactly ${CORE56_ARTICLE_COUNT} unique article groups TC-001..TC-${String(CORE56_ARTICLE_COUNT).padStart(3, "0")}; found ${seen.size} valid id(s), ${duplicates.size} duplicate(s), ${missing.length} missing, ${extraIds.length} unexpected id(s), ${unexpected.length} key(s) not matching the creation-key pattern.`,
    duplicates: [...duplicates].sort(),
    missing,
    unexpected: [...extraIds, ...unexpected].sort(),
  };
}

/** Sort a list of TC-### ids numerically (TC-002 before TC-010). */
export function sortArticleIdsNumerically(ids: string[]): string[] {
  return [...ids].sort((a, b) => Number(a.slice(3)) - Number(b.slice(3)));
}
