import React, { useState } from 'react';
import { Coins, Wallet, CreditCard } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';

const BuyCoinsPage = () => {
  const [coinQuantity, setCoinQuantity] = useState('100');
  const [selectedPayment, setSelectedPayment] = useState('wallet');
  // const walletBalance = 2000;
  // const coinRate = 3; // 3 coins = ₹1


  const [searchParams] = useSearchParams();

  // const totalCoins = ;
  const coins = searchParams.get("coins");
  const rate = searchParams.get("rate");

  const [totalCoins, setCoins] = useState(searchParams.get("totalCoins"))
  const Rate = Math.round(coins / rate)

  const calculatePrice = () => {
    const coins = parseInt(coinQuantity) || 0;
    return (coins / Rate).toFixed(2);
  };




  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5MWYxNTQ5YmFjZmM4MGY0OGEzNzMwNiIsImlhdCI6MTc2MzY0NDc0NiwiZXhwIjoxNzY2MjM2NzQ2fQ.jDIJvr4OiTUhBOGuc_YAI7bFg29dw0Clah2z7XRZSwo"

  const fetchWalletData = async () => {
    try {
      setLoading(true);
      setError("");

      // Get token from localStorage


      if (!localStorage.getItem("token")) {
        setError("Please login to view wallet");
        setLoading(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      console.error("Error loading wallet:", err);
      setError(err.message || "Failed to load wallet data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);


  const handleBuy = async () => {
    if (!coinQuantity || coinQuantity <= 0) return alert("Invalid coin amount");

    setLoading(true);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/user/refer-account/buy-coins-from-wallet`,
        { coins:coinQuantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.data.success) {
      setCoins((prev) => Number(prev) + Number(res.data.data || 0));

        alert("Coins added to your account!");
        console.log(res.data);
        fetchWalletData()
      }


      // Redirect or update UI
      // navigate("/wallet");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-white mb-6">Buy Coins</h1>

        {/* Available Coins Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 mb-6 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
              <Coins className="w-8 h-8 text-amber-900" />
            </div>
            <p className="text-white text-sm mb-1">Available Coins</p>
            <p className="text-white text-4xl font-bold mb-1">{totalCoins || 0}</p>
            <p className="text-amber-200 text-xs">{coins} coin = ₹ {rate}</p>
          </div>
        </div>

        {/* Enter Coins Quantity */}
        <div className="mb-6">
          <label className="text-white text-sm mb-2 block font-medium">Enter Coins Quantity</label>
          <input
            type="number"
            value={coinQuantity}
            onChange={(e) => setCoinQuantity(e.target.value)}
            placeholder="100"
            className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {/* Wallet */}
          <div
            onClick={() => setSelectedPayment('wallet')}
            className={`bg-slate-800/40 backdrop-blur-sm border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${selectedPayment === 'wallet'
              ? 'border-amber-400 bg-slate-800/60'
              : 'border-slate-700/50 hover:bg-slate-800/50'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Wallet (Balance: ₹ {balance.toFixed(2)})</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'wallet'
              ? 'border-amber-400'
              : 'border-slate-600'
              }`}>
              {selectedPayment === 'wallet' && (
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              )}
            </div>
          </div>

          {/* Apple Pay */}
          <div
            onClick={() => setSelectedPayment('apple')}
            className={`bg-slate-800/40 backdrop-blur-sm border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${selectedPayment === 'apple'
              ? 'border-amber-400 bg-slate-800/60'
              : 'border-slate-700/50 hover:bg-slate-800/50'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Apple Pay</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'apple'
              ? 'border-amber-400'
              : 'border-slate-600'
              }`}>
              {selectedPayment === 'apple' && (
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              )}
            </div>
          </div>

          {/* Google Pay */}
          <div
            onClick={() => setSelectedPayment('google')}
            className={`bg-slate-800/40 backdrop-blur-sm border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${selectedPayment === 'google'
              ? 'border-amber-400 bg-slate-800/60'
              : 'border-slate-700/50 hover:bg-slate-800/50'
              }`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Google Pay</p>
              </div>
            </div>
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === 'google'
              ? 'border-amber-400'
              : 'border-slate-600'
              }`}>
              {selectedPayment === 'google' && (
                <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Pay Button */}
        <button onClick={handleBuy} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3.5 rounded-lg transition-all duration-300 shadow-lg text-lg">
          {loading ? (
            "loading"
          ) : (
            <>Pay ₹{calculatePrice()}</>
          )}

        </button>
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

export default BuyCoinsPage;