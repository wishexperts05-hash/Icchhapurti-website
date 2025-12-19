import React, { useState, useEffect } from "react";
import { Coins, Wallet } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";

// load Razorpay script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const BuyCoinsPage = () => {
  const [coinQuantity, setCoinQuantity] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("wallet");

  const [searchParams] = useSearchParams();

  const coins = Number(searchParams.get("coins"));
  const rate = Number(searchParams.get("rate"));

  const [totalCoins, setCoins] = useState(
    Number(searchParams.get("totalCoins")) || 0
  );
  const Rate = Math.round(coins / rate || 1);

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false); // global loading for actions
  const [loadingWallet, setLoadingWallet] = useState(false); // separate for wallet fetch
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const calculatedPrice = (() => {
    const c = parseInt(coinQuantity) || 0;
    if (!c || c <= 0) return "0.00";
    return (c / Rate).toFixed(2);
  })();

  const fetchWalletData = async () => {
    try {
      setLoadingWallet(true);
      setError("");
      setSuccessMsg("");

      if (!localStorage.getItem("token")) {
        setError("Please login to view wallet");
        return;
      }

      const headers = {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      };

      const balanceRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/walletAndTransaction/getWalletBalance`,
        { headers }
      );

      if (!balanceRes.ok) {
        throw new Error("Failed to fetch balance");
      }

      const balanceData = await balanceRes.json();
      setBalance(balanceData.data || 0);
    } catch (err) {
      console.error("Error loading wallet:", err);
      setError(err.message || "Failed to load wallet data");
    } finally {
      setLoadingWallet(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuy = async () => {
    setError("");
    setSuccessMsg("");

    const qty = Number(coinQuantity);
    if (!qty || qty <= 0) {
      setError("Please enter a valid coin amount greater than 0.");
      return;
    }
    if (!localStorage.getItem("token")) {
      setError("Please login to continue.");
      return;
    }

    // WALLET FLOW
    if (selectedPayment === "wallet") {
      setLoading(true);
      try {
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/user/refer-account/buy-coins-from-wallet`,
          { coins: qty },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        if (res.data.success) {
          setCoins((prev) => Number(prev) + Number(res.data.data || 0));
          setSuccessMsg("Coins added to your account from wallet.");
          fetchWalletData();
        } else {
          setError(res.data.message || "Failed to buy coins from wallet.");
        }
      } catch (error) {
        console.error(error);
        const msg =
          error.response?.data?.message ||
          "Something went wrong while buying coins from wallet.";
        setError(msg);
      } finally {
        setLoading(false);
      }
      return;
    }

    // RAZORPAY FLOW
    if (selectedPayment === "razorPay") {
      setLoading(true);
      try {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          setError("Payment SDK failed to load. Please check your connection.");
          return;
        }

        // 1) Create order on backend for given coins
        const orderRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/refer-account/place-order`,
          { coins: qty },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!orderRes.data.success) {
          setError(orderRes.data.message || "Failed to create order.");
          return;
        }
        const razorpayOrder = orderRes.data.data;

        const options = {
          key: razorpayOrder.key_id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "ICHHAPURTI",
          description: "Order Payment",
          image: "/logo-white.png",
          order_id: razorpayOrder.razorpayOrderId,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/user/refer-account/verify-payment`,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  orderId: razorpayOrder.orderId,
                },
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                }
              );

              if (verifyRes.data.success) {
                // here coins credited are controlled by backend;
                // if backend returns coins count, prefer that instead of UI qty
                setCoins((prev) => Number(prev) + Number(qty));
                setSuccessMsg("Payment successful. Coins added to your account.");
                fetchWalletData();
              } else {
                setError(
                  verifyRes.data.message || "Payment verification failed."
                );
              }
            } catch (err) {
              console.error(err);
              setError("Error verifying payment. Please contact support.");
            }
          },
          prefill: {
            name: "User",
            email: "user@example.com",
            contact: "9999999999",
          },
          theme: {
            color: "#f97316",
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on("payment.failed", function (resp) {
          console.error("Payment failed:", resp.error);
          const desc = resp.error?.description || "Payment failed.";
          setError(desc);
        });

        rzp.open();
      } catch (err) {
        console.error(err);
        setError("Something went wrong while initiating payment.");
      } finally {
        setLoading(false);
      }
    }
  };

  const isActionDisabled =
    loading || loadingWallet || !coinQuantity || Number(coinQuantity) <= 0;

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/4 w-96 h-96 border border-blue-400/30 rounded-full" />
        <div className="absolute top-40 left-1/3 w-64 h-64 border border-blue-300/20 rounded-full" />
        <div className="absolute bottom-32 right-1/4 w-80 h-80 border border-amber-400/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 border-2 border-blue-400/20 rounded-full flex items-center justify-center">
            <div className="w-48 h-48 border border-blue-300/20 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full blur-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${
                Math.random() * 2
              }s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto p-6 space-y-4">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h1 className="text-3xl font-bold text-white">Buy Coins</h1>
          {loadingWallet && (
            <span className="text-xs text-slate-300 animate-pulse">
              Updating wallet...
            </span>
          )}
        </div>

        {/* Alerts */}
        {error && (
          <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-100">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="rounded-md border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100">
            {successMsg}
          </div>
        )}

        {/* Available Coins Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
              <Coins className="w-8 h-8 text-amber-900" />
            </div>
            <p className="text-white text-sm mb-1">Available Coins</p>
            <p className="text-white text-4xl font-bold mb-1">
              {totalCoins || 0}
            </p>
            <p className="text-amber-200 text-xs">
              {coins} coin = ₹ {rate}
            </p>
          </div>
        </div>

        {/* Enter Coins Quantity */}
        <div className="mb-2">
          <label className="text-white text-sm mb-2 block font-medium">
            Enter Coins Quantity
          </label>
          <input
            type="number"
            value={coinQuantity}
            onChange={(e) => {
              setError("");
              setSuccessMsg("");
              setCoinQuantity(e.target.value);
            }}
            placeholder="e.g. 100"
            min={1}
            className="w-full bg-slate-800/60 backdrop-blur-sm border border-slate-700/50 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading || loadingWallet}
          />
          <div className="flex justify-between mt-1 text-xs text-slate-300">
            <span>
              You will pay approx ₹ {calculatedPrice}
              {coinQuantity && Number(coinQuantity) > 0 ? "" : " (enter coins)"}
            </span>
            {balance > 0 && (
              <span>Wallet balance: ₹ {balance.toFixed(2)}</span>
            )}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-4">
          {/* Wallet */}
          <button
            type="button"
            onClick={() => setSelectedPayment("wallet")}
            disabled={loading || loadingWallet}
            className={`w-full text-left bg-slate-800/40 backdrop-blur-sm border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${
              selectedPayment === "wallet"
                ? "border-amber-400 bg-slate-800/60"
                : "border-slate-700/50 hover:bg-slate-800/50"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-400/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Wallet</p>
                <p className="text-xs text-slate-300">
                  Pay directly from wallet balance.
                </p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayment === "wallet"
                  ? "border-amber-400"
                  : "border-slate-600"
              }`}
            >
              {selectedPayment === "wallet" && (
                <div className="w-3 h-3 bg-amber-400 rounded-full" />
              )}
            </div>
          </button>

          {/* Razor Pay */}
          <button
            type="button"
            onClick={() => setSelectedPayment("razorPay")}
            disabled={loading || loadingWallet}
            className={`w-full text-left bg-slate-800/40 backdrop-blur-sm border rounded-lg p-4 flex items-center justify-between cursor-pointer transition-all duration-300 ${
              selectedPayment === "razorPay"
                ? "border-amber-400 bg-slate-800/60"
                : "border-slate-700/50 hover:bg-slate-800/50"
            } disabled:opacity-60 disabled:cursor-not-allowed`}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Online payment</p>
                <p className="text-xs text-slate-300">
                  Pay securely using Razorpay.
                </p>
              </div>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                selectedPayment === "razorPay"
                  ? "border-amber-400"
                  : "border-slate-600"
              }`}
            >
              {selectedPayment === "razorPay" && (
                <div className="w-3 h-3 bg-amber-400 rounded-full" />
              )}
            </div>
          </button>
        </div>

        {/* Pay Button */}
        <button
          onClick={handleBuy}
          disabled={isActionDisabled}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/60 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-lg transition-all duration-300 shadow-lg text-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>Pay ₹{calculatedPrice}</>
          )}
        </button>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default BuyCoinsPage;
