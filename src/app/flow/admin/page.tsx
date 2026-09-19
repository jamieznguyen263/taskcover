import { notFound } from "next/navigation";
import {
  CAPABILITIES_BY_ACCESS_LEVEL,
  hasCapability,
  SYSTEM_ROLE_PRESETS,
} from "@/lib/work/capabilities";
import { evaluateExternalAccess, EXTERNAL_KIND_LABEL } from "@/lib/work/external-access";
import { WorkRepository } from "@/lib/work/repository";
import { resolveWorkSession } from "@/lib/work/session";
import { AddTeamMemberForm, CreateTeamForm, RemoveTeamMemberButton } from "@/components/work/admin/team-forms";
import { InviteExternalForm, RevokeExternalButton } from "@/components/work/admin/external-forms";

const ACCESS_LEVEL_LABEL = { owner: "Owner", admin: "Admin", manager: "Manager", member: "Member" } as const;
const MEMBERSHIP_STATUS_LABEL = { active: "Active", disabled: "Disabled" } as const;
const EXTERNAL_STATE_LABEL = {
  active: "Active",
  "not-started": "Not started",
  expired: "Expired",
  revoked: "Revoked",
} as const;

export default async function FlowAdministrationPage() {
  // The /flow layout guarantees an active session, but authorization is never inferred from
  // navigation visibility — this page re-checks its own capability (deny-by-default).
  const resolution = await resolveWorkSession();
  if (resolution.kind !== "active" || !hasCapability(resolution.session.accessLevel, "administration:view")) {
    notFound();
  }

  const repo = new WorkRepository();
  const [members, teams, externals, pendingExternalInvites] = await Promise.all([
    repo.listMembers(),
    repo.listTeams(),
    repo.listExternalCollaborators(),
    repo.listPendingExternalInvites(),
  ]);
  const now = new Date();

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">Administration</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-graphite sm:text-3xl">
          Members, roles, and teams
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-secondary">
          Every CMS account automatically has a Taskcover Flow membership. Access levels follow
          the four system role presets below. Freelancers and partners are invited separately and
          never receive internal access.
        </p>
      </div>

      <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="members-heading">
        <h2 id="members-heading" className="text-lg font-semibold text-graphite">
          Members
        </h2>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="py-2">Name</th>
                <th>Email</th>
                <th>Access level</th>
                <th>CMS role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line-soft">
              {members.map((member) => (
                <tr key={member.userId}>
                  <td className="py-3 font-medium text-graphite">{member.displayName}</td>
                  <td className="py-3 text-secondary">{member.email}</td>
                  <td className="py-3">{ACCESS_LEVEL_LABEL[member.accessLevel]}</td>
                  <td className="py-3 text-secondary">{member.legacyRole}</td>
                  <td className="py-3">{MEMBERSHIP_STATUS_LABEL[member.status]}</td>
                </tr>
              ))}
              {members.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-sm text-muted">
                    No memberships yet — they are provisioned automatically when users first open
                    Taskcover Flow, or by migration 0005.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="teams-heading">
        <h2 id="teams-heading" className="text-lg font-semibold text-graphite">
          Teams
        </h2>
        {teams.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No teams yet. Create the first one below.</p>
        ) : (
          <ul className="mt-3 grid gap-3">
            {teams.map((team) => {
              const memberIds = new Set(team.members.map((member) => member.userId));
              const candidates = members
                .filter((member) => member.status === "active" && !memberIds.has(member.userId))
                .map((member) => ({ userId: member.userId, displayName: member.displayName }));
              return (
                <li key={team.id} className="rounded-lg border border-line-soft bg-surface-soft p-3">
                  <p className="text-sm font-semibold text-graphite">{team.name}</p>
                  {team.description ? <p className="mt-0.5 text-xs text-muted">{team.description}</p> : null}
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {team.members.map((member) => (
                      <li
                        key={member.userId}
                        className="flex items-center gap-1 rounded-full border border-line bg-white px-2.5 py-1 text-xs text-secondary"
                      >
                        {member.displayName}
                        <RemoveTeamMemberButton teamId={team.id} userId={member.userId} displayName={member.displayName} />
                      </li>
                    ))}
                    {team.members.length === 0 ? (
                      <li className="text-xs text-muted">No members yet.</li>
                    ) : null}
                  </ul>
                  <div className="mt-3">
                    <AddTeamMemberForm teamId={team.id} candidates={candidates} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
        <div className="mt-4 border-t border-line-soft pt-4">
          <h3 className="text-sm font-semibold text-graphite">Create a team</h3>
          <div className="mt-2">
            <CreateTeamForm />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="externals-heading">
        <h2 id="externals-heading" className="text-lg font-semibold text-graphite">
          External collaborators
        </h2>
        <p className="mt-1 text-sm text-secondary">
          Freelancers and partners only ever see what is explicitly shared with them — never
          other clients, internal notes, or the Content CMS. Access ends automatically at the
          expiry date, or immediately on revoke.
        </p>
        {externals.length > 0 ? (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="py-2">Name</th>
                  <th>Type</th>
                  <th>Organization</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {externals.map((collaborator) => {
                  const state = evaluateExternalAccess({
                    now,
                    accessStartAt: collaborator.accessStartAt,
                    accessExpiryAt: collaborator.accessExpiryAt,
                    revokedAt: collaborator.revokedAt,
                  });
                  return (
                    <tr key={collaborator.id}>
                      <td className="py-3">
                        <p className="font-medium text-graphite">{collaborator.displayName}</p>
                        <p className="text-xs text-muted">{collaborator.email}</p>
                      </td>
                      <td className="py-3 text-secondary">{EXTERNAL_KIND_LABEL[collaborator.kind]}</td>
                      <td className="py-3 text-secondary">{collaborator.organizationName ?? "—"}</td>
                      <td className="py-3 text-secondary">
                        {collaborator.accessExpiryAt ? collaborator.accessExpiryAt.toLocaleDateString() : "No expiry"}
                      </td>
                      <td className="py-3">{EXTERNAL_STATE_LABEL[state]}</td>
                      <td className="py-3 text-right">
                        {state !== "revoked" ? (
                          <RevokeExternalButton membershipId={collaborator.id} displayName={collaborator.displayName} />
                        ) : null}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted">No external collaborators yet.</p>
        )}
        {pendingExternalInvites.length > 0 ? (
          <div className="mt-4 border-t border-line-soft pt-3">
            <h3 className="text-sm font-semibold text-graphite">Pending invitations</h3>
            <ul className="mt-2 grid gap-1">
              {pendingExternalInvites.map((invite) => (
                <li key={invite.inviteId} className="text-sm text-secondary">
                  {invite.email} · {EXTERNAL_KIND_LABEL[invite.kind]}
                  {invite.organizationName ? ` · ${invite.organizationName}` : ""} · expires{" "}
                  {invite.expiresAt.toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        <div className="mt-4 border-t border-line-soft pt-4">
          <h3 className="text-sm font-semibold text-graphite">Invite an external collaborator</h3>
          <p className="mt-1 text-xs text-muted">
            They will set a password through the standard invite link and land in their own
            shared workspace — never the CMS or internal views.
          </p>
          <div className="mt-2">
            <InviteExternalForm />
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-line bg-white p-4" aria-labelledby="presets-heading">
        <h2 id="presets-heading" className="text-lg font-semibold text-graphite">
          Role presets
        </h2>
        <p className="mt-1 text-sm text-secondary">
          System presets are fixed in this release; capabilities are enforced server-side,
          deny-by-default.
        </p>
        <dl className="mt-3 grid gap-3 sm:grid-cols-2">
          {SYSTEM_ROLE_PRESETS.map((preset) => (
            <div key={preset.key} className="rounded-lg border border-line-soft bg-surface-soft p-3">
              <dt className="text-sm font-medium text-graphite">{preset.name}</dt>
              <dd className="mt-1 text-xs text-muted">{preset.description}</dd>
              <dd className="mt-2 flex flex-wrap gap-1">
                {CAPABILITIES_BY_ACCESS_LEVEL[preset.key].map((capability) => (
                  <span
                    key={capability}
                    className="rounded-full border border-line bg-white px-2 py-0.5 text-[10px] font-medium text-secondary"
                  >
                    {capability}
                  </span>
                ))}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
