import type { ClientLogoProof } from "./home.types";
import type { CaseStudySlug } from "./work.types";

export type ClientLogoPermissionStatus =
  | "approved-case-study"
  | "permission-review";

export type ClientLogoSourceType =
  | "approved-case-study-asset"
  | "official-brand-hub"
  | "official-media-assets";

export type ClientLogoBackground = "dark" | "light";

export type ClientLogoAsset = {
  id: string;
  name: string;
  shortName?: string;
  logoPath?: string;
  format?: "svg" | "png" | "webp";
  width?: number;
  height?: number;
  preferredBackground: ClientLogoBackground;
  permissionStatus: ClientLogoPermissionStatus;
  sourceType: ClientLogoSourceType;
  sourceLabel: string;
  sourceUrl?: string;
  alt: string;
  caseStudySlug?: CaseStudySlug;
  publicUsage: boolean;
  usageLocations: readonly string[];
  notes: string;
};

export type PublicClientLogoAsset = ClientLogoAsset & {
  logoPath: string;
  format: "webp";
  width: number;
  height: number;
  caseStudySlug: CaseStudySlug;
  permissionStatus: "approved-case-study";
  publicUsage: true;
};

export const clientLogoAssets = [
  {
    id: "buv",
    name: "British University Vietnam",
    shortName: "BUV",
    logoPath: "/brand-logos/buv.webp",
    format: "webp",
    width: 1080,
    height: 600,
    preferredBackground: "dark",
    permissionStatus: "approved-case-study",
    sourceType: "approved-case-study-asset",
    sourceLabel: "Approved local case-study proof card",
    sourceUrl: "https://www.buv.edu.vn/en/",
    alt: "British University Vietnam logo",
    caseStudySlug: "british-university-vietnam",
    publicUsage: true,
    usageLocations: ["homepage proof strip", "case studies hub", "client results page"],
    notes: "Standalone transparent logo not present locally; standardized from approved local case-study asset.",
  },
  {
    id: "casa-madera",
    name: "Casa Madera",
    logoPath: "/brand-logos/casa-madera.webp",
    format: "webp",
    width: 1080,
    height: 600,
    preferredBackground: "dark",
    permissionStatus: "approved-case-study",
    sourceType: "approved-case-study-asset",
    sourceLabel: "Approved local case-study proof card",
    sourceUrl: "https://www.thecasamadera.com/",
    alt: "Casa Madera logo",
    caseStudySlug: "casa-madera",
    publicUsage: true,
    usageLocations: ["homepage proof strip", "case studies hub", "client results page"],
    notes: "Standalone transparent logo not present locally; standardized from approved local case-study asset.",
  },
  {
    id: "the-bamboo-bar",
    name: "The Bamboo Bar",
    shortName: "Bamboo Bar",
    logoPath: "/brand-logos/the-bamboo-bar.webp",
    format: "webp",
    width: 1080,
    height: 600,
    preferredBackground: "dark",
    permissionStatus: "approved-case-study",
    sourceType: "approved-case-study-asset",
    sourceLabel: "Approved local case-study proof card",
    sourceUrl: "https://www.mandarinoriental.com/en/bangkok/chao-phraya-river/dine/the-bamboo-bar",
    alt: "The Bamboo Bar logo",
    caseStudySlug: "the-bamboo-bar",
    publicUsage: true,
    usageLocations: ["homepage proof strip", "case studies hub", "client results page"],
    notes: "Standalone transparent logo not present locally; standardized from approved local case-study asset.",
  },
  {
    id: "matthew-jeffery-law-firm",
    name: "Matthew Jeffery Law Firm",
    shortName: "Matthew Jeffery",
    logoPath: "/brand-logos/matthew-jeffery-law-firm.webp",
    format: "webp",
    width: 1400,
    height: 778,
    preferredBackground: "dark",
    permissionStatus: "approved-case-study",
    sourceType: "approved-case-study-asset",
    sourceLabel: "Approved local case-study proof card",
    sourceUrl: "https://www.matthewjeffery.com/",
    alt: "Matthew Jeffery Law Firm logo",
    caseStudySlug: "matthew-jeffery-law-firm",
    publicUsage: true,
    usageLocations: ["homepage proof strip", "case studies hub", "client results page"],
    notes: "Standalone transparent logo not present locally; standardized from approved local case-study asset.",
  },
  {
    id: "skatepro",
    name: "SkatePro",
    logoPath: "/brand-logos/skatepro.webp",
    format: "webp",
    width: 1080,
    height: 600,
    preferredBackground: "dark",
    permissionStatus: "approved-case-study",
    sourceType: "approved-case-study-asset",
    sourceLabel: "Approved local case-study proof card",
    sourceUrl: "https://www.skatepro.com/",
    alt: "SkatePro logo",
    caseStudySlug: "skatepro",
    publicUsage: true,
    usageLocations: ["homepage proof strip", "case studies hub", "client results page"],
    notes: "Standalone transparent logo not present locally; standardized from approved local case-study asset.",
  },
  {
    id: "agoda",
    name: "Agoda",
    logoPath: "/brand-logos/agoda.webp",
    format: "webp",
    width: 1400,
    height: 788,
    preferredBackground: "dark",
    permissionStatus: "approved-case-study",
    sourceType: "approved-case-study-asset",
    sourceLabel: "Approved local case-study proof card",
    sourceUrl: "https://www.agoda.com/",
    alt: "Agoda logo",
    caseStudySlug: "agoda",
    publicUsage: true,
    usageLocations: ["homepage proof strip", "case studies hub", "client results page"],
    notes: "Standalone transparent logo not present locally; standardized from approved local case-study asset.",
  },
  {
    id: "avis",
    name: "Avis",
    logoPath: "/brand-logos/avis.webp",
    format: "webp",
    width: 1400,
    height: 778,
    preferredBackground: "dark",
    permissionStatus: "approved-case-study",
    sourceType: "approved-case-study-asset",
    sourceLabel: "Approved local case-study proof card",
    sourceUrl: "https://www.avis.com/en/home",
    alt: "Avis logo",
    caseStudySlug: "avis",
    publicUsage: true,
    usageLocations: ["homepage proof strip", "case studies hub", "client results page"],
    notes: "Standalone transparent logo not present locally; standardized from approved local case-study asset.",
  },
  {
    id: "novaworld",
    name: "NovaWorld",
    logoPath: "/brand-logos/novaworld.webp",
    format: "webp",
    width: 1400,
    height: 778,
    preferredBackground: "dark",
    permissionStatus: "approved-case-study",
    sourceType: "approved-case-study-asset",
    sourceLabel: "Approved local case-study proof card",
    alt: "NovaWorld logo",
    caseStudySlug: "novaworld",
    publicUsage: true,
    usageLocations: ["homepage proof strip", "case studies hub", "client results page"],
    notes: "Standalone transparent logo and official public source were not clear locally; standardized from approved local case-study asset.",
  },
  {
    id: "ccleaner",
    name: "CCleaner",
    logoPath: "/brand-logos/ccleaner.webp",
    format: "webp",
    width: 1080,
    height: 600,
    preferredBackground: "dark",
    permissionStatus: "approved-case-study",
    sourceType: "approved-case-study-asset",
    sourceLabel: "Approved local case-study proof card",
    sourceUrl: "https://www.ccleaner.com/",
    alt: "CCleaner logo",
    caseStudySlug: "ccleaner",
    publicUsage: true,
    usageLocations: ["homepage proof strip", "case studies hub", "client results page"],
    notes: "Standalone transparent logo not present locally; standardized from approved local case-study asset.",
  },
  {
    id: "fwd-insurance",
    name: "FWD Insurance",
    shortName: "FWD",
    logoPath: "/brand-logos/fwd-insurance.webp",
    format: "webp",
    width: 1080,
    height: 600,
    preferredBackground: "dark",
    permissionStatus: "approved-case-study",
    sourceType: "approved-case-study-asset",
    sourceLabel: "Approved local case-study proof card",
    sourceUrl: "https://www.fwd.com.vn/en/",
    alt: "FWD Insurance logo",
    caseStudySlug: "fwd-insurance",
    publicUsage: true,
    usageLocations: ["homepage proof strip", "case studies hub", "client results page"],
    notes: "Standalone transparent logo not present locally; standardized from approved local case-study asset.",
  },
  {
    id: "british-council",
    name: "British Council",
    preferredBackground: "light",
    permissionStatus: "permission-review",
    sourceType: "official-brand-hub",
    sourceLabel: "British Council Brand Hub",
    sourceUrl: "https://www.britishcouncil.org/",
    alt: "British Council logo",
    publicUsage: false,
    usageLocations: ["asset inventory only"],
    notes: "Permission and a local official logo file are required before public proof-strip usage.",
  },
  {
    id: "skyscanner",
    name: "Skyscanner",
    preferredBackground: "light",
    permissionStatus: "permission-review",
    sourceType: "official-media-assets",
    sourceLabel: "Skyscanner media assets",
    sourceUrl: "https://www.skyscanner.net/media/media-assets",
    alt: "Skyscanner logo",
    publicUsage: false,
    usageLocations: ["asset inventory only"],
    notes: "Permission and a local official logo file are required before public proof-strip usage; do not imply sponsorship or endorsement.",
  },
] as const satisfies readonly ClientLogoAsset[];

export function isPublicClientLogoAsset(
  asset: ClientLogoAsset
): asset is PublicClientLogoAsset {
  return (
    asset.publicUsage === true &&
    asset.permissionStatus === "approved-case-study" &&
    typeof asset.logoPath === "string" &&
    asset.format === "webp" &&
    typeof asset.width === "number" &&
    typeof asset.height === "number" &&
    typeof asset.caseStudySlug === "string"
  );
}

export const publicClientLogoAssets: PublicClientLogoAsset[] = (
  clientLogoAssets as readonly ClientLogoAsset[]
).filter(isPublicClientLogoAsset);

export function getClientLogoAsset(id: string): ClientLogoAsset | undefined {
  return clientLogoAssets.find((asset) => asset.id === id);
}

export function getPublicClientLogoAssetByCaseStudySlug(
  slug: CaseStudySlug
): PublicClientLogoAsset | undefined {
  return publicClientLogoAssets.find((asset) => asset.caseStudySlug === slug);
}

export function buildClientLogoProofAsset({
  asset,
  hrefPrefix = "",
  alt,
}: {
  asset: PublicClientLogoAsset;
  hrefPrefix?: string;
  alt: (clientName: string) => string;
}): ClientLogoProof {
  const prefix = hrefPrefix.replace(/\/$/, "");
  return {
    id: asset.id,
    clientName: asset.name,
    shortName: asset.shortName,
    src: asset.logoPath,
    width: asset.width,
    height: asset.height,
    background: asset.preferredBackground,
    permissionStatus: asset.permissionStatus,
    sourceType: asset.sourceType,
    caseStudySlug: asset.caseStudySlug,
    alt: alt(asset.name),
    href: `${prefix}/work/case-studies/${asset.caseStudySlug}`,
  };
}

export function buildClientLogoProofAssets({
  hrefPrefix = "",
  alt,
}: {
  hrefPrefix?: string;
  alt: (clientName: string) => string;
}): ClientLogoProof[] {
  return publicClientLogoAssets.map((asset) =>
    buildClientLogoProofAsset({ asset, hrefPrefix, alt })
  );
}
