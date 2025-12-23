import React from "react";

const WhyChooseUs = () => {
  return (
    <section
      className="relative overflow-hidden py-12 px-4 md:px-6 bg-cover bg-center"
      style={{
        backgroundImage: "url('/why-choose-bg.jpg')",
      }}
    >
      {/* 🔹 Dark overlay for readability */}
      <div className="absolute inset-0 " />

      {/* 🔹 Decorative background effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 border border-blue-400/30 rounded-full" />
        <div className="absolute bottom-32 right-1/4 w-80 h-80 border border-amber-400/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* 🔹 Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-black mb-4">
            Why Choose Us?
          </h2>

          <p className="text-gray-700 text-sm md:text-base max-w-2xl mx-auto">
            We provide the most reliable and efficient platform for purchasing
            coins with unmatched service quality and customer satisfaction.
          </p>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </section>
  );
};

export default WhyChooseUs;
