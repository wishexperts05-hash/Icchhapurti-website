import { useState } from "react";
import { Search, Bell, Menu, X, User, Home, ShoppingBag, Package, Heart, Phone, LogOut, ChevronRight, BookOpen, Info, ShoppingCart } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import { MdAccountBox } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useHeader } from "../context/HeaderContext";
import { Mail } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const token = localStorage?.getItem("token");

  const baseMenu = [
    { icon: MdAccountBox, label: t(`nav.account`), href: "/account", auth: true },
    { icon: Home, label: t(`nav.home`), href: "/homePage", auth: false },
    { icon: ShoppingBag, label: t(`nav.products`), href: "/products", auth: false },
    { icon: Package, label: t(`nav.orders`), href: "/orders", auth: true },
    { icon: Wallet, label: t(`nav.wallet`), href: "/wallet", auth: true },
  ];

  const menuItems = baseMenu.filter(item => !item.auth || token);

  const navLinks = [
    { label: t(`nav.home`), href: "/homePage" },
    { label: t(`nav.about`), href: "/about-us" },
    { label: t(`nav.blogs`), href: "/blogs" },
    { label: "Shop", href: "/products" },
    { label: "Contact Us", href: "/contact" },
  ];

  const getUserData = () => {
    try {
      const userData = localStorage?.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const user = getUserData();

  const isActive = (href) => {
    return location.pathname === href;
  };

  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (token) {
      fetchCartData();
    }
  }, []);

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
      setCartItems(data.data || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    }
  };

  const { cartCount, wishlistCount, unreadCount } = useHeader();

  return (
    <>
      {/* STICKY CONTAINER - Both top bar and nav together */}
      <div className="sticky top-0 z-30">
        {/* Top Bar - Login/Account with Cart & Wishlist */}
        <div className="w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
            <div className="flex items-center justify-between">
              {/* Left - Trusted Users Badge */}
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80">1000+ {t(`nav.trustedUsers`)}</span>
                </div>
              </div>

              {/* Right - User Menu */}
              <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                {user ? (
                  <>
                    {/* User Info - Desktop */}
                    <Link
                      to="/view-profile"
                      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all group"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-white/20">
                        <img
                          src={user?.profileImage || "https://via.placeholder.com/150"}
                          alt="profile"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">{user?.name?.split(' ')[0]}</span>
                      <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>

                    {/* Wishlist */}
                    <Link
                      to="/wishlist"
                      className="relative p-2 rounded-full hover:bg-white/10 transition-colors group"
                      title="Wishlist"
                    >
                      <Heart
                        size={18}
                        className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform"
                      />
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-purple-700 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                        {wishlistCount || 0}
                      </span>
                    </Link>

                    {/* Cart */}
                    <Link
                      to="/cart"
                      className="relative p-2 rounded-full hover:bg-white/10 transition-colors group"
                      title="Shopping Cart"
                    >
                      <ShoppingCart size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                      {cartCount && (
                        <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                          {cartCount || 0}
                        </span>
                      )}
                    </Link>

                    {/* Notifications */}
                    <Link
                      to="/notification"
                      className="relative p-2 rounded-full hover:bg-white/10 transition-colors group"
                      title="Notifications"
                    >
                      <Bell size={18} className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
                      <div className="absolute -top-1 -right-1 flex items-center gap-1">
                        <span className="text-xs bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                          {unreadCount || 0}
                        </span>
                      </div>
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Login Button */}
                    <Link
                      to="/login"
                      className="flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-900 rounded-full hover:bg-purple-900 transition-all font-medium text-xs sm:text-sm shadow-lg shadow-[#C9A227]/20"
                    >
                      <User size={16} className="sm:w-4 sm:h-4" />
                      <span>Login</span>
                    </Link>

                    <Link
                      to="/cart"
                      className="relative p-2 rounded-full hover:bg-white/10 transition-colors flex items-center"
                      title="Cart"
                    >
                      <ShoppingCart size={20} className="text-white sm:w-5 sm:h-5" />
                      <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] sm:text-xs px-1.5 py-0.5 rounded-full">
                        {cartCount || 0}
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="w-full bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/homePage" className="flex items-center group">
                  <img
                    src="/logo-black.png"
                    alt="Logo"
                    className="h-12 sm:h-16 w-auto object-contain transition-transform group-hover:scale-105"
                  />
                </Link>
              </div>

              {/* Center Navigation Links - Desktop Only */}
              <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
                {navLinks.map((link, index) => (
                  <Link
                    key={index}
                    to={link.href}
                    className={`text-[16px] lg:text-[18px] cursor-pointer font-medium transition-all relative pb-1 group ${
                      isActive(link.href) ? 'text-purple-900' : 'hover:text-purple-900'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-purple-900 transition-all ${
                        isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                      }`}
                    ></span>
                  </Link>
                ))}
              </div>

              {/* Right Section - Menu Button */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setMenuOpen(true)}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                >
                  <Menu size={22} className="text-purple-900 group-hover:scale-110 transition-transform sm:w-7 sm:h-7" />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* RIGHT SLIDING DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* User Profile Section */}
        <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            {user ? (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center shadow-lg bg-white/20 ring-2 ring-white/30">
                  <img
                    className="w-full h-full object-cover"
                    src={user?.profileImage || "https://via.placeholder.com/150"}
                    alt="profile"
                  />
                </div>

                <Link to="/view-profile" onClick={() => setMenuOpen(false)} className="group flex-1">
                  <p className="font-semibold text-base sm:text-lg truncate">{user?.name || "Guest User"}</p>
                  <p className="text-xs sm:text-sm text-white/90 flex items-center gap-1 group-hover:gap-2 transition-all">
                    {t("nav.viewProfile")}
                    <ChevronRight size={14} />
                  </p>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white/20 ring-2 ring-white/30">
                  <User size={24} className="sm:w-7 sm:h-7" />
                </div>
                <div>
                  <p className="font-semibold text-base sm:text-lg">Welcome!</p>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-xs sm:text-sm text-white/90 hover:text-white transition-colors flex items-center gap-1"
                  >
                    Login to continue
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors ml-2"
            >
              <X size={24} className="text-white" />
            </button>
          </div>

          {/* Quick Actions in Header */}
          {user && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                <Heart size={18} />
                <span className="text-xs">Wishlist</span>
              </Link>
              <Link
                to="/cart"
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                <ShoppingCart size={18} />
                <span className="text-xs">Cart</span>
              </Link>
              <Link
                to="/notification"
                onClick={() => setMenuOpen(false)}
                className="flex flex-col items-center gap-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                <Bell size={18} />
                <span className="text-xs">Alerts</span>
              </Link>
            </div>
          )}
        </div>

        {/* Drawer Menu Items */}
        <div className="p-4 sm:p-6 flex flex-col gap-2 overflow-y-auto h-[calc(100%-220px)] sm:h-[calc(100%-240px)]">
          {/* Main Menu Items */}
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isItemActive = isActive(item.href);
            return (
              <Link
                key={index}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all group ${
                  isItemActive
                    ? 'bg-[#C9A227]/10 text-purple-900 shadow-sm'
                    : 'text-gray-700 hover:bg-[#C9A227]/10 hover:text-purple-900'
                }`}
              >
                <Icon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium flex-1 text-sm sm:text-base">{item.label}</span>
                <ChevronRight size={18} className={`transition-all ${isItemActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              </Link>
            );
          })}

          {/* Additional Navigation Links */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 sm:px-4">More</p>
            <Link
              to="/about-us"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all group ${
                isActive('/about-us')
                  ? 'bg-[#C9A227]/10 text-purple-900 shadow-sm'
                  : 'text-gray-700 hover:bg-[#C9A227]/10 hover:text-purple-900'
              }`}
            >
              <Info size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium flex-1 text-sm sm:text-base">{t("nav.about")}</span>
              <ChevronRight size={18} className={`transition-all ${isActive('/about-us') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all group ${
                isActive('/contact')
                  ? 'bg-[#C9A227]/10 text-purple-900 shadow-sm'
                  : 'text-gray-700 hover:bg-[#C9A227]/10 hover:text-purple-900'
              }`}
            >
              <Mail size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium flex-1 text-sm sm:text-base">Contact Us</span>
              <ChevronRight size={18} className={`transition-all ${isActive('/contact-us') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </Link>

            <Link
              to="/blogs"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all group ${
                isActive('/blogs')
                  ? 'bg-[#C9A227]/10 text-purple-900 shadow-sm'
                  : 'text-gray-700 hover:bg-[#C9A227]/10 hover:text-purple-900'
              }`}
            >
              <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium flex-1 text-sm sm:text-base">{t("nav.blogs")}</span>
              <ChevronRight size={18} className={`transition-all ${isActive('/blogs') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </Link>
          </div>

          {/* Logout Button */}
          {user && (
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem("cartItems");
                localStorage.setItem("cart", 0);
                localStorage.removeItem("unreadCount");
                navigate("/login");
                setMenuOpen(false);
              }}
              className="mt-6 flex items-center justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-red-600/30 transition-all group text-sm sm:text-base"
            >
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              Logout
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-gray-200 bg-white">
          <p className="text-xs text-center text-gray-500">
            © 2024 ICCHAPURTI. All rights reserved.
          </p>
        </div>
      </div>

      {/* BACKDROP OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}