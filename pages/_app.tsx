import { AppProps } from 'next/app';
import { ChakraProvider } from '@chakra-ui/react';
import { appWithTranslation } from 'next-i18next';
import theme from '../theme';
import { Noto_Sans } from 'next/font/google';
import Head from 'next/head';

const notoSans = Noto_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
});

function MyApp({ Component, pageProps }: AppProps) {
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
        <Component {...pageProps} />
      </ChakraProvider>
    </>
  );
}

export default appWithTranslation(MyApp); 