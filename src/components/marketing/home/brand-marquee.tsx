"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "motion/react";
import { Container } from "@/components/marketing/shared/container";
import type { ClientLogoProof, CtaItem } from "@/content/home.types";
import { cn } from "@/lib/utils";

function LogoCard({ logo, compact = false }: { logo: ClientLogoProof; compact?: boolean }) {
  return (
    <Link
      href={logo.href}
      aria-label={logo.alt}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-[0_14px_38px_-28px_rgba(20,31,36,0.72)] transition hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-[0_22px_48px_-28px_rgba(24,138,172,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
        compact ? "min-h-28" : "w-56 shrink-0 sm:w-64",
      )}
    >
      <span
        className={cn(
          "relative flex aspect-[9/5] items-center justify-center overflow-hidden rounded-xl border",
          logo.background === "dark"
            ? "border-white/10 bg-graphite"
            : "border-line-soft bg-surface-soft",
        )}
      >
        <Image
          src={logo.src}
          alt={logo.alt}
          width={logo.width}
          height={logo.height}
          sizes={compact ? "(max-width: 640px) 45vw, 18vw" : "256px"}
          className="h-full w-full object-contain transition duration-300 group-hover:scale-[1.025]"
        />
      </span>
      <span className="mt-2 block truncate px-1 text-xs font-semibold text-secondary">
        {logo.clientName}
      </span>
    </Link>
  );
}

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
          <li key={`${logo.src}-${index}`} className="flex">
            <LogoCard logo={logo} />
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
            <LogoCard key={logo.src} logo={logo} compact />
          ))}
        </div>

        {reduceMotion ? (
          <div className="hidden grid-cols-2 gap-4 py-2 sm:grid lg:grid-cols-5">
            {logos.map((logo) => (
              <LogoCard key={logo.src} logo={logo} compact />
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
