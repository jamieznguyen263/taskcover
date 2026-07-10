import type { AdminRole } from "./permissions";

export type DatabaseTarget = "development" | "staging" | "production";

export function parseAdminRole(value: string | undefined, fallback: AdminRole): AdminRole {
  if (!value) return fallback;
  if (value === "admin" || value === "editor") return value;
  throw new Error("Role must be either admin or editor.");
}

export function assertCredentialBootstrapTarget(env: Record<string, string | undefined>) {
  const target = env.DATABASE_TARGET;
  if (target !== "development" && target !== "staging" && target !== "production") {
    throw new Error("DATABASE_TARGET must be development, staging, or production.");
  }
  if (target === "production" && env.CONFIRM_PRODUCTION_USER_BOOTSTRAP !== "YES") {
    throw new Error("Production user bootstrap requires CONFIRM_PRODUCTION_USER_BOOTSTRAP=YES.");
  }
  return target satisfies DatabaseTarget;
}

export function shouldRefuseExistingUser(existing: boolean, allowUpdate: boolean) {
  return existing && !allowUpdate;
}

export function defaultVerificationRole(lifecycleEvent: string | undefined): AdminRole {
  return lifecycleEvent === "admin:user:verify" ? "editor" : "admin";
}

export function readFlagValue(args: string[], name: string) {
  const equalsPrefix = `${name}=`;
  const inline = args.find((arg) => arg.startsWith(equalsPrefix));
  if (inline) return inline.slice(equalsPrefix.length);
  const index = args.indexOf(name);
  if (index >= 0) return args[index + 1];
  return undefined;
}
