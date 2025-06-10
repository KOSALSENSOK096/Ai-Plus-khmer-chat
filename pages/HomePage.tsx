// Code Complete Review: 20240816000000
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Common/Button';
import { APP_ROUTES } from '../constants'; 
import { useAuth } from '../hooks/useAuth';
import AppLogo from '../components/Common/AppLogo'; 
import { useTranslation } from '../hooks/useTranslation'; 

// --- SVG Icons for Features Section (Kept as they are specific to this page's layout) ---
const BilingualChatIcon = ({ className = "w-10 h-10 text-primary dark:text-blue-400 group-hover:text-white transition-colors" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Bilingual Conversations</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C13.18 6.053 14.057 6.5 15 6.5c.944 0 1.82-.447 2.667-.936m0 0V3m0 2.364A48.471 48.471 0 0012 5.25c-2.65.013-5.226.316-7.667.936M3 10.063A48.474 48.474 0 019 9.692m0 0c1.12 0 2.233.038 3.334.114M9 9.692V7.33m3.334 2.475c.846.49 1.723.936 2.667.936.943 0 1.82-.447 2.667-.936m0 0V7.33M9 14.123a48.473 48.473 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 13.753V11.38m3.334 2.474c.846.49 1.723.936 2.667.936.943 0 1.82-.447 2.667-.936m0 0V11.38" />
  </svg>
);

const ImageAnalysisIcon = ({ className = "w-10 h-10 text-primary dark:text-blue-400 group-hover:text-white transition-colors" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Intelligent Image Analysis</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

const DiagramGenerationIcon = ({ className = "w-10 h-10 text-primary dark:text-blue-400 group-hover:text-white transition-colors" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Dynamic Diagram Generation</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h12A2.25 2.25 0 0020.25 14.25V3M3.75 21h16.5M11.25 3.75h1.5m3.75 0h1.5M6.75 21v-5.25A2.25 2.25 0 004.5 13.5H3M17.25 21v-5.25A2.25 2.25 0 0119.5 13.5H21M15 6.75v2.25m-3-3.75v3.75m-3-6v6M3 9h12m6 0h-1.5" />
  </svg>
);

const VoiceInputIcon = ({ className = "w-10 h-10 text-primary dark:text-blue-400 group-hover:text-white transition-colors" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Voice-to-Text Input</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5h0v-6A6 6 0 0112 6v0a6 6 0 016 6v1.5m-6 7.5h0v-6a6 6 0 00-6-6v0a6 6 0 006 6v6zm0-13.5V3A2.25 2.25 0 0114.25 3h1.5A2.25 2.25 0 0118 5.25v1.5m-6 0h0M6 9A2.25 2.25 0 003.75 11.25v1.5A2.25 2.25 0 006 15h0" />
  </svg>
);

const AdvancedAIIcon = ({ className = "w-10 h-10 text-primary dark:text-blue-400" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Advanced AI</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5M12 12h.008v.008H12V12zm0 0H8.25m3.75 0h3.75M12 12v3.75m0-7.5V8.25m0 7.5h3.75m-7.5 0H8.25m7.5 0v3.75m0-7.5V8.25m0 7.5h3.75M3.75 12h4.5m3.75 0h4.5m-4.5 3.75h4.5m-4.5-7.5h4.5m-1.5-1.5h-1.5v-1.5h1.5v1.5zm1.5 0v-1.5m0 3h-1.5v-1.5h1.5v1.5zm1.5 0v-1.5M9 9.75h1.5v1.5H9v-1.5zm-1.5 0v1.5m0-3h1.5v1.5H7.5v-1.5zm-1.5 0v1.5m3-1.5H7.5M9 12.75h1.5v1.5H9v-1.5zm-1.5 0v1.5m0-3h1.5v1.5H7.5v-1.5zm-1.5 0v1.5m3-1.5H7.5" />
  </svg>
);

const InformationCircleIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>Information</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
);

const UserCircleIcon = ({ className = "w-24 h-24" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <title>User Profile</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);


// --- Feature Card Component (Reused for Key Features & Why Choose Us) ---
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
  highlightColor?: string; // e.g., 'hover:border-accent'
}
const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, className = "", highlightColor = 'hover:border-primary' }) => (
  <div className={`group bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl dark:shadow-slate-700/50 dark:hover:shadow-slate-600/60 transform hover:-translate-y-1.5 transition-all duration-300 ease-in-out flex flex-col items-center text-center border-2 border-transparent ${highlightColor} ${className}`}>
    <div className="mb-4 p-3.5 rounded-full bg-blue-100 dark:bg-slate-700 group-hover:bg-primary dark:group-hover:bg-blue-600 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-2">{title}</h3>
    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed flex-grow">{description}</p>
  </div>
);

// --- How It Works Step Component (New) ---
interface HowItWorksStepProps {
  stepNumber: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}
const HowItWorksStep: React.FC<HowItWorksStepProps> = ({ stepNumber, title, description, icon }) => (
  <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-slate-800/80 rounded-xl shadow-xl hover:shadow-primary/30 dark:shadow-slate-700/60 dark:hover:shadow-blue-500/40 transform hover:scale-105 transition-all duration-300 border border-slate-200 dark:border-slate-700">
    <div className="relative mb-4">
      <div className="p-4 bg-gradient-to-br from-primary to-blue-600 dark:from-blue-500 dark:to-blue-700 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold shadow-lg">
        {stepNumber}
      </div>
      <div className="absolute -top-2 -right-2 p-2 bg-accent text-white rounded-full shadow-lg transform group-hover:rotate-12 transition-transform duration-300">
        {icon}
      </div>
    </div>
    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-1.5">{title}</h3>
    <p className="text-sm text-slate-600 dark:text-slate-400">{description}</p>
  </div>
);

// --- Spotlight Card Component (New) ---
interface SpotlightCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  linkText: string;
}
const SpotlightCard: React.FC<SpotlightCardProps> = ({ title, description, icon, link, linkText }) => (
  <div className="bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 dark:from-slate-800 dark:via-slate-800/90 dark:to-black text-white p-6 sm:p-8 rounded-xl shadow-2xl flex flex-col hover:shadow-primary/40 dark:hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-[1.03]">
    <div className="mb-5 text-primary dark:text-blue-400">{icon}</div>
    <h3 className="text-2xl font-bold mb-3">{title}</h3>
    <p className="text-slate-300 dark:text-slate-300 text-sm mb-6 flex-grow">{description}</p>
    <Link to={link}>
      <Button variant="outline" className="w-full !text-white !border-blue-400 hover:!bg-blue-500/30 hover:!border-blue-300 transform hover:scale-105 transition-transform duration-200">
        {linkText}
      </Button>
    </Link>
  </div>
);


// --- Main HomePage Component ---
const HomePage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t, isLoading: translationsLoading } = useTranslation();

  const handleExploreFeaturesClick = () => {
    const featureSection = document.getElementById('key-features-section');
    if (featureSection) {
      featureSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  if (translationsLoading) {
    return <div className="flex justify-center items-center h-screen bg-slate-50 dark:bg-slate-900"><p className="text-slate-700 dark:text-slate-200">Loading content...</p></div>;
  }

  const appName = t('app.name');

  return (
    <div className="space-y-24 md:space-y-32 py-12 md:py-16 bg-slate-50 dark:bg-slate-900 overflow-x-hidden">
      {/* Hero Section */}
      <section className="text-center px-4 relative overflow-hidden pb-10 pt-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-emerald-500/5 dark:from-blue-700/10 dark:via-transparent dark:to-emerald-700/10"></div>
          <div className="absolute -top-1/3 -left-1/4 w-3/5 h-3/5 bg-blue-400/10 dark:bg-blue-600/20 rounded-full filter blur-3xl opacity-60 animate-[pulse_8s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
          <div className="absolute -bottom-1/3 -right-1/4 w-3/5 h-3/5 bg-emerald-400/10 dark:bg-emerald-600/20 rounded-full filter blur-3xl opacity-60 animate-[pulse_10s_cubic-bezier(0.4,0,0.6,1)_infinite_2s]"></div>
        </div>
        
        <div className="relative inline-block mb-6 sm:mb-8 animate-fadeInUp">
            <AppLogo className="h-auto w-56 sm:w-64 md:w-72 lg:w-80 drop-shadow-xl" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-accent dark:from-blue-400 dark:via-blue-300 dark:to-emerald-400 mb-5 leading-tight tracking-tight animate-fadeInUp animation-delay-200">
          {t('homePage.hero.title', { appName })}
        </h1>
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-10 animate-fadeInUp animation-delay-400">
          {t('homePage.hero.subtitle')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-5 animate-fadeInUp animation-delay-600">
          <Link to={APP_ROUTES.CHAT}>
            <Button size="lg" variant="primary" className="px-8 py-3.5 text-lg shadow-lg hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 ease-out">
              {t('homePage.hero.button.startChatting')}
            </Button>
          </Link>
          <Link to={APP_ROUTES.PRICING}>
            <Button size="lg" variant="outline" className="px-8 py-3.5 text-lg shadow-lg hover:shadow-slate-400/30 dark:hover:shadow-slate-600/30 transform hover:scale-105 transition-all duration-300 ease-out">
              {t('homePage.hero.button.viewPricing')}
            </Button>
          </Link>
        </div>
        {!isAuthenticated && (
          <div className="mt-12 max-w-xl mx-auto p-4 rounded-lg bg-blue-100/70 dark:bg-blue-900/50 border border-primary/50 dark:border-blue-500/50 shadow-md animate-fadeInUp animation-delay-800">
            <div className="flex items-center">
              <InformationCircleIcon className="w-6 h-6 text-primary dark:text-blue-300 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                {t('homePage.hero.authPrompt.prefix')}
                <Link to={APP_ROUTES.LOGIN} className="font-bold hover:underline text-primary dark:text-blue-300">
                  {t('homePage.hero.authPrompt.loginLink')}
                </Link>
                {t('homePage.hero.authPrompt.separator')}
                <Link to={APP_ROUTES.REGISTER} className="font-bold hover:underline text-primary dark:text-blue-300">
                  {t('homePage.hero.authPrompt.registerLink')}
                </Link>
                {t('homePage.hero.authPrompt.suffix', { appName })}
              </p>
            </div>
          </div>
        )}
      </section>

      {/* How It Works Section */}
      <section className="px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">{t('homePage.howItWorks.title', { appName })}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <HowItWorksStep 
            stepNumber="1"
            title={t('homePage.howItWorks.step1.title')}
            description={t('homePage.howItWorks.step1.description')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><title>User Account</title><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>}
          />
          <HowItWorksStep 
            stepNumber="2"
            title={t('homePage.howItWorks.step2.title')}
            description={t('homePage.howItWorks.step2.description')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><title>Choose Tool</title><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>}
          />
          <HowItWorksStep 
            stepNumber="3"
            title={t('homePage.howItWorks.step3.title')}
            description={t('homePage.howItWorks.step3.description')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><title>Interact with AI</title><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5M12 12h.008v.008H12V12zm0 0H8.25m3.75 0h3.75M12 12v3.75m0-7.5V8.25m0 7.5h3.75m-7.5 0H8.25m7.5 0v3.75m0-7.5V8.25m0 7.5h3.75M3.75 12h4.5m3.75 0h4.5m-4.5 3.75h4.5m-4.5-7.5h4.5" /></svg>}
          />
          <HowItWorksStep 
            stepNumber="4"
            title={t('homePage.howItWorks.step4.title')}
            description={t('homePage.howItWorks.step4.description')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><title>Get Smart Results</title><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
          />
        </div>
      </section>

      {/* Feature Spotlight Section */}
      <section className="px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">{t('homePage.featureSpotlight.title')}</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <SpotlightCard
            title={t('homePage.featureSpotlight.codePlayground.title')}
            description={t('homePage.featureSpotlight.codePlayground.description')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><title>Code Playground</title><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0021 18V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v12a2.25 2.25 0 002.25 2.25z" /></svg>}
            link={APP_ROUTES.PLAYGROUND}
            linkText={t('homePage.featureSpotlight.codePlayground.link')}
          />
          <SpotlightCard
            title={t('homePage.featureSpotlight.imageGenerator.title')}
            description={t('homePage.featureSpotlight.imageGenerator.description')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><title>Image Generator</title><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" /></svg>}
            link={APP_ROUTES.IMAGE_GENERATOR}
            linkText={t('homePage.featureSpotlight.imageGenerator.link')}
          />
          <SpotlightCard
            title={t('homePage.featureSpotlight.fileConverter.title')}
            description={t('homePage.featureSpotlight.fileConverter.description')}
            icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10"><title>File Converter</title><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>}
            link={APP_ROUTES.FILE_CONVERTER}
            linkText={t('homePage.featureSpotlight.fileConverter.link')}
          />
        </div>
      </section>

      {/* Key Features Section */}
      <section id="key-features-section" className="px-4">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">{t('homePage.features.title')}</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<BilingualChatIcon />}
            title={t('homePage.features.bilingual.title')}
            description={t('homePage.features.bilingual.description')}
            highlightColor="hover:border-blue-500"
          />
          <FeatureCard
            icon={<ImageAnalysisIcon />}
            title={t('homePage.features.imageAnalysis.title')}
            description={t('homePage.features.imageAnalysis.description')}
            highlightColor="hover:border-emerald-500"
          />
          <FeatureCard
            icon={<DiagramGenerationIcon />}
            title={t('homePage.features.diagramGeneration.title')}
            description={t('homePage.features.diagramGeneration.description')}
            highlightColor="hover:border-purple-500"
          />
          <FeatureCard
            icon={<VoiceInputIcon />}
            title={t('homePage.features.voiceInput.title')}
            description={t('homePage.features.voiceInput.description')}
            highlightColor="hover:border-orange-500"
          />
        </div>
      </section>
      
      {/* Meet the Creator Section */}
      <section className="px-4 py-16 bg-gradient-to-b from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-800/80">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-8">
            {t('homePage.meetTheCreator.title')}
          </h2>
          <div className="bg-white dark:bg-slate-700/80 p-8 rounded-xl shadow-2xl dark:shadow-slate-900/50 flex flex-col md:flex-row items-center gap-8 md:gap-12 transform hover:scale-[1.02] transition-transform duration-300">
            <div className="flex-shrink-0">
              {/* Placeholder for creator image - using a generic user icon for now */}
              <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg transform group-hover:scale-105 transition-transform duration-300">
                 <UserCircleIcon className="w-32 h-32 text-white opacity-80" />
              </div>
            </div>
            <div className="text-left">
              <h3 className="text-3xl font-bold text-primary dark:text-blue-400 mb-2">
                {t('homePage.meetTheCreator.name')}
              </h3>
              <p className="text-md text-slate-600 dark:text-slate-300 leading-relaxed">
                {t('homePage.meetTheCreator.bio')}
              </p>
              <p className="mt-4 text-sm italic text-slate-500 dark:text-slate-400">
                "Empowering communication, one line of code at a time."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-slate-100 dark:bg-slate-800/60 py-16 sm:py-20 px-4 rounded-lg mx-2 md:mx-4 shadow-inner dark:shadow-slate-900/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-800 dark:text-slate-100 mb-12">{t('homePage.whyChooseUs.title', { appName })}</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary dark:text-blue-400 group-hover:text-white transition-colors"><title>User-Friendly Interface</title><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>}
              title={t('homePage.whyChooseUs.userFriendly.title')}
              description={t('homePage.whyChooseUs.userFriendly.description')}
              className="!shadow-slate-300/50 dark:!shadow-slate-900/40"
              highlightColor="hover:border-teal-500"
            />
            <FeatureCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary dark:text-blue-400 group-hover:text-white transition-colors"><title>Cutting-Edge AI</title><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5M12 12h.008v.008H12V12zm0 0H8.25m3.75 0h3.75M12 12v3.75m0-7.5V8.25m0 7.5h3.75m-7.5 0H8.25m7.5 0v3.75m0-7.5V8.25m0 7.5h3.75M3.75 12h4.5m3.75 0h4.5m-4.5 3.75h4.5m-4.5-7.5h4.5" /></svg>}
              title={t('homePage.whyChooseUs.cuttingEdgeAI.title')}
              description={t('homePage.whyChooseUs.cuttingEdgeAI.description')}
              className="!shadow-slate-300/50 dark:!shadow-slate-900/40"
               highlightColor="hover:border-fuchsia-500"
            />
            <FeatureCard
              icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-primary dark:text-blue-400 group-hover:text-white transition-colors"><title>Secure & Private</title><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>}
              title={t('homePage.whyChooseUs.securePrivate.title')}
              description={t('homePage.whyChooseUs.securePrivate.description')}
              className="!shadow-slate-300/50 dark:!shadow-slate-900/40"
               highlightColor="hover:border-rose-500"
            />
          </div>
        </div>
      </section>

      {/* Discover Section */}
      <section className="px-4">
          <div className="max-w-5xl mx-auto bg-gradient-to-r from-primary via-blue-600 to-accent dark:from-blue-700 dark:via-blue-600 dark:to-emerald-600 p-10 sm:p-12 rounded-xl shadow-2xl text-white transform hover:shadow-primary/50 dark:hover:shadow-blue-500/50 transition-all duration-300 ease-in-out hover:scale-[1.01]">
              <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6">{t('homePage.discover.title', { appName })}</h2>
              <p className="text-lg text-center mb-10 text-blue-100 dark:text-blue-200">
                  {t('homePage.discover.subtitle', { appName })}
              </p>
              <div className="flex justify-center">
                  <Button
                      size="lg"
                      variant="outline"
                      className="!bg-white !text-primary hover:!bg-blue-50 dark:!bg-slate-100 dark:!text-primary dark:hover:!bg-slate-200 px-10 py-3 text-lg shadow-xl transform hover:scale-105 transition-all duration-300 ease-out"
                      onClick={handleExploreFeaturesClick}
                      title="Explore Features"
                    >
                      {t('homePage.discover.button.explore')}
                  </Button>
              </div>
          </div>
      </section>

      {/* Powered by AI Section */}
      <section className="px-4 py-8">
        <div className="flex flex-col items-center text-center">
          <AdvancedAIIcon className="w-12 h-12 text-primary dark:text-blue-400 opacity-80" />
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mt-4 mb-2">
            {t('homePage.poweredByAI.title')}
          </h3>
          <p className="text-md text-slate-600 dark:text-slate-400 max-w-lg">
            {t('homePage.poweredByAI.subtitle', { appName })}
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
