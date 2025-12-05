import { useState, useEffect, useRef } from 'react';
import { Droplet, Crown, Hand, Battery, Package, Gift, BookOpen, Sparkles, Star } from 'lucide-react';

export default function ManifestationFeatures() {
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const sectionRef = useRef(null);
  const featuresRef = useRef([]);

  const features = [
    {
      id: 1,
      icon: Droplet,
      title: 'Premium Smooth Ink',
      description: 'Experience buttery-smooth writing with our premium German ink that flows effortlessly across any paper.',
      highlight: 'German Engineering',
      color: 'from-blue-500 to-cyan-500',
      shadowColor: 'shadow-blue-500/50'
    },
    {
      id: 2,
      icon: Crown,
      title: 'Gold-Plated Body',
      description: 'Luxurious 24K gold-plated finish that radiates abundance and attracts prosperity with every touch.',
      highlight: '24K Gold Plated',
      color: 'from-yellow-500 to-amber-600',
      shadowColor: 'shadow-yellow-500/50'
    },
    {
      id: 3,
      icon: Hand,
      title: 'Comfortable Grip',
      description: 'Ergonomically designed with a soft-touch grip zone for extended journaling sessions without fatigue.',
      highlight: 'Ergonomic Design',
      color: 'from-purple-500 to-pink-500',
      shadowColor: 'shadow-purple-500/50'
    },
    {
      id: 4,
      icon: Battery,
      title: 'Long-Lasting Refill',
      description: 'Write up to 50,000 words before needing a refill—perfect for months of manifestation journaling.',
      highlight: '50K+ Words',
      color: 'from-emerald-500 to-teal-500',
      shadowColor: 'shadow-emerald-500/50'
    },
    {
      id: 5,
      icon: Package,
      title: 'Elegant Packaging',
      description: 'Presented in a luxurious magnetic closure box with gold foil accents—unboxing is an experience.',
      highlight: 'Premium Unboxing',
      color: 'from-rose-500 to-pink-600',
      shadowColor: 'shadow-rose-500/50'
    },
    {
      id: 6,
      icon: Gift,
      title: 'Ideal for Gifting',
      description: 'The perfect gift for spiritual friends, manifestation enthusiasts, or anyone starting their journey.',
      highlight: 'Gift Ready',
      color: 'from-red-500 to-orange-500',
      shadowColor: 'shadow-red-500/50'
    },
    {
      id: 7,
      icon: BookOpen,
      title: 'Affirmation Guide',
      description: 'Includes a beautifully designed 30-page guide with powerful affirmations and scripting templates.',
      highlight: '30-Page Guide',
      color: 'from-indigo-500 to-purple-600',
      shadowColor: 'shadow-indigo-500/50'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      featuresRef.current.forEach((feature, index) => {
        if (!feature) return;
        const rect = feature.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.8 && rect.bottom > 0) {
          if (!visibleFeatures.includes(index)) {
            setVisibleFeatures(prev => [...prev, index]);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [visibleFeatures]);

  return (
    <section ref={sectionRef} className="relative w-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 py-24 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-20 left-20 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
      </div>

      {/* Decorative stars */}
      <div className="absolute top-10 left-10 text-yellow-400 animate-spin" style={{ animationDuration: '20s' }}>
        <Star className="w-12 h-12" fill="currentColor" />
      </div>
      <div className="absolute top-32 right-20 text-purple-400 animate-spin" style={{ animationDuration: '15s', animationDelay: '1s' }}>
        <Star className="w-8 h-8" fill="currentColor" />
      </div>
      <div className="absolute bottom-20 left-32 text-pink-400 animate-spin" style={{ animationDuration: '18s', animationDelay: '0.5s' }}>
        <Star className="w-10 h-10" fill="currentColor" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-purple-300 text-sm font-bold tracking-[0.3em] uppercase">
              Premium Craftsmanship
            </span>
            <Sparkles className="w-5 h-5 text-yellow-400" />
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Designed For Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 mt-2">
              Manifestation Journey
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Every detail has been thoughtfully crafted to elevate your spiritual practice 
            and make manifestation journaling a luxurious ritual.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isVisible = visibleFeatures.includes(index);
            const isHovered = hoveredFeature === feature.id;

            return (
              <div
                key={feature.id}
                ref={el => featuresRef.current[index] = el}
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
                className={`transform transition-all duration-700 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${(index % 3) * 150}ms` }}
              >
                <div className={`relative group h-full ${
                  isHovered ? 'scale-105 z-10' : ''
                } transition-all duration-300`}>
                  {/* Card */}
                  <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border-2 h-full transition-all duration-300 ${
                    isHovered 
                      ? 'border-white/60 shadow-2xl ' + feature.shadowColor
                      : 'border-white/20'
                  }`}>
                    {/* Gradient glow on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 ${
                      isHovered ? 'opacity-20' : ''
                    } rounded-3xl blur-2xl transition-opacity duration-300 -z-10`} />

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon badge */}
                      <div className={`inline-flex w-20 h-20 bg-gradient-to-br ${feature.color} rounded-2xl items-center justify-center mb-6 shadow-xl ${
                        isHovered ? 'scale-110 rotate-6' : ''
                      } transition-all duration-300`}>
                        <Icon className="w-10 h-10 text-white" strokeWidth={2.5} />
                      </div>

                      {/* Highlight badge */}
                      <div className={`inline-block mb-4 bg-gradient-to-r ${feature.color} px-4 py-1 rounded-full`}>
                        <span className="text-white text-xs font-bold">{feature.highlight}</span>
                      </div>

                      {/* Title */}
                      <h3 className={`text-2xl font-black mb-4 transition-all duration-300 ${
                        isHovered 
                          ? 'text-transparent bg-clip-text bg-gradient-to-r ' + feature.color.replace('from-', 'from-').replace('to-', 'to-')
                          : 'text-white'
                      }`}>
                        {feature.title}
                      </h3>

                      {/* Description */}
                      <p className="text-gray-300 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>

                    {/* Corner sparkle */}
                    <div className={`absolute top-4 right-4 transition-all duration-300 ${
                      isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                    }`}>
                      <Sparkles className="w-6 h-6 text-yellow-300" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA section */}
        <div className="relative mt-20">
          <div className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-slate-900 rounded-3xl px-12 py-16 text-center">
              <div className="flex justify-center gap-2 mb-6">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </div>
              
              <h3 className="text-4xl font-black text-white mb-4">
                Experience Premium Quality
              </h3>
              
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of manifesters who have elevated their spiritual practice 
                with the world's most luxurious manifestation pen.
              </p>

              <button className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-500 hover:from-yellow-400 hover:via-pink-400 hover:to-purple-400 text-white font-black text-xl px-12 py-5 rounded-full shadow-2xl hover:shadow-pink-500/50 transition-all duration-300 hover:scale-105">
                Get Your Manifestation Pen
              </button>
              
              <div className="mt-6 text-gray-400 text-sm">
                ✨ Free shipping on orders over $50 • 30-day money-back guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}