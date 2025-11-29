import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from './locales/en/translation.json';
import hiTranslation from './locales/hi/translation.json';
// import bnTranslation from './locales/bn/translation.json';
// import taTranslation from './locales/ta/translation.json';
// Import other language files...

const resources = {
  en: { translation: enTranslation },
  hi: { translation: hiTranslation },
  // bn: { translation: bnTranslation },
  // ta: { translation: taTranslation },
  // Add other languages...
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('selectedLanguage') || 'en',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

export default i18n;