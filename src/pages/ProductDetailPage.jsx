import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Eye, ChevronLeft, ChevronRight, Loader2, AlertCircle, Package, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Zap } from 'lucide-react';
import { useHeader } from '../context/HeaderContext';

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewsData] = useState();
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [qty, setQty] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);
  const [buyingNow, setBuyingNow] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const { setCount } = useHeader();
  const { id } = useParams();
  const productId = id;
  const Navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchProductDetails();
    fetchProductReviews();
  }, [productId]);

  useEffect(() => {
    if (product) {
      fetchProductReviews(currentPage);
    }
  }, [currentPage]);

  const fetchProductDetails = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/v1/products/productById/${productId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success && data.product) {
        setProduct(data.product);
      } else if (data.success && data.data) {
        setProduct(data.data);
      } else if (data.id || data._id) {
        setProduct(data);
      } else {
        throw new Error('Invalid product data');
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductReviews = async (page = 1) => {
    setReviewsLoading(true);
    setReviewsError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/v1/reviews/getProductReviews/${productId}?page=${page}&limit=10`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        setReviews(data.data.reviews);
        setReviewsData(data.data);
        setTotalPages(data.pagination.totalPages || 1);
      } else if (data.success && data.data) {
        setReviews(data.data.reviews);
        setTotalPages(data.pagination?.totalPages || 1);
      } else if (Array.isArray(data)) {
        setReviews(data);
      } else {
        throw new Error('Invalid reviews data');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setReviewsError(err.message);
    } finally {
      setReviewsLoading(false);
    }
  };

  const StarRating = ({ rating, size = 16 }) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
  //  const [addedToCart, setAddedToCart] = useState(false);
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = async ({ product, e, isBuyNow }) => {
    // e.stopPropagation();

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
        Navigate("/cart");

      } else {
        const cartData = {
          productId: product._id || product.id,
          quantity: qty,
          totalAmount: (product.price || 0) * qty
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
        if (!response.ok) {
          throw new Error(result.message || 'Failed to add to cart');
        }

        if (result.success) {
          setCount(prev=>prev + 1)
          if (isBuyNow) {
            Navigate("/payments")
          } else {
            setCartSuccess(true);
            setTimeout(() => setCartSuccess(false), 2000);
            Navigate("/cart")

          }
        }




      }
    } catch (error) {
      Navigate("/cart");
    } finally {
      setAddingToCart(false);
      setBuyingNow(false);
    }
  };


  const handleBuyNow = async (product) => {
    // e.stopPropagation();
    // alert("buy now")

    if (token) {
      await handleAddToCart({ product, isBuyNow: true });
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
      Navigate("/payments");
    }

  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
            <Package className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white text-base sm:text-lg mt-4 sm:mt-6 font-medium">Loading product details...</p>
          <p className="text-gray-400 text-xs sm:text-sm mt-2">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-red-500/30">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertCircle className="w-8 h-8 sm:w-10 sm:h-10 text-red-500" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Oops! Something went wrong</h3>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={fetchProductDetails}
              className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              Try Again
            </button>
            <button
              onClick={() => Navigate(-1)}
              className="px-6 py-3 rounded-lg text-white font-medium bg-slate-700 hover:bg-slate-600 transition-all"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 max-w-md w-full text-center shadow-2xl border border-slate-700">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Product Not Found</h3>
          <p className="text-gray-400 mb-6 text-sm sm:text-base">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => Navigate(-1)}
            className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-4 sm:py-8">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-80 sm:h-80 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 sm:w-64 sm:h-64 bg-indigo-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Breadcrumb */}
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => Navigate(-1)}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-xs sm:text-sm font-medium transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Products
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl sm:rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 p-3 sm:p-6 lg:p-8">
            {/* Left Column - Images */}
            <div className="space-y-3 sm:space-y-6">
              <div className="bg-white rounded-lg sm:rounded-2xl p-2 sm:p-6 shadow-xl">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  spaceBetween={10}
                  className="product-swiper rounded-md sm:rounded-xl overflow-hidden"
                >
                  {(product.images?.length > 0 ? product.images : [product.image]).map(
                    (img, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={img || "https://via.placeholder.com/400x400?text=No+Image"}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-[220px] xs:h-[260px] sm:h-[350px] md:h-[400px] object-contain"
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/400x400?text=No+Image";
                          }}
                        />
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center border border-slate-600/50">
                  <Truck className="w-5 h-5 sm:w-8 sm:h-8 text-cyan-400 mx-auto mb-1 sm:mb-2" />
                  <p className="text-white text-[10px] sm:text-xs font-medium">
                    Free Delivery
                  </p>
                </div>
                <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center border border-slate-600/50">
                  <ShieldCheck className="w-5 h-5 sm:w-8 sm:h-8 text-green-400 mx-auto mb-1 sm:mb-2" />
                  <p className="text-white text-[10px] sm:text-xs font-medium">
                    Secure Payment
                  </p>
                </div>
                <div className="bg-slate-700/50 rounded-lg sm:rounded-xl p-2 sm:p-4 text-center border border-slate-600/50">
                  <RefreshCw className="w-5 h-5 sm:w-8 sm:h-8 text-blue-400 mx-auto mb-1 sm:mb-2" />
                  <p className="text-white text-[10px] sm:text-xs font-medium">
                    Easy Returns
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-2 sm:mb-3">
                  {product.name || "Untitled Product"}
                </h1>

                {/* Rating Summary */}
                <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4 flex-wrap">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-green-500 text-white px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                    <span className="font-bold text-sm sm:text-base">
                      {reviewData?.overallRating || 0}
                    </span>
                    <Star size={12} className="fill-white sm:w-3.5 sm:h-3.5" />
                  </div>
                  <span className="text-gray-400 text-xs sm:text-sm">
                    ({reviewData?.totalReviews || 0} Reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-2 sm:gap-4 mb-4 sm:mb-6 flex-wrap">
                  <span className="text-xl sm:text-3xl lg:text-4xl font-bold text-cyan-400">
                    ₹{product.price || 0}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-sm sm:text-lg lg:text-xl text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="bg-green-500 text-white px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {Math.round(
                          ((product.originalPrice - product.price) / product.originalPrice) *
                          100
                        )}
                        % OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-700/30 rounded-xl p-3 sm:p-6 border border-slate-600/50">
                <h2 className="text-amber-400 font-bold text-base sm:text-lg mb-2 sm:mb-3 flex items-center gap-2">
                  <Package size={18} className="sm:w-5 sm:h-5" />
                  Product Details
                </h2>
                <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                  {product.description || "No description available for this product."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                {/* Add to Cart Button */}
                <button
                  onClick={(e) => handleAddToCart({ product, e, isBuyNow: false })}
                  disabled={addingToCart || cartSuccess || buyingNow}
                  className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Adding...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : cartSuccess ? (
                    <>
                      <ShieldCheck size={16} className="sm:w-5 sm:h-5" />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Add to Cart</span>
                      <span className="sm:hidden">Add</span>
                    </>
                  )}
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={() => handleBuyNow(product)}
                  disabled={addingToCart || cartSuccess || buyingNow}
                  className="flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white py-3 sm:py-4 rounded-lg sm:rounded-xl font-bold transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-base"
                >
                  {buyingNow ? (
                    <>
                      <Loader2 size={16} className="animate-spin sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Processing...</span>
                      <span className="sm:hidden">...</span>
                    </>
                  ) : (
                    <>
                      <Zap size={16} className="sm:w-5 sm:h-5" />
                      <span className="hidden sm:inline">Buy Now</span>
                      <span className="sm:hidden">Buy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>


          {/* Reviews Section */}
          <div className="border-t border-slate-700/50 p-4 sm:p-6 lg:p-8">
            <h2 className="text-white font-bold text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={20} />
              Customer Reviews
            </h2>

            {/* Rating Bars */}
            {reviewData?.starDistribution && (
              <div className="bg-slate-700/30 rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-slate-600/50">
                <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                      {reviewData?.overallRating || 0}
                    </div>
                    <StarRating rating={Math.round(reviewData?.overallRating || 0)} size={20} />
                    <p className="text-gray-400 mt-2 text-xs sm:text-sm">
                      Based on {reviewData?.totalReviews || 0} reviews
                    </p>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const percent = reviewData?.starDistribution?.[stars] || 0;
                      return (
                        <div key={stars} className="flex items-center gap-2 sm:gap-3">
                          <span className="text-gray-300 w-12 sm:w-16 text-xs sm:text-sm font-medium">{stars} Star</span>
                          <div className="flex-1 h-2 sm:h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-400 w-8 sm:w-12 text-xs sm:text-sm">{percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="text-center py-8 sm:py-12">
                <Loader2 className="w-10 h-10 sm:w-12 sm:h-12 animate-spin mx-auto mb-3 sm:mb-4 text-cyan-400" />
                <p className="text-gray-400 text-base sm:text-lg">Loading reviews...</p>
              </div>
            ) : reviewsError ? (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 sm:p-6 text-center">
                <AlertCircle className="w-10 h-10 sm:w-12 sm:h-12 text-red-400 mx-auto mb-2 sm:mb-3" />
                <p className="text-red-400 mb-3 sm:mb-4 font-medium text-sm sm:text-base">Error loading reviews: {reviewsError}</p>
                <button
                  onClick={() => fetchProductReviews(currentPage)}
                  className="px-4 sm:px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors text-sm sm:text-base"
                >
                  Try Again
                </button>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-8 sm:py-12 bg-slate-700/30 rounded-xl border border-slate-600/50">
                <Star className="w-12 h-12 sm:w-16 sm:h-16 text-gray-500 mx-auto mb-3 sm:mb-4" />
                <p className="text-gray-400 text-base sm:text-lg font-medium">No reviews yet for this product.</p>
                <p className="text-gray-500 text-xs sm:text-sm mt-2">Be the first to review!</p>
              </div>
            ) : (
              <>
                <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
                  {reviews?.map((review, index) => (
                    <div
                      key={review.id || review._id || index}
                      className="bg-slate-700/40 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-slate-600/50 hover:border-cyan-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-base sm:text-lg flex-shrink-0 shadow-lg">
                          {(review.reviewerName || review.reviewerName || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between flex-wrap gap-2 sm:gap-3 mb-2 sm:mb-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-white font-bold text-sm sm:text-base lg:text-lg truncate">
                                {review.reviewerName || review.reviewerName || 'Anonymous'}
                              </h4>
                              <p className="text-gray-400 text-xs sm:text-sm">
                                {review.date || review.createdAt
                                  ? new Date(review.date || review.createdAt).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })
                                  : 'Date not available'}
                              </p>
                            </div>
                            <div className="bg-slate-600/50 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg">
                              <StarRating rating={review.stars || 0} size={14} />
                            </div>
                          </div>
                          <p className="text-gray-300 leading-relaxed text-xs sm:text-sm">
                            {review.text || review.comment || review.review || 'No review text provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
                    >
                      <ChevronLeft size={18} />
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-all font-bold shadow-lg text-sm sm:text-base
                            ${pageNum === currentPage
                              ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white scale-105 sm:scale-110'
                              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-gray-400 px-1 sm:px-2 text-sm sm:text-base">...</span>
                        <button
                          className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center transition-colors font-bold bg-slate-700 text-gray-300 hover:bg-slate-600 shadow-lg text-sm sm:text-base"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (min-width: 640px) {
          .product-swiper {
            height: 400px;
          }
        }
        @media (max-width: 639px) {
          .product-swiper {
            height: 250px;
          }
        }
      `}</style>
    </div>
  );
}