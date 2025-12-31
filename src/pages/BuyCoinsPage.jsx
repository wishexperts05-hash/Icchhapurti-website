import React, { useState, useEffect } from "react";
import { Coins, Wallet, AlertCircle, CheckCircle2, X } from "lucide-react";
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

// Alert Component with auto-dismiss
const Alert = ({ type = "error", message, onClose }) => {
  useEffect(() => {
    if (type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [type, onClose]);

  const styles = {
    error: {
      bg: "bg-red-500/10",
      border: "border-red-500/40",
      text: "text-red-100",
      icon: <AlertCircle className="w-5 h-5 text-red-800 flex-shrink-0" />,
    },
    success: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/40",
      text: "text-emerald-100",
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    },
  };

  const style = styles[type];

  return (
    <div
      className={`${style.bg} ${style.border} ${style.text} border rounded-lg p-4 flex items-start gap-3 animate-in slide-in-from-top-2 duration-300`}
    >
      {style.icon}
      <p className="flex-1 text-gray-800 text-sm">{message}</p>
      <button
        onClick={onClose}
        className="text-black hover:text-black transition-colors"
        aria-label="Close alert"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

// Skeleton Loader
const SkeletonLoader = () => (
  <div className="animate-pulse">
    <div className="h-8 bg-slate-700/50 rounded w-32 mx-auto mb-2"></div>
    <div className="h-4 bg-slate-700/30 rounded w-24 mx-auto"></div>
  </div>
);

const BuyCoinsPage = () => {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [coinQuantity, setCoinQuantity] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("wallet");
  const [searchParams] = useSearchParams();

  const coins = Number(searchParams.get("coins")) || 1;
  const rate = Number(searchParams.get("rate")) || 1;
  const [totalCoins, setCoins] = useState(
    Number(searchParams.get("totalCoins")) || 0
  );
  const Rate = Math.round(coins / rate);

  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingWallet, setLoadingWallet] = useState(true);
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

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login to view wallet");
        setLoadingWallet(false);
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };

      const balanceRes = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/walletAndTransaction/getWalletBalance`,
        { headers }
      );

      if (!balanceRes.ok) {
        const errorData = await balanceRes.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to fetch wallet balance");
      }

      const balanceData = await balanceRes.json();
      setBalance(balanceData.data || 0);
    } catch (err) {
      console.error("Error loading wallet:", err);
      setError(err.message || "Failed to load wallet data. Please try again.");
    } finally {
      setLoadingWallet(false);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

  const handleBuy = async () => {
    setError("");
    setSuccessMsg("");

    const qty = Number(coinQuantity);
    if (!qty || qty <= 0) {
      setError("Please enter a valid coin amount greater than 0.");
      scrollToTop()
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to continue.");
      scrollToTop()
      return;
    }

    // Validate wallet balance for wallet payment
    if (selectedPayment === "wallet") {
      const requiredAmount = parseFloat(calculatedPrice);
      if (balance < requiredAmount) {
        setError(
          `Insufficient wallet balance. You need ₹${requiredAmount.toFixed(
            2
          )} but have ₹${balance.toFixed(2)}`
        );
        scrollToTop()
        return;
      }
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
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          const coinsAdded = Number(res.data.data || qty);
          setCoins((prev) => Number(prev) + coinsAdded);
          setSuccessMsg(
            `Successfully added ${coinsAdded} coins to your account!`
          );
          setCoinQuantity("");
          await fetchWalletData();
          scrollToTop()
        } else {
          setError(res.data.message || "Failed to purchase coins from wallet.");
          scrollToTop()
        }
      } catch (error) {
        console.error("Wallet purchase error:", error);
        const msg =
          error.response?.data?.message ||
          error.message ||
          "Something went wrong while purchasing coins. Please try again.";
        setError(msg);
        scrollToTop()
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
          setError(
            "Payment gateway failed to load. Please check your internet connection and try again."
          );
          setLoading(false);
          return;
        }

        // Create order
        const orderRes = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/refer-account/place-order`,
          { coins: qty },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!orderRes.data.success) {
          throw new Error(orderRes.data.message || "Failed to create order.");
        }

        const razorpayOrder = orderRes.data.data;

        const options = {
          key: razorpayOrder.key_id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "ICHHAPURTI",
          description: `Purchase ${qty} coins`,
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
                    Authorization: `Bearer ${token}`,
                  },
                }
              );

              if (verifyRes.data.success) {
                const coinsAdded = Number(verifyRes.data.coins || qty);
                setCoins((prev) => Number(prev) + coinsAdded);
                setSuccessMsg(
                  `Payment successful! ${coinsAdded} coins added to your account.`
                );
                setCoinQuantity("");
                await fetchWalletData();
                scrollToTop()
              } else {
                setError(
                  verifyRes.data.message ||
                  "Payment verification failed. Please contact support if amount was deducted."
                );
                scrollToTop()
              }
            } catch (err) {
              console.error("Payment verification error:", err);
              setError(
                "Error verifying payment. Please contact support with your payment ID if amount was deducted."
              );
              scrollToTop()
            } finally {
              setLoading(false);
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
          modal: {
            ondismiss: function () {
              setLoading(false);
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (resp) {
          console.error("Payment failed:", resp.error);
          const desc =
            resp.error?.description ||
            resp.error?.reason ||
            "Payment failed. Please try again.";
          setError(desc);
          setLoading(false);
          scrollToTop()
        });

        rzp.open();
      } catch (err) {
        console.error("Razorpay error:", err);
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Something went wrong while initiating payment. Please try again.";
        setError(msg);
        setLoading(false);
        scrollToTop()
      }
    }
  };

  const isActionDisabled =
    loading || loadingWallet || !coinQuantity || Number(coinQuantity) <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-32 right-1/4 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Stars */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(100)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.7 + 0.3,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2
                }s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-6 py-12 space-y-6 bg-slate-50">

        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
            Buy Coins
          </h1>
          <p className="text-slate-600 text-sm">
            Purchase coins to unlock premium features
          </p>
        </div>

        {/* Alerts */}
        <div className="space-y-3">
          {error && <Alert type="error" message={error} onClose={() => setError("")} />}
          {successMsg && (
            <Alert
              type="success"
              message={successMsg}
              onClose={() => setSuccessMsg("")}
            />
          )}
        </div>

        {/* Available Coins Card (Premium Gold) */}
        <div className="bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-white/30 rounded-full flex items-center justify-center mb-4 shadow-lg">
              <Coins className="w-10 h-10 text-amber-900" />
            </div>

            <p className="text-amber-900/80 text-sm font-semibold uppercase tracking-wide mb-1">
              Available Balance
            </p>

            {loadingWallet ? (
              <SkeletonLoader />
            ) : (
              <>
                <p className="text-amber-950 text-5xl font-bold mb-2">
                  {totalCoins.toLocaleString()}
                </p>
                <span className="bg-white/40 px-4 py-1.5 rounded-full text-xs font-medium text-amber-900">
                  {coins} coins = ₹{rate}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-slate-200 space-y-6">

          {/* Coin Quantity */}
          <div className="space-y-2">
            <label className="text-slate-700 text-sm font-semibold uppercase tracking-wide">
              Coin Quantity
            </label>

            <input
              type="number"
              value={coinQuantity}
              onChange={(e) => {
                setError("");
                setSuccessMsg("");
                setCoinQuantity(e.target.value);
              }}
              placeholder="Enter coins, e.g. 100"
              min={1}
              disabled={loading || loadingWallet}
              className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-amber-400 focus:border-transparent disabled:opacity-60"
            />

            <div className="flex justify-between text-xs text-slate-500">
              <span>
                Approx amount: ₹{calculatedPrice}
                {!coinQuantity && " (enter coins)"}
              </span>
              {balance > 0 && (
                <span>Wallet balance: ₹{balance.toFixed(2)}</span>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <p className="text-xs text-slate-600 font-semibold uppercase tracking-wide">
              Select Payment Method
            </p>

            {/* Wallet */}
            <button
              type="button"
              onClick={() => setSelectedPayment("wallet")}
              disabled={loading || loadingWallet}
              className={`w-full bg-white border rounded-xl p-4 flex items-center justify-between transition-all
          ${selectedPayment === "wallet"
                  ? "border-amber-400 ring-2 ring-amber-200"
                  : "border-slate-200 hover:border-slate-300"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-amber-600" />
                </div>
                <div className="text-left">
                  <p className="text-slate-800 text-sm font-medium">Wallet</p>
                  <p className="text-xs text-slate-500">
                    Pay directly from wallet balance
                  </p>
                </div>
              </div>

              <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center">
                {selectedPayment === "wallet" && (
                  <div className="w-3 h-3 bg-amber-400 rounded-full" />
                )}
              </div>
            </button>

            {/* Razorpay */}
            <button
              type="button"
              onClick={() => setSelectedPayment("razorPay")}
              disabled={loading || loadingWallet}
              className={`w-full bg-white border rounded-xl p-4 flex items-center justify-between transition-all
          ${selectedPayment === "razorPay"
                  ? "border-amber-400 ring-2 ring-amber-200"
                  : "border-slate-200 hover:border-slate-300"
                }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-slate-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09z" />
                  </svg>
                </div>
                <div className="text-left">
                  <p className="text-slate-800 text-sm font-medium">
                    Online Payment
                  </p>
                  <p className="text-xs text-slate-500">
                    Pay securely using Upi or cards via Razorpay
                  </p>
                </div>
              </div>

              <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center">
                {selectedPayment === "razorPay" && (
                  <div className="w-3 h-3 bg-amber-400 rounded-full" />
                )}
              </div>
            </button>
          </div>

          {/* Summary */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 text-sm text-slate-700">
            <div className="flex justify-between">
              <span>Coins</span>
              <span>{coinQuantity || 0}</span>
            </div>
            <div className="flex justify-between">
              <span>Rate</span>
              <span>{coins} coins = ₹{rate}</span>
            </div>
            <div className="flex justify-between font-semibold text-slate-900 border-t pt-2 mt-2">
              <span>To Pay</span>
              <span>₹{calculatedPrice}</span>
            </div>
          </div>

          {/* Pay Button */}
        <button
  onClick={handleBuy}
  disabled={isActionDisabled}
  className="w-full bg-amber-500 cursor-pointer hover:bg-amber-600 disabled:bg-amber-400 
             text-white font-semibold py-3.5 rounded-lg shadow-md text-lg 
             transition flex items-center justify-center gap-3"
>
  {loading ? (
    "Processing..."
  ) : (
    <>
      <span>Pay ₹{calculatedPrice}</span>

      {/* Payment Logos */}
      <span className="flex items-center ml-2">
        {[
          { src: "/paytm.png", alt: "Paytm" },
          { src: "/phonepay.jpg", alt: "PhonePe" },
          { src: "/gpay.jpg", alt: "GPay" },
        ].map((logo, index) => (
          <span
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
          </span>
        ))}
      </span>
    </>
  )}
</button>

        </div>
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
