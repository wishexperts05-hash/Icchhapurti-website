import React, { lazy, Suspense } from 'react';
import { AlertTriangle, CheckCircle, Truck, X, Gift } from 'lucide-react';

const Confetti = lazy(() => import('react-confetti'));

export default function CheckoutOverlays({
    initialLoading,
    checkoutLoading,
    showWarning,
    setWarning,
    onWarningContinue,
    onWarningLeave,
    showCouponPopup,
    setshowCouponPopup,
    couponCode,
    couponDiscount,
    // Referral-specific success modal props
    checkoutSuccess,
    estimatedDelivery
}) {
    return (
        <>
            {/* Loading Overlay */}
            {(initialLoading || checkoutLoading) && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5">
                    <div className="absolute inset-0 bg-transparent" />
                    <div className="relative z-10 bg-white px-6 py-4 rounded-xl shadow-xl flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-amber-500/40 border-t-amber-500 rounded-full animate-spin" />
                        <span className="text-sm font-semibold text-gray-900">
                            {initialLoading ? 'Loading...' : 'Processing...'}
                        </span>
                    </div>
                </div>
            )}

            {/* Warning Modal */}
            {showWarning && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
                        <div className="flex items-start gap-4 mb-4">
                            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-800 mb-2">Leave Checkout?</h3>
                                <p className="text-gray-600 text-sm">Your order is not complete yet. If you leave now, your items will remain in your cart.</p>
                            </div>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={onWarningContinue || (() => setWarning(false))}
                                className="flex-1 px-4 py-2.5 bg-purple-900 text-white rounded-lg font-medium hover:bg-purple-800 transition-colors cursor-pointer"
                            >
                                Continue Checkout
                            </button>
                            <button
                                onClick={onWarningLeave}
                                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Coupon Popup */}
            {showCouponPopup && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm px-2">
                    <Suspense fallback={null}>
                        <Confetti numberOfPieces={150} recycle={false} />
                    </Suspense>
                    <div className="relative w-full max-w-xs bg-white rounded-xl shadow-lg p-4 text-center">
                        <button onClick={() => setshowCouponPopup(false)} className="absolute top-2 right-2 text-gray-500 hover:text-black cursor-pointer"><X /></button>
                        <div className="flex justify-center mb-2">
                            <div className="bg-green-100 text-green-600 p-3 rounded-full animate-bounce"><Gift size={24} /></div>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-1">🎉 Coupon {couponCode} Applied!</h2>
                        <p className="text-gray-600 text-sm mb-2">You just unlocked a special discount</p>
                        <div className="text-2xl font-extrabold text-green-600 mb-2">{couponDiscount} OFF</div>
                        <button onClick={() => setshowCouponPopup(false)} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg text-sm transition cursor-pointer">
                            Continue Checkout 🚀
                        </button>
                    </div>
                </div>
            )}

            {/* Referral Success Modal */}
            {checkoutSuccess && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-5 max-w-sm w-full text-center shadow-xl border border-green-300">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <CheckCircle className="w-9 h-9 text-green-500" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Payment Successful! 🎉</h3>
                        <p className="text-gray-500 text-sm mb-4">Thank you for your order. Redirecting to orders...</p>
                        {estimatedDelivery ? (
                            <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-left">
                                <div className="flex items-center gap-2 mb-1">
                                    <Truck className="w-4 h-4 text-amber-500 shrink-0" />
                                    <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Estimated Delivery</span>
                                </div>
                                <p className="text-base font-bold text-gray-900">{estimatedDelivery.deliveryDate}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{estimatedDelivery.message}</p>
                                {estimatedDelivery.destination && <p className="text-xs text-gray-400 mt-0.5">To: {estimatedDelivery.destination}</p>}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
                                <div className="w-3 h-3 border border-gray-300 border-t-amber-400 rounded-full animate-spin" />
                                Fetching delivery estimate...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
