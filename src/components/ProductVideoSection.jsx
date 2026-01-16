import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

const StoryVideoSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef(null);
  const sliderRef = useRef(null);

  const [storyVideos, setStoryVideos] = useState([]);

  const fetchStorys = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/ourStories?type=unboxing`);
      const data = await response.json();
      setStoryVideos(data.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  useEffect(() => {
    fetchStorys();
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (storyVideos.length === 0) return;
    
    const timer = setInterval(() => {
      setCurrentSlide((p) => (p + 1) % storyVideos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [storyVideos.length]);

  useEffect(() => {
    if (sliderRef.current && storyVideos.length > 0) {
      const cardWidth = isMobile ? 200 : 280;
      const gap = isMobile ? 16 : 24;
      sliderRef.current.scrollTo({
        left: currentSlide * (cardWidth + gap),
        behavior: 'smooth',
      });
    }
  }, [currentSlide, isMobile, storyVideos.length]);

  const openVideo = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    setTimeout(() => videoRef.current?.play(), 150);
  };

  const closeModal = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  const handlePrevious = (e) => {
    e.stopPropagation();
    setCurrentSlide((p) => (p === 0 ? storyVideos.length - 1 : p - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((p) => (p + 1) % storyVideos.length);
  };

  if (storyVideos.length === 0) {
    return <div className="py-10 text-center">Loading stories...</div>;
  }

  return (
    <>
      <div className="sm:py-5 bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          {/* Slider Container */}
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 
                         bg-white/40 hover:bg-white/60 
                         p-1.5 rounded-full shadow-md hover:shadow-lg 
                         transition-all"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 
                         bg-white/40 hover:bg-white/60 
                         p-1.5 rounded-full shadow-md hover:shadow-lg 
                         transition-all"
              aria-label="Next video"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
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
              {storyVideos.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() => openVideo(video)}
                  className={`flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] cursor-pointer snap-center group ${
                    index === currentSlide ? 'opacity-100' : 'opacity-60'
                  }`}
                >
                  <div
                    className={`relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl
                              transition-all duration-300 ease-out
                              ${index === currentSlide ? 'scale-100 sm:scale-105' : 'scale-90 sm:scale-95'}
                              md:hover:scale-110 md:hover:-translate-y-3
                              md:hover:shadow-2xl md:hover:shadow-amber-500/50
                              md:hover:ring-2 md:hover:ring-amber-500/70
                              md:hover:z-10`}
                  >
                    <video
                      src={video.videoUrl}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />

                    {/* Enhanced Hover Overlay */}
                    <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/40 
                                flex items-center justify-center transition-all duration-300">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500 rounded-full 
                                  flex items-center justify-center shadow-lg
                                  scale-0 md:group-hover:scale-100
                                  opacity-0 md:group-hover:opacity-100
                                  transition-all duration-300
                                  md:group-hover:animate-pulse"
                      >
                        <Play className="text-white ml-1 w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                      </div>
                    </div>

                    {/* Shine effect on hover */}
                    <div
                      className="absolute inset-0 opacity-0 md:group-hover:opacity-100 
                                transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'shine 1.5s infinite'
                      }}
                    ></div>

                    {/* Video Info */}
                    <div
                      className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 
                                bg-gradient-to-t from-black/95 via-black/70 to-transparent 
                                pointer-events-none
                                transition-all duration-300
                                md:group-hover:from-black/100 md:group-hover:via-black/90"
                    >
                      <h3
                        className="text-white font-semibold text-xs sm:text-sm mb-1
                                 transition-all duration-300
                                 md:group-hover:text-amber-400"
                      >
                        {video.title}
                      </h3>
                      <p
                        className="text-slate-300 text-[10px] sm:text-xs line-clamp-2
                                transition-all duration-300
                                md:group-hover:text-white"
                      >
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
            <div className="flex justify-center gap-1.5 my-4 sm:mt-6">
              {storyVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide
                      ? 'w-6 bg-amber-500 shadow-md'
                      : 'w-1.5 bg-slate-600 hover:bg-slate-500'
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
                  className="fixed inset-0  z-50 flex items-center justify-center p-4"
                  onClick={closeModal}
                >
                  <div
                    className="relative w-full max-w-4xl  rounded-xl overflow-hidden shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={closeModal}
                      className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 p-2 rounded-full z-10 transition-all hover:scale-110"
                      aria-label="Close video"
                    >
                      <X className="text-white" />
                    </button>
      
                    <div className="aspect-video bg-black">
                      <video
                          ref={videoRef}
                          src={selectedVideo.videoUrl}
                          className="w-full h-full"
                          controls
                          autoPlay
                        />
                    </div>
      
                    <div className="p-4 bg-slate-900">
                      <h3 className="text-white font-semibold text-lg">{selectedVideo.title}</h3>
                      <p className="text-slate-400 text-sm">{selectedVideo.description}</p>
                    </div>
                  </div>
                </div>
              )}

        <style jsx>{`
          @keyframes shine {
            0% {
              background-position: 200% 200%;
            }
            100% {
              background-position: -200% -200%;
            }
          }

          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>

      <div className="">
        <img src="/shape.png" alt="" className="w-full block" />
      </div>
    </>
  );
};

export default StoryVideoSection;