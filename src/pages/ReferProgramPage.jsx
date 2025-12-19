import React, { useState, useEffect } from 'react';
import { Copy, Users, Coins, ChevronLeft, Loader2 } from 'lucide-react';
import { User, MapPin, ShoppingCart, Package, Gift, Ticket, MessageCircle, Globe, FileText, Shield, LogOut, ChevronRight, ArrowRight, Share2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  const user = JSON.parse(localStorage.getItem("user"));

  const [showShareModal, setShowShareModal] = useState(false);
  // Generate referral link - adjust this based on your actual referral system
  const referralLink = `${window.location.origin}/homePage?ref=${user?.referralCode || user?._id || 'default'}`;

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
            <p className="text-white text-sm mb-1">Available Coins</p>
            <p className="text-white text-4xl font-bold mb-1">{referAc?.coins || 0}</p>
            <p className="text-amber-200 text-xs">
              {coinsRate.coins} {t("referProgramme.coin")} = ₹ {coinsRate.rate}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => Navigate(`/buy-coins?totalCoins=${referAc?.coins || 0}&coins=${coinsRate.coins || 0}&rate=${coinsRate.rate || 0}`)}
              // disabled={buyingCoins}
              className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2.5 px-4 rounded transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              Buy Coins
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
          <p className="text-white text-xl font-bold text-center mb-4">{t("referProgramme.get")} 1 {t("referProgramme.referal")} = {commissonCoins || 0} {t("referProgramme.coin")}</p>

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
        <h2 className="text-white text-lg font-semibold mb-4">Coin Earn History</h2>

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
        <button onClick={handleShare} className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg text-lg">
          Refer Now
        </button>


        {showShareModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-slate-800 rounded-2xl max-w-md w-full shadow-2xl border border-slate-700">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Share2 size={24} className="text-amber-400" />
                    Share Referral Link
                  </h3>
                  <button
                    onClick={() => setShowShareModal(false)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-4">
                {/* Copy Link Section */}
                <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
                  <p className="text-gray-400 text-xs mb-2">Your Referral Link</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={referralLink}
                      readOnly
                      className="flex-1 bg-slate-800 text-white text-sm px-3 py-2 rounded border border-slate-600 focus:outline-none focus:border-amber-400"
                    />
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors flex items-center gap-2"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Social Share Buttons */}
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm font-medium mb-3">Share via</p>

                  <button
                    onClick={shareToWhatsApp}
                    className="w-full flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    WhatsApp
                  </button>

                  <button
                    onClick={shareToTelegram}
                    className="w-full flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.098.155.23.171.324.016.093.036.306.02.472z" />
                    </svg>
                    Telegram
                  </button>

                  <button
                    onClick={shareToFacebook}
                    className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    Facebook
                  </button>

                  <button
                    onClick={shareToTwitter}
                    className="w-full flex items-center gap-3 bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                    Twitter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
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