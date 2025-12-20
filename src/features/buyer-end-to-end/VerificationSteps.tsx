"use client";

import React from "react";

interface StepProps {
  currentStep: number;
  onStepChange?: (step: number) => void;
}

const VerificationSteps: React.FC<StepProps> = ({ currentStep, onStepChange }) => {
  const steps = [
    { number: 1, label: "Verification", shortLabel: "Verif" },
    { number: 2, label: "Payment", shortLabel: "Pay" },
    { number: 3, label: "Confirmation", shortLabel: "Confirm" },
  ];

  return (
    <div className="flex items-center justify-center gap-2 md:gap-4 lg:gap-6 mb-6 md:mb-8 text-xs md:text-sm">
      {steps.map((step, index) => (
        <React.Fragment key={step.number}>
          <div className="flex items-center gap-1 md:gap-2">
            <span
              className={`w-4 h-4 md:w-5 md:h-5 rounded-full flex items-center justify-center text-[10px] md:text-xs ${
                currentStep >= step.number
                  ? "bg-blue-600 text-white"
                  : "border border-gray-300 text-gray-400"
              }`}
            >
              {step.number}
            </span>
            <span className="font-medium hidden sm:inline">{step.label}</span>
            <span className="font-medium inline sm:hidden text-xs">
              {step.shortLabel}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="h-px w-4 md:w-8 lg:w-12 bg-gray-300" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default VerificationSteps;