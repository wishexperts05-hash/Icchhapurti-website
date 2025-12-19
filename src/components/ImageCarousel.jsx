import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ImageCarousel = ({ 
  images = [], 
  autoPlay = true, 
  autoPlayInterval = 3000,
  showControls = true,
  className = ""
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isHovering, setIsHovering] = useState(false);

  const defaultImages = [
    '/slider1.jpg',
    '/slider2.jpeg',
    '/slider3.jpeg',
    '/slider4.jpeg',
    '/slider5.png',
  ];

  const displayImages = images.length ? images : defaultImages;

  // Auto Play
  useEffect(() => {
    if (!isPlaying || isHovering) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayImages.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [isPlaying, isHovering, currentIndex]);

  const goToPrevious = () =>
    setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));

  const goToNext = () =>
    setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));

  const goToSlide = (index) => setCurrentIndex(index);



const [crousal, setCrousal] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");


const fetchCrousal = async () => {
  try {
    setLoading(true);
    setError("");

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/crousal`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch carousel data");
    }

    setCrousal(data.data || []);
  } catch (err) {
    console.error("Fetch carousel error:", err);
    setError(err.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};


  return (
    <div 
      className={`relative w-full mx-auto overflow-hidden  shadow-lg ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >

      {/* Dots Indicator (TOP CENTER) */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex gap-2 backdrop-blur-md bg-black/30 px-3 py-1 ">
        {displayImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToSlide(idx)}
            className={`transition-all rounded-full ${
              idx === currentIndex
                ? "w-3 h-3 bg-blue-500 scale-125 shadow"
                : "w-2 h-2 bg-gray-300 opacity-70"
            }`}
          />
        ))}
      </div>

      {/* Slide Wrapper */}
      <div className="relative   ">
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {displayImages.map((img, i) => (
            <img
              key={i}
              src={img}
              className="w-full h-full object-cover flex-shrink-0"
              alt={`Slide ${i}`}
            />
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {/* {showControls && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow hover:scale-110 transition z-20"
          >
            <ChevronLeft />
          </button>

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow hover:scale-110 transition z-20"
          >
            <ChevronRight />
          </button>
        </>
      )} */}
    </div>
  );
};

export default ImageCarousel;
