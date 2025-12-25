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

// ---------- PRODUCT CARD ----------
function ProductCard({ product, onAddToCart, onWishlistUpdate }) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const [liked, setLiked] = useState(product.isWishlisted || false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { setCount, setList } = useHeader();

  // Keep local liked in sync with backend flag
  useEffect(() => {
    setLiked(product.isWishlisted || false);
  }, [product.isWishlisted]);

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
        navigate("/cart");
        // if (redirectToCart) {
        //   navigate("/cart");
        // } else {
        //   setAddedToCart(true);
        //   setTimeout(() => setAddedToCart(false), 2000);
        // }
      } else {
        await onAddToCart(product);

        if (isBuyNow) {
          navigate("/payments")
        } else {
          setAddedToCart(true);
          setTimeout(() => setAddedToCart(false), 2000);
          navigate("/cart")

        }
      }
    } catch (error) {
      navigate("/cart");
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
      navigate("/payments");
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
      <div
        onClick={handleViewDetails}
        className="relative  bg-white
 rounded-3xl overflow-hidden shadow-2xl  transition-all duration-500 hover:scale-[1.02] border border-purple-500/30 flex flex-col h-full "
      >
        <div className="absolute inset-0  transition-all duration-500" />

        <div className="absolute top-4 right-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>

        {product.discount && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-3 py-1.5 rounded-full shadow-lg animate-pulse">
              <span className="text-white text-xs font-black">
                {product.discount}% OFF
              </span>
            </div>
          </div>
        )}

        {/* {product.badge && (
          <div className="absolute top-3 right-14 z-10">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-3 py-1 rounded-full shadow-lg">
              <span className="text-white text-xs font-bold">
                ✨ {product.badge}
              </span>
            </div>
          </div>
        )} */}

        {/* Heart button (fixed, no navigation) */}
        <button
          onClick={toggleWishlist}
          disabled={wishlistLoading}
          className="  cursor-pointer top-3 right-3 z-10 w-10 h-10  backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110  disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {wishlistLoading ? (
            <Loader2 size={18} className="animate-spin text-black" />
          ) : (
            <Heart
              size={18}
              fill={liked ? "#ef4444" : "none"}
              stroke={liked ? "#ef4444" : "black"}
              className="transition-all duration-300"
            />
          )}
        </button>


        <div className="relative   p-6">
          <div className="h-48 sm:h-56 flex items-center justify-center relative">
            <div className="absolute inset-0  to-transparent" />
            <img
              src={
                product.images?.[0] ||
                "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&h=400&fit=crop"
              }
              alt={product.name}
              className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src =
                  "https://via.placeholder.com/300x200?text=No+Image";
              }}
            />
          </div>
        </div>

        <div className="relative p-6 bg-[#f8f8f8] flex-1 flex flex-col">
          <h3 className="text-base sm:text-lg font-bold text-black leading-snug mb-2 line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem]  transition-all">
            {product.name || "Untitled Product"}
          </h3>

       {product.description && (() => {
  try {
    const parsed = JSON.parse(product.description);
    const firstContent = parsed?.[0]?.content || "";

    const cleanText = firstContent
      .replace(/<[^>]*>/g, "") // remove HTML tags
      .replace(/&nbsp;/g, " ")
      .trim();

    return (
      <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2 leading-relaxed">
        {cleanText}
      </p>
    );
  } catch (e) {
    return null;
  }
})()}


          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
              <Star
                size={12}
                className="sm:w-3.5 sm:h-3.5"
                fill="#eab308"
                stroke="#eab308"
              />
              <span className="text-xs sm:text-sm font-bold text-yellow-400">
                {product.overallRating || product.rating || 0}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-400">
              ({product.totalReviews || product.reviews || "0"})
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <span className="text-2xl sm:text-3xl text-black font-black  bg-clip-text 0">
              {product.price || 0}
            </span>
            {/* {product.price && (
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{((product.price) * 1.1).toFixed(2)}
                </span>
                <span className="text-xs text-green-400 font-semibold">
                  Save ₹{(((product.price) * 1.1).toFixed(2) - (product.price)).toFixed(2)}
                </span>
              </div>
            )} */}
          </div>

          <div className="flex items-center gap-4 mb-4 text-xs text-black border-t border-white/10 pt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center">
                <Check size={10} className="text-green-400" />
              </div>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Zap size={10} className="text-blue-400" />
              </div>
              <span>Fast Delivery</span>
            </div>
          </div>

          <div className="flex gap-2 sm:gap-3 mt-auto">
            <button
              onClick={(e) => handleAddToCart({ e, isBuyNow: false })}
              disabled={addingToCart || addedToCart || buyingNow}
              className="flex-1 cursor-pointer flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-purple-500 rounded-xl font-bold text-xs sm:text-sm text-black transition-all hover:bg-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              {addingToCart ? (
                <>
                  <Loader2
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] animate-spin"
                  />
                  <span className="hidden sm:inline">Adding...</span>
                </>
              ) : addedToCart ? (
                <>
                  <Check
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] text-green-400"
                  />
                  <span className="text-green-400 hidden sm:inline">
                    Added!
                  </span>
                </>
              ) : (
                <>
                  <ShoppingCart
                    size={16}
                    className="sm:w-[18px] sm:h-[18px]"
                  />
                  <span className="hidden cursor-pointer sm:inline">Add to Cart</span>
                  <span className="sm:hidden">Add</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={addingToCart || addedToCart || buyingNow}
              className="flex-1 flex cursor-pointer items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm text-white transition-all bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-400 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {buyingNow ? (
                <>
                  <Loader2
                    size={16}
                    className="sm:w-[18px] sm:h-[18px] animate-spin"
                  />
                  <span className="hidden sm:inline">Processing...</span>
                </>
              ) : (
                <>
                  <Zap
                    size={16}
                    className="sm:w-[18px] sm:h-[18px]"
                    fill="currentColor"
                  />
                  <span className="hidden sm:inline">Buy Now</span>
                  <span className="sm:hidden">Buy</span>
                </>
              )}
            </button>
          </div>

          {product.inStock !== undefined && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs sm:text-sm">
              {product.inStock ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span className="text-green-400 font-semibold">In Stock</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-red-400 font-semibold">
                    Out of Stock
                  </span>
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
export default function OurProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");
  const { setCount } = useHeader();
  const Navigate = useNavigate();
  const { t } = useTranslation();
  const token = localStorage.getItem("token");

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
        `${import.meta.env.VITE_API_URL}/api/user/v1/products/getAllProducts?page=${page}&limit=${limit}&search=${debounceSearch}`,
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
        setCount(oldCount + 1);

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


  const product = {
    title: products[0]?.name,
    features: [
      "Intention-Infused Writing Technology",
      "Goal-Focused Manifestation Alignment",
      "High-Vibration Energy Balance"
    ]
    ,
    image: "/api/placeholder/200/200" // Replace with your actual image path
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
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
      <div className="min-h-screen bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
 flex items-center justify-center p-4">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-red-500/30">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-3">
            Error Loading Products
          </h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <button
            onClick={fetchProducts}
            className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div  className="min-h-screen bg-cover bg-center bg-no-repeat relative py-2 px-3"
      style={{ backgroundImage: "url('/product-bg.jpg')" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">
              Manifestation Tool
            </h2>
            {/* <p className="text-gray-400 text-sm">{t("home.tagline")}</p> */}
          </div>

          <button
            onClick={() => Navigate("/products")}
            className="text-white px-6 py-2 cursor-pointer rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 transition-all font-semibold shadow-lg hover:shadow-purple-500/50"
          >
            View All
          </button>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-2 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id || product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onWishlistUpdate={handleWishlistUpdate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
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



        <div className="  my-3 flex items-center justify-center ">
          {/* Product Card */}
          <div className=" w-full bg-white rounded-xl overflow-hidden hover:border-amber-400/50 transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2  gap-8 p-8 md:p-10">
              {/* Left Side - Product Description */}



              <div className="flex items-center justify-center">
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 to-orange-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                  <img
                    src={products[0]?.images[0]}
                    alt={product.title}
                    className="relative w-full max-w-sm h-auto object-contain rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Right Side - Product Image */}
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                  Manifestation kit
                </h2>

                <ul className="space-y-3">
                  {product.features.map((feature, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-3 text-slate-600"
                    >
                      <span className="w-1.5 h-1.5 bg-amber-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-base">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button onClick={() => Navigate(`/product/${products[0]._id}`)} className="mt-8 cursor-pointer bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/50 transform hover:scale-105 w-fit">
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
