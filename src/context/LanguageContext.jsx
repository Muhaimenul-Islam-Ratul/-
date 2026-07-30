import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, getTranslation } from '../utils/translations';

const LanguageContext = createContext();

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    return {
      lang: 'bn',
      setLang: () => {},
      t: (key, fallback = '') => fallback || key
    };
  }
  return context;
}

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('amar_takar_hisab_lang') || 'bn';
  });

  const setLang = (newLang) => {
    setLangState(newLang);
    localStorage.setItem('amar_takar_hisab_lang', newLang);
  };

  const t = (key, fallback = '') => {
    return getTranslation(lang, key, fallback);
  };

  const value = {
    lang,
    setLang,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
