import React, { useEffect, useRef } from "react";
import { Check, Gift } from "lucide-react";
import confetti from "canvas-confetti";

const ProgressOfferBar = ({
  price = 0,
  confettiOrigin = { x: 0.95, y: 0.6 },
}) => {
  const milestones = [
    { label: "NEW YEAR OFFER", amount: 449, giftValue: 0 },
    { label: "FREE GIFT ₹249", amount: 1099, giftValue: 249 },
    { label: "FREE GIFT ₹649", amount: 1999, giftValue: 649 },
  ];

  /* -------------------- STATE -------------------- */
  const isCartEmpty = price <= 0;

  // Track previous milestone completion
  const prevStateRef = useRef(milestones.map(() => false));

  const updatedMilestones = milestones.map((m, index) => ({
    ...m,
    index,
    completed: !isCartEmpty && price >= m.amount,
  }));

  /* -------------------- CONFETTI -------------------- */
  useEffect(() => {
    if (isCartEmpty) {
      // Reset when cart is cleared
      prevStateRef.current = milestones.map(() => false);
      return;
    }

    updatedMilestones.forEach((m, i) => {
      if (m.completed && !prevStateRef.current[i]) {
        fireConfetti();
      }
      prevStateRef.current[i] = m.completed;
    });
  }, [price]);

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
  const totalGiftWorth = updatedMilestones.reduce(
    (sum, m) => (m.completed ? sum + (m.giftValue || 0) : sum),
    0
  );

  const maxAmount = milestones[milestones.length - 1].amount;

  const progressPercent = isCartEmpty
    ? 0
    : Math.min((price / maxAmount) * 100, 100);

  const nextMilestone = !isCartEmpty
    ? milestones.find((m) => price < m.amount)
    : null;

  const remainingAmount = nextMilestone
    ? nextMilestone.amount - price
    : 0;

  /* -------------------- UI -------------------- */
  return (
    <div className="w-full bg-white px-3 py-3 rounded-lg">

      {/* Empty Cart Message */}
      {isCartEmpty && (
        <div className="text-center text-xs font-semibold text-gray-600 py-2">
          🛒 Add products to unlock exciting offers
        </div>
      )}

      {/* Gift Summary */}
      {!isCartEmpty && totalGiftWorth > 0 && (
        <div className="text-center text-xs font-semibold text-white bg-[#b88b05] rounded py-1.5 mb-2 animate-pulse">
          {/* 🎁 Gifts unlocked worth ₹{totalGiftWorth.toLocaleString("en-IN")} */}
          Shop For Worth Rs2500 & Get Free Shipping 
        </div>
      )}

      {/* Next Milestone */}
      {!isCartEmpty && nextMilestone && (
        <div className="bg-[#b88b05] text-white text-center py-1.5 rounded text-xs mb-3">
          Shop for ₹{remainingAmount.toLocaleString("en-IN")} more to get{" "}
          <b>{nextMilestone.label}</b>
        </div>
      )}

      {/* Milestone Labels */}
      <div className="grid grid-cols-3 text-center mb-2">
        {updatedMilestones.map((m, i) => (
          <span
            key={i}
            className={`mx-auto px-2 py-0.5 rounded-full text-[9px] font-semibold
              ${m.completed
                ? "bg-[#b88b05] text-white"
                : "bg-gray-300 text-gray-700"}`}
          >
            {m.label}
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

        <div className="absolute inset-0 grid grid-cols-3 items-center">
          {updatedMilestones.map((m, i) => (
            <div key={i} className="flex justify-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                  ${m.completed
                    ? "bg-[#b88b05] border-white"
                    : "bg-gray-300 border-white"}`}
              >
                {m.completed ? (
                  <Check className="w-4 h-4 text-white" />
                ) : (
                  <Gift className="w-4 h-4 text-gray-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amount Labels */}
      <div className="grid grid-cols-3 text-center mt-2">
        {updatedMilestones.map((m, i) => (
          <span
            key={i}
            className={`mx-auto px-2 py-0.5 rounded-full text-[10px] font-semibold
              ${m.completed
                ? "bg-[#b88b05] text-white"
                : "bg-gray-300 text-gray-600"}`}
          >
            ₹ {m.amount.toLocaleString("en-IN")}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressOfferBar;
