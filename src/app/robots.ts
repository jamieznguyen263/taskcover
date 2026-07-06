import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

const canonicalHost = new URL(siteConfig.url).host;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin",
        "/admin/",
        "/api",
        "/api/",
        "/thank-you",
        "/fr/thank-you",
        "/es/thank-you",
        "/*/preview",
        "/preview/",
      ],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: canonicalHost,
  };
}
