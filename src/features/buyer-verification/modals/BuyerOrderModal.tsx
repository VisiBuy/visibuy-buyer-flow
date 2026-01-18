"use client";

import { FormEvent, useState } from "react";

type BuyerOrderModalProps = {
  open: boolean;
  onCancel: () => void;
  onBack: () => void;
  onSubmit: (payload: Record<string, FormDataEntryValue>) => void;

  // optional prefilled values from verification context
  productTitle?: string;
  productDescription?: string;
  amount?: string | number;
};

export function BuyerOrderModal({
  open,
  onCancel,
  onBack,
  onSubmit,
  productTitle,
  productDescription,
  amount,
}: BuyerOrderModalProps) {
  if (!open) return null;

  const [confirmedDetails, setConfirmedDetails] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);

  const canProceed = confirmedDetails && agreedTerms;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canProceed) return; // extra safety on submit

    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());
    onSubmit(payload);
  };

  // fallback values (you’ll later pass real ones from VerificationStage)
  const displayTitle =
    productTitle ?? "iPhone 14 Pro Max - 256GB Space Black";
  const displayDescription =
    productDescription ?? "256GB · Space Black · Factory unlocked";
  const displayAmount = amount?.toString() ?? "999.99";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-slate-200 px-8 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Buyer Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Review your order details and choose how you’d like to pay.
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Step 2 of 2 · Order &amp; payment
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex h-full flex-1 flex-col overflow-hidden"
        >
          {/* Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Product / order details */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Order Details
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Product title (read-only) */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Product Title
                  </label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {displayTitle}
                  </div>
                  {/* hidden field so it’s still in FormData */}
                  <input
                    type="hidden"
                    name="productTitle"
                    value={displayTitle}
                  />
                </div>

                {/* Product description (read-only) */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Product Description
                  </label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {displayDescription}
                  </div>
                  <input
                    type="hidden"
                    name="productDescription"
                    value={displayDescription}
                  />
                </div>

                {/* Amount (read-only) */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Amount to be Paid
                  </label>
                  <div className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900">
                    {displayAmount}
                  </div>
                  <input
                    type="hidden"
                    name="amount"
                    value={displayAmount}
                  />
                </div>

                {/* Payment – Flutterwave badge only */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Payment
                  </label>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                    <div className="text-xs text-slate-600">
                      <p className="font-medium">Online payment</p>
                      <p className="text-[11px] text-slate-500">
                        Processed securely by Flutterwave.
                      </p>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 shadow-sm">
                      {/* Replace with real logo later */}
                      <span className="h-2 w-2 rounded-full bg-[#FF9F00]" />
                      <span className="text-[11px] font-semibold text-[#FF9F00]">
                        Flutterwave
                      </span>
                    </div>
                  </div>
                  {/* hidden value so backend knows which provider */}
                  <input
                    type="hidden"
                    name="paymentProvider"
                    value="flutterwave"
                  />
                </div>
              </div>
            </section>

            {/* Confirmation */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Confirmation
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="confirmAccurateDetails"
                    checked={confirmedDetails}
                    onChange={(e) => setConfirmedDetails(e.target.checked)}
                    className="mt-[3px] h-4 w-4 rounded border-slate-300 text-[#007BFF] focus:ring-[#007BFF]"
                  />
                  <span>
                    I confirm that the details provided are accurate.
                  </span>
                </label>

                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="mt-[3px] h-4 w-4 rounded border-slate-300 text-[#007BFF] focus:ring-[#007BFF]"
                  />
                  <span>I agree to Visibuy’s escrow terms and conditions.</span>
                </label>
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#E3F7E9] px-3 py-2 text-xs text-[#1F6B34]">
                <span className="mt-[2px] inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#C6F6D5] text-[10px] font-bold">
                  i
                </span>
                <p>
                  You will receive a Release payment code to securely release
                  payment to the seller after confirming your order.
                </p>
              </div>
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

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onBack}
                className="h-10 rounded-lg border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={!canProceed}
                className={`h-10 rounded-lg px-6 text-sm font-semibold text-white transition
                  ${
                    canProceed
                      ? "bg-[#007BFF] hover:bg-[#0065d6]"
                      : "cursor-not-allowed bg-[#A7C8F5]"
                  }`}
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
