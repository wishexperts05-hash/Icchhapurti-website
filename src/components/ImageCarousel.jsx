import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { useNavigate } from "react-router-dom"
import CarouselSkeleton from "./CarouselSkeleton";

const ImageCarousel = ({
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate()


  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  /* ================= Default Images ================= */
  const defaultImages = ["/new-banner.jpg"];
  const mobileBanners = ["./bannerMobile1.jpg", "./bannerMobile3.jpg"];

  /* ================= Detect Mobile ================= */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Combine images and videos into one array with type identifier
  const allMedia = [
    ...images.map(img => ({ type: 'image', src: img })),
    ...videos.map(vid => ({ type: 'video', src: vid }))
  ];

  // Use mobile banners on mobile, otherwise use fetched media or default
  const displayMedia = isMobile
    ? mobileBanners.map(img => ({ type: 'image', src: img }))
    : (allMedia.length > 0 ? allMedia : defaultImages.map(img => ({ type: 'image', src: img })));

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

   if (loading) {
    return <CarouselSkeleton isMobile={isMobile} />;
  }


  return (
    <div
      className={`relative w-full overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* ================= SLIDES ================= */}
      {/* Desktop: 1600/600 ratio, Mobile: 480/480 (1:1) ratio */}
      <div className="relative w-full" style={{ aspectRatio: isMobile ? '1/1' : '2363/1000' }} >
        <div
          className="flex h-full transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayMedia.map((media, i) => (
            <div key={i} className="relative w-full mb-10 h-full flex-shrink-0">
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

              {/* SHOP NOW BUTTON – ONLY ON 3RD BANNER */}
              {i === 1 && (
                <div className="absolute inset-0 top-30 flex items-center z-20">
                  <div className="ml-4 sm:ml-8 md:ml-32">
                    <button
                      onClick={() => navigate("/products")}
                      className="
          px-6 py-3 cursor-pointer
          text-sm sm:text-base
          font-bold
          text-black
          rounded-sm
          bg-white
          shadow-lg
          hover:scale-105
          hover:shadow-xl
          transition-all
        "
                    >
                      Shop Now
                    </button>
                  </div>
                </div>
              )}


            </div>
          ))}
        </div>

        {/* ================= Decorative Bottom Edge ================= */}
        <div className="absolute  -bottom-2 md:-bottom-8 left-0 right-0 w-full z-10 pointer-events-none">
          <img
            src="/shape1.png"
            alt=""
            className="w-full block"
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
    className="absolute left-2 top-1/2 -translate-y-1/2 
               bg-white/40 hover:bg-white/60 
               p-1.5 rounded-full shadow-md hover:shadow-lg 
               transition-all z-20"
    aria-label="Previous slide"
  >
    <ChevronLeft className="w-6 h-6 text-gray-700" />
  </button>

  <button
    onClick={() =>
      setCurrentIndex(p =>
        p === displayMedia.length - 1 ? 0 : p + 1
      )
    }
    className="absolute right-2 top-1/2 -translate-y-1/2 
               bg-white/40 hover:bg-white/60 
               p-1.5 rounded-full shadow-md hover:shadow-lg 
               transition-all z-20"
    aria-label="Next slide"
  >
    <ChevronRight className="w-6 h-6 text-gray-700" />
  </button>
</>
      )}

      {/* ================= Dots Indicator ================= */}
      {displayMedia.length > 1 && (
  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
    {displayMedia.map((_, i) => (
      <button
        key={i}
        onClick={() => setCurrentIndex(i)}
        className={`transition-all rounded-full ${
          i === currentIndex
            ? 'w-6 h-1.5 bg-white shadow-md'
            : 'w-1.5 h-1.5 bg-white/50 hover:bg-white/70'
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