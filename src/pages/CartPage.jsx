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
    setCount(totalItems)
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

  const handleViewDetails = (product) => {
    // alert('Navigating to product details page');
    Navigate(`/product/${product.id || product._id}`);
  };

  const handleCheckout = (e) => {
    Navigate(`/payments?addressIndex=${selectedAddressIndex}`);
  };

  // const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.totalAmount), 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-700 text-lg">{t('cart.loading')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center bg-white rounded-2xl p-8 max-w-md w-full border-2 border-red-200 shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 text-xl mb-4">{t('cart.error')}: {error}</p>
          <button
            onClick={fetchCartData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            {t('cart.retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] relative overflow-hidden">
      <div className="relative bg-white z-10 p-4 mt-2 md:p-6 max-w-3xl mx-auto">
        
        {/* Address Selection Modal */}
        {/* {showAddressModal && !isGuest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">{t('cart.deliveryAddress.selectAddress')}</h2>
                <button
                  onClick={() => setShowAddressModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">{t('cart.deliveryAddress.noAddressesFound')}</p>
                  <button
                    onClick={handleAddAddress}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 mx-auto"
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
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${selectedAddress?._id === address._id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <p className="text-gray-800 text-sm">
                        <span className="font-semibold">{address.fullName}</span>
                      </p>
                      <p className="text-gray-600 text-sm mt-1">{address.street}</p>
                      <p className="text-gray-600 text-sm">{address.city}, {address.state} - {address.pinCode}</p>
                      <p className="text-gray-600 text-sm">{address.country}</p>
                      <p className="text-gray-600 text-sm">{t('cart.deliveryAddress.mobileNumber')} {address.phoneNumber}</p>
                    </div>
                  ))}
                  <button
                    onClick={handleAddAddress}
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 border border-gray-300"
                  >
                    <Plus className="w-5 h-5" />
                    {t('cart.deliveryAddress.addNewAddress')}
                  </button>
                </div>
              )}
            </div>
          </div>
        )} */}

        {/* Cart Items */}
        <div className="space-y-3 mb-4">
          <div className="mb-4">
            <h2 className="text-black text-2xl sm:text-3xl font-bold">
              Cart
            </h2>
            <p className="text-gray-500 text-sm">
              Review your selected items
            </p>
          </div>

          {cartItems.map((item, index) => (
            <div
              onClick={() => handleViewDetails(item.product)}
              key={item._id || index}
              className="bg-white cursor-pointer rounded-xl p-4 border-2 border-gray-200 hover:border-purple-300 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  src={token ? item?.product?.images?.[0] : item?.product?.images?.[0] || "/placeholder.png"}
                  alt={item?.product?.name || "Product"}
                  className="w-14 h-14 object-cover rounded-md pointer-events-none"
                  loading="lazy"
                />

                <div className="flex-1 min-w-0 pointer-events-none">
                  <h3 className="text-gray-800 text-sm font-medium truncate">{item.product.name}</h3>
                  <p className="text-purple-600 font-semibold mt-1">{item.product.price}</p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity({
                          id: isGuest ? (item.productId || item.product._id) : item.product._id,
                          cartId: item._id,
                          delta: -1,
                          price: item.product.price,
                        });
                      }}
                      className="w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>

                    <span 
                      onClick={(e) => e.stopPropagation()}
                      className="w-8 h-7 bg-purple-600 text-white rounded flex items-center justify-center text-sm font-medium"
                    >
                      {item.quantity}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantity({
                          id: isGuest ? (item.productId || item.product._id) : item.product._id,
                          cartId: item._id,
                          delta: 1,
                          price: item.product.price,
                        });
                      }}
                      className="w-7 h-7 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(isGuest ? (item.productId || item.product._id) : item.product._id);
                    }}
                    className="text-red-500 hover:text-red-600 text-xs transition-colors"
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
          <div className="bg-white rounded-xl p-8 mb-4 border-2 border-gray-200 text-center shadow-sm">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-4">{t('cart.emptyCart.message')}</p>
            <Link
              to="/products"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              {t('cart.emptyCart.continueShopping')}
            </Link>
          </div>
        )}

        {/* Checkout Button */}
        {cartItems.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            {!isGuest && !selectedAddress && (
              <p className="text-purple-600 text-sm flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {t('cart.checkout.addAddressWarning')}
              </p>
            )}
            <button
              onClick={handleCheckout}
              className={`font-semibold py-3 px-12 sm:px-20 rounded-lg transition-all duration-300 w-full sm:w-auto ${isGuest || (!isGuest && selectedAddress)
                  ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white hover:shadow-lg hover:shadow-purple-500/30 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
                }`}
            >
              {/* {isGuest ? 'Login to Checkout' : 'Proceed to Checkout'} */}
              {'Proceed to Checkout'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}