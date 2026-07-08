import { describe, expect, it } from "vitest";
import { generateStaticParams as generateCaseStudyStaticParams } from "@/app/work/case-studies/[slug]/page";
import { generateStaticParams as generateSampleAuditStaticParams } from "@/app/work/sample-audits/[slug]/page";
import { generateStaticParams as generateLocalizedCaseStudyStaticParams } from "@/app/[locale]/work/case-studies/[slug]/page";
import { generateStaticParams as generateLocalizedSampleAuditStaticParams } from "@/app/[locale]/work/sample-audits/[slug]/page";

describe("work detail route static params", () => {
  it("includes launch-critical English work detail URLs", () => {
    expect(generateCaseStudyStaticParams()).toContainEqual({
      slug: "british-university-vietnam",
    });
    expect(generateSampleAuditStaticParams()).toContainEqual({
      slug: "technical-seo-audit",
    });
  });

  it("includes launch-critical localized work detail URLs with shared slugs", () => {
    for (const locale of ["fr", "es"]) {
      expect(generateLocalizedCaseStudyStaticParams()).toContainEqual({
        locale,
        slug: "british-university-vietnam",
      });
      expect(generateLocalizedSampleAuditStaticParams()).toContainEqual({
        locale,
        slug: "technical-seo-audit",
      });
    }
  });
});
