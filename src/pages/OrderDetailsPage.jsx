import React, { useEffect, useState } from 'react';
import { Package, Check } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

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
  const handleAddReview = (productId, e) => {
    e.stopPropagation();
    Navigate(`/add/review/${productId}`)
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-white text-xl">Loading orders Details...</div>
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

      <div className="relative z-10 max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-2">Order Details</h1>
        <p className="text-sm text-slate-300 mb-6">
          ORDER ID: <span className="text-white font-semibold">{oid}</span>
          <span className="ml-3 text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
            {status} • {paymentMethod} • {paymentStatus}
          </span>
        </p>

        {/* Order Items */}
        <div className="space-y-3 mb-8">
          {products.map((item) => (
            <div
              key={item.productId}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800/60 transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-600 rounded flex items-center justify-center overflow-hidden">
                  {item.images?.[0] ? (
                    <img
                      src={item.images[0]}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package className="w-6 h-6 text-white" />
                  )}
                </div>
                <div>
                  <p className="text-white text-sm line-clamp-2">{item.name}</p>
                  <p className="text-slate-400 text-xs">Qty: {item.quantity}</p>
                  <p className="text-amber-400 font-semibold">
                    ₹ {item.price} <span className="text-xs text-slate-400">(Subtotal: ₹ {item.subtotal})</span>
                  </p>
                  {item.returnable && (
                    <p className="text-xs text-emerald-400 mt-1">
                      Returnable{item.returnableDays ? ` within ${item.returnableDays} days` : ''}
                    </p>
                  )}
                </div>
              </div>
              <div className='flex gap-2'>
                {/* Add Review Button */}
                <button
                  onClick={(e) => {
                    if (status !== "Delivered") {
                      e.preventDefault();
                      return;
                    }
                    handleAddReview(item.productId, e);
                  }}
                  disabled={status !== "Delivered"}
                  className={`text-xs ml-2 px-3 py-1.5 rounded transition-colors duration-300
      ${status === "Delivered"
                      ? "text-white bg-green-600 hover:bg-green-700 cursor-pointer"
                      : "text-gray-400 bg-gray-200 cursor-not-allowed"
                    }
    `}
                  title={status === "Delivered" ? "Write a review" : "Only delivered products can be reviewed"}
                >
                  Add Review
                </button>

                {/* Return Button */}
                <Link
                  to={status === 'Delivered' && item?.returnable ? `/orders/return/${item.productId}` : '#'}
                  className={`px-4 py-1.5 text-white text-sm rounded transition-all duration-300 
      ${status === 'Delivered' && item?.returnable 
                      ? 'bg-amber-500 hover:bg-amber-600 cursor-pointer'
                      : 'bg-gray-600 cursor-not-allowed'
                    }`}
                  title={status === 'Delivered' && item?.returnable  ? '' : 'Only delivered & Returnable products can be returned'}
                  onClick={(e) => {
                    if (status !== 'Delivered') e.preventDefault();
                  }}
                >
                  Return
                </Link>
              </div>

            </div>
          ))}
        </div>

        {/* Order Timeline from API */}
        <div className="mb-8">
          <div className="relative pl-8">
            <div className="absolute left-2 top-2 bottom-2 w-0.5 bg-gradient-to-b from-emerald-400 via-emerald-400 to-emerald-400"></div>

            {timeline.map((step, index) => (
              <div key={index} className="relative mb-6 last:mb-0">
                <div className="absolute -left-6 w-4 h-4 rounded-full border-2 bg-emerald-400 border-emerald-400 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-slate-900" />
                </div>

                <div>
                  <h3 className="text-white font-semibold text-sm mb-1">{step.status}</h3>
                  <p className="text-slate-300 text-xs mb-1">{step.note}</p>
                  <p className="text-slate-500 text-xs">{formatDateTime(step.at)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address from API */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 mb-4">
          <h3 className="text-white font-semibold mb-3 text-sm border-b border-slate-700/50 pb-2">
            Delivery Address
          </h3>
          <div className="text-slate-300 text-sm">
            <p className="font-semibold text-white mb-1">{shippingAddress.label}</p>
            <p>
              {shippingAddress.street}, {shippingAddress.city} - {shippingAddress.pinCode}
            </p>
          </div>
        </div>

        {/* Price Details from API */}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 text-sm border-b border-slate-700/50 pb-2">
            Price Details
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-300">
              <span>Total Items</span>
              <span>{totalProducts}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Price</span>
              <span>₹ {subtotalAmount}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>-₹ {discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
              <span>Shipping Amount</span>
              <span>₹ {shippingAmount}</span>
            </div>
            <div className="border-t border-slate-700/50 pt-2 mt-2 flex justify-between text-white font-semibold">
              <span>Total Amount</span>
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
