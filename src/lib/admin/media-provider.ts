import "server-only";

import crypto from "node:crypto";
import { getAdminIntegrationStatus } from "./env";

export type UploadSignature = {
  provider: "cloudinary" | "local" | "unavailable";
  timestamp?: number;
  signature?: string;
  apiKey?: string;
  cloudName?: string;
  folder?: string;
  uploadPreset?: string;
  message?: string;
};

export interface MediaProvider {
  isConfigured(): boolean;
  createUploadSignature(userId: string): Promise<UploadSignature>;
  getStatus(): { provider: string; configured: boolean; productionSafe: boolean; message: string };
  getDeliveryUrl(asset: { deliveryUrl: string; secureUrl: string }): string;
}

export class CloudinaryMediaProvider implements MediaProvider {
  isConfigured() {
    return getAdminIntegrationStatus().cloudinaryConfigured;
  }

  async createUploadSignature(userId: string): Promise<UploadSignature> {
    if (!this.isConfigured()) return unavailableUploadSignature();
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = process.env.CLOUDINARY_UPLOAD_FOLDER ?? "taskcover/insights";
    const context = `uploaded_by=${userId}`;
    const signature = signCloudinaryParams({ context, folder, timestamp }, process.env.CLOUDINARY_API_SECRET!);
    return {
      provider: "cloudinary",
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder,
    };
  }

  getStatus() {
    return {
      provider: "cloudinary",
      configured: this.isConfigured(),
      productionSafe: this.isConfigured(),
      message: this.isConfigured() ? "Signed Cloudinary uploads are configured." : "Cloudinary credentials are missing.",
    };
  }

  getDeliveryUrl(asset: { deliveryUrl: string; secureUrl: string }) {
    return asset.deliveryUrl || asset.secureUrl;
  }
}

export class DevelopmentMediaProvider implements MediaProvider {
  isConfigured() {
    return process.env.NODE_ENV !== "production";
  }

  async createUploadSignature(): Promise<UploadSignature> {
    if (!this.isConfigured()) return unavailableUploadSignature();
    return { provider: "local", message: "Development adapter only. No production upload is performed." };
  }

  getStatus() {
    return {
      provider: "local",
      configured: this.isConfigured(),
      productionSafe: false,
      message: "Development-only local/mock media adapter.",
    };
  }

  getDeliveryUrl(asset: { deliveryUrl: string; secureUrl: string }) {
    return asset.deliveryUrl || asset.secureUrl;
  }
}

export function getMediaProvider(): MediaProvider {
  return getAdminIntegrationStatus().cloudinaryConfigured ? new CloudinaryMediaProvider() : new DevelopmentMediaProvider();
}

function unavailableUploadSignature(): UploadSignature {
  return { provider: "unavailable", message: "Media uploads are not configured." };
}

export function validateUploadMetadata(input: { mimeType: string; bytes: number }) {
  const allowed = new Set(["image/webp", "image/avif", "image/png", "image/jpeg"]);
  if (!allowed.has(input.mimeType)) throw new Error("Unsupported image MIME type.");
  if (!Number.isSafeInteger(input.bytes) || input.bytes <= 0) throw new Error("Image size must be a positive integer.");
  if (input.bytes > 5 * 1024 * 1024) throw new Error("Image exceeds the 5 MB upload limit.");
}

export function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== "")
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");
  return crypto.createHash("sha1").update(`${payload}${apiSecret}`).digest("hex");
}
