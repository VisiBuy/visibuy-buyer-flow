"use client";

import { FormEvent, useMemo, useState } from "react";

type BuyerInfoModalProps = {
  open: boolean;
  onCancel: () => void;
  onNext: (payload: Record<string, FormDataEntryValue>) => void;
};

type BuyerFormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  state: string;
  country: string;
};

type FieldKey = keyof BuyerFormState;

export function BuyerInfoModal({ open, onCancel, onNext }: BuyerInfoModalProps) {
  if (!open) return null;

  const [form, setForm] = useState<BuyerFormState>({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    state: "",
    country: "Nigeria",
  });

  const [touched, setTouched] = useState<Partial<Record<FieldKey, boolean>>>({});

  const errors = useMemo(() => {
    const next: Partial<Record<FieldKey, string>> = {};

    const fullName = form.fullName.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();
    const state = form.state.trim();
    const country = form.country.trim();

    if (!fullName) next.fullName = "Full name is required";

    if (!email) next.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email";

    if (!phone) next.phone = "Phone number is required";
    else {
      const digitsOnly = phone.replace(/\D/g, "");
      // Nigeria numbers commonly 10–11 digits without +234
      if (digitsOnly.length < 9) next.phone = "Enter a valid phone number";
    }

    if (!address) next.address = "Address is required";
    if (!state) next.state = "State is required";
    if (!country) next.country = "Country is required";

    return next;
  }, [form]);

  const canContinue = Object.keys(errors).length === 0;

  const markAllTouched = () => {
    setTouched({
      fullName: true,
      email: true,
      phone: true,
      address: true,
      state: true,
      country: true,
    });
  };

  const handleNext = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canContinue) {
      markAllTouched();
      return;
    }

    // Keep compatibility with your existing flow (FormData-like payload)
    const payload: Record<string, FormDataEntryValue> = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
    };

    onNext(payload);
  };

  const inputBase =
    "w-full rounded-lg border px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:ring-1";
  const okInput =
    "border-slate-300 focus:border-[#007BFF] focus:ring-[#007BFF]";
  const errInput =
    "border-red-500 focus:border-red-500 focus:ring-red-500";

  const showError = (key: FieldKey) => Boolean(touched[key] && errors[key]);

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
                Tell us a bit about you so we can verify your purchase and
                enable escrow protection.
              </p>
            </div>

            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Step 1 of 2 · Buyer details
            </div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleNext}
          className="flex h-full flex-1 flex-col overflow-hidden"
        >
          {/* Body */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
            {/* Friendly info card */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-100 bg-[#F5F7FB] px-4 py-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl">
                🛡️
              </div>
              <div className="text-xs text-slate-600">
                <p className="font-semibold">
                  Your payment is protected with Visibuy Escrow.
                </p>
                <p className="mt-1">
                  We only release funds to the seller after you confirm that the
                  item you received matches the verification media.
                </p>
              </div>
            </div>

            {/* Buyer Details */}
            <section>
              <h3 className="mb-3 text-sm font-semibold text-slate-800">
                Buyer Details
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Full name */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Full name
                  </label>
                  <input
                    value={form.fullName}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, fullName: e.target.value }))
                    }
                    onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                    name="fullName"
                    type="text"
                    className={`${inputBase} ${
                      showError("fullName") ? errInput : okInput
                    }`}
                    placeholder="Enter your full name"
                    autoComplete="name"
                  />
                  {showError("fullName") && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Email Address
                  </label>
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, email: e.target.value }))
                    }
                    onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                    name="email"
                    type="email"
                    className={`${inputBase} ${
                      showError("email") ? errInput : okInput
                    }`}
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                  {showError("email") && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.email}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Phone number
                  </label>

                  <div
                    className={`flex rounded-lg border bg-white text-sm text-slate-900 shadow-sm focus-within:ring-1 ${
                      showError("phone")
                        ? "border-red-500 focus-within:border-red-500 focus-within:ring-red-500"
                        : "border-slate-300 focus-within:border-[#007BFF] focus-within:ring-[#007BFF]"
                    }`}
                  >
                    <span className="flex items-center border-r border-slate-200 px-3 text-xs text-slate-500">
                      +234
                    </span>
                    <input
                      value={form.phone}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, phone: e.target.value }))
                      }
                      onBlur={() => setTouched((t) => ({ ...t, phone: true }))}
                      name="phone"
                      type="tel"
                      className="flex-1 border-0 bg-transparent px-3 py-2 text-sm text-slate-900 outline-none"
                      placeholder="XXX XXX XXXX"
                      autoComplete="tel"
                    />
                  </div>

                  {showError("phone") && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.phone}
                    </p>
                  )}
                </div>

                {/* Address */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Address
                  </label>
                  <input
                    value={form.address}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, address: e.target.value }))
                    }
                    onBlur={() => setTouched((t) => ({ ...t, address: true }))}
                    name="address"
                    type="text"
                    className={`${inputBase} ${
                      showError("address") ? errInput : okInput
                    }`}
                    placeholder="Street address"
                    autoComplete="street-address"
                  />
                  {showError("address") && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    State
                  </label>
                  <input
                    value={form.state}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, state: e.target.value }))
                    }
                    onBlur={() => setTouched((t) => ({ ...t, state: true }))}
                    name="state"
                    type="text"
                    className={`${inputBase} ${
                      showError("state") ? errInput : okInput
                    }`}
                    placeholder="State"
                    autoComplete="address-level1"
                  />
                  {showError("state") && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.state}
                    </p>
                  )}
                </div>

                {/* Country */}
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">
                    Country
                  </label>
                  <input
                    value={form.country}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, country: e.target.value }))
                    }
                    onBlur={() => setTouched((t) => ({ ...t, country: true }))}
                    name="country"
                    type="text"
                    className={`${inputBase} ${
                      showError("country") ? errInput : okInput
                    }`}
                    placeholder="Country"
                    autoComplete="country-name"
                  />
                  {showError("country") && (
                    <p className="mt-1 text-[11px] text-red-600">
                      {errors.country}
                    </p>
                  )}
                </div>
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

            <button
              type="submit"
              disabled={!canContinue}
              className={`h-10 rounded-lg px-6 text-sm font-semibold text-white transition ${
                canContinue
                  ? "bg-[#007BFF] hover:bg-[#0065d6]"
                  : "cursor-not-allowed bg-[#A7C8F5]"
              }`}
              onClick={() => {
                // if user tries anyway, show errors
                if (!canContinue) markAllTouched();
              }}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
