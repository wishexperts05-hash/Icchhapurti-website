import { useState, useEffect } from 'react';
import { X, Loader2, ShoppingCart, AlertCircle, Plus, Minus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useHeader } from '../context/HeaderContext';
// import PaymentModal from '../pages/PaymentModal';
// import FullscreenModal from './FullscreenModal';
import ProgressOfferBar from './ProgressOfferBar';

export default function CartSidebar({ isOpen, onClose, countryCurrency, onCheckout }) {


  // console.log("CartSidebar countryCurrency:", countryCurrency);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { setCount } = useHeader();

  // Fetch cart data when sidebar opens
  useEffect(() => {
    if (isOpen) {
      if (token) {
        setIsGuest(false);
        fetchCartData();
      } else {
        setIsGuest(true);
        loadGuestCart();
        setLoading(false);
      }
    }
  }, [isOpen, token]);

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
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/cartItems?currencyCode=${countryCurrency}`, {
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

  // Helper function to extract numeric price
  const extractPrice = (price) => {
    if (typeof price === 'number') return price;
    if (typeof price === 'string') {
      return Number(price.replace(/[^0-9.]/g, ''));
    }
    return 0;
  };

  const updateQuantity = async ({ id, cartId, delta, price }) => {
    if (isGuest) {
      updateGuestQuantity(id, delta);
      return;
    }

    const item = cartItems.find(item => item._id === cartId);
    const currentQuantity = Number(item.quantity);
    const newQuantity = Math.max(1, currentQuantity + delta);

    if (newQuantity < 1) return;

    const numericPrice = extractPrice(price);
    const previousItems = [...cartItems];
    setCartItems(prevItems =>
      prevItems.map(cartItem =>
        cartItem._id === cartId
          ? {
            ...cartItem,
            quantity: newQuantity,
            totalAmount: Number(numericPrice * newQuantity)
          }
          : cartItem
      )
    );

    try {
      const numericPrice = extractPrice(price);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/updateQuantity?currencyCode=${countryCurrency}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          productId: id,
          quantity: newQuantity,
          totalAmount: Number(numericPrice * newQuantity)
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
      const numericPrice = extractPrice(guestCart[itemIndex].product.price);
      guestCart[itemIndex].quantity = newQuantity;
      guestCart[itemIndex].totalAmount = newQuantity * numericPrice;

      localStorage.setItem('cartItems', JSON.stringify(guestCart));

      const totalItems = guestCart.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem('cart', totalItems);

      setCartItems(guestCart);
      window.dispatchEvent(new CustomEvent('cartUpdated'));
    }
  };

  const removeItem = async (id) => {
    if (isGuest) {
      removeGuestItem(id);
      return;
    }

    const previousItems = [...cartItems];
    setCartItems(prevItems => prevItems.filter(item => item.product._id !== id));

    const oldCount = Number(localStorage.getItem("cart")) || 0;
    const newCount = Math.max(oldCount - 1, 0);
    localStorage.setItem("cart", newCount);
    setCount(newCount);

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

    const totalItems = updatedCart.reduce((sum, item) => sum + item.quantity, 0);
    localStorage.setItem('cart', totalItems);
    setCount(totalItems);
    setCartItems(updatedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const handleViewDetails = (product) => {
    navigate(`/product/${product.id || product._id}`);
    onClose();
  };

  const handleCheckout = () => {
    onCheckout()
  };


  const totalPrice = cartItems.reduce((sum, item) => sum + Number(extractPrice(item.totalAmount)), 0);

  return (
    <>
      {/* Sidebar Drawer */}
      <div
        className={`fixed top-0 right-0 h-full 
w-[85%] sm:w-100
bg-white shadow-2xl z-52 
transform transition-transform duration-300 ease-in-out
${isOpen ? 'translate-x-0' : 'translate-x-full'}`}

      >
        {/* Header */}
        <div className=" p-4 sm:p-6 text-white bg-gradient-to-br 
from-[#040934] 
via-[#030e2d] 
to-[#051036]
shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <ShoppingCart size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold">Shopping Cart</h2>
                <p className="text-xs text-white/80">{cartItems.length} items</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {cartItems && cartItems.length > 0 && (
          <ProgressOfferBar
            confettiOrigin={{ x: 0.95, y: 0.6 }}
         currentStep={0}
          />
        )}

        {/* Content */}

        <div className="flex min-h-0 overflow-y-auto flex-col h-[calc(100%-260px)]">
          {/* Cart Items - Scrollable */}
          <div className="flex-1 max-h-[calc(100%-120px)] overflow-y-scroll p-4 space-y-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Loader2 className="w-10 h-10 animate-spin text-[#a17b0a] mb-3" />
                <p className="text-gray-600">Loading cart...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchCartData}
                  className="bg-[#a17b0a] hover:bg-[#a17b0a] text-white px-4 py-2 rounded-lg transition-all"
                >
                  Retry
                </button>
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <ShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
                <p className="text-gray-600 text-lg mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm mb-4">Add items to get started</p>
                <button
                  onClick={() => {
                    navigate('/products');
                    onClose();
                  }}
                  className="bg-[#a17b0a] hover:bg-[#a17b0a] text-white px-6 py-2 rounded-lg transition-all"
                >
                  Browse Products
                </button>
              </div>
            ) : (
              cartItems.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-purple-300 transition-all"
                >
                  <div className="flex gap-3">
                    {/* Product Image */}
                    <div
                      onClick={() => handleViewDetails(item.product)}
                      className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer bg-white"
                    >
                      <img
                        src={item?.product?.images?.[0] || "/placeholder.png"}
                        alt={item?.product?.name || "Product"}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => handleViewDetails(item.product)}
                        className="text-sm font-medium text-gray-800 mb-1 truncate cursor-pointer hover:text-[#a17b0a]"
                      >
                        {item.product.name}
                      </h3>
                      <p className="text-black font-semibold text-sm mb-2">
                        {item.product.price}
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity({
                                id: isGuest ? (item.productId || item.product._id) : item.product._id,
                                cartId: item._id,
                                delta: -1,
                                price: item.product.price,
                              })
                            }
                            className="w-7 h-7 bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 rounded flex items-center justify-center transition-colors"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={14} />
                          </button>

                          <span className="w-8 h-7 bg-[#a17b0a] text-white rounded flex items-center justify-center text-sm font-medium">
                            {item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              updateQuantity({
                                id: isGuest ? (item.productId || item.product._id) : item.product._id,
                                cartId: item._id,
                                delta: 1,
                                price: item.product.price,
                              })
                            }
                            className="w-7 h-7 bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 rounded flex items-center justify-center transition-colors"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            removeItem(isGuest ? (item.productId || item.product._id) : item.product._id)
                          }
                          className="text-red-500 hover:text-red-600 p-1.5 hover:bg-red-50 rounded transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>


          {
            cartItems.length > 0 &&

            <div className="sticky bottom-[96px] z-10 w-full bg-gradient-to-r from-[#E59A2F] to-[#D8891E] text-white text-xs font-semibold py-1 flex items-center justify-center gap-4 shadow-sm">
              <span>Fast Shipping 🚚</span>
              <span>|</span>
              <span>Secure & Encrypted Checkout ✅</span>
            </div>
          }




          {/* Footer - Checkout */}
          {cartItems.length > 0 && (
            <div className="sticky bottom-0 z-20 border-t border-gray-200 p-4 bg-white">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 font-medium">SubTotal:</span>
                <span className="text-2xl font-bold text-black">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex items-center justify-between mb-4 text-sm text-gray-500">
                <p>
                  Final price (after discounts) will be displayed at checkout
                </p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full cursor-pointer bg-gradient-to-r from-[#a17b0a] to-[#a17b0a]
             hover:from-[#8c6909] hover:to-[#8c6909]
             text-white py-3 px-4 rounded-lg font-semibold
             transition-all shadow-lg hover:shadow-xl"
              >
                <div className="flex items-center justify-center">
                  {/* Left Text */}
                  <span className="text-base">Proceed to Checkout</span>

                  {/* Right Payment Icons */}
                  <div className="flex items-center ml-2">
                    {[
                      { src: "/paytm.png", alt: "Paytm" },
                      { src: "/phonepay.jpg", alt: "PhonePe" },
                      { src: "/gpay.jpg", alt: "GPay" },
                    ].map((logo, index) => (
                      <div
                        key={index}
                        className={`w-6 h-6 rounded-full bg-white border border-white
                      flex items-center justify-center
                      ${index !== 0 ? "-ml-2" : ""}`}
                      >
                        <img
                          src={logo.src}
                          alt={logo.alt}
                          className="w-4 h-4 object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </button>

            </div>
          )}
        </div>
      </div>


      {/* Backdrop Overlay */}
      {/* {isOpen && !openPayment && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )} */}


      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}