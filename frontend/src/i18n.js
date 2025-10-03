import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// ✅ Only English for now
import en from './locales/en.json';

const resources = {
  en: {
    translation: en,
  },
  // other languages can be added later like:
  // hi: { translation: hi },
  // fr: { translation: fr },
};

i18n
  .use(LanguageDetector)   // detects browser language
  .use(initReactI18next)   // integrates with react
  .init({
    resources,
    fallbackLng: 'en',     // fallback to English
    debug: true,
    interpolation: {
      escapeValue: false,  // react already escapes
    },
  });

export default i18n;

