import { useState } from "react";
import { Search, Bell, Menu, X, User, Home, ShoppingBag, Package, Heart, Phone, LogOut, ChevronRight, BookOpen, Info } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import { MdAccountBox } from "react-icons/md";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
const { t } = useTranslation();

  const menuItems = [
    { icon: MdAccountBox, label: "Account", href: "/account" },
    { icon: Home, label: "Home", href: "/homePage" },
    { icon: ShoppingBag, label: "Products", href: "/products" },
    { icon: Package, label: "My Orders", href: "/orders" },
    { icon: Wallet, label: "Wallet", href: "/wallet" },
    { icon: ShoppingBag, label: "Cart", href: "/cart" },
  ];

  const navLinks = [
    { label: t(`nav.home`), href: "/homePage" },
    { label: t(`nav.about`), href: "/about-us" },
    { label: t(`nav.blogs`), href: "/blogs" },
  ];

  // Safe user parsing with fallback
  const getUserData = () => {
    try {
      const userData = localStorage?.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  };

  const user = getUserData();

  // Check if link is active
  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <>
      <nav className="w-full bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
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
                  className={`text-gray-700 font-medium transition-colors relative pb-1 ${
                    isActive(link.href) ? 'text-[#C9A227]' : 'hover:text-[#C9A227]'
                  }`}
                >
                  {link.label}
                  <span 
                    className={`absolute bottom-0 left-0 h-0.5 bg-[#C9A227] transition-all ${
                      isActive(link.href) ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  ></span>
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Login Button - Show if no user (Desktop) */}
              {!user && (
                <Link
                  to="/login"
                  className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 bg-[#C9A227] text-white rounded-full hover:bg-[#B89020] transition-all font-medium text-sm"
                >
                  <User size={18} />
                  <span className="hidden md:inline">Login</span>
                </Link>
              )}

              {/* Trusted Users Badge - Hidden on mobile */}
              <div className="hidden sm:flex text-[#C9A227] flex-col text-sm lg:text-base leading-tight">
                <span className="font-bold">1000+</span>
                <span className="text-xs lg:text-sm">{t(`Trusted users`)}</span>
              </div>

              {user && (
                <>
                  {/* Notification Bell */}
                  <Link
                    to="/notification"
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group"
                  >
                    <Bell size={20} className="text-[#C9A227] group-hover:scale-110 transition-transform sm:w-6 sm:h-6" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </Link>
                </>
              )}

              {/* Menu Button - Always visible */}
              <button
                onClick={() => setMenuOpen(true)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
              >
                <Menu size={22} className="text-[#C9A227] group-hover:scale-110 transition-transform sm:w-7 sm:h-7" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* RIGHT SLIDING DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* User Profile Section */}
        <div className="bg-gradient-to-br from-[#C9A227] to-[#B89020] p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            {user ? (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center shadow-lg bg-white/20">
                  <img
                    className="w-full h-full object-cover"
                    src={user?.profileImage || "https://via.placeholder.com/150"}
                    alt="profile"
                  />
                </div>

                <Link to="/view-profile" onClick={() => setMenuOpen(false)} className="group flex-1">
                  <p className="font-semibold text-base sm:text-lg truncate">{user?.name || "Guest User"}</p>
                  <p className="text-xs sm:text-sm text-white/90 flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Profile
                    <ChevronRight size={14} />
                  </p>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white/20">
                  <User size={24} className="sm:w-7 sm:h-7" />
                </div>
                <div>
                  <p className="font-semibold text-base sm:text-lg">Welcome!</p>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-xs sm:text-sm text-white/90 hover:text-white transition-colors"
                  >
                    Login to continue
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
        </div>

        {/* Drawer Menu Items */}
        <div className="p-4 sm:p-6 flex flex-col gap-2 overflow-y-auto h-[calc(100%-160px)] sm:h-[calc(100%-180px)]">
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
                    ? 'bg-[#C9A227]/10 text-[#C9A227]' 
                    : 'text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#C9A227]'
                }`}
              >
                <Icon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium flex-1 text-sm sm:text-base">{item.label}</span>
                <ChevronRight size={18} className={`transition-opacity ${isItemActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
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
                  ? 'bg-[#C9A227]/10 text-[#C9A227]'
                  : 'text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#C9A227]'
              }`}
            >
              <Info size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium flex-1 text-sm sm:text-base">About Us</span>
              <ChevronRight size={18} className={`transition-opacity ${isActive('/about-us') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </Link>
            <Link
              to="/blogs"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all group ${
                isActive('/blogs')
                  ? 'bg-[#C9A227]/10 text-[#C9A227]'
                  : 'text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#C9A227]'
              }`}
            >
              <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium flex-1 text-sm sm:text-base">Blogs</span>
              <ChevronRight size={18} className={`transition-opacity ${isActive('/blogs') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
            </Link>
          </div>

          {/* Logout Button - Only show if user is logged in */}
          {user && (
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
                setMenuOpen(false);
              }}
              className="mt-6 flex items-center justify-center gap-3 bg-gradient-to-r from-[#C9A227] to-[#B89020] text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-[#C9A227]/30 transition-all group text-sm sm:text-base"
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