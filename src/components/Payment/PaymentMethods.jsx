import { memo } from 'react';
import { CreditCard } from 'lucide-react';

const WalletIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
);

const RazorpayIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#3395FF">
        <path d="M22.436 0l-11.91 7.773-1.174 4.276 6.625-4.297L11.65 24h4.391l6.395-24zM14.26 10.098L3.389 17.166 1.564 24h9.008l3.688-13.902z" />
    </svg>
);

const PaymentMethods = memo(function PaymentMethods({ paymentMethods, selectedMethod, onSelect }) {
    
    return (
        <div className="my-4">
            <h3 className="text-black font-medium mb-2 flex items-center gap-2 text-sm">
                <CreditCard size={16} className="text-amber-400" />
                Payment Method
            </h3>

            <div className="rounded-lg overflow-hidden border border-slate-300">
                {paymentMethods.map((method, index) => (
                    <div
                        key={method.id}
                        onClick={() => onSelect(method.id)}
                        className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-all hover:bg-slate-100
                            ${index !== paymentMethods.length - 1 ? 'border-b border-slate-200' : ''}
                            ${selectedMethod === method.id ? 'bg-amber-500/10' : ''}`}
                    >
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-md flex items-center justify-center
                                ${selectedMethod === method.id ? 'bg-amber-500/20' : 'bg-gray-100'}`}>
                                {method.icon === 'wallet' && <WalletIcon />}
                                {method.icon === 'razorpay' && <RazorpayIcon />}
                            </div>

                            <div className="leading-tight">
                                <span className="text-black text-sm font-medium">{method.name}</span>
                                {method.balance !== undefined && (
                                    <div className="text-xs text-gray-500">₹ {method.balance.toFixed(2)}</div>
                                )}
                            </div>
                        </div>

                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center
                            ${selectedMethod === method.id ? 'border-amber-500' : 'border-gray-400'}`}>
                            {selectedMethod === method.id && (
                                <div className="w-2 h-2 rounded-full bg-amber-500" />
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
});

export default PaymentMethods;
