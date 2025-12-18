import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCashCoin } from 'react-icons/bs';
import { useLocation, useNavigate } from 'react-router-dom';
import { Loader2, Lock, AlertCircle, CheckCircle, Package, CreditCard, Wallet, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';
import { X } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import RegistrationModal from '../components/RegistrationModal';
import LoginModal from '../components/LoginModal';
import AddressModal from '../components/AddressModal';

export default function PaymentPage() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  const [referralCode, setReferralCode] = useState('');
  const [applyDefault, setApplyDefault] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('razorpay');
  const [codeApplied, setCodeApplied] = useState(false);
  const [balance, setBalance] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutDetails, setDetails] = useState(null);
  const [referralDiscount, setDiscount] = useState(0);

  console.log(cartItems, "cartItems")
  console.log(checkoutDetails, "checkoutDetails")
  console.log(referralDiscount, "referralDiscount")

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  console.log(isAuthenticated, "isAuthenticated")

  // Loading states
  const [initialLoading, setInitialLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [applyingCode, setApplyingCode] = useState(false);

  // Error and success states
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const { t } = useTranslation();
  const Navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [addressIndex, setAddressesIndex] = useState(0)

  const paymentMethods = [
    { id: 'wallet', name: t('payment.methods.wallet'), balance: balance, icon: 'wallet' },
    { id: 'razorpay', name: 'Online (Card/UPI/Netbanking)', icon: 'razorpay' },
  ];


  const [localCartItems, setItems] = useState([])


  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      initializePaymentPage();
    } else {
      const cart = JSON.parse(localStorage.getItem("cartItems"))
      setItems(cart)
      setIsAuthenticated(false);
      setShowAuthModal(true);
      setInitialLoading(false);
    }
  }, [isAuthenticated]);

  // useEffect(() => {
  //   if (cartItems.length > 0 && addresses.length > 0) {
  //     fetchCheckOutDetails();
  //   }
  // }, [cartItems, addresses]);

  // Load Razorpay Script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [orderToken, setOrderToken] = useState();
  const [registerModal, setRegisterModal] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);






  const initializePaymentPage = async () => {
    setInitialLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchBalance(),
        fetchCartData(),
        fetchAddresses()
      ]);
    } catch (err) {
      console.error("Initialization error:", err);
      setError("Failed to load payment page. Please try again.");
    } finally {
      setInitialLoading(false);
    }
  };

  const fetchBalance = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        'Content-Type': 'application/json'
      };

      const balanceRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/walletAndTransaction/getWalletBalance`,
        { headers }
      );

      if (!balanceRes.ok) throw new Error('Failed to fetch balance');

      const balanceData = await balanceRes.json();
      setBalance(balanceData.data || 0);
    } catch (err) {
      console.error("Balance fetch failed:", err);
    }
  };

  const fetchCartData = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/cartItems`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Failed to fetch cart data');

      const data = await response.json();

      if (!data.data || data.data.length === 0) {
        throw new Error('Your cart is empty');
      }

      setCartItems(data.data || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching cart:', err);
      throw err;
    }
  };

  const fetchAddresses = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/address/getAllAddress`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const data = await res.json();

      if (data.success && data.data && data.data.length > 0) {
        setAddresses(data.data);
      } else {
        throw new Error('No delivery address found. Please add an address.');
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setError(error.message);
      throw error;
    }
  };

  // const [checkoutLoading ,setCheckoutLoading] =useState(false)

  const fetchCheckOutDetails = async () => {
    try {
      setCheckoutLoading(true)
      const items = cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const body = {
        items,
        shippingAddress: addresses[addressIndex || 0],
      };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/orders/checkout`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
        }
      );

      const data = await res.json();

      if (data.success) {
        setDiscount(data.data.referralDiscount);
        setCheckoutLoading(false)
        setDetails(data.data);
        setOrderToken(data.orderToken);
        if (data.data.referralCode) {
          setReferralCode(data.data.referralCode);
        }
      } else {
        setCheckoutLoading(false)
        throw new Error(data.message || "Failed to load checkout details");
      }
    } catch (error) {
      setCheckoutLoading(false)
      console.error("Error fetching checkout details:", error);
      setError(error.message);
    }
  };
const[firstDiscount ,setFirstDiscount] = useState(0)
  const handleApply = async (code) => {
    if (!code || code.trim() === '') {
      setError("Please enter a referral code");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setApplyingCode(true);
    setError(null);
    setSuccessMsg('');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/orders/applyReferralCode`,
        { referralCode: " " },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        setDiscount(res.data.data.referralDiscountRate);
        setFirstDiscount(res.data.data.referralDiscountRate);
        setCodeApplied(true);
        setSuccessMsg("Referral code applied successfully!");
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        throw new Error(res.data.message || "Failed to apply referral code");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Failed to apply code";
      setError(errorMsg);
      setCodeApplied(false);
      setTimeout(() => setError(null), 4000);
    } finally {
      setApplyingCode(false);
    }
  };

  const createRazorpayOrder = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/orders/createOrder`,
        {
          orderToken,
          paymentMethod: "Online"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        return res.data.razorpayDetails;
      } else {
        throw new Error(res.data.message || "Failed to create Razorpay order");
      }
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      throw error;
    }
  };

  const createWalletpayOrder = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/orders/createOrder`,
        {
          orderToken,
          paymentMethod: "Wallet"
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        setCheckoutSuccess(true);
        setTimeout(() => {
          Navigate('/orders');
        }, 2000);
      } else {
        throw new Error(res.data.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Wallet order creation failed:", error);
      setError(error.response?.data?.message || error.message);
      throw error;
    }
  };

  const verifyRazorpayPayment = async (paymentData) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/orders/verifyPayment`,
        paymentData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      return res.data.success;
    } catch (error) {
      console.error("Payment verification failed:", error);
      return false;
    }
  };

  const handleRazorpayPayment = async () => {
    try {
      const razorpayOrder = await createRazorpayOrder();

      const options = {
        key: razorpayOrder.key_id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'ICHHAPURTI',
        description: 'Order Payment',
        image: "/logo-white.png",
        order_id: razorpayOrder.razorpayOrderId,
        handler: async function (response) {
          const isVerified = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
            orderId: razorpayOrder.orderId
          });

          if (isVerified) {
            setCheckoutLoading(false);
            setCheckoutSuccess(true);
            setTimeout(() => {
              Navigate('/orders');
            }, 2000);
          } else {
            throw new Error('Payment verification failed');
          }
        },
        prefill: {
          name: user.name || '',
          email: user.email || '',
          contact: user.phone || ''
        },
        notes: {
          address: addresses[addressIndex || 0]?.address || ''
        },
        theme: {
          color: '#F59E0B'
        },
        modal: {
          ondismiss: function () {
            setCheckoutLoading(false);
            setError('Payment cancelled by user');
            setTimeout(() => setError(null), 3000);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay payment error:", error);
      setError(error.message || 'Failed to initiate payment');
      setTimeout(() => setError(null), 4000);
      setCheckoutLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }

    if (!cartItems.length) {
      alert(t('payment.alerts.cart_empty'));
      return;
    }

    if (!addresses[addressIndex || 0]) {
      alert('Please select a delivery address');
      return;
    }

    setCheckoutLoading(true);
    setError(null);

    try {
      if (selectedMethod === 'razorpay') {
        await handleRazorpayPayment();
      } else if (selectedMethod === 'wallet') {
        const finalAmount = (checkoutDetails?.grandTotal || 0) - (referralDiscount || 0);
        if (balance < finalAmount) {
          throw new Error('Insufficient wallet balance');
        }
        await createWalletpayOrder();
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      const errorMsg = error.response?.data?.message || error.message || t('payment.alerts.something_wrong');
      setError(errorMsg);
      setTimeout(() => setError(null), 4000);
      setCheckoutLoading(false);
    }
  };


  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);



  // Icon Components
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

  // Show auth modal if not authenticated
  // if (!isAuthenticated && showAuthModal) {
  //   return <AuthModal />;
  // }

  // Initial Loading State
  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto"></div>
            <CreditCard className="w-10 h-10 text-amber-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white text-xl font-semibold mt-6">Loading Payment Details...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we prepare your checkout</p>
        </div>
      </div>
    );
  }

  // Checkout Success State
  if (checkoutSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-green-500/30">
          <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-white mb-3">Order Placed Successfully!</h3>
          <p className="text-gray-400 mb-6">Thank you for your purchase. Redirecting to orders...</p>
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-400" />
        </div>
      </div>
    );
  }

  // Error State (Critical)
  if (error && !checkoutDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-red-500/30">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Payment Error</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={initializePaymentPage}
              className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg"
            >
              Try Again
            </button>
            <button
              onClick={() => Navigate('/cart')}
              className="px-6 py-3 rounded-lg text-white font-medium bg-slate-700 hover:bg-slate-600 transition-all"
            >
              Back to Cart
            </button>
          </div>
        </div>
      </div>
    );
  }





  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>



      <div className="relative z-10 p-4 md:p-4  max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => Navigate('/cart')}
            className="text-white hover:text-amber-400 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <CreditCard size={28} className="text-amber-400" />
            Checkout
          </h1>
        </div>




        <div className="min-h-screen p-3 rounded-lg bg-gray-50">
          {/* Header */}
          <div className="bg-white shadow-sm">
            <div className="max-w-2xl mx-auto px-2 py-4 flex justify-center">
              <img
                src="/logo.png"
                alt="Ichhapurti"
                className="h-20"
              />
            </div>
          </div>


          {/* Trust Badge */}
          <div className="bg-white  shadow-sm text-black text-center py-3 px-4">
            <p className="text-sm font-medium">
              Trusted by over 100k+ Customers 💕
            </p>
          </div>

          {/* Order Summary Section */}
          <div className="max-w-3xl mx-auto px-4 py-6">
            <div className="bg-white rounded-lg px-3 shadow-sm overflow-hidden">
              {/* Order Summary Header */}

              {(() => {
                let itemsCount = 0;
                let totalAmount = 0;
                let originalAmount = 0;
                let items = []
                console.log(items, "items")
                if (isAuthenticated && checkoutDetails) {
                  items = cartItems
                  itemsCount = checkoutDetails.quantity || 1;
                  totalAmount = (checkoutDetails.totalAmount - referralDiscount) || 0;
                  originalAmount =
                    (checkoutDetails.totalAmount) * 1.1;
                }
                else if (!isAuthenticated && !checkoutDetails) {
                  items = localCartItems
                  itemsCount = localCartItems?.length || 0;
                  totalAmount = localCartItems.reduce(
                    (sum, item) => sum + Number(item.totalAmount || 0),
                    0
                  );
                  originalAmount = totalAmount * 1.1;
                }
                else if (isAuthenticated) {
                  items = cartItems
                  itemsCount = cartItems?.length || 0;
                  totalAmount = cartItems.reduce(
                    (sum, item) => sum + Number(item.totalAmount || 0),
                    0
                  );
                  originalAmount = totalAmount * 1.1;
                }

                if (!itemsCount) return null;

                return (
                  <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200 bg-white">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                      {/* LEFT */}
                      <h2 className="text-base sm:text-xl font-semibold text-gray-900">
                        Order summary
                        <span className="text-gray-500 font-normal ml-2">
                          {itemsCount} Items
                        </span>
                      </h2>

                      {/* RIGHT */}
                      <div
                        className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors"
                        onClick={() => setShowPopup(true)}
                      >
                        <span className="text-xs sm:text-sm text-gray-400 line-through">
                          ₹{originalAmount.toLocaleString("en-IN")}
                        </span>

                        <span className="text-lg sm:text-2xl font-bold text-gray-900">
                          ₹{totalAmount.toLocaleString("en-IN")}
                        </span>

                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                      </div>
                    </div>


                    {showPopup && (
                      <div className="fixed inset-0 mt-35 bg-opacity-50 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                          {/* Header */}
                          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                              Order Details
                            </h3>
                            <button
                              onClick={() => setShowPopup(false)}
                              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                              <X className="w-5 h-5 text-gray-500" />
                            </button>
                          </div>

                          {/* Products List */}
                          <div className="overflow-y-auto max-h-[40vh] p-4 sm:p-6">
                            <div className="space-y-4">
                              {items?.map((item) => (
                                <div
                                  key={item._id}
                                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                                >
                                  {/* Product Image */}
                                  <img
                                    src={item.product.image}
                                    alt={item.name}
                                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                                  />

                                  {/* Product Details */}
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2 truncate">
                                      {item?.product.name}
                                    </h4>

                                    <div className="space-y-1 text-sm">
                                      <p className="text-gray-600">
                                        Quantity: <span className="font-medium text-gray-900">{item.quantity}</span>
                                      </p>
                                      <p className="text-gray-600">
                                        Price:   <span className="font-medium line-through text-gray-900">₹{((item?.product?.price || 0) * 1.1).toLocaleString("en-IN")}
                                        </span> <span className="font-medium text-gray-900">₹{item?.product.price?.toLocaleString("en-IN")}</span>

                                      </p>
                                      {item?.discount > 0 && (
                                        <p className="text-green-600 font-medium">
                                          {item?.discount}% OFF
                                        </p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Total Amount */}
                                  <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">
                                      ₹{item?.totalAmount.toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Footer with Total */}
                          <div className="border-t border-gray-200 p-4 sm:p-6 bg-gray-50">
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm text-gray-600">
                                <span>Subtotal ({itemsCount} items)</span>
                                <span className="line-through">₹₹{((Number(originalAmount) || 0) / 1.1).toLocaleString("en-IN")}


</span>
                              </div>
                              {referralDiscount > 0 && (
                                <div className="flex justify-between text-sm text-green-600">
                                  <span>Discount</span>
                                  <span>-₹{referralDiscount.toLocaleString("en-IN")}</span>
                                </div>
                              )}
                              <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 pt-2 border-t border-gray-300">
                                <span>Total Amount</span>
                                <span>₹{(totalAmount || 0).toLocaleString("en-IN")}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}



                  </div>
                );
              })()}


              {/* Savings Banner */}

              {(() => {
                let savings = 0;

                if (isAuthenticated && checkoutDetails) {
                  savings =
                    (checkoutDetails.totalAmount || 0) * 0.1 +
                    (checkoutDetails.referralDiscount || 0);
                } else if (!isAuthenticated) {
                  savings =
                    localCartItems.reduce(
                      (sum, item) => sum + Number(item.totalAmount || 0),
                      0
                    ) * 0.1;
                } else if (isAuthenticated && !checkoutDetails) {
                  savings = cartItems.reduce(
                    (sum, item) => sum + Number(item.totalAmount || 0),
                    0
                  ) * 0.1;
                }

                if (savings <= 0) return null;

                return (
                  <div className="bg-green-50 border-l-4 border-green-500 px-6 py-4 rounded-lg shadow-sm mb-4">
                    <p className="text-green-800 font-semibold text-sm sm:text-base">
                      🎉 Yay! You’ve saved{" "}
                      <span className="font-bold">
                        ₹{savings.toLocaleString("en-IN")}
                      </span>{" "}
                      so far
                    </p>
                    <p className="text-green-700 text-xs mt-1">
                      Extra savings applied automatically at checkout
                    </p>
                  </div>
                );
              })()}



              <RegistrationModal
                isOpen={registerModal}
                onClose={() => setRegisterModal(false)}
                setIsAuthenticated={setIsAuthenticated}
              />
              <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                setIsAuthenticated={setIsAuthenticated}
              />


              <AddressModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                // onSuccess={handleSuccess}
                addressId={editAddressId}
                setAddressesIndex={setAddressesIndex}
              />
              {!isAuthenticated &&
                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">

                  {/* Heading */}
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Continue to Checkout
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Choose how you’d like to proceed. It only takes a few seconds ✨
                    </p>
                  </div>

                  {/* Trust Badges */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl p-3 text-center border border-gray-200 bg-gray-50">
                      <ShieldCheck className="w-7 h-7 text-green-500 mx-auto mb-1" />
                      <p className="text-gray-800 text-xs font-medium">Secure Payment</p>
                    </div>

                    <div className="rounded-xl p-3 text-center border border-gray-200 bg-gray-50">
                      <Truck className="w-7 h-7 text-blue-500 mx-auto mb-1" />
                      <p className="text-gray-800 text-xs font-medium">Fast Delivery</p>
                    </div>

                    <div className="rounded-xl p-3 text-center border border-gray-200 bg-gray-50">
                      <Package className="w-7 h-7 text-amber-500 mx-auto mb-1" />
                      <p className="text-gray-800 text-xs font-medium">
                        {totalItems} Items
                      </p>
                    </div>
                  </div>

                  {/* Primary CTA */}
                  <button
                    onClick={() => setRegisterModal(true)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-4 rounded-xl transition-all shadow-md hover:shadow-lg"
                  >
                    Add Delivery Address & Continue
                  </button>

                  {/* Divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-gray-200"></div>
                    <span className="text-gray-400 text-xs uppercase">or</span>
                    <div className="flex-1 h-px bg-gray-200"></div>
                  </div>

                  {/* Secondary CTA */}
                  <button
                    onClick={() => setIsLoginModalOpen(true)}
                    className="w-full border border-gray-300 hover:border-gray-400 text-gray-800 font-semibold py-4 rounded-xl transition-all hover:bg-gray-50"
                  >
                    I’m Already a Customer — Login
                  </button>

                  {/* Footer Microcopy */}
                  <p className="text-center text-xs text-gray-500">
                    100% secure checkout • Easy returns • Trusted by thousands
                  </p>
                </div>
              }

              {
                isAuthenticated && addresses[addressIndex] &&

                <div className=" mt-1 backdrop-blur-sm rounded-xl p-4 mb-4 border border-slate-700">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1">
                      <p className="text-black text-sm">
                        <span className="text-gray-800">{t('cart.deliveryAddress.deliverTo')} </span>
                        <span className="font-semibold">{addresses[addressIndex]?.fullName}</span>
                      </p>
                      <p className="text-gray-800 text-xs sm:text-sm mt-1">{addresses[addressIndex].street}</p>
                      <p className="text-gray-800 text-xs sm:text-sm">{addresses[addressIndex]?.city}, {addresses[addressIndex].state} - {addresses[addressIndex].pinCode}</p>
                      <p className="text-gray-800 text-xs sm:text-sm">{addresses[addressIndex].country}</p>
                      <p className="text-gray-800 text-xs sm:text-sm">{t('cart.deliveryAddress.mobileNumber')} {addresses[addressIndex].phoneNumber}</p>
                    </div>
                    {
                      !checkoutDetails &&
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-amber-500 hover:bg-amber-600 text-white text-xs sm:text-sm font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap"
                      >
                        {t('cart.deliveryAddress.changeAddress')}
                      </button>
                    }

                  </div>
                </div>

              }


              {
                isAuthenticated && !checkoutDetails &&
                <button className="bg-gradient-to-r my-2 from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 w-full max-w-lg disabled:opacity-50 disabled:cursor-not-allowed mx-auto block text-lg flex items-center justify-center gap-3" onClick={fetchCheckOutDetails} >


                  {
                    checkoutLoading ? "Processing" : "Checkout"
                  }
                </button>
              }





              {
                isAuthenticated && checkoutDetails &&

                <>


                  {/* Referral Code Input */}
                  <div className="mb-6">
                    <label className="block text-black text-sm font-semibold mb-3 flex items-center gap-2">
                      <span>{t('payment.referral.label')}</span>
                      {codeApplied && <CheckCircle size={16} className="text-green-400" />}
                    </label>
                    <div className=" backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700">
                      <div className="flex">
                        <input
                          type="text"
                          value={referralCode}
                          disabled={checkoutDetails?.referralCode || applyingCode}
                          onChange={(e) => { setReferralCode(e.target.value); setCodeApplied(false); }}
                          placeholder={t('payment.referral.placeholder')}
                          className="flex-1 px-4 py-4 bg-transparent text-black focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                        {
                          !checkoutDetails?.referralCode &&
                          <button
                            onClick={() => handleApply(referralCode)}
                            disabled={codeApplied || applyingCode || !referralCode.trim()}
                            className="px-6 py-4 text-amber-400 hover:text-amber-300 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                          >
                            {applyingCode ? (
                              <>
                                <Loader2 size={16} className="animate-spin" />
                                Applying...
                              </>
                            ) : codeApplied ? (
                              'Applied'
                            ) : (
                              t('payment.referral.apply')
                            )}
                          </button>
                        }
                      </div>
                    </div>
                  </div>


                  {
                    !checkoutDetails?.referralCode &&
                    <label className="flex items-center gap-3 mb-6 cursor-pointer group">
                      <div
                        onClick={() => {
                          const code = "Default Referral";
                          setReferralCode(code);
                          const newValue = !applyDefault;
                          setApplyDefault(newValue);
                          if (newValue) {
                            handleApply(code);
                          }
                        }}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${applyDefault ? 'bg-amber-500 border-amber-500 scale-110' : 'border-gray-400  group-hover:border-amber-400'
                          }`}
                      >
                        {applyDefault && (
                          <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-black text-sm font-medium">{t('payment.referral.default')}</span>
                    </label>
                  }

                  {/* Payment Methods */}
                  <div className="mb-6">
                    <h3 className="text-black font-semibold mb-3 flex items-center gap-2">
                      <CreditCard size={20} className="text-amber-400" />
                      Payment Method
                    </h3>
                    <div className="backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700">
                      {paymentMethods.map((method, index) => (
                        <div
                          key={method.id}
                          onClick={() => setSelectedMethod(method.id)}
                          className={`flex items-center justify-between p-5 cursor-pointer transition-all hover:bg-slate-200/50 ${index !== paymentMethods.length - 1 ? 'border-b border-slate-700' : ''
                            } ${selectedMethod === method.id ? 'bg-amber-500/10' : ''}`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedMethod === method.id ? 'bg-amber-500/20' : 'bg-white-700'
                              }`}>
                              {method.icon === 'wallet' && <WalletIcon />}
                              {method.icon === 'razorpay' && <RazorpayIcon />}
                              {/* {method.icon === 'cod' && <CODIcon />} */}
                            </div>
                            <div>
                              <span className="text-black font-medium block">{method.name}</span>
                              {method.balance !== undefined && (
                                <span className="text-gray-400 text-sm">
                                  {t('payment.methods.balance')}: ₹ {method.balance.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedMethod === method.id ? 'border-amber-500 scale-110' : 'border-gray-500'
                            }`}>
                            {selectedMethod === method.id && (
                              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Details */}
                  <div className=" backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700">
                    <h3 className="text-black font-bold text-lg mb-4 flex items-center gap-2">
                      <Package size={20} className="text-amber-400" />
                      {t('payment.price_details.title')}
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between text-gray-500 pb-3 border-b border-slate-600 border-dashed">
                        <span>{t('payment.price_details.total_items')}</span>
                        <span className="text-black font-semibold">{totalItems}</span>
                      </div>
                      <div className="flex justify-between text-gray-500 pb-3 border-b border-slate-600 border-dashed">
                        <span>{t('payment.price_details.price')}</span>
                        <span className="text-black font-semibold">
                          ₹ {checkoutDetails?.totalAmount?.toLocaleString("en-IN") || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-500 pb-3 border-b border-slate-600 border-dashed">
                        <span>Discount Off</span>
                        <span className="text-green-400 font-semibold">
                          - ₹ {checkoutDetails?.discountOff?.toLocaleString("en-IN") || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-500 pb-3 border-b border-slate-600 border-dashed">
                        <span>Referral Discount</span>
                        <span className={`font-semibold ${(referralDiscount || checkoutDetails?.referralDiscount) > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                          {(referralDiscount || checkoutDetails?.referralDiscount) > 0 && '- '}
                          ₹ {(referralDiscount || checkoutDetails?.referralDiscount || 0).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-gray-500 pb-3 border-b border-slate-600 border-dashed">
                        <span>{t('payment.price_details.shipping')}</span>
                        <span className="text-black font-semibold">
                          ₹ {checkoutDetails?.shippingCharge?.toLocaleString("en-IN") || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-black font-bold text-lg pt-2">
                        <span>{t('payment.price_details.total_amount')}</span>
                        <span className="text-amber-400 text-2xl">
                          ₹ {(checkoutDetails?.grandTotal || 0)-firstDiscount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={!isAuthenticated || checkoutLoading}
                    className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 w-full max-w-lg disabled:opacity-50 disabled:cursor-not-allowed mx-auto block text-lg flex items-center justify-center gap-3"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 size={24} className="animate-spin" />
                        {selectedMethod === 'razorpay' ? 'Opening Payment Gateway...' : 'Processing Payment...'}
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={24} />
                        {selectedMethod === 'razorpay' ? 'Proceed To Payment' : t('payment.checkout')}
                      </>
                    )}
                  </button>

                  {/* Additional Info */}
                  <p className="text-center text-gray-400 text-sm mt-4">
                    By placing this order, you agree to our terms and conditions
                  </p>

                  {selectedMethod === 'razorpay' && (
                    <div className="text-center mt-3 flex items-center justify-center gap-2">
                      <ShieldCheck size={16} className="text-green-400" />
                      <p className="text-gray-400 text-xs">
                        Secured by Razorpay - All major cards, UPI & Netbanking accepted
                      </p>
                    </div>
                  )}


                </>

              }




            </div>
          </div>
        </div>



        {/* Alert Messages */}
        {error && (
          <div className="mb-4 bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-slide-down">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-xl p-4 flex items-start gap-3 animate-slide-down">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-300 text-sm">{successMsg}</p>
          </div>
        )}


      </div>

      <style jsx>{`
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}