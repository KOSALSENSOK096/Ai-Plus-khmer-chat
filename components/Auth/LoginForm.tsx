// Code Complete Review: 20240815120000
import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { APP_ROUTES } from '../../constants';
import AppLogo from '../Common/AppLogo'; 
import { useTranslation } from '../../hooks/useTranslation';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const from = location.state?.from?.pathname || APP_ROUTES.CHAT;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const { user, token } = await authService.login(email, password);
      login(token, user);
      navigate(from, { replace: true });
    } catch (err) {
      setError((err as Error).message || t('loginPage.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 p-8 bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
      <AppLogo className="w-32 h-auto mx-auto" />
      <div>
        <h2 className="text-center text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          {t('loginPage.title')}
        </h2>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}
        <Input
          label={t('loginPage.emailLabel')}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label={t('loginPage.passwordLabel')}
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <div>
          <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
            {t('loginPage.button.signIn')}
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        {t('loginPage.noAccount.prefix')}
        <Link to={APP_ROUTES.REGISTER} className="font-medium text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          {t('loginPage.noAccount.link')}
        </Link>
      </p>
    </div>
  );
};

export default LoginForm;