import React, { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

const StoryBanner = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [visibleVideos, setVisibleVideos] = useState(new Set());

  const videoRef = useRef(null);
  const sliderRef = useRef(null);
  const hasFetchedRef = useRef(false);
  const observerRef = useRef(null);
  const videoRefsMap = useRef(new Map());

  const [storyVideos, setStoryVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStorys = async () => {
    if (hasFetchedRef.current) return;

    try {
      if (storyVideos.length > 0) {
        setIsLoading(false);
        return;
      }

      const sessionData = sessionStorage.getItem('storyVideos');
      if (sessionData) {
        setStoryVideos(JSON.parse(sessionData));
        setIsLoading(false);
        hasFetchedRef.current = true;
        return;
      }

      hasFetchedRef.current = true;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/ourStories?type=story`);
      const data = await response.json();
      setStoryVideos(data.data);

      sessionStorage.setItem('storyVideos', JSON.stringify(data.data));
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching stories:', error);
      setIsLoading(false);
      hasFetchedRef.current = false;
    }
  };

  // Intersection Observer for lazy loading
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const videoId = entry.target.getAttribute('data-video-id');
          if (entry.isIntersecting) {
            setVisibleVideos(prev => new Set([...prev, videoId]));
          } else {
            // Pause and unload video when out of view
            const videoElement = videoRefsMap.current.get(videoId);
            if (videoElement) {
              videoElement.pause();
              videoElement.src = '';
              videoElement.load();
            }
            setVisibleVideos(prev => {
              const newSet = new Set(prev);
              newSet.delete(videoId);
              return newSet;
            });
          }
        });
      },
      {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    fetchStorys();
  }, []);

  // Cleanup all videos on unmount
  useEffect(() => {
    return () => {
      // Pause and clear all video elements
      videoRefsMap.current.forEach((videoElement) => {
        if (videoElement) {
          videoElement.pause();
          videoElement.src = '';
          videoElement.load();
        }
      });
      videoRefsMap.current.clear();
    };
  }, []);

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
      videoRef.current.src = '';
      videoRef.current.load();
    }
    setIsModalOpen(false);
    setTimeout(() => setSelectedVideo(null), 300);
  };

  const handleScroll = (direction) => {
    if (!sliderRef.current) return;
    const scrollAmount = isMobile ? 156 : 284;
    sliderRef.current.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  const setVideoRef = (element, videoId) => {
    if (element) {
      videoRefsMap.current.set(videoId, element);
      if (observerRef.current) {
        observerRef.current.observe(element.parentElement);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-block w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading stories...</p>
      </div>
    );
  }

  if (storyVideos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="pt-5 px-4 mt-3 relative bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <h1
            className="text-4xl md:text-4xl font-extrabold text-center mb-1 animate-fade-in bg-clip-text text-transparent"
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

          <div className="relative px-12">
            <button
              onClick={() => handleScroll('prev')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 
                         bg-white hover:bg-gray-100 
                         p-2 rounded-full shadow-lg hover:shadow-xl 
                         transition-all border border-gray-200"
              aria-label="Previous videos"
            >
              <ChevronLeft className="w-5 h-5 text-gray-700" />
            </button>

            <button
              onClick={() => handleScroll('next')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 
                         bg-white hover:bg-gray-100 
                         p-2 rounded-full shadow-lg hover:shadow-xl 
                         transition-all border border-gray-200"
              aria-label="Next videos"
            >
              <ChevronRight className="w-5 h-5 text-gray-700" />
            </button>

            <div
              ref={sliderRef}
              className="flex gap-6 overflow-x-auto hide-scrollbar py-4"
              style={{ scrollBehavior: 'smooth' }}
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
                              md:hover:scale-105 md:hover:shadow-2xl md:hover:shadow-purple-500/50
                              md:hover:ring-2 md:hover:ring-purple-500/70"
                    data-video-id={story.id}
                  >
                    {story.type === "instagram" ? (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
                        <div className="text-white text-center">
                          <svg className="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                          <p className="text-xs">Instagram Story</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Thumbnail Image */}
                        {story.thumbnailUrl && (
                          <img
                            src={story.thumbnailUrl}
                            alt={story.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        )}
                        
                        {/* Hidden video element for future use */}
                        {/* <video
                          ref={(el) => setVideoRef(el, story.id)}
                          src={visibleVideos.has(story.id) ? story.videoUrl : ''}
                          className="hidden"
                          muted
                          playsInline
                          preload="none"
                        /> */}
                      </>
                    )}

                    <div className="absolute inset-0 bg-black/0 md:group-hover:bg-black/30 
                                transition-all duration-300 flex items-center justify-center">
                      <div
                        className="w-12 h-12 rounded-full bg-white/90 md:group-hover:bg-white 
                                  flex items-center justify-center transform md:group-hover:scale-110 
                                  transition-all duration-300 shadow-lg"
                      >
                        <svg className="w-6 h-6 text-purple-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>

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

                  <p className="text-gray-800 text-xs mt-2 text-center font-medium truncate px-1">
                    {story.title}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

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

          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }

          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>

      <div className="">
        <img src="/shape.png" alt="" className="w-full block" loading="lazy" />
      </div>
    </>
  );
};

export default StoryBanner;