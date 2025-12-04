import React, { useState, useEffect } from 'react';
import { Copy, Users, Coins, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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
  const referralCode = "RW40850";
  // let commissonCoins ;
const { t } = useTranslation();
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
      } else {
        setError(data.message || 'Failed to convert coins');
        alert(data.message || 'Failed to convert coins');
      }
    } catch (err) {
      console.error('Error converting coins:', err);
      setError('Failed to convert coins to money');
      alert('Failed to convert coins to money');
    } finally {
      setConverting(false);
    }
  };

  const handleBuyCoins = async () => {
    if (buyingCoins) return;

    setBuyingCoins(true);
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/refer-account/buy-coins-from-walle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        alert('Coins purchased successfully!');
        // Refresh the page data
        setCurrentPage(1);
      } else {
        setError(data.message || 'Failed to buy coins');
        alert(data.message || 'Failed to buy coins');
      }
    } catch (err) {
      console.error('Error buying coins:', err);
      setError('Failed to buy coins from wallet');
      alert('Failed to buy coins from wallet');
    } finally {
      setBuyingCoins(false);
    }
  };

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
      <div className="relative z-10 max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-6">{t("referProgramme.title")}</h1>

        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 mb-6 text-red-200">
            {error}
          </div>
        )}

        {/* Coins Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 mb-6 shadow-2xl">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
              <Coins className="w-8 h-8 text-amber-900" />
            </div>
            <p className="text-white text-sm mb-1">{t("referProgramme.availableCoins")}</p>
            <p className="text-white text-4xl font-bold mb-1">{referAc?.coins||0}</p>
            <p className="text-amber-200 text-xs">
              {coinsRate.coins} {t("referProgramme.coin")} = ₹ {coinsRate.rate}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={()=>Navigate(`/buy-coins?totalCoins=${referAc?.coins||0}&coins=${coinsRate.coins||0}&rate=${coinsRate.rate||0}`)}
              // disabled={buyingCoins}
              className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2.5 px-4 rounded transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
          {t("referProgramme.buyCoin")}
            </button>
            <button
              onClick={handleConvertToMoney}
              disabled={converting || availableCoins === 0}
              className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2.5 px-4 rounded transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
             {converting ? (
  <>
    <Loader2 className="w-4 h-4 animate-spin" />
    {t("referProgramme.converting")}
  </>
) : (
  t("referProgramme.convertMoney")
)}

            </button>
          </div>
        </div>

        {/* Refer a Friend Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 mb-6 shadow-2xl">
          <p className="text-blue-200 text-sm text-center mb-2">{t("referProgramme.referFriend")}</p>
          <p className="text-white text-xl font-bold text-center mb-4">{t("referProgramme.get")} 1 {t("referProgramme.referal")} = {commissonCoins||0} {t("referProgramme.coin")}</p>

          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex items-end gap-2">
                <div className="text-4xl">👤</div>
                <div className="absolute left-8 top-2 text-4xl">🎁</div>
                <div className="absolute left-16 text-4xl">👤</div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="mb-6">
          <label className="text-white text-sm mb-2 block">  {t("referProgramme.referalCode")}</label>
          <div className="relative">
            <input
              type="text"
              value={referAc.referralCode}
              readOnly
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              title="Copy code"
            >
              <Copy className="w-5 h-5" />
            </button>
            {copied && (
              <span className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-400 text-sm">
                Copied!
              </span>
            )}
          </div>
        </div>

        {/* Coin Earning History */}
        <h2 className="text-white text-lg font-semibold mb-4">{t("referProgramme.coinEarningHostory")}</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
          </div>
        ) : referrals.length === 0 ? (
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 text-center text-slate-400 mb-6">
         {t("referProgramme.noReferal")}
          </div>
        ) : (
          <div className="space-y-3 mb-6">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800/60 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-2xl">
                 <img src={referral.userProfileImage} alt="" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{referral.userName}</p>
                    <p className="text-slate-400 text-xs">
                      {referral.dateEarned}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-amber-400 font-semibold">
                  <span>+</span>
                  <Coins className="w-4 h-4" />
                  <span>{referral.coinsEarned}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 rounded-full bg-amber-500/80 hover:bg-amber-500 flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {renderPagination()}

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 rounded-full bg-amber-500/80 hover:bg-amber-500 flex items-center justify-center text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Refer Now Button */}
        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg text-lg">
     {t("referProgramme.referNow")}
        </button>
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