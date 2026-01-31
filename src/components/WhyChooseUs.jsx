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


        <h1
          className="text-4xl md:text-4xl  font-extrabold text-center mb-10 animate-fade-in bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(120deg, #0a2540 0%, #0a2540 15%, #0a2540 30%, #0a2540 45%, #1e6091 60%, #0d3b66 75%, #0a2540 100%)",
            backgroundSize: "200% 200%",
            animation: "goldShine 3s linear infinite",
          }}
        >
          Why We Are Special
        </h1>
        {/* Content + Video */}
        <div className="flex flex-col md:mt-10 lg:flex-row gap-8 items-start">

          {/* Left Content */}
          <div className="w-full lg:w-5/7 md:mt-13 text-left">

            <div className="text-base md:text-md leading-relaxed space-y-4">

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
                  Mantras Jaaps, Herbs and Minerals Smudging ,Mantras Chanting, Moon Charging
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

              <div className="md:mt-20 space-y-2 text-center">
                <p className="font-bold text-xl text-[#a17b0a]">Don't Just Dream It,</p>
                <p className="font-bold text-xl text-[#a17b0a]">" Own It "</p>
                <p className="font-bold text-xl text-[#a17b0a]">
                  " Write It " &nbsp; " Manifest It "
                </p>
              </div>
            </div>
          </div>

          {/* Right Video */}
          <div className="w-full lg:w-2/7 flex justify-center lg:sticky lg:top-4">
            <div className="relative w-full h-[600px] rounded-2xl overflow-hidden">

              {/* Video */}
              <video
                ref={videoRef}
                className="w-full h-auto object-cover"
                autoPlay
                loop
                muted={muted}
                playsInline
              >
                <source src="/hero_video.mp4" type="video/mp4" />
              </video>

              {/* Mute Button */}
              <button
                onClick={toggleMute}
                className="absolute bottom-4 left-4 bg-black/60 text-white p-2 rounded-full hover:bg-black/80 transition"
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
