"use client";

import { useState } from "react";

type RejectVerificationModalProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: (payload: { reason: string; comment?: string }) => void;
  itemName: string;
  colour: string;
  verificationId: string;
};

export function RejectVerificationModal({
  open,
  onCancel,
  onConfirm,
  itemName,
  colour,
  verificationId,
}: RejectVerificationModalProps) {
  const [reason, setReason] = useState("");
  const [comment, setComment] = useState("");

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason) {
      // Simple validation – you can replace with toast later
      alert("Please select a rejection reason.");
      return;
    }
    onConfirm({ reason, comment: comment.trim() || undefined });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onCancel} // click outside closes
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="border-b border-slate-200 px-8 py-6">
            <h2 className="text-xl font-semibold text-slate-900">
              Reject Item Verification
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Please provide details about the item verification and explain your
              reason for rejection.
            </p>
          </div>

          {/* Body */}
          <div className="space-y-6 px-8 py-6">
            {/* Item details */}
            <div>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Item Details
              </h3>
              <div className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500">
                    Item
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    {itemName}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-slate-500">
                    Colour
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    {colour}
                  </span>
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2 sm:max-w-xs">
                  <span className="text-xs font-medium text-slate-500">
                    Verification ID
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
                    {verificationId}
                  </span>
                </div>
              </div>
            </div>

            {/* Rejection reason */}
            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Rejection Reason
              </h3>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-[#007BFF] focus:outline-none focus:ring-1 focus:ring-[#007BFF]"
              >
                <option value="">Select Reason</option>
                <option value="media_mismatch">
                  Item does not match verification media
                </option>
                <option value="condition_issue">
                  Item condition differs from description
                </option>
                <option value="missing_accessories">
                  Missing or wrong accessories
                </option>
                <option value="suspicious_or_fake">
                  Suspicious / likely counterfeit
                </option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* Comment */}
            <div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                Add a comment (Optional)
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#007BFF] focus:outline-none focus:ring-1 focus:ring-[#007BFF]"
                placeholder="e.g. The received item differs from the product description and verification media and is missing accessories."
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200 px-8 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="h-10 rounded-lg bg-[#007BFF] px-5 text-sm font-semibold text-white hover:bg-[#0065d6]"
            >
              Confirm Rejection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
