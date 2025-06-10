module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'km'],
    localeDetection: true,
  },
  localePath: './locales',
  reloadOnPrerender: process.env.NODE_ENV === 'development',
}; 