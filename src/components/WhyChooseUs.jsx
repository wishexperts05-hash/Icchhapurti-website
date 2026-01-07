import React, { useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const WhyChooseUs = () => {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted(!muted);
  };

  return (
    <section
      className="relative overflow-hidden py-12 px-4 md:px-6 bg-cover bg-center"
      style={{ backgroundImage: "url('/why-choose-bg.jpg')" }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 " />

      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 border border-blue-400/30 rounded-full" />
        <div className="absolute bottom-32 right-1/4 w-80 h-80 border border-amber-400/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-5xl text-center font-bold text-[#041049] mb-12">
          WHY WE ARE SPECIAL......
        </h2>

        {/* Content + Video */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">
          
          {/* Left Content */}
          <div className="w-full lg:w-3/5 text-left flex">
            <div className="text-base md:text-lg leading-relaxed space-y-4">
              <p className="font-bold text-[#a17b0a]">
                We Don't Sell a Pen. We Offer a Powerpack Tool To Unlock Your Dreams.
              </p>

              <p>
                <span className="font-bold text-[#a17b0a]">Icchhapurti</span> is a status symbol for your daily life.
                It's not just about writing, it's about rewriting your destiny.
              </p>

              <p>
                A normal pen can be bought from anywhere, but a tool made to change your life
                can only be found here Only.
              </p>

              <p>
                <span className="font-bold text-[#a17b0a]">Icchhapurti</span> products are heavily charged and activated
                with multiple processes and rituals like{" "}
                <span className="font-bold text-[#a17b0a]">
                  Mantras Jaaps, Mantras Chanting, Moon Charging
                </span>{" "}
                and many more rituals are performed to maximize your goal achievement to
                10x power & faster through manifestation.
              </p>

              <p>
                Through Icchhapurti, we encourage people to start their manifestation journey
                using their own{" "}
                <span className="font-bold text-[#a17b0a]">Icchhapurti Manifestation Pen.</span>
              </p>

              <p>
                That is why we say don't question it, just take it, write it and start the
                manifestation then see the magic happens……
              </p>

              <div className="mt-8 space-y-2">
                <p className="font-bold text-xl text-[#a17b0a]">Don't Just Dream It,</p>
                <p className="font-bold text-xl text-[#a17b0a]">“ Own It ”</p>
                <p className="font-bold text-xl text-[#a17b0a]">
                  “ Write It ” &nbsp; “ Manifest It ”
                </p>
              </div>
            </div>
          </div>

          {/* Right Video */}
          <div className="w-full lg:w-2/5 flex">
            <div className="relative w-full h-full rounded-xl overflow-hidden shadow-2xl">
              <video
                ref={videoRef}
                className="w-full h-[full] object-cover"
                autoPlay
                loop
                muted={muted}
                playsInline
              >
                <source src="/hero_video.mp4" type="video/mp4" />
              </video>

              {/* Mute / Unmute Button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-3 left-3 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
              >
                {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
