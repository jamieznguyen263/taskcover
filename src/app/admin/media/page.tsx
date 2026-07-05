import { connection } from "next/server";
import { AdminPageHeader, AdminShell, AdminUnavailable } from "@/components/admin/admin-shell";
import { getAdminIntegrationStatus } from "@/lib/admin/env";
import { AdminRepository } from "@/lib/admin/repository";
import { requireAdminSession } from "@/lib/admin/session";

export default async function AdminMediaPage() {
  await connection();
  if (!getAdminIntegrationStatus().databaseConfigured) return <AdminUnavailable />;
  const session = await requireAdminSession();
  const media = await new AdminRepository().listMedia();
  const status = getAdminIntegrationStatus();

  return (
    <AdminShell session={session}>
      <AdminPageHeader eyebrow="Media" title="Media library" description="Provider-neutral media records with Cloudinary-ready signed uploads, usage tracking, alt text, captions, and deletion safeguards." />
      <div className="mb-4 rounded-xl border border-line bg-white p-4 text-sm text-secondary">
        Upload provider: <strong className="text-graphite">{status.cloudinaryConfigured ? "Cloudinary configured" : process.env.NODE_ENV === "production" ? "Unavailable" : "Development local/mock adapter"}</strong>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {media.map((asset) => (
          <article key={asset.id} className="rounded-xl border border-line bg-white p-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset.deliveryUrl} alt={asset.altText} className="aspect-[4/3] w-full rounded-lg border border-line object-cover" />
            <h2 className="mt-3 text-sm font-semibold text-graphite">{asset.altText || "Missing alt text"}</h2>
            <p className="text-xs text-muted">{asset.format} · {asset.width ?? "?"}×{asset.height ?? "?"} · {asset.bytes ?? 0} bytes</p>
          </article>
        ))}
      </div>
    </AdminShell>
  );
}
