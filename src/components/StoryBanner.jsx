import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const StoryBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const videoRef = useRef(null);
  const sliderRef = useRef(null);

  /* ------------------ VIDEO DATA ------------------ */
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
      title: "Daily Affirmation Writing",
      description: "Turn positive thoughts into written reality",
      type: "video"
    },
    {
      id: 4,
      video: "/story4.mov",
      title: "Manifestation Pen in Daily Routine",
      description: "Create focus, clarity, and abundance every day",
      type: "video"
    },
    {
      id: 5,
      video: "/story5.mov",
      title: "Manifestation Pen in Daily Routine",
      description: "Create focus, clarity, and abundance every day",
      type: "video"
    },
    {
      id: 6,
      video: "/story6.mp4",
      title: "Manifestation Pen in Daily Routine",
      description: "Create focus, clarity, and abundance every day",
      type: "video"
    },
    {
      id: 7,
      video: "/story6.mp4",
      title: "Manifestation Pen in Daily Routine",
      description: "Create focus, clarity, and abundance every day",
      type: "video"
    },

  ];

  /* ------------------ MOBILE CHECK ------------------ */
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ------------------ AUTO SLIDE ------------------ */
  useEffect(() => {
    const timer = setInterval(
      () => setCurrentSlide((p) => (p + 1) % productVideos.length),
      4000
    );
    return () => clearInterval(timer);
  }, [productVideos.length]);

  /* ------------------ AUTO SCROLL ------------------ */
  useEffect(() => {
    if (!sliderRef.current) return;
    const cardWidth = isMobile ? 140 : 180;
    const gap = 24;

    sliderRef.current.scrollTo({
      left: currentSlide * (cardWidth + gap),
      behavior: "smooth"
    });
  }, [currentSlide, isMobile]);

  /* ------------------ HANDLERS ------------------ */
  const handleVideoClick = (video) => {
    if (video.type === "instagram" && isMobile) {
      window.open(video.video.replace("/embed", ""), "_blank");
      return;
    }
    setSelectedVideo(video);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    videoRef.current?.pause();
    setTimeout(() => setSelectedVideo(null), 300);
  };

  /* ------------------ RENDER ------------------ */
  return (
    <>
    
    <div className="pt-5 px-4 mt-20 relative bg-white overflow-hidden ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-black text-center mb-4">
          Our Stories
        </h2>
        <p className="text-slate-400 text-center mb-12">
          Watch our latest updates and highlights
        </p>

        {/* Slider */}
        <div className="relative">
          <button
            onClick={() =>
              setCurrentSlide(
                (p) => (p - 1 + productVideos.length) % productVideos.length
              )
            }
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 p-3 rounded-full transition-all hover:scale-110"
          >
            <ChevronLeft className="text-white" />
          </button>

          <button
            onClick={() =>
              setCurrentSlide((p) => (p + 1) % productVideos.length)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 p-3 rounded-full transition-all hover:scale-110"
          >
            <ChevronRight className="text-white" />
          </button>

          <div
            ref={sliderRef}
            className="flex gap-6 overflow-x-auto hide-scrollbar-desktop px-4 py-4"
          >
            {productVideos.map((story, index) => (
              <div
                key={`${story.id}-${index}`}
                className="w-32 md:w-40 flex-shrink-0 cursor-pointer group"
                onClick={() => handleVideoClick(story)}
              >
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black 
                              transition-all duration-300 ease-out
                              md:hover:scale-110 md:hover:-translate-y-2
                              md:hover:shadow-2xl md:hover:shadow-purple-500/50
                              md:hover:ring-2 md:hover:ring-purple-500/70
                              md:hover:z-10">
                  {story.type === "instagram" ? (
                    <iframe
                      src={story.video}
                      className="w-full h-full pointer-events-none"
                      allow="autoplay; encrypted-media"
                    />
                  ) : (
                    <video
                      src={story.video}
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
                    <div className="w-12 h-12 rounded-full bg-white/0 md:group-hover:bg-white/90 
                                  flex items-center justify-center transform scale-0 md:group-hover:scale-100 
                                  transition-all duration-300">
                      <svg
                        className="w-6 h-6 text-purple-600 ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Shine effect on hover */}
                  <div className="absolute inset-0 opacity-0 md:group-hover:opacity-100 
                                transition-opacity duration-500 pointer-events-none"
                    style={{
                      background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                      backgroundSize: '200% 200%',
                      animation: 'shine 1.5s infinite'
                    }}>
                  </div>
                </div>

                {/* Title appears on hover */}
                <p className="text-white text-xs mt-2 text-center opacity-0 md:group-hover:opacity-100 
                            transition-opacity duration-300 font-medium truncate px-1">
                  {story.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

    

      {/* MODAL */}
      {isModalOpen && selectedVideo && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-500 hover:bg-red-600 p-2 rounded-full z-10 transition-all hover:scale-110"
            >
              <X className="text-white" />
            </button>

            <div className="aspect-video bg-black">
              {selectedVideo.type === "instagram" ? (
                <iframe
                  src={selectedVideo.video}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={videoRef}
                  src={selectedVideo.video}
                  className="w-full h-full"
                  controls
                  autoPlay
                />
              )}
            </div>

            <div className="p-4 bg-slate-900">
              <h3 className="text-white font-semibold text-lg">
                {selectedVideo.title}
              </h3>
              <p className="text-slate-400 text-sm">
                {selectedVideo.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes shine {
          0% { background-position: 200% 200%; }
          100% { background-position: -200% -200%; }
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
        <img
          src="/shape.png"
          alt=""
          className="w-full block"
        />
      </div>
      </>
  );
};

export default StoryBanner;