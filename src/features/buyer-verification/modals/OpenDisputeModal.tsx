"use client";

import { useState, ChangeEvent, FormEvent } from "react";

type OpenDisputeModalProps = {
  open: boolean;
  onCancel: () => void;
  onSubmit: (payload: {
    reason: string;
    details: string;
    files: File[];
  }) => void;
  itemName: string;
  verificationId: string;
  amount: number;
  currency: string;
};

export function OpenDisputeModal({
  open,
  onCancel,
  onSubmit,
  itemName,
  verificationId,
  amount,
  currency,
}: OpenDisputeModalProps) {
  if (!open) return null;

  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list) return;
    setFiles(Array.from(list));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!reason || !details.trim()) return;
    onSubmit({
      reason,
      details: details.trim(),
      files,
    });
  };

  const disabled = !reason || !details.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-slate-200 px-8 py-6">
          <h2 className="text-xl font-semibold text-slate-900">Open Dispute</h2>
          <p className="mt-1 text-sm text-slate-500">
            Please provide details about the issue with this transaction. Our
            dispute team will review and respond within 24 hours.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-6 overflow-y-auto px-8 py-6">
            {/* Transaction Info */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Transaction Info
              </h3>
              <div className="grid gap-3 rounded-xl border border-slate-200 bg-[#F9FBFF] px-4 py-3 text-xs text-slate-700 sm:grid-cols-2">
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-500">Item</p>
                  <p className="font-semibold text-slate-900">{itemName}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-500">Verification ID</p>
                  <p className="font-mono text-xs text-slate-900">
                    {verificationId}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] text-slate-500">Amount</p>
                  <p className="font-semibold text-slate-900">
                    {currency} {amount.toFixed(2)}
                  </p>
                </div>
              </div>
            </section>

            {/* Dispute Reason */}
            <section>
              <h3 className="mb-2 text-sm font-semibold text-slate-800">
                Dispute Reason
              </h3>
              <div className="relative">
                <select
                  name="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[#007BFF] focus:outline-none focus:ring-1 focus:ring-[#007BFF]"
                >
                  <option value="">Select Reason</option>
                  <option value="item_not_as_described">
                    Item differs from verification media / description
                  </option>
                  <option value="damaged_or_incomplete">
                    Item arrived damaged or incomplete
                  </option>
                  <option value="not_received">
                    I did not receive the item
                  </option>
                  <option value="suspicious_or_fake">
                    Suspicious / likely counterfeit
                  </option>
                  <option value="other">Other</option>
                </select>
                {/* little dropdown arrow */}
                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
                  ▼
                </span>
              </div>
            </section>

            {/* Details */}
            <section>
              <h3 className="mb-2 text-sm font-semibold text-slate-800">
                Describe the details in detail
              </h3>
              <textarea
                name="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-[#007BFF] focus:outline-none focus:ring-1 focus:ring-[#007BFF]"
                placeholder="e.g. The received item differs from the product description and verification video, and is missing accessories."
              />
            </section>

            {/* Evidence upload */}
            <section>
              <div className="mb-2 flex items-baseline justify-between">
                <h3 className="text-sm font-semibold text-slate-800">
                  Upload Evidence{" "}
                  <span className="text-xs font-normal text-slate-400">
                    (Optional)
                  </span>
                </h3>
              </div>

              <label className="flex cursor-pointer items-center justify-between rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-500 hover:bg-slate-100">
                <span>Attach photos or videos</span>
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="rounded-md bg-white px-2 py-1 text-[11px] font-semibold text-slate-600">
                  Browse
                </span>
              </label>

              {files.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex h-14 w-20 items-center justify-center rounded-md border border-slate-200 bg-white px-1 text-[10px] text-center text-slate-600"
                    >
                      <span className="line-clamp-2">{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-slate-200 px-8 py-4">
            <button
              type="button"
              onClick={onCancel}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={disabled}
              className={`h-10 rounded-lg px-6 text-sm font-semibold text-white ${
                disabled
                  ? "cursor-not-allowed bg-[#93C5FD]"
                  : "bg-[#007BFF] hover:bg-[#0065d6]"
              }`}
            >
              Submit Dispute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
