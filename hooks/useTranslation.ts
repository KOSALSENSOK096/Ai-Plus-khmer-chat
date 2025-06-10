// Code Complete Review: 20240815120000
import { useLanguage } from './useLanguage';
import { TranslationKey, Translations } from '../types';

interface TranslationFunction {
  (key: TranslationKey, replacements?: Record<string, string | number>): string;
}

export const useTranslation = (): { t: TranslationFunction; lang: string; isLoading: boolean } => {
  const { currentLanguage, translations, isLoadingTranslations } = useLanguage();

  const t: TranslationFunction = (key, replacements) => {
    let translatedString = translations[key] || key; // Fallback to key if translation not found

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        const regex = new RegExp(`{{${placeholder}}}`, 'g');
        translatedString = translatedString.replace(regex, String(replacements[placeholder]));
      });
    }
    return translatedString;
  };

  return { t, lang: currentLanguage, isLoading: isLoadingTranslations };
};