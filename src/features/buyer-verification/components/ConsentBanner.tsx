"use client";

import { useEffect, useState } from "react";
// import Link from "next/link";

const STORAGE_KEY = "visibuy-consent-accepted";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if user hasn't already accepted
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setVisible(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, "true");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="flex w-full max-w-5xl items-start gap-4 rounded-2xl border border-slate-200 bg-white/95 p-4 text-xs text-slate-600 shadow-lg backdrop-blur">
        <div className="mt-1 hidden h-7 w-7 items-center justify-center rounded-full bg-[#EFF6FF] text-sm text-[#007BFF] sm:flex">
          ⚖️
        </div>

        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold text-slate-900">
            We value your privacy
          </p>
          <p>
            By continuing to use Visibuy, you agree to our{" "}
            <a
          href="https://visibuy.com.ng/privacy"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-[#007BFF] hover:underline"
        >
          Privacy Policy
        </a>
        {" "}
            and{" "}
            <a
  href="https://visibuy.com.ng/terms"
  target="_blank"
  rel="noreferrer"
  className="font-semibold text-[#007BFF] hover:underline"
>
  Terms &amp; Conditions
</a>

            .
          </p>
        </div>

        <div className="flex flex-shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={handleAccept}
            className="rounded-lg bg-[#007BFF] px-4 py-2 text-xs font-semibold text-white hover:bg-[#0065d6]"
          >
            Got it, continue
          </button>
        </div>
      </div>
    </div>
  );
}
