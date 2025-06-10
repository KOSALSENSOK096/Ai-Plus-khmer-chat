// Code Complete Review: 20240815120000
import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../Common/Navbar';
import { APP_ROUTES } from '../../constants';
import { useTranslation } from '../../hooks/useTranslation'; // Import useTranslation

const MainLayout: React.FC = () => {
  const location = useLocation();
  const { t } = useTranslation();
  const isChatPage = location.pathname === APP_ROUTES.CHAT;
  const isPlaygroundPage = location.pathname === APP_ROUTES.PLAYGROUND;

  if (isChatPage || isPlaygroundPage) {
    // For the chat page or playground page, render only the Outlet to allow them to control the full layout
    return <Outlet />;
  }

  return (
    <div className="min-h-screen flex flex-col"> 
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
      <footer className="text-center py-4 text-sm text-gray-500 dark:text-gray-400 border-t border-slate-200 dark:border-slate-700 transition-colors duration-300 ease-in-out">
        {t('footer.copyright', { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
};

export default MainLayout;