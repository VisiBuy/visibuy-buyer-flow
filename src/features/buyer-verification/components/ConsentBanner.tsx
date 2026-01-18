"use client";

import { useEffect, useState } from "react";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem("visibuy-cookie-consent");
    if (stored === "accepted") return;

    setVisible(true);
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("visibuy-cookie-consent", "accepted");
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 text-xs text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:text-[13px] lg:px-24">
        <p className="leading-snug">
          By continuing to use Visibuy, you agree to our{" "}
          <a
            href="https://visibuy.com.ng/privacy"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-[#007BFF] hover:underline"
          >
            Privacy Policy
          </a>{" "}
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

        <button
          type="button"
          onClick={handleAccept}
          className="inline-flex items-center justify-center rounded-md bg-[#007BFF] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#0065d6]"
        >
          Got it
        </button>
      </div>
    </div>
  );
}