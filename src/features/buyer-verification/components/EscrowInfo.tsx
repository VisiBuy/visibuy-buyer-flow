"use client";

type EscrowInfoProps = {
  escrowEnabled?: boolean;
};

export function EscrowInfo({ escrowEnabled = true }: EscrowInfoProps) {
  if (!escrowEnabled) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-[#E9F8EE] px-3 py-2 text-sm text-[#1F6B34]">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D1FAE5] text-xs font-bold">
          i
        </span>
        <span>Escrow not available</span>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-2xl bg-white">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-semibold">Escrow Protection</p>
          <p className="text-xs text-slate-500">
            Seller has Escrow turned On
          </p>
        </div>
        <label className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border border-slate-400">
          {/* fake checkbox for now */}
          <span className="text-base font-bold">✓</span>
        </label>
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-[#E9F8EE] px-3 py-2 text-sm text-[#1F6B34]">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#D1FAE5] text-xs font-bold">
          i
        </span>
        <span>Escrow is currently ON - Payment is Secure</span>
      </div>
    </div>
  );
}
