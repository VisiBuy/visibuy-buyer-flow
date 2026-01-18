"use client";

import { useMemo } from "react";
import { closePaymentModal, useFlutterwave } from "flutterwave-react-v3";

type FlutterwavePaymentModalProps = {
  open: boolean;
  onClose: () => void;

  // passed from your Step 2 submit payload
  buyer: {
    fullName: string;
    email: string;
    phone: string;
  };

  order: {
    amount: number; // NGN amount
    currency?: "NGN" | "USD" | "GHS" | string;
    title?: string;
    description?: string;
    verificationId: string;
  };

  // called when Flutterwave returns successful response
  onSuccess: (resp: unknown) => void;

  // optional: when user closes Flutterwave checkout modal
  onPaymentClose?: () => void;
};

export function FlutterwavePaymentModal({
  open,
  onClose,
  buyer,
  order,
  onSuccess,
  onPaymentClose,
}: FlutterwavePaymentModalProps) {
  const publicKey = process.env.NEXT_PUBLIC_FLW_PUBLIC_KEY;

  const config = useMemo(() => {
    return {
      public_key: publicKey ?? "",
      tx_ref: `vb_${order.verificationId}_${Date.now()}`, // unique reference
      amount: order.amount,
      currency: order.currency ?? "NGN",
      payment_options: "card,banktransfer,ussd",
      customer: {
        email: buyer.email,
        phone_number: buyer.phone,
        name: buyer.fullName,
      },
      customizations: {
        title: order.title ?? "Visibuy Escrow Payment",
        description:
          order.description ?? "Payment is held securely until you confirm.",
        // You can add a logo later:
        // logo: "/brand/visibuy-logo.png",
      },
      // IMPORTANT: You can use callback OR redirect_url; callback is easiest in-app.
      // Flutterwave supports both approaches. :contentReference[oaicite:3]{index=3}
    };
  }, [buyer, order, publicKey]);

  const handleFlutterPayment = useFlutterwave(config as any);

  if (!open) return null;

  const canPay = Boolean(publicKey) && order.amount > 0 && buyer.email;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="border-b border-slate-200 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Complete Payment
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                You’ll be redirected to Flutterwave’s secure checkout.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Amount</p>
                <p className="text-lg font-semibold text-slate-900">
                  {order.currency ?? "NGN"} {order.amount.toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm">
                <span className="text-[11px] text-slate-500">Processed by</span>
                <span className="text-[11px] font-semibold text-[#FF9F00]">
                  Flutterwave
                </span>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600">
              Funds are held in escrow and released to the seller after you
              confirm delivery.
            </p>
          </div>

          {!publicKey && (
            <p className="mt-3 text-xs text-red-600">
              Missing Flutterwave public key. Add{" "}
              <span className="font-mono">NEXT_PUBLIC_FLW_PUBLIC_KEY</span> to
              your <span className="font-mono">.env.local</span>.
            </p>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!canPay}
            onClick={() => {
              if (!canPay) return;

              handleFlutterPayment({
                callback: (response) => {
                  // Flutterwave returns status/transaction_id etc.
                  // You should verify on your server after this. :contentReference[oaicite:4]{index=4}
                  onSuccess(response);
                  closePaymentModal(); // closes Flutterwave checkout modal
                  onClose(); // closes your modal
                },
                onClose: () => {
                  onPaymentClose?.();
                },
              });
            }}
            className={`h-10 rounded-lg px-5 text-sm font-semibold text-white transition ${
              canPay
                ? "bg-[#007BFF] hover:bg-[#0065d6]"
                : "cursor-not-allowed bg-[#A7C8F5]"
            }`}
          >
            Pay with Flutterwave
          </button>
        </div>
      </div>
    </div>
  );
}
