import { memo, useCallback } from 'react';

const OrderSummary = memo(function OrderSummary({ items, couponDiscount, isAuthenticated, setCartItems, setItems }) {
    const currencySymbol = items[0]?.currencySymbol || '₹';

    const parseAmount = useCallback((amount) =>
        Number(String(amount || 0).replace(/[^0-9.]/g, '')), []);

    const referral = Number(couponDiscount) || 0;
    const totalAmount = Math.max(
        items.reduce((sum, item) => sum + parseAmount(item.totalAmount), 0) - referral,
        0
    );

    const handleQuantityChange = useCallback((itemId, delta) => {
        const updatedItems = items.map((item) => {
            if (item._id === itemId) {
                const newQty = Math.max(item.quantity + delta, 1);
                return { ...item, quantity: newQty, totalAmount: newQty * parseAmount(item.product.price) };
            }
            return item;
        });
        if (isAuthenticated) setCartItems(updatedItems);
        else setItems(updatedItems);
    }, [items, isAuthenticated, setCartItems, setItems, parseAmount]);

    if (!items?.length) return null;

    return (
        <div className="border-b border-gray-50 bg-white text-sm">
            <div className="p-2">
                <div className="rounded-lg w-full overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between p-2 border-b border-gray-100">
                        <h3 className="font-bold text-gray-900">
                            Order Details <span className="font-normal ml-1">({items.length} Items)</span>
                        </h3>
                    </div>

                    <div className="overflow-y-auto max-h-[35vh] p-2">
                        {items.map((item) => (
                            <div key={item._id} className="flex gap-2 p-2 border border-gray-100 rounded hover:shadow transition-shadow">
                                <img
                                    src={item.product?.image || item.product?.images?.[0]}
                                    alt={item.name}
                                    className="w-16 h-16 object-cover rounded"
                                    loading="lazy"
                                />
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 truncate">{item.product.name}</h4>
                                    <div className="flex items-center justify-between mt-1">
                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => handleQuantityChange(item._id, -1)}
                                                className="px-2 py-0.5 bg-gray-200 rounded"
                                            >−</button>
                                            <span className="px-2">{item.quantity}</span>
                                            <button
                                                onClick={() => handleQuantityChange(item._id, 1)}
                                                className="px-2 py-0.5 bg-gray-200 rounded"
                                            >+</button>
                                        </div>
                                        <p className="font-medium text-gray-900">{item?.totalAmount?.toLocaleString('en-IN')}</p>
                                    </div>
                                    {item.discount > 0 && <p className="text-green-600 font-medium">{item.discount}% OFF</p>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t p-2 bg-gray-50">
                        {referral > 0 && (
                            <div className="flex justify-between text-green-600 text-xs">
                                <span>Discount</span>
                                <span>-{referral.toLocaleString('en-IN')}</span>
                            </div>
                        )}
                        <div className="flex justify-between font-bold mt-1">
                            <span>Total</span>
                            <span>{currencySymbol}{totalAmount.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default OrderSummary;
