import React, { useState } from 'react';
import { Copy, Users, Coins, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReferProgramPage = () => {
  const [currentPage, setCurrentPage] = useState(2);
  const [copied, setCopied] = useState(false);
  const referralCode = "RW40850";

  const referrals = [
    { id: 1, name: 'Jane Cooper', date: '20 Aug 2025', coins: 10, avatar: '👩' },
    { id: 2, name: 'Theresa Webb', date: '20 Aug 2025', coins: 10, avatar: '👨' },
    { id: 3, name: 'Esther Howard', date: '20 Aug 2025', coins: 10, avatar: '👨‍🦱' },
    { id: 4, name: 'Marvin McKinney', date: '20 Aug 2025', coins: 10, avatar: '👨‍🦰' },
    { id: 5, name: 'Wade Warren', date: '20 Aug 2025', coins: 10, avatar: '👨‍🦲' },
    { id: 6, name: 'Leslie Alexander', date: '20 Aug 2025', coins: 10, avatar: '👩‍🦰' },
    { id: 7, name: 'Floyd Miles', date: '20 Aug 2025', coins: 10, avatar: '👨‍💼' },
    { id: 8, name: 'Eleanor Pena', date: '20 Aug 2025', coins: 10, avatar: '👩‍💼' },
    { id: 9, name: 'Darrell Steward', date: '20 Aug 2025', coins: 10, avatar: '👨‍🎓' },
    { id: 10, name: 'Annette Black', date: '20 Aug 2025', coins: 10, avatar: '👩‍🎓' },
  ];

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen  relative overflow-hidden">
      {/* Mystical background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/4 w-96 h-96 border border-blue-400/30 rounded-full"></div>
        <div className="absolute top-40 left-1/3 w-64 h-64 border border-blue-300/20 rounded-full"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 border border-amber-400/30 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 border-2 border-blue-400/20 rounded-full flex items-center justify-center">
            <div className="w-48 h-48 border border-blue-300/20 rounded-full flex items-center justify-center">
              <div className="w-32 h-32 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-70"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`
            }}
          ></div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Refer Program</h1>

        {/* Coins Card */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-lg p-6 mb-6 shadow-2xl">
          <div className="flex flex-col items-center mb-4">
            <div className="w-16 h-16 bg-amber-400 rounded-full flex items-center justify-center mb-3 shadow-lg">
              <Coins className="w-8 h-8 text-amber-900" />
            </div>
            <p className="text-white text-sm mb-1">Available Coins</p>
            <p className="text-white text-4xl font-bold mb-1">1000</p>
            <p className="text-amber-200 text-xs">3 coin = ₹ 1</p>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link to="/buy-coins" className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2.5 px-4 rounded transition-all duration-300 shadow-lg">
              Buy Coin
            </Link>
            <button className="bg-amber-400 hover:bg-amber-500 text-amber-900 font-semibold py-2.5 px-4 rounded transition-all duration-300 shadow-lg">
              Convert to Money
            </button>
          </div>
        </div>

        {/* Refer a Friend Card */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 mb-6 shadow-2xl">
          <p className="text-blue-200 text-sm text-center mb-2">Refer a friend</p>
          <p className="text-white text-xl font-bold text-center mb-4">Get 1 Referral = 10 Coins</p>
          
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="flex items-end gap-2">
                <div className="text-4xl">👤</div>
                <div className="absolute left-8 top-2 text-4xl">🎁</div>
                <div className="absolute left-16 text-4xl">👤</div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Code */}
        <div className="mb-6">
          <label className="text-white text-sm mb-2 block">Your Referral Code</label>
          <div className="relative">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="w-full bg-slate-800/60 border border-slate-700/50 rounded-lg px-4 py-3 text-white pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleCopy}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              title="Copy code"
            >
              <Copy className="w-5 h-5" />
            </button>
            {copied && (
              <span className="absolute right-12 top-1/2 transform -translate-y-1/2 text-green-400 text-sm">
                Copied!
              </span>
            )}
          </div>
        </div>

        {/* Coin Earning History */}
        <h2 className="text-white text-lg font-semibold mb-4">Coin Earning History</h2>
        
        <div className="space-y-3 mb-6">
          {referrals.map((referral) => (
            <div
              key={referral.id}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 flex items-center justify-between hover:bg-slate-800/60 transition-all duration-300"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center text-2xl">
                  {referral.avatar}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{referral.name}</p>
                  <p className="text-slate-400 text-xs">{referral.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-400 font-semibold">
                <span>+</span>
                <Coins className="w-4 h-4" />
                <span>{referral.coins}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            className="w-8 h-8 rounded-full bg-amber-500/80 hover:bg-amber-500 flex items-center justify-center text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button className="w-8 h-8 rounded-full bg-amber-500/80 hover:bg-amber-500 flex items-center justify-center text-white transition-all">
            1
          </button>
          
          <button className="w-8 h-8 rounded-full bg-slate-700/80 hover:bg-slate-700 flex items-center justify-center text-white transition-all">
            2
          </button>
          
          <span className="text-white px-2">...</span>
          
          <button className="w-8 h-8 rounded-full bg-slate-700/80 hover:bg-slate-700 flex items-center justify-center text-white transition-all">
            6
          </button>
          
          <button
            onClick={() => setCurrentPage(Math.min(6, currentPage + 1))}
            className="w-8 h-8 rounded-full bg-amber-500/80 hover:bg-amber-500 flex items-center justify-center text-white transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Refer Now Button */}
        <button className="w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-all duration-300 shadow-lg text-lg">
          Refer Now
        </button>
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

export default ReferProgramPage;