"use client";

import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/i18n";
import { NotFoundPage } from "./trust-pages";

export function NotFoundAutoLocale() {
  return <NotFoundPage locale={getLocaleFromPathname(usePathname())} />;
}

