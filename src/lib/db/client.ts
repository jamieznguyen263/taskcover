import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type HyperdriveBinding = {
  connectionString: string;
};

export type RuntimeDatabaseEnv = {
  HYPERDRIVE?: HyperdriveBinding;
};

function getRuntimeDatabaseEnv(): RuntimeDatabaseEnv | undefined {
  try {
    return getCloudflareContext().env as RuntimeDatabaseEnv;
  } catch {
    return undefined;
  }
}

export function getDatabaseUrl() {
  const hyperdriveUrl = getRuntimeDatabaseEnv()?.HYPERDRIVE?.connectionString;
  if (hyperdriveUrl) return hyperdriveUrl;
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  throw new Error("Database is not configured. Set DATABASE_URL locally or bind Hyperdrive in Cloudflare.");
}

export function isDatabaseConfigured() {
  try {
    getDatabaseUrl();
    return true;
  } catch {
    return false;
  }
}

export function isHyperdriveConfigured() {
  return Boolean(getRuntimeDatabaseEnv()?.HYPERDRIVE?.connectionString);
}

// Cloudflare Workers cannot reuse I/O objects (sockets, and therefore DB connections) across
// requests: a connection opened during one request's execution context is torn down once that
// request finishes, and reusing it from a later request hangs indefinitely instead of erroring
// (see https://opennext.js.org/cloudflare/troubleshooting). A module-level cached client here
// caused exactly that: intermittent hung requests whenever a warm isolate reused a connection
// from a previous request. Hyperdrive already pools the real connections, so a fresh lightweight
// client per call is the supported pattern, not a regression. The Workers runtime tears down the
// underlying socket automatically when the request finishes, so there is no explicit client to
// close here — callers issue queries through the returned instance for the lifetime of one request.
export function getDb() {
  const client = postgres(getDatabaseUrl(), {
    max: 5,
    prepare: false,
    fetch_types: false,
  });
  return drizzle(client, { schema });
}

export type AdminDb = ReturnType<typeof getDb>;
