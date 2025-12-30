import React from "react";
import { Check, Gift } from "lucide-react";

const ProgressOfferBar = ({ price = 0 }) => {
  const milestones = [
    {
      label: "NEW YEAR OFFER",
      amount: 449,
      giftValue: 0, // not a gift
    },
    {
      label: "FREE GIFT ₹249",
      amount: 1099,
      giftValue: 249,
    },
    {
      label: "FREE GIFT ₹649",
      amount: 1999,
      giftValue: 649,
    },
  ];

  // Mark completed milestones
  const updatedMilestones = milestones.map((m) => ({
    ...m,
    completed: price >= m.amount,
  }));

  // 🎁 Total gift worth unlocked
  const totalGiftWorth = updatedMilestones.reduce(
    (sum, m) => (m.completed ? sum + (m.giftValue || 0) : sum),
    0
  );

  // Progress calculation
  const maxAmount = milestones[milestones.length - 1].amount;
  const progressPercent = Math.min((price / maxAmount) * 100, 100);

  // Next milestone
  const nextMilestone = milestones.find((m) => price < m.amount);
  const remainingAmount = nextMilestone
    ? nextMilestone.amount - price
    : 0;

  return (
    <div className="w-full bg-white px-3 py-3 rounded-lg">

      {/* 🎁 Gift Summary */}
      {totalGiftWorth > 0 && (
        <div className="text-center text-xs font-semibold text-white bg-amber-600 border border-green-200 rounded py-1.5 mb-2">
          🎁 All gifts added to cart worth{" "}
          <span className="font-bold">
            ₹{totalGiftWorth.toLocaleString("en-IN")}
          </span>
        </div>
      )}

      {/* Banner */}
      {nextMilestone && (
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-center py-1.5 rounded text-xs mb-3">
          Shop for{" "}
          <b>₹{remainingAmount.toLocaleString("en-IN")}</b> more to get{" "}
          <b>{nextMilestone.label}</b>
        </div>
      )}

      {/* Labels */}
      <div className="grid grid-cols-3 text-center mb-2">
        {updatedMilestones.map((m, i) => (
          <div key={i}>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold
                ${m.completed ? "bg-amber-500 text-white" : "bg-gray-300 text-gray-700"}`}
            >
              {m.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="relative my-4">
        <div className="h-1.5 bg-gray-300 rounded-full" />
        <div
          className="absolute top-0 left-0 h-1.5 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Circles */}
        <div className="absolute inset-0 grid grid-cols-3 items-center">
          {updatedMilestones.map((m, i) => (
            <div key={i} className="flex justify-center">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center
                  ${m.completed
                    ? "bg-amber-500 border-white shadow-md"
                    : "bg-gray-300 border-white"}`}
              >
                {m.completed ? (
                  <Check className="w-4 h-4 text-white stroke-[3]" />
                ) : (
                  <Gift className="w-4 h-4 text-gray-600" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amounts */}
      <div className="grid grid-cols-3 text-center mt-2">
        {updatedMilestones.map((m, i) => (
          <div key={i}>
            <span
              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold
                ${m.completed ? "bg-amber-500 text-white" : "bg-gray-300 text-gray-600"}`}
            >
              ₹ {m.amount.toLocaleString("en-IN")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressOfferBar;
