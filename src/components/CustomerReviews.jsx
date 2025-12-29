import { useState, useEffect, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animatingCards, setAnimatingCards] = useState(new Set());
  const [cardsPerView, setCardsPerView] = useState(4);

  const scrollRef = useRef(null);

  // 🔄 Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/v1/reviews/getTopReviews`
      );
      const data = await res.json();
      const list = data?.data?.reviews || [];

      setReviews(
        list.map((r, i) => ({
          id: r._id || i,
          rating: r.stars || 5,
          text: r.comment,
          name: r.userName || "Anonymous",
          location: r.city || "India",
          image:
            r.profile ||
            `https://ui-avatars.com/api/?name=${r.userName || "U"}`,
        }))
      );
      setLoading(false);
    };

    fetchReviews();
  }, []);

  // Calculate cards per view based on screen size
  useEffect(() => {
    const updateCardsPerView = () => {
      if (window.innerWidth < 640) {
        setCardsPerView(1);
      } else if (window.innerWidth < 1024) {
        setCardsPerView(2);
      } else {
        setCardsPerView(4);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  const scrollToIndex = (index) => {
    if (!scrollRef.current) return;

    const container = scrollRef.current;
    const cardWidth = container.scrollWidth / reviews.length;
    const scrollPosition = cardWidth * index;

    // Trigger animation
    setAnimatingCards(new Set([index]));
    setTimeout(() => {
      setAnimatingCards(new Set());
    }, 1000);

    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  const handlePrevious = () => {
    const newIndex = Math.max(0, currentIndex - cardsPerView);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, reviews.length - cardsPerView);
    const newIndex = Math.min(maxIndex, currentIndex + cardsPerView);
    setCurrentIndex(newIndex);
    scrollToIndex(newIndex);
  };

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < reviews.length - cardsPerView;

  if (loading || !reviews.length) return null;

  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-pink-100 to-yellow-50">
      
      {/* Top Wave */}
      {/* <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-20 sm:h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z"
            className="fill-white"
          />
        </svg>
      </div> */}

      <div className="relative pt-24 sm:pt-32 pb-20 sm:pb-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-10 sm:mb-14">
            <div className="flex justify-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black mb-2 sm:mb-4">Customer Reviews</h2>
            {/* <p className="text-base sm:text-xl text-gray-600">
              Real stories from real customers
            </p> */}
          </div>

          {/* Slider */}
          <div className="relative px-10 sm:px-12">
            {/* Scrollable container - NO SCROLLBAR */}
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 overflow-hidden pb-6 sm:pb-8"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  data-review-card
                  className="flex-shrink-0 w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]"
                >
                  <div 
                    className={`
                      bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-xl h-full border-2 border-gray-200
                      hover:scale-105 hover:shadow-2xl hover:border-purple-400 transition-all duration-300
                      ${animatingCards.has(index) ? 'animate-slide-down' : ''}
                    `}
                  >
                    <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-purple-400 mb-3 sm:mb-4" fill="currentColor" />

                    <div className="flex gap-1 mb-2 sm:mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>

                    <p className="text-gray-800 text-sm sm:text-base mb-3 sm:mb-4 leading-relaxed">
                      "{review.text}"
                    </p>

                    <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-gray-100">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-full ring-2 ring-white shadow-md"
                      />
                      <div>
                        <div className="font-bold text-sm text-gray-900">{review.name}</div>
                        <div className="text-xs text-gray-500">
                          {review.location}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            {canScrollLeft && (
              <button
                onClick={handlePrevious}
                className="absolute left-0 sm:-left-2 top-1/2 -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 active:scale-95 transition-all z-10 border border-gray-200"
                aria-label="Previous reviews"
              >
                <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={handleNext}
                className="absolute right-0 sm:-right-2 top-1/2 -translate-y-1/2 bg-white p-2 sm:p-3 rounded-full shadow-lg hover:bg-gray-50 hover:scale-110 active:scale-95 transition-all z-10 border border-gray-200"
                aria-label="Next reviews"
              >
                <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-gray-700" />
              </button>
            )}
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: Math.ceil(reviews.length / cardsPerView) }).map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  const newIndex = i * cardsPerView;
                  setCurrentIndex(newIndex);
                  scrollToIndex(newIndex);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  Math.floor(currentIndex / cardsPerView) === i
                    ? 'w-8 bg-purple-500'
                    : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      {/* <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-20 sm:h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z"
            className="fill-white"
          />
        </svg>
      </div> */}

      {/* Styles */}
      <style jsx>{`
        div[data-review-card]::-webkit-scrollbar {
          display: none;
        }
        @keyframes slide-down {
          0% {
            opacity: 0.3;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-down {
          animation: slide-down 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>
    </section>
  );
}