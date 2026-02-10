import { Tag } from "lucide-react";

export default function OfferDisplay({
  offers = [],
  couponCode: appliedCoupon,
  setCouponCode,
  isAuthenticated,
  referralCode,
  spinOffers = []
}) {
  const list = offers.length ? offers : [];
  const isReferralApplied = !!referralCode;

  return (
    <div className="mx-auto my-2 space-y-1">

      {/* Spin Offers */}
      {spinOffers.length > 0 && (
        <p className="text-xs text-purple-500 font-semibold">🎡 Your Spin Reward</p>
      )}
      {spinOffers.map(({ couponCode, title }, i) => {
        const isApplied = appliedCoupon === couponCode;
        const isDisabled = !isAuthenticated || isReferralApplied;

        return (
          <div
            key={`spin-${i}`}
            className="flex items-center justify-between p-2 bg-white border border-purple-200 rounded-md shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-600 rounded-full">
                {/* Spin wheel icon */}
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 17.93V18a1 1 0 0 0-2 0v1.93A8 8 0 0 1 4.07 13H6a1 1 0 0 0 0-2H4.07A8 8 0 0 1 11 4.07V6a1 1 0 0 0 2 0V4.07A8 8 0 0 1 19.93 11H18a1 1 0 0 0 0 2h1.93A8 8 0 0 1 13 19.93z" />
                </svg>
              </div>

              <div className="flex items-center gap-2">
                <span className="font-bold text-xs">{couponCode}</span>
                <span className="px-1 py-1 text-xs font-semibold text-white bg-purple-600 rounded">
                  🎁 {title}
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
                    ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50"
                    : isApplied
                    ? "text-red-500 border-red-200 hover:bg-red-50"
                    : "text-purple-500 cursor-pointer border-purple-200 hover:bg-purple-50"
                }
              `}
              title={
                !isAuthenticated
                  ? "Login to apply coupon"
                  : isReferralApplied
                  ? "Either a referral code or a coupon can be applied"
                  : isApplied
                  ? "Remove coupon"
                  : "Apply spin reward"
              }
            >
              {isApplied ? "Remove" : "Apply"}
            </button>
          </div>
        );
      })}

      {/* Regular Offers */}
      {list.map(({ couponCode, title }, i) => {
        const isApplied = appliedCoupon === couponCode;
        const isDisabled = !isAuthenticated || isReferralApplied;

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
                    ? "text-gray-400 border-gray-200 cursor-not-allowed bg-gray-50"
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
    </div>
  );
}