import { useState, useEffect, useRef } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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

  // Check scroll position
  const checkScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    checkScroll();
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);

    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [reviews]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;

    const scrollAmount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading || !reviews.length) return null;

  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-pink-100 to-yellow-50">
      {/* Top Wave */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none rotate-180">
        <svg
          className="relative block w-full h-24 sm:h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z"
            className="fill-white"
          />
        </svg>
      </div>

      <div className="relative pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <div className="flex justify-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-8 h-8 text-yellow-500 fill-yellow-500" />
              ))}
            </div>
            <h2 className="text-5xl font-black mb-4">Testimonials</h2>
            <p className="text-xl text-gray-600">
              Real stories from real customers
            </p>
          </div>

          {/* Slider */}
          <div className="relative">
            {/* Scrollable container */}
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto overflow-y-hidden scroll-smooth pb-8 snap-x snap-mandatory scrollbar-hide"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="flex-shrink-0 w-80 sm:w-[calc(50%-1rem)] lg:w-[calc(25%-0.75rem)] snap-start min-w-[320px] sm:min-w-0"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div 
                    className={`
                      bg-white rounded-3xl p-6 shadow-xl h-full border-2 border-gray-200
                      opacity-0 translate-y-10
                      animate-slide-up
                      hover:scale-105 hover:shadow-2xl hover:border-purple-400 transition-all duration-300
                      md:opacity-100 md:translate-y-0 md:hover:scale-105
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    <Quote className="w-8 h-8 text-purple-400 mb-4" fill="currentColor" />

                    <div className="flex gap-1 mb-3">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-4 h-4 text-yellow-500 fill-yellow-500"
                        />
                      ))}
                    </div>

                    <p className="text-gray-800 text-sm mb-4 leading-relaxed">
                      "{review.text}"
                    </p>

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-10 h-10 rounded-full ring-2 ring-white shadow-md"
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

            {/* Arrows - Desktop only */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all z-10 hidden sm:block"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all z-10 hidden sm:block"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-24 sm:h-32"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,120 L0,120 Z"
            className="fill-white"
          />
        </svg>
      </div>

      {/* Hide scrollbar + Mobile Animation */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </section>
  );
}
