import React, { useState } from 'react';
import { Sparkles, Target, Heart, Package, Star, ChevronDown } from 'lucide-react';

export default function AboutUs() {
  const [expandedProduct, setExpandedProduct] = useState(null);

  const products = [
    {
      id: 1,
      name: "Seven Chakra Premium Manifestation Pen",
      description: "A luxury metal pen embedded with seven chakra stones and topped with genuine pyrite—designed to balance energy centers, boost confidence, and attract abundance.",
      icon: "✨"
    },
    {
      id: 2,
      name: "Elegant Metal Roller Manifestation Pen",
      description: "A minimal, stone-free manifestation pen ideal for students and corporate professionals who want a subtle yet powerful intention-focused writing tool suitable for schools and offices.",
      icon: "🖊️"
    },
    {
      id: 3,
      name: "Complete Manifestation Kit",
      description: "A thoughtfully curated kit that includes: Selenite Charging Plate, Icchhapurti Seven Chakra Premium Manifestation Pen, Manifestation Vision Board, Manifestation Journal, Manifestation Bracelet, and Manifestation Cheque.",
      icon: "📦"
    }
  ];

  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Authenticity",
      description: "Every spiritual tool we offer is genuine and created with true intention"
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Quality Craftsmanship",
      description: "Products designed to last and support your journey consistently"
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Thoughtful Design",
      description: "Each detail is crafted to inspire daily practice and meaningful use"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Energetic Activation",
      description: "Charged through dedicated spiritual practices and mindful preparation"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden  text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-6 py-20 text-center">
          <h1
            className="text-5xl md:text-6xl font-extrabold mb-6 animate-fade-in bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(120deg, #7a5c00 0%, #f6e27a 15%, #fff6b0 30%, #d4af37 45%, #fff6b0 60%, #f6e27a 75%, #7a5c00 100%)",
              backgroundSize: "200% 200%",
              animation: "goldShine 3s linear infinite",
            }}
          >
            About Icchhapurti
          </h1>

          <p className="text-xl md:text-2xl mb-4 opacity-90">
            Where dreams turns into Reality
          </p>
          <div className="flex justify-center mt-8">
            <Sparkles className="w-12 h-12 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#a17b0a] mb-6 text-center">
            Our Mission
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            We (Wish experts private limited) with the brand name <span className="font-semibold text-[#a17b0a]">Icchhapurti</span> believe that intentions become powerful when combined with clarity, focus, and mindful action. Our mission is to create meaningful manifestation tools that help individuals align their thoughts, energy, and efforts towards achieving their goals—whether personal, professional, or spiritual.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Icchhapurti was born from the idea that everyone deserves the right tools to manifest their dreams, regardless of where they are in life. From students and professionals to spiritual seekers, our products are thoughtfully designed to support focus, confidence, abundance, and positive thinking in everyday routines.
          </p>
        </div>
      </div>

      {/* What We Create Section */}
      <div className="bg-gradient-to-r from-purple-100 to-blue-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#a17b0a] mb-6 text-center">
            What We Create
          </h2>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
            <div className="flex items-start gap-4 mb-6">
              <Package className="w-10 h-10 text-[#a17b0a] flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-2xl font-bold text-[#a17b0a] mb-4">
                  The Power Pack Tool
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We are the best in the market who create The Power Pack Tool for achieving your goals. Our products are heavily charged and activated with multiple processes and rituals like <span className="font-semibold text-[#a17b0a]">Havans, Mantra Jaap, Mantra Chanting, Moon Charging</span> and many more rituals are performed on the pen to maximize your goal achievement to 10x power/faster through manifestation.
                </p>
                <p className="text-gray-700 leading-relaxed font-medium">
                  That is why this pen is something magical for everyone only if you show trust and believe in it.
                </p>
                <div className="mt-6 bg-purple-50 border-l-4 border-purple-600 p-4 rounded">
                  <p className="text-[#a17b0a] font-semibold italic">
                    "Don't question it, just own it, write it and start manifestation then see the magic happens."
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
              >
                <div className="text-5xl mb-4 text-center">{product.icon}</div>
                <h3 className="text-xl font-bold text-[#a17b0a] mb-3 text-center">
                  {product.name}
                </h3>
                <p className={`text-gray-600 leading-relaxed ${expandedProduct === product.id ? '' : 'line-clamp-3'}`}>
                  {product.description}
                </p>
                <div className="flex justify-center mt-4">
                  <ChevronDown className={`w-5 h-5 text-[#a17b0a] transition-transform ${expandedProduct === product.id ? 'rotate-180' : ''}`} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Philosophy Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className=" rounded-2xl shadow-xl p-8 md:p-12 text-white">
          <h2 className="text-3xl md:text-4xl text-[#D3AF37] font-bold mb-6 text-center">
            Our Philosophy
          </h2>
          <p className="text-lg leading-relaxed text-center max-w-4xl mx-auto">
            Manifestation is a personal journey, and results may vary for each individual. Our products are not shortcuts—they are supportive tools meant to enhance focus, intention, belief, and disciplined action. We encourage users to combine our tools with effort, gratitude, and consistency.
          </p>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-[#a17b0a] mb-12 text-center">
            Our Promise
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex justify-center text-[#a17b0a] mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold text-[#a17b0a] mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-[#a17b0a] mb-4">
              Crafted With Purpose
            </h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Every Icchhapurti product is created with deep attention to detail and intention. From the initial design to the final packaging, each item is carefully crafted to support focus, clarity, and positive energy. Our tools are energetically activated through dedicated spiritual practices and prepared with mindfulness, ensuring they are aligned for meaningful daily use.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Designed to blend seamlessly into everyday life, Icchhapurti products are not just symbolic—they are practical tools meant to be used consistently as part of your manifestation routine. Because each product is specially charged and prepared with intention, it is created exclusively for you.
            </p>
          </div>
        </div>
      </div>

      {/* Closing Section */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className=" rounded-2xl shadow-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-3xl md:text-4xl text-[#D3AF37] font-bold mb-6">
            Your Journey Begins Here
          </h2>
          <p className="text-lg leading-relaxed mb-4 max-w-3xl mx-auto">
            At Icchhapurti, our commitment goes beyond creating products—we aim to support transformation. We believe that when intention meets the right tools and consistent effort, goals become clearer, energy becomes aligned, and progress becomes visible.
          </p>
          <div className="mt-8 space-y-2">
            <p className="text-xl font-semibold text-[#D3AF37]">Your intentions matter.</p>
            <p className="text-xl font-semibold text-[#D3AF37]">Your energy matters.</p>
            <p className="text-xl font-semibold text-[#D3AF37]">And with the right tools, your goals move closer to reality.</p>
          </div>
          <div className="mt-8">
            <Sparkles className="w-16 h-16 mx-auto animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}