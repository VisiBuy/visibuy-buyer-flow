"use client";

type ProductSummaryProps = {
  title: string;
  verificationNumber: string;
  price: string;
  statusLabel?: string;
};

export function ProductSummary({
  title,
  verificationNumber,
  price,
  statusLabel = "Verification Status",
}: ProductSummaryProps) {
  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 sm:gap-4">
      {/* Left: product info */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900 sm:text-[15px]">
          {title}
        </p>
        <p className="text-xs text-slate-600 truncate max-w-xs sm:max-w-none">
          {verificationNumber}
        </p>
        <p className="mt-1 text-base font-semibold text-slate-900 sm:text-lg">
          {price}
        </p>
      </div>

      {/* Right: status pill */}
      <span className="inline-flex items-center justify-center rounded-full bg-slate-50 px-3 py-1 text-[11px] text-slate-400 sm:text-xs">
        {statusLabel}
      </span>
    </div>
  );
}
