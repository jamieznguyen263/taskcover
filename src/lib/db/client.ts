import "server-only";

import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let cached: ReturnType<typeof createDb> | undefined;

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

function createDb() {
  const client = postgres(getDatabaseUrl(), {
    max: 5,
    prepare: false,
    fetch_types: false,
  });
  return drizzle(client, { schema });
}

export function getDb() {
  cached ??= createDb();
  return cached;
}

export type AdminDb = ReturnType<typeof getDb>;
