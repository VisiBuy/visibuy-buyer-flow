"use client";

type SafetyLevel = "ok" | "warning" | "risk";

type ProductSummaryProps = {
  title: string;
  verificationNumber: string;
  price: string;
  verifiedAt?: string; // 🆕 add this
  /**
   * Frontend-only for now.
   * Later this can come from the backend as verification.safetyLevel.
   */
  safetyLevel?: SafetyLevel;
};

const SAFETY_CONFIG: Record<
  SafetyLevel,
  { label: string; dot: string; bg: string; text: string }
> = {
  ok: {
    label: "Verification Safety Check",
    dot: "bg-emerald-500",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
  },
  warning: {
    label: "Verification Safety Check",
    dot: "bg-amber-400",
    bg: "bg-amber-50",
    text: "text-amber-700",
  },
  risk: {
    label: "Verification Safety Check",
    dot: "bg-rose-500",
    bg: "bg-rose-50",
    text: "text-rose-700",
  },
};

export function ProductSummary({
  title,
  verificationNumber,
  price,
  verifiedAt, // 🆕 destructure it
  safetyLevel = "ok",
}: ProductSummaryProps) {
  const safety = SAFETY_CONFIG[safetyLevel];

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
      <div>
        <p className="text-sm font-medium">{title}</p>

        <p className="text-xs text-slate-600">
          Verification ID:{" "}
          <span className="font-mono tracking-tight text-slate-700">
            {verificationNumber}
          </span>
        </p>

        <p className="mt-1 text-lg font-semibold">{price}</p>

        {/* 🆕 Verification timestamp */}
        {verifiedAt && (
          <p className="mt-1 text-xs text-slate-500">
            Verified{" "}
            <span className="font-medium text-slate-700">
              {verifiedAt}
            </span>
          </p>
        )}
      </div>

      {/* Safety badge – frontend-only today */}
      <span
        className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${safety.bg} ${safety.text}`}
      >
        <span className={`h-2 w-2 rounded-full ${safety.dot}`} />
        <span>{safety.label}</span>
      </span>
    </div>
  );
}