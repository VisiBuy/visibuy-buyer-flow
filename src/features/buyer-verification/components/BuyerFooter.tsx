// components/BuyerFooter.tsx
"use client";
import { BrandLogo } from "@/shared/components/ui/BrandLogo";

export function BuyerFooter() {
  return (
    <footer className="mt-16 border-t border-slate-100 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between lg:px-24">
        {/* Left */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <BrandLogo />
            {/* <span className="rounded-md bg-[#C8E2FF] px-2 py-0.5 text-[10px] font-semibold text-[#007AFF]">
              Beta
            </span> */}
          </div>
          {/* <p className="text-xs text-slate-500">
            What you see is what you get.
          </p> */}
        </div>

        {/* Right */}
        <nav className="flex items-center gap-6 text-xs">
          <button
            type="button"
            className="transition-colors hover:text-[#007BFF]"
          >
            Terms &amp; Conditions
          </button>
          <button
            type="button"
            className="transition-colors hover:text-[#007BFF]"
          >
            Privacy Policy
          </button>
        </nav>
      </div>
    </footer>
  );
}
