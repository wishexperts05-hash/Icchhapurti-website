import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight, Pause } from 'lucide-react';

const ProductVideoSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const videoRef = useRef(null);
  const sliderRef = useRef(null);

  // Product videos data
 const productVideos = [
  {
    id: 1,
    thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Manifestation Pen Unboxing",
    description: "Unlock intention-powered writing from the first touch",
    type: "video"
  },
  {
    id: 2,
    thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/movie.mp4",
    title: "How the Manifestation Pen Works",
    description: "Align your thoughts, goals, and daily intentions",
    type: "video"
  },
  {
    id: 3,
    thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Daily Affirmation Writing",
    description: "Turn positive thoughts into written reality",
    type: "video"
  },
  {
    id: 4,
    thumbnail: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/movie.mp4",
    title: "Manifestation Pen in Daily Routine",
    description: "Create focus, clarity, and abundance every day",
    type: "video"
  },
  {
    id: 5,
    thumbnail: "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    title: "Writing Goals with Intention",
    description: "Program your goals through mindful writing",
    type: "video"
  },
  {
    id: 6,
    thumbnail: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&h=600&fit=crop",
    video: "https://www.w3schools.com/html/movie.mp4",
    title: "Manifestation Pen Usage Guide",
    description: "Simple steps to amplify your manifestation practice",
    type: "video"
  }
];


  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % productVideos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [productVideos.length]);

  // Auto-scroll slider
  useEffect(() => {
    if (sliderRef.current) {
      const cardWidth = isMobile ? 280 : 350;
      const gap = 24;
      sliderRef.current.scrollTo({
        left: currentSlide * (cardWidth + gap),
        behavior: 'smooth'
      });
    }
  }, [currentSlide, isMobile]);

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    setIsPlaying(true);
    
    if (video.type === 'video') {
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play();
        }
      }, 100);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setIsPlaying(false);
    if (videoRef.current && selectedVideo?.type === 'video') {
      videoRef.current.pause();
    }
    setTimeout(() => setSelectedVideo(null), 300);
  };

  const togglePlayPause = () => {
    if (videoRef.current && selectedVideo?.type === 'video') {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % productVideos.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + productVideos.length) % productVideos.length);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-1/4 w-96 h-96 border border-amber-400/30 rounded-full" />
        <div className="absolute bottom-20 left-1/3 w-80 h-80 border border-blue-400/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-96 h-96 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white my-4">
            Product Videos
          </h2>
          <p className="text-slate-300 text-lg">
            Watch our products come to life with detailed unboxing and demo videos
          </p>
        </div>

        {/* Video Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-slate-800/90 backdrop-blur-sm hover:bg-amber-500 p-3 rounded-full transition-all duration-300 shadow-xl"
            aria-label="Previous video"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-slate-800/90 backdrop-blur-sm hover:bg-amber-500 p-3 rounded-full transition-all duration-300 shadow-xl"
            aria-label="Next video"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>

          {/* Videos Container */}
          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-4 md:px-16 py-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {productVideos.map((video, index) => (
              <div
                key={video.id}
                className={`flex-shrink-0 w-[280px] md:w-[350px] group cursor-pointer transition-all duration-500 ${
                  index === currentSlide ? 'scale-105' : 'scale-95 opacity-60'
                }`}
                onClick={() => handleVideoClick(video)}
              >
                <div className="relative rounded-2xl overflow-hidden aspect-video bg-slate-800 border-2 border-slate-700/50 group-hover:border-amber-400/70 transition-all duration-300 shadow-2xl">
                  {/* Thumbnail */}
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  
                  {/* Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-amber-500/90 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:scale-125 transition-all duration-300 shadow-2xl group-hover:bg-amber-400">
                      <Play className="w-8 h-8 text-white ml-1" fill="white" />
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white text-lg font-bold mb-1 line-clamp-1">
                      {video.title}
                    </h3>
                    <p className="text-slate-300 text-sm line-clamp-2">
                      {video.description}
                    </p>
                  </div>

                  {/* Active Indicator */}
                  {index === currentSlide && (
                    <div className="absolute top-3 left-3 right-3">
                      <div className="h-1 bg-slate-700/50 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full animate-progress" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {productVideos.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'w-8 bg-amber-400' 
                    : 'w-2 bg-slate-600 hover:bg-slate-500'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {isModalOpen && selectedVideo && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className={`relative w-full bg-slate-900 rounded-2xl overflow-hidden shadow-2xl animate-scaleIn ${
              isMobile ? 'h-full max-w-full' : 'max-w-4xl'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 bg-red-500 hover:bg-red-600 p-3 rounded-full transition-all shadow-lg"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {/* Video Player */}
            <div className={`relative bg-black ${isMobile ? 'h-full' : 'aspect-video'}`}>
              {selectedVideo.type === 'instagram' ? (
                <iframe
                  src={selectedVideo.video}
                  className="w-full h-full"
                  frameBorder="0"
                  scrolling="no"
                  allowFullScreen
                  allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                />
              ) : (
                <>
                  <video
                    ref={videoRef}
                    src={selectedVideo.video}
                    className="w-full h-full object-contain"
                    controls={isMobile}
                    loop
                    playsInline
                    autoPlay
                    onClick={!isMobile ? togglePlayPause : undefined}
                  />
                  
                  {/* Play/Pause Overlay (Desktop only) */}
                  {!isMobile && !isPlaying && (
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/30"
                      onClick={togglePlayPause}
                    >
                      <div className="w-20 h-20 bg-amber-500/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                        <Play className="w-10 h-10 text-white ml-1" fill="white" />
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Video Info (Desktop only) */}
            {!isMobile && (
              <div className="p-6 bg-slate-900">
                <h3 className="text-white font-bold text-2xl mb-2">
                  {selectedVideo.title}
                </h3>
                <p className="text-slate-400 text-base">
                  {selectedVideo.description}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-progress {
          animation: progress 4s linear;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ProductVideoSection;