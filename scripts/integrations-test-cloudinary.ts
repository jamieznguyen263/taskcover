import { loadEnvConfig } from "@next/env";
import crypto from "node:crypto";
import { valuePresent } from "../src/lib/ops/production-activation";

loadEnvConfig(process.cwd());

const live = process.argv.includes("--live");
const configured = ["CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET", "CLOUDINARY_UPLOAD_FOLDER"].every((name) =>
  valuePresent(process.env[name])
);

try {
  validateUploadMetadata({ mimeType: "image/png", bytes: 1024 });
  validateUploadMetadata({ mimeType: "image/webp", bytes: 1024 });
} catch (error) {
  console.error(error instanceof Error ? error.message : "Cloudinary offline validation failed.");
  process.exit(1);
}

const timestamp = 1783200000;
const signature = configured
  ? signCloudinaryParams({ context: "uploaded_by=activation-test", folder: process.env.CLOUDINARY_UPLOAD_FOLDER as string, timestamp }, process.env.CLOUDINARY_API_SECRET as string)
  : "";

console.log(
  JSON.stringify(
    {
      mode: live ? "live-requested" : "offline",
      configured,
      signedUploadOnly: true,
      uploadFolderConfigured: valuePresent(process.env.CLOUDINARY_UPLOAD_FOLDER),
      mimeRestrictions: ["image/webp", "image/avif", "image/png", "image/jpeg"],
      sizeLimitBytes: 5 * 1024 * 1024,
      generatedSignatureShape: signature ? `${signature.length} hex chars` : "unavailable",
      liveUploadPerformed: false,
      liveNote: live ? "This script validates signing. Perform test upload manually from the Admin UI after staging login." : undefined,
    },
    null,
    2
  )
);

function validateUploadMetadata(input: { mimeType: string; bytes: number }) {
  const allowed = new Set(["image/webp", "image/avif", "image/png", "image/jpeg"]);
  if (!allowed.has(input.mimeType)) throw new Error("Unsupported image MIME type.");
  if (input.bytes > 5 * 1024 * 1024) throw new Error("Image exceeds the 5 MB upload limit.");
}

function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}
