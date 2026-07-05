import "server-only";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { requireDatabaseUrl } from "@/lib/admin/env";
import * as schema from "./schema";

let cached: ReturnType<typeof createDb> | undefined;

function createDb() {
  const client = postgres(requireDatabaseUrl(), {
    max: 5,
    prepare: false,
  });
  return drizzle(client, { schema });
}

export function getDb() {
  cached ??= createDb();
  return cached;
}

export type AdminDb = ReturnType<typeof getDb>;
