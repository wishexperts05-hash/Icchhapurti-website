import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Testimonials() {
  const [reviews, setReviews] = useState([
    "./review1.png",
    "./review2.png",
    "./review3.png",
    "./review4.png",
    "./review5.png",
    "./review6.png",
    "./review7.png",
    "./review8.png",
    "./review9.png",
    "./review10.png",
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
    
    if (diff === 0) return 0; // center
    if (diff === 1 || diff === -(total - 1)) return 1; // right
    if (diff === -1 || diff === total - 1) return -1; // left
    if (diff > 1 || diff < -(total - 1)) return 2; // far right (hidden)
    return -2; // far left (hidden)
  };

  return (
    <section className="relative  overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
  

        {/* 3D Carousel */}
        <div className="relative h-[300px] sm:h-[400px] flex items-center justify-center">
          {reviews.map((image, index) => {
            const position = getPosition(index);
            
            return (
              <div
                key={index}
                className={`absolute transition-all duration-600 ease-out ${
                  isAnimating ? 'transition-all' : ''
                }`}
                style={{
                  transform: 
                    position === 0
                      ? 'translateX(0) scale(1) rotateY(0deg)'
                      : position === 1
                      ? 'translateX(70%) scale(0.75) rotateY(-25deg)'
                      : position === -1
                      ? 'translateX(-70%) scale(0.75) rotateY(25deg)'
                      : position === 2
                      ? 'translateX(150%) scale(0.5) rotateY(-35deg)'
                      : 'translateX(-150%) scale(0.5) rotateY(35deg)',
                  zIndex: position === 0 ? 30 : position === 1 || position === -1 ? 20 : 10,
                  opacity: position === 0 ? 1 : position === 1 || position === -1 ? 0.6 : 0,
                  pointerEvents: position === 0 ? 'auto' : 'none',
                  filter: position === 0 ? 'brightness(1)' : 'brightness(0.7)',
                }}
              >
                <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl w-[280px] sm:w-[350px] md:w-[400px]">
                  <img
                    src={image}
                    alt={`Review ${index + 1}`}
                    className="w-full h-auto rounded-xl object-contain"
                  />
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            onClick={handlePrevious}
            disabled={isAnimating}
            className="absolute left-4 sm:left-8 z-40 bg-white p-3 sm:p-4 rounded-full shadow-xl hover:bg-purple-50 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous review"
          >
            <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
          </button>

          <button
            onClick={handleNext}
            disabled={isAnimating}
            className="absolute right-4 sm:right-8 z-40 bg-white p-3 sm:p-4 rounded-full shadow-xl hover:bg-purple-50 hover:scale-110 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next review"
          >
            <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7 text-purple-600" />
          </button>
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
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
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? 'w-8 bg-purple-600'
                  : 'w-2 bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to review ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .transition-all {
          transition-property: all;
          transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        }
        .duration-600 {
          transition-duration: 600ms;
        }
      `}</style>
    </section>
  );
}