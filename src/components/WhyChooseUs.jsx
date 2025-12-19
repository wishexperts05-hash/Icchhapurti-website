import React from 'react';
import { Shield, Zap, Users, Award, Clock, TrendingUp } from 'lucide-react';

const WhyChooseUs = () => {
  const features = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-grade security with encrypted transactions to keep your data and payments safe.'
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Lightning-fast coin delivery directly to your account within seconds of payment.'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Round-the-clock customer service to assist you whenever you need help.'
    },
    {
      icon: Award,
      title: 'Best Value',
      description: 'Competitive rates and special offers to give you the most coins for your money.'
    },
    {
      icon: Clock,
      title: 'Quick Setup',
      description: 'Get started in minutes with our simple and intuitive platform interface.'
    },
    {
      icon: TrendingUp,
      title: 'Trusted Platform',
      description: 'Join thousands of satisfied users who trust us for their coin purchases.'
    }
  ];

  return (
    <div className=" bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden py-10 px-6">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/4 w-96 h-96 border border-blue-400/30 rounded-full" />
        <div className="absolute bottom-32 right-1/4 w-80 h-80 border border-amber-400/30 rounded-full" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Stars */}
      <div className="absolute inset-0">
        {[...Array(40)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Why Choose Us?
          </h2>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            We provide the most reliable and efficient platform for purchasing coins with unmatched service quality and customer satisfaction.
          </p>
        </div>

       

        {/* Call to Action */}
        {/* <div className="mt-16 text-center">
          <button className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold px-8 py-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-amber-500/50 transform hover:scale-105">
            Get Started Today
          </button>
        </div> */}
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default WhyChooseUs;