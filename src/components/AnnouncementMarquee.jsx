const AnnouncementMarquee = () => {
  return (
    <div className="w-full overflow-hidden bg-black py-3">
      <div className="flex whitespace-nowrap animate-marquee">

        {/* First set of 3 announcements */}
        <div className="flex items-center flex-shrink-0">
          <div className="flex items-center gap-4 px-8 md:px-16">
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-400 text-[#5a3a0a]">
              FREE SHIPPING
            </span>
            <span className="text-white font-semibold">
              Free Shipping on Orders Above ₹2500
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 px-8 md:px-16">
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-400 text-[#5a3a0a]">
              FREE SHIPPING
            </span>
            <span className="text-white font-semibold">
              Free Shipping on Orders Above ₹2500
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 px-8 md:px-16">
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-400 text-[#5a3a0a]">
              FREE SHIPPING
            </span>
            <span className="text-white font-semibold">
              Free Shipping on Orders Above ₹2500
            </span>
          </div>
        </div>

        {/* Second set of 3 announcements - for seamless loop */}
        <div className="flex items-center flex-shrink-0">
          <div className="flex items-center gap-4 px-8 md:px-16">
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-400 text-[#5a3a0a]">
              FREE SHIPPING
            </span>
            <span className="text-white font-semibold">
              Free Shipping on Orders Above ₹2500
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 px-8 md:px-16">
            <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-400 text-[#5a3a0a]">
              FREE SHIPPING
            </span>
            <span className="text-white font-semibold">
              Free Shipping on Orders Above ₹2500
            </span>
          </div>
          
          <div className="hidden md:flex items-center gap-4 px-8 md:px-16">
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