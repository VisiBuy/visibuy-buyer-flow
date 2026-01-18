"use client";

import Image from "next/image";

type MediaItem = {
  id: string;
  src: string;
  alt: string;
};

type MediaGalleryProps = {
  mainMedia: MediaItem;
  thumbnails: MediaItem[];
  timestamp?: string;
  onViewFullMedia?: () => void;
};

export function MediaGallery({
  mainMedia,
  thumbnails,
  timestamp,
  onViewFullMedia,
}: MediaGalleryProps) {
  // simple safety fallback so src is never empty
  const safeMainSrc = mainMedia?.src || "/placeholder-main.jpg";

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
        <h2 className="text-lg font-semibold sm:text-xl">Verification Media</h2>
        <button
          type="button"
          onClick={onViewFullMedia}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500"
        >
          <span className="inline-block h-3 w-3 rounded border border-slate-400" />
          View Full Media
        </button>
      </div>

      {/* Grid */}
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,1fr)]">
        {/* MAIN MEDIA – single aspect container so there’s no extra grey */}
        <button
          type="button"
          onClick={onViewFullMedia}
          className="relative w-full overflow-hidden rounded-2xl bg-slate-200 aspect-[4/3]"
        >
          <Image
            src={safeMainSrc}
            alt={mainMedia?.alt || "Verified product"}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 720px, 100vw"
          />
          {timestamp && (
            <div className="absolute inset-x-0 bottom-3 text-center text-2xl font-extrabold text-slate-900/85 drop-shadow-[0_1px_1px_rgba(255,255,255,0.7)] sm:text-3xl">
              {timestamp}
            </div>
          )}
        </button>

        {/* THUMBNAILS */}
        <div
          className="
            flex gap-3 overflow-x-auto pb-1
            sm:gap-4
            lg:flex-col lg:pb-0
            lg:max-h-[380px] lg:overflow-y-auto lg:overflow-x-hidden
            lg:pr-1
          "
        >
          {thumbnails.map((thumb, idx) => (
            <button
              key={thumb.id ?? `thumb-${idx}`}
              type="button"
              onClick={onViewFullMedia}
              className="
                relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-200
                w-28 flex-none
                lg:w-full
              "
            >
              <Image
                src={thumb.src}
                alt={thumb.alt}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 240px, 30vw"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
