import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageCarousel = ({
  images = [],
  autoPlay = true,
  autoPlayInterval = 3000,
  showControls = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const defaultImages = [
    "/slider1.jpg",
    "/slider2.jpeg",
    "/slider3.jpeg",
    "/slider4.jpeg",
    "/slider5.png",
  ];

  const displayImages = images.length ? images : defaultImages;

  /* ================= Countdown ================= */
  useEffect(() => {
    const launchDate = new Date("2025-12-25T00:00:00").getTime();

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = launchDate - now;

      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* ================= Autoplay ================= */
  useEffect(() => {
    if (!autoPlay || isHovering) return;

    const timer = setInterval(() => {
      setCurrentIndex((p) =>
        p === displayImages.length - 1 ? 0 : p + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, isHovering, autoPlayInterval, displayImages.length]);

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* ================= Dots ================= */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-2 bg-black/40 px-3 py-1 rounded-full backdrop-blur">
        {displayImages.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            className={`rounded-full transition-all ${
              currentIndex === i
                ? "w-3 h-3 bg-blue-500"
                : "w-2 h-2 bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* ================= SLIDES ================= */}
      <div className="relative h-[220px] sm:h-[320px] md:h-[420px] lg:h-[700px]">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayImages.map((img, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
              <img
                src={img}
                alt={`Slide ${i + 1}`}
                className="w-full h-full object-cover"
              />

              {/* ===== COMING SOON OVERLAY (ONLY ON FIRST SLIDE) ===== */}
              {i === 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="text-center px-4">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-red-500 mb-2">
                      COMING SOON
                    </h1>
                    <p className="text-white/90 text-sm sm:text-base mb-3">
                      Launching in
                    </p>

                    <div className="flex justify-center gap-2 sm:gap-4">
                      {Object.entries(countdown).map(([label, value]) => (
                        <div
                          key={label}
                          className="bg-white/20 backdrop-blur rounded-lg px-2 py-1 sm:px-3 sm:py-2 min-w-[55px]"
                        >
                          <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                            {value}
                          </div>
                          <div className="text-[10px] sm:text-xs text-white/80 uppercase">
                            {label}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ================= Arrows ================= */}
      {showControls && (
        <>
          <button
            onClick={() =>
              setCurrentIndex((p) =>
                p === 0 ? displayImages.length - 1 : p - 1
              )
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:scale-110 transition z-20"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={() =>
              setCurrentIndex((p) =>
                p === displayImages.length - 1 ? 0 : p + 1
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow hover:scale-110 transition z-20"
          >
            <ChevronRight />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageCarousel;
