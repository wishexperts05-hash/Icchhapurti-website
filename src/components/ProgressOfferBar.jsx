import React, { useEffect, useRef } from "react";
import {
  ShoppingCart,
  ClipboardCheck,
  MapPin,
  CreditCard,
  Check
} from "lucide-react";

import confetti from "canvas-confetti";
import { Truck } from "lucide-react";

const ProgressOfferBar = ({
  currentStep = 0, // 0: Cart, 1: Checkout, 2: Address, 3: Payment
  confettiOrigin = { x: 0.95, y: 0.6 },
}) => {

  const steps = [
    { label: "Cart" },
    { label: "Checkout" },
    { label: "Address" },
    { label: "Payment" },
  ];
const stepIcons = [
  ShoppingCart,
  ClipboardCheck,
  MapPin,
  CreditCard,
];

  /* -------------------- PREVIOUS STEP TRACK -------------------- */
  const prevStepRef = useRef(-1);

  /* -------------------- CONFETTI ON STEP CHANGE -------------------- */
  useEffect(() => {
    if (currentStep > prevStepRef.current) {
      fireConfetti();
    }
    prevStepRef.current = currentStep;
  }, [currentStep]);

  const fireConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      startVelocity: 40,
      origin: confettiOrigin,
      colors: ["#b88b05", "#FFD700", "#ffffff"],
    });
  };

  /* -------------------- CALCULATIONS -------------------- */
  const progressPercent =
    ((currentStep + 1) / steps.length) * 100;

  /* -------------------- UI -------------------- */
  return (
    <div className="w-full bg-white px-3 py-3 rounded-lg">

      {/* Step Message */}
      {/* <div className="text-center text-xs font-semibold text-white bg-[#b88b05] rounded py-1.5 mb-3">
        Step {currentStep + 1} of {steps.length} — {steps[currentStep]?.label}
      </div> */}
 <div className="flex items-center justify-center gap-2 text-xs font-semibold text-white bg-[#b88b05] rounded py-1.5 mb-3">
  <Truck className="w-4 h-4" />
  <span>Shop ₹2,500 & Enjoy FREE Shipping</span>
</div>


      {/* Step Labels */}
      <div className="grid grid-cols-4 text-center mb-2">
        {steps.map((s, i) => (
          <span
            key={i}
            className={`mx-auto px-2 py-0.5 rounded-full text-[9px] font-semibold
              ${i <= currentStep
                ? "bg-[#b88b05] text-white"
                : "bg-gray-300 text-gray-700"}`}
          >
            {s.label}
          </span>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="relative my-4">
        <div className="h-1.5 bg-gray-300 rounded-full" />
        <div
          className="absolute top-0 left-0 h-1.5 rounded-full bg-[#b88b05] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />

        <div className="absolute inset-0 grid grid-cols-4 items-center">
        {steps.map((_, i) => {
  const Icon = stepIcons[i];

  return (
    <div key={i} className="flex justify-center">
      <div
        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
          ${i <= currentStep
            ? "bg-[#b88b05] border-white"
            : "bg-gray-300 border-white"}`}
      >
        {i <= currentStep ? (
          <Check className="w-4 h-4 text-white" />
        ) : (
          <Icon className="w-4 h-4 text-gray-600" />
        )}
      </div>
    </div>
  );
})}

        </div>
      </div>

    </div>
  );
};

export default ProgressOfferBar;
