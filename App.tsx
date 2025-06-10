// Code Complete Review: 20240815120000
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import ChatPage from '@/pages/ChatPage';
import PricingPage from '@/pages/PricingPage';
import MainLayout from '@/components/Layout/MainLayout';
import ProtectedRoute from '@/components/Layout/ProtectedRoute';
import { APP_ROUTES } from '@/constants';
import { PaymentInstructionsPage } from '@/pages/PaymentInstructionsPage'; // Changed back to named import
import StripeCheckoutPage from '@/pages/StripeCheckoutPage'; // Import the new page
import CodePlaygroundPage from '@/pages/CodePlaygroundPage';
import ImageGeneratorPage from '@/pages/ImageGeneratorPage';
import FileConverterPage from '@/pages/FileConverterPage';
import mermaid from 'mermaid';
import { useLanguage } from './hooks/useLanguage'; // Import useLanguage

const App: React.FC = () => {
  const { currentLanguage } = useLanguage(); // Get current language

  useEffect(() => {
    try {
      mermaid.initialize({ 
        startOnLoad: false,
      });
      console.log("Mermaid.js initialized globally.");
    } catch (error) {
      console.error("Failed to initialize Mermaid.js globally:", error);
    }
  }, []);

  useEffect(() => {
    // Update the lang attribute on the html tag whenever the language changes
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  return (
    <HashRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={APP_ROUTES.HOME} element={<HomePage />} />
          <Route path={APP_ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={APP_ROUTES.REGISTER} element={<RegisterPage />} />
          <Route path={APP_ROUTES.PRICING} element={<PricingPage />} />
          <Route path={APP_ROUTES.PAYMENT_INSTRUCTIONS} element={<PaymentInstructionsPage />} />
          <Route 
            path={APP_ROUTES.STRIPE_CHECKOUT} 
            element={
              <ProtectedRoute>
                <StripeCheckoutPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={APP_ROUTES.CHAT} 
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={APP_ROUTES.PLAYGROUND} 
            element={
              <ProtectedRoute>
                <CodePlaygroundPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={APP_ROUTES.IMAGE_GENERATOR} 
            element={
              <ProtectedRoute>
                <ImageGeneratorPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={APP_ROUTES.FILE_CONVERTER} 
            element={
              <ProtectedRoute>
                <FileConverterPage />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to={APP_ROUTES.HOME} replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;