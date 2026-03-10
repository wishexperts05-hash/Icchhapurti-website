import React, { useEffect, useState } from 'react';
import { Package, Check } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const formatDateTime = (iso) => {
  if (!iso) return '';
  return new Date(iso).toLocaleString('en-IN', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const OrderDetailsPage = () => {
  const { orderId } = useParams(); // assuming route param for order id
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { t } = useTranslation()
  // Fetch order details from API
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        // Replace URL with actual API endpoint
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/orders/getOrderById/${orderId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const json = await response.json();

        if (json.success) {
          setOrder(json.data);
        } else {
          setError(json.message || 'Failed to fetch order');
        }
      } catch (err) {
        setError('Error fetching order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const Navigate = useNavigate()





  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-white text-xl">{t("orders.loading")}</div>
      </div>
    );
  }
  if (error) return <div className="text-red-400 p-6">Error: {error}</div>;
  if (!order) return null;

  const {
    orderId: oid,
    products,
    totalProducts,
    subtotalAmount,
    shippingAmount,
    discountAmount,
    grandTotal,
    shippingAddress,
    timeline,
    status,
    paymentMethod,
    paymentStatus

  } = order;


  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Background elements omitted for brevity, keep same as your original code */}

     <div className="relative bg-white z-10 max-w-4xl mx-auto p-6 text-slate-900">
<div className="w-full flex justify-start">
        <button
          onClick={() => Navigate(-1)}
          className="inline-flex cursor-pointer items-center my-2 gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>
      </div>
  {/* Header */}
  <h1 className="text-3xl font-bold text-slate-900 mb-2">
    {t("orders.orderDetails")}
  </h1>

  <p className="text-sm text-slate-600 mb-6">
    ORDER ID: <span className="text-slate-900 font-semibold">{oid}</span>
    <span className="ml-3 text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
      {status} • {paymentMethod} • {paymentStatus}
    </span>
  </p>

  {/* Order Items */}
  <div className="space-y-3 mb-8">
    {products.map((item) => (
      <div
        key={item.productId}
        className="bg-slate-50 border border-slate-200 rounded-lg p-4 flex items-center justify-between hover:bg-slate-100 transition-all"
      >
        <div className="flex items-center gap-4">
          <div
            onClick={() => Navigate(`/product/${item.productId}/${encodeURIComponent(item.name || "product")}`)}
            className="w-12 h-12 bg-slate-200 rounded flex items-center justify-center overflow-hidden cursor-pointer"
          >
            {item.images?.[0] ? (
              <img
                src={item.images[0]}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <Package className="w-6 h-6 text-slate-600" />
            )}
          </div>

          <div>
            <p className="text-slate-900 text-sm line-clamp-2">
              {item.name}
            </p>
            <p className="text-slate-600 text-xs">
              {t("order.qty")}: {item.quantity}
            </p>

            <p className="text-amber-600 font-semibold">
              ₹ {item.price}
              <span className="text-xs text-slate-500">
                ({t("orders.subtotal")}: ₹ {item.subtotal})
              </span>
            </p>

            {item.returnable && (
              <p className="text-xs text-emerald-600 mt-1">
                {t("orders.returnable")}
                {item.returnableDays
                  ? ` within ${item.returnableDays} days`
                  : ""}
              </p>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>

  {/* Order Timeline */}
  <div className="mb-8">
    <div className="relative pl-8">
      <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-emerald-300"></div>

      {timeline.map((step, index) => (
        <div key={index} className="relative mb-6 last:mb-0">
          <div className="absolute -left-6 w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-white" />
          </div>

          <div>
            <h3 className="text-slate-900 font-semibold text-sm mb-1">
              {step.status}
            </h3>
            <p className="text-slate-600 text-xs mb-1">
              {step.note}
            </p>
            <p className="text-slate-500 text-xs">
              {formatDateTime(step.at)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Delivery Address */}
  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
    <h3 className="text-slate-900 font-semibold mb-3 text-sm border-b border-slate-200 pb-2">
      {t("orders.deliveryAddress")}
    </h3>

    <div className="text-slate-700 text-sm">
      <p className="font-semibold text-slate-900 mb-1">
        {shippingAddress.label}
      </p>
      <p>
        {shippingAddress.street}, {shippingAddress.city} -{" "}
        {shippingAddress.pinCode}
      </p>
    </div>
  </div>

  {/* Price Details */}
  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
    <h3 className="text-slate-900 font-semibold mb-3 text-sm border-b border-slate-200 pb-2">
      {t("orders.price")}
    </h3>

    <div className="space-y-2 text-sm">
      <div className="flex justify-between text-slate-700">
        <span>{t("orders.totalItems")}</span>
        <span>{totalProducts}</span>
      </div>

      <div className="flex justify-between text-slate-700">
        <span>{t("orders.price")}</span>
        <span>₹ {subtotalAmount}</span>
      </div>

      {discountAmount > 0 && (
        <div className="flex justify-between text-emerald-600 font-medium">
          <span>Discount</span>
          <span>-₹ {discountAmount}</span>
        </div>
      )}

      <div className="flex justify-between text-slate-700">
        <span>{t("orders.shippingAmount")}</span>
        <span>₹ {shippingAmount}</span>
      </div>

      <div className="border-t border-slate-300 pt-2 mt-2 flex justify-between text-slate-900 font-bold">
        <span>{t("orders.totalAmount")}</span>
        <span>₹ {grandTotal}</span>
      </div>
    </div>
  </div>

</div>


      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OrderDetailsPage;
