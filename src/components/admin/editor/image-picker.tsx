"use client";

import { useRef, useState } from "react";
import { ImagePlus, Library, Link2, Loader2, UploadCloud } from "lucide-react";
import { Field, SmallButton, TextInput } from "./controls";

export type PickedImage = { src: string; width?: number; height?: number; mediaAssetId?: string };

type Mode = "upload" | "library" | "url";
type LibraryAsset = { id: string; url: string; altText: string; width?: number; height?: number };

const ACCEPTED = "image/webp,image/avif,image/png,image/jpeg";
const MAX_BYTES = 5 * 1024 * 1024;

export function ImagePicker({ value, onChange }: { value: string; onChange: (image: PickedImage) => void }) {
  const [mode, setMode] = useState<Mode>("upload");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [urlDraft, setUrlDraft] = useState("");
  const [assets, setAssets] = useState<LibraryAsset[] | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError("");
    if (!ACCEPTED.split(",").includes(file.type)) {
      setError("Only WebP, AVIF, PNG, or JPEG images are allowed.");
      return;
    }
    if (file.size > MAX_BYTES) {
      setError("Image exceeds the 5 MB limit.");
      return;
    }
    setBusy(true);
    try {
      const sigRes = await fetch("/api/admin/media/upload-signature", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mimeType: file.type, bytes: file.size }),
      });
      const sig = (await sigRes.json()) as { provider?: string; timestamp?: number; signature?: string; apiKey?: string; cloudName?: string; folder?: string; error?: string };
      if (!sigRes.ok || sig.provider !== "cloudinary" || !sig.signature) {
        throw new Error(sig.error || "Image uploads are not configured on the server.");
      }

      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey!);
      form.append("timestamp", String(sig.timestamp));
      form.append("signature", sig.signature);
      if (sig.folder) form.append("folder", sig.folder);

      const uploadRes = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`, { method: "POST", body: form });
      const uploaded = (await uploadRes.json()) as { secure_url?: string; public_id?: string; width?: number; height?: number; format?: string; bytes?: number; error?: { message?: string } };
      if (!uploadRes.ok || !uploaded.secure_url) throw new Error(uploaded.error?.message || "Cloudinary upload failed.");

      const recordRes = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          provider: "cloudinary",
          providerAssetId: uploaded.public_id,
          secureUrl: uploaded.secure_url,
          width: uploaded.width,
          height: uploaded.height,
          bytes: uploaded.bytes,
          format: uploaded.format,
          folder: sig.folder,
        }),
      });
      const record = (await recordRes.json()) as { id?: string; error?: string };

      onChange({ src: uploaded.secure_url, width: uploaded.width, height: uploaded.height, mediaAssetId: record.id });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function loadLibrary() {
    setMode("library");
    if (assets) return;
    setBusy(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = (await res.json()) as { assets?: LibraryAsset[]; error?: string };
      setAssets(data.assets ?? []);
    } catch {
      setError("Could not load the media library.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid gap-2 rounded-lg border border-line-soft bg-surface-soft p-3">
      <div className="flex flex-wrap gap-1">
        <ModeTab active={mode === "upload"} onClick={() => setMode("upload")} icon={UploadCloud} label="Upload" />
        <ModeTab active={mode === "library"} onClick={loadLibrary} icon={Library} label="Library" />
        <ModeTab active={mode === "url"} onClick={() => setMode("url")} icon={Link2} label="URL" />
        {busy ? <Loader2 className="ml-2 h-4 w-4 animate-spin self-center text-brand-teal" aria-label="Working" /> : null}
      </div>

      {error ? <p role="alert" className="text-xs text-red-700">{error}</p> : null}

      {mode === "upload" ? (
        <div className="grid gap-2">
          <input ref={fileRef} type="file" accept={ACCEPTED} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); e.target.value = ""; }} />
          <button
            type="button"
            disabled={busy}
            onClick={() => fileRef.current?.click()}
            className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-line bg-white text-sm text-secondary hover:border-brand-teal/50 disabled:opacity-50"
          >
            <ImagePlus className="h-6 w-6 text-brand-teal" aria-hidden="true" />
            Choose an image (WebP/AVIF/PNG/JPEG, ≤ 5 MB)
          </button>
        </div>
      ) : mode === "library" ? (
        <div className="grid max-h-60 grid-cols-3 gap-2 overflow-y-auto">
          {assets && assets.length === 0 ? <p className="col-span-3 text-xs text-muted">No uploads yet.</p> : null}
          {assets?.map((asset) => (
            <button
              key={asset.id}
              type="button"
              onClick={() => onChange({ src: asset.url, width: asset.width, height: asset.height, mediaAssetId: asset.id })}
              className="overflow-hidden rounded-lg border border-line bg-white hover:border-brand-teal"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={asset.url} alt={asset.altText} className="aspect-square w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      ) : (
        <div className="flex gap-2">
          <TextInput value={urlDraft} onChange={setUrlDraft} placeholder="https://…" />
          <SmallButton tone="primary" onClick={() => { if (urlDraft.trim()) onChange({ src: urlDraft.trim() }); }}>Use URL</SmallButton>
        </div>
      )}

      {value ? (
        <div className="mt-1">
          <Field label="Current image">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="Selected" className="max-h-40 rounded-lg border border-line object-contain" />
          </Field>
        </div>
      ) : null}
    </div>
  );
}

function ModeTab({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof UploadCloud; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium ${active ? "bg-white text-brand-teal shadow-sm" : "text-secondary hover:text-brand-teal"}`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {label}
    </button>
  );
}
