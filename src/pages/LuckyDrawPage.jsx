import React, { useState } from 'react';
import { Gift, Trophy, Clock } from 'lucide-react';

const LuckyDrawPage = () => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const prizes = [
    'WIN', 'BETTER LUCK', 'WIN', 'BETTER LUCK', 
    'WIN', 'BETTER LUCK', 'WIN', 'BETTER LUCK'
  ];

  const tickets = [
    { id: 1, title: 'You just won', amount: 600, status: 'won', image: '🎫' },
    { id: 2, title: 'You just won', amount: 500, status: 'won', image: '🎫' },
    { id: 3, title: 'You just won', amount: 500, status: 'won', image: '🎫' },
    { id: 4, title: 'Better Luck Next Time', status: 'lost', image: '🎫' },
    { id: 5, title: 'Better Luck Next Time', status: 'lost', image: '🎫' },
    { id: 6, title: 'Better Luck Next Time', status: 'lost', image: '🎫' },
  ];

  const handleSpin = () => {
    if (spinning) return;
    
    setSpinning(true);
    const newRotation = rotation + 360 * 5 + Math.random() * 360;
    setRotation(newRotation);
    
    setTimeout(() => {
      setSpinning(false);
    }, 4000);
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
      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Lucky Draw</h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Gift Banner */}
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg p-8 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-yellow-300/20"></div>
            <div className="relative flex gap-4 items-end">
              <div className="text-6xl animate-bounce" style={{animationDelay: '0s'}}>🎁</div>
              <div className="text-7xl animate-bounce" style={{animationDelay: '0.1s'}}>🎁</div>
              <div className="text-5xl animate-bounce" style={{animationDelay: '0.2s'}}>🎁</div>
              <div className="text-6xl animate-bounce" style={{animationDelay: '0.3s'}}>🎁</div>
            </div>
          </div>

          {/* Spinning Wheel */}
          <div className="flex items-center justify-center">
            <div className="relative w-64 h-64">
              {/* Pointer */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20">
                <div className="w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[25px] border-t-white"></div>
              </div>
              
              {/* Wheel */}
              <div 
                className="w-64 h-64 rounded-full relative shadow-2xl transition-transform duration-[4000ms] ease-out"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  background: 'conic-gradient(from 0deg, #dc2626 0deg 45deg, #fbbf24 45deg 90deg, #dc2626 90deg 135deg, #fbbf24 135deg 180deg, #dc2626 180deg 225deg, #fbbf24 225deg 270deg, #dc2626 270deg 315deg, #fbbf24 315deg 360deg)'
                }}
              >
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center z-10">
                  <button 
                    onClick={handleSpin}
                    disabled={spinning}
                    className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full text-white font-bold text-xs shadow-lg hover:scale-110 transition-transform disabled:opacity-50"
                  >
                    SPIN
                  </button>
                </div>

                {/* Prize segments text */}
                {prizes.map((prize, i) => (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 origin-left"
                    style={{
                      transform: `rotate(${i * 45 + 22.5}deg) translateX(70px)`,
                      width: '60px'
                    }}
                  >
                    <span className="text-white text-xs font-bold whitespace-nowrap block" style={{transform: 'rotate(-90deg)'}}>
                      {prize}
                    </span>
                  </div>
                ))}
              </div>

              {/* Decorative dots around wheel */}
              <div className="absolute -inset-4 rounded-full border-4 border-dashed border-amber-400/30"></div>
            </div>
          </div>
        </div>

        {/* Your Lucky Draw Tickets */}
        <h2 className="text-white text-xl font-semibold mb-4">Your Lucky Draw Tickets</h2>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg overflow-hidden hover:bg-slate-800/60 transition-all duration-300"
            >
              {/* Ticket Image */}
              <div className="relative h-40 bg-gradient-to-br from-red-800 to-red-900 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,215,0,0.3),transparent_50%)]"></div>
                </div>
                <div className="relative text-center">
                  <div className="text-6xl mb-2">🎫</div>
                  <div className="bg-yellow-400 text-red-900 font-bold px-4 py-1 rounded-full text-sm">
                    SCRATCH TO WIN
                  </div>
                </div>
              </div>

              {/* Ticket Info */}
              <div className="p-4 text-center">
                {ticket.status === 'won' ? (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <p className="text-amber-400 font-semibold">{ticket.title}</p>
                    </div>
                    <p className="text-white text-2xl font-bold">₹ {ticket.amount}</p>
                    <p className="text-slate-400 text-xs mt-1">congratulations</p>
                  </>
                ) : (
                  <>
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Clock className="w-5 h-5 text-slate-400" />
                      <p className="text-slate-300 font-semibold text-sm">{ticket.title}</p>
                    </div>
                    <p className="text-slate-500 text-xs">Try again next time!</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2, 3, 4].map((i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === 0 ? 'bg-amber-400 w-6' : 'bg-slate-600'
              }`}
            ></button>
          ))}
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

export default LuckyDrawPage;