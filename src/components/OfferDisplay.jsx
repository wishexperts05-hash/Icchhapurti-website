import { Tag } from "lucide-react";

export default function OfferDisplay({
  offers = [],
  couponCode: appliedCoupon,
  setCouponCode,
  isAuthenticated,
  referralCode
}) {
  const list = offers.length ? offers : [];
  const isReferralApplied = !!referralCode;

  return (
    <div className="mx-auto my-2 space-y-1">
      {list.map(({ couponCode, title }, i) => {
        const isApplied = appliedCoupon === couponCode;
        const isDisabled =
          !isAuthenticated || isReferralApplied;

        return (
          <div
            key={i}
            className="flex items-center justify-between p-2 bg-white border border-gray-200 rounded-md shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded-full">
                <Tag className="w-3 h-3 text-white" />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-xs">{couponCode}</span>
                <span className="px-1 py-1 text-xs font-semibold text-white bg-green-600 rounded">
                  Save {title}
                </span>
              </div>
            </div>

         <button
  onClick={() =>
    !isDisabled &&
    (isApplied ? setCouponCode("") : setCouponCode(couponCode))
  }
  disabled={isDisabled}
  className={`px-2 py-1 text-xs font-semibold border-2 rounded
    ${
      isDisabled
        ? "text-gray-400  border-gray-200 cursor-not-allowed bg-gray-50"
        : isApplied
        ? "text-red-500 border-red-200 hover:bg-red-50"
        : "text-orange-500 cursor-pointer border-orange-200 hover:bg-orange-50"
    }
  `}
  title={
    !isAuthenticated
      ? "Login to apply coupon"
      : referralCode
      ? "Either a referral code or a coupon can be applied"
      : isApplied
      ? "Remove coupon"
      : "Apply coupon"
  }
>
  {isApplied ? "Remove" : "Apply"}
</button>

          </div>
        );
      })}

      {/* 🔔 Info message when referral is applied */}
      {/* {isReferralApplied && (
        <div className="p-2 mt-2 text-xs text-orange-700 border border-orange-200 rounded bg-orange-50">
          Either a <span className="font-semibold">referral code</span> or a{" "}
          <span className="font-semibold">coupon</span> can be applied — not both.
        </div>
      )} */}
    </div>
  );
}
