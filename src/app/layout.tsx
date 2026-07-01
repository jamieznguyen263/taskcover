import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site";
import { organizationSchema, serializeJsonLd } from "@/lib/seo";
import { SiteHeader } from "@/components/marketing/layout/site-header";
import { SiteFooter } from "@/components/marketing/layout/site-footer";
import { HtmlLangSync } from "@/components/marketing/layout/html-lang-sync";

/**
 * Inline pre-paint script that sets `<html lang>` from the URL route prefix
 * before first paint, avoiding a flash of the default ("en") on /fr and /es.
 *
 * The route prefix is the only source of truth — no cookies are read.
 * Kept inline (not a separate file) so it runs synchronously during HTML
 * parsing, before React hydration, and before the first paint.
 */
const htmlLangPrePaint = `(function(){try{var p=location.pathname||'/';var m=p.match(/^\\/(fr|es)(\\/|$)/);var l=m?m[1]:'en';document.documentElement.lang=l;}catch(e){}})();`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "SEO Agency for Google, AI Search & Revenue Growth",
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  alternates: { canonical: siteConfig.url },
  keywords: [
    "SEO agency",
    "AI search optimization",
    "technical SEO",
    "search growth",
    "USA SEO agency",
    "Canada SEO agency",
    "Australia SEO agency",
  ],
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  icons: {
    icon: siteConfig.logo.icon,
    shortcut: siteConfig.logo.icon,
    apple: siteConfig.logo.icon,
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    locale: siteConfig.locale,
    url: siteConfig.url,
    title: "SEO Agency for Google, AI Search & Revenue Growth",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Agency for Google, AI Search & Revenue Growth",
    description: siteConfig.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Set <html lang> from the route prefix before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: htmlLangPrePaint }} />
      </head>
      <body className="min-h-full flex flex-col bg-white text-graphite">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(organizationSchema()),
          }}
        />
        {/* Keep <html lang> in sync on client-side SPA navigations. */}
        <HtmlLangSync />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}