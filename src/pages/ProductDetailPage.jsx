import { useState, useEffect } from 'react';
import { Star, ShoppingCart, Eye, ChevronLeft, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewData, setReviewsData] = useState()
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [qty, setQty] = useState(1);

  // Get product ID from URL (you can modify this based on your routing)
  const { id } = useParams()
  const productId = id

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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle different API response structures
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
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data, "data")
      // Handle different API response structures
      if (data.success) {
        setReviews(data.data.reviews);
        setReviewsData(data.data)
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
          className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"}
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

   const token = localStorage.getItem("token");
  const Navigate = useNavigate()
  const handleAddToCart = async (product) => {
 

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-cyan-400" />
          <p className="text-white text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-700">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Error Loading Product</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button
            onClick={fetchProductDetails}
            className="px-6 py-2 rounded-lg text-white font-medium bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-slate-700">
          <div className="w-16 h-16 bg-gray-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">📦</span>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Product Not Found</h3>
          <p className="text-gray-400">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-4">
        {/* Header */}
        <div className="  text-white py-3 px-6 rounded-t-xl font-bold text-xl shadow-lg">
          Product Details
        </div>

        {/* Main Content */}
        <div className="  rounded-b-xl shadow-2xl border border-slate-700/50">
          {/* Product Image */}
          <div className="p-6 flex justify-center">
            <div className="bg-white rounded-xl p-6 shadow-inner w-full max-w-md">
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                spaceBetween={5}
                className="w-full h-60"
              >
                {(product.images?.length > 0 ? product.images : [product.image]).map(
                  (img, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={img || "https://via.placeholder.com/400x200?text=No+Image"}
                        alt={product.name}
                        className="w-full h-60 object-contain"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x200?text=No+Image";
                        }}
                      />
                    </SwiperSlide>
                  )
                )}
              </Swiper>
            </div>
          </div>


          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 px-6">
            <button onClick={() => handleAddToCart(product)} className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button onClick={() => {
              if (!token) {
                alert("Please login to view items In cart");
                Navigate('/login')
                return;
              }

              Navigate("/cart")
            }} className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-600 hover:to-teal-600 text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg">
              <Eye size={20} />
              View Cart
            </button>
          </div>

          {/* Product Info */}
          <div className="p-6 space-y-4">
            <h1 className="text-white text-xl font-semibold">
              Name: {product.name || 'Untitled Product'}
            </h1>
            <p className="text-cyan-400 text-2xl font-bold">
              Price: ₹ {product.price || 0}
            </p>

            {product.originalPrice && (
              <p className="text-gray-400 line-through text-lg">
                Original: ₹ {product.originalPrice}
              </p>
            )}

            {/* Description */}
            <div>
              <h2 className="text-amber-400 font-semibold mb-2">Product Details:</h2>
              <p className="text-gray-300 leading-relaxed text-sm">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

            {/* Ratings Section */}
            <div className="pt-4 border-t border-slate-600">
              <h2 className="text-white font-semibold mb-4">Ratings & Reviews:</h2>

              <div className="flex items-center gap-2 mb-4">
                <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-semibold flex items-center gap-1">
                  {reviewData?.overallRating || 0} <Star size={12} className="fill-white" />
                </span>
                <span className="text-gray-400 text-sm">
                  ({reviewData?.totalReviews || 0} Reviews)
                </span>
              </div>

              {/* Rating Bars */}
              {reviewData?.starDistribution && (
                <div className="space-y-2 mb-6">
                  {Object.entries(reviewData?.starDistribution).map(([stars, percent]) => (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-400 w-12">{stars} star</span>
                      <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-cyan-400 to-teal-400 rounded-full transition-all duration-500"
                          style={{ width: `${percent || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-gray-400 w-10">{percent || 0}%</span>
                    </div>
                  ))}
                </div>
              )}


              {/* Reviews */}
              {reviewsLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-cyan-400" />
                  <p className="text-gray-400">Loading reviews...</p>
                </div>
              ) : reviewsError ? (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-center">
                  <p className="text-red-400 mb-2">Error loading reviews: {reviewsError}</p>
                  <button
                    onClick={() => fetchProductReviews(currentPage)}
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                  >
                    Try Again
                  </button>
                </div>
              ) : reviews.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No reviews yet for this product.</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {reviews?.map((review) => (
                      <div key={review.id || review._id} className="bg-slate-700/50 rounded-lg p-4 border border-slate-600/50">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {(review.name || review.userName || 'U')[0].toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <h4 className="text-white font-medium">{review.name || review.userName || 'Anonymous'}</h4>
                                <p className="text-gray-400 text-xs">
                                  {review.date || review.createdAt ? new Date(review.date || review.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                </p>
                              </div>
                              <StarRating rating={review.stars || 0} size={14} />
                            </div>
                            <p className="text-gray-300 text-sm mt-2">{review.text || review.comment || review.review || 'No review text'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-6 flex-wrap">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft size={16} />
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
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-medium
                              ${pageNum === currentPage
                                ? 'bg-amber-500 text-white'
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </button>
                        );
                      })}

                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="text-gray-400">...</span>
                          <button
                            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors text-sm font-medium bg-slate-700 text-gray-300 hover:bg-slate-600"
                            onClick={() => handlePageChange(totalPages)}
                          >
                            {totalPages}
                          </button>
                        </>
                      )}

                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="w-8 h-8 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}