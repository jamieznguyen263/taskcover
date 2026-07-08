import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

const rateLimitImport = 'import { DurableObject } from "cloudflare:workers";';
const legacyRateLimitImport = 'import { DurableObject as RateLimitDurableObject } from "cloudflare:workers";';
const legacyRateLimitExport = 'export { RateLimitCoordinator } from "../worker/rate-limit-coordinator.ts";';
const rateLimitClass = `export class RateLimitCoordinator extends DurableObject {
    constructor(ctx, env) {
        super(ctx, env);
        ctx.blockConcurrencyWhile(async () => {
            this.ctx.storage.sql.exec(\`
        CREATE TABLE IF NOT EXISTS counters (
          key TEXT PRIMARY KEY,
          count INTEGER NOT NULL,
          reset_at INTEGER NOT NULL
        )
      \`);
        });
    }
    async check(input) {
        const now = input.now ?? Date.now();
        const limit = input.limit ?? 5;
        const windowMs = input.windowMs ?? 600000;
        const row = this.ctx.storage.sql
            .exec("SELECT count, reset_at FROM counters WHERE key = ?", input.key)
            .toArray()[0];
        if (!row || row.reset_at <= now) {
            const resetAt = now + windowMs;
            this.ctx.storage.sql.exec(
                "INSERT OR REPLACE INTO counters (key, count, reset_at) VALUES (?, ?, ?)",
                input.key,
                1,
                resetAt
            );
            return { allowed: true, remaining: limit - 1, resetAt };
        }
        if (row.count >= limit) {
            return { allowed: false, remaining: 0, resetAt: row.reset_at };
        }
        const nextCount = row.count + 1;
        this.ctx.storage.sql.exec("UPDATE counters SET count = ? WHERE key = ?", nextCount, input.key);
        return { allowed: true, remaining: Math.max(0, limit - nextCount), resetAt: row.reset_at };
    }
    async cleanup(now = Date.now()) {
        this.ctx.storage.sql.exec("DELETE FROM counters WHERE reset_at <= ?", now);
    }
}`;

export function patchOpenNextWorker(cwd = process.cwd()) {
  const workerPath = path.join(cwd, ".open-next", "worker.js");
  if (!fs.existsSync(workerPath)) {
    throw new Error(`OpenNext worker not found at ${workerPath}. Run opennextjs-cloudflare build first.`);
  }

  let source = fs.readFileSync(workerPath, "utf8");
  if (source.includes(legacyRateLimitImport)) {
    source = source.replace(legacyRateLimitImport, rateLimitImport);
  }

  if (source.includes("export class RateLimitCoordinator extends RateLimitDurableObject")) {
    source = source.replace(
      "export class RateLimitCoordinator extends RateLimitDurableObject",
      "export class RateLimitCoordinator extends DurableObject"
    );
  }

  if (source.includes("export class RateLimitCoordinator extends DurableObject")) {
    fs.writeFileSync(workerPath, source);
    console.log("OpenNext worker already exports RateLimitCoordinator.");
    return;
  }

  source = source
    .replace("// @ts-expect-error: Resolved by Wrangler when bundling the generated worker.\n", "")
    .replace(`${legacyRateLimitExport}\n`, "");

  const marker = 'export { BucketCachePurge } from "./.build/durable-objects/bucket-cache-purge.js";';
  let nextSource = source.includes(rateLimitImport) ? source : `${rateLimitImport}\n${source}`;
  nextSource = nextSource.includes(marker)
    ? nextSource.replace(marker, `${marker}\n${rateLimitClass}`)
    : nextSource.replace("export default {", `${rateLimitClass}\nexport default {`);

  if (nextSource === source) {
    throw new Error("Unable to patch OpenNext worker with RateLimitCoordinator export.");
  }

  fs.writeFileSync(workerPath, nextSource);
  console.log("OpenNext worker exports RateLimitCoordinator.");
}

export function normalizeOpenNextCacheMetadata(cwd = process.cwd()) {
  const sqlPath = path.join(cwd, ".open-next", "cloudflare", "cache-assets-manifest.sql");
  if (fs.existsSync(sqlPath)) {
    const source = fs.readFileSync(sqlPath, "utf8");
    const normalized = source.replace(/\\+/g, "/");
    if (normalized !== source) {
      fs.writeFileSync(sqlPath, normalized);
      console.log("OpenNext Cloudflare cache asset paths normalized.");
    }
  }

  const dynamoPath = path.join(cwd, ".open-next", "dynamodb-provider", "dynamodb-cache.json");
  if (fs.existsSync(dynamoPath)) {
    const source = fs.readFileSync(dynamoPath, "utf8");
    const entries = JSON.parse(source) as Array<{ path?: { S?: string } }>;
    let changed = false;
    for (const entry of entries) {
      const value = entry.path?.S;
      if (value?.includes("\\")) {
        entry.path!.S = value.replace(/\\/g, "/");
        changed = true;
      }
    }
    if (changed) {
      fs.writeFileSync(dynamoPath, JSON.stringify(entries));
      console.log("OpenNext DynamoDB cache paths normalized.");
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  patchOpenNextWorker();
  normalizeOpenNextCacheMetadata();
}
