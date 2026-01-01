import React, { useEffect, useRef } from "react";
import { Check, Gift } from "lucide-react";
import confetti from "canvas-confetti";

const ProgressOfferBar = ({ price = 0 , confettiOrigin = { x: 0.95, y: 0.6 },}) => {
  const milestones = [
    { label: "NEW YEAR OFFER", amount: 449, giftValue: 0 },
    { label: "FREE GIFT ₹249", amount: 1099, giftValue: 249 },
    { label: "FREE GIFT ₹649", amount: 1999, giftValue: 649 },
  ];

  // Track previous completion state per milestone
  const prevStateRef = useRef(milestones.map(() => false));

  const updatedMilestones = milestones.map((m, index) => {
    const completed = price >= m.amount;
    return { ...m, completed, index };
  });

  useEffect(() => {
    updatedMilestones.forEach((m, i) => {
      // 🎉 Trigger ONLY on false → true
      if (m.completed && !prevStateRef.current[i]) {
        fireConfetti(i);
      }
      // Update state (allows repeat)
      prevStateRef.current[i] = m.completed;
    });
  }, [price]);

  const fireConfetti = (index) => {
    const baseColors = ["#b88b05", "#FFD700", "#ffffff"];
    confetti({
      particleCount: 120,
      spread: 90,
      startVelocity: 40,
      origin: confettiOrigin,
      colors: baseColors,
    });
  };

  const totalGiftWorth = updatedMilestones.reduce(
    (sum, m) => (m.completed ? sum + (m.giftValue || 0) : sum),
    0
  );

  const maxAmount = milestones[milestones.length - 1].amount;
  const progressPercent = Math.min((price / maxAmount) * 100, 100);

  const nextMilestone = milestones.find((m) => price < m.amount);
  const remainingAmount = nextMilestone ? nextMilestone.amount - price : 0;

  return (
    <div className="w-full bg-white px-3 py-3 rounded-lg">

      {totalGiftWorth > 0 && (
        <div className="text-center text-xs font-semibold text-white bg-[#b88b05] rounded py-1.5 mb-2 animate-pulse">
          🎁 Gifts unlocked worth ₹{totalGiftWorth.toLocaleString("en-IN")}
        </div>
      )}

      {nextMilestone && (
        <div className="bg-[#b88b05] text-white text-center py-1.5 rounded text-xs mb-3">
          Shop for ₹{remainingAmount.toLocaleString("en-IN")} more to get{" "}
          <b>{nextMilestone.label}</b>
        </div>
      )}

      <div className="grid grid-cols-3 text-center mb-2">
        {updatedMilestones.map((m, i) => (
          <span
            key={i}
            className={`mx-auto px-2 py-0.5 rounded-full text-[9px] font-semibold
              ${m.completed ? "bg-[#b88b05] text-white" : "bg-gray-300 text-gray-700"}`}
          >
            {m.label}
          </span>
        ))}
      </div>

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
                  ${m.completed ? "bg-[#b88b05] border-white" : "bg-gray-300 border-white"}`}
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

      <div className="grid grid-cols-3 text-center mt-2">
        {updatedMilestones.map((m, i) => (
          <span
            key={i}
            className={`mx-auto px-2 py-0.5 rounded-full text-[10px] font-semibold
              ${m.completed ? "bg-[#b88b05] text-white" : "bg-gray-300 text-gray-600"}`}
          >
            ₹ {m.amount.toLocaleString("en-IN")}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ProgressOfferBar;
