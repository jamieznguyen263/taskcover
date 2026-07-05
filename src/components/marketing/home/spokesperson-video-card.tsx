"use client";

import * as React from "react";
import { Play, Sparkles, Video } from "lucide-react";
import type { HeroVideoContent } from "@/content/home.types";

export function SpokespersonVideoCard({ video }: { video: HeroVideoContent }) {
  const [shouldLoadVideo, setShouldLoadVideo] = React.useState(false);
  const hasVideo = Boolean(video.videoUrl);

  return (
    <div className="relative min-w-0">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-4 rounded-[2.25rem] bg-brand-gradient-soft opacity-80 blur-2xl"
      />
      <div className="relative rounded-[1.75rem] bg-brand-gradient p-px shadow-[0_28px_80px_-38px_rgba(24,138,172,0.8)]">
        <div className="overflow-hidden rounded-[calc(1.75rem-1px)] border border-white/60 bg-white">
          <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
            {hasVideo && shouldLoadVideo ? (
              <video
                className="h-full w-full object-cover"
                controls
                playsInline
                preload="none"
                poster={video.posterUrl}
              >
                <source src={video.videoUrl} />
              </video>
            ) : (
              <button
                type="button"
                aria-label={hasVideo ? video.playLabel : video.unavailableLabel}
                aria-disabled={!hasVideo}
                onClick={() => {
                  if (hasVideo) setShouldLoadVideo(true);
                }}
                className="group relative flex h-full w-full items-center justify-center overflow-hidden text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-brand-green"
              >
                {video.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={video.posterUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <span aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(circle_at_22%_18%,rgba(16,230,106,0.24),transparent_28%),radial-gradient(circle_at_76%_35%,rgba(25,125,180,0.28),transparent_32%),linear-gradient(135deg,#10191d,#142b31_52%,#0d1518)]" />
                )}
                <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,12,15,0.05),rgba(4,12,15,0.55))]" />
                <span className="relative grid max-w-sm gap-4 px-6 text-center">
                  <span className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/18 text-white shadow-[0_16px_45px_rgba(0,0,0,0.32)] backdrop-blur transition group-hover:scale-105 group-hover:bg-white/24">
                    <Play className="ml-1 h-7 w-7" aria-hidden="true" />
                  </span>
                  <span className="grid gap-2">
                    <span className="inline-flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-brand-green">
                      <Video className="h-4 w-4" aria-hidden="true" />
                      {video.eyebrow}
                    </span>
                    <span className="text-balance text-2xl font-semibold tracking-tight text-white">
                      {video.fallbackTitle}
                    </span>
                    <span className="text-sm leading-6 text-white/78">{video.fallbackBody}</span>
                  </span>
                </span>
              </button>
            )}
          </div>

          <div className="grid gap-4 border-t border-line bg-surface-tint p-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-gradient text-white">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <h2 className="text-base font-semibold tracking-tight text-graphite">{video.title}</h2>
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
    </div>
  );
}
