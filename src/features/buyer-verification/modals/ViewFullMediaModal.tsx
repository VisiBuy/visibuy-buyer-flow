"use client";

import { useEffect, useState, useRef } from "react";
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

/* -----------------------------
   Simple mobile detection hook
------------------------------*/
function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}

export function ViewFullMediaModal({
  open,
  onClose,
  mainMedia,
  thumbnails = [],
}: ViewFullMediaModalProps) {
  const isMobile = useIsMobile();

  const allMedia: MediaItem[] = [
    mainMedia,
    ...thumbnails.filter((t) => t.id !== mainMedia.id),
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [showHint, setShowHint] = useState(true);

  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      setShowHint(true);
    }
  }, [open, mainMedia.id]);

  useEffect(() => {
    if (!showHint) return;
    const timer = setTimeout(() => setShowHint(false), 4000);
    return () => clearTimeout(timer);
  }, [showHint]);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const activeMedia = allMedia[activeIndex];
  const hasMultiple = allMedia.length > 1;

  const goNext = () => {
    if (activeIndex < allMedia.length - 1) {
      setActiveIndex((prev) => prev + 1);
    }
  };

  const goPrev = () => {
    if (activeIndex > 0) {
      setActiveIndex((prev) => prev - 1);
    }
  };

  const handleTouchStart = (e: any) => {
    touchEndX.current = null;
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: any) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || touchEndX.current == null) return;

    const distance = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) goNext();
    else if (distance < -minSwipeDistance) goPrev();

    touchStartX.current = null;
    touchEndX.current = null;
  };

  /* =======================================================
     📱 MOBILE IMMERSIVE VIEW (COMPLETELY SEPARATE)
  ========================================================*/
  if (isMobile) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black"
        onClick={onClose}
      >
        <div
          className="relative h-screen w-screen"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Minimal top bar */}
          <div className="absolute top-0 left-0 right-0 flex justify-end p-4 z-10">
            <button
              onClick={onClose}
              className="h-10 w-10 flex items-center justify-center text-white text-lg"
            >
              ✕
            </button>
          </div>

          {/* Swipe container */}
          <div
            className="h-full flex items-center justify-center"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ZoomableMedia
              key={activeMedia.id}
              src={activeMedia.src}
              alt={activeMedia.alt}
              type={activeMedia.type}
            />

            {/* Arrows */}
            {hasMultiple && (
              <>
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl opacity-80"
                >
                  ‹
                </button>
                <button
                  onClick={goNext}
                  disabled={activeIndex === allMedia.length - 1}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl opacity-80"
                >
                  ›
                </button>
              </>
            )}

            {/* Centered swipe hint */}
            {hasMultiple && showHint && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/70 text-white text-xs px-4 py-2 rounded-full">
                  Swipe left or right to view more proof
                </div>
              </div>
            )}

            {/* Index indicator */}
            {hasMultiple && (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/60 text-white text-xs px-3 py-1 rounded-full">
                {activeIndex + 1} / {allMedia.length}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* =======================================================
     💻 DESKTOP MODAL (YOUR ORIGINAL STRUCTURE UNTOUCHED)
  ========================================================*/
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl rounded-2xl bg-[var(--visibuyb-25,#FBFEFF)] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3">
          <div className="flex items-center gap-2">
            <BrandLogo size={136} showTagline={false} />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-slate-600 shadow-sm hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[80vh] overflow-auto space-y-4 px-6 py-4">
          <div className="relative">
            <ZoomableMedia
              key={activeMedia.id}
              src={activeMedia.src}
              alt={activeMedia.alt}
              type={activeMedia.type}
            />

            {/* Arrows */}
            {hasMultiple && (
              <>
                <button
                  onClick={goPrev}
                  disabled={activeIndex === 0}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-2 shadow"
                >
                  ‹
                </button>
                <button
                  onClick={goNext}
                  disabled={activeIndex === allMedia.length - 1}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 rounded-full px-3 py-2 shadow"
                >
                  ›
                </button>
              </>
            )}

            {/* Center hint */}
            {hasMultiple && showHint && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-black/60 text-white text-xs px-4 py-2 rounded-full">
                  Swipe left or right to view more proof
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}