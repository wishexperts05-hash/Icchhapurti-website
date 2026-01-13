import { useState, useEffect } from "react";
import {
  Star,
  Loader2,
  Heart,
  ShoppingCart,
  Zap,
  Sparkles,
  Check,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useHeader } from "../context/HeaderContext";
import { ArrowBigRight } from "lucide-react";
import { ArrowBigLeft } from "lucide-react";
import CartSidebar from "../components/CartSidebar";
import PaymentModal from "./PaymentModal";

// ---------- PRODUCT CARD ----------
function ProductCard({ product, onAddToCart, onWishlistUpdate, openPayment, setOpenPayment, setCartSidebarOpen }) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [liked, setLiked] = useState(product.isWishlisted || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { setCount, setList } = useHeader();

  // Keep local liked in sync with backend flag
  useEffect(() => {
    setLiked(product.isWishlisted || false);
  }, [product.isWishlisted]);

  // Auto-slide images
  useEffect(() => {
    const images = product.images || [];
    if (images.length > 1) {
      const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
      }, 3000); // Change image every 3 seconds

      return () => clearInterval(interval);
    }
  }, [product.images]);

  const handleAddToCart = async ({ e, isBuyNow }) => {
    e.stopPropagation();

    if (isBuyNow) {
      setBuyingNow(true);
    } else {
      setAddingToCart(true);
    }

    try {
      if (!token) {
        const cartItem = {
          productId: product._id || product.id,
          product: {
            _id: product._id || product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            image: product.images?.[0],
          },
          quantity: 1,
          totalAmount: product.price || 0,
        };

        const existingCart = JSON.parse(
          localStorage.getItem("cartItems") || "[]"
        );
        const existingItemIndex = existingCart.findIndex(
          (item) => (item.productId || item.product._id) === cartItem.productId
        );

        if (existingItemIndex > -1) {
          existingCart[existingItemIndex].quantity += 1;
          existingCart[existingItemIndex].totalAmount =
            existingCart[existingItemIndex].quantity * product.price;
        } else {
          existingCart.push(cartItem);
        }

        localStorage.setItem("cartItems", JSON.stringify(existingCart));
        const totalItems = existingCart.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        localStorage.setItem("cart", totalItems);
        setCount(totalItems);
        window.dispatchEvent(
          new CustomEvent("cartUpdated", {
            detail: { cart: existingCart, count: totalItems },
          })
        );
        // navigate("/cart");
        setCartSidebarOpen(true)
        // if (redirectToCart) {
        //   navigate("/cart");
        // } else {
        //   setAddedToCart(true);
        //   setTimeout(() => setAddedToCart(false), 2000);
        // }
      } else {
        await onAddToCart(product);

        if (isBuyNow) {
          setOpenPayment(true)
        } else {
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 2000);
          setCartSidebarOpen(true)

        }
      }
    } catch (error) {
      setCartSidebarOpen(true)
    } finally {
      setAddingToCart(false);
      setBuyingNow(false);
    }
  };


  const handleBuyNow = async (e) => {
    e.stopPropagation();
    // alert("buy now")

    if (token) {
      await handleAddToCart({ e, isBuyNow: true });
    } else {


      const cartItem = {
        productId: product._id || product.id,
        product: {
          _id: product._id || product.id,
          name: product.name,
          price: product.price,
          images: product.images,
          image: product.images?.[0],
        },
        quantity: 1,
        totalAmount: product.price || 0,
      };

      const existingCart = JSON.parse(
        localStorage.getItem("cartItems") || "[]"
      );
      const existingItemIndex = existingCart.findIndex(
        (item) => (item.productId || item.product._id) === cartItem.productId
      );

      if (existingItemIndex > -1) {
        existingCart[existingItemIndex].quantity += 1;
        existingCart[existingItemIndex].totalAmount =
          existingCart[existingItemIndex].quantity * product.price;
      } else {
        existingCart.push(cartItem);
      }

      localStorage.setItem("cartItems", JSON.stringify(existingCart));
      const totalItems = existingCart.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      localStorage.setItem("cart", totalItems);
      setCount(totalItems);
      window.dispatchEvent(
        new CustomEvent("cartUpdated", {
          detail: { cart: existingCart, count: totalItems },
        })
      );
      setOpenPayment(true)
    }


  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id || product._id}`);
  };

  // TOGGLE wishlist: add if not liked, remove if liked
  const toggleWishlist = async (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!token) {
      alert("Please login to manage wishlist");
      // navigate("/login");
      return;
    }

    const productId = product._id || product.id;
    const nextLiked = !liked;

    setWishlistLoading(true);

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

      setLiked(nextLiked);

      // if parent passed onWishlistUpdate, keep product.isWishlisted in sync
      if (onWishlistUpdate) {
        onWishlistUpdate(productId, nextLiked);
      }
    } catch (err) {
      console.error("wishlist error", err);
      alert(err.message || "Failed to update wishlist");
    } finally {
      setWishlistLoading(false);
    }
  };
  console.log(product, "product")

  return (
      <div className="relative group h-full">
           {
        openPayment && <PaymentModal isOpen={openPayment} onClose={() => setOpenPayment(false)} />
      }
  <div
    onClick={handleViewDetails}
    className="relative bg-white rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-all duration-300 hover:shadow-xl border border-gray-200 hover:border-purple-300 flex flex-col h-full"
  >
    {/* Sparkle icon on hover */}
    <div className="absolute top-3 right-3 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
      <Sparkles className="w-4 h-4" />
    </div>

    {/* Discount badge */}
    {product.discount && (
      <div className="absolute top-3 left-3 z-20">
        <div className="bg-gradient-to-r from-red-500 to-pink-600 py-1 rounded-full shadow-md">
          <span className="text-white text-xs font-bold">
            {product.discount}% OFF
          </span>
        </div>
      </div>
    )}

    {/* Wishlist button */}
    <button
      onClick={toggleWishlist}
      disabled={wishlistLoading}
      className="absolute top-3 right-3 z-20 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {wishlistLoading ? (
        <Loader2 size={16} className="animate-spin text-gray-600" />
      ) : (
        <Heart
          size={16}
          fill={liked ? "#ef4444" : "none"}
          stroke={liked ? "#ef4444" : "#374151"}
          className="transition-all duration-300"
        />
      )}
    </button>

    {/* Full-width image - FIXED HEIGHT */}
    <div className="relative w-full h-[520px] bg-gradient-to-b from-gray-50 to-white overflow-hidden">
      <img
        src={product.images?.[currentImageIndex] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"}
        alt={product.name}
        className="w-full h-full object-cover  transition-transform duration-500 group-hover:scale-105"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/1000x1000?text=No+Image";
        }}
      />
    </div>

    {/* Content section */}
    <div className="p-4 bg-white flex flex-col flex-1">
      {/* Product name */}
      <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem]">
        {product.name || "Untitled Product"}
      </h3>

      {/* Description */}
      {product.description && (() => {
        try {
          const parsed = JSON.parse(product.description);
          const firstContent = parsed?.[0]?.content || "";
          const cleanText = firstContent.replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").trim();
          return (
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">
              {cleanText}
            </p>
          );
        } catch (e) {
          return null;
        }
      })()}

      {/* Rating */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-50 border border-yellow-200">
          <Star size={12} fill="#eab308" stroke="#eab308" />
          <span className="text-sm font-bold text-yellow-600">
            {product.overallRating || 0}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          ({product.totalReviews || "0"} reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-black text-gray-900">
          {product.price || "₹0"}
        </span>
      </div>

      {/* Features */}
      <div className="flex items-center gap-3 mb-3 text-xs text-gray-600 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-green-100 rounded-full flex items-center justify-center">
            <Check size={10} className="text-green-600" />
          </div>
          <span>Secure</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-blue-100 rounded-full flex items-center justify-center">
            <Zap size={10} className="text-blue-600" />
          </div>
          <span>Fast Delivery</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 mt-auto">
        <button
          onClick={(e) => handleAddToCart({ e, isBuyNow: false })}
          disabled={addingToCart || addedToCart || buyingNow}
          className="flex-1 flex items-center justify-center cursor-pointer gap-1.5 py-2.5 px-3 border-2 border-amber-600 rounded-xl font-bold text-sm text-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-50 hover:shadow-md"
        >
          {addingToCart ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="hidden sm:inline">Adding...</span>
            </>
          ) : addedToCart ? (
            <>
              <Check size={16} className="text-green-600" />
              <span className="text-green-600 hidden sm:inline">Added!</span>
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              <span className="hidden sm:inline">Add to Cart</span>
              <span className="sm:hidden">Add</span>
            </>
          )}
        </button>

        <button
          onClick={handleBuyNow}
          disabled={addingToCart || addedToCart || buyingNow}
          className="flex-1 flex items-center cursor-pointer justify-center gap-1.5 py-2.5 px-3 rounded-xl font-bold text-sm text-white transition-all bg-amber-600 hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
        >
          {buyingNow ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="hidden sm:inline">Processing...</span>
            </>
          ) : (
            <>
              <Zap size={16} fill="currentColor" />
              <span className="hidden sm:inline">Buy Now</span>
              <span className="sm:hidden">Buy</span>
            </>
          )}
        </button>
      </div>

      {/* Stock status */}
      {product.inStock !== undefined && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs">
          {product.inStock ? (
            <>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-600 font-semibold">In Stock</span>
            </>
          ) : (
            <>
              <div className="w-2 h-2 bg-red-500 rounded-full" />
              <span className="text-red-600 font-semibold">Out of Stock</span>
            </>
          )}
        </div>
      )}
    </div>
  </div>
</div>
  );
}

// ---------- OUR PRODUCTS LIST (UNCHANGED EXCEPT FOR PROP) ----------
export default function ProductsPage({countryCurrency}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(9);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const { setCount, setList } = useHeader();
  const Navigate = useNavigate();
  const { t } = useTranslation();
  const token = localStorage.getItem("token");

  const [cartSidebarOpen, setCartSidebarOpen] = useState(false);
  const [openPayment, setOpenPayment] = useState(false)


  useEffect(() => {
 
    fetchProducts();
     
  }, [page, debounceSearch]);







  useEffect(() => {
    const delay = setTimeout(() => {
      setDebounceSearch(searchText);
      setPage(1);
    }, 500);
    return () => clearTimeout(delay);
  }, [searchText]);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/v1/products/getAllProducts?page=${page}&limit=${limit}&search=${debounceSearch}&countryCode=${countryCurrency || "INR"}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        let productsData = data.products || data.data || [];

        if (token) {
          productsData = await enrichProductsWithWishlistStatus(productsData);
        }
        console.log(productsData, "productsData")
        setProducts(productsData);
        setTotalProducts(data.pagination.totalRecords);
        setTotalPages(
          data.pagination.totalPages ||
          Math.ceil((data.pagination.totalRecords || 0) / limit)
        );
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const enrichProductsWithWishlistStatus = async (products) => {
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

      if (response.ok) {
        const result = await response.json();

        if (result.success && result.data) {
          const wishlistedIds = new Set(
            result.data.map(
              (item) => item?._id || item.productId
            )
          );

          return products.map((product) => ({
            ...product,
            isWishlisted: wishlistedIds.has(product._id || product.id),
          }));
        }
      }

      return products;
    } catch (error) {
      console.error("Error fetching wishlist:", error);
      return products;
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const cartData = {
        productId: product._id || product.id,
        quantity: 1,
        totalAmount: product.price || 0,
      };

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/cart/addToCart`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(cartData),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to add to cart");
      }

      const oldCount = Number(localStorage.getItem("cart")) || 0;
      if (result.success) {
        localStorage.setItem("cart", oldCount + 1);
        setCount(oldCount + 1)
        setCartSidebarOpen(true)
      }

      window.dispatchEvent(new CustomEvent("cartUpdated", { detail: result }));
    } catch (error) {
      throw error;
    }
  };

  // Sync isWishlisted on list level
  const handleWishlistUpdate = (productId, isWishlisted) => {
    setProducts((prevProducts) =>
      prevProducts.map((product) =>
        (product._id || product.id) === productId
          ? { ...product, isWishlisted }
          : product
      )
    );
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };


  if (loading) {
    return (
      <div className="min-h-screen 
 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-white text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen
 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-[#D3AF37]/30">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Error Loading Products
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-[#D3AF37] to-[#D3AF37] hover:from-[#D3AF37] hover:to-[#D3AF37] transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen 
 p-4 md:p-8">


      <div className="max-w-7xl mx-auto">



        <div className="flex flex-col md:flex-row justify-between  gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{t("common.ourProducts")}</h2>
            <p className="text-gray-400 text-sm">{t("home.tagline")}</p>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="
    w-full md:w-72
    px-4 py-2
    rounded-full
    text-sm text-slate-100
    placeholder-slate-400
    bg-white/5
    border border-transparent
    relative
    shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_18px_35px_rgba(0,0,0,0.6)]
    backdrop-blur
    outline-none
    transition-all duration-300
    focus:shadow-[0_0_8px_2px_rgba(255,0,120,0.8)]
    focus:border-[#D3AF37]
    animate-borderPulse
  "
            placeholder="Search Products By Name..."
          />

        </div>

        {products.length > 0 ? (
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
  {products.length === 2 ? (
    <>
      {/* MOBILE (stacked) */}
      <div className="md:hidden col-span-1">
        {products.map((product) => (
          <div key={product.id || product._id} className="mb-4">
            <ProductCard
              product={product}
              onAddToCart={handleAddToCart}
              onWishlistUpdate={handleWishlistUpdate}
              setCartSidebarOpen={setCartSidebarOpen}
              openPayment={openPayment}
              setOpenPayment={setOpenPayment}
            />
          </div>
        ))}
      </div>

      {/* DESKTOP (centered side-by-side) */}
      <div className="hidden md:flex md:col-span-3 justify-center">
        <div className="grid grid-cols-2 gap-20 w-[80.66%]">
          {products.map((product) => (
            <ProductCard
              key={product.id || product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onWishlistUpdate={handleWishlistUpdate}
              setCartSidebarOpen={setCartSidebarOpen}
              openPayment={openPayment}
              setOpenPayment={setOpenPayment}
            />
          ))}
        </div>
      </div>
    </>
  ) : (
    products.map((product) => (
      <ProductCard
        key={product.id || product._id}
        product={product}
        onAddToCart={handleAddToCart}
        onWishlistUpdate={handleWishlistUpdate}
        setCartSidebarOpen={setCartSidebarOpen}
        openPayment={openPayment}
        setOpenPayment={setOpenPayment}
      />
    ))
  )}
</div>



        ) : (
          <div className="text-center py-20 px-4">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-slate-700">
              <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                No Products Found
              </h3>
              <p className="text-gray-400">
                We could not find any products at the moment.
              </p>
            </div>
          </div>
        )}
        {/* Pagination */}
        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={handlePrev}
            className="px-4 py-2 rounded-lg text-white text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #C9A227 0%, #a07d1c 100%)' }}
          >
            <ArrowBigLeft />
          </button>

          <span className="text-white font-semibold text-lg">
            {page} / {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={handleNext}
            className="px-4 py-2 rounded-lg text-white text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #C9A227 0%, #a07d1c 100%)' }}
          >
            <ArrowBigRight />
          </button>
        </div>

        <p className="text-center text-gray-400 mt-3 text-sm">
          Showing {(page - 1) * limit + 1} – {Math.min(page * limit, totalProducts)} of {totalProducts} products
        </p>


        <CartSidebar
          isOpen={cartSidebarOpen}
          onClose={() => setCartSidebarOpen(false)}
          onCheckout={() => {

            setCartSidebarOpen(false);
            setOpenPayment(true);
          }} />
   {cartSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/15  backdrop-blur-[1px] z-51 animate-fadeIn"
          // onClick={() => setMenuOpen(false)}
        />
      )}
      </div>
    </div>
  );
}
