// Code Complete Review: 20240815120000
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { LanguageCode, Translations } from '../types';
import { APP_LANGUAGE_KEY } from '../constants';

interface LanguageContextType {
  currentLanguage: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  translations: Translations;
  isLoadingTranslations: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

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


export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguageState] = useState<LanguageCode>(() => {
    const storedLanguage = localStorage.getItem(APP_LANGUAGE_KEY) as LanguageCode | null;
    return storedLanguage || 'en'; // Default to English
  });
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoadingTranslations, setIsLoadingTranslations] = useState(true);

  useEffect(() => {
    setIsLoadingTranslations(true);
    fetchTranslations(currentLanguage).then(loadedTranslations => {
      setTranslations(loadedTranslations);
      setIsLoadingTranslations(false);
    });
    document.documentElement.lang = currentLanguage; // Set lang attribute on HTML tag
  }, [currentLanguage]);

  const setLanguage = useCallback((language: LanguageCode) => {
    localStorage.setItem(APP_LANGUAGE_KEY, language);
    setCurrentLanguageState(language);
  }, []);

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translations, isLoadingTranslations }}>
      {children}
    </LanguageContext.Provider>
  );
};