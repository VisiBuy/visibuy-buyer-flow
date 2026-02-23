"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

type ZoomableMediaProps = {
  src: string;
  alt: string;
  type?: "image" | "video";
  immersive?: boolean; // 👈 NEW
};

// Helper: detect video URL (Cloudinary `/video/upload` or common video extensions)
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

export function ZoomableMedia({
  src,
  alt,
  type,
  immersive = false, // 👈 default = old behaviour
}: ZoomableMediaProps) {
  const [mode, setMode] = useState<"fit" | "fill">("fit");
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState(1); // 1 = fit
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // pan offsets
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const offsetStart = useRef({ x: 0, y: 0 });

  const inferredVideo = isLikelyVideoUrl(src);
  const isVideo = type === "video" || inferredVideo;

  /* ---------------- VIDEO PATH ---------------- */
  if (isVideo) {
    return (
      <div className="space-y-3">
        {/* Hide the info bar when immersive to keep it clean */}
        {!immersive && (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-slate-500">
              <span className="font-semibold text-slate-700">Video</span> · Tap
              play to watch
            </div>
          </div>
        )}

        <div
          className="relative w-full overflow-hidden rounded-2xl bg-black"
          style={{
            // Only change height in immersive mode
            height: immersive ? "100vh" : "min(70vh, 520px)",
          }}
        >
          <video
            src={src}
            controls
            playsInline
            className="h-full w-full rounded-2xl object-contain"
          />
        </div>
      </div>
    );
  }

  /* ---------------- IMAGE PATH ---------------- */

  const canPan = zoom > 1;

  const zoomIn = () =>
    setZoom((z) => Math.min(4, Number((z + 0.5).toFixed(2))));

  const zoomOut = () =>
    setZoom((z) => {
      const next = Math.max(1, Number((z - 0.5).toFixed(2)));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });

  const reset = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  };

  // When switching Fit/Fill, reset zoom & pan so it doesn’t feel weird
  useEffect(() => {
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const onDoubleClick = () => {
    if (zoom === 1) setZoom(2);
    else reset();
  };

  const onWheel: React.WheelEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const delta = -e.deltaY;
    setZoom((z) => {
      const next = Math.min(4, Math.max(1, z + (delta > 0 ? 0.2 : -0.2)));
      if (next === 1) setOffset({ x: 0, y: 0 });
      return Number(next.toFixed(2));
    });
  };

  const onMouseDown: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!canPan) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    offsetStart.current = { ...offset };
  };

  const onMouseMove: React.MouseEventHandler<HTMLDivElement> = (e) => {
    if (!dragging) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setOffset({ x: offsetStart.current.x + dx, y: offsetStart.current.y + dy });
  };

  const stopDragging = () => setDragging(false);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") reset();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cursor = useMemo(() => {
    if (!canPan) return "zoom-in";
    return dragging ? "grabbing" : "grab";
  }, [canPan, dragging]);

  const imageClass =
    mode === "fit" ? "object-contain" : "object-cover"; // Fit vs Fill

  // 🔹 only change the HEIGHT in immersive mode
  const containerHeight = immersive ? "100vh" : "min(70vh, 520px)";

  return (
    <div className="space-y-3">
      {/* Top controls – hidden in immersive full-screen */}
      {!immersive && (
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Zoom info */}
          <div className="text-sm text-slate-500">
            Zoom:{" "}
            <span className="font-semibold text-slate-700">
              {Math.round(zoom * 100)}%
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Fit / Fill toggle */}
            <div className="flex rounded-lg bg-slate-100 p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMode("fit")}
                className={`rounded-md px-2 py-1 ${
                  mode === "fit"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Fit
              </button>
              <button
                type="button"
                onClick={() => setMode("fill")}
                className={`rounded-md px-2 py-1 ${
                  mode === "fill"
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-200"
                }`}
              >
                Fill
              </button>
            </div>

            {/* Zoom buttons */}
            <button
              type="button"
              onClick={zoomOut}
              className="h-9 rounded-lg bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              −
            </button>
            <button
              type="button"
              onClick={zoomIn}
              className="h-9 rounded-lg bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              +
            </button>
            <button
              type="button"
              onClick={reset}
              className="h-9 rounded-lg bg-white px-3 text-sm font-semibold text-slate-700 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Viewer */}
      <div
        ref={containerRef}
        onWheel={onWheel}
        onDoubleClick={onDoubleClick}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={stopDragging}
        onMouseLeave={stopDragging}
        className="relative w-full overflow-hidden rounded-2xl bg-[#020617]"
        style={{
          height: containerHeight,
          cursor,
          userSelect: "none",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
            transformOrigin: "center",
            transition: dragging ? "none" : "transform 120ms ease",
          }}
        >
          <Image src={src} alt={alt} fill className={imageClass} priority />
        </div>

        {/* Bottom helper – also hide in immersive */}
        {!immersive && (
          <div className="absolute bottom-3 left-3 rounded-lg bg-[#020617]/70 px-3 py-1 text-xs text-white">
            {zoom === 1
              ? mode === "fit"
                ? "Fit: whole image visible • Scroll / pinch to zoom"
                : "Fill: image fills frame (may crop) • Scroll / pinch to zoom"
              : "Drag to move • Double-click to reset"}
          </div>
        )}
      </div>
    </div>
  );
}