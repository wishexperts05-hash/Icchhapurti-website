import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/homePage");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      
      {/* Background */}
      <div className="background-image absolute inset-0"></div>
      <div className="background-dark-overlay absolute inset-0"></div>

      {/* Center Logo with Golden Metal Effect */}
      <div className="relative z-10 logo-wrapper">
        <div className="relative">
          {/* Golden Glow Behind Logo */}
          <div className="absolute inset-0 -inset-8 blur-2xl opacity-60 bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 animate-pulse"></div>
          
          {/* Logo Container */}
          <div className="relative">
            <img
              src="/logo-white.png"
              alt="Logo"
              className="w-40 md:w-98 relative z-10 animate-fade-in"
              style={{
                filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.8)) drop-shadow(0 0 40px rgba(217, 119, 6, 0.6))',
              }}
            />
           
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0%, 100% {
            opacity: 0.6;
            transform: translateX(-2px);
          }
          50% {
            opacity: 1;
            transform: translateX(2px);
          }
        }

        @keyframes shine {
          0% {
            background-position: -200% 0;
          }
          50%, 100% {
            background-position: 200% 0;
          }
        }

        .animate-fade-in {
          animation: fade-in 1.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;