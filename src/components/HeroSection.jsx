import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function HeroSection() {
  // Static array of images
  const [banners] = useState([
    { type: "image", src: "/slider1.jpeg" },
    { type: "image", src: "/slider2.jpeg" },
    { type: "image", src: "/slider3.jpeg" },
    // { type: "image", src: "/slider4.jpeg" }
  ]);
  
  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto-slide every 4 seconds
  useEffect(() => {
    if (!banners.length) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === banners.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [banners, currentIndex]);

  const nextSlide = () => {
    if (!banners.length) return;
    setCurrentIndex((prev) =>
      prev === banners.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    if (!banners.length) return;
    setCurrentIndex((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  if (!banners.length) {
    return (
      <section className="w-full bg-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-gray-600">No banners available</p>
        </div>
      </section>
    );
  }

  const current = banners[currentIndex];

  return (
    <section className="w-full bg-gray-50 ">
      <div className=" mx-auto ">
        <div className="relative my-1  overflow-hidden shadow-lg h-[290px] md:h-[500px]">
          {/* Current Image */}
          <img
            src={current.src}
            alt={`Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-700"
          />

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-3 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-3 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-3 w-full flex justify-center gap-2">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full cursor-pointer transition-all ${
                  currentIndex === idx ? "bg-white scale-110" : "bg-white/40"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>

        <div className="relative  overflow-hidden shadow-lg h-[290px] md:h-[500px]">
           <img
            src="/slider3.jpeg"
            alt={`Slide `}
            className="w-full h-full object-cover transition-opacity duration-700"
          />
        </div>
      </div>
    </section>
  );
}