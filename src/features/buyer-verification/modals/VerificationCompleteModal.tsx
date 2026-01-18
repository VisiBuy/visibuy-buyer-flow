"use client";

type VerificationCompleteModalProps = {
  open: boolean;
  onClose: () => void;
};

export function VerificationCompleteModal({
  open,
  onClose,
}: VerificationCompleteModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose} // click outside closes
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white px-8 py-10 shadow-xl"
        onClick={(e) => e.stopPropagation()} // don’t close when clicking inside
      >
        {/* Big green circle with check */}
        <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full border-2 border-[#28A745]">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#28A745]">
            <span className="text-3xl text-white">✓</span>
          </div>
        </div>

        <h2 className="mb-2 text-center text-xl font-semibold text-slate-900">
          Verification Complete
        </h2>

        <p className="mb-6 text-center text-sm text-slate-600">
          You’ve approved this item. The verification is now completed for this
          order.
        </p>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-lg bg-[#007BFF] px-6 text-sm font-semibold text-white hover:bg-[#0065d6]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
