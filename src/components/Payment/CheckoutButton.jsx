import React from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

export default function CheckoutButton({
    handleCheckout,
    isAuthenticated,
    checkoutLoading,
    pincodeServiceable,
    selectedMethod
}) {
    return (
        <button
            onClick={handleCheckout}
            disabled={!isAuthenticated || checkoutLoading || pincodeServiceable === false}
            className="w-full max-w-md mx-auto cursor-pointer bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-3 px-5 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-md hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
        >
            {checkoutLoading ? (
                <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>{selectedMethod === 'razorpay' ? 'Opening Payment Gateway...' : 'Processing Payment...'}</span>
                </>
            ) : (
                <>
                    <span>{selectedMethod === 'razorpay' ? 'Proceed To Payment' : 'Pay Now'}</span>
                    {selectedMethod === 'razorpay' && (
                        <div className="flex items-center ml-1">
                            {[
                                { src: '/paytm.png', alt: 'Paytm' },
                                { src: '/phonepay.jpg', alt: 'PhonePe' },
                                { src: '/gpay.jpg', alt: 'GPay' },
                            ].map((logo, i) => (
                                <div key={i} className={`w-6 h-6 rounded-full bg-white border border-white flex items-center justify-center ${i !== 0 ? '-ml-2' : ''}`}>
                                    <img src={logo.src} alt={logo.alt} className="w-4 h-4 object-contain" />
                                </div>
                            ))}
                        </div>
                    )}
                    <ArrowRight size={18} />
                </>
            )}
        </button>
    );
}
