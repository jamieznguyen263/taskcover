import { describe, expect, it } from "vitest";
import type postgres from "postgres";
import type { InsightArticle, InsightBlock } from "../src/content/insights.types";
import {
  classifyArticle,
  compareQaResults,
  parseArgs,
  resolveActor,
  resolveWriteAuthorization,
  verifyIdentityUnchanged,
} from "./insights-remediate-core56";
import { transformEditorDocument } from "../src/lib/admin/core56-hygiene";

function baseArticle(overrides: Partial<InsightArticle> = {}): InsightArticle {
  return {
    id: "core56-tc-999",
    slug: "test-article",
    translationGroupId: "group-999",
    locale: "en",
    internalTitle: "Test article",
    h1: "Test article",
    excerpt: "Excerpt.",
    category: "seo-guides",
    tags: [],
    author: "Taskcover Editorial",
    status: "published",
    publishedAt: "2026-07-11T00:00:00.000Z",
    updatedAt: "2026-07-11T00:00:00.000Z",
    lastFactCheckedAt: "2026-07-11T00:00:00.000Z",
    readingTime: 5,
    coverImage: "/images/cover.jpg",
    coverImageAlt: "Cover",
    coverImageCaption: "",
    blocks: [],
    searchStrategy: {
      focusKeyword: "test keyword",
      secondaryKeywords: [],
      primaryIntent: "informational",
      secondaryIntents: [],
      targetAudience: "SEO managers",
      funnelStage: "awareness",
      coreQuestion: "What is the test?",
      primaryEntity: "Test",
      supportingEntities: [],
      topicCluster: "Testing",
      parentPillar: "Testing",
      targetMarkets: [],
      serpObservations: [],
      featuredSnippetOpportunity: "",
      aiCitationOpportunity: "",
      uniqueInformationGain: "",
      refreshTrigger: "",
    },
    contentEvidence: {
      sources: [],
      claims: [],
      factCheckStatus: "needs-review",
      originalInsights: [],
      caseStudyReferences: [],
      complianceNotes: [],
    },
    internalLinking: {
      requiredInternalLinks: [],
      suggestedInternalLinks: [],
      serviceLinks: [],
      industryLinks: [],
      marketLinks: [],
      caseStudyLinks: [],
      sampleAuditLinks: [],
      relatedArticleSlugs: [],
      recommendedAnchors: [],
    },
    metadata: {
      metaTitle: "Test article meta title",
      metaDescription: "Test article meta description.",
      canonical: "/insights/seo-guides/test-article",
      robots: "index,follow",
      ogTitle: "Test article",
      ogDescription: "Test article.",
      ogImage: "/images/cover.jpg",
      twitterTitle: "Test article",
      twitterDescription: "Test article.",
      twitterImage: "/images/cover.jpg",
      breadcrumbLabel: "Test article",
    },
    schema: { schemaType: "Article", faqItems: [], aboutEntities: [], mentions: [], citationReferences: [] },
    localization: { hreflangGroup: "group-999", xDefaultSlug: "test-article", translationStatus: "complete", translationNotes: "" },
    publishQa: { summary: "", checkedAt: "" },
    ...overrides,
  };
}

function fakeSql(rows: unknown[]): postgres.Sql {
  const tag = (async () => rows) as unknown as postgres.Sql;
  return tag;
}

describe("parseArgs", () => {
  it("defaults to dry-run with no flags", () => {
    expect(parseArgs([])).toEqual({ write: false });
  });

  it("parses every flag", () => {
    expect(
      parseArgs([
        "--write",
        "--target=staging",
        "--actor-email=editor@taskcover.com",
        "--confirm-staging-identity=staging-example-host.example.neon.tech",
        "--ids=tc-001,tc-002",
        "--limit=5",
      ])
    ).toEqual({
      write: true,
      target: "staging",
      actorEmail: "editor@taskcover.com",
      confirmStagingIdentity: "staging-example-host.example.neon.tech",
      ids: ["TC-001", "TC-002"],
      limit: 5,
    });
  });

  it("a later --dry-run overrides an earlier --write", () => {
    expect(parseArgs(["--write", "--dry-run"]).write).toBe(false);
  });
});

describe("resolveWriteAuthorization — exact-match-only environment gates", () => {
  const base = {
    databaseTargetEnv: "staging",
    requestedWrite: true,
    target: "staging",
    confirmStagingIdentity: "staging-example-host.example.neon.tech",
    resolvedHost: "staging-example-host.example.neon.tech",
    knownProductionIdentity: "prod-example-host.example.neon.tech" as string | undefined,
    source: "database" as const,
  };

  it("refuses in dry-run (no --write requested)", () => {
    const result = resolveWriteAuthorization({ ...base, requestedWrite: false });
    expect(result.authorized).toBe(false);
  });

  it("write mode is impossible with --source=fixture regardless of every other gate agreeing", () => {
    const result = resolveWriteAuthorization({ ...base, source: "fixture" });
    expect(result.authorized).toBe(false);
    if (!result.authorized) expect(result.resolvedFingerprint).toBeNull();
  });

  it("refuses production outright", () => {
    const result = resolveWriteAuthorization({ ...base, databaseTargetEnv: "production", target: "production" });
    expect(result.authorized).toBe(false);
    if (!result.authorized) expect(result.reason).toMatch(/production/i);
  });

  it("refuses when DATABASE_TARGET and --target disagree", () => {
    const result = resolveWriteAuthorization({ ...base, databaseTargetEnv: "development" });
    expect(result.authorized).toBe(false);
  });

  it("refuses a SUBSTRING match — the confirm value must equal the resolved host or fingerprint exactly", () => {
    const result = resolveWriteAuthorization({ ...base, confirmStagingIdentity: "staging-example-host" });
    expect(result.authorized).toBe(false);
    if (!result.authorized) expect(result.reason).toMatch(/exactly/i);
  });

  // Task 1 — CORE56_PRODUCTION_HOST_FINGERPRINT is now mandatory for --write.
  it("refuses --write when CORE56_PRODUCTION_HOST_FINGERPRINT (knownProductionIdentity) is missing entirely", () => {
    const result = resolveWriteAuthorization({ ...base, knownProductionIdentity: undefined });
    expect(result.authorized).toBe(false);
    if (!result.authorized) expect(result.reason).toMatch(/CORE56_PRODUCTION_HOST_FINGERPRINT/);
  });

  it("dry-run still works without CORE56_PRODUCTION_HOST_FINGERPRINT set", () => {
    const result = resolveWriteAuthorization({ ...base, requestedWrite: false, knownProductionIdentity: undefined });
    expect(result.authorized).toBe(false); // refused because it's a dry-run, not because the fingerprint is missing
    if (!result.authorized) expect(result.reason).toMatch(/dry-run/i);
  });

  it("refuses when the resolved identity exactly equals the configured production fingerprint, even if every other gate says staging", () => {
    const result = resolveWriteAuthorization({ ...base, knownProductionIdentity: "staging-example-host.example.neon.tech" });
    expect(result.authorized).toBe(false);
    if (!result.authorized) expect(result.reason).toMatch(/production/i);
  });

  it("authorizes with a valid, distinct staging fingerprint when every gate (including the production fingerprint check) agrees", () => {
    const result = resolveWriteAuthorization(base);
    expect(result.authorized).toBe(true);
  });

  it("also accepts an exact sha256 fingerprint of the resolved host (not just the raw hostname)", () => {
    const first = resolveWriteAuthorization(base);
    expect(first.authorized).toBe(true);
    const second = resolveWriteAuthorization({ ...base, confirmStagingIdentity: first.authorized ? first.resolvedFingerprint : "" });
    expect(second.authorized).toBe(true);
  });
});

describe("resolveActor — Task 4 accountable actor requirement", () => {
  it("refuses when no --actor-email was supplied", async () => {
    const result = await resolveActor(fakeSql([]), undefined);
    expect(result.ok).toBe(false);
  });

  it("refuses when no matching admin_users account exists", async () => {
    const result = await resolveActor(fakeSql([]), "nobody@taskcover.com");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/no admin_users account/i);
  });

  it("refuses a disabled/invited (non-active) account", async () => {
    const result = await resolveActor(fakeSql([{ id: "user-1", role: "editor", status: "disabled" }]), "editor@taskcover.com");
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/not active/i);
  });

  it("resolves an active editor (article:edit is an editor permission)", async () => {
    const result = await resolveActor(fakeSql([{ id: "user-1", role: "editor", status: "active" }]), "editor@taskcover.com");
    expect(result).toEqual({ ok: true, actorId: "user-1", role: "editor" });
  });
});

describe("classifyArticle — Task 3/6 workflow-aware status model", () => {
  const cleanArticle = baseArticle({ blocks: [{ type: "paragraph", text: "Nothing to fix." }] });

  it("missing when there is no article data", () => {
    expect(classifyArticle("TC-010", null, null, null).status).toBe("missing");
  });

  it("hard-stop for TC-027/028/056 regardless of workflow status or content", () => {
    expect(classifyArticle("TC-027", "draft", cleanArticle, null).status).toBe("hard-stop");
    expect(classifyArticle("TC-056", "published", cleanArticle, null).status).toBe("hard-stop");
  });

  it("hard-stop for archived articles", () => {
    expect(classifyArticle("TC-010", "archived", cleanArticle, null).status).toBe("hard-stop");
  });

  it("requires-reopen for published/in-review/approved/scheduled (never raw-updated)", () => {
    for (const status of ["published", "in-review", "approved", "scheduled"] as const) {
      const plan = classifyArticle("TC-010", status, cleanArticle, null);
      expect(plan.status).toBe("requires-reopen");
    }
  });

  it("invalid when draft but no editorDocument transform result is available", () => {
    expect(classifyArticle("TC-010", "draft", cleanArticle, null).status).toBe("invalid");
  });

  it("manual-review when the editorDocument/block correspondence can't be trusted", () => {
    const plan = classifyArticle("TC-010", "draft", cleanArticle, { ok: false, reason: "node/block count mismatch" });
    expect(plan.status).toBe("manual-review");
  });

  it("no-change for a draft article with nothing to fix", () => {
    const transformed = transformEditorDocument({ type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "Nothing to fix." }] }] });
    expect(transformed.ok).toBe(true);
    if (!transformed.ok) return;
    const plan = classifyArticle("TC-010", "draft", cleanArticle, { ok: true, diff: transformed.diff });
    expect(plan.status).toBe("no-change");
  });

  it("auto-fix-safe for a draft article whose only defects are unambiguous", () => {
    const document = {
      type: "doc",
      content: [
        { type: "structuredBlock", attrs: { blockType: "direct-answer", data: { type: "direct-answer", title: "Q", answer: "Answer text." } } },
        { type: "paragraph", content: [{ type: "text", text: "Answer text." }] },
      ],
    };
    const transformed = transformEditorDocument(document);
    expect(transformed.ok).toBe(true);
    if (!transformed.ok) return;
    const plan = classifyArticle("TC-010", "draft", cleanArticle, { ok: true, diff: transformed.diff });
    expect(plan.status).toBe("auto-fix-safe");
  });

  it("auto-fix-with-manual-follow-up when safe fixes apply AND an ambiguous item remains", () => {
    const document = {
      type: "doc",
      content: [
        { type: "structuredBlock", attrs: { blockType: "direct-answer", data: { type: "direct-answer", title: "Q", answer: "Answer text." } } },
        { type: "paragraph", content: [{ type: "text", text: "Answer text." }] },
        { type: "paragraph", content: [{ type: "text", text: "| A | B |\n| --- | --- |\n| 1 | 2 | 3 |" }] },
      ],
    };
    const transformed = transformEditorDocument(document);
    expect(transformed.ok).toBe(true);
    if (!transformed.ok) return;
    const plan = classifyArticle("TC-010", "draft", cleanArticle, { ok: true, diff: transformed.diff });
    expect(plan.status).toBe("auto-fix-with-manual-follow-up");
  });

  it("manual-review when nothing is safely auto-fixable but an ambiguous item exists", () => {
    const document = { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "| A | B |\n| --- | --- |\n| 1 | 2 | 3 |" }] }] };
    const transformed = transformEditorDocument(document);
    expect(transformed.ok).toBe(true);
    if (!transformed.ok) return;
    const plan = classifyArticle("TC-010", "draft", cleanArticle, { ok: true, diff: transformed.diff });
    expect(plan.status).toBe("manual-review");
  });
});

describe("compareQaResults — Task 10 QA before/after gate", () => {
  it("is safe to apply when no new error codes are introduced (pre-existing errors/warnings persist unchanged)", () => {
    const before = [{ severity: "error" as const, code: "missing-translation", message: "x" }, { severity: "warning" as const, code: "no-internal-links", message: "x" }];
    const after = [{ severity: "error" as const, code: "missing-translation", message: "x" }, { severity: "warning" as const, code: "no-internal-links", message: "x" }];
    const result = compareQaResults(before, after);
    expect(result.safeToApply).toBe(true);
    expect(result.newErrorCodes).toEqual([]);
    expect(result.existingWarningCodes).toEqual(["no-internal-links"]);
  });

  it("aborts when the transform introduces a new error code", () => {
    const before = [{ severity: "warning" as const, code: "no-internal-links", message: "x" }];
    const after = [{ severity: "error" as const, code: "empty-blocks", message: "x" }];
    const result = compareQaResults(before, after);
    expect(result.safeToApply).toBe(false);
    expect(result.newErrorCodes).toEqual(["empty-blocks"]);
  });

  it("tracks a newly introduced warning separately from pre-existing ones", () => {
    const before: never[] = [];
    const after = [{ severity: "warning" as const, code: "geo-direct-answer", message: "x" }];
    const result = compareQaResults(before, after);
    expect(result.introducedWarningCodes).toEqual(["geo-direct-answer"]);
    expect(result.existingWarningCodes).toEqual([]);
  });
});

describe("verifyIdentityUnchanged — Task 10 identity/metadata/evidence guard", () => {
  it("passes when only blocks/updatedAt differ", () => {
    const before = baseArticle({ blocks: [{ type: "paragraph", text: "Before." }] });
    const after = { ...before, blocks: [{ type: "paragraph", text: "After." }] as InsightBlock[], updatedAt: "2026-07-12T00:00:00.000Z" };
    expect(verifyIdentityUnchanged(before, after)).toEqual({ ok: true, changedFields: [] });
  });

  it("fails when slug or metadata unexpectedly changed", () => {
    const before = baseArticle();
    const after = { ...before, slug: "different-slug" };
    const result = verifyIdentityUnchanged(before, after);
    expect(result.ok).toBe(false);
    expect(result.changedFields).toContain("slug");
  });

  it("fails when factCheckStatus (inside contentEvidence) unexpectedly changed", () => {
    const before = baseArticle();
    const after = { ...before, contentEvidence: { ...before.contentEvidence, factCheckStatus: "checked" as const } };
    const result = verifyIdentityUnchanged(before, after);
    expect(result.ok).toBe(false);
    expect(result.changedFields).toContain("contentEvidence");
  });

  it("Task 2 — passes when every allowed derived field (blocks, updatedAt, readingTime, publishQa) changes together and nothing else does", () => {
    const before = baseArticle({ blocks: [{ type: "paragraph", text: "Before." }], readingTime: 5, publishQa: { summary: "old", checkedAt: "2026-01-01T00:00:00.000Z" } });
    const after = {
      ...before,
      blocks: [{ type: "paragraph", text: "After." }] as InsightBlock[],
      updatedAt: "2026-07-12T00:00:00.000Z",
      readingTime: 1,
      publishQa: { summary: "0 blocking errors, 0 warnings, 1 passed checks.", checkedAt: "2026-07-12T00:00:00.000Z" },
    };
    expect(verifyIdentityUnchanged(before, after)).toEqual({ ok: true, changedFields: [] });
  });

  it("Task 2 — fails when any field outside the allowed derived set changes, even alongside a valid readingTime/publishQa update", () => {
    const before = baseArticle({ readingTime: 5, h1: "Original H1" });
    const after = { ...before, readingTime: 1, publishQa: { summary: "new", checkedAt: "2026-07-12T00:00:00.000Z" }, h1: "Unexpectedly changed H1" };
    const result = verifyIdentityUnchanged(before, after);
    expect(result.ok).toBe(false);
    expect(result.changedFields).toEqual(["h1"]);
  });
});
