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
  const defaultImages = ["/new-banner.jpg"];

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
      {/* Aspect ratio container: 1920/1050 = 1.829 ≈ 64:35 */}
      <div className="relative w-full" style={{ aspectRatio: '1920/1050' }}>
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

              {/* ===== COMING SOON OVERLAY (Commented out) ===== */}
              {/* <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="text-center px-4">
                  <h1 className="text-xl xs:text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-red-500 mb-2 sm:mb-4 md:mb-6 drop-shadow-lg">
                    COMING SOON
                  </h1>
                  <p className="text-white text-xs xs:text-sm sm:text-base md:text-lg lg:text-xl mb-3 sm:mb-4 md:mb-6 drop-shadow-md">
                    Launching in
                  </p>

                  <div className="flex justify-center gap-1.5 xs:gap-2 sm:gap-3 md:gap-4 lg:gap-5">
                    {Object.entries(countdown).map(([label, value]) => (
                      <div
                        key={label}
                        className="bg-white/20 backdrop-blur-md rounded-md xs:rounded-lg sm:rounded-xl 
                                   px-1.5 py-1 xs:px-2 xs:py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-3 lg:px-5 lg:py-4
                                   min-w-[40px] xs:min-w-[50px] sm:min-w-[60px] md:min-w-[70px] lg:min-w-[90px]
                                   border border-white/30"
                      >
                        <div className="text-base xs:text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-white drop-shadow-md">
                          {String(value).padStart(2, '0')}
                        </div>
                        <div className="text-[8px] xs:text-[10px] sm:text-xs md:text-sm lg:text-base text-white/90 uppercase font-medium">
                          {label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div> */}
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

      {/* ================= Navigation Arrows ================= */}
      {showControls && displayMedia.length > 1 && (
        <>
          <button
            onClick={() =>
              setCurrentIndex(p =>
                p === 0 ? displayMedia.length - 1 : p - 1
              )
            }
            className="absolute left-2 xs:left-3 sm:left-4 md:left-6 lg:left-8 top-1/2 -translate-y-1/2 
                       bg-white/80 hover:bg-white 
                       p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-4
                       rounded-full shadow-lg hover:scale-110 transition-all z-20
                       focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>

          <button
            onClick={() =>
              setCurrentIndex(p =>
                p === displayMedia.length - 1 ? 0 : p + 1
              )
            }
            className="absolute right-2 xs:right-3 sm:right-4 md:right-6 lg:right-8 top-1/2 -translate-y-1/2 
                       bg-white/80 hover:bg-white 
                       p-1.5 xs:p-2 sm:p-2.5 md:p-3 lg:p-4
                       rounded-full shadow-lg hover:scale-110 transition-all z-20
                       focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next slide"
          >
            <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8" />
          </button>
        </>
      )}

      {/* ================= Dots Indicator ================= */}
      {displayMedia.length > 1 && (
        <div className="absolute bottom-4 xs:bottom-6 sm:bottom-8 md:bottom-12 lg:bottom-16 
                        left-1/2 -translate-x-1/2 flex gap-1.5 xs:gap-2 sm:gap-2.5 md:gap-3 z-20">
          {displayMedia.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`transition-all rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 ${
                i === currentIndex
                  ? 'w-6 xs:w-8 sm:w-10 md:w-12 lg:w-14 h-1.5 xs:h-2 sm:h-2.5 md:h-3 bg-white shadow-lg'
                  : 'w-1.5 xs:w-2 sm:w-2.5 md:w-3 h-1.5 xs:h-2 sm:h-2.5 md:h-3 bg-white/50 hover:bg-white/75'
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