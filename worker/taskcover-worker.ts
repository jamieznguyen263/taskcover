/* eslint-disable @typescript-eslint/ban-ts-comment, import/no-anonymous-default-export */
// @ts-nocheck
// OpenNext generates .open-next/worker.js during `npm run build:cloudflare`.
import { DurableObject } from "cloudflare:workers";
import handler from "../.open-next/worker.js";
import { runScheduledTasks } from "../src/lib/cloudflare/scheduled";

export class RateLimitCoordinator extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    ctx.blockConcurrencyWhile(async () => {
      this.ctx.storage.sql.exec(`
        CREATE TABLE IF NOT EXISTS counters (
          key TEXT PRIMARY KEY,
          count INTEGER NOT NULL,
          reset_at INTEGER NOT NULL
        )
      `);
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
}

export default {
  async fetch(request, env, ctx) {
    const redirect = canonicalRedirect(request, env);
    if (redirect) return redirect;
    const previewStaticResponse = await previewPrerenderedStaticResponse(request, env);
    if (previewStaticResponse) return previewStaticResponse;
    return handler.fetch(request, env, ctx);
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runScheduledTasks(env, event.scheduledTime));
  },
};

function canonicalRedirect(request, env) {
  const appUrl = env.APP_URL || env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const canonical = new URL(appUrl);
  if (canonical.hostname !== "taskcover.com") return null;
  const current = new URL(request.url);
  const host = request.headers.get("host") || current.host;
  const proto = request.headers.get("x-forwarded-proto") || current.protocol.replace(":", "");
  const isProductionHost = host === "taskcover.com" || host === "www.taskcover.com";
  if (!isProductionHost) return null;
  if (host === "www.taskcover.com" || proto === "http") {
    current.protocol = "https:";
    current.hostname = "taskcover.com";
    current.port = "";
    return Response.redirect(current.toString(), 308);
  }
  return null;
}

async function previewPrerenderedStaticResponse(request, env) {
  if (request.method !== "GET" && request.method !== "HEAD") return null;
  const url = new URL(request.url);
  if (!isLocalPreviewHost(url.hostname)) return null;
  if (url.search) return null;
  if (url.searchParams.has("_rsc") || request.headers.has("rsc")) return null;
  if (!env.ASSETS) return null;

  const buildIdResponse = await env.ASSETS.fetch("http://assets.local/BUILD_ID");
  if (!buildIdResponse.ok) return null;
  const buildId = (await buildIdResponse.text()).trim();
  if (!buildId) return null;

  const cachePath = `/cdn-cgi/_next_cache/${buildId}${staticCacheKeyForPath(url.pathname)}.cache`;
  const cacheResponse = await env.ASSETS.fetch(`http://assets.local${cachePath}`);
  if (!cacheResponse.ok) return null;
  const entry = await cacheResponse.json();
  if (!entry?.html) return null;

  const headers = new Headers(entry.meta?.headers ?? {});
  headers.set("content-type", "text/html; charset=utf-8");
  headers.set("x-taskcover-preview-static", "prerendered");
  return new Response(request.method === "HEAD" ? null : entry.html, {
    status: 200,
    headers,
  });
}

function staticCacheKeyForPath(pathname) {
  return pathname === "/" ? "/index" : pathname.replace(/\/$/, "");
}

function isLocalPreviewHost(hostname) {
  return hostname === "127.0.0.1" || hostname === "localhost" || hostname === "::1";
}
