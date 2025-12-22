import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductVideoSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef(null);
  const sliderRef = useRef(null);

  const productVideos = [
    {
      id: 1,
      thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      title: "Manifestation Pen Unboxing",
      description: "Unlock intention-powered writing from the first touch",
      type: "video"
    },
    {
      id: 2,
      thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      video: "https://www.w3schools.com/html/movie.mp4",
      title: "How the Manifestation Pen Works",
      description: "Align your thoughts, goals, and daily intentions",
      type: "video"
    },
    {
      id: 5,
      thumbnail: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800",
      video: "https://www.w3schools.com/html/movie.mp4",
      title: "How the Manifestation Pen Works",
      description: "Align your thoughts, goals, and daily intentions",
      type: "video"
    },
    {
      id: 3,
      thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      title: "Daily Affirmation Writing",
      description: "Turn thoughts into written reality",
      type: "video"
    },
    {
      id: 4,
      thumbnail: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800",
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      title: "Daily Affirmation Writing",
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
      const cardWidth = isMobile ? 240 : 280;
      sliderRef.current.scrollTo({
        left: currentSlide * (cardWidth + 24),
        behavior: 'smooth',
      });
    }
  }, [currentSlide, isMobile]);

  const openVideo = (video) => {
    setSelectedVideo(video);
    setIsModalOpen(true);
    setIsPlaying(true);
    setTimeout(() => videoRef.current?.play(), 150);
  };

  const closeModal = () => {
    videoRef.current?.pause();
    setIsModalOpen(false);
    setIsPlaying(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3">
            Product Reels
          </h2>
          <p className="text-slate-300">
            Experience the Manifestation Pen in short, powerful reels
          </p>
        </div>

        {/* Slider */}
        <div className="relative">
          <button
            onClick={() =>
              setCurrentSlide((p) =>
                p === 0 ? productVideos.length - 1 : p - 1
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 p-3 rounded-full"
          >
            <ChevronLeft className="text-white" />
          </button>

          <button
            onClick={() =>
              setCurrentSlide((p) => (p + 1) % productVideos.length)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-black/70 p-3 rounded-full"
          >
            <ChevronRight className="text-white" />
          </button>

        <div
  ref={sliderRef}
  className="flex gap-6 overflow-x-auto hide-scrollbar-desktop px-8 py-6"
>

            {productVideos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => openVideo(video)}
                className={`flex-shrink-0 w-[240px] md:w-[280px] transition-all cursor-pointer ${
                  index === currentSlide ? 'scale-105' : 'scale-95 opacity-60'
                }`}
              >
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black shadow-2xl">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center">
                      <Play className="text-white ml-1" fill="white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                    <h3 className="text-white font-semibold text-sm">
                      {video.title}
                    </h3>
                    <p className="text-slate-300 text-xs line-clamp-2">
                      {video.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reel Modal */}
      {isModalOpen && selectedVideo && (
        <div
          className="fixed  inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-[420px] aspect-9/15 bg-black rounded-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 z-50 bg-red-500 p-2 rounded-full"
            >
              <X className="text-white w-5 h-5" />
            </button>

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
    </div>
  );
};

export default ProductVideoSection;
