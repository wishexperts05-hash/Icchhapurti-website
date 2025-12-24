import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ImageCarousel = ({
  autoPlay = true,
  autoPlayInterval = 3000,
  showControls = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  /* ================= Default Images ================= */
  const defaultImages = ["/coming-soon-banner.jpg"];

  // Combine images and videos into one array with type identifier
  const allMedia = [
    ...images.map(img => ({ type: 'image', src: img })),
    ...videos.map(vid => ({ type: 'video', src: vid }))
  ];

  const displayMedia = allMedia.length > 0 ? allMedia : defaultImages.map(img => ({ type: 'image', src: img }));

  /* ================= Fetch Banners ================= */
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/banners/getBanner/Home`
        );
        const data = await res.json();

        if (data?.success && data.data) {
          setImages(data.data.images || []);
          setVideos(data.data.videos || []);
        }
      } catch (err) {
        console.error("Failed to fetch banners", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

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
    if (!autoPlay || isHovering || displayMedia.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex(p =>
        p === displayMedia.length - 1 ? 0 : p + 1
      );
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [autoPlay, isHovering, autoPlayInterval, displayMedia.length]);

  /* ================= Video Control ================= */
  useEffect(() => {
    const currentMedia = displayMedia[currentIndex];
    
    if (currentMedia?.type === 'video' && videoRef.current) {
      videoRef.current.play().catch(err => console.log('Video autoplay failed:', err));
    }
  }, [currentIndex, displayMedia]);

  if (loading) return null;

  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* ================= SLIDES ================= */}
      <div className="relative h-[220px] sm:h-[320px] md:h-[420px] lg:h-[700px]">
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayMedia.map((media, i) => (
            <div key={i} className="relative w-full h-full flex-shrink-0">
              {media.type === 'image' ? (
                <img
                  src={media.src}
                  alt={`Slide ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <video
                  ref={i === currentIndex ? videoRef : null}
                  src={media.src}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                />
              )}

              {/* ===== COMING SOON OVERLAY (ON EVERY SLIDE) ===== */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center px-4">
                  <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-red-500 mb-2 sm:mb-4 drop-shadow-lg">
                    COMING SOON
                  </h1>
                  <p className="text-white text-sm sm:text-base md:text-lg mb-3 sm:mb-4 drop-shadow-md">
                    Launching in
                  </p>

                  <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
                    {Object.entries(countdown).map(([label, value]) => (
                      <div
                        key={label}
                        className="bg-white/20 backdrop-blur-md rounded-lg sm:rounded-xl px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 min-w-[50px] sm:min-w-[60px] md:min-w-[70px] border border-white/30"
                      >
                        <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-white drop-shadow-md">
                          {String(value).padStart(2, '0')}
                        </div>
                        <div className="text-[10px] sm:text-xs md:text-sm text-white/90 uppercase font-medium">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= Decorative Bottom Edge ================= */}
        <div className="absolute bottom-0 left-0 right-0 w-full z-10 pointer-events-none">
          <img 
            src="/shape1.png" 
            alt="" 
            className="w-full h-auto block"
            style={{ display: 'block', verticalAlign: 'bottom' }}
          />
        </div>
      </div>

      {/* ================= Arrows ================= */}
      {showControls && displayMedia.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex(p =>
                p === 0 ? displayMedia.length - 1 : p - 1
              )
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg hover:scale-110 transition-all z-20"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={() =>
              setCurrentIndex(p =>
                p === displayMedia.length - 1 ? 0 : p + 1
              )
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-3 rounded-full shadow-lg hover:scale-110 transition-all z-20"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* ================= Dots Indicator ================= */}
      {displayMedia.length > 1 && (
        <div className="absolute bottom-16 sm:bottom-20 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {displayMedia.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all rounded-full ${
                i === currentIndex
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;