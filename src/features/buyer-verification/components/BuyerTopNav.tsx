"use client";

import { useState } from "react";

import { BrandLogo } from "@/shared/components/ui/BrandLogo";

export function BuyerTopNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = () => setMobileOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/90 backdrop-blur">
      {/* Top bar */}
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 lg:px-24">
        {/* Left: Logo */}
        <div className="flex items-center gap-3">
          <BrandLogo size={136} showTagline={false} /> 

          {/* Replace with real logo asset later */}
          {/* <span className="text-2xl font-extrabold tracking-wide text-[#007BFF]">
            VISIBUY
          </span>
          <span className="rounded-md bg-[#C8E2FF] px-2.5 py-0.5 text-xs font-semibold text-[#007AFF]">
            Beta
          </span> */}
        </div>

        {/* Center: Nav links (desktop) */}
        <nav className="hidden items-center gap-6 text-sm font-medium text-slate-600 md:flex">
          <button
            type="button"
            className="transition-colors hover:text-[#007BFF]"
            // TODO: wire to Trust & Safety route
          >
            Trust &amp; Safety
          </button>
          <button
            type="button"
            className="transition-colors hover:text-[#007BFF]"
            // TODO: wire to About route
          >
            About Visibuy
          </button>
        </nav>

        {/* Right: hamburger (mobile only) */}
        <button
          type="button"
          onClick={toggleMobile}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full bg-white shadow-sm md:hidden"
          aria-label="Open menu"
        >
          <span
            className={`h-0.5 w-5 rounded bg-slate-900 transition-transform ${
              mobileOpen ? "translate-y-1 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 rounded bg-slate-900 transition-opacity ${
              mobileOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-5 rounded bg-slate-900 transition-transform ${
              mobileOpen ? "-translate-y-1 -rotate-45" : ""
            }`}
          />
        </button>

        {/* (Optional) Desktop right slot for profile later */}
        {/* <div className="hidden items-center gap-3 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">
            N
          </div>
        </div> */}
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white md:hidden">
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-6 py-3 text-sm font-medium text-slate-700">
            <button
              type="button"
              className="w-full rounded-md px-2 py-2 text-left hover:bg-slate-50 hover:text-[#007BFF]"
              // TODO: wire to Trust & Safety route
            >
              Trust &amp; Safety
            </button>
            <button
              type="button"
              className="w-full rounded-md px-2 py-2 text-left hover:bg-slate-50 hover:text-[#007BFF]"
              // TODO: wire to About route
            >
              About Visibuy
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
