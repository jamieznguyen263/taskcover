import { argon2id, argon2Verify } from "hash-wasm";
import crypto from "node:crypto";

export const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 256;
export const ARGON2ID_PARAMS = {
  memorySize: 19456,
  iterations: 2,
  parallelism: 1,
  hashLength: 32,
} as const;

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function validatePasswordShape(password: string) {
  return password.length >= MIN_PASSWORD_LENGTH && password.length <= MAX_PASSWORD_LENGTH;
}

export async function hashPassword(password: string) {
  if (!validatePasswordShape(password)) {
    throw new Error("Password does not meet length requirements.");
  }
  return argon2id({
    password,
    salt: crypto.randomBytes(16),
    ...ARGON2ID_PARAMS,
    outputType: "encoded",
  });
}

export async function verifyPassword(hash: string, password: string) {
  if (!validatePasswordShape(password)) return false;
  try {
    return await argon2Verify({ hash, password });
  } catch {
    return false;
  }
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
