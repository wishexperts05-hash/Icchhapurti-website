import { memo } from 'react';
import { Package } from 'lucide-react';

const PriceBreakdown = memo(function PriceBreakdown({ checkoutDetails, totalItems, couponDiscount }) {
    
    if (!checkoutDetails) return null;

    const parseNum = (val) => Number(String(val || 0).replace(/[₹$€£¥,\s]/g, ''));
    const currencySymbol = String(checkoutDetails?.totalAmount || '').replace(/[\d,.\s]/g, '') || '';
    const totalAmount = parseNum(checkoutDetails?.totalAmount);
    const discountOff = parseNum(checkoutDetails?.discountOff);
    const afterDiscount = totalAmount - discountOff;
    const basePrice = afterDiscount - (afterDiscount * 18 / 118);
    const gstAmount = (afterDiscount * 18) / 118;

    return (
        <div className="rounded-lg border border-slate-300 p-3 mb-4">
            <h3 className="text-black font-semibold text-base mb-2.5 flex items-center gap-2">
                <Package size={16} className="text-amber-400" />
                {"Price Details"}
            </h3>

            <div className="space-y-1.5 text-sm">
                {/* Total Items */}
                <div className="flex justify-between text-gray-600">
                    <span>{"Total Items"}</span>
                    <span className="text-black font-medium">{totalItems}</span>
                </div>

                <div className="border-t border-dashed border-slate-200 my-1.5"></div>

                {/* Price */}
                <div className="flex justify-between text-gray-600">
                    <span>{"Price"}</span>
                    <span className="text-black font-medium">
                        {checkoutDetails?.totalAmount?.toLocaleString('en-IN') || 0}
                    </span>
                </div>

                {/* Discount */}
                <div className="flex justify-between text-gray-600">
                    <span>Discount Off</span>
                    <span className="text-green-600 font-medium">
                        -{checkoutDetails?.discountOff?.toLocaleString('en-IN') || 0}
                    </span>
                </div>

                <div className="border-t border-dashed border-slate-200 my-1.5"></div>

                {/* Price After Discount */}
                <div className="flex justify-between text-gray-700 font-medium">
                    <span>Price After Discount</span>
                    <span className="text-black">{currencySymbol}{afterDiscount.toFixed(2)}</span>
                </div>

                {/* GST Breakdown */}
                <div className="bg-slate-50 rounded-md p-2 space-y-1 text-xs">
                    <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-1">
                            <span className="text-slate-400">├</span> Base Price
                        </span>
                        <span className="text-gray-700 font-medium">{currencySymbol}{basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span className="flex items-center gap-1">
                            <span className="text-slate-400">└</span> GST (18%)
                        </span>
                        <span className="text-gray-700 font-medium">{currencySymbol}{gstAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div className="border-t border-dashed border-slate-200 my-1.5"></div>

                {/* Shipping */}
                <div className="flex justify-between text-gray-600">
                    <span>{"Shipping Amount"}</span>
                    <span className="text-black font-medium">
                        +{checkoutDetails?.shippingCharge?.toLocaleString('en-IN') || 0}
                    </span>
                </div>

                <div className="border-t border-slate-300 my-2"></div>

                {/* Grand Total */}
                <div className="pt-1">
                    <div className="flex justify-between items-center">
                        <span className="text-black font-bold text-base">
                            {"Total Amount"}
                        </span>
                        <span className="text-amber-500 font-bold text-lg">
                            {checkoutDetails?.grandTotal?.toLocaleString('en-IN') || 0}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default PriceBreakdown;
