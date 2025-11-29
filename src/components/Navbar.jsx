import { useState } from "react";
import { Search, Bell, Menu, X, User, Home, ShoppingBag, Package, Heart, Phone, LogOut, ChevronRight, BookOpen, Info } from "lucide-react";
import { Link, useNavigate, useNavigation } from "react-router-dom";
import { MdTrolley } from "react-icons/md";
import { Wallet } from "lucide-react";
import { CgProductHunt } from "react-icons/cg";
import { ListOrdered } from "lucide-react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  const menuItems = [
    { icon: Home, label: "Home", href: "/homePage" },
    { icon: CgProductHunt, label: "Products", href: "/products" },
    { icon: ListOrdered, label: "My Orders", href: "/orders" },
    { icon: Wallet, label: "Wallet", href: "/wallet" },
    { icon: ShoppingBag, label: "Cart", href: "/cart" },
  ];

  const navLinks = [
    { label: "Home", href: "/homePage" },
    { label: "About Us", href: "/about-us" },
    { label: "Blogs", href: "/blogs" },
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
  const navigate = useNavigate()
  return (
    <>
      <nav className="w-full bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 shadow-sm sticky top-0 z-30 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center group">
                <img
                  src="/logo-black.png"
                  alt="Logo"
                  className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
                />
              </Link>
            </div>

            {/* Center Navigation Links - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.href}
                  className="text-gray-700 font-medium hover:text-[#C9A227] transition-colors relative group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#C9A227] transition-all group-hover:w-full"></span>
                </Link>
              ))}
            </div>

           
            {/* Right Section */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {/* Login Button - Show if no user */}
              {!user && (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-2 px-4 py-2 bg-[#C9A227] text-white rounded-full hover:bg-[#B89020] transition-all font-medium"
                >
                  <User size={18} />
                  Login
                </Link>
              )}

              {/* Notification Bell */}
              <div className="text-[#C9A227] flex flex-col text-xl">
                <span className="font-bold">1000+ </span>
                <span>Trusted users </span>
              </div>

              {
                user &&

                <>
                  <Link
                    to="/notification"
                    className="relative p-2 rounded-full hover:bg-gray-100 transition-colors group"
                  >
                    <Bell size={22} className="text-[#C9A227] group-hover:scale-110 transition-transform" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                  </Link>

                  {/* Menu Button */}
                  <button
                    onClick={() => setMenuOpen(true)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors group"
                  >
                    <Menu size={26} className="text-[#C9A227] group-hover:scale-110 transition-transform" />
                  </button></>
              }

            </div>
          </div>

          {/* Mobile Search */}
          {/* <div className="md:hidden mt-3">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-full outline-none transition-all focus:border-[#C9A227] bg-white"
              />
            </div>
          </div> */}

          {/* Mobile Navigation Links */}
          <div className="lg:hidden flex justify-center gap-6 mt-4 pb-2 border-t border-gray-100 pt-3">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.href}
                className="text-sm text-gray-700 font-bold hover:text-[#C9A227] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* RIGHT SLIDING DRAWER */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* User Profile Section */}
        <div className="bg-gradient-to-br from-[#C9A227] to-[#B89020] p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            {user ? (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center shadow-lg bg-white/20">
                  <img
                    className="w-full h-full object-cover"
                    src={user?.profileImage || "https://via.placeholder.com/150"}
                    alt="profile"
                  />
                </div>

                <Link to="/account" onClick={() => setMenuOpen(false)} className="group flex-1">
                  <p className="font-semibold text-lg truncate">{user?.name || "Guest User"}</p>
                  <p className="text-sm text-white/90 flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Profile
                    <ChevronRight size={14} />
                  </p>
                </Link>
              </div>
            ) : (
              <div className="flex items-center gap-3 flex-1">
                <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/20">
                  <User size={28} />
                </div>
                <div>
                  <p className="font-semibold text-lg">Welcome!</p>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-white/90 hover:text-white transition-colors"
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
        <div className="p-6 flex flex-col gap-2 overflow-y-auto h-[calc(100%-180px)]">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#C9A227] transition-all group"
              >
                <Icon size={20} className="group-hover:scale-110 transition-transform" />
                <span className="font-medium flex-1">{item.label}</span>
                <ChevronRight size={18} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}

          {/* Additional Navigation Links in Drawer */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-4">More</p>
            <Link
              to="/about-us"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#C9A227] transition-all group"
            >
              <Info size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium flex-1">About Us</span>
              <ChevronRight size={18} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
            <Link
              to="/blogs"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-4 px-4 py-3 rounded-lg text-gray-700 hover:bg-[#C9A227]/10 hover:text-[#C9A227] transition-all group"
            >
              <BookOpen size={20} className="group-hover:scale-110 transition-transform" />
              <span className="font-medium flex-1">Blogs</span>
              <ChevronRight size={18} className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          </div>

          {/* Logout Button - Only show if user is logged in */}
          {user && (
            <button onClick={() => {
              localStorage.clear("user")
              localStorage.clear("token")
              navigate("/login")
            }} className="mt-6 flex items-center justify-center gap-3 bg-gradient-to-r from-[#C9A227] to-[#B89020] text-white py-3 px-4 rounded-lg font-medium hover:shadow-lg hover:shadow-[#C9A227]/30 transition-all group">
              <LogOut size={20} className="group-hover:scale-110 transition-transform" />
              Logout
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200 bg-white">
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