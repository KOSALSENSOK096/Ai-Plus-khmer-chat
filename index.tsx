// Code Complete Review: 20240815120000
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App'; // Changed to aliased path
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext'; // Import ThemeProvider
import { LanguageProvider } from './contexts/LanguageContext'; // Import LanguageProvider

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <LanguageProvider> {/* LanguageProvider wraps AuthProvider and App */}
        <AuthProvider>
          <App />
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </React.StrictMode>
);