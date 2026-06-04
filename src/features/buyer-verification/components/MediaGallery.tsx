"use client";

// import Image from "next/image";

type MediaItem = {
  id: string;
  src: string;
  alt: string;
  type?: "video";
};

type MediaGalleryProps = {
  mainMedia: MediaItem;
  onViewFullMedia?: () => void;
}

export function MediaGallery({
  mainMedia,
  onViewFullMedia,
}: MediaGalleryProps) {
  const safeMainSrc = mainMedia?.src || "/placeholder-main.jpg";
  // const mainIsVideo = isLikelyVideoUrl(safeMainSrc);

  return (
    <div className="space-y-4">
      {/* Header */}
      {/* <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center"> */}
        {/* <h2 className="text-lg font-semibold sm:text-xl">Verification Media</h2> */}
        {/* <button
          type="button"
          onClick={onViewFullMedia}
          className="flex items-center gap-2 text-xs font-semibold text-slate-500"
        >
          <span className="inline-block h-3 w-3 rounded border border-slate-400" />
          View Full Media
        </button>
      </div> */}

      {/* Grid */}
      <div className="flex justify-center">
        {/* MAIN MEDIA – now a div, not a button */}
        <div
          onClick={onViewFullMedia}
          className="relative
                      mx-auto
                      max-w-[420px]
                      overflow-hidden
                      rounded-2xl
                      bg-black
                      aspect-[9/16]
                      cursor-pointer"
        >
          <video
            className="h-full w-full object-contain"
            src={safeMainSrc}
            controls
            playsInline
          />

          
        </div>

        
      </div>
    </div>
  );
}
