"use client";

import { useState } from "react";

type VerificationActionsProps = {
  onApprove: () => void;
  onReject: () => void;
  disabled?: boolean;
};

export function VerificationActions({
  onApprove,
  onReject,
  disabled,
}: VerificationActionsProps) {
  const [loadingAction, setLoadingAction] = useState<
    "approve" | "reject" | null
  >(null);

  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => {
          setLoadingAction("reject");
          onReject();
        }}
        disabled={disabled || loadingAction !== null}
        className="h-12 rounded-lg bg-[#E31B23] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#E31B23]/60"
      >
        {loadingAction === "reject" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Rejecting...
          </span>
        ) : (
          "✕ No, this is not the exact item"
        )}
      </button>

      <button
        type="button"
        onClick={() => {
          setLoadingAction("approve");
          onApprove();
        }}
        disabled={disabled || loadingAction !== null}
        className="h-12 rounded-lg bg-[#007BFF] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#007BFF]/60"
      >
        {loadingAction === "approve" ? (
          <span className="flex items-center justify-center gap-2">
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Confirming...
          </span>
        ) : (
          "✓ Yes, this is the exact item"
        )}
      </button>
    </div>
  );
}