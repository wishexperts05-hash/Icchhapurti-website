import { Star, ChevronLeft, ChevronRight, Loader2, AlertCircle, X } from 'lucide-react';
import { useState } from 'react';
import ReactDOM from 'react-dom';

/* ─── Design tokens ─── */
const GOLD = '#C9A84C';
const GOLD_LIGHT = '#F0D080';
const GOLD_PALE = '#FDF6E3';
const DEEP = '#1A1209';
const INK = '#2C2416';
const MUTED = '#7A6F60';
const BORDER = 'rgba(201,168,76,0.25)';
const GREEN = '#27623A';

/* ─── Star Rating ─── */
const StarRating = ({ rating, size = 15 }) => (
  <div style={{ display: 'flex', gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={size}
        style={{
          fill: s <= rating ? GOLD : 'transparent',
          color: s <= rating ? GOLD : '#D1C5B0',
        }}
      />
    ))}
  </div>
);

/* ─── Avatar ─── */
const Avatar = ({ name }) => (
  <div style={{
    width: 48, height: 48, borderRadius: '50%',
    background: `linear-gradient(135deg, ${GOLD} 0%, #8B6914 100%)`,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: '#fff', fontWeight: 700, fontSize: 18, flexShrink: 0,
    fontFamily: "'Cormorant Garamond', serif",
    letterSpacing: '.02em',
  }}>
    {(name || 'U')[0].toUpperCase()}
  </div>
);

/* ─── Single Review Card ─── */
const ReviewCard = ({ review, onImageClick }) => {
  const media = review.images || [];
  const date = review.date || review.createdAt
    ? new Date(review.date || review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—';

  return (
    <div style={{
      background: '#fff',
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: '24px 24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: 0,
    }}>
      {/* Header: avatar + name + stars + date */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
        <Avatar name={review.reviewerName} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: DEEP, fontFamily: "'DM Sans', sans-serif" }}>
              {review.reviewerName || 'Anonymous'}
            </span>
            <span style={{ fontSize: 12, color: MUTED }}>{date}</span>
          </div>
          <div style={{ marginTop: 4 }}>
            <StarRating rating={review.stars || 0} size={14} />
          </div>
        </div>
      </div>

      {/* Title */}
      {review.title && (
        <p style={{
          fontWeight: 700, fontSize: 15, color: INK, marginBottom: 8,
          fontFamily: "'DM Sans', sans-serif", fontStyle: 'italic',
        }}>
          {review.title}
        </p>
      )}

      {/* Body */}
      <p className="text-body" style={{ color: INK, marginBottom: 12 }}>
        {review.text || review.comment || review.review || 'No review provided'}
      </p>

      {/* Media */}
      {media.length > 0 && (
        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', marginBottom: 12 }}>
          {media.map((url, i) =>
            url.endsWith('.mp4') ? (
              <video key={i} src={url} style={{ width: 72, height: 72, borderRadius: 8, border: `1px solid ${BORDER}`, objectFit: 'cover' }} controls />
            ) : (
              <img key={i} src={url} alt="review" onClick={() => onImageClick(url)}
                style={{ width: 72, height: 72, borderRadius: 8, border: `1px solid ${BORDER}`, objectFit: 'cover', cursor: 'pointer' }} />
            )
          )}
        </div>
      )}

      {/* Verified */}
      <div style={{ fontSize: 12, color: GREEN, fontWeight: 500 }}>✓ Verified Purchase</div>
    </div>
  );
};

/* ─── Rating Summary ─── */
const RatingSummary = ({ reviewData }) => {
  if (!reviewData?.starDistribution) return null;

  const maxCount = Math.max(...Object.values(reviewData.starDistribution || {}), 1);

  return (
    <div style={{
      background: '#fff', border: `1px solid ${BORDER}`, borderRadius: 12,
      padding: '24px 28px', marginBottom: 32,
      display: 'grid', gridTemplateColumns: '160px 1fr', gap: 32, alignItems: 'center',
    }} className="pd-rating-summary">
      <style>{`@media(max-width:560px){ .pd-rating-summary { grid-template-columns: 1fr !important; gap: 16px !important; text-align: center; } }`}</style>

      {/* Left: big number */}
      <div style={{ textAlign: 'center' }}>
        <div className="text-display" style={{ fontSize: 64, color: DEEP }}>
          {reviewData?.overallRating || 0}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 3, margin: '8px 0 6px' }}>
          <StarRating rating={Math.round(reviewData?.overallRating || 0)} size={16} />
        </div>
        <div style={{ fontSize: 13, color: MUTED }}>{reviewData?.totalReviews || 0} reviews</div>
      </div>

      {/* Right: bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = reviewData?.starDistribution?.[star] || 0;
          const pct = Math.round((count / (reviewData?.totalReviews || 1)) * 100);
          return (
            <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 48, fontSize: 13, color: INK, fontWeight: 500, flexShrink: 0 }}>{star} stars</span>
              <div style={{ flex: 1, height: 6, background: 'rgba(201,168,76,0.12)', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 99,
                  background: `linear-gradient(90deg, ${GOLD_LIGHT}, ${GOLD})`,
                  width: `${pct}%`, transition: 'width .4s',
                }} />
              </div>
              <span style={{ width: 32, fontSize: 13, color: MUTED, textAlign: 'right', flexShrink: 0 }}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ─── Empty / Write-first state ─── */
const WriteFirstCard = ({ token, setOpenReview }) => (
  <div style={{
    background: GOLD_PALE, border: `1px solid ${BORDER}`, borderRadius: 12,
    padding: '32px 24px', textAlign: 'center',
  }}>
    <p style={{ fontSize: 14, color: MUTED, marginBottom: 16 }}>
      Bought this product? Share your manifestation story ✨
    </p>
    <button
      onClick={() => token && setOpenReview(true)}
      title={!token ? 'Please login to write a review' : ''}
      style={{
        background: token ? GOLD : '#ccc', color: token ? DEEP : '#888',
        border: 'none', borderRadius: 8, padding: '12px 32px',
        fontSize: 14, fontWeight: 700, cursor: token ? 'pointer' : 'not-allowed',
        letterSpacing: '.03em', fontFamily: "'DM Sans', sans-serif",
      }}
    >
      Write a Review
    </button>
  </div>
);

/* ─── Main Review Component ─── */
const Review = ({
  reviewData, hasReviewed, totalPages, reviewsLoading, reviewsError,
  fetchProductReviews, reviews, setOpenReview, orderedReviews,
  handlePageChange, currentPage,
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const token = localStorage.getItem('token');

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@400;500;700&display=swap');
        .pd-review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        @media(max-width: 640px) { .pd-review-grid { grid-template-columns: 1fr !important; } }
        .pd-write-btn:hover { background: #b8952e !important; }
        .pd-write-btn-top:hover { background: transparent !important; color: #b8952e !important; border-color: #b8952e !important; }
      `}</style>

      {/* Lightbox */}
      {selectedImage && ReactDOM.createPortal(
        <div onClick={() => setSelectedImage(null)} style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(4px)' }}>
          <button onClick={() => setSelectedImage(null)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.5)', border: 'none', borderRadius: '50%', width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff' }}>
            <X size={20} />
          </button>
          <img src={selectedImage} alt="enlarged" onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 12, objectFit: 'contain' }} />
        </div>,
        document.body
      )}

      <div style={{ padding: '40px 24px 48px', fontFamily: "'DM Sans', sans-serif", maxWidth: 1100, margin: '0 auto' }}>

        {/* Section header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div className="text-label" style={{ color: GOLD, marginBottom: 8 }}>Real Experiences</div>
            <h2 className="text-display" style={{ color: DEEP, margin: 0 }}>
              What Our Customers Say
            </h2>
          </div>
          {token && (
            <button
              className="pd-write-btn-top"
              onClick={() => setOpenReview(true)}
              style={{
                background: 'transparent', border: `1.5px solid ${GOLD}`, color: GOLD,
                borderRadius: 8, padding: '10px 22px', fontSize: 14, fontWeight: 500,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                transition: 'all .2s', letterSpacing: '.02em', whiteSpace: 'nowrap',
              }}
            >
              ✍️ Write a Review
            </button>
          )}
        </div>

        {/* Rating summary */}
        <RatingSummary reviewData={reviewData} />

        {/* States */}
        {reviewsLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <Loader2 size={36} style={{ animation: 'spin 1s linear infinite', color: GOLD, marginBottom: 12 }} />
            <p style={{ color: MUTED }}>Loading reviews…</p>
            <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          </div>
        ) : reviewsError ? (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            <AlertCircle size={32} color="#EF4444" style={{ marginBottom: 8 }} />
            <p style={{ color: '#DC2626', marginBottom: 12, fontSize: 14 }}>Error loading reviews: {reviewsError}</p>
            <button onClick={() => fetchProductReviews(currentPage)} style={{ background: '#EF4444', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', cursor: 'pointer', fontWeight: 500 }}>
              Try Again
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <WriteFirstCard token={token} setOpenReview={setOpenReview} />
        ) : (
          <>
            {/* Review grid */}
            <div className="pd-review-grid" style={{ marginBottom: 28 }}>
              {orderedReviews?.map((review, index) => (
                <ReviewCard key={review.id || review._id || index} review={review} onImageClick={setSelectedImage} />
              ))}
            </div>

            {/* Write a review CTA strip */}
            {!hasReviewed && (
              <div style={{
                background: GOLD_PALE, border: `1px solid ${BORDER}`, borderRadius: 12,
                padding: '28px 24px', textAlign: 'center', marginBottom: 28,
              }}>
                <p style={{ fontSize: 14, color: MUTED, marginBottom: 14 }}>
                  Bought this product? Share your manifestation story ✨
                </p>
                <button
                  className="pd-write-btn"
                  onClick={() => token && setOpenReview(true)}
                  title={!token ? 'Please login to write a review' : ''}
                  style={{
                    background: token ? GOLD : '#ccc', color: token ? DEEP : '#4f4f4fff',
                    border: 'none', borderRadius: 8, padding: '13px 36px',
                    fontSize: 15, fontWeight: 700, cursor: token ? 'pointer' : 'not-allowed',
                    letterSpacing: '.03em', transition: 'background .2s',
                  }}
                >
                  Write a Review
                </button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, flexWrap: 'wrap' }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${BORDER}`,
                    background: 'transparent', color: DEEP, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.4 : 1,
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) pageNum = i + 1;
                  else if (currentPage <= 3) pageNum = i + 1;
                  else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                  else pageNum = currentPage - 2 + i;

                  const isActive = pageNum === currentPage;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      style={{
                        width: 36, height: 36, borderRadius: 8,
                        border: `1.5px solid ${isActive ? GOLD : BORDER}`,
                        background: isActive ? GOLD : 'transparent',
                        color: isActive ? DEEP : MUTED, fontWeight: isActive ? 700 : 400,
                        fontSize: 14, cursor: 'pointer', transition: 'all .2s',
                        transform: isActive ? 'scale(1.08)' : 'none',
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span style={{ color: MUTED, padding: '0 4px' }}>…</span>
                    <button onClick={() => handlePageChange(totalPages)}
                      style={{ width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${BORDER}`, background: 'transparent', color: MUTED, fontSize: 14, cursor: 'pointer' }}>
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  style={{
                    width: 36, height: 36, borderRadius: 8, border: `1.5px solid ${BORDER}`,
                    background: 'transparent', color: DEEP, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.4 : 1,
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Review;