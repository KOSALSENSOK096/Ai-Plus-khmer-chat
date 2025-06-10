import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import { LanguageProvider } from '../contexts/LanguageContext';
import theme from '../theme';
import { Noto_Sans } from 'next/font/google';
import Head from 'next/head';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

const notoSans = Noto_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  useEffect(() => {
    // 如果没有指定语言，默认使用英语
    if (!router.locale) {
      router.push(router.pathname, router.asPath, { locale: 'en' });
    }
  }, []);

  return (
    <>
      <Head>
        <title>AI Plus Khmer Chat</title>
        <meta name="description" content="Experience the power of AI in both English and Khmer" />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+Khmer:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <style jsx global>{`
        :root {
          --font-noto-sans: ${notoSans.style.fontFamily};
        }
      `}</style>
      <ChakraProvider theme={theme}>
        <LanguageProvider>
          <Component {...pageProps} />
        </LanguageProvider>
      </ChakraProvider>
    </>
  );
}

export default appWithTranslation(MyApp); 