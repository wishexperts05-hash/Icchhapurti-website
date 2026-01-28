import { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react';

export default function ProductImageGallery({ images = [], videos = [] }) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMediaIndex, setModalMediaIndex] = useState(0);
  const swiperRef = useRef(null);

  // Combine images and videos into a single media array
  const allMedia = [
    ...images.map(img => ({ type: 'image', url: img })),
    ...videos.map(vid => ({ type: 'video', url: vid }))
  ];

  const productMedia = allMedia.length > 0 ? allMedia : [{ type: 'image', url: 'https://via.placeholder.com/400x400?text=No+Image' }];

  const handleThumbnailClick = (index) => {
    setSelectedMediaIndex(index);
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  const openModal = (index) => {
    setModalMediaIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextMedia = () => {
    setModalMediaIndex((prev) => (prev + 1) % productMedia.length);
  };

  const prevMedia = () => {
    setModalMediaIndex((prev) => (prev - 1 + productMedia.length) % productMedia.length);
  };

  const currentMedia = productMedia[selectedMediaIndex];
  const currentModalMedia = productMedia[modalMediaIndex];

  return (
    <>
      <div className="space-y-4">
        {/* Main Media Display */}
        <div className="bg-white rounded-2xl ">
          <div className="relative group">
            {currentMedia.type === 'image' ? (
              <img
                src={currentMedia.url}
                alt={`Product ${selectedMediaIndex + 1}`}
                className="w-full h-[450px] object-contain rounded-xl cursor-pointer transition-transform hover:scale-105"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                }}
              />
            ) : (
              <div className="relative w-full h-[450px] bg-black rounded-xl overflow-hidden">
                <video
                  src={currentMedia.url}
                  controls
                  className="w-full h-full object-contain"
                  controlsList="nodownload"
                />
                <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 pointer-events-none">
                  <Play size={12} />
                  VIDEO
                </div>
              </div>
            )}
            
            {/* Overlay hint for images */}
            {currentMedia.type === 'image' && (
              <div 
                onClick={() => openModal(selectedMediaIndex)} 
                className="absolute cursor-pointer inset-0 bg-black/0 group-hover:bg-black/10 transition-all rounded-xl flex items-center justify-center"
              >
                <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-4 py-2 rounded-lg text-sm font-medium">
                  Click to enlarge
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Thumbnail Preview */}
        {productMedia.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {productMedia.map((media, index) => (
              <div
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                  selectedMediaIndex === index
                    ? 'border-cyan-500 scale-105 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400 opacity-70 hover:opacity-100'
                }`}
              >
                {media.type === 'image' ? (
                  <img
                    src={media.url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-black flex items-center justify-center">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 to-red-800/80"></div>
                    <Play size={24} className="text-white relative z-10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Screen Modal */}
      {isModalOpen && (
        <div className="fixed h-[100vh] inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Media Counter */}
          <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {modalMediaIndex + 1} / {productMedia.length}
          </div>

          {/* Previous Button */}
          {productMedia.length > 1 && (
            <button
              onClick={prevMedia}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main Media Display in Modal */}
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            {currentModalMedia.type === 'image' ? (
              <img
                src={currentModalMedia.url}
                alt={`Full size ${modalMediaIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/800x800?text=No+Image';
                }}
              />
            ) : (
              <div className="relative w-full max-h-[85vh]">
                <video
                  src={currentModalMedia.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[85vh] object-contain rounded-lg mx-auto"
                  controlsList="nodownload"
                />
                <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 pointer-events-none">
                  <Play size={14} />
                  VIDEO
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          {productMedia.length > 1 && (
            <button
              onClick={nextMedia}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
              aria-label="Next media"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Thumbnail Strip at Bottom */}
          {productMedia.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2 scrollbar-hide bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              {productMedia.map((media, index) => (
                <div
                  key={index}
                  onClick={() => setModalMediaIndex(index)}
                  className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                    modalMediaIndex === index
                      ? 'border-cyan-400 scale-110'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  {media.type === 'image' ? (
                    <img
                      src={media.url}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                      <div className="absolute inset-0 bg-gradient-to-br from-red-600/80 to-red-800/80"></div>
                      <Play size={20} className="text-white relative z-10" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </>
  );
}