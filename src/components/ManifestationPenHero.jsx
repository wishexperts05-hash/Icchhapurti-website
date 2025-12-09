import { useState, useEffect } from "react";
import { Sparkles, Star, ArrowRight, ShoppingCart, Heart, Zap, CheckCircle, Target, TrendingUp, BookOpen, Brain, Calendar, Eye } from "lucide-react";

export default function ManifestationPenHero() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [activeBenefit, setActiveBenefit] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Sparkles, text: "Crystal-Infused Energy" },
    { icon: Star, text: "Gold-Plated Luxury" },
    { icon: Zap, text: "Manifestation Power" }
  ];

  const benefits = [
    {
      icon: Target,
      title: "Focuses Your Intention & Energy",
      description: "Channel your thoughts and desires into powerful written manifestations that amplify your energy field.",
      color: "from-purple-500 to-purple-600",
      glow: "purple"
    },
    {
      icon: TrendingUp,
      title: "Helps You Stay Committed to Goals",
      description: "Build unstoppable momentum as you consistently write and reinforce your aspirations every single day.",
      color: "from-blue-500 to-blue-600",
      glow: "blue"
    },
    {
      icon: BookOpen,
      title: "Writes Smoothly for Positive Journaling",
      description: "Premium ink flow and ergonomic design make every writing session effortless and enjoyable.",
      color: "from-pink-500 to-pink-600",
      glow: "pink"
    },
    {
      icon: Brain,
      title: "Scientifically Aligned with Manifestation",
      description: "Based on neuroplasticity and quantum physics principles that support intentional reality creation.",
      color: "from-green-500 to-green-600",
      glow: "green"
    },
    {
      icon: Eye,
      title: "Increases Clarity & Motivation",
      description: "Transform vague dreams into crystal-clear visions that ignite your passion and drive daily action.",
      color: "from-yellow-500 to-yellow-600",
      glow: "yellow"
    },
    {
      icon: Calendar,
      title: "Builds Daily Spiritual Habits",
      description: "Create a sacred ritual that connects you with your higher self and aligns you with universal energy.",
      color: "from-indigo-500 to-indigo-600",
      glow: "indigo"
    },
    {
      icon: Sparkles,
      title: "Perfect for Scripting & Affirmations",
      description: "Ideal tool for scripting your future, writing affirmations, and maintaining your goal journal.",
      color: "from-rose-500 to-rose-600",
      glow: "rose"
    }
  ];

  return (
    <div className="bg-slate-50">
      {/* HERO SECTION */}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-3xl"></div>
          
          {/* Floating Stars */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`
              }}
            ></div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-yellow-500/30">
                <Sparkles className="w-4 h-4 text-yellow-400 animate-spin-slow" />
                <span className="text-sm font-medium text-yellow-200">Limited Edition Release</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-yellow-200 to-yellow-400 animate-gradient">
                  The Manifestation Pen
                </span>
                <br />
                <span className="text-white">
                  That Turns Your
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  Intentions Into Reality
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-xl sm:text-2xl text-gray-300 leading-relaxed">
                Write your goals. Focus your energy.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-400 font-semibold">
                  Manifest your dream life.
                </span>
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap gap-3">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500 ${
                        activeFeature === index
                          ? 'bg-gradient-to-r from-yellow-500 to-purple-500 text-white scale-105'
                          : 'bg-white/10 text-gray-300 backdrop-blur-sm'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{feature.text}</span>
                    </div>
                  );
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 rounded-full font-bold text-lg shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all duration-300 hover:scale-105 overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Shop Now - ₹999
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </button>

                <button className="group px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                  <span className="flex items-center justify-center gap-2">
                    <Heart className="w-5 h-5 group-hover:fill-red-500 group-hover:text-red-500 transition-colors" />
                    Add to Wishlist
                  </span>
                </button>
              </div>

              {/* Trust Indicators */}
              {/* <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" />
                  <span className="text-sm text-gray-300">Lifetime Warranty</span>
                </div>
              </div> */}

              {/* Social Proof */}
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-slate-900 flex items-center justify-center text-white font-bold text-sm"
                    >
                      {String.fromCharCode(64 + i)}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    <span className="text-white font-semibold">2,847+</span> manifestations achieved
                  </p>
                </div>
              </div>
            </div>

            {/* Right - Product Image */}
            <div className={`relative transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              {/* Glow Effect Behind Pen */}
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/30 via-purple-500/30 to-pink-500/30 blur-3xl animate-pulse"></div>
              
              {/* Product Card */}
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* Premium Badge */}
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-slate-900 px-6 py-2 rounded-full font-bold text-sm shadow-lg rotate-12 z-10">
                  PREMIUM
                </div>

                {/* Pen Image Container */}
                <div className="relative aspect-square flex items-center justify-center p-8">
                  {/* Orbiting Elements */}
                  <div className="absolute inset-0 animate-spin-slow">
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <div
                        key={i}
                        className="absolute top-1/2 left-1/2 w-3 h-3"
                        style={{
                          transform: `rotate(${angle}deg) translateX(140px)`
                        }}
                      >
                        <Sparkles className="w-3 h-3 text-yellow-400 animate-pulse" />
                      </div>
                    ))}
                  </div>

                  {/* Main Pen Image Placeholder */}
                  <div className="relative z-10 w-full h-full flex items-center justify-center">
                    <div className="relative w-3/4 h-3/4 bg-gradient-to-br from-yellow-600 via-yellow-500 to-yellow-400 rounded-full shadow-2xl shadow-yellow-500/50 flex items-center justify-center animate-float">
                      {/* Pen Icon Representation */}
                      <div className="relative w-4/5 h-4 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full shadow-inner">
                        <div className="absolute top-1/2 right-0 w-1/4 h-2 -translate-y-1/2 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-l-full"></div>
                      </div>
                      
                      {/* Crystal Tips */}
                      <div className="absolute top-4 right-4 w-6 h-6 bg-purple-400 rounded-full blur-sm animate-pulse"></div>
                      <div className="absolute bottom-4 left-4 w-4 h-4 bg-pink-400 rounded-full blur-sm animate-pulse delay-300"></div>
                    </div>
                  </div>

                  {/* Floating Text */}
                  <div className="absolute top-8 left-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <p className="text-xs text-white font-medium">✨ Crystal Infused</p>
                  </div>
                  <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                    <p className="text-xs text-white font-medium">💎 24K Gold</p>
                  </div>
                </div>

                {/* Product Info */}
                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">Manifestation Pen</h3>
                      <p className="text-sm text-gray-400">Limited Edition</p>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                        ₹999
                      </p>
                      <p className="text-sm text-gray-400 line-through">₹1,999</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Stats */}
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-4 w-full max-w-sm px-4">
                <div className="flex-1 bg-gradient-to-br from-purple-500/80 to-purple-600/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-purple-400/30">
                  <p className="text-2xl font-bold text-white">5,000+</p>
                  <p className="text-xs text-purple-100">Pens Sold</p>
                </div>
                <div className="flex-1 bg-gradient-to-br from-pink-500/80 to-pink-600/80 backdrop-blur-sm rounded-2xl p-4 text-center border border-pink-400/30">
                  <p className="text-2xl font-bold text-white">4.9★</p>
                  <p className="text-xs text-pink-100">Rating</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        {/* <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="rgb(248, 250, 252)"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div> */}
      </div>

      {/* BENEFITS SECTION */}
      {/* <div className="relative py-20 sm:py-32 bg-slate-50 overflow-hidden">
      
        <div className="absolute inset-0 overflow-hidden opacity-40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-200 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
          <div className="text-center mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Transform Your Life</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Unlock Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Full Potential</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              More than just a pen—it's your daily companion on the journey to manifesting your dreams and creating lasting change.
            </p>
          </div>

         
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={index}
                  className="group relative"
                  onMouseEnter={() => setActiveBenefit(index)}
                >
                 
                  <div className={`relative h-full bg-white rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border-2 ${
                    activeBenefit === index 
                      ? `border-${benefit.glow}-300 scale-105` 
                      : 'border-gray-100 hover:border-gray-200'
                  }`}>
                
                    <div className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-500`}></div>
                    
                    
                    <div className={`relative mb-6 w-14 h-14 rounded-xl bg-gradient-to-br ${benefit.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                   
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300">
                      {benefit.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>

                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${benefit.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-500`}></div>
                  </div>

                 
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${benefit.color} opacity-0 group-hover:opacity-100 -z-10 blur-xl transition-opacity duration-500`}></div>
                </div>
              );
            })}
          </div>

        
          <div className="mt-16 sm:mt-20 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-4 bg-gradient-to-r from-purple-900 to-pink-900 rounded-2xl p-8 sm:p-10 shadow-2xl">
              <div className="flex-1 text-left">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  Ready to Start Your Manifestation Journey?
                </h3>
                <p className="text-purple-200">
                  Join thousands who are already manifesting their dream life
                </p>
              </div>
              <button className="group px-8 py-4 bg-white text-purple-900 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 whitespace-nowrap">
                <span className="flex items-center gap-2">
                  Get Your Pen Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div> */}

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}