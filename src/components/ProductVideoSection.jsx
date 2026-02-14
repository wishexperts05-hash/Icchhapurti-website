import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ChevronLeft, ChevronRight } from 'lucide-react';

const StoryVideoSection = () => {
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

      const sessionData = sessionStorage.getItem('unboxingVideos');
      if (sessionData) {
        setStoryVideos(JSON.parse(sessionData));
        setIsLoading(false);
        hasFetchedRef.current = true;
        return;
      }

      hasFetchedRef.current = true;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/ourStories?type=unboxing`);
      const data = await response.json();
      setStoryVideos(data.data);
      
      sessionStorage.setItem('unboxingVideos', JSON.stringify(data.data));
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
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
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

  const openVideo = (video) => {
    setSelectedVideo(video);
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
    const scrollAmount = isMobile ? 216 : 304;
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
      <div className="py-20 text-center bg-white">
        <div className="inline-block w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading unboxing videos...</p>
      </div>
    );
  }

  if (storyVideos.length === 0) {
    return null;
  }

  return (
    <>
      <div className="sm:py-5 bg-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
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
              className="flex gap-4 sm:gap-6 overflow-x-auto hide-scrollbar py-4 sm:py-6"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth'
              }}
            >
              {storyVideos.map((video, index) => (
                <div
                  key={video.id}
                  onClick={() => openVideo(video)}
                  className="flex-shrink-0 w-[200px] sm:w-[240px] md:w-[280px] cursor-pointer group"
                >
                  <div
                    className="relative aspect-[9/16] rounded-xl sm:rounded-2xl overflow-hidden bg-black shadow-2xl
                              transition-all duration-300 ease-out
                              md:hover:scale-105 md:hover:shadow-2xl md:hover:shadow-amber-500/50
                              md:hover:ring-2 md:hover:ring-amber-500/70"
                    data-video-id={video.id}
                  >
                    {/* Thumbnail Image */}
                    {video.thumbnailUrl && (
                      <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    
                    {/* Hidden video element for future use */}
                    {/* <video
                      ref={(el) => setVideoRef(el, video.id)}
                      src={visibleVideos.has(video.id) ? video.videoUrl : ''}
                      className="hidden"
                      muted
                      playsInline
                      preload="none"
                    /> */}

                    <div className="absolute inset-0 bg-black/20 md:group-hover:bg-black/40 
                                flex items-center justify-center transition-all duration-300">
                      <div
                        className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-500/90 md:group-hover:bg-amber-500 rounded-full 
                                  flex items-center justify-center shadow-lg
                                  md:group-hover:scale-110
                                  transition-all duration-300"
                      >
                        <Play className="text-white ml-1 w-5 h-5 sm:w-6 sm:h-6" fill="white" />
                      </div>
                    </div>

                    <div
                      className="absolute inset-0 opacity-0 md:group-hover:opacity-100 
                                transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)',
                        backgroundSize: '200% 200%',
                        animation: 'shine 1.5s infinite'
                      }}
                    ></div>

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
                  </div>
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
        `}</style>
      </div>

      <div className="">
        <img src="/shape.png" alt="" className="w-full block" loading="lazy" />
      </div>
    </>
  );
};

export default StoryVideoSection;