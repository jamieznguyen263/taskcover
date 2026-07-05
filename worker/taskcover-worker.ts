/* eslint-disable @typescript-eslint/ban-ts-comment, import/no-anonymous-default-export */
// @ts-nocheck
// OpenNext generates .open-next/worker.js during `npm run build:cloudflare`.
import handler from "../.open-next/worker.js";
import { runScheduledTasks } from "../src/lib/cloudflare/scheduled";

export class RateLimitCoordinator {
  constructor(state, env) {
    this.state = state;
    this.env = env;
    this.state.blockConcurrencyWhile(async () => {
      this.state.storage.sql.exec(`
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
    const row = this.state.storage.sql
      .exec("SELECT count, reset_at FROM counters WHERE key = ?", input.key)
      .one();

    if (!row || row.reset_at <= now) {
      const resetAt = now + windowMs;
      this.state.storage.sql.exec(
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
    this.state.storage.sql.exec("UPDATE counters SET count = ? WHERE key = ?", nextCount, input.key);
    return { allowed: true, remaining: Math.max(0, limit - nextCount), resetAt: row.reset_at };
  }

  async cleanup(now = Date.now()) {
    this.state.storage.sql.exec("DELETE FROM counters WHERE reset_at <= ?", now);
  }
}

export default {
  fetch(request, env, ctx) {
    const redirect = canonicalRedirect(request, env);
    if (redirect) return redirect;
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
