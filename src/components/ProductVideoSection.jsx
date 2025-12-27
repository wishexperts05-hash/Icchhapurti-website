import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductVideoSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef(null);
  const sliderRef = useRef(null);

  const productVideos = [
    {
      id: 1,
      video: "/story1.mp4",
      title: "Manifestation Pen Unboxing",
      description: "Unlock intention-powered writing from the first touch",
      type: "video"
    },
    {
      id: 2,
      video: "/story2.mp4",
      title: "How the Manifestation Pen Works",
      description: "Align your thoughts, goals, and daily intentions",
      type: "video"
    },
    {
      id: 3,
      video: "/story3.mp4",
      title: "Transform Your Mindset",
      description: "Align your thoughts, goals, and daily intentions",
      type: "video"
    },
    {
      id: 4,
      video: "/story1.mp4",
      title: "Daily Affirmation Writing",
      description: "Turn thoughts into written reality",
      type: "video"
    },
    {
      id: 5,
      video: "/story1.mp4",
      title: "Achieve Your Goals",
      description: "Turn thoughts into written reality",
      type: "video"
    }
  ];

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % productVideos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (sliderRef.current) {
      const cardWidth = isMobile ? 200 : 280;
      const gap = isMobile ? 16 : 24;
      sliderRef.current.scrollTo({
        left: currentSlide * (cardWidth + gap),
        behavior: 'smooth',
      });
    }
  }, [currentSlide, isMobile]);

  const openVideo = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    setTimeout(() => videoRef.current?.play(), 150);
  };

  const closeModal = () => {
    videoRef.current?.pause();
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  const handlePrevious = () => {
    setCurrentSlide((p) => (p === 0 ? productVideos.length - 1 : p - 1));
  };

  const handleNext = () => {
    setCurrentSlide((p) => (p + 1) % productVideos.length);
  };

  return (
    <div className="bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)] py-8 sm:py-12 md:py-16 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3">
            Product Reels
          </h2>
          <p className="text-sm sm:text-base text-slate-300 px-4">
            Experience the Manifestation Pen in short, powerful reels
          </p>
        </div>

        {/* Slider Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={handlePrevious}
            className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 p-2 sm:p-3 rounded-full transition-all shadow-lg hover:scale-110"
            aria-label="Previous video"
          >
            <ChevronLeft className="text-white w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 hover:bg-black/90 p-2 sm:p-3 rounded-full transition-all shadow-lg hover:scale-110"
            aria-label="Next video"
          >
            <ChevronRight className="text-white w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Slider */}
          <div
            ref={sliderRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar px-8 sm:px-12 md:px-16 py-4 sm:py-6 snap-x snap-mandatory"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch'
            }}
          >
            {productVideos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => openVideo(video)}
                className={`flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] cursor-pointer snap-center group ${
                  index === currentSlide 
                    ? 'opacity-100' 
                    : 'opacity-60'
                }`}
              >
                <div className={`relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl
                              transition-all duration-300 ease-out
                              ${index === currentSlide ? 'scale-100 sm:scale-105' : 'scale-90 sm:scale-95'}
                              md:hover:scale-110 md:hover:-translate-y-3
                              md:hover:shadow-2xl md:hover:shadow-amber-500/50
                              md:hover:ring-2 md:hover:ring-amber-500/70
                              md:hover:z-10`}>
                  <video
                    src={video.video}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />

                  {/* Enhanced Hover Overlay */}
                  <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/40 
                                flex items-center justify-center transition-all duration-300">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 rounded-full 
                                  flex items-center justify-center shadow-lg
                                  scale-0 md:group-hover:scale-100
                                  opacity-0 md:group-hover:opacity-100
                                  transition-all duration-300
                                  md:group-hover:animate-pulse">
                      <Play className="text-white ml-1 w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 
                                transition-opacity duration-500 pointer-events-none"
                       style={{
                         background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                         backgroundSize: '200% 200%',
                         animation: 'shine 1.5s infinite'
                       }}>
                  </div>

                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 
                                bg-gradient-to-t from-black/95 via-black/70 to-transparent 
                                pointer-events-none
                                transition-all duration-300
                                md:group-hover:from-black/100 md:group-hover:via-black/90">
                    <h3 className="text-white font-semibold text-xs sm:text-sm mb-1
                                 transition-all duration-300
                                 md:group-hover:text-amber-400">
                      {video.title}
                    </h3>
                    <p className="text-slate-300 text-[10px] sm:text-xs line-clamp-2
                                transition-all duration-300
                                md:group-hover:text-white">
                      {video.description}
                    </p>
                  </div>

                  {/* Corner badge for active slide */}
                  {index === currentSlide && (
                    <div className="absolute top-2 right-2 bg-amber-500 text-white 
                                  text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                      NOW PLAYING
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-4 sm:mt-6">
            {productVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 sm:h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'w-6 sm:w-8 bg-amber-500 shadow-lg shadow-amber-500/50' 
                    : 'w-1.5 sm:w-2 bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Reel Modal */}
      {isModalOpen && selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-[360px] sm:max-w-[400px] md:max-w-[420px] aspect-[9/16] bg-black rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-50 bg-red-500 hover:bg-red-600 p-2 sm:p-2.5 rounded-full transition-all shadow-lg hover:scale-110"
              aria-label="Close video"
            >
              <X className="text-white w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Video Info in Modal */}
            <div className="absolute top-3 left-3 z-40 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-lg">
              <h3 className="text-white font-semibold text-xs sm:text-sm">
                {selectedVideo.title}
              </h3>
            </div>

            {/* Video Player */}
            <video
              ref={videoRef}
              src={selectedVideo.video}
              className="w-full h-full object-cover"
              autoPlay
              loop
              playsInline
              controls={isMobile}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shine {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
        }
        
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ProductVideoSection;