import { useState } from "react";
import {

  Bell,
  Menu,
  X,
  User,
  Home,
  ShoppingBag,
  Package,
  Heart,

  LogOut,
  ChevronRight,
  BookOpen,
  Info,

  Gift,
  Copy,
  Check,
} from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Wallet } from "lucide-react";
import { MdAccountBox } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useHeader } from "../context/HeaderContext";
import { Mail } from "lucide-react";
import { LucideShoppingBag } from "lucide-react";
import CartSidebar from "./CartSidebar"; // Import the new CartSidebar component
import PaymentModal from "../pages/PaymentModal";
import SpinToWin from "./spinner/SpinToWin";

export default function Navbar({ countryCurrency }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false); // New state for cart sidebar

  const [referPopupOpen, setReferPopupOpen] = useState(false); // New state for refer popup
  const [copiedProductId, setCopiedProductId] = useState(null); // Track copied product
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const token = localStorage?.getItem("token");
  const [openPayment, setOpenPayment] = useState(false);
  const baseMenu = [
    {
      icon: MdAccountBox,
      label: t(`nav.account`),
      href: "/account",
      auth: true,
    },
    { icon: Home, label: t(`nav.home`), href: "/homePage", auth: false },
    {
      icon: ShoppingBag,
      label: t(`nav.products`),
      href: "/products",
      auth: false,
    },
    { icon: Package, label: t(`nav.orders`), href: "/orders", auth: true },
    { icon: Wallet, label: t(`nav.wallet`), href: "/wallet", auth: true },
  ];

  const menuItems = baseMenu.filter((item) => !item.auth || token);

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


  const { cartCount, wishlistCount, unreadCount } = useHeader();

  // Function to open cart sidebar
  const openCartSidebar = (e) => {
    e.preventDefault();
    setCartSidebarOpen(true);
  };

  const [isSpinOpen, setSpinOpen] = useState(false);



  // Function to copy referral link
  const copyReferLink = (product) => {
    const refferalCode = localStorage.getItem("referralCode")

    const referLink = `${window.location.origin}/product/${product._id}/${product.name}?pay=true&ref=${refferalCode}&price=${product.price}&productImg=${product.images[0]}`;
    navigator.clipboard.writeText(referLink);
    setCopiedProductId(product._id);
    setTimeout(() => setCopiedProductId(null), 2000);
  };


  const products = JSON.parse(sessionStorage.getItem("products"))||[]

  return (
    <>
      {/* STICKY CONTAINER - Both top bar and nav together */}
      <div className="sticky top-0 z-50">
        {/* Top Bar - Login/Account with Cart & Wishlist */}
        <div
          className="w-full  bg-gradient-to-br 
from-[#040934] 
via-[#030e2d] 
to-[#051036]
shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
bg-center bg-no-repeat
 text-white border-b border-white/10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1">
            <div className="flex items-center justify-between">
              {/* Left - Trusted Users Badge */}
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80">
                    1000+ {t(`nav.trustedUsers`)}
                  </span>
                </div>
              </div>

              {/* Right - User Menu */}
              <div className="flex items-center gap-2 sm:gap-4 ml-auto">
                {user ? (
                  <>
                    <Link
                      to="/view-profile"
                      className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-all group"
                    >
                      <div className="w-7 h-7 rounded-full overflow-hidden bg-white/20">
                        <img
                          src={
                            user?.profileImage ||
                            "https://via.placeholder.com/150"
                          }
                          alt="profile"
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {user?.name?.split(" ")[0]}
                      </span>
                      <ChevronRight
                        size={14}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
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

                      {wishlistCount > 0 && (
                        <span className="absolute bg-red-500 -top-0 -right-1 min-w-[18px] h-[18px] bg-[#D3AF37]text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                          {wishlistCount || 0}
                        </span>
                      )}
                    </Link>

                    {/* Cart - Updated to open sidebar */}
                    <button
                      onClick={openCartSidebar}
                      className="relative p-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors group"
                    >
                      <div className="relative">
                        <LucideShoppingBag
                          size={18}
                          className="w-full h-full transition-transform group-hover:scale-110"
                        />

                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                            {cartCount}
                          </span>
                        )}
                      </div>
                    </button>

                    {/* Notifications */}
                    <Link
                      to="/notification"
                      className="relative p-2 rounded-full hover:bg-white/10 transition-colors group"
                      title="Notifications"
                    >
                      <Bell
                        size={18}
                        className="sm:w-5 sm:h-5 transition-transform group-hover:scale-110"
                      />

                      {unreadCount > 0 && (
                        <span className="absolute -top-0 -right-0 min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-semibold bg-red-500 text-white rounded-full px-1">
                          {unreadCount}
                        </span>
                      )}
                    </Link>
                  </>
                ) : (
                  <>
                    {/* Login Button */}
                    <Link
                      to="/login"
                      className="flex items-center gap-2  px-3 sm:px-4 py-1.5 sm:py-2 bg-[#F8AC26] rounded-full hover:bg-[#f5a417] transition-all font-medium text-xs sm:text-xs shadow-lg shadow-yellow-400/20"
                    >
                      <User size={16} className="sm:w-4 sm:h-4" />
                      <span>Login</span>
                    </Link>

                    {/* Cart for Guest - Updated to open sidebar */}
                    <button
                      onClick={openCartSidebar}
                      className="relative p-2 rounded-full cursor-pointer hover:bg-white/10 transition-colors group"
                    >
                      <div className="relative w-5 h-5 sm:w-5 sm:h-5">
                        <LucideShoppingBag
                          size={18}
                          className="w-full h-full transition-transform group-hover:scale-110"
                        />

                        {cartCount > 0 && (
                          <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center px-1">
                            {cartCount}
                          </span>
                        )}
                      </div>
                    </button>
                  </>
                )}

                {/* Refer and Earn Button - Always visible */}
                <button
                  onClick={() => setReferPopupOpen(true)}
                  className="flex cursor-pointer items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full hover:from-purple-600 hover:to-purple-700 transition-all font-medium text-xs sm:text-xs shadow-lg shadow-purple-400/20"
                >
                  <Gift size={16} className="sm:w-4 sm:h-4" />
                  <span>Refer & Earn</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="w-full bg-white border-b border-gray-200 shadow-sm backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-1">
            <div className="flex items-center justify-between gap-4">
              {/* Logo */}
              <div className="flex-shrink-0">
                <Link to="/homePage" className="flex items-center group">
                  <img
                    src="/logo-black.png"
                    alt="Logo"
                    loading="eager"
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
                    className={`text-[16px] lg:text-[17px] font-bold cursor-pointer relative pb-1 group ${isActive(link.href)
                      ? "text-[#D3AF37]"
                      : "hover:text-[#D3AF37]"
                      }`}
                  >
                    {link.label}
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-[#D3AF37]  ${isActive(link.href)
                        ? "w-full"
                        : "w-0 group-hover:w-full"
                        }`}
                    ></span>
                  </Link>
                ))}
              </div>

              {/* Right Section - Menu Button */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <button
                  onClick={() => setMenuOpen(true)}
                  className="p-2 rounded-full cursor-pointer hover:bg-gray-100 transition-colors group"
                >
                  <Menu
                    size={22}
                    className="text-[#D3AF37] group-hover:scale-110 transition-transform sm:w-7 sm:h-7"
                  />
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Refer and Earn Popup */}
      {referPopupOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden animate-slideUp">
            {/* Popup Header */}
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 text-white">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Gift size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Refer & Earn</h2>
                    <p className="text-sm text-white/90">
                      Share products with friends
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setReferPopupOpen(false)}
                  className="p-2 hover:bg-white/20 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Product List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
              {!user ? (
                // Not logged in - Show login prompt
                <div className="text-center py-8">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User size={40} className="text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Login Required
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Please login first to avail refer and earn benefits
                  </p>
                  <Link
                    to="/login"
                    onClick={() => setReferPopupOpen(false)}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-gray-900 rounded-lg font-semibold transition-all shadow-lg"
                  >
                    <User size={20} />
                    Login Now
                  </Link>
                </div>
              ) : (
                // Logged in - Show products
                <>
                  <p className="text-gray-600 mb-4 text-sm">
                    Share these products and earn rewards when your friends make
                    a purchase!
                  </p>

                  <div className="space-y-3">
                    {products?.map((product) => (
                      <div
                        key={product._id}
                        className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-800 truncate">
                            {product.name}
                          </h3>
                          <p className="text-purple-600 font-bold">
                            {product.price}
                          </p>
                        </div>
                        <button
                          onClick={() => copyReferLink(product)}
                          className="flex items-center gap-2 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all text-sm font-medium"
                        >
                          {copiedProductId === product._id ? (
                            <>
                              <Check size={16} />
                              <span>Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy size={16} />
                              <span>Refer</span>
                            </>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Info Box */}
                  <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-xl">
                    <p className="text-sm text-gray-700">
                      💡 <strong>How it works:</strong> Click "Refer" to copy
                      the product link, share it with friends, and earn Coin rewards
                      when they purchase!
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cart Sidebar Component */}

      <CartSidebar
        isOpen={cartSidebarOpen}
        onClose={() => {
          setCartSidebarOpen(false);
          if (!token) {
            setSpinOpen(true);
          }
        }}
        countryCurrency={countryCurrency}
        onCheckout={() => {
          setCartSidebarOpen(false);
          setOpenPayment(true);
        }}
      />
      {isSpinOpen && <SpinToWin isImmediate="true" />}

      {openPayment && (
        <PaymentModal
          countryCurrency={countryCurrency}
          isOpen={openPayment}
          onClose={() => setOpenPayment(false)}
        />
      )}

      {/* RIGHT SLIDING DRAWER (Menu) */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* User Profile Section */}
        <div className="bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)] relative overflow-hidden p-4 sm:p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            {user ? (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center shadow-lg bg-white/20 ring-2 ring-white/30">
                  <img
                    className="w-full h-full object-cover"
                    src={
                      user?.profileImage || "https://via.placeholder.com/150"
                    }
                    alt="profile"
                    loading="lazy"
                  />
                </div>

                <Link
                  to="/view-profile"
                  onClick={() => setMenuOpen(false)}
                  className="group flex-1"
                >
                  <p className="font-semibold text-base sm:text-lg truncate">
                    {user?.name || "Guest User"}
                  </p>
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
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setCartSidebarOpen(true);
                }}
                className="flex flex-col cursor-pointer items-center gap-1 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all"
              >
                <LucideShoppingBag size={18} />
                <span className="text-xs">Cart</span>
              </button>
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
                className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all group ${isItemActive
                  ? "bg-[#C9A227]/10 text-[#D3AF37] shadow-sm"
                  : "text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#D3AF37]"
                  }`}
              >
                <Icon
                  size={20}
                  className="group-hover:scale-110 transition-transform"
                />
                <span className="font-medium flex-1 text-sm sm:text-base">
                  {item.label}
                </span>
                <ChevronRight
                  size={18}
                  className={`transition-all ${isItemActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
                />
              </Link>
            );
          })}

          {/* Additional Navigation Links */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-3 sm:px-4">
              More
            </p>
            <Link
              to="/about-us"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all group ${isActive("/about-us")
                ? "bg-[#C9A227]/10 text-[#D3AF37] shadow-sm"
                : "text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#D3AF37]"
                }`}
            >
              <Info
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="font-medium flex-1 text-sm sm:text-base">
                {t("nav.about")}
              </span>
              <ChevronRight
                size={18}
                className={`transition-all ${isActive("/about-us") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />
            </Link>

            <Link
              to="/contact"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all group ${isActive("/contact")
                ? "bg-[#C9A227]/10 text-[#D3AF37] shadow-sm"
                : "text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#D3AF37]"
                }`}
            >
              <Mail
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="font-medium flex-1 text-sm sm:text-base">
                Contact Us
              </span>
              <ChevronRight
                size={18}
                className={`transition-all ${isActive("/contact-us") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />
            </Link>

            <Link
              to="/blogs"
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-all group ${isActive("/blogs")
                ? "bg-[#C9A227]/10 text-[#D3AF37] shadow-sm"
                : "text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#D3AF37]"
                }`}
            >
              <BookOpen
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              <span className="font-medium flex-1 text-sm sm:text-base">
                {t("nav.blogs")}
              </span>
              <ChevronRight
                size={18}
                className={`transition-all ${isActive("/blogs") ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`}
              />
            </Link>
          </div>

          {/* Logout Button */}
        </div>

        <div className="absolute  bottom-0 left-0 right-0 p-4 sm:p-6 border-t border-gray-200 bg-white">
          {user && (
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                localStorage.removeItem("cartItems");
                localStorage.setItem("cart", 0);
                localStorage.removeItem("unreadCount");
                navigate("/homePage");
                setMenuOpen(false);
              }}
              className=" flex items-center cursor-pointer justify-center gap-3 bg-gradient-to-r from-red-600 to-red-700 text-white py-2.5 sm:py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-red-600/30 transition-all group text-sm sm:text-base"
            >
              <LogOut
                size={20}
                className="group-hover:scale-110 transition-transform"
              />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* BACKDROP OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fadeIn"
          onClick={() => setMenuOpen(false)}
        />
      )}
      {cartSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/15  backdrop-blur-[1px] z-51 animate-fadeIn"
        // onClick={() => setMenuOpen(false)}
        />
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
