import React, { useState, useEffect, useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CarouselSkeleton from "./CarouselSkeleton";

const ImageCarousel = ({
  autoPlay = true,
  autoPlayInterval = 5000,
  showControls = true,
  className = "",
  countryCurrency
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [desktopImages, setDesktopImages] = useState([]);
  const [desktopVideos, setDesktopVideos] = useState([]);
  const [mobileImages, setMobileImages] = useState([]);
  const [mobileVideos, setMobileVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

  /* ================= Default Images ================= */
  const defaultDesktopImages = ["/new-banner.jpg"];
  const defaultMobileImages = ["./bannerMobile1.jpg"];

  /* ================= Detect Mobile ================= */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  /* ================= Fetch Banners with Cache ================= */
  useEffect(() => {
    const fetchBanners = async () => {
      // Check cache first
      const cachedDesktop = sessionStorage.getItem('banners_desktop');
      const cachedMobile = sessionStorage.getItem('banners_mobile');
      const cacheTime = sessionStorage.getItem('banners_cache_time');

      if (cachedDesktop && cachedMobile && cacheTime &&
        Date.now() - cacheTime < CACHE_DURATION) {
        const desktopData = JSON.parse(cachedDesktop);
        const mobileData = JSON.parse(cachedMobile);

        setDesktopImages(desktopData.images || []);
        setDesktopVideos(desktopData.videos || []);
        setMobileImages(mobileData.images || []);
        setMobileVideos(mobileData.videos || []);
        setLoading(false);
        setProducts(JSON.parse(sessionStorage.getItem('products')) || []);
        return;
      }

      try {
        // Parallel fetch - both banners at once
        const [desktopRes, mobileRes, productRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/api/user/banners/getBanner/Desktop Home`),
          fetch(`${import.meta.env.VITE_API_URL}/api/user/banners/getBanner/Mobile Home`),
          fetch(
            `${import.meta.env.VITE_API_URL}/api/user/v1/products/getAllProducts?page=1&limit=3&currencyCode=${countryCurrency || "INR"}`,

          ),
        ]);

        const [desktopData, mobileData, productData] = await Promise.all([
          desktopRes.json(),
          mobileRes.json(),
          productRes.json()
        ]);

        if (desktopData?.success && desktopData.data) {
          setDesktopImages(desktopData.data.images || []);
          setDesktopVideos(desktopData.data.videos || []);


          // Cache desktop banners
          sessionStorage.setItem('banners_desktop', JSON.stringify({
            images: desktopData.data.images || [],
            videos: desktopData.data.videos || []
          }));
        }

        if (mobileData?.success && mobileData.data) {
          setMobileImages(mobileData.data.images || []);
          setMobileVideos(mobileData.data.videos || []);

          // Cache mobile banners
          sessionStorage.setItem('banners_mobile', JSON.stringify({
            images: mobileData.data.images || [],
            videos: mobileData.data.videos || []
          }));
        }
        if (productData?.success && productData.data) {
          console.log("Fetched products for carousel:", productData.data);
          setProducts(productData.data);
          sessionStorage.setItem('products', JSON.stringify(
            productData.data
          ));
        }
        // Set cache timestamp
        sessionStorage.setItem('banners_cache_time', Date.now().toString());

      } catch (err) {
        console.error("Failed to fetch banners", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  /* ================= Combine Media ================= */
  const desktopMedia = useMemo(() => [
    ...desktopImages.map(img => ({ type: 'image', src: img })),
    ...desktopVideos.map(vid => ({ type: 'video', src: vid }))
  ], [desktopImages, desktopVideos]);

  const mobileMedia = useMemo(() => [
    ...mobileImages.map(img => ({ type: 'image', src: img })),
    ...mobileVideos.map(vid => ({ type: 'video', src: vid }))
  ], [mobileImages, mobileVideos]);

  const displayMedia = useMemo(() =>
    isMobile
      ? (mobileMedia.length > 0 ? mobileMedia : defaultMobileImages.map(img => ({ type: 'image', src: img })))
      : (desktopMedia.length > 0 ? desktopMedia : defaultDesktopImages.map(img => ({ type: 'image', src: img }))),
    [isMobile, mobileMedia, desktopMedia]
  );

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

  /* ================= Reset Index on Device Change ================= */
  useEffect(() => {
    setCurrentIndex(0);
  }, [isMobile]);

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
      <div className="relative w-full" style={{ aspectRatio: isMobile ? '1/1' : '2363/1000' }}>
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
                  className="w-full h-full "
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ) : (
                <video
                  ref={i === currentIndex ? videoRef : null}
                  src={media.src}
                  className="w-full h-full object-cover"
                  muted
                  loop
                  playsInline
                  preload={i === currentIndex ? "auto" : "none"}
                />
              )}

              {/* SHOP NOW BUTTON – ONLY ON 2ND BANNER */}
              <div className="absolute inset-0 top-55 md:top-78 flex items-center z-20">
                <div className="ml-4 sm:ml-8 md:ml-32">
                  <button
                    onClick={() => {
                      const product = products[i];
                      if (!product) return;

                      navigate(
                        `/product/${product._id}/${product.name
                          ?.replace(/\s+/g, "-")
                          .toLowerCase()}`
                      );
                    }}
                    className="px-3 py-2 cursor-pointer text-sm sm:text-base font-bold text-black rounded-sm bg-white shadow-lg hover:scale-105 hover:shadow-xl transition-all"
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= Decorative Bottom Edge ================= */}
        <div className="absolute -bottom-2 md:-bottom-7 left-0 right-0 w-full z-10 pointer-events-none">
          <img src="/shape1.png" alt="" className="w-full block" loading="lazy" />
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
              className={`transition-all rounded-full ${i === currentIndex
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