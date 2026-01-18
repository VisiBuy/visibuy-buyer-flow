"use client";

type EscrowPaymentPromptModalProps = {
  open: boolean;
  onCancel: () => void;
  onContinue: () => void;
};

export function EscrowPaymentPromptModal({
  open,
  onCancel,
  onContinue,
}: EscrowPaymentPromptModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel} // click outside = cancel
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white px-8 py-6 shadow-xl"
        onClick={(e) => e.stopPropagation()} // don't close when clicking inside
      >
        <h2 className="text-lg font-semibold text-slate-900">
          Verification Requires payment
        </h2>
        <p className="mt-3 text-sm text-slate-600">
          This payment has Escrow enabled. Do you wish to continue?
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onContinue}
            className="h-10 rounded-lg bg-[#007BFF] px-6 text-sm font-semibold text-white hover:bg-[#0065d6]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
