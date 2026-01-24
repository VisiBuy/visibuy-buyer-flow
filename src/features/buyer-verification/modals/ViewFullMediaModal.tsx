"use client";

import { useEffect, useState } from "react";
import { ZoomableMedia } from "../components/ZoomableMedia";
import { BrandLogo } from "@/shared/components/ui/BrandLogo";

type MediaItem = {
  id: string;
  src: string;
  alt: string;
  type?: "image" | "video";
};

type ViewFullMediaModalProps = {
  open: boolean;
  onClose: () => void;
  mainMedia: MediaItem;
  thumbnails?: MediaItem[];
};

// Same helper we used in MediaGallery
function isLikelyVideoUrl(url: string): boolean {
  if (!url) return false;
  const lower = url.toLowerCase();
  return (
    lower.includes("/video/upload") ||
    lower.endsWith(".mp4") ||
    lower.endsWith(".mov") ||
    lower.endsWith(".webm")
  );
}

export function ViewFullMediaModal({
  open,
  onClose,
  mainMedia,
  thumbnails = [],
}: ViewFullMediaModalProps) {
  const [activeMedia, setActiveMedia] = useState<MediaItem>(mainMedia);

  // when modal opens or mainMedia changes, reset active media
  useEffect(() => {
    if (open) {
      setActiveMedia(mainMedia);
    }
  }, [open, mainMedia]);

  // lock body scroll while modal is open
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  // ensure we don’t duplicate the main media id if it’s already in thumbnails
  const allThumbs: MediaItem[] = [
    mainMedia,
    ...thumbnails.filter((t) => t.id !== mainMedia.id),
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose} // click outside closes
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl bg-[var(--visibuyb-25,#FBFEFF)] shadow-xl"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {/* Top bar (logo + close) */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
          <div className="flex items-center gap-2">
            <BrandLogo size={136} showTagline={false} />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-100"
            aria-label="Close media viewer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-auto space-y-4 px-6 py-4">
          {/* Big zoomable viewer */}
          <div className="relative">
            <ZoomableMedia
              key={activeMedia.id} // reset zoom when switching
              src={activeMedia.src}
              alt={activeMedia.alt}
              type={activeMedia.type}
            />
          </div>

          {/* Thumbnails row */}
          {allThumbs.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {allThumbs.map((thumb) => {
                const isActive = thumb.id === activeMedia.id;
                const isVideo =
                  thumb.type === "video" || isLikelyVideoUrl(thumb.src);

                return (
                  <button
                    key={thumb.id}
                    type="button"
                    onClick={() => setActiveMedia(thumb)}
                    className={`relative h-20 w-32 overflow-hidden rounded-xl border bg-slate-200 ${
                      isActive
                        ? "border-[var(--brand-colorvisibuy-blue,#007BFF)] ring-2 ring-[var(--brand-colorvisibuy-blue,#007BFF)]"
                        : "border-transparent"
                    }`}
                  >
                    <img
                      src={thumb.src}
                      alt={thumb.alt}
                      className="h-full w-full object-cover"
                    />
                    {isVideo && (
                      <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-xs font-semibold text-white/90 bg-black/20">
                        ▶
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
