import React, { useState, useEffect } from 'react';
import { Copy, Users, Coins, ChevronLeft, Loader2 } from 'lucide-react';
import { User, MapPin, ShoppingCart, Package, Gift, Ticket, MessageCircle, Globe, FileText, Shield, LogOut, ChevronRight, ArrowRight, Share2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ReferProgramPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [converting, setConverting] = useState(false);
  const [buyingCoins, setBuyingCoins] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [availableCoins, setAvailableCoins] = useState(0);
  const [coinsRate, setCoinsRate] = useState({ coins: 3, rate: 1 });
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
  const [referAc, setReferAc] = useState({})
  const [commissonCoins, setCommissionCoins] = useState()

  // let commissonCoins ;
  // Fetch coins rate
  useEffect(() => {
    const fetchCoinsRate = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/refer-account/get-coins-rate`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const data = await response.json();
        if (data.success) {
          setCoinsRate(data.data);
        }
      } catch (err) {
        console.error('Error fetching coins rate:', err);
      }
    };

    const fetchRefereAccount = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/refer-account/get-refer-account`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const data = await response.json();
        if (data.success) {
          setReferAc(data.data);
          setAvailableCoins(data.data.coins)
        }
      } catch (err) {
        console.error('Error fetching coins rate:', err);
      }
    }

    const getReferCommission = async (req, res) => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/refer-account/get-user-refer-commission`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const data = await response.json();
        if (data.success) {
          setCommissionCoins(data.data.directReferCommissionCoins)
        }
      } catch (err) {
        console.error('Error fetching coins rate:', err);
      }
    }
    fetchCoinsRate();
    fetchRefereAccount()
    getReferCommission()
  }, []);

  // Fetch coin earning history
  useEffect(() => {
    const fetchCoinHistory = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/refer-account/get-coin-earning-history?page=${currentPage}&limit=5`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
        );
        const data = await response.json();

        if (data.success) {
          setReferrals(data.data || []);
          // setAvailableCoins(data.data.totalCoins || 0);
          setTotalPages(data.pagination.totalPages || 1);
        } else {
          setError(data.message || 'Failed to fetch data');
        }
      } catch (err) {
        console.error('Error fetching coin history:', err);
        setError('Failed to load coin earning history');
      } finally {
        setLoading(false);
      }
    };

    fetchCoinHistory();
  }, [currentPage]);

  const handleCopy = () => {
    navigator.clipboard.writeText(referAc.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };



  const Navigate = useNavigate()
  const handleConvertToMoney = async () => {
    if (converting) return;

    setConverting(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/refer-account/convert-coin-to-money`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ coins: availableCoins }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Successfully converted ${availableCoins} coins to ₹${(availableCoins / coinsRate.coins * coinsRate.rate).toFixed(2)}`);
        // Refresh the page data
        setCurrentPage(1);
        window.location.reload();
      } else {
        setError(data.message || 'Failed to convert coins');
        alert(data.message || 'Failed to convert coins');
      }
    } catch (err) {
      console.error('Error converting coins:', err);
      setError('Failed to convert coins to money');
      alert("Failed to convert coins to money");
    } finally {
      setConverting(false);
    }
  };



  const user = JSON.parse(localStorage.getItem("user"));

  const [showShareModal, setShowShareModal] = useState(false);
  // Generate referral link - adjust this based on your actual referral system
  const referralLink = `${window.location.origin}/?ref=${user?.referralCode || user?._id || 'default'}`;

  const handleShare = async () => {
    const shareData = {
      title: 'Join me on this amazing platform!',
      text: `Use my referral link to get exclusive rewards! 🎁`,
      url: referralLink
    };

    // Check if native share is available (mobile devices)
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          setShowShareModal(true);
        }
      }
    } else {
      // Fallback: show custom share modal
      setShowShareModal(true);
    }
  };

  const navigate = useNavigate()

  const renderPagination = () => {
    const pages = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${currentPage === i
              ? 'bg-amber-500'
              : 'bg-slate-700/80 hover:bg-slate-700'
              }`}
          >
            {i}
          </button>
        );
      }
    } else {
      pages.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${currentPage === 1
            ? 'bg-amber-500'
            : 'bg-slate-700/80 hover:bg-slate-700'
            }`}
        >
          1
        </button>
      );

      if (currentPage > 3) {
        pages.push(<span key="dots1" className="text-white px-2">...</span>);
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <button
            key={i}
            onClick={() => setCurrentPage(i)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${currentPage === i
              ? 'bg-amber-500'
              : 'bg-slate-700/80 hover:bg-slate-700'
              }`}
          >
            {i}
          </button>
        );
      }

      if (currentPage < totalPages - 2) {
        pages.push(<span key="dots2" className="text-white px-2">...</span>);
      }

      pages.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`w-8 h-8 rounded-full flex items-center justify-center text-white transition-all ${currentPage === totalPages
            ? 'bg-amber-500'
            : 'bg-slate-700/80 hover:bg-slate-700'
            }`}
        >
          {totalPages}
        </button>
      );
    }

    return pages;
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
      <div className="relative z-10 max-w-4xl bg-white mx-auto p-6">
        <div className="w-full flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex cursor-pointer items-center my-2 gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 hover:text-gray-900 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
        </div>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-6">
          {"Refer Program"}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 rounded-lg p-4 mb-6 text-red-700">
            {error}
          </div>
        )}

        {/* Coins Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 mb-6 shadow-xl">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
              <Coins className="w-8 h-8 text-amber-900" />
            </div>

            <p className="text-white text-sm mb-1">Available Coins</p>
            <p className="text-white text-4xl font-bold">
              {referAc?.coins || 0}
            </p>
            <p className="text-amber-200 text-xs">
              {coinsRate.coins} {"Coin"} = ₹ {coinsRate.rate}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() =>
                Navigate(
                  `/buy-coins?totalCoins=${referAc?.coins || 0}&coins=${coinsRate.coins}&rate=${coinsRate.rate}`
                )
              }
              className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2.5 rounded shadow"
            >
              Buy Coins
            </button>

            <button
              onClick={handleConvertToMoney}
              disabled={converting || availableCoins === 0}
              className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2.5 rounded shadow disabled:opacity-50"
            >
              {converting ? "Converting" : "Convert to Money"}
            </button>
          </div>
        </div>

        {/* Refer Friend Card */}
        {/* <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 mb-6 shadow-xl text-center">
    <p className="text-blue-200 text-sm mb-2">
      {"Refer a friend"}
    </p>
    <p className="text-white text-xl font-bold">
      {"Get"} 1 {"Referal"} ={" "}
      {commissonCoins || 0} {"Coin"}
    </p>
  </div> */}

        {/* Referral Code */}
        <div className="mb-6">
          <label className="text-slate-700 text-sm mb-2 block">
            {"Your Referral Code"}
          </label>

          <div className="relative">
            <input
              type="text"
              value={referAc.referralCode}
              readOnly
              className="w-full bg-gray-100 border border-slate-300 rounded-lg px-4 py-3 text-slate-900 pr-12 focus:ring-2 focus:ring-amber-400"
            />

            <button
              onClick={handleCopy}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-900"
            >
              <Copy className="w-5 h-5" />
            </button>

            {copied && (
              <span className="absolute right-12 top-1/2 -translate-y-1/2 text-green-600 text-sm">
                Copied!
              </span>
            )}
          </div>
        </div>

        {/* Earn History */}
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Coin Earn History
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : referrals.length === 0 ? (
          <div className="bg-slate-100 border border-slate-300 rounded-lg p-6 text-center text-slate-500">
            {" No referral history yet. Start referring friends to earn coins!"}
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {referrals.map((referral) => {
              const isReferral = referral.sourceType == "REFERRAL";

              return (
                <div
                  key={referral.id}
                  className="bg-white border border-slate-200 rounded-lg p-4 flex justify-between items-center hover:bg-slate-50"
                >
                  {/* Left */}
                  <div className="flex items-center gap-3">
                    <img
                      src={referral.userProfileImage || "https://cdn-icons-png.flaticon.com/512/219/219988.png"}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover"
                    />

                    <div>
                      {/* Primary text */}
                      <p className="text-slate-800 text-sm font-medium">
                        {isReferral
                          ? `Referral reward from ${referral.userName}`
                          : "Purchase reward"}
                      </p>

                      {/* Secondary info */}
                      <p className="text-slate-500 text-xs">
                        {isReferral
                          ? "Coins earned when your referral made a purchase"
                          : "Coins earned from your purchase"}
                      </p>

                      {/* Date */}
                      <p className="text-slate-400 text-[11px] mt-0.5">
                        {referral.dateEarned}
                      </p>
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex flex-col items-end gap-1">
                    {/* Source badge */}
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isReferral
                          ? "bg-indigo-50 text-indigo-600"
                          : "bg-emerald-50 text-emerald-600"
                        }`}
                    >
                      {isReferral ? "REFERRAL BONUS" : "PURCHASE BONUS"}
                    </span>

                    {/* Coins */}
                    <div className="flex items-center gap-1 text-amber-500 font-semibold">
                      <Coins className="w-4 h-4" />
                      +{referral.coinsEarned}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        )}

        {/* Refer Button */}
        {/* <button
    onClick={handleShare}
    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg shadow-lg text-lg"
  >
    Refer Now
  </button> */}
      </div>


      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default ReferProgramPage;