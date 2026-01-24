"use client";

import Image from "next/image";

type BrandLogoProps = {
  size?: number; // logo icon size in px
  showTagline?: boolean;
  className?: string;
};

export function BrandLogo({
  size = 136,          // keep your preferred big size
  showTagline = true,
  className,
}: BrandLogoProps) {
  return (
    <div className={`flex flex-col items-center ${className ?? ""}`}>
      {/* Logo */}
      <div
        className="relative overflow-hidden rounded-xl"
        style={{ width: size, height: 50 }}
      >
        <Image
          src="/logo.png"
          alt="Visibuy"
          fill
          className="object-contain"
          priority
        />
      </div>

      {/* Tagline */}
      {showTagline && (
  <span className="mt-0.5 text-xs sm:text-sm text-slate-500 text-center leading-tight">
    What you see is what you get.
  </span>
)}
    </div>
  );
}