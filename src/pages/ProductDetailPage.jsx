import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Eye, ChevronLeft, ChevronRight, Loader2, AlertCircle, Package, Truck, ShieldCheck, RefreshCw } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

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
  const [cartSuccess, setCartSuccess] = useState(false);

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

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleAddToCart = async (product) => {
    if (!token) {
      alert("Please login to add items to cart");
      Navigate('/login');
      return;
    }

    setAddingToCart(true);

    try {
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
      const oldCount = Number(localStorage.getItem("cart")) || 0;
      if (result.success) {
        localStorage.setItem("cart", oldCount + 1);
      }

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add to cart');
      }

      setCartSuccess(true);
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: result }));

      setTimeout(() => {
        setCartSuccess(false);
        Navigate("/cart");
      }, 1500);

    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(error.message || 'Failed to add product to cart. Please try again.');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleViewCart = () => {
    if (!token) {
      alert("Please login to view items in cart");
      Navigate('/login');
      return;
    }
    Navigate("/cart");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto"></div>
            <Package className="w-8 h-8 text-cyan-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-white text-lg mt-6 font-medium">Loading product details...</p>
          <p className="text-gray-400 text-sm mt-2">Please wait while we fetch the information</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-red-500/30">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Oops! Something went wrong</h3>
          <p className="text-gray-400 mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={fetchProductDetails}
              className="px-6 py-3 rounded-lg text-white font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-cyan-500/50 flex items-center gap-2"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-700">
          <div className="w-20 h-20 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Product Not Found</h3>
          <p className="text-gray-400 mb-6">The product you're looking for doesn't exist or has been removed.</p>
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-8">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="mb-6">
          <button
            onClick={() => Navigate(-1)}
            className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ChevronLeft size={16} />
            Back to Products
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-8 p-8">
            {/* Left Column - Images */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 3000, disableOnInteraction: false }}
                  spaceBetween={10}
                  className="product-swiper rounded-xl overflow-hidden"
                  style={{ height: '400px' }}
                >
                  {(product.images?.length > 0 ? product.images : [product.image]).map(
                    (img, index) => (
                      <SwiperSlide key={index}>
                        <img
                          src={img || "https://via.placeholder.com/400x400?text=No+Image"}
                          alt={`${product.name} - Image ${index + 1}`}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/400x400?text=No+Image";
                          }}
                        />
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600/50">
                  <Truck className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                  <p className="text-white text-xs font-medium">Free Delivery</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600/50">
                  <ShieldCheck className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white text-xs font-medium">Secure Payment</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-4 text-center border border-slate-600/50">
                  <RefreshCw className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-white text-xs font-medium">Easy Returns</p>
                </div>
              </div>
            </div>

            {/* Right Column - Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl lg:text-2xl font-bold text-white mb-3">
                  {product.name || 'Untitled Product'}
                </h1>

                {/* Rating Summary */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-2 bg-green-500 text-white px-3 py-1.5 rounded-lg">
                    <span className="font-bold">{reviewData?.overallRating || 0}</span>
                    <Star size={14} className="fill-white" />
                  </div>
                  <span className="text-gray-400">
                    ({reviewData?.totalReviews || 0} Reviews)
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-4xl font-bold text-cyan-400">
                    ₹{product.price || 0}
                  </span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                        ₹{product.originalPrice}
                      </span>
                      <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
                <h2 className="text-amber-400 font-bold text-lg mb-3 flex items-center gap-2">
                  <Package size={20} />
                  Product Details
                </h2>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {product.description || 'No description available for this product.'}
                </p>
              </div>

              {/* Quantity Selector */}
              {/* <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50">
                <label className="text-white font-semibold mb-3 block">Quantity:</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-12 h-12 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-bold text-xl transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold text-white w-16 text-center">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="w-12 h-12 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-bold text-xl transition-colors"
                  >
                    +
                  </button>
                </div>
              </div> */}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingToCart || cartSuccess}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
                >
                  {addingToCart ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Adding...
                    </>
                  ) : cartSuccess ? (
                    <>
                      <ShieldCheck size={20} />
                      Added!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={20} />
                      Add to Cart
                    </>
                  )}
                </button>
                <button
                  onClick={handleViewCart}
                  className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 py-4 px-6 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-xl text-lg"
                >
                  <Eye size={20} />
                  View Cart
                </button>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="border-t border-slate-700/50 p-8">
            <h2 className="text-white font-bold text-2xl mb-6 flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={24} />
              Customer Reviews
            </h2>

            {/* Rating Bars */}
            {reviewData?.starDistribution && (
              <div className="bg-slate-700/30 rounded-xl p-6 mb-6 border border-slate-600/50">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="text-6xl font-bold text-white mb-2">
                      {reviewData?.overallRating || 0}
                    </div>
                    <StarRating rating={Math.round(reviewData?.overallRating || 0)} size={24} />
                    <p className="text-gray-400 mt-2">
                      Based on {reviewData?.totalReviews || 0} reviews
                    </p>
                  </div>
                  <div className="space-y-3">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const percent = reviewData?.starDistribution?.[stars] || 0;
                      return (
                        <div key={stars} className="flex items-center gap-3">
                          <span className="text-gray-300 w-16 text-sm font-medium">{stars} Star</span>
                          <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-500"
                              style={{ width: `${percent}%` }}
                            ></div>
                          </div>
                          <span className="text-gray-400 w-12 text-sm">{percent}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Reviews List */}
            {reviewsLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
                <p className="text-gray-400 text-lg">Loading reviews...</p>
              </div>
            ) : reviewsError ? (
              <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center">
                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
                <p className="text-red-400 mb-4 font-medium">Error loading reviews: {reviewsError}</p>
                <button
                  onClick={() => fetchProductReviews(currentPage)}
                  className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-12 bg-slate-700/30 rounded-xl border border-slate-600/50">
                <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400 text-lg font-medium">No reviews yet for this product.</p>
                <p className="text-gray-500 text-sm mt-2">Be the first to review!</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {reviews?.map((review, index) => (
                    <div
                      key={review.id || review._id || index}
                      className="bg-slate-700/40 rounded-xl p-6 border border-slate-600/50 hover:border-cyan-500/30 transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-lg">
                          {(review.reviewerName || review.reviewerName || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between flex-wrap gap-3 mb-3">
                            <div>
                              <h4 className="text-white font-bold text-lg">
                                {review.reviewerName || review.reviewerName || 'Anonymous'}
                              </h4>
                              <p className="text-gray-400 text-sm">
                                {review.date || review.createdAt
                                  ? new Date(review.date || review.createdAt).toLocaleDateString('en-US', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })
                                  : 'Date not available'}
                              </p>
                            </div>
                            <div className="bg-slate-600/50 px-3 py-1.5 rounded-lg">
                              <StarRating rating={review.stars || 0} size={16} />
                            </div>
                          </div>
                          <p className="text-gray-300 leading-relaxed">
                            {review.text || review.comment || review.review || 'No review text provided'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 flex-wrap">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="w-10 h-10 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
                    >
                      <ChevronLeft size={20} />
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
                          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all font-bold shadow-lg
                            ${pageNum === currentPage
                              ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white scale-110'
                              : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {totalPages > 5 && currentPage < totalPages - 2 && (
                      <>
                        <span className="text-gray-400 px-2">...</span>
                        <button
                          className="w-10 h-10 rounded-lg flex items-center justify-center transition-colors font-bold bg-slate-700 text-gray-300 hover:bg-slate-600 shadow-lg"
                          onClick={() => handlePageChange(totalPages)}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="w-10 h-10 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white flex items-center justify-center transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 shadow-lg"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}