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
      video: "https://www.instagram.com/reel/DRuhFMykktO/embed",
      title: "Manifestation Pen Unboxing",
      description: "Unlock intention-powered writing from the first touch",
      type: "instagram"
    },
    {
      id: 2,
      video: "https://www.instagram.com/reel/DRuhFMykktO/embed",
      title: "How the Manifestation Pen Works",
      description: "Align your thoughts, goals, and daily intentions",
      type: "instagram"
    },
    {
      id: 3,
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
      title: "Daily Affirmation Writing",
      description: "Turn positive thoughts into written reality",
      type: "video"
    },
    {
      id: 4,
      video: "https://www.w3schools.com/html/movie.mp4",
      title: "Manifestation Pen in Daily Routine",
      description: "Create focus, clarity, and abundance every day",
      type: "video"
    },
    {
      id: 5,
      video: "https://www.w3schools.com/html/movie.mp4",
      title: "Manifestation Pen in Daily Routine",
      description: "Create focus, clarity, and abundance every day",
      type: "video"
    },
    {
      id: 6,
      video: "https://www.w3schools.com/html/movie.mp4",
      title: "Manifestation Pen in Daily Routine",
      description: "Create focus, clarity, and abundance every day",
      type: "video"
    },
    {
      id: 7,
      video: "https://www.w3schools.com/html/movie.mp4",
      title: "Manifestation Pen in Daily Routine",
      description: "Create focus, clarity, and abundance every day",
      type: "video"
    }
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
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-16 px-4 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-white text-center mb-4">
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
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-3 rounded-full"
          >
            <ChevronLeft className="text-white" />
          </button>

          <button
            onClick={() =>
              setCurrentSlide((p) => (p + 1) % productVideos.length)
            }
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/70 p-3 rounded-full"
          >
            <ChevronRight className="text-white" />
          </button>

         <div
  ref={sliderRef}
  className="flex gap-6 overflow-x-auto hide-scrollbar-desktop px-4"
>

            {productVideos.map((story) => (
              <div
                key={story.id}
                className="w-32 md:w-40 flex-shrink-0 cursor-pointer"
                onClick={() => handleVideoClick(story)}
              >
                <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black">
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
                </div>
              </div>
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
            className="relative w-full max-w-4xl bg-black rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-500 p-2 rounded-full z-10"
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
    </div>
  );
};

export default StoryBanner;
