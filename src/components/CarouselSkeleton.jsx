const CarouselSkeleton = ({ isMobile }) => {
  return (
    <div
      className="relative w-full overflow-hidden bg-gray-200 animate-pulse"
      style={{ aspectRatio: isMobile ? "1/1" : "2363/1000" }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-shimmer" />
    </div>
  );
};

export default CarouselSkeleton;
