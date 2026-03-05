import { Star } from 'lucide-react';
import { ChevronLeft, ChevronRight, Loader2, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import ReactDOM from 'react-dom';
const Review = ({ reviewData, hasReviewed, totalPages, reviewsLoading, reviewsError, fetchProductReviews, reviews, setOpenReview, orderedReviews, handlePageChange, currentPage }) => {

  const [selectedImage, setSelectedImage] = useState(null);

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

  const token = localStorage.getItem("token")

  return (
    <div className="border-t border-slate-700/50 p-4 sm:p-6 lg:p-8">

      {/* ─── Image Lightbox ───────────────────────────────────────────────────── */}
      {/* ─── Image Lightbox Portal ───────────────────────────────────────────── */}
{selectedImage && ReactDOM.createPortal(
  <div
    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
    onClick={() => setSelectedImage(null)}
  >
    <button
      className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/80 rounded-full p-1.5 transition"
      onClick={() => setSelectedImage(null)}
    >
      <X size={22} />
    </button>
    <img
      src={selectedImage}
      alt="review enlarged"
      className="max-w-[90vw] max-h-[90vh] rounded-xl object-contain shadow-2xl"
      onClick={(e) => e.stopPropagation()}
    />
  </div>,
  document.body
)}
      <h2 className="text-black font-bold text-lg sm:text-xl lg:text-2xl mb-4 sm:mb-6 flex items-center gap-2">
        <Star className="text-yellow-400 fill-yellow-400" size={20} />
        Customer Reviews
      </h2>

      {/* Rating Bars */}
      {reviewData?.starDistribution && (
        <div className="bg-white rounded-lg p-3 mb-3 border border-slate-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Overall Rating */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="text-3xl font-bold text-black leading-none">
                {reviewData?.overallRating || 0}
              </div>
              <Star
                rating={Math.round(reviewData?.overallRating || 0)}
                size={14}
              />
              <p className="text-black text-[11px] mt-1">
                {reviewData?.totalReviews || 0} reviews
              </p>
            </div>

            {/* Distribution */}
            <div className="space-y-1.5">
              {[5, 4, 3, 2, 1].map((stars) => {
                const percent = reviewData?.starDistribution?.[stars] || 0;
                return (
                  <div key={stars} className="flex items-center gap-2">
                    <span className="w-8 text-[11px] text-black font-medium">
                      {stars}★
                    </span>

                    <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    <span className="w-8 text-[11px] text-black text-right">
                      {percent}%
                    </span>
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
          <p className="text-Black text-base sm:text-lg">Loading reviews...</p>
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
        <div className="w-full flex justify-center py-10">
          <div
            className="
      relative rounded-xl w-full
      shadow-[0_0_80px_30px_rgba(245,158,11,0.35)]
    "
          >
            <div
              className="
        bg-white rounded-xl
        px-8 py-6
        text-center
      "
            >
              <h2 className="text-lg font-medium text-gray-700 mb-2">
                Customer Reviews
              </h2>

              <div className="flex justify-center gap-1 mb-1">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                  />
                ))}
              </div>

              <p className="text-sm text-gray-400 mb-4">
                Be the first to write a review
              </p>

              <button
                onClick={() => token && setOpenReview(true)}
                title={!token ? "Please login to write a review" : ""}
                className={`px-6 py-2 rounded-full text-sm font-medium transition
    ${token
                    ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                    : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }
  `}
              >
                Write a review
              </button>

            </div>
          </div>
        </div>

      ) : (
        <>
          <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
            {!hasReviewed && (
              <div
                className="
      relative rounded-xl w-full
      shadow-[0_0_80px_30px_rgba(245,158,11,0.35)]
    "
              >
                <div
                  className="
        bg-white rounded-xl
        px-8 py-6
        text-center
      "
                >
                  <h2 className="text-lg font-medium text-gray-700 mb-2">
                    Customer Reviews
                  </h2>

                  <div className="flex justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map(i => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-400"
                      />
                    ))}
                  </div>

                  <button
                    onClick={() => token && setOpenReview(true)}
                    title={!token ? "Please login to write a review" : ""}
                    className={`px-6 py-2 rounded-full text-sm font-medium transition
    ${token
                        ? "bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                      }
  `}
                  >
                    Write a review
                  </button>
                </div>
              </div>
            )}

            {orderedReviews?.map((review, index) => {
              const media = review.images || [];

              return (
                <div
                  key={review.id || review._id || index}
                  className="bg-white rounded-lg p-3 border border-slate-300 hover:border-cyan-400/40 transition"
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-9 h-9 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {(review.reviewerName || "U")[0].toUpperCase()}
                    </div>

                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-1 gap-2">
                        <div className="min-w-0">
                          <h4 className="text-black font-semibold text-sm truncate">
                            {review.reviewerName || "Anonymous"}
                          </h4>
                          <p className="text-black text-[11px]">
                            {review.date || review.createdAt
                              ? new Date(
                                review.date || review.createdAt
                              ).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })
                              : "—"}
                          </p>
                        </div>

                        <StarRating rating={review.stars || 0} size={12} />
                      </div>
                      <h1 className="text-lg font-bold my-1">{review.title}</h1>
                      {/* Review text */}
                      <p className="text-black text-xs leading-snug mb-2">
                        {review.text ||
                          review.comment ||
                          review.review ||
                          "No review provided"}
                      </p>

                      {/* 🖼️ Media Section (Images / Videos) */}
                      {media.length > 0 && (
                        <div className="flex gap-2 mt-2 overflow-x-auto">
                          {media.map((url, i) =>
                            url.endsWith(".mp4") ? (
                              <video
                                key={i}
                                src={url}
                                className="w-20 h-20 rounded-lg border object-cover"
                                controls
                              />
                            ) : (
                              <img
                                key={i}
                                src={url}
                                alt="review"
                                className="w-20 h-20 rounded-lg border object-cover cursor-pointer hover:scale-105 transition"
                                onClick={() => setSelectedImage(url)}
                              />
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
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
  )
}

export default Review