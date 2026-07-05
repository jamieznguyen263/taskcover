import Image from "next/image";
import Link from "next/link";
import type { ClientLogoProof } from "@/content/home.types";
import { cn } from "@/lib/utils";

type LogoLike = Pick<
  ClientLogoProof,
  "alt" | "background" | "clientName" | "height" | "href" | "id" | "src" | "width"
>;

export function ClientLogoMark({
  logo,
  compact = false,
  priority,
  sizes,
  className,
}: {
  logo: LogoLike;
  compact?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative flex aspect-[9/5] items-center justify-center overflow-hidden rounded-xl border",
        logo.background === "dark"
          ? "border-graphite/10 bg-graphite"
          : "border-line-soft bg-white",
        className,
      )}
    >
      <Image
        src={logo.src}
        alt={logo.alt}
        width={logo.width}
        height={logo.height}
        priority={priority}
        sizes={sizes ?? (compact ? "(max-width: 640px) 45vw, 18vw" : "256px")}
        className="h-full w-full object-contain transition duration-300 group-hover/logo:scale-[1.025]"
      />
    </span>
  );
}

function LogoTileContent({
  logo,
  compact,
  showLabel,
  priority,
  sizes,
}: {
  logo: LogoLike;
  compact: boolean;
  showLabel: boolean;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <>
      <ClientLogoMark logo={logo} compact={compact} priority={priority} sizes={sizes} />
      {showLabel ? (
        <span className="mt-2 block truncate px-1 text-xs font-semibold text-secondary">
          {logo.clientName}
        </span>
      ) : null}
    </>
  );
}

export function ClientLogoTile({
  logo,
  href,
  compact = false,
  showLabel = true,
  priority,
  sizes,
  className,
}: {
  logo: LogoLike;
  href?: string;
  compact?: boolean;
  showLabel?: boolean;
  priority?: boolean;
  sizes?: string;
  className?: string;
}) {
  const tileClassName = cn(
    "group/logo relative overflow-hidden rounded-2xl border border-line bg-white p-2 shadow-[0_14px_38px_-28px_rgba(20,31,36,0.72)]",
    compact ? "min-h-28" : "w-56 shrink-0 sm:w-64",
    href &&
      "transition hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-[0_22px_48px_-28px_rgba(24,138,172,0.55)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal",
    className,
  );

  if (href) {
    return (
      <Link href={href} aria-label={logo.alt} className={tileClassName}>
        <LogoTileContent
          logo={logo}
          compact={compact}
          showLabel={showLabel}
          priority={priority}
          sizes={sizes}
        />
      </Link>
    );
  }

  return (
    <div className={tileClassName}>
      <LogoTileContent
        logo={logo}
        compact={compact}
        showLabel={showLabel}
        priority={priority}
        sizes={sizes}
      />
    </div>
  );
}
