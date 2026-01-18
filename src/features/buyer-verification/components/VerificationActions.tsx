"use client";

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
  return (
    <div className="mt-4 grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={onReject}
        disabled={disabled}
        className="h-12 rounded-lg bg-[#E31B23] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#E31B23]/60"
      >
        ✕ Reject Product
      </button>
      <button
        type="button"
        onClick={onApprove}
        disabled={disabled}
        className="h-12 rounded-lg bg-[#007BFF] text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-[#007BFF]/60"
      >
        ✓ Approve Product
      </button>
    </div>
  );
}
