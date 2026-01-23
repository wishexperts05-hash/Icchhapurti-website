const AnnouncementMarquee = () => {
  return (
    <div className="w-full  overflow-hidden bg-black py-3">
      <div className="flex items-center gap-16 whitespace-nowrap animate-marquee">

        {/* Item 1 */}
        <div className="flex items-center gap-4">
          <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-400 text-[#5a3a0a]">
            FREE SHIPPING
          </span>
          <span className="text-white font-semibold">
            Free Shipping on Orders Above ₹2500
          </span>
        </div>

        {/* Item 2 */}
        {/* <div className="flex items-center gap-4">
          <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-400 text-[#5a3a0a]">
            FLAT 10% OFF
          </span>
          <span className="text-white font-semibold">
            Elegant Metal Roller Manifestation Pen + Seven Chakra Premium Manifestation Pen and get flat 10% off
          </span>
        </div> */}

        {/* Item 3 */}
        {/* <div className="flex items-center gap-4">
          <span className="px-4 py-1 text-xs font-bold rounded-full bg-yellow-400 text-[#5a3a0a]">
            EXCLUSIVE
          </span>
          <span className="text-white font-semibold">
            Limited Time Exclusive Offers
          </span>
        </div> */}

      </div>
    </div>
  );
};

export default AnnouncementMarquee;
