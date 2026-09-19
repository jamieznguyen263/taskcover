import { stripLocaleFromPath } from "@/lib/i18n";

export function isTrackingExcludedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return true;
  const path = sanitizePathOnly(pathname);
  if (!path || path === "/_error") return true;
  const base = stripLocaleFromPath(path);
  return (
    base.startsWith("/admin") ||
    // Taskcover Flow is an internal, noindex application — staff using the PM tool are not
    // marketing traffic, and loading GTM there would track colleagues, not prospects.
    base.startsWith("/flow") ||
    base.startsWith("/api") ||
    base.startsWith("/internal") ||
    base.startsWith("/invite") ||
    base.startsWith("/preview") ||
    base.includes("/preview") ||
    base.startsWith("/debug") ||
    base.startsWith("/_next")
  );
}

export function sanitizePathOnly(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "/";
  try {
    const parsed = trimmed.startsWith("http://") || trimmed.startsWith("https://")
      ? new URL(trimmed)
      : new URL(trimmed, "https://taskcover.local");
    const path = parsed.pathname || "/";
    return path.startsWith("/") ? path : `/${path}`;
  } catch {
    const noQuery = trimmed.split("?")[0]?.split("#")[0] ?? "/";
    return noQuery.startsWith("/") ? noQuery : `/${noQuery}`;
  }
}

export function pageTypeForPath(pathname: string): string {
  const base = stripLocaleFromPath(sanitizePathOnly(pathname));
  if (base === "/") return "home";
  if (base === "/pricing") return "pricing";
  if (base === "/free-seo-audit") return "lead_free_audit";
  if (base === "/book-a-call") return "lead_strategy_call";
  if (base === "/contact") return "lead_contact";
  if (base === "/data-request") return "data_request";
  if (base === "/cookie-preferences") return "cookie_preferences";
  if (base === "/cookie-policy") return "cookie_policy";
  if (base === "/privacy-policy") return "privacy_policy";
  if (base === "/thank-you") return "thank_you";
  if (base.startsWith("/services/")) return "service_detail";
  if (base === "/services") return "services_hub";
  if (base.startsWith("/industries/")) return "industry_detail";
  if (base === "/industries") return "industries_hub";
  if (base.startsWith("/markets/")) return "market_detail";
  if (base === "/markets") return "markets_hub";
  if (base.startsWith("/work/case-studies/")) return "case_study";
  if (base.startsWith("/work/sample-audits/")) return "sample_audit";
  if (base.startsWith("/insights/") && base.split("/").length >= 4) return "insight_article";
  if (base.startsWith("/insights/")) return "insights_category";
  return base.slice(1).replace(/[^a-z0-9]+/gi, "_") || "public";
}

export function slugAt(pathname: string, segment: string): string | undefined {
  const parts = stripLocaleFromPath(sanitizePathOnly(pathname)).split("/").filter(Boolean);
  const index = parts.indexOf(segment);
  return index >= 0 ? parts[index + 1] : undefined;
}
