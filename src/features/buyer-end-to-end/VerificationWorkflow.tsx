"use client";

import React, { useState } from "react";
import VerificationSteps from "./VerificationSteps";
import VerificationMediaContent from "./VerificationMediaContent";
import PaymentEscrowStatusContent from "./PaymentEscrowStatusContent";
import VerificationLayout from "./layout/layout";


const VerificationWorkflow = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleStepComplete = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <VerificationLayout>
    <div className="w-full min-h-screen bg-gray-50 p-3 md:p-6 lg:px-20 px-5">
      <VerificationSteps currentStep={currentStep} />
      
      {currentStep === 1 && (
        <VerificationMediaContent 
          onComplete={handleStepComplete}
          onBack={handleStepBack}
        />
      )}
      
      {currentStep === 2 && (
        <PaymentEscrowStatusContent 
          onComplete={handleStepComplete}
          onBack={handleStepBack}
        />
      )}
      
      {currentStep === 3 && (
        <div className="bg-white rounded-xl border p-6 text-center">
          <h2 className="text-xl font-bold mb-4">Transaction Complete!</h2>
          <p className="text-[#475569]">Your purchase has been successfully verified and completed.</p>
        </div>
      )}
    </div>
      </VerificationLayout>
  );
};

export default VerificationWorkflow;