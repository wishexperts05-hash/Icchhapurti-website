import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const StoryBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef(null);
  const sliderRef = useRef(null);

  const [storyVideos, setStoryVideos] = useState([]);

  const fetchStorys = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/ourStories?type=story`);
      const data = await response.json();
      setStoryVideos(data.data);
    } catch (error) {
      console.error('Error fetching stories:', error);
    }
  };

  /* ------------------ MOBILE CHECK ------------------ */
  useEffect(() => {
    fetchStorys();
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ------------------ AUTO SLIDE ------------------ */
  useEffect(() => {
    if (storyVideos.length === 0) return;
    
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % storyVideos.length),
      4000
    );
    return () => clearInterval(timer);
  }, [storyVideos.length]);

  /* ------------------ AUTO SCROLL ------------------ */
  useEffect(() => {
    if (!sliderRef.current || storyVideos.length === 0) return;
    
    const cardWidth = isMobile ? 140 : 180;
    const gap = 24;

    sliderRef.current.scrollTo({
      left: currentSlide * (cardWidth + gap),
      behavior: "smooth"
    });
  }, [currentSlide, isMobile, storyVideos.length]);

  /* ------------------ HANDLERS ------------------ */
  const handleVideoClick = (story) => {
    if (story.type === "instagram" && isMobile) {
      window.open(story.videoUrl.replace("/embed", ""), "_blank");
      return;
    }
    setSelectedVideo(story);
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
    setCurrentSlide((p) => (p - 1 + storyVideos.length) % storyVideos.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentSlide((p) => (p + 1) % storyVideos.length);
  };

  if (storyVideos.length === 0) {
    return <div className="py-10 text-center">Loading stories...</div>;
  }

  /* ------------------ RENDER ------------------ */
  return (
    <>
      <div className="pt-5 px-4 mt-20 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-4xl md:text-6xl font-extrabold text-center mb-1 animate-fade-in bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #0a2540 0%, #0a2540 15%, #0a2540 30%, #0a2540 45%, #1e6091 60%, #0d3b66 75%, #0a2540 100%)",
              backgroundSize: "200% 200%",
              animation: "goldShine 3s linear infinite",
            }}
          >
            Our Stories
          </h1>
          <p className="text-[#a17b0a] text-xl text-center mb-10">
            Watch our latest updates and highlights
          </p>

          {/* Slider */}
          <div className="relative">
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 
                         bg-white/40 hover:bg-white/60 
                         p-1.5 rounded-full shadow-md hover:shadow-lg 
                         transition-all"
              aria-label="Previous video"
            >
              <ChevronLeft className="w-4 h-4 text-gray-700" />
            </button>

            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 
                         bg-white/40 hover:bg-white/60 
                         p-1.5 rounded-full shadow-md hover:shadow-lg 
                         transition-all"
              aria-label="Next video"
            >
              <ChevronRight className="w-4 h-4 text-gray-700" />
            </button>

            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto hide-scrollbar-desktop px-4 py-4"
            >
              {storyVideos.map((story, index) => (
                <div
                  key={`${story.id}-${index}`}
                  className="w-32 md:w-60 flex-shrink-0 cursor-pointer group"
                  onClick={() => handleVideoClick(story)}
                >
                  <div
                    className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black 
                              transition-all duration-300 ease-out
                              md:hover:scale-110 md:hover:-translate-y-2
                              md:hover:shadow-2xl md:hover:shadow-purple-500/50
                              md:hover:ring-2 md:hover:ring-purple-500/70
                              md:hover:z-10"
                  >
                    {story.type === "instagram" ? (
                      <iframe
                        src={story.videoUrl}
                        className="w-full h-full pointer-events-none"
                        allow="autoplay; encrypted-media"
                      />
                    ) : (
                      <video
                        src={story.videoUrl}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    )}

                    {/* Hover overlay with play icon */}
                    <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/30 
                                transition-all duration-300 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full bg-white/0 md:group-hover:bg-white/90 
                                  flex items-center justify-center transform scale-0 md:group-hover:scale-100 
                                  transition-all duration-300"
                      >
                        <svg className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

                    {/* Shine effect on hover */}
                    <div
                      className="absolute inset-0 opacity-0 md:group-hover:opacity-100 
                                transition-opacity duration-500 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'shine 1.5s infinite'
                      }}
                    ></div>
                  </div>

                  {/* Title appears on hover */}
                  <p
                    className="text-white text-xs mt-2 text-center opacity-0 md:group-hover:opacity-100 
                            transition-opacity duration-300 font-medium truncate px-1"
                  >
                    {story.title}
                  </p>
                </div>
              ))}
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center gap-1.5 mt-4">
              {storyVideos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide
                      ? 'w-6 bg-purple-500 shadow-md'
                      : 'w-1.5 bg-slate-600 hover:bg-slate-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* MODAL */}
        {isModalOpen && selectedVideo && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={closeModal}
          >
            <div
              className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl"
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

          .hide-scrollbar-desktop::-webkit-scrollbar {
            display: none;
          }

          .hide-scrollbar-desktop {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      <div className="">
        <img src="/shape.png" alt="" className="w-full block" />
      </div>
    </>
  );
};

export default StoryBanner;