import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";

export default function CustomerReviews() {
  const [activeReview, setActiveReview] = useState(0);

  const reviews = [
    {
      id: 1,
      rating: 5,
      text: "I manifested my job within 15 days using this pen!",
      name: "Sarah K.",
      location: "Mumbai",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
      verified: true,
    },
    {
      id: 2,
      rating: 5,
      text: "Writing affirmations feels powerful with this pen.",
      name: "Raj M.",
      location: "Delhi",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
      verified: true,
    },
    {
      id: 3,
      rating: 5,
      text: "Beautiful design and amazing concept.",
      name: "Meera P.",
      location: "Bangalore",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
      verified: true,
    },
    {
      id: 4,
      rating: 5,
      text: "I gifted it to my sister — she loved it!",
      name: "Amit S.",
      location: "Pune",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
      verified: true,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [reviews.length]);

  const renderCard = (review, index, compact = false) => (
    <div
      key={review.id}
      className={`transform transition-all duration-500 ${
        activeReview === index ? "scale-105 z-10" : "scale-100"
      }`}
    >
      <div
        className={`bg-white rounded-3xl ${
          compact ? "p-5" : "p-6"
        } shadow-xl transition-all duration-300 h-full ${
          activeReview === index
            ? "border-4 border-yellow-400 shadow-2xl shadow-yellow-500/30"
            : "border-2 border-gray-200"
        }`}
      >
        <div className="mb-4">
          <Quote
            className={compact ? "w-8 h-8 text-purple-400" : "w-10 h-10 text-purple-400"}
            fill="currentColor"
          />
        </div>

        <div className="flex gap-1 mb-3">
          {[...Array(review.rating)].map((_, i) => (
            <Star
              key={i}
              className={compact ? "w-4 h-4 text-yellow-500 fill-yellow-500" : "w-5 h-5 text-yellow-500 fill-yellow-500"}
            />
          ))}
        </div>

        <p
          className={`text-gray-800 font-medium ${
            compact ? "text-base" : "text-lg"
          } mb-4 leading-relaxed`}
        >
          "{review.text}"
        </p>

        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <img
            src={review.image}
            alt={review.name}
            className={compact ? "w-10 h-10" : "w-12 h-12"}
            style={{ borderRadius: "9999px" }}
          />
          <div>
            <div className="font-bold text-gray-900">{review.name}</div>
            <div className="text-sm text-gray-500">{review.location}</div>
          </div>
          {review.verified && (
            <div className="ml-auto">
              <div className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-full">
                ✓ Verified
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="relative w-full bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 py-24 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-20 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-pink-300/30 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-8 h-8 text-yellow-500 fill-yellow-500"
              />
            ))}
          </div>

          <h2 className="text-5xl md:text-6xl font-black text-gray-900 mb-4">
           Testimonials
          </h2>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Real stories from real manifestors who transformed their lives
          </p>
        </div>

        {/* Reviews: mobile carousel + desktop grid */}
        <div className="mb-12">
          {/* Mobile: horizontal carousel */}
          <div className="md:hidden -mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {reviews.map((review, index) => (
                <div
                  key={review.id}
                  className="min-w-[85%] max-w-xs snap-center"
                  onClick={() => setActiveReview(index)}
                >
                  {renderCard(review, index, true)}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: 4-column grid */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-6">
            {reviews.map((review, index) => (
              <div key={review.id} onClick={() => setActiveReview(index)}>
                {renderCard(review, index, false)}
              </div>
            ))}
          </div>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-purple-200">
            <div className="text-5xl font-black text-purple-600 mb-2">
              2000+
            </div>
            <div className="text-gray-700 font-semibold">Happy Customers</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-pink-200">
            <div className="text-5xl font-black text-pink-600 mb-2">4.9★</div>
            <div className="text-gray-700 font-semibold">Average Rating</div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center border-2 border-yellow-200">
            <div className="text-5xl font-black text-yellow-600 mb-2">98%</div>
            <div className="text-gray-700 font-semibold">Would Recommend</div>
          </div>
        </div>
      </div>
    </section>
  );
}
