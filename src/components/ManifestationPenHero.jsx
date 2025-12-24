import { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  Star,
  ArrowRight,
  ShoppingCart,
  Heart,
  Zap,
  CheckCircle,
  Target,
  TrendingUp,
  BookOpen,
  Brain,
  Calendar,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHeader } from "../context/HeaderContext";

export default function ManifestationPenHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  const [products, setProducts] = useState([]);
  const [wishList, setWishList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
const { setCount,setList ,wishlistCount } = useHeader();

  const features = [
    { icon: Sparkles, text: "Crystal-Infused Energy" },
    { icon: Star, text: "Gold-Plated Luxury" },
    { icon: Zap, text: "Manifestation Power" },
  ];

  const benefits = [
    {
      icon: Target,
      title: "Focuses Your Intention & Energy",
      description:
        "Channel your thoughts and desires into powerful written manifestations that amplify your energy field.",
      color: "from-purple-500 to-purple-600",
      glow: "purple",
    },
    {
      icon: TrendingUp,
      title: "Helps You Stay Committed to Goals",
      description:
        "Build unstoppable momentum as you consistently write and reinforce your aspirations every single day.",
      color: "from-blue-500 to-blue-600",
      glow: "blue",
    },
    {
      icon: BookOpen,
      title: "Writes Smoothly for Positive Journaling",
      description:
        "Premium ink flow and ergonomic design make every writing session effortless and enjoyable.",
      color: "from-pink-500 to-pink-600",
      glow: "pink",
    },
    {
      icon: Brain,
      title: "Scientifically Aligned with Manifestation",
      description:
        "Based on neuroplasticity and quantum physics principles that support intentional reality creation.",
      color: "from-green-500 to-green-600",
      glow: "green",
    },
    {
      icon: Eye,
      title: "Increases Clarity & Motivation",
      description:
        "Transform vague dreams into crystal-clear visions that ignite your passion and drive daily action.",
      color: "from-yellow-500 to-yellow-600",
      glow: "yellow",
    },
    {
      icon: Calendar,
      title: "Builds Daily Spiritual Habits",
      description:
        "Create a sacred ritual that connects you with your higher self and aligns you with universal energy.",
      color: "from-indigo-500 to-indigo-600",
      glow: "indigo",
    },
    {
      icon: Sparkles,
      title: "Perfect for Scripting & Affirmations",
      description:
        "Ideal tool for scripting your future, writing affirmations, and maintaining your goal journal.",
      color: "from-rose-500 to-rose-600",
      glow: "rose",
    },
  ];

  // Hero entrance + auto feature highlight
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(
      () => setActiveFeature((prev) => (prev + 1) % features.length),
      3000
    );
    return () => clearInterval(interval);
  }, []);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setError(null);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/v1/products/getAllProducts?page=1&limit=8`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success && Array.isArray(data.products)) {
          setProducts(data.products);
        } else if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        } else if (Array.isArray(data)) {
          setProducts(data);
        } else {
          throw new Error("Invalid response format");
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err.message);
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [token]);

  // Fetch wishlist only when products & token are available
  useEffect(() => {
    if (!token || products.length === 0) return;

    const fetchWishlist = async () => {
      setLoadingWishlist(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/wishlist/getWishlist`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setWishList(data.data || []);
        }
      } catch (err) {
        console.error("Error fetching wishlist:", err);
      } finally {
        setLoadingWishlist(false);
      }
    };

    fetchWishlist();
  }, [token, products]);

  const mainProduct = products[0];

  // Derived "liked" for main product using wishlist contents
  const liked = useMemo(() => {
    if (!mainProduct || !Array.isArray(wishList)) return false;
    const id = mainProduct._id || mainProduct.id;

    // adapt these checks to your actual wishlist item shape
    return wishList.some(
      (item) =>
        item.productId?._id === id ||
        item.productId === id ||
        item._id === id ||
        item.id === id
    );
  }, [mainProduct, wishList]);

  // Toggle wishlist for hero product
  const toggleMainWishlist = async () => {
    if (!mainProduct) return;

    if (!token) {
      alert("Please login to manage wishlist");
      navigate("/login");
      return;
    }

    const productId = mainProduct._id || mainProduct.id;
    const nextLiked = !liked;

    setLoadingWishlist(true);

    try {
       const url = nextLiked
  ? `${import.meta.env.VITE_API_URL}/api/user/wishlist/addToWishlist`
  : `${import.meta.env.VITE_API_URL}/api/user/wishlist/removeFromWishlist/${productId}`;

const res = await fetch(url, {
  method: nextLiked ? "POST" : "DELETE", // Use DELETE for remove
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  // Only send body for POST; DELETE usually does not require a body
  body: nextLiked ? JSON.stringify({ productId }) : undefined,
});

      const result = await res.json();

      if (!res.ok || !result.success) {
        throw new Error(result.message || "Failed to update wishlist");
      }
setList((prev) => (nextLiked ? prev + 1 : prev - 1));
      // Optimistically update wishlist array so `liked` recomputes correctly
      setWishList((prev) => {
        if (nextLiked) {
          const exists = prev.some(
            (item) =>
              item.productId?._id === productId ||
              item.productId === productId ||
              item._id === productId ||
              item.id === productId
          );
          if (exists) return prev;
          // store minimal structure; adjust as per your backend format
          return [...prev, { productId }];
        } else {
          return prev.filter(
            (item) =>
              !(
                item.productId?._id === productId ||
                item.productId === productId ||
                item._id === productId ||
                item.id === productId
              )
          );
        }
      });
    } catch (error) {
      console.error("Error updating wishlist:", error);
      alert(error.message || "Failed to update wishlist. Please try again.");
    } finally {
      setLoadingWishlist(false);
    }
  };

  if (loadingProducts) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-slate-50">
      {/* HERO SECTION */}
      <div className="relative min-h-screen bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl" />

          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div
              className={`space-y-8 transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                <span className="text-sm font-medium text-yellow-200">
                  Limited Edition Release
                </span>
              </div>

              <h1 className="text-3xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 animate-gradient">
                  The Manifestation Pen
                </span>
                <br />
                <span className="text-white">That Turns Your</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Intentions Into Reality
                </span>
              </h1>

 <div
              className={`relative transform transition-all md:hidden block duration-1000 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 via-purple-500/30 to-pink-500/30 blur-3xl animate-pulse" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg rotate-12 z-10">
                  PREMIUM
                </div>

                <div className="relative aspect-square flex items-center justify-center p-8">
                  <div className="absolute inset-0 animate-spin-slow">
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-3 h-3"
                        style={{
                          transform: `rotate(${angle}deg) translateX(140px)`,
                        }}
                      >
                        <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                      </div>
                    ))}
                  </div>

                  <div className="relative  z-10 w-full h-full flex items-center justify-center">
                    <div className="relative w-3/4 h-3/4 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-400 rounded-full shadow-2xl shadow-yellow-500/50 flex items-center justify-center animate-float">
                      {mainProduct && mainProduct.images?.[0] ? (
                        <img
                          src={mainProduct.images[0]}
                          alt="pen"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="relative w-4/5 h-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full shadow-inner">
                          <div className="absolute top-1/2 right-0 w-1/4 h-2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-l-full" />
                        </div>
                      )}

                      <div className="absolute top-4 right-4 w-6 h-6 bg-purple-400 rounded-full blur-sm animate-pulse" />
                      <div className="absolute bottom-4 left-4 w-4 h-4 bg-pink-400 rounded-full blur-sm animate-pulse delay-300" />
                    </div>
                  </div>

                  <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <p className="text-xs text-white font-medium">
                      ✨ Crystal Infused
                    </p>
                  </div>
                  <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <p className="text-xs text-white font-medium">💎 24K Gold</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Manifestation Pen
                      </h3>
                      <p className="text-sm text-gray-400">Limited Edition</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                        ₹{mainProduct?.price ?? "--"}
                      </p>
                      {mainProduct && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{(mainProduct.price || 0) + 100}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 w-full max-w-sm px-4">
                <div className="flex-1 bg-gradient-to-br from-purple-500/80 to-purple-600/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-purple-400/30">
                  <p className="text-2xl font-bold text-white">5,000+</p>
                  <p className="text-xs text-purple-100">Pens Sold</p>
                </div>
                <div className="flex-1 bg-gradient-to-br from-pink-500/80 to-pink-600/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-pink-400/30">
                  <p className="text-2xl font-bold text-white">4.9★</p>
                  <p className="text-xs text-pink-100">Rating</p>
                </div>
              </div>
            </div>


              <p className="text-md sm:text-2xl text-gray-300 leading-relaxed">
                Write your goals. Focus your energy.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400 font-semibold">
                  Manifest your dream life.
                </span>
              </p>

              <div className="flex flex-wrap gap-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  const isActive = activeFeature === index;
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${
                        isActive
                          ? "bg-gradient-to-r from-yellow-500 to-purple-500 text-white scale-105"
                          : "bg-white/10 text-gray-300 backdrop-blur-sm"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  disabled={!mainProduct}
                  onClick={() =>
                    mainProduct &&
                    navigate(`/product/${mainProduct.id || mainProduct._id}`)
                  }
                  className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-full font-bold text-lg shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all duration-300 hover:scale-105 overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    {mainProduct
                      ? `Shop Now - ₹${mainProduct.price}`
                      : "Shop Now"}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>

                {/* Wishlist toggle button */}

                {
                  token && <button
                  onClick={toggleMainWishlist}
                  disabled={!mainProduct || loadingWishlist}
                  className="group px-8 py-4 cursor-pointer bg.white/10 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Heart
                      className="w-5 h-5 transition-all duration-300"
                      fill={liked ? "red" : "none"}
                      stroke={liked ? "red" : "white"}
                    />
                    {liked ? "Added to Wishlist" : "Add to Wishlist"}
                  </span>
                </button>
                }
               
              </div>

              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-900 flex items-center justify-center text.white text-white font-bold text-sm"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    <span className="text-white font-semibold">2,847+</span>{" "}
                    manifestations achieved
                  </p>
                </div>
              </div>
            </div>

            {/* Right */}
            <div
              className={`relative transform transition-all hidden md:block duration-1000 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 via-purple-500/30 to-pink-500/30 blur-3xl animate-pulse" />

              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg rotate-12 z-10">
                  PREMIUM
                </div>

                <div className="relative aspect-square flex items-center justify-center p-8">
                  <div className="absolute inset-0 animate-spin-slow">
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-3 h-3"
                        style={{
                          transform: `rotate(${angle}deg) translateX(140px)`,
                        }}
                      >
                        <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                      </div>
                    ))}
                  </div>

                  <div className="relative  z-10 w-full h-full flex items-center justify-center">
                    <div className="relative w-3/4 h-3/4 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-400 rounded-full shadow-2xl shadow-yellow-500/50 flex items-center justify-center animate-float">
                      {mainProduct && mainProduct.images?.[0] ? (
                        <img
                          src={mainProduct.images[0]}
                          alt="pen"
                          className="max-h-full max-w-full object-contain"
                        />
                      ) : (
                        <div className="relative w-4/5 h-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full shadow-inner">
                          <div className="absolute top-1/2 right-0 w-1/4 h-2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-l-full" />
                        </div>
                      )}

                      <div className="absolute top-4 right-4 w-6 h-6 bg-purple-400 rounded-full blur-sm animate-pulse" />
                      <div className="absolute bottom-4 left-4 w-4 h-4 bg-pink-400 rounded-full blur-sm animate-pulse delay-300" />
                    </div>
                  </div>

                  <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <p className="text-xs text-white font-medium">
                      ✨ Crystal Infused
                    </p>
                  </div>
                  <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <p className="text-xs text-white font-medium">💎 24K Gold</p>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        Manifestation Pen
                      </h3>
                      <p className="text-sm text-gray-400">Limited Edition</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                        ₹{mainProduct?.price ?? "--"}
                      </p>
                      {mainProduct && (
                        <p className="text-sm text-gray-400 line-through">
                          ₹{(mainProduct.price || 0) + 100}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 w-full max-w-sm px-4">
                <div className="flex-1 bg-gradient-to-br from-purple-500/80 to-purple-600/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-purple-400/30">
                  <p className="text-2xl font-bold text-white">5,000+</p>
                  <p className="text-xs text-purple-100">Pens Sold</p>
                </div>
                <div className="flex-1 bg-gradient-to-br from-pink-500/80 to-pink-600/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-pink-400/30">
                  <p className="text-2xl font-bold text-white">4.9★</p>
                  <p className="text-xs text-pink-100">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes gradient {
            0%,
            100% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
          }
          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          @keyframes float {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
          }
          @keyframes twinkle {
            0%,
            100% {
              opacity: 0.2;
            }
            50% {
              opacity: 1;
            }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
          }
          .animate-spin-slow {
            animation: spin-slow 20s linear infinite;
          }
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
          .animate-twinkle {
            animation: twinkle 3s ease-in-out infinite;
          }
          .delay-300 {
            animation-delay: 300ms;
          }
          .delay-700 {
            animation-delay: 700ms;
          }
        `}</style>
      </div>
    </div>
  );
}
