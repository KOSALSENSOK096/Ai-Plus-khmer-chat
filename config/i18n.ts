import { createI18n } from 'next-i18next';
import en from '../locales/en.json';
import km from '../locales/km.json';

const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'km'],
  localeDetection: true,
  localePath: './locales',
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      common: en,
    },
    km: {
      common: km,
    },
  },
};

export const i18n = createI18n(i18nConfig);

export const getStaticPaths = () => ({
  fallback: false,
  paths: [
    { params: { locale: 'en' } },
    { params: { locale: 'km' } },
  ],
});

export const getStaticProps = async ({ params: { locale } }: { params: { locale: string } }) => ({
  props: {
    ...(await i18n.getTranslations(locale, ['common'])),
  },
});

export default i18nConfig; 