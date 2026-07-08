import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  normalizeOpenNextCacheMetadata,
  populateOpenNextStaticAssetsCache,
} from "../../scripts/open-next-postbuild";

describe("OpenNext postbuild cache metadata", () => {
  it("normalizes generated cache path separators for Cloudflare assets", () => {
    const cwd = mkdtempSync(join(tmpdir(), "taskcover-open-next-"));
    try {
      const cloudflareDir = join(cwd, ".open-next", "cloudflare");
      const dynamoDir = join(cwd, ".open-next", "dynamodb-provider");
      mkdirSync(cloudflareDir, { recursive: true });
      mkdirSync(dynamoDir, { recursive: true });

      const sqlPath = join(cloudflareDir, "cache-assets-manifest.sql");
      const dynamoPath = join(dynamoDir, "dynamodb-cache.json");
      writeFileSync(
        sqlPath,
        'INSERT INTO tags (tag, path) VALUES ("build/_N_T_/work/case-studies/[slug]/page", "build-/work\\\\case-studies\\\\british-university-vietnam");'
      );
      writeFileSync(
        dynamoPath,
        JSON.stringify([
          {
            tag: { S: "build/_N_T_/work/sample-audits/[slug]/page" },
            path: { S: "build-/work\\sample-audits\\technical-seo-audit" },
          },
        ])
      );

      normalizeOpenNextCacheMetadata(cwd);

      expect(readFileSync(sqlPath, "utf8")).toContain("/work/case-studies/british-university-vietnam");
      expect(readFileSync(sqlPath, "utf8")).not.toContain("/work//case-studies//british-university-vietnam");
      const dynamo = JSON.parse(readFileSync(dynamoPath, "utf8")) as Array<{ path: { S: string } }>;
      expect(dynamo[0].path.S).toBe("build-/work/sample-audits/technical-seo-audit");
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });

  it("copies launch-critical prerendered work routes into deployable static assets", () => {
    const cwd = mkdtempSync(join(tmpdir(), "taskcover-open-next-cache-"));
    try {
      const buildId = "build-id";
      const caseRoute = join(
        cwd,
        ".open-next",
        "cache",
        buildId,
        "work",
        "case-studies",
        "british-university-vietnam.cache"
      );
      const sampleRoute = join(
        cwd,
        ".open-next",
        "cache",
        buildId,
        "work",
        "sample-audits",
        "technical-seo-audit.cache"
      );
      mkdirSync(join(caseRoute, ".."), { recursive: true });
      mkdirSync(join(sampleRoute, ".."), { recursive: true });
      writeFileSync(caseRoute, JSON.stringify({ html: "<h1>BUV</h1>" }));
      writeFileSync(sampleRoute, JSON.stringify({ html: "<h1>Technical SEO Audit</h1>" }));

      populateOpenNextStaticAssetsCache(cwd);

      expect(
        existsSync(
          join(
            cwd,
            ".open-next",
            "assets",
            "cdn-cgi",
            "_next_cache",
            buildId,
            "work",
            "case-studies",
            "british-university-vietnam.cache"
          )
        )
      ).toBe(true);
      expect(
        existsSync(
          join(
            cwd,
            ".open-next",
            "assets",
            "cdn-cgi",
            "_next_cache",
            buildId,
            "work",
            "sample-audits",
            "technical-seo-audit.cache"
          )
        )
      ).toBe(true);
    } finally {
      rmSync(cwd, { recursive: true, force: true });
    }
  });
});
