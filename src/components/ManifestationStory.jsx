import { useState, useEffect, useRef } from "react";
import { Sparkles, Brain, Target, Zap, Repeat, Star } from "lucide-react";

export default function ManifestationStory() {
  const [visiblePoints, setVisiblePoints] = useState([]);
  const sectionRef = useRef(null);
  const pointsRef = useRef([]);

  const powerPoints = [
    {
      id: 1,
      icon: Zap,
      title: "Writing Amplifies Vibration",
      description:
        "When you write, you create a powerful energetic signature that sends your intentions directly into the quantum field.",
      color: "from-yellow-400 to-orange-500",
    },
    {
      id: 2,
      icon: Brain,
      title: "Enhanced Focus & Clarity",
      description:
        "Your brain engages differently when thoughts are written. Neural pathways strengthen, making manifestation tangible.",
      color: "from-purple-400 to-pink-500",
    },
    {
      id: 3,
      icon: Target,
      title: "Personal Manifestation Tool",
      description:
        "This pen becomes uniquely attuned to your energy. Every use deepens the connection to your desires.",
      color: "from-blue-400 to-cyan-500",
    },
    {
      id: 4,
      icon: Repeat,
      title: "Subconscious Reprogramming",
      description:
        "Each word rewrites limiting beliefs. Your subconscious mind begins to accept your dreams as reality.",
      color: "from-emerald-400 to-teal-500",
    },
    {
      id: 5,
      icon: Sparkles,
      title: "Thought-Action Alignment",
      description:
        "Writing creates coherence between your thoughts, emotions, and actions—the holy trinity of manifestation.",
      color: "from-pink-400 to-rose-500",
    },
    {
      id: 6,
      icon: Star,
      title: "Daily Dream Reminder",
      description:
        "Every time you hold the pen, you're reminded of your highest vision. Consistency compounds into miracles.",
      color: "from-indigo-400 to-purple-500",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      pointsRef.current.forEach((point, index) => {
        if (!point) return;
        const rect = point.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
          if (!visiblePoints.includes(index)) {
            setTimeout(() => {
              setVisiblePoints((prev) => [...prev, index]);
            }, index * 200);
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visiblePoints]);

  const renderPointCard = (point, index, compact = false, animated = true) => {
    const Icon = point.icon;
    const isVisible = visiblePoints.includes(index);

    return (
      <div
        key={point.id}
        ref={(el) => (pointsRef.current[index] = el)}
        className={`transform transition-all duration-700 ${
          animated
            ? isVisible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-20"
            : "opacity-100 translate-y-0"
        }`}
      >
        <div className="relative group h-full">
          <div
            className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl ${
              compact ? "p-6" : "p-8"
            } border border-white/20 hover:border-white/40 transition-all duration-300 h-full group-hover:scale-105`}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${point.color} opacity-0 group-hover:opacity-20 rounded-3xl blur-xl transition-opacity duration-300 -z-10`}
            />

            <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-slate-900">
              <span className="text-slate-900 font-black text-lg">
                {point.id}
              </span>
            </div>

            <div
              className={`${
                compact ? "w-16 h-16 mb-4" : "w-20 h-20 mb-6"
              } bg-gradient-to-br ${point.color} rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg`}
            >
              <Icon
                className={compact ? "w-8 h-8 text-white" : "w-10 h-10 text-white"}
                strokeWidth={2.5}
              />
            </div>

            <h3
              className={`${
                compact ? "text-xl" : "text-2xl"
              } font-black text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-yellow-300 group-hover:to-pink-300 transition-all duration-300`}
            >
              {point.title}
            </h3>

            <p
              className={`text-gray-300 ${
                compact ? "text-sm" : "text-base"
              } leading-relaxed`}
            >
              {point.description}
            </p>

            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Sparkles className="w-5 h-5 text-yellow-300" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-gradient-to-br from-[#020516] via-[#020A1E] to-[#02081B] shadow-[inset_0_0_120px_rgba(88,28,135,0.25)]
 py-24 overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Large glowing orbs */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-6">
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-sm font-bold tracking-[0.3em] uppercase">
              The Science Meets Spirit
            </span>
            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
          </div>

          <h2 className="text-2xl md:text-7xl font-black text-white mb-6 leading-tight">
            The Power Behind
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 mt-2">
              The Manifestation Pen
            </span>
          </h2>

          <p className="text-md text-gray-300 max-w-3xl mx-auto leading-relaxed">
            This isn't just a pen—it's a portal to your highest timeline. Here's
            why writing is the most powerful manifestation tool you'll ever use.
          </p>
        </div>

        {/* Power points: mobile carousel + desktop grid */}
        <div className="mb-16">
          {/* Mobile: horizontal carousel (no visibility gating) */}
          <div className="md:hidden -mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {powerPoints.map((point, index) => (
                <div
                  key={point.id}
                  className="min-w-[80%] max-w-xs snap-center"
                >
                  {renderPointCard(point, index, true, false)}
                </div>
              ))}
            </div>
          </div>

          {/* Desktop: grid with scroll animation */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
            {powerPoints.map((point, index) => (
              <div key={point.id}>{renderPointCard(point, index, false, true)}</div>
            ))}
          </div>
        </div>

        {/* Bottom insight box */}
        <div className="relative max-w-4xl mx-auto mt-20">
          <div className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-slate-900 rounded-3xl p-5 text-center">
              <div className="inline-flex w-20 h-20 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full items-center justify-center mb-6 shadow-2xl">
                <Sparkles className="w-10 h-10 text-white" />
              </div>

              <h3 className="text-2xl font-black text-white mb-6">
                Your Pen, Your Power
              </h3>

              <p className="text-md text-gray-300 text-left mb-8">
                When science validates what mystics have known for centuries,
                magic happens. The Manifestation Pen bridges the gap between
                ancient wisdom and modern neuroscience, giving you a tangible
                tool to transform your reality.
              </p>

              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                  <span className="text-yellow-300 font-bold">
                    ⚡ Quantum Field Activation
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                  <span className="text-pink-300 font-bold">
                    🧠 Neuroplasticity
                  </span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20">
                  <span className="text-purple-300 font-bold">
                    ✨ Energy Alignment
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
