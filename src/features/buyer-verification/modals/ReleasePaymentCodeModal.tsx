"use client";

import { useState, useRef, useEffect, FormEvent } from "react";

type ReleasePaymentCodeModalProps = {
  open: boolean;
  email: string;
  onCancel: () => void;
  onConfirm: (code: string) => void;
};

export function ReleasePaymentCodeModal({
  open,
  email,
  onCancel,
  onConfirm,
}: ReleasePaymentCodeModalProps) {
  const [digits, setDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (open) {
      setDigits(["", "", "", "", "", ""]);
      // focus first input when modal opens
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 50);
    }
  }, [open]);

  if (!open) return null;

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^[0-9]?$/.test(value)) return;

    const next = [...digits];
    next[index] = value;
    setDigits(next);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const prevIndex = index - 1;
      inputRefs.current[prevIndex]?.focus();
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const code = digits.join("");
    if (code.length === 6) {
      onConfirm(code);
    }
  };

  const code = digits.join("");
  const isValid = code.length === 6;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white shadow-xl"
      >
        <div className="px-8 pt-8 pb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Enter Verification Code
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A 6-digit code has been sent to your email address{" "}
            <span className="font-semibold">{email || "your email"}</span>. Enter
            the code below to release payment from escrow.
          </p>

          {/* OTP inputs */}
          <div className="mt-6 flex justify-between gap-2">
            {digits.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                className="h-12 w-10 rounded-md border border-slate-300 text-center text-lg font-semibold text-slate-900 shadow-sm focus:border-[#007BFF] focus:outline-none focus:ring-1 focus:ring-[#007BFF]"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-slate-200 px-8 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="text-sm font-semibold text-slate-500 hover:text-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isValid}
            className={`h-10 rounded-lg px-6 text-sm font-semibold text-white ${
              isValid
                ? "bg-[#007BFF] hover:bg-[#0065d6]"
                : "bg-slate-300 cursor-not-allowed"
            }`}
          >
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}
