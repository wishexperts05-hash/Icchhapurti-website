import { useState, useEffect, useRef } from 'react';
import { Lightbulb, Calendar, Clock, Sparkles, Home, Heart } from 'lucide-react';

export default function HowToUseManifestationPen() {
  const [activeStep, setActiveStep] = useState(0);
  const sectionRef = useRef(null);

  const steps = [
    {
      id: 1,
      icon: Lightbulb,
      title: 'Write Your Intention Clearly',
      description: 'Be specific and detailed. Instead of "I want money," write "I am attracting $10,000 into my life with ease and joy."',
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-500/20',
      tip: 'Use present tense as if it\'s already yours'
    },
    {
      id: 2,
      icon: Calendar,
      title: 'Affirm It Daily',
      description: 'Use the same pen every single day. Consistency creates neural pathways and strengthens your belief in your manifestation.',
      color: 'from-purple-400 to-pink-500',
      bgColor: 'bg-purple-500/20',
      tip: 'Set a daily reminder on your phone'
    },
    {
      id: 3,
      icon: Clock,
      title: 'Script for 5 Minutes',
      description: 'Every morning, spend just 5 minutes scripting your ideal life in present tense. Feel the emotions as you write.',
      color: 'from-blue-400 to-cyan-500',
      bgColor: 'bg-blue-500/20',
      tip: 'Morning is the most powerful time'
    },
    {
      id: 4,
      icon: Sparkles,
      title: 'Use Only for Manifestation',
      description: 'Keep this pen sacred. Don\'t use it for grocery lists or random notes. Reserve its energy exclusively for your dreams.',
      color: 'from-pink-400 to-rose-500',
      bgColor: 'bg-pink-500/20',
      tip: 'Treat it as your sacred tool'
    },
    {
      id: 5,
      icon: Home,
      title: 'Keep It in Positive Space',
      description: 'Store your pen in a clean, high-vibe area—near crystals, on your altar, or in a special drawer dedicated to spiritual practice.',
      color: 'from-emerald-400 to-teal-500',
      bgColor: 'bg-emerald-500/20',
      tip: 'Cleanse the space with sage or palo santo'
    },
    {
      id: 6,
      icon: Heart,
      title: 'Trust & Take Action',
      description: 'Trust the universe\'s timing while taking inspired action. Your pen amplifies intention, but you must walk toward your dreams.',
      color: 'from-red-400 to-pink-500',
      bgColor: 'bg-red-500/20',
      tip: 'Listen to your intuition for next steps'
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;

      const section = sectionRef.current;
      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      if (rect.top < windowHeight / 2 && rect.bottom > windowHeight / 2) {
        const scrollProgress = (windowHeight / 2 - rect.top) / (rect.height - windowHeight / 2);
        const newStep = Math.min(Math.floor(scrollProgress * steps.length), steps.length - 1);
        setActiveStep(Math.max(0, newStep));
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [steps.length]);

  return (
    <section ref={sectionRef} className="relative w-full bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 py-24 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Decorative sparkles */}
      <div className="absolute top-20 right-20 text-yellow-300 animate-bounce" style={{ animationDuration: '3s' }}>
        <Sparkles className="w-8 h-8" />
      </div>
      <div className="absolute bottom-40 left-20 text-pink-300 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }}>
        <Sparkles className="w-6 h-6" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-8">
        {/* Section header */}
        <div className="text-center mb-20">
          <div className="inline-block mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 text-sm font-bold tracking-[0.3em] uppercase">
              Your Guide to Success
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            How To Use The
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 mt-2">
              Manifestation Pen
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Follow these 6 powerful steps to activate your pen's manifestation energy 
            and align with your highest timeline.
          </p>
        </div>

        {/* Steps container */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Left side - Step cards */}
          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = activeStep === index;
              const isPassed = activeStep > index;

              return (
                <div
                  key={step.id}
                  onClick={() => setActiveStep(index)}
                  className={`relative cursor-pointer transition-all duration-500 ${
                    isActive ? 'scale-105' : isPassed ? 'scale-100 opacity-70' : 'scale-95 opacity-50'
                  }`}
                >
                  <div className={`relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-6 border-2 transition-all duration-300 ${
                    isActive 
                      ? 'border-white/60 shadow-2xl shadow-purple-500/30' 
                      : 'border-white/20 hover:border-white/40'
                  }`}>
                    {/* Active indicator glow */}
                    {isActive && (
                      <div className={`absolute inset-0 bg-gradient-to-r ${step.color} opacity-20 rounded-2xl blur-xl`} />
                    )}

                    <div className="relative z-10 flex items-start gap-4">
                      {/* Step number and icon */}
                      <div className="flex-shrink-0">
                        <div className={`w-16 h-16 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg ${
                          isActive ? 'scale-110' : ''
                        } transition-transform duration-300`}>
                          <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                        </div>
                        <div className={`mt-2 text-center font-black text-sm ${
                          isActive ? 'text-white' : 'text-gray-400'
                        }`}>
                          STEP {step.id}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                          isActive ? 'text-white' : 'text-gray-300'
                        }`}>
                          {step.title}
                        </h3>
                        <p className={`text-sm leading-relaxed transition-colors duration-300 ${
                          isActive ? 'text-gray-200' : 'text-gray-400'
                        }`}>
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Checkmark for passed steps */}
                    {isPassed && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right side - Active step detail */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl p-10 border border-white/30 shadow-2xl">
              {/* Animated gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${steps[activeStep].color} opacity-10 rounded-3xl animate-pulse`} />
              
              <div className="relative z-10">
                {/* Icon */}
                <div className={`inline-flex w-24 h-24 bg-gradient-to-br ${steps[activeStep].color} rounded-2xl items-center justify-center mb-6 shadow-2xl`}>
                  {(() => {
                    const Icon = steps[activeStep].icon;
                    return <Icon className="w-12 h-12 text-white" strokeWidth={2.5} />;
                  })()}
                </div>

                {/* Step number */}
                <div className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300 text-sm font-black tracking-[0.3em] mb-3">
                  STEP {steps[activeStep].id} OF 6
                </div>

                {/* Title */}
                <h3 className="text-4xl font-black text-white mb-6 leading-tight">
                  {steps[activeStep].title}
                </h3>

                {/* Description */}
                <p className="text-xl text-gray-200 leading-relaxed mb-8">
                  {steps[activeStep].description}
                </p>

                {/* Pro tip box */}
                <div className={`${steps[activeStep].bgColor} backdrop-blur-sm rounded-2xl p-6 border border-white/20`}>
                  <div className="flex items-start gap-3">
                    <Sparkles className={`w-6 h-6 flex-shrink-0 mt-1 text-yellow-300`} />
                    <div>
                      <div className="text-yellow-300 font-bold text-sm mb-2">PRO TIP</div>
                      <p className="text-white text-sm leading-relaxed">
                        {steps[activeStep].tip}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex justify-center gap-3 mt-12">
          {steps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`transition-all duration-300 ${
                activeStep === index
                  ? 'w-12 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full'
                  : 'w-3 h-3 bg-white/30 rounded-full hover:bg-white/50'
              }`}
              aria-label={`Go to step ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}