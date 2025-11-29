import React, { useState } from "react";

const LANGUAGES = [
  "Bengali",
  "Chinese",
  "English",
  "Hindi",
  "Marathi",
  "Punjabi",
  "Tamil",
  "Telegu",
];

const LanguagePage = () => {
  const [selected, setSelected] = useState("English");

  return (
    <div className="min-h-screen  relative overflow-hidden">
      
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-1/4 w-96 h-96 border border-blue-400/30 rounded-full"></div>
        <div className="absolute top-40 left-1/3 w-64 h-64 border border-blue-300/20 rounded-full"></div>
        <div className="absolute bottom-32 right-1/4 w-80 h-80 border border-amber-400/30 rounded-full"></div>
      </div>

      {/* Stars */}
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
          />
        ))}
      </div>

      <div className="min-h-screen flex flex-col px-4 pt-12 items-center">
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-white font-bold text-2xl mb-2 text-center">Language</h2>
          <p className="text-white text-sm mb-6 text-center font-medium">
            Choose Your Language <span className="text-pink-300">*</span>
          </p>

          <div className="divide-y divide-gray-600 border border-gray-600 rounded-xl backdrop-blur-md bg-white/5">
            {LANGUAGES.map((lang) => (
              <label
                key={lang}
                className="flex items-center justify-between px-5 py-4 cursor-pointer"
              >
                <span className="text-white text-base">{lang}</span>

                {/* Custom Radio Button */}
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition
                    ${selected === lang ? "border-[#C8AC5B]" : "border-gray-400"}`}
                  onClick={() => setSelected(lang)}
                >
                  {selected === lang && (
                    <span className="w-3 h-3 rounded-full bg-[#C8AC5B]"></span>
                  )}
                </span>
              </label>
            ))}
          </div>
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

export default LanguagePage;
