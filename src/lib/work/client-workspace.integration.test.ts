import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { describe, expect, it } from "vitest";
import { ClientsRepository } from "./clients-repository";

/**
 * Staging-only coverage for the Client Workspace queries (open work, documents, activity).
 * Those live in SQL — a join across projects, a NULLS-last ordering, and an OR between
 * client-linked and project-linked documents — so unit tests with a fake db would only prove
 * the mock. This exercises real Postgres.
 *
 * Environment is read straight from the local env files rather than through `loadEnvConfig`:
 * in this repo `@next/env` resolves CLI scripts to *production* mode (NODE_ENV is unset), so
 * loading it here would point the test at the production database. The database name is
 * asserted explicitly instead of trusting DATABASE_TARGET.
 */
const STAGING_DATABASE = "taskcover_staging";

function stagingUrl(): string {
  for (const [file, key] of [
    [".dev.vars", "CLOUDFLARE_HYPERDRIVE_LOCAL_CONNECTION_STRING_HYPERDRIVE"],
    [".env.local", "DATABASE_URL"],
  ] as const) {
    const full = path.join(process.cwd(), file);
    if (!fs.existsSync(full)) continue;
    for (const line of fs.readFileSync(full, "utf8").split(/\r?\n/)) {
      if (!line.startsWith(`${key}=`)) continue;
      const value = line.slice(key.length + 1).replace(/^["']|["']$/g, "");
      if (new URL(value).pathname.slice(1) === STAGING_DATABASE) return value;
    }
  }
  throw new Error(`No connection string for "${STAGING_DATABASE}" found in .dev.vars or .env.local.`);
}

describe("Client Workspace aggregation (staging)", () => {
  it("gathers open work, documents, and activity across the client's projects", async () => {
    const url = stagingUrl();
    process.env.DATABASE_URL = url;
    const sql = postgres(url, { max: 1, prepare: false, connect_timeout: 20 });
    const marker = crypto.randomUUID().slice(0, 8);

    let userId: string | undefined;
    let clientId: string | undefined;
    let otherClientId: string | undefined;

    try {
      [{ id: userId }] = await sql<{ id: string }[]>`
        INSERT INTO admin_users (email, normalized_email, display_name, role, status, password_hash)
        VALUES (${`qa-flow-${marker}@example.invalid`}, ${`qa-flow-${marker}@example.invalid`},
                'QA Flow Owner', 'admin', 'active', 'not-used')
        RETURNING id
      `;
      [{ id: clientId }] = await sql<{ id: string }[]>`
        INSERT INTO clients (name, created_by) VALUES (${`QA Client ${marker}`}, ${userId}) RETURNING id
      `;
      [{ id: otherClientId }] = await sql<{ id: string }[]>`
        INSERT INTO clients (name, created_by) VALUES (${`QA Other ${marker}`}, ${userId}) RETURNING id
      `;

      const [{ id: projectId }] = await sql<{ id: string }[]>`
        INSERT INTO projects (client_id, kind, name, created_by)
        VALUES (${clientId}, 'client', ${`QA Project ${marker}`}, ${userId}) RETURNING id
      `;
      // Belongs to a different client: nothing from it may leak into the workspace.
      const [{ id: foreignProjectId }] = await sql<{ id: string }[]>`
        INSERT INTO projects (client_id, kind, name, created_by)
        VALUES (${otherClientId}, 'client', ${`QA Foreign ${marker}`}, ${userId}) RETURNING id
      `;

      await sql`
        INSERT INTO work_items (project_id, type, title, owner_id, created_by, status, due_at)
        VALUES (${projectId}, 'task', ${`QA undated ${marker}`}, ${userId}, ${userId}, 'to_do', NULL),
               (${projectId}, 'deliverable', ${`QA dated ${marker}`}, ${userId}, ${userId}, 'in_progress', now() + interval '2 days'),
               (${projectId}, 'task', ${`QA finished ${marker}`}, ${userId}, ${userId}, 'done', NULL),
               (${foreignProjectId}, 'task', ${`QA foreign ${marker}`}, ${userId}, ${userId}, 'to_do', NULL)
      `;
      await sql`
        INSERT INTO documents (title, client_id, created_by) VALUES (${`QA client doc ${marker}`}, ${clientId}, ${userId})
      `;
      await sql`
        INSERT INTO documents (title, project_id, created_by) VALUES (${`QA project doc ${marker}`}, ${projectId}, ${userId})
      `;
      await sql`
        INSERT INTO activity_events (actor_id, target_type, target_id, project_id, event, summary)
        VALUES (${userId}, 'work_item', ${projectId}, ${projectId}, 'work.created', ${`did a thing ${marker}`})
      `;

      const client = await new ClientsRepository().getClient(clientId!);
      expect(client).not.toBeNull();

      const titles = client!.openWork.map((item) => item.title);
      expect(titles).toContain(`QA dated ${marker}`);
      expect(titles).toContain(`QA undated ${marker}`);
      expect(titles).not.toContain(`QA finished ${marker}`);
      // Isolation: another client's project must never appear here.
      expect(titles).not.toContain(`QA foreign ${marker}`);
      // Dated work sorts ahead of undated work (NULLS LAST).
      expect(titles.indexOf(`QA dated ${marker}`)).toBeLessThan(titles.indexOf(`QA undated ${marker}`));
      expect(client!.openWork[0]?.projectName).toBe(`QA Project ${marker}`);
      expect(client!.openWork[0]?.ownerName).toBe("QA Flow Owner");
      expect(client!.doneWorkCount).toBe(1);

      // Documents reach the workspace both directly and through a project.
      const docTitles = client!.documents.map((doc) => doc.title);
      expect(docTitles).toContain(`QA client doc ${marker}`);
      expect(docTitles).toContain(`QA project doc ${marker}`);

      expect(client!.activity.map((entry) => entry.summary)).toContain(`did a thing ${marker}`);
      expect(client!.activity[0]?.actorName).toBe("QA Flow Owner");
    } finally {
      if (clientId || otherClientId) {
        const ids = [clientId, otherClientId].filter(Boolean) as string[];
        const projectIds = await sql<{ id: string }[]>`SELECT id FROM projects WHERE client_id = ANY(${ids})`;
        const pids = projectIds.map((row) => row.id);
        if (pids.length) {
          await sql`DELETE FROM activity_events WHERE project_id = ANY(${pids})`;
          await sql`DELETE FROM work_items WHERE project_id = ANY(${pids})`;
          await sql`DELETE FROM documents WHERE project_id = ANY(${pids})`;
        }
        await sql`DELETE FROM documents WHERE client_id = ANY(${ids})`;
        await sql`DELETE FROM projects WHERE client_id = ANY(${ids})`;
        await sql`DELETE FROM clients WHERE id = ANY(${ids})`;
      }
      if (userId) await sql`DELETE FROM admin_users WHERE id = ${userId}`;
      await sql.end();
    }
  });
});
