import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

export default function HeroSection() {
  const slides = [
    { type: "image", src: "/hero_img.jpg" },
    { type: "image", src: "/hero_img2.png" }
    // { type: "image", src: "/hero_img.jpg" },
    // { type: "video", src: "/video.mp4" }, // if needed
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  // Auto slide every 4 sec
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === slides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  return (
    <section
      className="w-full bg-cover bg-center py-6"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="max-w-6xl mx-auto px-4 space-y-6">

        {/* Carousel Box */}
        <div className="relative rounded-xl overflow-hidden shadow-lg h-[260px] md:h-[380px]">

          {slides[currentIndex].type === "image" && (
            <img
              src={slides[currentIndex].src}
              alt="slide"
              className="w-full h-full object-cover transition-all duration-700 scale-100"
            />
          )}

          {slides[currentIndex].type === "video" && (
            <video
              src={slides[currentIndex].src}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
          )}

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute top-1/2 -translate-y-1/2 left-3 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            onClick={nextSlide}
            className="absolute top-1/2 -translate-y-1/2 right-3 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full"
          >
            <ChevronRight size={22} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-3 w-full flex justify-center gap-2">
            {slides.map((_, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-3 h-3 rounded-full cursor-pointer transition ${
                  currentIndex === idx ? "bg-white" : "bg-white/40"
                }`}
              ></div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
