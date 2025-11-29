import { useState, useEffect } from 'react';
import { Package, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/orders/getMyOrders
?page=${page}&limit=${ordersPerPage}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch orders');

      const data = await response.json();
      setOrders(data.data || []);
      setTotalPages(data.pagination.totalPages || 1);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Placed': 'text-blue-400 bg-blue-400',
      'Processing': 'text-blue-400 bg-blue-400',
      'Shipped': 'text-purple-400 bg-purple-400',
      'Delivered': 'text-teal-400 bg-teal-400',
      'Cancelled': 'text-red-400 bg-red-400',
      'Returned': 'text-orange-400 bg-orange-400',
      'Refunded': 'text-yellow-400 bg-yellow-400'
    };
    return statusColors[status] || 'text-slate-400 bg-slate-400';
  };
  const Navigate = useNavigate()
  const handleNavigateToOrder = (orderId) => {
    // Navigate to order details page

  };

  

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];

    // Always show first page
    buttons.push(
      <button
        key={1}
        onClick={() => handlePageChange(1)}
        className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${currentPage === 1 ? 'bg-amber-500' : 'bg-slate-700/80 hover:bg-slate-700'
          }`}
      >
        1
      </button>
    );

    // Show ellipsis if needed
    if (currentPage > 3) {
      buttons.push(
        <span key="ellipsis-1" className="text-white px-2">
          ...
        </span>
      );
    }

    // Show pages around current page
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (i === 1 || i === totalPages) continue;
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${currentPage === i ? 'bg-amber-500' : 'bg-slate-700/80 hover:bg-slate-700'
            }`}
        >
          {i}
        </button>
      );
    }

    // Show ellipsis if needed
    if (currentPage < totalPages - 2) {
      buttons.push(
        <span key="ellipsis-2" className="text-white px-2">
          ...
        </span>
      );
    }

    // Always show last page if there's more than 1 page
    if (totalPages > 1) {
      buttons.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${currentPage === totalPages ? 'bg-amber-500' : 'bg-slate-700/80 hover:bg-slate-700'
            }`}
        >
          {totalPages}
        </button>
      );
    }

    return buttons;
  };

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-white text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Error: {error}</p>
          <button
            onClick={() => fetchOrders(currentPage)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Mystical background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/4 w-96 h-96 border border-blue-400/30 rounded-full"></div>
        <div className="absolute top-40 left-1/3 w-64 h-64 border border-blue-300/20 rounded-full"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 border border-amber-400/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 border-2 border-blue-400/20 rounded-full flex items-center justify-center">
            <div className="w-48 h-48 border border-blue-300/20 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 text-center">
            <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No orders found</p>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-4 bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const statusColors = getStatusColor(order.status);
              const [textColor, bgColor] = statusColors.split(' ');
              const isDelivered = order.status === 'Delivered';

              return (
                <div
                  key={order._id}
                  className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/60 transition-all duration-300"
                >
                  <div className="flex items-center gap-4">
                    {/* Product Image */}
                    <div
                      onClick={() => Navigate(`/orders/${order._id}`)}
                      className="w-16 h-16 rounded cursor-pointer overflow-hidden flex-shrink-0 bg-slate-700"
                    >
                      {order.image ? (
                        <img
                          src={order.image}
                          alt={order.productName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full ${bgColor} flex items-center justify-center`}>
                          <Package className="w-8 h-8 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Order Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-400">
                          Order ID: {order.orderId}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${textColor}`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-white text-sm truncate">
                        {order.productName}
                      </p>
                      <p className="text-amber-400 font-semibold">₹ {order.price}</p>

                      {/* Star Rating - Show only for delivered orders */}
                      {/* {!isDelivered && (
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                          <button
                            onClick={(e) => handleAddReview(order._id, e)}
                            className="text-xs text-blue-400 ml-2 cursor-pointer hover:text-blue-300 transition-colors"
                          >
                            Add Review
                          </button>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="w-8 h-8 rounded-full bg-amber-500/80 hover:bg-amber-500 flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {renderPaginationButtons()}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="w-8 h-8 rounded-full bg-amber-500/80 hover:bg-amber-500 flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default OrdersPage;