import type { ClientLogoProof } from "./home.types";
import type { CaseStudySlug } from "./work.types";

type LogoProofBase = Omit<ClientLogoProof, "alt" | "href"> & {
  slug: CaseStudySlug;
};

export const verifiedClientLogoProofBase = [
  {
    slug: "british-university-vietnam",
    clientName: "British University Vietnam",
    src: "/case-studies/british-university-vietnam/image-1.webp",
    width: 1080,
    height: 600,
    background: "dark",
  },
  {
    slug: "casa-madera",
    clientName: "Casa Madera",
    src: "/case-studies/casa-madera/image-1.webp",
    width: 1080,
    height: 600,
    background: "dark",
  },
  {
    slug: "the-bamboo-bar",
    clientName: "The Bamboo Bar",
    src: "/case-studies/the-bamboo-bar/image-1.webp",
    width: 1080,
    height: 600,
    background: "dark",
  },
  {
    slug: "matthew-jeffery-law-firm",
    clientName: "Matthew Jeffery Law Firm",
    src: "/case-studies/matthew-jeffery-law-firm/image-1.webp",
    width: 1400,
    height: 778,
    background: "light",
  },
  {
    slug: "skatepro",
    clientName: "SkatePro",
    src: "/case-studies/skatepro/image-1.webp",
    width: 1080,
    height: 600,
    background: "dark",
  },
  {
    slug: "agoda",
    clientName: "Agoda",
    src: "/case-studies/agoda/image-1.webp",
    width: 1400,
    height: 788,
    background: "dark",
  },
  {
    slug: "avis",
    clientName: "Avis",
    src: "/case-studies/avis/image-1.webp",
    width: 1400,
    height: 778,
    background: "light",
  },
  {
    slug: "novaworld",
    clientName: "NovaWorld",
    src: "/case-studies/novaworld/image-1.webp",
    width: 1400,
    height: 778,
    background: "light",
  },
  {
    slug: "ccleaner",
    clientName: "CCleaner",
    src: "/case-studies/ccleaner/image-1.webp",
    width: 1080,
    height: 600,
    background: "dark",
  },
  {
    slug: "fwd-insurance",
    clientName: "FWD Insurance",
    src: "/case-studies/fwd-insurance/image-1.webp",
    width: 1080,
    height: 600,
    background: "dark",
  },
] as const satisfies readonly LogoProofBase[];

export function buildClientLogoProofAssets({
  hrefPrefix = "",
  alt,
}: {
  hrefPrefix?: string;
  alt: (clientName: string) => string;
}): ClientLogoProof[] {
  const prefix = hrefPrefix.replace(/\/$/, "");
  return verifiedClientLogoProofBase.map(({ slug, ...asset }) => ({
    ...asset,
    alt: alt(asset.clientName),
    href: `${prefix}/work/case-studies/${slug}`,
  }));
}
