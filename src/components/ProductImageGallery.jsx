import { useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ProductImageGallery({ images = [] }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const swiperRef = useRef(null);

  const productImages = images.length > 0 ? images : ['https://via.placeholder.com/400x400?text=No+Image'];

  const handleThumbnailClick = (index) => {
    setSelectedImageIndex(index);
    // If using Swiper, you can slide to the specific index
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
    }
  };

  const openModal = (index) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextImage = () => {
    setModalImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setModalImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  return (
    <>
      <div className="space-y-4">
        {/* Main Image Display */}
        <div className="bg-white rounded-2xl p-6 shadow-xl">
          <div className="relative group">
            <img
              src={productImages[selectedImageIndex]}
              alt={`Product ${selectedImageIndex + 1}`}
              className="w-full h-[400px] object-contain  rounded-xl cursor-pointer transition-transform hover:scale-105"
             
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
              }}
            />
            {/* Overlay hint */}
            <div  onClick={() => openModal(selectedImageIndex)} className="absolute cursor-pointer inset-0 bg-black/0 group-hover:bg-black/10 transition-all rounded-xl flex items-center justify-center">
              <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-4 py-2 rounded-lg text-sm font-medium">
                Click to enlarge
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail Preview */}
        {productImages.length > 1 && (
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {productImages.map((img, index) => (
              <div
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                  selectedImageIndex === index
                    ? 'border-cyan-500 scale-105 shadow-lg'
                    : 'border-gray-300 hover:border-gray-400 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/80x80?text=No+Image';
                  }}
                />
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

          {/* Image Counter */}
          <div className="absolute top-4 left-4 z-10 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            {modalImageIndex + 1} / {productImages.length}
          </div>

          {/* Previous Button */}
          {productImages.length > 1 && (
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Main Image */}
          <div className="relative max-w-6xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <img
              src={productImages[modalImageIndex]}
              alt={`Full size ${modalImageIndex + 1}`}
              className="max-w-full max-h-full object-contain rounded-lg"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x800?text=No+Image';
              }}
            />
          </div>

          {/* Next Button */}
          {productImages.length > 1 && (
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Thumbnail Strip at Bottom */}
          {productImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 max-w-[90vw] overflow-x-auto pb-2 scrollbar-hide bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  onClick={() => setModalImageIndex(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden cursor-pointer transition-all border-2 ${
                    modalImageIndex === index
                      ? 'border-cyan-400 scale-110'
                      : 'border-white/30 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
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