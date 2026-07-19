export const FLOW_UPLOAD_MAX_BYTES = 10 * 1024 * 1024; // 10 MB

// Agency work needs more than images: briefs, reports, sheets, decks, archives.
export const FLOW_UPLOAD_ALLOWED_MIME = new Set<string>([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/avif",
  "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "text/plain",
  "text/csv",
  "application/zip",
]);

/**
 * Validates a file's metadata before we hand out a Cloudinary signature. Pure and
 * unit-tested; the same limits are the contract the client and the record action rely on.
 */
export function validateFlowFileUpload(input: { mimeType: string; bytes: number }): { error?: string } {
  if (!FLOW_UPLOAD_ALLOWED_MIME.has(input.mimeType)) {
    return { error: "That file type isn't allowed. Use an image, PDF, Office document, CSV, text, or zip." };
  }
  if (!Number.isSafeInteger(input.bytes) || input.bytes <= 0) {
    return { error: "File size must be a positive number." };
  }
  if (input.bytes > FLOW_UPLOAD_MAX_BYTES) {
    return { error: "File exceeds the 10 MB upload limit." };
  }
  return {};
}
