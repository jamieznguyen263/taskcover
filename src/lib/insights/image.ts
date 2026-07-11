/**
 * Cloudinary delivery helpers for article images.
 *
 * Cloudinary URLs look like:
 *   https://res.cloudinary.com/<cloud>/image/upload/v123/folder/name.jpg
 * We insert transformations right after `/image/upload/` to serve modern
 * formats (f_auto → WebP/AVIF), auto quality (q_auto), and correctly sized
 * variants (w_… with c_limit so images are never upscaled). Non-Cloudinary
 * URLs (manually pasted) are returned unchanged.
 */

const CLOUDINARY_UPLOAD = /\/image\/upload\//;

export function isCloudinaryUrl(src: string): boolean {
  return /^https?:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(src);
}

export function cloudinaryTransform(src: string, transform: string): string {
  return src.replace(CLOUDINARY_UPLOAD, `/image/upload/${transform}/`);
}

export const DEFAULT_IMAGE_WIDTHS = [320, 640, 960, 1280, 1600] as const;

export type ImageSources = { fallbackSrc: string; srcSet?: string; sizes: string };

export function buildImageSources(src: string, sizes = "(max-width: 768px) 100vw, 768px"): ImageSources {
  if (!isCloudinaryUrl(src)) return { fallbackSrc: src, sizes };
  const base = "f_auto,q_auto,c_limit";
  const srcSet = DEFAULT_IMAGE_WIDTHS.map((w) => `${cloudinaryTransform(src, `${base},w_${w}`)} ${w}w`).join(", ");
  const fallbackSrc = cloudinaryTransform(src, `${base},w_1280`);
  return { fallbackSrc, srcSet, sizes };
}

/** A tiny, heavily-blurred inline placeholder URL for the LQIP effect. */
export function cloudinaryLqip(src: string): string | null {
  if (!isCloudinaryUrl(src)) return null;
  return cloudinaryTransform(src, "f_auto,q_auto:low,e_blur:800,w_32");
}
