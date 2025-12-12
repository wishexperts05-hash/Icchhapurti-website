import { useState, useEffect } from 'react';
import { MapPin, Plus, Loader2, ShoppingCart, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useHeader } from '../context/HeaderContext';

export default function CartPage() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [isGuest, setIsGuest] = useState(false);

  const Navigate = useNavigate();
  const token = localStorage.getItem('token');

  const staffDiscount = 47;
  const shippingAmount = 50;

  // Fetch cart data on component mount
  useEffect(() => {
    if (token) {
      // Logged-in user - fetch from API
      setIsGuest(false);
      fetchCartData();
      fetchAddresses();
    } else {
      // Guest user - load from localStorage
      setIsGuest(true);
      loadGuestCart();
      setLoading(false);
    }
  }, [token]);

  const loadGuestCart = () => {
    try {
      const guestCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(guestCart);
    } catch (err) {
      console.error('Error loading guest cart:', err);
      setCartItems([]);
    }
  };

  const fetchCartData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/cartItems`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch addresses');

      const data = await response.json();
      setAddresses(data.data || []);

      const defaultAddr = data.addresses?.find(addr => addr.isDefault) || data.data?.[0];
      setSelectedAddress(defaultAddr);
    } catch (err) {
      console.error('Error fetching addresses:', err);
    }
  };

  const updateQuantity = async ({ id, cartId, delta, price }) => {
    if (isGuest) {
      // Guest user - update localStorage
      updateGuestQuantity(id, delta);
      return;
    }

    // Logged-in user - update via API
    const item = cartItems.find(item => item._id === cartId);
    const currentQuantity = Number(item.quantity);
    const newQuantity = Math.max(1, currentQuantity + delta);

    if (newQuantity < 1) return;

    const previousItems = [...cartItems];
    setCartItems(prevItems =>
      prevItems.map(cartItem =>
        cartItem._id === cartId
          ? {
              ...cartItem,
              quantity: newQuantity,
              totalAmount: Number(price * newQuantity)
            }
          : cartItem
      )
    );

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/updateQuantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id,
          quantity: newQuantity,
          totalAmount: Number(price * newQuantity)
        })
      });

      if (!response.ok) throw new Error('Failed to update quantity');

      const result = await response.json();
      
      if (!result.success) {
        setCartItems(previousItems);
        throw new Error('Failed to update quantity');
      }
    } catch (err) {
      console.error('Error updating quantity:', err);
      setCartItems(previousItems);
      alert('Failed to update quantity. Please try again.');
    }
  };

  const updateGuestQuantity = (productId, delta) => {
    const guestCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const itemIndex = guestCart.findIndex(item => 
      (item.productId || item.product._id) === productId
    );

    if (itemIndex > -1) {
      const newQuantity = Math.max(1, guestCart[itemIndex].quantity + delta);
      guestCart[itemIndex].quantity = newQuantity;
      guestCart[itemIndex].totalAmount = newQuantity * guestCart[itemIndex].product.price;

      localStorage.setItem('cartItems', JSON.stringify(guestCart));
      
      // Update cart count
      const totalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem('cart', totalItems);

      setCartItems(guestCart);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  };
  const { setCount } = useHeader();
  const removeItem = async (id) => {
    if (isGuest) {
      // Guest user - remove from localStorage
      removeGuestItem(id);
      return;
    }

    // Logged-in user - remove via API
    const previousItems = [...cartItems];
    setCartItems(prevItems => prevItems.filter(item => item.product._id !== id));
    
    const oldCount = Number(localStorage.getItem("cart")) || 0;
    const newCount = Math.max(oldCount - 1, 0);
    localStorage.setItem("cart", newCount);
    setCount(newCount)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/removeFromCart/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) throw new Error('Failed to remove item');

      const result = await response.json();
      
      if (!result.success) {
        setCartItems(previousItems);
        localStorage.setItem("cart", oldCount);
        throw new Error('Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing item:', err);
      setCartItems(previousItems);
      localStorage.setItem("cart", oldCount);
      alert('Failed to remove item. Please try again.');
    }
  };

  const removeGuestItem = (productId) => {
    const guestCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const updatedCart = guestCart.filter(item => 
      (item.productId || item.product._id) !== productId
    );

    localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    
    // Update cart count
    const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cart', totalItems);

    setCartItems(updatedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleAddAddress = () => {
    if (isGuest) {
      alert('Please login to add delivery address');
      Navigate('/login');
      return;
    }
    Navigate("/address-form");
  };

  const handleCheckout = (e) => {
    if (isGuest) {
      e.preventDefault();
      alert('Please login to proceed with checkout');
      Navigate('/login');
      return;
    }

    if (!selectedAddress) {
      e.preventDefault();
      alert('Please select a delivery address');
    }
    Navigate(`/payments?addressIndex=${selectedAddressIndex}`);
    
  };

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.totalAmount), 0);
  const totalAmount = totalPrice + shippingAmount;

  const PenIcon = ({ color }) => (
    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-slate-700 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
      <svg viewBox="0 0 40 40" className="w-8 h-8 sm:w-10 sm:h-10">
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-amber-400" />
          <p className="text-white text-lg">{t('cart.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
        <div className="text-center bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full border border-red-500/30">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <p className="text-red-400 text-xl mb-4">{t('cart.error')}: {error}</p>
          <button
            onClick={fetchCartData}
            className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            {t('cart.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-white">{t('cart.title')}</h1>
          {isGuest && (
            <div className="bg-amber-500/20 border border-amber-500/50 px-3 sm:px-4 py-2 rounded-lg">
              <p className="text-amber-400 text-xs sm:text-sm font-medium">Guest Mode</p>
            </div>
          )}
        </div>

        {/* Guest Login Banner */}
        {isGuest && cartItems.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/50 rounded-xl p-4 mb-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-white font-semibold text-sm mb-1">Login to Complete Your Purchase</p>
                <p className="text-gray-300 text-xs mb-3">Create an account or login to save your cart and proceed with checkout</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => Navigate('/login')}
                    className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => Navigate('/register')}
                    className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all"
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Address - Only for logged-in users */}
        {!isGuest && (
          <>
            {selectedAddress ? (
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 mb-4 border border-slate-700">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                  <div className="flex-1">
                    <p className="text-white text-sm">
                      <span className="text-gray-400">{t('cart.deliveryAddress.deliverTo')} </span>
                      <span className="font-semibold">{selectedAddress.fullName}</span>
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm mt-1">{selectedAddress.street}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pinCode}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{selectedAddress.country}</p>
                    <p className="text-gray-400 text-xs sm:text-sm">{t('cart.deliveryAddress.mobileNumber')} {selectedAddress.phoneNumber}</p>
                  </div>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                  >
                    {t('cart.deliveryAddress.changeAddress')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 mb-4 border border-amber-500/50">
                <div className="flex flex-col items-center justify-center text-center">
                  <MapPin className="w-12 h-12 text-amber-500 mb-3" />
                  <h3 className="text-white font-semibold text-lg mb-2">{t('cart.deliveryAddress.noAddress')}</h3>
                  <p className="text-gray-400 text-sm mb-4">{t('cart.deliveryAddress.noAddressDesc')}</p>
                  <button
                    onClick={handleAddAddress}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <Plus className="w-5 h-5" />
                    {t('cart.deliveryAddress.addAddress')}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Address Selection Modal */}
        {showAddressModal && !isGuest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">{t('cart.deliveryAddress.selectAddress')}</h2>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">{t('cart.deliveryAddress.noAddressesFound')}</p>
                  <button
                    onClick={handleAddAddress}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 mx-auto"
                  >
                    <Plus className="w-5 h-5" />
                    {t('cart.deliveryAddress.addNewAddress')}
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address, i) => (
                    <div
                      key={address._id}
                      onClick={() => {
                        setSelectedAddress(address);
                        setSelectedAddressIndex(i);
                        setShowAddressModal(false);
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedAddress?._id === address._id
                          ? 'border-amber-500 bg-slate-700/50'
                          : 'border-slate-700 hover:border-slate-600'
                      }`}
                    >
                      <p className="text-white text-sm">
                        <span className="font-semibold">{address.fullName}</span>
                      </p>
                      <p className="text-gray-400 text-sm mt-1">{address.street}</p>
                      <p className="text-gray-400 text-sm">{address.city}, {address.state} - {address.pinCode}</p>
                      <p className="text-gray-400 text-sm">{address.country}</p>
                      <p className="text-gray-400 text-sm">{t('cart.deliveryAddress.mobileNumber')} {address.phoneNumber}</p>
                    </div>
                  ))}
                  <button
                    onClick={handleAddAddress}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 border border-slate-600"
                  >
                    <Plus className="w-5 h-5" />
                    {t('cart.deliveryAddress.addNewAddress')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cart Items */}
        <div className="space-y-3 mb-4">
          {cartItems.map((item, index) => (
            <div key={item._id || index} className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-4 border border-slate-700">
              <div className="flex items-center gap-3 sm:gap-4">
                {/* <PenIcon color={item.color || 'blue'} /> */}
              <img
  src={item?.product?.images?.[0]?.url || "/placeholder.png"}
  alt={item?.product?.name || "Product"}
  className="w-14 h-14 object-cover rounded-md"
  loading="lazy"
/>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white text-sm font-medium truncate">{item.product.name}</h3>
                  <p className="text-amber-500 font-semibold mt-1">₹ {item.product.price}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity({
                        id: isGuest ? (item.productId || item.product._id) : item.product._id,
                        cartId: item._id,
                        delta: -1,
                        price: item.product.price
                      })}
                      className="w-7 h-7 bg-slate-700 hover:bg-slate-600 text-white rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <span className="w-8 h-7 bg-white text-slate-800 rounded flex items-center justify-center text-sm font-medium">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity({
                        id: isGuest ? (item.productId || item.product._id) : item.product._id,
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
                    onClick={() => removeItem(isGuest ? (item.productId || item.product._id) : item.product._id)}
                    className="text-red-400 hover:text-red-300 text-xs transition-colors"
                  >
                    {t('cart.product.remove')}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty Cart State */}
        {cartItems.length === 0 && (
          <div className="bg-slate-800/80 backdrop-blur-sm rounded-xl p-8 mb-4 border border-slate-700 text-center">
            <ShoppingCart className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">{t('cart.emptyCart.message')}</p>
            <Link
              to="/products"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              {t('cart.emptyCart.continueShopping')}
            </Link>
          </div>
        )}

        {/* Checkout Button */}
        {cartItems.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            {!isGuest && !selectedAddress && (
              <p className="text-amber-400 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('cart.checkout.addAddressWarning')}
              </p>
            )}
            <button
              onClick={handleCheckout}
              className={`font-semibold py-3 px-12 sm:px-20 rounded-lg transition-all duration-300 w-full sm:w-auto ${
                isGuest || (!isGuest && selectedAddress)
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white hover:shadow-lg hover:shadow-amber-500/30 cursor-pointer'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-60'
              }`}
            >
              {isGuest ? 'Login to Checkout' : 'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}