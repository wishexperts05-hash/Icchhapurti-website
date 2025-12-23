

const WhyChooseUs = () => {
 

  return (
    <div
      className="relative overflow-hidden py-10 px-6 text-black bg-cover bg-center"
      style={{
        backgroundImage: "url('/why-choose-bg.jpg')",
      }}
    >
      {/* 🔹 Dark overlay for readability */}
      <div className="absolute inset-0 " />

      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 border border-blue-400/30 rounded-full" />
        <div className="absolute bottom-32 right-1/4 w-80 h-80 border border-amber-400/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Stars */}
      {/* <div className="absolute inset-0 pointer-events-none">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1  rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`,
            }}
          />
        ))}
      </div> */}

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Why Choose Us?
          </h2>
          <p className="text-gray-600 text-md max-w-2xl mx-auto">
            We provide the most reliable and efficient platform for purchasing Coins with unmatched service quality and customer satisfaction.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default WhyChooseUs;
