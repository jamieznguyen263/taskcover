import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { describe, expect, it } from "vitest";
import type { InsightArticle } from "@/content/insights.types";
import { STRUCTURED_BLOCK_NODE } from "./normalization";
import { ContentStateError } from "./content-model";
import { AdminRepository } from "./repository";

loadEnvConfig(process.cwd());
loadIgnoredDatabaseEnv();

/**
 * Staging-only integration coverage for the Phase 1 collaboration layer and
 * for round-tripping every structured section plus a structured editor block
 * through the autosave path. Never runs against production.
 */
describe("Phase 1 collaboration and structured persistence (staging)", () => {
  it("persists assignments, comments with permission rules, and all structured sections", async () => {
    if (process.env.DATABASE_TARGET === "production") throw new Error("Integration test refuses DATABASE_TARGET=production.");
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the staging integration test.");
    const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
    const marker = crypto.randomUUID();
    const editorEmail = `qa-collab-editor-${marker}@example.invalid`;
    const admin1Email = `qa-collab-admin1-${marker}@example.invalid`;
    const admin2Email = `qa-collab-admin2-${marker}@example.invalid`;
    let articleId: string | undefined;
    let editorId: string | undefined;
    let admin1Id: string | undefined;
    let admin2Id: string | undefined;
    try {
      const users = await sql<{ id: string; role: string; email: string }[]>`
        INSERT INTO admin_users (email, normalized_email, display_name, role, status, password_hash)
        VALUES (${editorEmail}, ${editorEmail}, 'QA Collab Editor', 'editor', 'active', 'not-used'),
               (${admin1Email}, ${admin1Email}, 'QA Collab Admin1', 'admin', 'active', 'not-used'),
               (${admin2Email}, ${admin2Email}, 'QA Collab Admin2', 'admin', 'active', 'not-used')
        RETURNING id, role, email
      `;
      editorId = users.find((u) => u.email === editorEmail)!.id;
      admin1Id = users.find((u) => u.email === admin1Email)!.id;
      admin2Id = users.find((u) => u.email === admin2Email)!.id;
      const repo = new AdminRepository();

      const created = await repo.createArticleDraft({ creationKey: marker, sharedSlug: `qa-collab-${marker}`, category: "seo-guides", actorId: editorId, author: "QA Collab Editor" });
      articleId = created.articleId;

      // --- Assignment persistence ---
      const due = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
      await repo.updateAssignment({ articleGroupId: articleId, actorId: admin1Id, ownerId: admin1Id, assigneeId: editorId, reviewerId: admin2Id, dueDate: due, priority: "high" });
      const rawAfterAssign = (await repo.getArticleGroup(articleId))!;
      expect(rawAfterAssign.group.assigneeId).toBe(editorId);
      expect(rawAfterAssign.group.ownerId).toBe(admin1Id);
      expect(rawAfterAssign.group.reviewerId).toBe(admin2Id);
      expect(rawAfterAssign.group.priority).toBe("high");
      expect(rawAfterAssign.group.dueDate).toBeTruthy();

      const summaries = await repo.listArticleSummaries();
      const summary = summaries.find((s) => s.id === articleId)!;
      expect(summary.assigneeId).toBe(editorId);
      expect(summary.priority).toBe("high");

      // --- Comments + permission rules ---
      const editorComment = await repo.createComment({ articleGroupId: articleId, authorId: editorId, kind: "comment", body: "Editor question" });
      const adminChangeReq = await repo.createComment({ articleGroupId: articleId, authorId: admin1Id, kind: "change-request", body: "Please add evidence" });

      let comments = await repo.listComments(articleId);
      expect(comments.length).toBe(2);
      expect(comments.some((c) => c.kind === "change-request" && !c.resolvedAt)).toBe(true);

      const openChangeReq = await repo.listOpenChangeRequestGroupIds();
      expect(openChangeReq.has(articleId)).toBe(true);

      // Editor cannot resolve an admin's comment (only author or admin).
      await expect(repo.resolveComment({ commentId: adminChangeReq.id, actorId: editorId, role: "editor" })).rejects.toBeInstanceOf(ContentStateError);
      // Editor can resolve their own comment.
      await repo.resolveComment({ commentId: editorComment.id, actorId: editorId, role: "editor" });
      // Admin can resolve any comment.
      await repo.resolveComment({ commentId: adminChangeReq.id, actorId: admin1Id, role: "admin" });

      comments = await repo.listComments(articleId);
      expect(comments.every((c) => c.resolvedAt)).toBe(true);
      expect((await repo.listOpenChangeRequestGroupIds()).has(articleId)).toBe(false);

      // --- Structured section + structured block persistence through save/reload ---
      let group = (await repo.getEditableArticleGroup(articleId))!;
      const en = group.localizations.find((l) => l.locale === "en")!;
      const article: InsightArticle = {
        ...en.article,
        searchStrategy: { ...en.article.searchStrategy, focusKeyword: "geo optimization", secondaryKeywords: ["answer engines"], primaryEntity: "Taskcover", supportingEntities: ["hreflang"], excludedEntities: ["legacy tag"] },
        contentEvidence: {
          ...en.article.contentEvidence,
          sources: [{ id: "s1", title: "Independent report", publisher: "Statista", url: "https://example.com/report", accessedAt: "2026-07-10", publishedAt: "2026-01-01", primarySource: false, supportsClaimIds: ["c1"], locale: "global", notes: "paraphrase" }],
          claims: [{ id: "c1", text: "AI assistants influence B2B research", requiresEvidence: true, sourceIds: ["s1"] }],
        },
        metadata: { ...en.article.metadata, metaTitle: "GEO optimization guide", metaDescription: "A practical guide to optimizing for answer engines and AI overviews." },
        localization: { ...en.article.localization, assignedTranslator: "QA Collab Editor", localeKeyword: "geo optimization", sourceLocale: "en" },
      };
      const editorDocument = {
        type: "doc",
        content: [
          { type: "heading", attrs: { level: 2 }, content: [{ type: "text", text: "How does GEO work?" }] },
          { type: STRUCTURED_BLOCK_NODE, attrs: { blockType: "direct-answer", data: { type: "direct-answer", title: "TL;DR", answer: "Structure content for extraction." } } },
          { type: STRUCTURED_BLOCK_NODE, attrs: { blockType: "faq", data: { type: "faq", items: [{ question: "Is GEO real?", answer: "It is an emerging practice." }] } } },
        ],
      };
      await repo.saveArticleDraft({ articleId, locale: "en", expectedVersion: group.lockVersion, editorDocument, article, actorId: editorId });

      // Reload and confirm everything round-tripped.
      group = (await repo.getEditableArticleGroup(articleId))!;
      const reloaded = group.localizations.find((l) => l.locale === "en")!.article;
      expect(reloaded.searchStrategy.focusKeyword).toBe("geo optimization");
      expect(reloaded.searchStrategy.excludedEntities).toContain("legacy tag");
      expect(reloaded.contentEvidence.sources[0]!.publisher).toBe("Statista");
      expect(reloaded.contentEvidence.claims[0]!.sourceIds).toEqual(["s1"]);
      expect(reloaded.metadata.metaTitle).toBe("GEO optimization guide");
      expect(reloaded.localization.assignedTranslator).toBe("QA Collab Editor");
      // Structured blocks normalized into the safe public block model.
      expect(reloaded.blocks.find((b) => b.type === "direct-answer")).toBeTruthy();
      expect(reloaded.blocks.find((b) => b.type === "faq")).toBeTruthy();
      expect(reloaded.blocks.find((b) => b.type === "heading")).toBeTruthy();

      // Activity timeline records the assignment/comment/workflow trail.
      const events = await repo.listWorkflowEvents(articleId);
      expect(events.some((e) => e.toStatus === "draft")).toBe(true);
    } finally {
      if (articleId) {
        await sql`DELETE FROM content_comments WHERE article_group_id = ${articleId}`;
        await sql`DELETE FROM admin_audit_logs WHERE target_id = ${articleId}`;
        await sql`DELETE FROM insight_article_groups WHERE id = ${articleId}`;
      }
      const ids = [editorId, admin1Id, admin2Id].filter(Boolean) as string[];
      if (ids.length) await sql`DELETE FROM admin_users WHERE id IN ${sql(ids)}`;
      await sql.end();
    }
  }, 240_000);
});

function loadIgnoredDatabaseEnv() {
  if (process.env.DATABASE_URL && process.env.DATABASE_TARGET) return;
  const file = path.join(process.cwd(), ".env.local");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*(DATABASE_URL|DATABASE_TARGET)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const value = match[2]!.trim().replace(/^['"]|['"]$/g, "");
    if (!process.env[match[1]!]) process.env[match[1]!] = value;
  }
}
