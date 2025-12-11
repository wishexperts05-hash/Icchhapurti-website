import { useState } from 'react';
import { User, MapPin, ShoppingCart, Package, Gift, Ticket, MessageCircle, Globe, FileText, Shield, LogOut, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function AccountPage() {
  const { t } = useTranslation();
  const user = JSON.parse(localStorage.getItem("user"));

  const menuItems = [
    { link: "/view-profile", icon: User, label: t('account.menuItems.profile') },
    { link: "/addresses", icon: MapPin, label: t('account.menuItems.shippingAddress') },
    { link: "/cart", icon: ShoppingCart, label: t('account.menuItems.myCart') },
    { link: "/orders", icon: Package, label: t('account.menuItems.myOrders') },
    { link: "/refer-programme", icon: Gift, label: t('account.menuItems.referralProgram') },
    // { link: "/lucky-draw", icon: Ticket, label: t('account.menuItems.luckyDraw') },
    { link: "/chat-support", icon: MessageCircle, label: t('account.menuItems.chatSupport') },
    // { link: "/languages", icon: Globe, label: t('account.menuItems.websiteLanguage') },
    // { link: "/about-us", icon: Globe, label: t('account.menuItems.aboutUs') },
    // { link: "/blogs", icon: Globe, label: t('account.menuItems.ourBlogs') },
    // { link: "/terms", icon: FileText, label: t('account.menuItems.termsConditions') },
    // { link: "/privacy", icon: Shield, label: t('account.menuItems.privacyPolicy') },
    // { link: "/faq", icon: Shield, label: t('account.menuItems.faq') },
    // { link: 11, icon: LogOut, label: t('account.menuItems.logout') },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-amber-500/20 via-cyan-500/15 to-blue-500/20 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full filter blur-2xl animate-pulse" style={{animationDelay: '2s'}}></div>
        {/* Spiral circles */}
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-cyan-500/5 rounded-full"></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-amber-500/10 rounded-full"></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-amber-500/15 rounded-full"></div>
        <div className="absolute top-2/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full filter blur-xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <h1 className="text-white font-bold text-xl mb-6">{t('account.title')}</h1>

        {/* Profile Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-cyan-400 p-0.5 mb-2">
            <img
              src={user?.profileImage}
              alt={user?.name}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <h2 className="text-white font-medium">{user.name}</h2>
        </div>

        {/* Referral Banner */}
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 mb-6 border border-slate-700/50">
          <div className="flex items-center gap-4">
            {/* Gift Box Icon */}
            <div className="w-14 h-14 flex-shrink-0">
              <div className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center relative">
                <Gift className="text-white" size={28} />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 rounded-full"></div>
              </div>
            </div>
            
            <div className="flex-1">
              <p className="text-white text-sm">
                {t('account.referralBanner.text')} <span className="text-amber-400 font-bold">{t('account.referralBanner.coins')}</span> {t('account.referralBanner.coinsText')}
              </p>
              <button className="mt-2 bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded flex items-center gap-1 transition-colors">
                {t('account.referralBanner.referButton')}
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <Link to={item.link}
                key={index}
                className="w-full flex items-center justify-between py-3 px-2 hover:bg-slate-800/30 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <IconComponent 
                    size={18} 
                    className={`${item.label === t('account.menuItems.logout') ? 'text-gray-400' : 'text-amber-400'}`} 
                  />
                  <span className="text-white text-sm">{item.label}</span>
                </div>
                <ChevronRight 
                  size={18} 
                  className="text-amber-400 group-hover:translate-x-1 transition-transform" 
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}