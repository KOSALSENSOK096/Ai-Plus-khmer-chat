// Code Complete Review: 20240815120000
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { authService } from '../../services/authService';
import Input from '../Common/Input';
import Button from '../Common/Button';
import { APP_ROUTES } from '../../constants';
import AppLogo from '../Common/AppLogo'; 
import { useTranslation } from '../../hooks/useTranslation';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('registerPage.error.passwordMismatch'));
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const { user, token } = await authService.register(name, email, password);
      login(token, user);
      navigate(APP_ROUTES.CHAT);
    } catch (err) {
      setError((err as Error).message || t('registerPage.error.generic'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full space-y-6 p-8 bg-white dark:bg-slate-800 shadow-xl dark:shadow-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700">
      <AppLogo className="w-32 h-auto mx-auto" />
      <div>
        <h2 className="text-center text-3xl font-extrabold text-slate-800 dark:text-slate-100">
          {t('registerPage.title')}
        </h2>
      </div>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {error && <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">{error}</div>}
        <Input
          label={t('registerPage.nameLabel')}
          name="name"
          type="text"
          autoComplete="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('registerPage.nameLabel')}
        />
        <Input
          label={t('registerPage.emailLabel')}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />
        <Input
          label={t('registerPage.passwordLabel')}
          name="password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
        />
        <Input
          label={t('registerPage.confirmPasswordLabel')}
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />
        <div>
          <Button type="submit" className="w-full" isLoading={isLoading} disabled={isLoading}>
            {t('registerPage.button.register')}
          </Button>
        </div>
      </form>
      <p className="text-center text-sm text-slate-600 dark:text-slate-400">
        {t('registerPage.hasAccount.prefix')}
        <Link to={APP_ROUTES.LOGIN} className="font-medium text-primary hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
          {t('registerPage.hasAccount.link')}
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;