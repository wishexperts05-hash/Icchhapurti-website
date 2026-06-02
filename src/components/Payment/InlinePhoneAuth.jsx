import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';

export default function InlinePhoneAuth({
    authPhone,
    setAuthPhone,
    authOtp,
    setAuthOtp,
    authStage,
    setAuthStage,
    authLoading,
    authError,
    setAuthError,
    handleSendOtp,
    handleVerifyOtp
}) {
    if (authStage === 'phone') {
        return (
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6 mt-4 sm:mt-6 border border-gray-100 space-y-4 sm:space-y-6 animate-slide-down">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-gray-900">Secure Checkout</h2>
                    <p className="text-gray-500 text-xs">Enter your mobile number to proceed to payment</p>
                </div>
                {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{authError}</span>
                    </div>
                )}
                <form onSubmit={handleSendOtp} className="space-y-3 sm:space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                            Mobile Number
                        </label>
                        <div className="relative flex rounded-xl border border-gray-200 bg-gray-50 overflow-hidden focus-within:ring-2 focus-within:ring-amber-500 focus-within:border-transparent transition-all">
                            <span className="flex items-center pl-4 pr-2 text-sm text-gray-500 border-r border-gray-200 bg-gray-100/50">
                                +91
                            </span>
                            <input
                                type="tel"
                                value={authPhone}
                                onChange={(e) => setAuthPhone(e.target.value.replace(/\D/g, ''))}
                                className="w-full px-4 py-2.5 sm:py-3 bg-transparent text-sm focus:outline-none text-gray-900"
                                placeholder="Enter 10-digit number"
                                maxLength="10"
                                required
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {authLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Sending OTP...</span>
                            </>
                        ) : (
                            <span>Continue to Checkout</span>
                        )}
                    </button>
                </form>
                <p className="text-center text-[10px] text-gray-400">100% Secure Transaction • Easy Returns</p>
            </div>
        );
    }

    if (authStage === 'otp') {
        return (
            <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-4 sm:p-6 mt-4 sm:mt-6 border border-gray-100 space-y-4 sm:space-y-6 animate-slide-down">
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-gray-900">Verify Mobile</h2>
                    <p className="text-gray-500 text-xs">
                        Enter the 6-digit OTP sent to <span className="font-semibold text-gray-900">+91 {authPhone}</span>
                    </p>
                </div>
                {authError && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2">
                        <AlertCircle size={16} className="shrink-0" />
                        <span>{authError}</span>
                    </div>
                )}
                <form onSubmit={handleVerifyOtp} className="space-y-3 sm:space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2 text-center">
                            Enter OTP
                        </label>
                        <input
                            type="text"
                            value={authOtp}
                            onChange={(e) => setAuthOtp(e.target.value.replace(/\D/g, ''))}
                            className="w-full px-4 py-2.5 sm:py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-center text-xl tracking-widest font-semibold text-gray-900"
                            placeholder="• • • • • •"
                            maxLength="6"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {authLoading ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                <span>Verifying...</span>
                            </>
                        ) : (
                            <span>Verify &amp; Login</span>
                        )}
                    </button>
                </form>

                <div className="flex flex-col gap-2 pt-2">
                    <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={authLoading}
                        className="w-full text-center text-xs font-medium text-amber-600 hover:text-amber-700 cursor-pointer transition-colors"
                    >
                        Resend OTP
                    </button>
                    <button
                        type="button"
                        onClick={() => { setAuthStage('phone'); setAuthOtp(''); setAuthError(''); }}
                        className="w-full text-center text-xs text-gray-500 hover:text-gray-700 cursor-pointer transition-colors"
                    >
                        Change Phone Number
                    </button>
                </div>
            </div>
        );
    }

    return null;
}
