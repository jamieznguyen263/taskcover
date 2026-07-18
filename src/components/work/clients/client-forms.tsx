"use client";

import { useActionState } from "react";
import {
  addClientContactAction,
  createClientAction,
  removeClientContactAction,
  updateClientHealthAction,
  type TeamActionState,
} from "@/lib/work/actions";
import { CLIENT_HEALTH_LABEL, CLIENT_HEALTH_STATES, type ClientHealthState } from "@/lib/work/client-health";

const INITIAL: TeamActionState = {};

export function CreateClientForm({ managers }: { managers: { userId: string; displayName: string }[] }) {
  const [state, formAction, pending] = useActionState(createClientAction, INITIAL);

  return (
    <form action={formAction} className="grid gap-3 sm:max-w-md">
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Client name
        <input
          name="name"
          type="text"
          required
          maxLength={120}
          className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
        />
      </label>
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Account Manager <span className="font-normal text-muted">(optional)</span>
        <select
          name="accountManagerId"
          defaultValue=""
          className="min-h-10 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
        >
          <option value="">Unassigned</option>
          {managers.map((manager) => (
            <option key={manager.userId} value={manager.userId}>
              {manager.displayName}
            </option>
          ))}
        </select>
      </label>
      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-10 w-fit items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
      >
        {pending ? "Creating…" : "Create client"}
      </button>
    </form>
  );
}

export function UpdateClientHealthForm({
  clientId,
  currentState,
  currentReason,
}: {
  clientId: string;
  currentState: ClientHealthState;
  currentReason: string;
}) {
  const [state, formAction, pending] = useActionState(updateClientHealthAction, INITIAL);

  return (
    <form action={formAction} className="grid gap-3 sm:max-w-md">
      <input type="hidden" name="clientId" value={clientId} />
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Health state
        <select
          name="state"
          defaultValue={currentState}
          className="min-h-10 rounded-lg border border-line bg-white px-2 text-sm text-graphite"
        >
          {CLIENT_HEALTH_STATES.map((healthState) => (
            <option key={healthState} value={healthState}>
              {CLIENT_HEALTH_LABEL[healthState]}
            </option>
          ))}
        </select>
      </label>
      <label className="grid gap-1 text-sm font-medium text-graphite">
        Why? <span className="font-normal text-muted">(required for Watch / At risk)</span>
        <textarea
          name="reason"
          defaultValue={currentReason}
          maxLength={500}
          rows={2}
          className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-graphite"
        />
      </label>
      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-10 w-fit items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save health"}
      </button>
    </form>
  );
}

export function AddContactForm({ clientId }: { clientId: string }) {
  const [state, formAction, pending] = useActionState(addClientContactAction, INITIAL);

  return (
    <form action={formAction} className="grid gap-3 sm:max-w-md">
      <input type="hidden" name="clientId" value={clientId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Name
          <input
            name="name"
            type="text"
            required
            maxLength={120}
            className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Role
          <input
            name="roleTitle"
            type="text"
            maxLength={120}
            className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Email
          <input
            name="email"
            type="email"
            className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
          />
        </label>
        <label className="grid gap-1 text-sm font-medium text-graphite">
          Phone
          <input
            name="phone"
            type="tel"
            maxLength={40}
            className="min-h-10 rounded-lg border border-line bg-white px-3 text-sm text-graphite"
          />
        </label>
      </div>
      {state.error ? (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-10 w-fit items-center rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
      >
        {pending ? "Adding…" : "Add contact"}
      </button>
    </form>
  );
}

export function RemoveContactButton({
  clientId,
  contactId,
  contactName,
}: {
  clientId: string;
  contactId: string;
  contactName: string;
}) {
  const [state, formAction, pending] = useActionState(removeClientContactAction, INITIAL);

  return (
    <form action={formAction} className="inline">
      <input type="hidden" name="clientId" value={clientId} />
      <input type="hidden" name="contactId" value={contactId} />
      <button
        type="submit"
        disabled={pending}
        aria-label={`Remove contact ${contactName}`}
        className="rounded px-1.5 text-xs font-medium text-muted hover:text-red-600 disabled:opacity-60"
      >
        Remove
      </button>
      {state.error ? (
        <span role="alert" className="ml-2 text-xs text-red-600">
          {state.error}
        </span>
      ) : null}
    </form>
  );
}
