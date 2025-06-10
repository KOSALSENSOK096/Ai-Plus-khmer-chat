// Code Complete Review: 20240815120000
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { APP_ROUTES } from '../../constants'; // APP_NAME is not directly used here anymore
import Button from './Button';
import ThemeToggleButton from './ThemeToggleButton'; 
import AppLogo from './AppLogo'; 
import LanguageToggleButton from './LanguageToggleButton'; // Import LanguageToggleButton
import { useTranslation } from '../../hooks/useTranslation'; // Import useTranslation

const Navbar: React.FC = () => {
  const { isAuthenticated, user, logout, isLoading: authIsLoading } = useAuth(); // Renamed isLoading to authIsLoading
  const navigate = useNavigate();
  const { t, isLoading: translationsLoading } = useTranslation(); // Get t function and translation loading state

  const handleLogout = () => {
    logout();
    navigate(APP_ROUTES.HOME);
  };

  const isLoading = authIsLoading || translationsLoading;

  return (
    <nav 
      className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-300 ease-in-out"
      aria-label="Main site navigation"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={APP_ROUTES.HOME} className="flex items-center text-primary hover:opacity-80 transition-opacity" title={t('navbar.home')}>
              <AppLogo className="h-8 w-auto" />
            </Link>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4">
            {isLoading ? (
              <div className="text-sm text-slate-500 dark:text-slate-400">Loading...</div>
            ) : isAuthenticated && user ? (
              <>
                <Link to={APP_ROUTES.CHAT} className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {t('navbar.chat')}
                </Link>
                <Link to={APP_ROUTES.PLAYGROUND} className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {t('navbar.playground')}
                </Link>
                <Link to={APP_ROUTES.IMAGE_GENERATOR} className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {t('navbar.image_generator')}
                </Link>
                <Link to={APP_ROUTES.FILE_CONVERTER} className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {t('navbar.file_converter')}
                </Link>
                <Link to={APP_ROUTES.PRICING} className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {t('navbar.pricing')}
                </Link>
                <span className="text-sm text-slate-600 dark:text-slate-400 hidden md:block" dangerouslySetInnerHTML={{ __html: t('navbar.welcome', { name: user.name, plan: user.plan }) }}></span>
                <Button onClick={handleLogout} variant="outline" size="sm">
                  {t('navbar.logout')}
                </Button>
              </>
            ) : (
              <>
                <Link to={APP_ROUTES.PRICING} className="text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-blue-500 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  {t('navbar.pricing')}
                </Link>
                <Button onClick={() => navigate(APP_ROUTES.LOGIN)} variant="ghost" size="sm">
                  {t('navbar.login')}
                </Button>
                <Button onClick={() => navigate(APP_ROUTES.REGISTER)} variant="primary" size="sm">
                  {t('navbar.register')}
                </Button>
              </>
            )}
            <ThemeToggleButton />
            <LanguageToggleButton /> {/* Add Language Toggle Button */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;