import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '../Locales/en/translation.json';
import soTranslations from '../Locales/so/translation.json';
  
type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);


i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      so: { translation: soTranslations }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

// LanguageProvider.tsx
export const LanguageProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<string>(() => {
    // First try to get from localStorage
    const savedLang = localStorage.getItem('language');
    if (savedLang) return savedLang;
    
    // Then check browser language
    const browserLang = navigator.language.split('-')[0];
    return ['en', 'so'].includes(browserLang) ? browserLang : 'en';
  });

  // This effect will run whenever language changes
  useEffect(() => {
    const changeLanguage = async () => {
      await i18n.changeLanguage(language);
      localStorage.setItem('language', language);
      document.documentElement.lang = language;
    };
    changeLanguage();
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};