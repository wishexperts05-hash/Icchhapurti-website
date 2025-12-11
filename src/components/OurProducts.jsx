import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, ShoppingCart, Zap, Sparkles, Check } from 'lucide-react';

function ImageCarousel({ images }) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered || !images || images.length === 0) return;
    const interval = setInterval(() => {
      setCurrent(p => (p + 1) % images.length);
    }, 1500);
    return () => clearInterval(interval);
  }, [isHovered, images]);

  if (!images || images.length === 0) {
    return (
      <div className="h-36 bg-gray-200 flex items-center justify-center">
        <span className="text-gray-400">No Image</span>
      </div>
    );
  }

  return (
    <div className="relative h-36 overflow-hidden group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => { setIsHovered(false); setCurrent(0); }}>
      {images.map((img, i) => (
        <img key={i} src={img} alt="Product" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" style={{ opacity: i === current ? 1 : 0 }} onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'; }} />
      ))}

      {isHovered && images.length > 1 && (
        <>
          <button onClick={(e) => { e.stopPropagation(); setCurrent(p => (p - 1 + images.length) % images.length); }} className="absolute left-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft size={14} className="text-gray-700" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); setCurrent(p => (p + 1) % images.length); }} className="absolute right-1 top-1/2 -translate-y-1/2 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight size={14} className="text-gray-700" />
          </button>
        </>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <button key={i} onClick={(e) => { e.stopPropagation(); setCurrent(i); }} className="w-1.5 h-1.5 rounded-full transition-all" style={{ backgroundColor: i === current ? '#C9A227' : 'rgba(255,255,255,0.5)' }} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onAddToCart }) {
  const [liked, setLiked] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    setAddingToCart(true);

    try {
      await onAddToCart(product);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      setAddingToCart(false);
    }
  };

  const handleBuyNow = () => {
    // Navigate to checkout or handle buy now
    console.log('Buy now:', product);
  };
  const navigate = useNavigate()
  const handleViewDetails = () => {
    if (navigate) {
      navigate(`/product/${product.id || product._id}`);
    }
  };

  return (
    <div className="relative group h-full">
      {/* Main card */}
      <div onClick={handleViewDetails} className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl overflow-hidden shadow-2xl hover:shadow-purple-500/50 transition-all duration-500 hover:scale-[1.02] border border-purple-500/30 flex flex-col h-full">
        {/* Animated gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 via-pink-600/0 to-yellow-600/0 group-hover:from-purple-600/20 group-hover:via-pink-600/20 group-hover:to-yellow-600/20 transition-all duration-500" />

        {/* Sparkle effect */}
        <div className="absolute top-4 right-4 text-yellow-300 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse">
          <Sparkles className="w-5 h-5" />
        </div>

        {/* Discount badge */}
        {product.discount && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-gradient-to-r from-red-500 to-pink-600 px-3 py-1.5 rounded-full shadow-lg animate-pulse">
              <span className="text-white text-xs font-black">
                {product.discount}% OFF
              </span>
            </div>
          </div>
        )}

        {/* Bestseller badge */}
        {product.badge && (
          <div className="absolute top-3 right-14 z-10">
            <div className="bg-gradient-to-r from-yellow-500 to-amber-600 px-3 py-1 rounded-full shadow-lg">
              <span className="text-white text-xs font-bold">
                ✨ {product.badge}
              </span>
            </div>
          </div>
        )}

        {/* Like button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
          className="absolute top-3 right-3 z-10 w-10 h-10 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 hover:bg-white/20 border border-white/20"
        >
          <Heart
            size={18}
            fill={liked ? '#ef4444' : 'none'}
            stroke={liked ? '#ef4444' : '#ffffff'}
            className="transition-colors"
          />
        </button>

        {/* Product image section */}
        <div className="relative bg-gradient-to-br from-purple-800/30 to-slate-800/30 p-6 cursor-pointer" >
          <div className="h-48 sm:h-56 flex items-center justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
            <img
              src={product.images?.[0] || 'https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?w=400&h=400&fit=crop'}
              alt={product.name}
              className="w-full h-full object-contain relative z-10 group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/300x200?text=No+Image';
              }}
            />
          </div>
        </div>

        {/* Product info section */}
        <div className="relative p-6 bg-gradient-to-b from-slate-900/80 to-slate-900 flex-1 flex flex-col">
          {/* Product name */}
          <h3 className="text-base sm:text-lg font-bold text-white leading-snug mb-2 line-clamp-2 min-h-[3rem] sm:min-h-[3.5rem] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all">
            {product.name || 'Untitled Product'}
          </h3>

          {/* Description */}
          {product.description && (
            <p className="text-xs sm:text-sm text-gray-400 mb-3 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-yellow-500/20 border border-yellow-500/30">
              <Star size={12} className="sm:w-3.5 sm:h-3.5" fill="#eab308" stroke="#eab308" />
              <span className="text-xs sm:text-sm font-bold text-yellow-400">
                {product.overallRating || product.rating || 0}
              </span>
            </div>
            <span className="text-xs sm:text-sm text-gray-400">
              ({product.totalReviews || product.reviews || '0'})
            </span>
          </div>

          {/* Price section */}
          <div className="flex items-center gap-2 sm:gap-3 mb-4">
            <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-500">
              ₹{product.price || 0}
            </span>
            {product.originalPrice && (
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
                <span className="text-xs text-green-400 font-semibold">
                  Save ₹{product.originalPrice - product.price}
                </span>
              </div>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-4 mb-4 text-xs text-gray-300 border-t border-white/10 pt-3">
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

          {/* Action buttons */}
          <div className="flex gap-2 sm:gap-3 mt-auto">
            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || addedToCart}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 sm:px-4 border-2 border-purple-500 rounded-xl font-bold text-xs sm:text-sm text-white transition-all hover:bg-purple-500/20 disabled:opacity-70 disabled:cursor-not-allowed hover:scale-105 hover:shadow-lg hover:shadow-purple-500/50"
            >
              {addingToCart ? (
                <>
                  <Loader2 size={16} className="sm:w-[18px] sm:h-[18px] animate-spin" />
                  <span className="hidden sm:inline">Adding...</span>
                </>
              ) : addedToCart ? (
                <>
                  <Check size={16} className="sm:w-[18px] sm:h-[18px] text-green-400" />
                  <span className="text-green-400 hidden sm:inline">Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart size={16} className="sm:w-[18px] sm:h-[18px]" />
                  <span className="hidden sm:inline">Add to Cart</span>
                </>
              )}
            </button>

            {/* Buy Now */}
            <button
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl font-bold text-xs sm:text-sm text-white transition-all bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 hover:from-purple-500 hover:via-pink-500 hover:to-yellow-400 hover:scale-105 hover:shadow-lg hover:shadow-pink-500/50"
            >
              <Zap size={16} className="sm:w-[18px] sm:h-[18px]" fill="currentColor" />
              <span className="hidden sm:inline">Buy Now</span>
            </button>
          </div>

          {/* Stock indicator */}
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
                  <span className="text-red-400 font-semibold">Out of Stock</span>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function OurProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const Navigate = useNavigate()

  const { t } = useTranslation();

  const handleAddToCart = async (product) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login to add items to cart");
      Navigate('/login')
      return;
    }

    try {
      const cartData = {
        productId: product._id || product.id,
        quantity: 1,
        totalAmount: product.price || 0
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/cart/addToCart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cartData)
      });

      const result = await response.json();
      const oldCount = Number(localStorage.getItem("cart")) || 0;
      if (result.success) {
        localStorage.setItem("cart", oldCount + 1);
      }

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add to cart');
      }

      console.log('Added to cart successfully:', result);

      // Optional: Update cart count in header or show notification
      // You can dispatch an event here that your header component listens to
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: result }));
      Navigate("/cart")
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Failed to add product to cart. Please try again.');
      throw error;
    }
  };

  const [searchText, setSearchText] = useState("");
  const [debounceSearch, setDebounceSearch] = useState("");


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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setProducts(data.products || data.data || []);
        setTotalProducts(data.pagination.totalRecords);
        setTotalPages(data.pagination.totalPages || Math.ceil((data.pagination.totalRecords || 0) / limit));
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };
  const navigate = useNavigate()

  if (error) return /* your error UI */;



  if (loading) {
    return (
      <div className="min-h-screen  flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-white text-lg">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8" >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between  gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{t("common.ourProducts")}</h2>
            <p className="text-gray-400 text-sm">{t("home.tagline")}</p>
          </div>


          <span className='text-white cursor-pointer' onClick={() => navigate("/products")}>View All</span>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-6">
          {products.length > 0 ? products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} onAddToCart={handleAddToCart} />
          ))

            : <span className='text-white text-center'>No Product Not found</span>
          }
        </div>

        {/* Pagination */}
        {/* <div className="mt-10 flex items-center justify-center gap-4">
          <button
            disabled={page === 1}
            onClick={handlePrev}
            className="px-4 py-2 rounded-lg text-white text-sm disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, #C9A227 0%, #a07d1c 100%)' }}
          >
            Prev
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
            Next
          </button>
        </div> */}

        {/* <p className="text-center text-gray-400 mt-3 text-sm">
          Showing {(page - 1) * limit + 1} – {Math.min(page * limit, totalProducts)} of {totalProducts} products
        </p> */}
      </div>
    </div>
  );
}
