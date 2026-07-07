import { renderTaskcoverSitemapXml } from "@/lib/sitemap";

export const dynamic = "force-dynamic";

export async function GET() {
  const xml = await renderTaskcoverSitemapXml();
  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
