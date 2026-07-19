"use client";

import { useRef, useState, useTransition } from "react";
import { Paperclip } from "lucide-react";
import { attachWorkFileAction } from "@/lib/work/work-actions";

type UploadSignature = {
  provider: string;
  timestamp?: number;
  signature?: string;
  apiKey?: string;
  cloudName?: string;
  folder?: string;
  error?: string;
};

/**
 * Signed direct-to-Cloudinary upload: ask our API for a signature (which validates the
 * file), upload straight to Cloudinary, then record the file via a server action that
 * re-validates and applies internal|shared visibility. The bytes never pass through our
 * Worker.
 */
export function WorkFileUploader({
  workItemId,
  projectId,
  canPostInternal,
}: {
  workItemId: string;
  projectId: string;
  canPostInternal: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [wantsInternal, setWantsInternal] = useState(canPostInternal);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function upload(file: File) {
    setError(null);
    setStatus(`Uploading ${file.name}…`);

    const signatureResponse = await fetch("/api/flow/upload-signature", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ mimeType: file.type, bytes: file.size }),
    });
    const signature = (await signatureResponse.json().catch(() => null)) as UploadSignature | null;
    if (!signatureResponse.ok || !signature || !signature.apiKey || !signature.cloudName) {
      setStatus(null);
      setError(signature?.error ?? "Uploads are not available right now.");
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", signature.apiKey);
    form.append("timestamp", String(signature.timestamp));
    form.append("signature", String(signature.signature));
    if (signature.folder) form.append("folder", signature.folder);

    const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${signature.cloudName}/auto/upload`, {
      method: "POST",
      body: form,
    });
    const uploaded = (await cloudinaryResponse.json().catch(() => null)) as { secure_url?: string } | null;
    if (!cloudinaryResponse.ok || !uploaded?.secure_url) {
      setStatus(null);
      setError("The upload failed. Please try again.");
      return;
    }

    startTransition(async () => {
      const result = await attachWorkFileAction({
        workItemId,
        projectId,
        filename: file.name,
        url: uploaded.secure_url!,
        contentType: file.type,
        sizeBytes: file.size,
        wantsInternal,
      });
      if (result.error) setError(result.error);
      setStatus(null);
    });
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={pending}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-medium text-secondary hover:text-brand-teal disabled:opacity-60"
        >
          <Paperclip className="h-4 w-4" aria-hidden="true" />
          Attach file
        </button>
        {canPostInternal ? (
          <label className="flex items-center gap-2 text-xs text-graphite">
            <input
              type="checkbox"
              checked={wantsInternal}
              onChange={(event) => setWantsInternal(event.target.checked)}
              className="h-4 w-4 rounded border-line"
            />
            Internal (hidden from external collaborators)
          </label>
        ) : null}
      </div>
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        aria-label="Choose a file to attach"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
      />
      {status ? <p className="text-xs text-muted">{status}</p> : null}
      {error ? (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}
