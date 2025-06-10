// Code Complete Review: 20240815120000
import React from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslation } from '../../hooks/useTranslation'; // For tooltip

const LanguageToggleButton: React.FC = () => {
  const { currentLanguage, setLanguage, isLoadingTranslations } = useLanguage();
  const { t } = useTranslation();

  if (isLoadingTranslations) {
    return <div className="w-16 h-8 bg-slate-200 dark:bg-slate-700 rounded-md animate-pulse"></div>;
  }

  const toggleLanguage = () => {
    setLanguage(currentLanguage === 'en' ? 'km' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="p-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-slate-800 transition-all duration-150 ease-in-out border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center space-x-1.5"
      aria-label={t('languageToggleButton.tooltip')}
      title={t('languageToggleButton.tooltip')}
    >
      <span className={`px-1.5 py-0.5 rounded-sm ${currentLanguage === 'en' ? 'bg-primary text-white' : 'text-slate-500 dark:text-slate-400'}`}>
        EN
      </span>
      <span className={`px-1.5 py-0.5 rounded-sm ${currentLanguage === 'km' ? 'bg-primary text-white font-khmer' : 'text-slate-500 dark:text-slate-400 font-khmer'}`}>
        ខ្មែរ
      </span>
    </button>
  );
};

export default LanguageToggleButton;