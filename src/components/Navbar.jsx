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
import { useEffect } from "react";
import { useHeader } from "../context/HeaderContext";
import { Mail } from "lucide-react";
import { LucideShoppingBag } from "lucide-react";
import CartSidebar from "./CartSidebar"; // Import the new CartSidebar component
import React, { lazy, Suspense } from "react";
const PaymentModal = lazy(() => import("../pages/PaymentModal"));
const SpinToWin = lazy(() => import("./spinner/SpinToWin"));

export default function Navbar({ countryCurrency }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartSidebarOpen, setCartSidebarOpen] = useState(false); // New state for cart sidebar

  const [referPopupOpen, setReferPopupOpen] = useState(false); // New state for refer popup
  const [copiedProductId, setCopiedProductId] = useState(null); // Track copied product
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage?.getItem("token");
  const [openPayment, setOpenPayment] = useState(false);
  const baseMenu = [
    {
      icon: MdAccountBox,
      label: "Account",
      href: "/account",
      auth: true,
    },
    { icon: Home, label: "Home", href: "/", auth: false },
    {
      icon: ShoppingBag,
      label: "Products",
      href: "/products",
      auth: false,
    },
    { icon: Package, label: "My Orders", href: "/orders", auth: true },
    { icon: Wallet, label: "Wallet", href: "/wallet", auth: true },
  ];

  const menuItems = baseMenu.filter((item) => !item.auth || token);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about-us" },
    { label: "Blogs", href: "/blogs" },
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


  const { cartCount, wishlistCount, unreadCount, setCount } = useHeader();

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


  const products = JSON.parse(sessionStorage.getItem("products")) || []

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
                    1000+ {"Trusted Users"}
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
                <Link to="/" className="flex items-center group">
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
                    //  style={{ fontFamily: 'Tenor Sans, sans-serif' }}
                    key={index}
                    to={link.href}
                    className={`text-lg font-bold cursor-pointer relative pb-1 group ${isActive(link.href)
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
      {isSpinOpen && (
        <Suspense fallback={null}>
          <SpinToWin isImmediate="true" />
        </Suspense>
      )}

      {openPayment && (
        <Suspense fallback={null}>
          <PaymentModal
            countryCurrency={countryCurrency}
            isOpen={openPayment}
            onClose={() => setOpenPayment(false)}
          />
        </Suspense>
      )}

      {/* RIGHT SLIDING DRAWER (Menu) */}
      {/* ══ Right slide drawer ══ */}
      <div style={{
        position: 'fixed', top: 0, right: 0, height: '100%',
        width: '100%', maxWidth: 320,
        background: '#fff',
        boxShadow: menuOpen ? '-8px 0 48px rgba(26,18,9,0.18)' : 'none',
        zIndex: 50,
        display: 'flex', flexDirection: 'column',
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform .3s cubic-bezier(.4,0,.2,1)',
        fontFamily: "'DM Sans', sans-serif",
      }}>

        {/* ── Header ── */}
        <div style={{
          background: 'linear-gradient(160deg, #1A1209 0%, #2C2416 100%)',
          padding: '22px 20px 18px',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative gold circle */}
          <div style={{ position: 'absolute', top: -32, right: -32, width: 120, height: 120, borderRadius: '50%', background: 'rgba(201,168,76,0.07)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(201,168,76,0.05)', pointerEvents: 'none' }} />

          {/* Top row: avatar + name + close */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: user ? 18 : 0, position: 'relative', zIndex: 1 }}>
            {user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, minWidth: 0 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={user?.profileImage || 'https://via.placeholder.com/150'}
                    alt="profile"
                    loading="lazy"
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', border: '2px solid #C9A84C', display: 'block' }}
                  />
                  {/* Online dot */}
                  <span style={{ position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: '50%', background: '#4ADE80', border: '2px solid #1A1209' }} />
                </div>
                <Link
                  to="/view-profile"
                  onClick={() => setMenuOpen(false)}
                  style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}
                >
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name || 'My Account'}
                  </p>
                  <p style={{ fontSize: 12, color: '#C9A84C', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: 3 }}>
                    View Profile <ChevronRight size={11} />
                  </p>
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1 }}>
                <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(201,168,76,0.12)', border: '2px solid rgba(201,168,76,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={22} color="#C9A84C" />
                </div>
                <div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: '#fff', margin: 0 }}>Welcome!</p>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    style={{ fontSize: 12, color: '#C9A84C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 3, marginTop: 3 }}
                  >
                    Login to continue <ChevronRight size={11} />
                  </Link>
                </div>
              </div>
            )}

            <button
              onClick={() => setMenuOpen(false)}
              style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.08)', border: 'none', cursor: 'pointer', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .18s', marginLeft: 8 }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.18)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              <X size={16} />
            </button>
          </div>

          {/* Quick actions */}
          {user && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, position: 'relative', zIndex: 1 }}>
              {[
                { to: '/wishlist', icon: <Heart size={16} />, label: 'Wishlist', badge: wishlistCount },
                { onClick: () => { setMenuOpen(false); setCartSidebarOpen(true); }, icon: <LucideShoppingBag size={16} />, label: 'Cart', badge: cartCount },
                { to: '/notification', icon: <Bell size={16} />, label: 'Alerts', badge: unreadCount },
              ].map(({ to, onClick, icon, label, badge }) => {
                const tile = (
                  <div
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '10px 6px', background: 'rgba(255,255,255,0.07)', borderRadius: 10, cursor: 'pointer', transition: 'background .18s', position: 'relative', border: '1px solid rgba(201,168,76,0.12)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,76,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                  >
                    {icon}
                    <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 500, letterSpacing: '.02em' }}>{label}</span>
                    {badge > 0 && (
                      <span style={{ position: 'absolute', top: 6, right: 8, minWidth: 15, height: 15, background: '#E53E3E', color: '#fff', fontSize: 9, fontWeight: 700, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                        {badge}
                      </span>
                    )}
                  </div>
                );
                if (to) return (
                  <Link key={label} to={to} onClick={() => setMenuOpen(false)} style={{ color: '#fff', textDecoration: 'none' }}>
                    {tile}
                  </Link>
                );
                return (
                  <button key={label} onClick={onClick} style={{ background: 'none', border: 'none', padding: 0, color: '#fff', cursor: 'pointer' }}>
                    {tile}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Nav links ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px 0' }}>

          {/* Main items */}
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={index}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '11px 14px', borderRadius: 10, marginBottom: 2,
                  textDecoration: 'none',
                  background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: active ? '#C9A84C' : '#4A3F30',
                  fontWeight: active ? 600 : 500,
                  fontSize: 14, transition: 'background .18s, color .18s',
                  borderLeft: active ? '3px solid #C9A84C' : '3px solid transparent',
                }}
                onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; e.currentTarget.style.color = '#C9A84C'; } }}
                onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A3F30'; } }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 9, background: active ? 'rgba(201,168,76,0.15)' : '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .18s' }}>
                  <Icon size={17} color={active ? '#C9A84C' : '#7A6F60'} />
                </div>
                <span style={{ flex: 1 }}>{item.label}</span>
                <ChevronRight size={14} style={{ opacity: active ? 1 : 0.25, transition: 'opacity .18s' }} />
              </Link>
            );
          })}

          {/* Divider + More section */}
          <div style={{ margin: '10px 0 6px', paddingTop: 12, borderTop: '1px solid rgba(201,168,76,0.15)' }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '.1em', padding: '0 4px', marginBottom: 6 }}>
              More
            </p>
            {[
              { href: '/about-us', icon: Info, label: 'About Us' },
              { href: '/contact', icon: Mail, label: 'Contact Us' },
              { href: '/blogs', icon: BookOpen, label: 'Blogs' },
            ].map(({ href, icon: Icon, label }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  to={href}
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px', borderRadius: 10, marginBottom: 2,
                    textDecoration: 'none',
                    background: active ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: active ? '#C9A84C' : '#4A3F30',
                    fontWeight: active ? 600 : 500,
                    fontSize: 14, transition: 'background .18s, color .18s',
                    borderLeft: active ? '3px solid #C9A84C' : '3px solid transparent',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(201,168,76,0.07)'; e.currentTarget.style.color = '#C9A84C'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#4A3F30'; } }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: 9, background: active ? 'rgba(201,168,76,0.15)' : '#F5F0E8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background .18s' }}>
                    <Icon size={17} color={active ? '#C9A84C' : '#7A6F60'} />
                  </div>
                  <span style={{ flex: 1 }}>{label}</span>
                  <ChevronRight size={14} style={{ opacity: active ? 1 : 0.25 }} />
                </Link>
              );
            })}
          </div>
        </div>

        {/* ── Footer ── */}
        <div style={{ padding: '12px 14px 20px', borderTop: '1px solid rgba(201,168,76,0.15)', flexShrink: 0, background: '#fff' }}>
          {user ? (
            <button
              onClick={() => {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                localStorage.removeItem('cartItems');
                localStorage.setItem('cart', 0);
                localStorage.removeItem('unreadCount');
                setCount(0);
                navigate('/');
                setMenuOpen(false);
              }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
                color: '#fff', border: 'none', borderRadius: 10, padding: '13px',
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                cursor: 'pointer', letterSpacing: '.02em', transition: 'opacity .18s, box-shadow .18s',
                boxShadow: '0 2px 10px rgba(220,38,38,0.25)',
              }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '.88'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(220,38,38,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(220,38,38,0.25)'; }}
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 10, background: '#C9A84C', color: '#1A1209',
                borderRadius: 10, padding: '13px',
                fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                textDecoration: 'none', transition: 'background .18s',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#b8952e'}
              onMouseLeave={e => e.currentTarget.style.background = '#C9A84C'}
            >
              <User size={16} /> Login / Register
            </Link>
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
