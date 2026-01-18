"use client";

type StepKey = "verification" | "payment" | "confirmation";

type VerificationStepperProps = {
  escrowEnabled: boolean;
  activeStep: StepKey;
};

function StepDot({ active }: { active?: boolean }) {
  return (
    <span
      className={`h-4 w-2 sm:h-7 sm:w-7 rounded-full ${
        active ? "bg-[#28A745]" : "bg-[#CBEACE]"
      }`}
    />
  );
}


function StepItem({
  label,
  active,
}: {
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <StepDot active={active} />
      <span
        className={`whitespace-nowrap text-xs font-semibold sm:text-sm ${
          active ? "text-slate-900" : "text-slate-600"
        }`}
      >
        {label}
      </span>
    </div>
  );
}

function StepArrow() {
  return <span className="text-base font-bold text-slate-900 sm:text-lg">→</span>;
}

export function VerificationStepper({
  escrowEnabled,
  activeStep,
}: VerificationStepperProps) {
  const steps = escrowEnabled
    ? ([
        { key: "verification", label: "Verification" },
        { key: "payment", label: "Payment" },
        { key: "confirmation", label: "Confirmation" },
      ] as const)
    : ([
        { key: "verification", label: "Verification" },
        { key: "confirmation", label: "Confirmation" },
      ] as const);

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="mx-auto w-full max-w-5xl px-4 py-3 sm:px-6 sm:py-4">
        {/* ✅ Mobile layout: compact, no arrows */}
        <div className="flex items-center justify-between sm:hidden">
          {steps.map((s) => (
            <div key={s.key} className="flex flex-1 flex-col items-center">
              <StepDot active={activeStep === s.key} />
              <span
                className={`mt-1 text-[11px] font-semibold ${
                  activeStep === s.key ? "text-slate-900" : "text-slate-500"
                }`}
              >
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* ✅ Desktop/tablet layout: your original row with arrows */}
        <div className="hidden items-center justify-center gap-4 sm:flex">
          <StepItem label="Verification" active={activeStep === "verification"} />

          {escrowEnabled ? (
            <>
              <StepArrow />
              <StepItem label="Payment" active={activeStep === "payment"} />
              <StepArrow />
              <StepItem
                label="Confirmation"
                active={activeStep === "confirmation"}
              />
            </>
          ) : (
            <>
              <StepArrow />
              <StepItem
                label="Confirmation"
                active={activeStep === "confirmation"}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
