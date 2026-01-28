import { useState } from "react";

export default function ReferralCode1({ referralCode, couponCode, setReferralCode }) {
    const [showInput, setShowInput] = useState(false);
    const [inputValue, setInputValue] = useState(referralCode);

    console.log(referralCode, "referralCode")

    const [applied, setApplied] = useState(true)

    const handleApply = () => {
        if (!inputValue.trim()) return;
        setReferralCode(inputValue.trim());
        setShowInput(false);
        setApplied(true)
    };

    const handleRemove = () => {
        setApplied(false)
        setReferralCode("");
        // setInputValue("");
        setShowInput(false);
    };

    console.log(couponCode, "coupon")
    return (
        <div className="my-2">
            <div className="flex gap-2">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Enter referral code"
                    className="flex-1 px-2 py-1 text-sm border rounded outline-none focus:ring-1 focus:ring-orange-400"
                />


                {
                    applied ?
                        <button
                            onClick={handleRemove}
                            className="px-3 py-1 text-sm cursor-pointer  font-semibold text-white bg-orange-500 rounded hover:bg-orange-600"
                        >
                            Remove
                        </button> :
                        <button
                            disabled={!!couponCode}
                            title={couponCode ? "A coupon is active on this order. Referral codes can’t be combined. " : "Apply coupon"}
                            onClick={handleApply}
                            className={`px-3 py-1 text-sm font-semibold text-white rounded
    ${couponCode
                                    ? "bg-orange-300 cursor-not-allowed"
                                    : "bg-orange-500 hover:bg-orange-600 cursor-pointer"
                                }`}
                        >
                            Apply
                        </button>


                }

            </div>
        </div>
    );
}
