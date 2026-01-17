import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect } from "react";

export default function Testimonials() {
  const [selectedImage, setSelectedImage] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const [reviews, setReviewsData] = useState([]); // State to hold fetched testimonials

  const fetchTestimonials = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/testimonials`);
      const data = await response.json();
      if (data.success && data.data) {
        // Process and set testimonials data here
        setReviewsData(data.data);
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])
  
  const handlePrevious = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? reviews.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === reviews.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 600);
  };

  const getPosition = (index) => {
    const diff = index - currentIndex;
    const total = reviews.length;

    // Normalize the difference to be between -total/2 and total/2
    let normalizedDiff = diff;
    if (diff > total / 2) normalizedDiff = diff - total;
    if (diff < -total / 2) normalizedDiff = diff + total;

    return normalizedDiff;
  };

  return (
    <section className="relative overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* 3D Carousel */}
        <div className="relative h-[300px] sm:h-[400px] flex items-center justify-center">
          {reviews?.map((image, index) => {
            const position = getPosition(index);

            // Define transform and styles based on position
            let transform, zIndex, opacity, filter;

            if (position === 0) {
              // Center (highlighted)
              transform = 'translateX(0) scale(1) rotateY(0deg)';
              zIndex = 49;
              opacity = 1;
              filter = 'brightness(1)';
            } else if (position === 1) {
              // First right
              transform = 'translateX(55%) scale(0.8) rotateY(-20deg)';
              zIndex = 40;
              opacity = 0.7;
              filter = 'brightness(0.8)';
            } else if (position === -1) {
              // First left
              transform = 'translateX(-55%) scale(0.8) rotateY(20deg)';
              zIndex = 40;
              opacity = 0.7;
              filter = 'brightness(0.8)';
            } else if (position === 2) {
              // Second right
              transform = 'translateX(110%) scale(0.65) rotateY(-30deg)';
              zIndex = 30;
              opacity = 0.5;
              filter = 'brightness(0.7)';
            } else if (position === -2) {
              // Second left
              transform = 'translateX(-110%) scale(0.65) rotateY(30deg)';
              zIndex = 30;
              opacity = 0.5;
              filter = 'brightness(0.7)';
            } else {
              // Hidden cards
              transform = position > 0
                ? 'translateX(180%) scale(0.5) rotateY(-40deg)'
                : 'translateX(-180%) scale(0.5) rotateY(40deg)';
              zIndex = 10;
              opacity = 0;
              filter = 'brightness(0.6)';
            }

            return (
              <div
                key={index}
                onClick={() => position === 0 && setSelectedImage(image)}
                className={`absolute transition-all duration-600 ease-out ${isAnimating ? 'transition-all' : ''
                  } ${position === 0 ? 'cursor-pointer' : ''}`}
                style={{
                  transform,
                  zIndex,
                  opacity,
                  filter,
                  pointerEvents: position === 0 ? 'auto' : 'none',
                }}
              >

                <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-[280px] sm:w-[350px] md:w-[450px]  overflow-hidden">
                  <img
                    src={image}
                    alt={`Review ${index + 1}`}
                      className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            disabled={isAnimating}
            className="absolute left-4 sm:left-8 z-[49] bg-white p-3 sm:p-4 rounded-full shadow-xl hover:bg-purple-50 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
          </button>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="absolute right-4 sm:right-8 z-[49] bg-white p-3 sm:p-4 rounded-full shadow-xl hover:bg-purple-50 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 my-4">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                if (!isAnimating) {
                  setIsAnimating(true);
                  setCurrentIndex(i);
                  setTimeout(() => setIsAnimating(false), 600);
                }
              }}
              className={`h-2 rounded-full transition-all duration-300 ${currentIndex === i
                ? 'w-8 bg-purple-600'
                : 'w-2 bg-gray-300 hover:bg-gray-400'
                }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Modal with zero padding */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-xl w-full shadow-2xl animate-scale-in overflow-hidden rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="Testimonial"
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .duration-600 {
          transition-duration: 600ms;
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </section>
  );
}