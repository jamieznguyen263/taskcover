import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { publicClientLogoAssets, clientLogoAssets } from "@/content/client-logo-assets";
import { getHomeContent, getLocalizedSite } from "@/lib/content";
import { locales, type Locale } from "@/lib/i18n";

function source(path: string) {
  return readFileSync(join(process.cwd(), path), "utf8");
}

describe("Task 15 launch QA guardrails", () => {
  it("keeps Admin and Tiptap code out of public marketing client components", () => {
    const publicClientSources = [
      "src/components/marketing/layout/site-header.tsx",
      "src/components/marketing/layout/site-footer.tsx",
      "src/components/marketing/pricing/pricing-tabs.tsx",
      "src/components/marketing/pricing/pricing-interactive-flow.tsx",
      "src/components/marketing/leads/lead-form-client.tsx",
      "src/components/marketing/home/search-ecosystem-map.tsx",
      "src/components/marketing/trust/cookie-preferences-client.tsx",
      "src/components/marketing/trust/data-request-form-client.tsx",
    ].map(source).join("\n");

    expect(publicClientSources).not.toContain("@tiptap/");
    expect(publicClientSources).not.toContain("@/components/admin");
    expect(publicClientSources).not.toContain("@/lib/admin");
    expect(publicClientSources).not.toContain("@/lib/db");
    expect(publicClientSources).not.toContain("recharts");
  });

  it("keeps logo and hero video media launch-safe", () => {
    for (const asset of publicClientLogoAssets) {
      expect(asset.logoPath).toMatch(/^\/brand-logos\/.+\.webp$/);
      expect(asset.width).toBeGreaterThan(0);
      expect(asset.height).toBeGreaterThan(0);
      expect(asset.alt).toContain("logo");
    }
    for (const asset of clientLogoAssets.filter((item) => item.permissionStatus === "permission-review")) {
      expect(asset.publicUsage).toBe(false);
    }
    for (const locale of locales) {
      expect(getHomeContent(locale as Locale).heroVideo.videoUrl).toBeUndefined();
    }
    const videoSource = source("src/components/marketing/home/spokesperson-video-card.tsx");
    expect(videoSource).toContain('preload="none"');
    expect(videoSource).not.toContain("autoPlay");
  });

  it("protects pricing query-tab accessibility and state behavior", () => {
    const tabs = source("src/components/marketing/pricing/pricing-tabs.tsx");
    const flow = source("src/components/marketing/pricing/pricing-interactive-flow.tsx");
    const languageSwitcher = source("src/components/marketing/layout/language-switcher.tsx");

    expect(tabs).toContain('role="tablist"');
    expect(tabs).toContain('role="tab"');
    expect(tabs).toContain("aria-selected={selected}");
    expect(tabs).toContain("aria-controls={`pricing-panel-${tab.id}`}");
    expect(tabs).toContain('event.key === "ArrowRight"');
    expect(flow).toContain("resolvePricingTabId");
    expect(flow).toContain("window.history.pushState");
    expect(flow).toContain("<details");
    expect(languageSwitcher).toContain("isPricingTabId");
    expect(languageSwitcher).toContain('next.set("tab", tab)');
  });

  it("keeps navigation, radial map, cookie preferences, and forms keyboard-readable", () => {
    const header = source("src/components/marketing/layout/site-header.tsx");
    const radialMap = source("src/components/marketing/home/search-ecosystem-map.tsx");
    const cookiePrefs = source("src/components/marketing/trust/cookie-preferences-client.tsx");
    const leadForm = source("src/components/marketing/leads/lead-form-client.tsx");
    const dataRequest = source("src/components/marketing/trust/data-request-form-client.tsx");

    expect(header).toContain("aria-expanded={mobileOpen}");
    expect(header).toContain('aria-controls="mobile-primary-menu"');
    expect(header).toContain("mobileTriggerRef.current?.focus()");
    expect(radialMap).toContain("aria-label={surface.ariaLabel}");
    expect(radialMap).toContain("aria-pressed={isActive}");
    expect(radialMap).toContain("onFocus={() => setActiveId(surface.id)}");
    expect(cookiePrefs).toContain("htmlFor={id}");
    expect(leadForm).toContain("focusFirstError");
    expect(leadForm).toContain("validationSummary");
    expect(dataRequest).toContain("errorSummaryRef");
    expect(dataRequest).toContain("aria-invalid");
  });

  it("keeps known responsive overflow protections in place", () => {
    expect(source("src/app/globals.css")).toContain("overflow-x: clip");
    expect(source("src/components/marketing/pricing/pricing-tabs.tsx")).toContain("overflow-x-auto");
    expect(source("src/components/marketing/insights/insight-block-renderer.tsx")).toContain("overflow-x-auto");
    expect(source("src/components/marketing/work/sample-audits-view.tsx")).toContain("scroll-px-2");
    expect(source("src/components/marketing/shared/client-logo-tile.tsx")).toContain("aspect-[9/5]");
    expect(source("src/components/marketing/layout/site-header.tsx")).toContain("clamp(6.25rem");
  });

  it("keeps footer trust/legal links localized", () => {
    for (const locale of locales) {
      const hrefs = getLocalizedSite(locale as Locale).footer.groups.flatMap((group) => group.links.map((link) => link.href));
      expect(hrefs).toContain(locale === "en" ? "/privacy-policy" : `/${locale}/privacy-policy`);
      expect(hrefs).toContain(locale === "en" ? "/cookie-preferences" : `/${locale}/cookie-preferences`);
      expect(hrefs).toContain(locale === "en" ? "/data-request" : `/${locale}/data-request`);
    }
  });
});
