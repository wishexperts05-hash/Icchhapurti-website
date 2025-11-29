import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';

const LANGUAGES = [
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'zh', name: 'Chinese', native: '中文' },
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'pa', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
];

const LanguagePage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(i18n.language || 'en');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang) {
      setSelected(savedLang);
    }
  }, []);

  const handleLanguageChange = (langCode) => {
    setSelected(langCode);
  };

  const handleSave = () => {
    setSaving(true);
    
    // Change language
    i18n.changeLanguage(selected);
    
    // Save to localStorage
    localStorage.setItem('selectedLanguage', selected);
    
    setTimeout(() => {
      setSaving(false);
      // Optional: Navigate back or show success message
      alert('Language changed successfully!');
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden ">
      
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

      <div className="relative z-10 min-h-screen flex flex-col px-4 pt-12 items-center">
        <div className="w-full max-w-3xl mx-auto">
          <h2 className="text-white font-bold text-2xl sm:text-3xl mb-2 text-center">
            {t('language.title')}
          </h2>
          <p className="text-white text-sm mb-6 text-center font-medium">
            {t('language.subtitle')} <span className="text-pink-300">*</span>
          </p>

          <div className="divide-y divide-gray-600 border border-gray-600 rounded-xl backdrop-blur-md bg-white/5 mb-6">
            {LANGUAGES.map((lang) => (
              <label
                key={lang.code}
                className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-white text-base font-medium">{lang.name}</span>
                  <span className="text-gray-400 text-sm">{lang.native}</span>
                </div>

                {/* Custom Radio Button */}
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition ${
                    selected === lang.code ? "border-[#C9A227]" : "border-gray-400"
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {selected === lang.code && (
                    <span className="w-3 h-3 rounded-full bg-[#C9A227]"></span>
                  )}
                </span>
              </label>
            ))}
          </div>

          {/* Save Button */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 px-6 bg-gradient-to-r from-[#C9A227] to-[#B89020] text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-[#C9A227]/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Saving...
              </>
            ) : (
              <>
                <Check size={20} />
                {t('language.save')}
              </>
            )}
          </button>
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