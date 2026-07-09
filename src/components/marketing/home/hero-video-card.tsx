"use client";

import * as React from "react";
import { Play, Sparkles, Video, X } from "lucide-react";
import type { HeroVideoContent } from "@/content/home.types";

export function HeroVideoCard({ video }: { video: HeroVideoContent }) {
  const [canLoadPreview, setCanLoadPreview] = React.useState(false);
  const [previewLoaded, setPreviewLoaded] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const playerIframeRef = React.useRef<HTMLIFrameElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const hasPlayer = Boolean(video.playerIframeUrl);

  React.useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 768px)");
    const update = () => {
      const shouldLoad = Boolean(video.previewIframeUrl) && desktop.matches && !reducedMotion.matches;
      setCanLoadPreview(shouldLoad);
      if (!shouldLoad) setPreviewLoaded(false);
    };

    update();
    desktop.addEventListener("change", update);
    reducedMotion.addEventListener("change", update);

    return () => {
      desktop.removeEventListener("change", update);
      reducedMotion.removeEventListener("change", update);
    };
  }, [video.previewIframeUrl]);

  React.useEffect(() => {
    if (!isOpen) return;

    const trigger = triggerRef.current;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
      if (event.key !== "Tab") return;

      const focusable = [closeButtonRef.current, playerIframeRef.current].filter(Boolean) as HTMLElement[];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
      trigger?.focus();
    };
  }, [isOpen]);

  return (
    <div className="relative min-w-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-brand-gradient-soft opacity-80 blur-2xl"
      />
      <div className="relative rounded-[1.5rem] bg-brand-gradient p-px shadow-[0_28px_80px_-38px_rgba(24,138,172,0.8)] md:-rotate-1">
        <div className="overflow-hidden rounded-[calc(1.5rem-1px)] border border-white/70 bg-white">
          <div className="relative aspect-video overflow-hidden bg-surface-tint">
            {video.posterUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={video.posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(16,230,106,0.22),transparent_30%),radial-gradient(circle_at_76%_35%,rgba(25,125,180,0.22),transparent_34%),linear-gradient(135deg,#f8fafc,#eaf5f8_52%,#ffffff)]"
              />
            )}
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(15,23,42,0.24))]" />
            {canLoadPreview && video.previewIframeUrl ? (
              <iframe
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 h-full w-full transition-opacity duration-300 motion-reduce:transition-none ${
                  previewLoaded ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
                onLoad={() => setPreviewLoaded(true)}
                referrerPolicy="strict-origin-when-cross-origin"
                src={video.previewIframeUrl}
                tabIndex={-1}
                title={video.previewTitle}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            ) : null}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-graphite/55 to-transparent" />
            <button
              ref={triggerRef}
              type="button"
              disabled={!hasPlayer}
              aria-label={hasPlayer ? video.playLabel : video.unavailableLabel}
              onClick={() => {
                if (hasPlayer) setIsOpen(true);
              }}
              className="group absolute bottom-4 left-4 inline-flex max-w-[calc(100%-2rem)] items-center gap-2 rounded-full border border-white/65 bg-white/92 px-4 py-2 text-sm font-semibold text-graphite shadow-[0_16px_40px_rgba(15,23,42,0.2)] backdrop-blur transition hover:-translate-y-0.5 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal disabled:cursor-not-allowed disabled:opacity-70 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow-[0_10px_24px_rgba(24,138,172,0.28)]">
                <Play className="ml-0.5 h-4 w-4" aria-hidden="true" />
              </span>
              <span className="truncate">{hasPlayer ? video.playLabel : video.unavailableLabel}</span>
            </button>
          </div>

          <div className="grid gap-4 border-t border-line bg-surface-tint p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-teal">
                  <Video className="h-4 w-4" aria-hidden="true" />
                  {video.eyebrow}
                </p>
                <h2 className="mt-2 text-base font-semibold tracking-tight text-graphite">{video.title}</h2>
                <p className="mt-1 text-sm leading-6 text-secondary">{video.caption}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {video.trustChips.slice(0, 3).map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-brand-teal/20 bg-white px-3 py-1 text-xs font-semibold text-secondary"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="hero-video-modal-title"
          className="fixed inset-0 z-50 grid place-items-center bg-graphite/72 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsOpen(false);
          }}
        >
          <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-white/25 bg-white shadow-[0_30px_100px_rgba(15,23,42,0.45)]">
            <div className="flex items-center justify-between gap-4 border-b border-line bg-surface-tint px-4 py-3 sm:px-5">
              <h2 id="hero-video-modal-title" className="min-w-0 text-base font-semibold tracking-tight text-graphite">
                {video.modalTitle}
              </h2>
              <button
                ref={closeButtonRef}
                type="button"
                aria-label={video.closeLabel}
                onClick={() => setIsOpen(false)}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line bg-white text-graphite shadow-sm transition hover:bg-surface-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-teal motion-reduce:transition-none"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="aspect-video bg-graphite">
              <iframe
                ref={playerIframeRef}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
                src={video.playerIframeUrl}
                title={video.modalTitle}
                allow="accelerometer; gyroscope; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
