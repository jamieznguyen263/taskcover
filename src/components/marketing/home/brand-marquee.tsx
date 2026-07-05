"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/marketing/shared/container";
import { ClientLogoTile } from "@/components/marketing/shared/client-logo-tile";
import type { ClientLogoProof, CtaItem } from "@/content/home.types";
import { cn } from "@/lib/utils";

function LogoRail({ logos }: { logos: readonly ClientLogoProof[] }) {
  const loop = [...logos, ...logos];
  return (
    <div className="group relative overflow-hidden py-2">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-white via-white/85 to-transparent sm:w-32"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-white via-white/85 to-transparent sm:w-32"
      />
      <ul className="flex w-max items-stretch gap-4 animate-[marquee_48s_linear_infinite] group-hover:[animation-play-state:paused]">
        {loop.map((logo, index) => (
          <li key={`${logo.id}-${index}`} className="flex">
            <ClientLogoTile logo={logo} href={logo.href} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function BrandMarquee({
  caption,
  logos,
  cta,
  className,
}: {
  caption: React.ReactNode;
  logos: readonly ClientLogoProof[];
  cta: CtaItem;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <Container className={cn("flex flex-col gap-6", className)}>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 text-center">
        <p className="text-sm font-medium leading-6 text-secondary sm:text-base">{caption}</p>
        <Link
          href={cta.href}
          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-sm font-semibold text-graphite shadow-sm transition hover:border-brand-teal hover:text-brand-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal"
        >
          {cta.label}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-teal/24 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-brand-teal/24 to-transparent"
        />

        <div className="grid grid-cols-2 gap-3 py-2 sm:hidden">
          {logos.map((logo) => (
            <ClientLogoTile key={logo.id} logo={logo} href={logo.href} compact />
          ))}
        </div>

        {reduceMotion ? (
          <div className="hidden grid-cols-2 gap-4 py-2 sm:grid lg:grid-cols-5">
            {logos.map((logo) => (
              <ClientLogoTile key={logo.id} logo={logo} href={logo.href} compact />
            ))}
          </div>
        ) : (
          <div className="hidden sm:block">
            <LogoRail logos={logos} />
          </div>
        )}
      </div>
    </Container>
  );
}
