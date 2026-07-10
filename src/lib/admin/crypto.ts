import crypto from "node:crypto";

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 256;

// PBKDF2-HMAC-SHA-256, 100,000 iterations.
//
// Chosen over Argon2id specifically because Cloudflare Workers blocks the dynamic
// WebAssembly compilation that WASM-based Argon2id implementations (e.g. hash-wasm) rely
// on: "WebAssembly.compile(): Wasm code generation disallowed by embedder". That made
// every login fail verification in production while working fine in every Node.js test,
// since password verification only ever ran through the actual deployed Worker at login
// time. PBKDF2 via the standard Web Crypto API (`crypto.subtle`) has no WASM step and runs
// identically in Node.js and Workers — it is a first-class native API in both runtimes.
//
// The iteration count is 100,000, not OWASP's 2023 minimum of 600,000
// (https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html),
// because Cloudflare Workers' `crypto.subtle.deriveBits` hard-rejects PBKDF2 above 100,000
// iterations at runtime ("Pbkdf2 failed: iteration counts above 100000 are not supported"
// — confirmed empirically against the deployed Worker, not documented anywhere up front).
// 100,000 is the platform ceiling, not an arbitrary choice, and matches OWASP's own
// pre-2023 PBKDF2-HMAC-SHA256 minimum. If Cloudflare raises this limit in the future, the
// `version` field below allows introducing a higher-iteration v2 format without breaking
// verification of existing v1 hashes.
export const PBKDF2_PARAMS = {
  algorithm: "pbkdf2-sha256",
  version: 1,
  iterations: 100_000,
  hash: "SHA-256",
  saltBytes: 16,
  keyBits: 256,
} as const;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validatePasswordShape(password: string) {
  return password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH;
}

export async function hashPassword(password: string): Promise<string> {
  if (!validatePasswordShape(password)) {
    throw new Error("Password does not meet length requirements.");
  }
  const salt = globalThis.crypto.getRandomValues(new Uint8Array(PBKDF2_PARAMS.saltBytes));
  const derived = await derivePbkdf2Bits(password, salt, PBKDF2_PARAMS.iterations);
  return encodePbkdf2Hash(PBKDF2_PARAMS.iterations, salt, derived);
}

export async function verifyPassword(hash: string, password: string): Promise<boolean> {
  if (!validatePasswordShape(password)) return false;
  const parsed = decodePbkdf2Hash(hash);
  if (!parsed) return false; // Malformed or unsupported format (including legacy Argon2id
  // hashes) is never treated as a valid match — it always requires a password reset.
  try {
    const derived = await derivePbkdf2Bits(password, parsed.salt, parsed.iterations);
    return constantTimeEqualBytes(derived, parsed.key);
  } catch {
    return false;
  }
}

/** True only for a well-formed, currently-supported PBKDF2 hash (not legacy Argon2id). */
export function isSupportedPasswordHash(hash: string): boolean {
  return decodePbkdf2Hash(hash) !== null;
}

async function derivePbkdf2Bits(password: string, salt: Uint8Array, iterations: number): Promise<Uint8Array> {
  const keyMaterial = await globalThis.crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const derived = await globalThis.crypto.subtle.deriveBits(
    { name: "PBKDF2", hash: PBKDF2_PARAMS.hash, salt: salt as BufferSource, iterations },
    keyMaterial,
    PBKDF2_PARAMS.keyBits
  );
  return new Uint8Array(derived);
}

function encodePbkdf2Hash(iterations: number, salt: Uint8Array, key: Uint8Array): string {
  return `$${PBKDF2_PARAMS.algorithm}$v=${PBKDF2_PARAMS.version}$i=${iterations}$${base64UrlEncode(salt)}$${base64UrlEncode(key)}`;
}

function decodePbkdf2Hash(value: string): { iterations: number; salt: Uint8Array; key: Uint8Array } | null {
  try {
    const parts = value.split("$");
    if (parts.length !== 6 || parts[0] !== "" || parts[1] !== PBKDF2_PARAMS.algorithm) return null;
    const versionMatch = /^v=(\d+)$/.exec(parts[2] ?? "");
    if (!versionMatch || Number(versionMatch[1]) !== PBKDF2_PARAMS.version) return null;
    const iterationsMatch = /^i=(\d+)$/.exec(parts[3] ?? "");
    if (!iterationsMatch) return null;
    const iterations = Number(iterationsMatch[1]);
    if (!Number.isInteger(iterations) || iterations < 1 || iterations > 10_000_000) return null;
    const salt = base64UrlDecode(parts[4] ?? "");
    const key = base64UrlDecode(parts[5] ?? "");
    if (salt.length === 0 || key.length === 0) return null;
    return { iterations, salt, key };
  } catch {
    return null;
  }
}

function constantTimeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a[i]! ^ b[i]!;
  return diff === 0;
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(value: string): Uint8Array {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function createOpaqueToken() {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function hashSecurityIdentifier(value: string | null | undefined) {
  if (!value) return null;
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function constantTimeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return crypto.timingSafeEqual(left, right);
}

export function summarizeUserAgent(userAgent: string | null) {
  if (!userAgent) return null;
  return userAgent.slice(0, 180);
}
