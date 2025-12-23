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
          location: r.location || "India",
          image:
            r.profile ||
            `https://ui-avatars.com/api/?name=${r.userName || "U"}`,
        }))
      );
      setLoading(false);
    };

    fetchReviews();
  }, []);

  // Check scroll position to show/hide arrows
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
    <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50">
      <div className="max-w-7xl mx-auto px-6">
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
            className="flex gap-4 hide-scrollbar-desktop overflow-x-auto overflow-y-hidden scroll-smooth pb-4"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'white transparent',
              scrollSnapType: 'x mandatory',
              WebkitOverflowScrolling: 'touch'
            
            }}
          >
            {reviews.map((review) => (
              <div
                key={review.id}
                className="flex-shrink-0 w-[calc(100%-2rem)] sm:w-[calc(50%-1rem)] lg:w-[calc(25%-0.75rem)]"
                style={{ scrollSnapAlign: 'start' }}
              >
                <div className="bg-white rounded-3xl p-6 shadow-xl h-full border-2 border-gray-200">
                  <Quote className="w-8 h-8 text-purple-400 mb-4" fill="currentColor" />

                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 text-yellow-500 fill-yellow-500"
                      />
                    ))}
                  </div>

                  <p className="text-gray-800 text-sm mb-4">
                    "{review.text}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <div className="font-bold text-sm">{review.name}</div>
                      <div className="text-xs text-gray-500">
                        {review.location}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Arrows */}
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all z-10"
              aria-label="Scroll left"
            >
              <ChevronLeft />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-all z-10"
              aria-label="Scroll right"
            >
              <ChevronRight />
            </button>
          )}
        </div>

        {/* Hide scrollbar */}
        <style>{`
          div[style*="scrollbarWidth"]::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </section>
  );
}