import axios from 'axios';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BsCashCoin } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { Loader2, AlertCircle, CheckCircle, Package, CreditCard, Wallet, ArrowLeft, ShieldCheck, Truck } from 'lucide-react';

export default function PaymentPage() {
  const [referralCode, setReferralCode] = useState('');
  const [applyDefault, setApplyDefault] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('Online');
  const [codeApplied, setCodeApplied] = useState(false);
  const [balance, setBalance] = useState(0);
  const [addresses, setAddresses] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [checkoutDetails, setDetails] = useState(null);
  const [referralDiscount, setDiscount] = useState(0);
  
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
  const searchParams = new URLSearchParams(window.location.search);
  const addressIndex = searchParams.get("addressIndex");

  const paymentMethods = [
    { id: 'wallet', name: t('payment.methods.wallet'), balance: balance, icon: 'wallet' },
    { id: 'Online', name: t('payment.methods.apple'), icon: 'apple' },
    { id: 'Online1', name: t('payment.methods.google'), icon: 'google' },
  ];

  useEffect(() => {
    initializePaymentPage();
  }, []);

  useEffect(() => {
    if (cartItems.length > 0 && addresses.length > 0) {
      fetchCheckOutDetails();
    }
  }, [cartItems, addresses]);

  const initializePaymentPage = async () => {
    setInitialLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to continue");
        Navigate('/login');
        return;
      }

      // Fetch all required data in parallel
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

  const fetchCheckOutDetails = async () => {
    try {
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
        setDetails(data.data);
        if (data.data.referralCode) {
          setReferralCode(data.data.referralCode);
        }
      } else {
        throw new Error(data.message || "Failed to load checkout details");
      }
    } catch (error) {
      console.error("Error fetching checkout details:", error);
      setError(error.message);
    }
  };

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
        { referralCode: code },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (res.data.success) {
        setDiscount(res.data.data.referralDiscountRate);
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

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert(t('payment.alerts.login_first'));
      Navigate('/login');
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

    const items = cartItems.map((item) => ({
      productId: item.product._id,
      quantity: item.quantity,
    }));

    const body = {
      items,
      shippingAddress: addresses[addressIndex || 0],
      paymentMethod: selectedMethod,
      shippingAmount: checkoutDetails?.shippingCharge || 0,
      referralCode: applyDefault ? "" : referralCode
    };

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/orders/createOrder`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body)
        }
      );

      const data = await res.json();

      if (data.success) {
        setCheckoutSuccess(true);
        setTimeout(() => {
          Navigate('/orders');
        }, 2000);
      } else {
        throw new Error(data.message || 'Failed to create order');
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      const errorMsg = error.response?.data?.message || error.message || t('payment.alerts.something_wrong');
      setError(errorMsg);
      setTimeout(() => setError(null), 4000);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);

  // Icon Components
  const AppleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );

  const GoogleIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );

  const WalletIcon = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 18v1c0 1.1-.9 2-2 2H5c-1.11 0-2-.9-2-2V5c0-1.1.89-2 2-2h14c1.1 0 2 .9 2 2v1h-9c-1.11 0-2 .9-2 2v8c0 1.1.89 2 2 2h9zm-9-2h10V8H12v8zm4-2.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    </svg>
  );

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

      <div className="relative z-10 p-4 md:p-6 max-w-5xl mx-auto">
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
            {t('payment.title')}
          </h1>
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

        {/* Trust Badges */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 text-center border border-slate-700">
            <ShieldCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-white text-xs font-medium">Secure Payment</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 text-center border border-slate-700">
            <Truck className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-white text-xs font-medium">Fast Delivery</p>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 text-center border border-slate-700">
            <Package className="w-8 h-8 text-amber-400 mx-auto mb-2" />
            <p className="text-white text-xs font-medium">{totalItems} Items</p>
          </div>
        </div>

        {/* Referral Code Input */}
        <div className="mb-6">
          <label className="block text-white text-sm font-semibold mb-3 flex items-center gap-2">
            <span>{t('payment.referral.label')}</span>
            {codeApplied && <CheckCircle size={16} className="text-green-400" />}
          </label>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700">
            <div className="flex">
              <input
                type="text"
                value={referralCode}
                disabled={checkoutDetails?.referralCode || applyingCode}
                onChange={(e) => { setReferralCode(e.target.value); setCodeApplied(false); }}
                placeholder={t('payment.referral.placeholder')}
                className="flex-1 px-4 py-4 bg-transparent text-white focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Apply Default Checkbox */}

        {
          !checkoutDetails?.referralCode  &&
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
            className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
              applyDefault ? 'bg-amber-500 border-amber-500 scale-110' : 'border-gray-400 bg-slate-700 group-hover:border-amber-400'
            }`}
          >
            {applyDefault && (
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-white text-sm font-medium">{t('payment.referral.default')}</span>
        </label>
        }
       

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
            <CreditCard size={20} className="text-amber-400" />
            Payment Method
          </h3>
          <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700">
            {paymentMethods.map((method, index) => (
              <div
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`flex items-center justify-between p-5 cursor-pointer transition-all hover:bg-slate-700/50 ${
                  index !== paymentMethods.length - 1 ? 'border-b border-slate-700' : ''
                } ${selectedMethod === method.id ? 'bg-amber-500/10' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    selectedMethod === method.id ? 'bg-amber-500/20' : 'bg-slate-700'
                  }`}>
                    {method.icon === 'wallet' && <WalletIcon />}
                    {method.icon === 'apple' && <AppleIcon />}
                    {method.icon === 'google' && <GoogleIcon />}
                  </div>
                  <div>
                    <span className="text-white font-medium block">{method.name}</span>
                    {method.balance !== undefined && (
                      <span className="text-gray-400 text-sm">
                        {t('payment.methods.balance')}: ₹ {method.balance.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedMethod === method.id ? 'border-amber-500 scale-110' : 'border-gray-500'
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
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-6 mb-6 border border-slate-700">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Package size={20} className="text-amber-400" />
            {t('payment.price_details.title')}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300 pb-3 border-b border-slate-600 border-dashed">
              <span>{t('payment.price_details.total_items')}</span>
              <span className="text-white font-semibold">{totalItems}</span>
            </div>
            <div className="flex justify-between text-gray-300 pb-3 border-b border-slate-600 border-dashed">
              <span>{t('payment.price_details.price')}</span>
              <span className="text-white font-semibold">
                ₹ {checkoutDetails?.totalAmount?.toLocaleString("en-IN") || 0}
              </span>
            </div>
            <div className="flex justify-between text-gray-300 pb-3 border-b border-slate-600 border-dashed">
              <span>Discount Off</span>
              <span className="text-green-400 font-semibold">
                - ₹ {checkoutDetails?.discountOff?.toLocaleString("en-IN") || 0}
              </span>
            </div>
            <div className="flex justify-between text-gray-300 pb-3 border-b border-slate-600 border-dashed">
              <span>Referral Discount</span>
              <span className={`font-semibold ${(referralDiscount || checkoutDetails?.referralDiscount) > 0 ? 'text-green-400' : 'text-gray-400'}`}>
                {(referralDiscount || checkoutDetails?.referralDiscount) > 0 && '- '}
                ₹ {(referralDiscount || checkoutDetails?.referralDiscount || 0).toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-gray-300 pb-3 border-b border-slate-600 border-dashed">
              <span>{t('payment.price_details.shipping')}</span>
              <span className="text-white font-semibold">
                ₹ {checkoutDetails?.shippingCharge?.toLocaleString("en-IN") || 0}
              </span>
            </div>
            <div className="flex justify-between text-white font-bold text-lg pt-2">
              <span>{t('payment.price_details.total_amount')}</span>
              <span className="text-amber-400 text-2xl">
                ₹ {((checkoutDetails?.grandTotal || 0) - (referralDiscount || 0)).toLocaleString("en-IN")}
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/50 w-full max-w-lg disabled:opacity-50 disabled:cursor-not-allowed mx-auto block text-lg flex items-center justify-center gap-3"
        >
          {checkoutLoading ? (
            <>
              <Loader2 size={24} className="animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <ShieldCheck size={24} />
              {t('payment.checkout')}
            </>
          )}
        </button>

        {/* Additional Info */}
        <p className="text-center text-gray-400 text-sm mt-4">
          By placing this order, you agree to our terms and conditions
        </p>
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