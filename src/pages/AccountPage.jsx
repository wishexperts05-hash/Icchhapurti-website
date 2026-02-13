import { useState } from 'react';
import { User, MapPin, ShoppingCart, Package, Gift, Ticket, MessageCircle, Globe, FileText, Shield, LogOut, ChevronRight, ArrowRight, Share2, Copy, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AccountPage() {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user"));
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate referral link - adjust this based on your actual referral system
  const referralLink = `${window.location.origin}/homePage?ref=${user?.referralCode || user?._id || 'default'}`;

  const menuItems = [
    { link: "/view-profile", icon: User, label: t('account.menuItems.profile') },
    { link: "/addresses", icon: MapPin, label: t('account.menuItems.shippingAddress') },
    // { link: "/cart", icon: ShoppingCart, label: t('account.menuItems.myCart') },
    { link: "/orders", icon: Package, label: t('account.menuItems.myOrders') },
    { link: "/refer-programme", icon: Gift, label: t('account.menuItems.referralProgram') },
    { link: "/chat-support", icon: MessageCircle, label: t('account.menuItems.chatSupport') },
  ];

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToWhatsApp = () => {
    const message = encodeURIComponent(`Join me on this amazing platform! 🎁\n\n${referralLink}`);
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  const shareToTelegram = () => {
    const message = encodeURIComponent(`Join me on this amazing platform! 🎁`);
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${message}`, '_blank');
  };

  const shareToFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const shareToTwitter = () => {
    const text = encodeURIComponent(`Join me on this amazing platform! 🎁`);
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${text}`, '_blank');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/20 via-cyan-500/15 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-cyan-500/5 rounded-full"></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-amber-500/10 rounded-full"></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-amber-500/15 rounded-full"></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full filter blur-xl"></div>
      </div>

 <div className="relative z-10 max-w-4xl mx-auto p-4 bg-white rounded-xl shadow-sm">
  {/* Header */}
  <h1 className="text-slate-900 font-bold text-xl mb-6">
    {t("account.title")}
  </h1>

  {/* Profile Avatar */}
  <div className="flex flex-col items-center mb-6">
    <div className="w-20 h-20 rounded-full border-2 border-amber-400 p-0.5 mb-2">
      <img
        src={user?.profileImage}
        alt={user?.name}
        className="w-full h-full rounded-full object-cover"
      />
    </div>
    <h2 className="text-slate-900 font-medium">{user?.name}</h2>
  </div>



  {/* Menu Items */}
  <div className="space-y-1">
    {menuItems.map((item, index) => {
      const IconComponent = item.icon;
      const isLogout =
        item.label === t("account.menuItems.logout");

      return (
        <Link
          key={index}
          to={item.link}
          className="flex items-center justify-between px-3 py-3 rounded-lg
                     hover:bg-amber-50 transition group"
        >
          <div className="flex items-center gap-3">
            <IconComponent
              size={18}
              className={isLogout ? "text-red-500" : "text-amber-500"}
            />
            <span className="text-slate-800 text-sm">
              {item.label}
            </span>
          </div>

          <ChevronRight
            size={18}
            className="text-slate-400 group-hover:text-amber-500 group-hover:translate-x-1 transition"
          />
        </Link>
      );
    })}
  </div>
</div>



      {/* Share Modal */}
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
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp
                </button>

                <button
                  onClick={shareToTelegram}
                  className="w-full flex items-center gap-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.015-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.442-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.121.098.155.23.171.324.016.093.036.306.02.472z"/>
                  </svg>
                  Telegram
                </button>

                <button
                  onClick={shareToFacebook}
                  className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>

                <button
                  onClick={shareToTwitter}
                  className="w-full flex items-center gap-3 bg-sky-500 hover:bg-sky-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}