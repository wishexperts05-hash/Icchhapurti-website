const AnnouncementMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-black py-3">
      <div className="flex whitespace-nowrap animate-marquee">

        {/* First copy */}
        <div className="flex items-center gap-16 flex-shrink-0 w-full justify-center">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-400 text-[#5a3a0a]">
              FREE SHIPPING
            </span>
            <span className="text-white font-semibold">
              Free Shipping on Orders Above ₹2500
            </span>
          </div>
        </div>

        {/* Second copy - for seamless loop */}
        <div className="flex items-center gap-16 flex-shrink-0 w-full justify-center">
          <div className="flex items-center gap-4">
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-400 text-[#5a3a0a]">
              FREE SHIPPING
            </span>
            <span className="text-white font-semibold">
              Free Shipping on Orders Above ₹2500
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnnouncementMarquee;