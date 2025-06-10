// Code Complete Review: 20240815120000
import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import { LanguageCode, Translations } from '../types';
import { APP_LANGUAGE_KEY } from '../constants';
import { useRouter } from 'next/router';

type LanguageContextType = {
  language: string;
  setLanguage: (lang: string) => void;
};

const defaultLanguage = 'en';

const LanguageContext = createContext<LanguageContextType>({
  language: defaultLanguage,
  setLanguage: () => {},
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

const fetchTranslations = async (language: LanguageCode): Promise<Translations> => {
  try {
    const response = await fetch(`/locales/${language}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${language} translations: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching translations:", error);
    // Fallback to English if the requested language fails to load, and it's not English itself
    if (language !== 'en') {
      try {
        console.warn(`Falling back to English translations.`);
        const enResponse = await fetch(`/locales/en.json`);
        if (!enResponse.ok) {
          throw new Error(`Failed to load fallback English translations: ${enResponse.statusText}`);
        }
        return await enResponse.json();
      } catch (fallbackError) {
        console.error("Error fetching fallback English translations:", fallbackError);
        return {}; // Return empty if English also fails
      }
    }
    return {}; // Return empty if English fails initially
  }
};

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const router = useRouter();
  const [language, setLanguage] = useState(defaultLanguage);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || defaultLanguage;
    setLanguage(savedLanguage);
    if (router.locale !== savedLanguage) {
      router.push(router.pathname, router.asPath, { locale: savedLanguage });
    }
  }, []);

  const handleSetLanguage = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    router.push(router.pathname, router.asPath, { locale: lang });
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};