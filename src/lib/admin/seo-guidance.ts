import type { InsightArticle } from "@/content/insights.types";

export type GuidanceStatus = "blocking" | "recommended" | "optional" | "passed";

export type GuidanceResult = {
  status: GuidanceStatus;
  code: string;
  field: string;
  message: string;
};

/**
 * Length guidance uses character counts as an approximation of SERP pixel
 * limits. These are honest editorial heuristics, not scores or ranking
 * predictions: exceeding them means truncation is likely, nothing more.
 */
export const SEO_TITLE_MAX = 60;
export const SEO_TITLE_MIN = 30;
export const META_DESCRIPTION_MAX = 160;
export const META_DESCRIPTION_MIN = 70;

export function titleGuidance(title: string): GuidanceResult {
  const field = "metaTitle";
  if (!title.trim()) return { status: "blocking", code: "title-missing", field, message: "SEO title is required before publishing." };
  if (title.length > SEO_TITLE_MAX) return { status: "recommended", code: "title-long", field, message: `Title is ${title.length} characters. Google typically truncates titles beyond ~${SEO_TITLE_MAX} characters.` };
  if (title.length < SEO_TITLE_MIN) return { status: "optional", code: "title-short", field, message: `Title is ${title.length} characters. There is room to add specificity (guide length: ${SEO_TITLE_MIN}–${SEO_TITLE_MAX}).` };
  return { status: "passed", code: "title-ok", field, message: "Title length is within the typical display range." };
}

export function descriptionGuidance(description: string): GuidanceResult {
  const field = "metaDescription";
  if (!description.trim()) return { status: "blocking", code: "description-missing", field, message: "Meta description is required before publishing." };
  if (description.length > META_DESCRIPTION_MAX) return { status: "recommended", code: "description-long", field, message: `Description is ${description.length} characters. Google typically truncates beyond ~${META_DESCRIPTION_MAX} characters.` };
  if (description.length < META_DESCRIPTION_MIN) return { status: "optional", code: "description-short", field, message: `Description is ${description.length} characters. Consider using the available space (guide length: ${META_DESCRIPTION_MIN}–${META_DESCRIPTION_MAX}).` };
  return { status: "passed", code: "description-ok", field, message: "Description length is within the typical display range." };
}

export function slugGuidance(slug: string, publishedSlug: string | null): GuidanceResult[] {
  const results: GuidanceResult[] = [];
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    results.push({ status: "blocking", code: "slug-invalid", field: "slug", message: "Slug must be lowercase kebab-case (letters, numbers, hyphens)." });
  } else {
    results.push({ status: "passed", code: "slug-ok", field: "slug", message: "Slug format is valid." });
  }
  if (publishedSlug && publishedSlug !== slug) {
    results.push({
      status: "recommended",
      code: "slug-changed",
      field: "slug",
      message: `Slug differs from the published version (“${publishedSlug}”). Publishing will change the URL — plan a redirect before publishing.`,
    });
  }
  return results;
}

export function canonicalGuidance(article: InsightArticle): GuidanceResult {
  const field = "canonical";
  const prefix = article.locale === "en" ? "" : `/${article.locale}`;
  const expected = `${prefix}/insights/${article.category}/${article.slug}`;
  if (!article.metadata.canonical.trim()) return { status: "blocking", code: "canonical-missing", field, message: "Canonical path is required." };
  if (article.metadata.canonical !== expected) {
    return { status: "recommended", code: "canonical-differs", field, message: `Canonical differs from the default article URL (${expected}). Only keep a custom canonical when consolidating duplicates intentionally.` };
  }
  return { status: "passed", code: "canonical-ok", field, message: "Canonical matches the article URL." };
}

export function socialGuidance(article: InsightArticle): GuidanceResult[] {
  const { metadata } = article;
  const results: GuidanceResult[] = [];
  const check = (value: string, fallback: string, fallbackLabel: string, field: string, label: string) => {
    if (value.trim()) results.push({ status: "passed", code: `${field}-ok`, field, message: `${label} is set.` });
    else if (fallback.trim()) results.push({ status: "optional", code: `${field}-fallback`, field, message: `${label} is empty; the ${fallbackLabel} will be reused.` });
    else results.push({ status: "recommended", code: `${field}-missing`, field, message: `${label} is empty and has no fallback.` });
  };
  check(metadata.ogTitle, metadata.metaTitle, "SEO title", "ogTitle", "Open Graph title");
  check(metadata.ogDescription, metadata.metaDescription, "meta description", "ogDescription", "Open Graph description");
  check(metadata.twitterTitle, metadata.ogTitle || metadata.metaTitle, metadata.ogTitle.trim() ? "Open Graph title" : "SEO title", "twitterTitle", "X/Twitter title");
  check(metadata.twitterDescription, metadata.ogDescription || metadata.metaDescription, metadata.ogDescription.trim() ? "Open Graph description" : "meta description", "twitterDescription", "X/Twitter description");
  if (!metadata.ogImage.trim()) results.push({ status: "recommended", code: "ogImage-missing", field: "ogImage", message: "Social share image is empty. Link previews will have no image." });
  else results.push({ status: "passed", code: "ogImage-ok", field: "ogImage", message: "Social share image is set." });
  return results;
}

export function metadataGuidance(article: InsightArticle, publishedSlug: string | null): GuidanceResult[] {
  return [
    titleGuidance(article.metadata.metaTitle),
    descriptionGuidance(article.metadata.metaDescription),
    ...slugGuidance(article.slug, publishedSlug),
    canonicalGuidance(article),
    ...socialGuidance(article),
    article.metadata.robots.includes("noindex")
      ? { status: "recommended" as const, code: "robots-noindex", field: "robots", message: "Robots is set to noindex. Publishing with noindex is blocked by Publish QA." }
      : { status: "passed" as const, code: "robots-ok", field: "robots", message: "Robots allows indexing." },
  ];
}
