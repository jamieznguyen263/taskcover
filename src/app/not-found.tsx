import type { Metadata } from "next";
import { NotFoundAutoLocale } from "@/components/marketing/trust/not-found-client";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <NotFoundAutoLocale />;
}
