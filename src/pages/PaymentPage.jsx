import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react';
import { BsCashCoin } from 'react-icons/bs';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentPage() {
  const [referralCode, setReferralCode] = useState('CXESRF');
  const [applyDefault, setApplyDefault] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState('Online');
  const [codeApplied, setCodeApplied] = useState(false);
  const [balance, setBalance] = useState(0);

  const [searchParams] = useSearchParams();
  const addressIndex = searchParams.get("addressIndex");

  const user = JSON.parse(localStorage.getItem("user"))

  const paymentMethods = [
    { id: 'Online', name: 'Wallet', balance: balance, icon: '👛' },
    { id: 'apple', name: 'Apple Pay', icon: '' },
    { id: 'google', name: 'Google Pay', icon: 'G' },
    { id: 'COD', name: 'COD', icon: BsCashCoin }
  ];
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBalance();
    fetchCartData()
  }, []);


  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWYxNTQ5YmFjZmM4MGY0OGEzNzMwNiIsImlhdCI6MTc2MzY0NDc0NiwiZXhwIjoxNzY2MjM2NzQ2fQ.jDIJvr4OiTUhBOGuc_YAI7bFg29dw0Clah2z7XRZSwo"
  const fetchBalance = async () => {
    try {
      //   const { data } = await axios.get(`/api/wallet/balance/${user._id}`);
      //   setBalance(data.balance || 0);


      if (!token) {
        setError("Please login to view wallet");
        setLoading(false);
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch balance
      const balanceRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/walletAndTransaction/getWalletBalance`,
        { headers }
      );
      console.log(balanceRes, "balanceRes")
      if (!balanceRes.ok) {
        throw new Error('Failed to fetch balance');
      }

      const balanceData = await balanceRes.json();
      setBalance(balanceData.data || 0);


    } catch (err) {
      console.log("Balance fetch failed:", err);
    }
  };

  const [cartItems, setCartItems] = useState([]);

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



  const price = 747;
  const referralDiscount = codeApplied ? 47 : 0;
  const shippingAmount = 50;




  const totalItems = cartItems.reduce((sum, item) => sum + Number(item.quantity), 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + Number(item.totalAmount), 0);
  const totalAmount = totalPrice - referralDiscount + shippingAmount;
console.log(cartItems)
  const handleApply = () => {
    if (referralCode.trim()) {
      setCodeApplied(true);
    }
  };

  //  import axios from "axios";
  const Navigate = useNavigate()

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return alert("Please login first!");

    if (!cartItems.length) return alert("Cart is empty!");

    const items = cartItems.map((item) => ({
      productId: item.product._id ,
      quantity: item.quantity,
    }));

    const body = {
      items,
      shippingAddress: user?.shippingAddress[addressIndex],
      paymentMethod: selectedMethod,
      shippingAmount: shippingAmount,
      discountAmount: referralDiscount,
    };

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/user/orders/createOrder`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.success) {
        alert("Order placed successfully!");
        console.log("Order:", res.data.order);

        Navigate("/orders")

        // Optional → Clear cart or redirect
        // navigate(`/order/${res.data.order._id}`);
      }
    } catch (error) {
      console.error("Checkout Error:", error);
      alert(error.response?.data?.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };



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

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-400 rounded-full blur-2xl"></div>
      </div>

      <div className="relative z-10 p-4 md:p-6 max-w-5xl mx-auto">
        <h1 className="text-xl font-bold text-white mb-6">Choose Payment Method</h1>

        {/* Referral Code Input */}
        <div className="mb-4">
          <label className="block text-white text-sm mb-2">Enter Referral Code</label>
          <div className="flex bg-white rounded-lg overflow-hidden">
            <input
              type="text"
              value={referralCode}
              onChange={(e) => { setReferralCode(e.target.value); setCodeApplied(false); }}
              placeholder="Enter code"
              className="flex-1 px-4 py-3 text-gray-800 focus:outline-none"
            />
            <button
              onClick={handleApply}
              className="px-6 py-3 text-amber-500 hover:text-amber-600 font-medium transition-colors"
            >
              Apply
            </button>
          </div>
          {codeApplied && (
            <p className="text-green-400 text-xs mt-1">✓ Referral code applied successfully!</p>
          )}
        </div>

        {/* Apply Default Checkbox */}
        <label className="flex items-center gap-3 mb-6 cursor-pointer">
          <div
            onClick={() => setApplyDefault(!applyDefault)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${applyDefault ? 'bg-amber-500 border-amber-500' : 'border-gray-400 bg-transparent'
              }`}
          >
            {applyDefault && (
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-white text-sm">Apply default referral code</span>
        </label>

        {/* Payment Methods */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl overflow-hidden mb-4 border border-slate-700">
          {paymentMethods.map((method, index) => (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`flex items-center justify-between p-4 cursor-pointer transition-colors hover:bg-slate-700/50 ${index !== paymentMethods.length - 1 ? 'border-b border-slate-700' : ''
                }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-amber-500">
                  {method.id === 'Online' && <WalletIcon />}
                  {method.id === 'apple' && <AppleIcon />}
                  {method.id === 'google' && <GoogleIcon />}
                  {method.id === 'COD' && <BsCashCoin />}
                </span>
                <span className="text-white text-sm">
                  {method.name}
                  {method.balance && (
                    <span className="text-gray-400"> (Balance: ₹ {method.balance})</span>
                  )}
                </span>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-amber-500' : 'border-gray-500'
                }`}>
                {selectedMethod === method.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Price Details */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700">
          <h3 className="text-white font-semibold mb-3">Price Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-400 border-b border-slate-600 border-dashed pb-2">
              <span>Total Items</span>
              <span className="text-white">{totalItems}</span>
            </div>
            <div className="flex justify-between text-gray-400 border-b border-slate-600 border-dashed pb-2">
              <span>Price</span>
              <span className="text-white">₹ {totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-400 border-b border-slate-600 border-dashed pb-2">
              <span> Discount Amount</span>
              <span className={referralDiscount > 0 ? 'text-green-400' : 'text-gray-400'}>
                {referralDiscount > 0 ? `-₹ ${referralDiscount}` : '₹ 0'}
              </span>
            </div>
            <div className="flex justify-between text-gray-400 border-b border-slate-600 border-dashed pb-2">
              <span>Shipping Amount</span>
              <span className="text-white">₹ {shippingAmount}</span>
            </div>
            <div className="flex justify-between text-white font-semibold pt-1">
              <span>Total Amount</span>
              <span className="text-amber-500">₹ {totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 px-20 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/30 w-full max-w-sm disabled:opacity-50"
        >
          {loading ? "Processing..." : "Check Out"}
        </button>

      </div>
    </div>
  );
}