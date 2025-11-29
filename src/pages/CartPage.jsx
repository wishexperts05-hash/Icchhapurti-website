import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  const staffDiscount = 47;
  const shippingAmount = 50;

  // Fetch cart data on component mount
  useEffect(() => {
    fetchCartData();
    fetchAddresses();
  }, []);

  const fetchCartData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/cartItems
`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}` // Adjust based on your auth method
        }
      });

      if (!response.ok) throw new Error('Failed to fetch cart data');

      const data = await response.json();
      setCartItems(data.data || []);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/address/getAllAddress`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch addresses');

      const data = await response.json();
      setAddresses(data.data || []);

      // Set default address or first address
      const defaultAddr = data.addresses?.find(addr => addr.isDefault) || data.data?.[0];
      setSelectedAddress(defaultAddr);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const updateQuantity = async ({ id, cartId, delta, price }) => {
    const item = cartItems.find(item => item._id === cartId);
    const newQuantity = Math.max(1, Number(item.quantity) + delta);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/updateQuantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          productId: id,
          quantity: newQuantity,
          totalAmount: Number(price * newQuantity)
        })
      });

      if (!response.ok) throw new Error('Failed to update quantity');

      // Refetch cart data to get updated state
      fetchCartData();
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const removeItem = async (id) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/removeFromCart/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        // body: JSON.stringify({ itemId: id })
      });

      if (!response.ok) throw new Error('Failed to remove item');

      // Update local state
      fetchCartData()
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item. Please try again.');
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.totalAmount), 0);
  const totalAmount = totalPrice  + shippingAmount;

  const PenIcon = ({ color }) => (
    <div className="w-14 h-14 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 40 40" className="w-10 h-10">
        <defs>
          <linearGradient id={`pen-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color === 'blue' ? '#1e3a5f' : color === 'gold' ? '#d4a853' : '#e07830'} />
            <stop offset="100%" stopColor={color === 'blue' ? '#0f1f33' : color === 'gold' ? '#b8860b' : '#c45c1a'} />
          </linearGradient>
        </defs>
        <rect x="8" y="5" width="6" height="30" rx="1" fill={`url(#pen-${color})`} transform="rotate(-30 20 20)" />
        <polygon points="6,35 10,28 14,35" fill="#c0c0c0" transform="rotate(-30 20 20)" />
        <rect x="8" y="5" width="6" height="4" rx="1" fill="#c0c0c0" transform="rotate(-30 20 20)" />
      </svg>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-white text-xl">Loading cart...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-xl mb-4">Error: {error}</p>
          <button
            onClick={fetchCartData}
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
      {/* Background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-white mb-4">My Cart</h1>

        {/* Delivery Address */}
        {selectedAddress && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 mb-4 border border-slate-700">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-white text-sm">
                  <span className="text-gray-400">Deliver to: </span>
                  <span className="font-semibold">{selectedAddress.fullName}</span>
                </p>
                <p className="text-gray-400 text-sm mt-1">{selectedAddress.country}</p>
                <p className="text-gray-400 text-sm mt-1">{selectedAddress.state}</p>
                <p className="text-gray-400 text-sm mt-1">{selectedAddress.city}</p>
                <p className="text-gray-400 text-sm mt-1">{selectedAddress.street}</p>
                <p className="text-gray-400 text-sm mt-1">{selectedAddress.pinCode}</p>
                <p className="text-gray-400 text-sm">Mobile Number: {selectedAddress.phoneNumber}</p>
              </div>
              <button
                onClick={() => setShowAddressModal(true)}
                className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Change Address
              </button>
            </div>
          </div>
        )}

        {/* Address Selection Modal */}
        {showAddressModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Select Delivery Address</h2>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="space-y-3">
                {addresses.map((address, i) => (
                  <div
                    key={address._id}
                    onClick={() => {
                      setSelectedAddress(address);
                      setSelectedAddressIndex(i)
                      setShowAddressModal(false);
                    }}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddress?._id === address._id
                      ? 'border-amber-500 bg-slate-700/50'
                      : 'border-slate-700 hover:border-slate-600'
                      }`}
                  >
                    <p className="text-white text-sm">
                      {/* <span className="text-gray-400">Deliver to: </span> */}
                      <span className="font-semibold">{address.fullName}</span>
                    </p>
                    <p className="text-gray-400 text-sm mt-1">{address.country}</p>
                    <p className="text-gray-400 text-sm mt-1">{address.state}</p>
                    <p className="text-gray-400 text-sm mt-1">{address.city}</p>
                    <p className="text-gray-400 text-sm mt-1">{address.street}</p>
                    <p className="text-gray-400 text-sm mt-1">{address.pinCode}</p>
                    <p className="text-gray-400 text-sm">Mobile Number: {address.phoneNumber}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-3 mb-4">
          {cartItems.map(item => (
            <div key={item.id} className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-4">
                <PenIcon color={item.color || 'blue'} />
                <div className="flex-1">
                  <h3 className="text-white text-sm font-medium">{item.product.name}</h3>
                  <p className="text-amber-500 font-semibold mt-1">₹ {item.product.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity({
                        id: item.product._id,
                        cartId: item._id,
                        delta: -1,
                        price: item.product.price
                      })}
                      className="w-7 h-7 bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center justify-center transition-colors"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="w-8 h-7 bg-white text-slate-800 rounded flex items-center justify-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity({
                        id: item.product._id,
                        cartId: item._id,
                        delta: 1,
                        price: item.product.price
                      })}
                      className="w-7 h-7 bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="text-red-400 hover:text-red-300 text-xs transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 mb-4 border border-slate-700 text-center">
            <p className="text-gray-400 text-lg">Your cart is empty</p>
            <Link to="/products"
              className="inline-block mt-4 text-amber-500 hover:text-amber-400 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        )}

        {/* Price Details */}
        {cartItems.length > 0 && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 mb-4 border border-slate-700">
            <h3 className="text-white font-semibold mb-3">Price Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Total Items</span>
                <span className="text-white">{totalItems}</span>
              </div>
              <div className="flex justify-between text-gray-400 border-b border-slate-700 border-dashed pb-2">
                <span>Price</span>
                <span className="text-white">₹ {totalPrice}</span>
              </div>
              {/* <div className="flex justify-between text-gray-400 border-b border-slate-700 border-dashed pb-2">
                <span>Staff Referral Discount</span>
                <span className="text-green-400">-₹ {staffDiscount}</span>
              </div> */}
              <div className="flex justify-between text-gray-400 border-b border-slate-700 border-dashed pb-2">
                <span>Shipping Amount</span>
                <span className="text-white">₹ {shippingAmount}</span>
              </div>
              <div className="flex justify-between text-white font-semibold pt-1">
                <span>Total Amount</span>
                <span className="text-amber-500">₹ {totalAmount}</span>
              </div>
            </div>
          </div>
        )}

        {/* Checkout Button */}
        {cartItems.length > 0 && (
          <div className="flex justify-center">
            <Link to={`/payments?addressIndex=${selectedAddressIndex}`}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-20 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30"
            >
              Check Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}