import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { loadEnvConfig } from "@next/env";
import postgres from "postgres";
import { describe, expect, it } from "vitest";
import { insights as en } from "@/content/en/insights";
import { insights as fr } from "@/content/fr/insights";
import { insights as es } from "@/content/es/insights";
import type { InsightArticle } from "@/content/insights.types";
import { createStarterTiptapDocument } from "./normalization";
import { ContentConflictError } from "./content-model";
import { AdminRepository } from "./repository";

loadEnvConfig(process.cwd());
loadIgnoredDatabaseEnv();

describe("Admin Content OS staging database", () => {
  it("persists, locks, reviews, publishes, revisions, archives, and restores atomically", async () => {
    if (process.env.DATABASE_TARGET === "production") throw new Error("Integration test refuses DATABASE_TARGET=production.");
    if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required for the staging integration test.");
    const sql = postgres(process.env.DATABASE_URL, { max: 1, prepare: false });
    const marker = crypto.randomUUID();
    const editorEmail = `qa-editor-${marker}@example.invalid`;
    const adminEmail = `qa-admin-${marker}@example.invalid`;
    let articleId: string | undefined;
    let editorId: string | undefined;
    let adminId: string | undefined;
    try {
      const users = await sql<{ id: string; role: "admin" | "editor" }[]>`
        INSERT INTO admin_users (email, normalized_email, display_name, role, status, password_hash)
        VALUES (${editorEmail}, ${editorEmail}, 'QA Editor', 'editor', 'active', '$argon2id$v=19$m=19456,t=2,p=1$placeholder$placeholder'),
               (${adminEmail}, ${adminEmail}, 'QA Admin', 'admin', 'active', '$argon2id$v=19$m=19456,t=2,p=1$placeholder$placeholder')
        RETURNING id, role
      `;
      editorId = users.find((user) => user.role === "editor")!.id;
      adminId = users.find((user) => user.role === "admin")!.id;
      const repo = new AdminRepository();
      const created = await repo.createArticleDraft({ creationKey: marker, sharedSlug: `qa-${marker}`, category: "seo-guides", actorId: editorId, author: "QA Editor" });
      articleId = created.articleId;
      expect((await repo.createArticleDraft({ creationKey: marker, sharedSlug: `qa-${marker}`, category: "seo-guides", actorId: editorId, author: "QA Editor" })).articleId).toBe(articleId);

      const source = { en: en.articles[0], fr: fr.articles[0], es: es.articles[0] } as const;
      let group = (await repo.getEditableArticleGroup(articleId))!;
      const staleVersion = group.lockVersion;
      for (const localization of group.localizations) {
        const template = source[localization.locale] as InsightArticle;
        const article = { ...template, id: articleId, translationGroupId: localization.article.translationGroupId, status: "draft" as const, slug: `qa-${localization.locale}-${marker}`, schema: { ...template.schema, faqItems: [] }, updatedAt: new Date().toISOString() };
        const saved = await repo.saveArticleDraft({ articleId, locale: localization.locale, expectedVersion: group.lockVersion, editorDocument: createStarterTiptapDocument(article.h1), article, actorId: editorId });
        group = (await repo.getEditableArticleGroup(articleId))!;
        expect(group.lockVersion).toBe(saved.lockVersion);
      }
      await expect(repo.saveArticleDraft({ articleId, locale: "en", expectedVersion: staleVersion, editorDocument: group.localizations[0]!.editorDocument, article: group.localizations[0]!.article, actorId: editorId })).rejects.toBeInstanceOf(ContentConflictError);

      let changed = await repo.transitionArticle({ articleId, expectedVersion: group.lockVersion, to: "in-review", actorId: editorId, role: "editor" });
      await expect(repo.transitionArticle({ articleId, expectedVersion: changed.lockVersion, to: "approved", actorId: editorId, role: "editor" })).rejects.toThrow(/Forbidden/);
      changed = await repo.transitionArticle({ articleId, expectedVersion: changed.lockVersion, to: "draft", actorId: adminId, role: "admin", note: "Please revise." });
      changed = await repo.transitionArticle({ articleId, expectedVersion: changed.lockVersion, to: "in-review", actorId: editorId, role: "editor" });
      changed = await repo.transitionArticle({ articleId, expectedVersion: changed.lockVersion, to: "approved", actorId: adminId, role: "admin" });
      changed = await repo.transitionArticle({ articleId, expectedVersion: changed.lockVersion, to: "published", actorId: adminId, role: "admin" });
      const firstPublic = (await repo.listPublishedSnapshots("en")).find((article) => article.id === articleId)!;
      expect(firstPublic).toBeTruthy();

      changed = await repo.transitionArticle({ articleId, expectedVersion: changed.lockVersion, to: "draft", actorId: editorId, role: "editor" });
      group = (await repo.getEditableArticleGroup(articleId))!;
      const enDraft = group.localizations.find((item) => item.locale === "en")!;
      const revised = { ...enDraft.article, h1: `${enDraft.article.h1} Revised` };
      changed = { ...changed, ...(await repo.saveArticleDraft({ articleId, locale: "en", expectedVersion: changed.lockVersion, editorDocument: createStarterTiptapDocument(revised.h1), article: revised, actorId: editorId })) } as typeof changed;
      expect((await repo.listPublishedSnapshots("en")).find((article) => article.id === articleId)!.h1).toBe(firstPublic.h1);
      changed = await repo.transitionArticle({ articleId, expectedVersion: changed.lockVersion, to: "in-review", actorId: editorId, role: "editor" });
      changed = await repo.transitionArticle({ articleId, expectedVersion: changed.lockVersion, to: "approved", actorId: adminId, role: "admin" });
      changed = await repo.transitionArticle({ articleId, expectedVersion: changed.lockVersion, to: "published", actorId: adminId, role: "admin" });
      expect((await repo.listPublishedSnapshots("en")).find((article) => article.id === articleId)!.h1).toContain("Revised");
      changed = await repo.transitionArticle({ articleId, expectedVersion: changed.lockVersion, to: "archived", actorId: adminId, role: "admin" });
      expect((await repo.listPublishedSnapshots("en")).some((article) => article.id === articleId)).toBe(false);
      const raw = (await repo.getArticleGroup(articleId))!;
      const revisionId = raw.revisions[0]!.id;
      const restored = await repo.restorePublishedRevision({ articleId, revisionId, expectedVersion: changed.lockVersion, actorId: adminId, role: "admin" });
      expect(restored.status).toBe("draft");
      expect((await repo.listPublishedSnapshots("en")).some((article) => article.id === articleId)).toBe(false);
    } finally {
      if (articleId) {
        await sql`DELETE FROM admin_audit_logs WHERE target_id = ${articleId}`;
        await sql`DELETE FROM insight_article_groups WHERE id = ${articleId}`;
      }
      if (editorId || adminId) await sql`DELETE FROM admin_users WHERE id IN ${sql([editorId, adminId].filter(Boolean) as string[])}`;
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
