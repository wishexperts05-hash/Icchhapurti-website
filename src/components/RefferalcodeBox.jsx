import { useState } from "react";

export default function ReferralCode({ referralCode,couponCode, setReferralCode }) {
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const handleApply = () => {
    if (!inputValue.trim()) return;
    setReferralCode(inputValue.trim());
    setShowInput(false);
  };

  const handleRemove = () => {
    setReferralCode("");
    setInputValue("");
    setShowInput(false);
  };

  // ✅ If referral already applied
  if (referralCode) {
    return (
      <div className="flex items-center justify-between p-2 border rounded bg-green-50">
        <span className="text-sm font-semibold text-green-700">
          Referral applied: {referralCode}
        </span>
        <button
          onClick={handleRemove}
          className="text-xs font-semibold text-red-500 hover:underline"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <div className="my-2">
      {!showInput ? (
       <button
  disabled={!!couponCode}
  title={
    couponCode
      ? "You can apply either a coupon code or a referral code"
      : "Apply referral code"
  }
  onClick={() => setShowInput(true)}
  className={`text-sm font-semibold
    ${
      couponCode
        ? "text-gray-400 cursor-not-allowed"
        : "text-orange-500 hover:underline"
    }
  `}
>
  Have a referral code?
</button>

      ) : (
        <div className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter referral code"
            className="flex-1 px-2 py-1 text-sm border rounded outline-none focus:ring-1 focus:ring-orange-400"
          />
          <button
            onClick={handleApply}
            className="px-3 py-1 text-sm font-semibold text-white bg-orange-500 rounded hover:bg-orange-600"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
