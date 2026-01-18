"use client";

import { useEffect, useState } from "react";
import { ZoomableMedia } from "../components/ZoomableMedia";

type MediaItem = {
  id: string;
  src: string;
  alt: string;
};

type ViewFullMediaModalProps = {
  open: boolean;
  onClose: () => void;
  mainMedia: MediaItem;
  thumbnails?: MediaItem[];
};

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

  const allThumbs: MediaItem[] = [mainMedia, ...thumbnails];

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
            <span className="text-xl font-extrabold text-[var(--brand-colorvisibuy-blue,#007BFF)] tracking-wide">
              VISIBUY
            </span>
            <span className="rounded-md bg-[var(--variable-collection-secondarycolor,#C8E2FF)] px-2.5 py-0.5 text-xs font-semibold text-[#007AFF]">
              Beta
            </span>
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
            {/* Floating close button on the media */}
            {/* <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              aria-label="Close"
            >
              ✕
            </button> */}

            <ZoomableMedia
              key={activeMedia.id} // reset zoom when switching
              src={activeMedia.src}
              alt={activeMedia.alt}
            />
          </div>

          {/* Thumbnails row */}
          {allThumbs.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {allThumbs.map((thumb) => {
                const isActive = thumb.id === activeMedia.id;
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
