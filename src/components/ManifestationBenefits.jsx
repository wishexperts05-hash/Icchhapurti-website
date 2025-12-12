import { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Target,
  TrendingUp,
  BookOpen,
  Brain,
  Zap,
  PenTool,
} from "lucide-react";

export default function ManifestationBenefits() {
  const [visibleCards, setVisibleCards] = useState([]);
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  const benefits = [
    {
      id: 1,
      icon: Target,
      title: "Focuses Your Intention",
      description:
        "Channel your energy and direct your thoughts toward manifesting your deepest desires with laser-sharp precision.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      icon: TrendingUp,
      title: "Stay Committed to Goals",
      description:
        "Transform fleeting wishes into unwavering commitment. Your goals become non-negotiable daily practice.",
      gradient: "from-blue-500 to-purple-500",
    },
    {
      id: 3,
      icon: PenTool,
      title: "Smooth Positive Journaling",
      description:
        "Experience effortless flow as your thoughts glide onto paper, creating a sacred space for positivity.",
      gradient: "from-pink-500 to-rose-500",
    },
    {
      id: 4,
      icon: Brain,
      title: "Scientifically Aligned",
      description:
        "Backed by neuroscience and psychology principles that activate your subconscious mind for powerful results.",
      gradient: "from-indigo-500 to-blue-500",
    },
    {
      id: 5,
      icon: Zap,
      title: "Increases Clarity & Motivation",
      description:
        "Cut through mental fog and ignite unstoppable motivation that propels you toward your dreams.",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      id: 6,
      icon: Sparkles,
      title: "Build Daily Spiritual Habits",
      description:
        "Establish a transformative morning ritual that connects you to your higher self and the universe.",
      gradient: "from-teal-500 to-emerald-500",
    },
    {
      id: 7,
      icon: BookOpen,
      title: "Multi-Purpose Tool",
      description:
        "Perfect for scripting your future, writing affirmations, goal journaling, and gratitude practices.",
      gradient: "from-violet-500 to-purple-500",
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      cardsRef.current.forEach((card, index) => {
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (cardRect.top < windowHeight * 0.8 && cardRect.bottom > 0) {
          setVisibleCards((prev) =>
            prev.includes(index) ? prev : [...prev, index]
          );
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-24 overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Sparkle decorations */}
      <div className="absolute top-10 left-20 text-yellow-300 animate-pulse">
        <Sparkles className="w-8 h-8" />
      </div>
      <div
        className="absolute top-40 right-32 text-pink-300 animate-pulse"
        style={{ animationDelay: "0.5s" }}
      >
        <Sparkles className="w-6 h-6" />
      </div>
      <div
        className="absolute bottom-32 left-40 text-purple-300 animate-pulse"
        style={{ animationDelay: "1s" }}
      >
        <Sparkles className="w-7 h-7" />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-sm font-bold tracking-[0.3em] uppercase">
              Transform Your Life
            </span>
          </div>

          <h2 className="text-3xl md:text-7xl font-black text-white mb-6 leading-tight">
            Unlock The Power Of
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-yellow-400 mt-2">
              Intentional Writing
            </span>
          </h2>

          <p className="text-md text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Every stroke brings you closer to your dreams. Experience the premium
            benefits of manifestation journaling with a tool designed for your
            spiritual journey.
          </p>
        </div>

        {/* Benefits: carousel on mobile, grid on md+ */}
        <div className="mb-16">
          {/* Mobile: horizontal scroll carousel (no visibility gating) */}
          <div className="md:hidden -mx-4 px-4">
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.id}
                    className="min-w-[80%] max-w-xs snap-center transform transition-all duration-700 ease-out opacity-100 scale-100 translate-y-0"
                  >
                    <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 h-full hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300 blur-xl`}
                      />
                      <div className="relative z-10">
                        <div
                          className={`w-14 h-14 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                        >
                          <Icon
                            className="w-7 h-7 text-white"
                            strokeWidth={2.5}
                          />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                          {benefit.title}
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">
                          {benefit.description}
                        </p>
                      </div>
                      <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-yellow-300 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Desktop: original grid with scroll animation */}
          <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              const isVisible = visibleCards.includes(index);

              return (
                <div
                  key={benefit.id}
                  ref={(el) => (cardsRef.current[index] = el)}
                  className={`transform transition-all duration-700 ease-out ${
                    isVisible
                      ? "opacity-100 scale-100 translate-y-0"
                      : "opacity-0 scale-95 translate-y-10"
                  }`}
                  style={{ transitionDelay: `${(index % 3) * 150}ms` }}
                >
                  <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300 h-full hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300 blur-xl`}
                    />
                    <div className="relative z-10">
                      <div
                        className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <Icon
                          className="w-8 h-8 text-white"
                          strokeWidth={2.5}
                        />
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-300 group-hover:to-pink-300 transition-all duration-300">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-300 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-br from-yellow-300 to-pink-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <div className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-yellow-500 p-1 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300">
            <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-md px-12 py-5 rounded-full transition-all duration-300 flex items-center gap-3">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300">
                Start Your Manifestation Journey
              </span>
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </button>
          </div>

          <p className="text-gray-400 mt-6 text-sm">
            Join thousands who have transformed their lives through intentional
            writing
          </p>
        </div>
      </div>
    </section>
  );
}
