import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/resources'; 

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en', // Fallback language if translation is missing
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
