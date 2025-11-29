import React, { useState } from 'react';

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState(1);
  const [activeTab, setActiveTab] = useState('All FAQs');

  const tabs = ['All FAQs', 'General', 'Shop', 'Account', 'Support'];

  const faqs = [
    {
      id: 1,
      question: "Alright, but what exactly do you do?",
      answer: "As a creative agency, we work with you to develop solutions to address your brand needs. That includes various aspects of brand planning and strategy, marketing and design."
    },
    {
      id: 2,
      question: "I don't need a brand strategist but I need help executing an upcoming campaign. Can we still work?",
      answer: "Yes, we can definitely help you with campaign execution. We offer flexible services tailored to your specific needs."
    },
    {
      id: 3,
      question: "Are your rates competitive?",
      answer: "Our rates are competitive and transparent. We provide detailed quotes based on your project scope and requirements."
    },
    {
      id: 4,
      question: "Why do you have a monthly project cap?",
      answer: "We maintain a monthly project cap to ensure we deliver the highest quality work to each client with dedicated attention and resources."
    }
  ];

  const toggleFAQ = (id) => {
    setOpenFAQ(openFAQ === id ? null : id);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden ">
      {/* Cosmic Background */}
      <div className="absolute inset-0 bg-gradient-radial from-blue-800/30 via-transparent to-transparent"></div>
      
      {/* Stars */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute w-1 h-1 bg-white rounded-full top-[5%] left-[10%] animate-pulse"></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[15%] left-[80%] animate-pulse" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[30%] left-[60%] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[50%] left-[25%] animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute w-1 h-1 bg-white rounded-full top-[70%] left-[85%] animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute w-0.5 h-0.5 bg-white rounded-full top-[85%] left-[35%] animate-pulse" style={{animationDelay: '2.5s'}}></div>
      </div>

      {/* Spiral - Face outline effect */}
      <div className="absolute top-32 left-1/2 -translate-x-1/2 w-64 h-64 opacity-20">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <circle cx="100" cy="100" r="80" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <circle cx="75" cy="85" r="8" fill="rgba(255,255,255,0.4)"/>
          <circle cx="125" cy="85" r="8" fill="rgba(255,255,255,0.4)"/>
          <path d="M 70 130 Q 100 150 130 130" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-3xl font-bold mb-6">FAQs</h1>
          
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-orange-400 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search for Question..."
              className="w-full px-4 py-3 pr-12 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq) => (
            <div
              key={faq.id}
              className="bg-white/95 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20 transition-all duration-300"
            >
              <button
                onClick={() => toggleFAQ(faq.id)}
                className="w-full px-6 py-5 flex items-start justify-between text-left hover:bg-white transition-colors"
              >
                <div className="flex gap-4 flex-1">
                  <span className="text-2xl font-bold text-gray-800 flex-shrink-0">
                    {String(faq.id).padStart(2, '0')}
                  </span>
                  <h3 className="text-lg font-bold text-gray-800 pt-1">
                    {faq.question}
                  </h3>
                </div>
                <div className="flex-shrink-0 ml-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    openFAQ === faq.id ? 'bg-orange-400 rotate-45' : 'bg-orange-300'
                  }`}>
                    <span className="text-white text-xl font-bold">+</span>
                  </div>
                </div>
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openFAQ === faq.id ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-6 pl-20">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="text-center bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
          <h2 className="text-white text-xl font-semibold mb-2">
            Have any other questions?
          </h2>
          <p className="text-white/80 text-sm mb-6">
            don't hesitate to reach out and we'll<br />
            reply in a moment or
          </p>
          <div className="max-w-md mx-auto">
            <input
              type="email"
              placeholder="someone@somemail.com"
              className="w-full px-4 py-3 rounded-lg bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}