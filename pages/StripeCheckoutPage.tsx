
// Code Complete Review: 20240816100000
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PricingPlanDetails, UserPlan } from '@/types';
import { paymentService } from '@/services/paymentService';
import { APP_ROUTES } from '@/constants';
import Button from '@/components/Common/Button';
import Input from '@/components/Common/Input';
import AppLogo from '@/components/Common/AppLogo';
import { useTranslation } from '@/hooks/useTranslation';
import LoadingSpinner from '@/components/Common/LoadingSpinner';

// --- Icon Props ---
interface IconProps {
  className?: string;
}

// --- Icons ---
const ArrowLeftIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Back</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
  </svg>
);

const LockClosedIcon: React.FC<IconProps> = ({ className = "w-4 h-4 mr-1.5 text-slate-500" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Secure Payment</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25-2.25v6.75a2.25 2.25 0 002.25 2.25z" />
  </svg>
);

const CreditCardIcon: React.FC<IconProps> = ({ className = "w-6 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <title>Credit Card</title>
    <path d="M21.75 9.75H2.25a.75.75 0 000 1.5H4.5v3.75a.75.75 0 01-1.5 0V11.25H2.25a.75.75 0 000 1.5H3v3.75a.75.75 0 01-1.5 0V12.75H.75a.75.75 0 000 1.5H3V18a.75.75 0 00.75.75h16.5A.75.75 0 0021 18v-3.75h.75a.75.75 0 000-1.5H21V9a.75.75 0 00-.75-.75H3.75A.75.75 0 003 9v.75H2.25a.75.75 0 000-1.5h.75V6A.75.75 0 003 5.25H2.25a.75.75 0 000 1.5h.75v3H21a.75.75 0 00.75-.75v-.75zm-19.5-3h16.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25-2.25H3.75a2.25 2.25 0 01-2.25-2.25V8.25c0-1.24 1.01-2.25 2.25-2.25z" />
  </svg>
);

const AlipayIcon: React.FC<IconProps> = ({ className = "w-6 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <title>Alipay</title>
    <path d="M4 4h16v16H4V4z" fill="#00A1E9"></path>
    <path d="M12 5.5c-3.86 0-7 2.91-7 6.5s3.14 6.5 7 6.5 7-2.91 7-6.5-3.14-6.5-7-6.5zm0 11c-2.76 0-5-1.79-5-4.5s2.24-4.5 5-4.5 5 1.79 5 4.5-2.24 4.5-5 4.5z" fill="white"></path>
    <path d="M12 8a.5.5 0 00-.5.5v2.5h-2a.5.5 0 000 1h2.5v2a.5.5 0 001 0v-2.5h2a.5.5 0 000-1h-2.5V8.5a.5.5 0 00-.5-.5z" fill="white"></path>
  </svg>
);

const CashAppIcon: React.FC<IconProps> = ({ className = "w-6 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <title>Cash App Pay</title>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 14.5h-2v-7h2v7zm4 0h-2v-7h2v7zm-2-8.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#00D632"></path>
  </svg>
);

const BankIcon: React.FC<IconProps> = ({ className = "w-6 h-5" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
    <title>Bank</title>
    <path d="M3.75 3A1.75 1.75 0 002 4.75v.75h20v-.75A1.75 1.75 0 0020.25 3H3.75z" />
    <path fillRule="evenodd" d="M2 7.5h20v10.5a.75.75 0 01-.75.75H2.75a.75.75 0 01-.75-.75V7.5zm6.75 1.5a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
  </svg>
);


const mockCountries = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "GB", name: "United Kingdom" },
  { code: "AU", name: "Australia" },
  { code: "KH", name: "Cambodia" },
];

const StripeCheckoutPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUserPlan } = useAuth(); 
  const { t } = useTranslation();

  const [selectedPlan, setSelectedPlan] = useState<PricingPlanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'alipay' | 'cashapp' | 'bank'>('card');
  
  const [cardholderName, setCardholderName] = useState(user.name);
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiryDate, setExpiryDate] = useState('12 / 29');
  const [cvc, setCvc] = useState('123');
  const [billingCountry, setBillingCountry] = useState(mockCountries.find(c => c.code === 'KH')?.code || mockCountries[0].code);
  const [addressLine1, setAddressLine1] = useState('123 Mock Street');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('Mockville');
  const [postalCode, setPostalCode] = useState('12345');
  
  useEffect(() => {
    if (location.state && location.state.plan) {
      const planFromState = location.state.plan as PricingPlanDetails;
      if (planFromState.id === UserPlan.FREE) {
        navigate(APP_ROUTES.PRICING);
      } else {
        setSelectedPlan(planFromState);
      }
    } else {
      navigate(APP_ROUTES.PRICING);
    }
  }, [location.state, navigate]);

   useEffect(() => {
    if (user.name !== cardholderName) {
      setCardholderName(user.name);
    }
  }, [user.name, cardholderName]);

  useEffect(() => {
    if (paymentMethod !== 'card') {
      setError(t('stripeCheckoutPage.error.paymentMethodNotImplementedFull', { method: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) }));
    } else {
      // Clear error only if it was the "not implemented" error. 
      // Don't clear other potential form errors like missing card fields.
      // However, for this specific change, we want to clear it when switching back to card.
      setError(null);
    }
  }, [paymentMethod, t]);


  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedPlan) return;
    
    if (paymentMethod !== 'card') {
        // Error is already set by useEffect, so just return
        return;
    }

    // Validation for required card fields (only if paymentMethod is 'card')
    if (!cardholderName || !cardNumber || !expiryDate || !cvc || !billingCountry || !addressLine1 || !city || !postalCode) {
        setError(t('stripeCheckoutPage.error.missingCardFields'));
        return;
    }
    if (!/^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(cardNumber.replace(/\s/g, ''))) {
         setError(t('stripeCheckoutPage.error.invalidCardNumber'));
         return;
    }
    if (!/^(0[1-9]|1[0-2])\s?\/\s?\d{2}$/.test(expiryDate)) {
        setError(t('stripeCheckoutPage.error.invalidExpiry'));
        return;
    }
    if (!/^\d{3,4}$/.test(cvc)) {
        setError(t('stripeCheckoutPage.error.invalidCvc'));
        return;
    }
    
    setIsLoading(true);
    setError(null); // Clear any previous validation errors before submitting
    
    try {
      const result = await paymentService.processPaymentAndUpgrade(user.id, selectedPlan.id as UserPlan, `Mock ${paymentMethod}`);
      if (result.success) {
        updateUserPlan(selectedPlan.id as UserPlan);
        alert(t('stripeCheckoutPage.success.alert', { planName: selectedPlan.name }));
        navigate(APP_ROUTES.CHAT); 
      } else {
        setError(result.message || t('stripeCheckoutPage.error.paymentFailed'));
      }
    } catch (err) {
      setError((err as Error).message || t('stripeCheckoutPage.error.unexpected'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPlan) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-900">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const planPriceNumeric = parseFloat(selectedPlan.price.replace('$', ''));
  const mockTaxRate = 0.00; 
  const taxAmount = planPriceNumeric * mockTaxRate;
  const totalAmount = planPriceNumeric + taxAmount;

  const isSubscribeButtonDisabled = isLoading || paymentMethod !== 'card';
  let subscribeButtonTitle = t('stripeCheckoutPage.subscribeNowButton', { amount: `$${totalAmount.toFixed(2)}` });
  if (isLoading) {
    subscribeButtonTitle = "Processing...";
  } else if (paymentMethod !== 'card') {
    subscribeButtonTitle = t('stripeCheckoutPage.error.paymentMethodNotImplementedFull', { method: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1) });
  }


  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white dark:bg-slate-950">
      {/* Left Panel (Dark) */}
      <div className="w-full md:w-2/5 lg:w-1/3 bg-slate-900 text-slate-200 p-6 sm:p-8 flex flex-col justify-between">
        <div>
          <div className="mb-8">
            <Button variant="ghost" onClick={() => navigate(APP_ROUTES.PRICING)} className="!text-slate-300 hover:!text-white !px-0">
              <ArrowLeftIcon />
              <span className="ml-2">{t('stripeCheckoutPage.backToPricing')}</span>
            </Button>
          </div>
          <div className="flex items-center mb-6">
            <AppLogo className="h-10 w-auto mr-3"/>
            <h1 className="text-2xl font-semibold text-white">{t('stripeCheckoutPage.subscribeTo', { planName: selectedPlan.name })}</h1>
          </div>
          
          <div className="mb-6 p-4 bg-slate-800 rounded-lg">
            <h2 className="text-xl font-medium text-white mb-1">{selectedPlan.name}</h2>
            <p className="text-3xl font-bold text-blue-400 mb-2">{selectedPlan.price} <span className="text-base font-normal text-slate-400">/{t('stripeCheckoutPage.month')}</span></p>
            <p className="text-sm text-slate-400">{t('stripeCheckoutPage.billedMonthly')}</p>
          </div>

          {selectedPlan.features.slice(0, 3).map((feature, index) => (
            <p key={index} className="text-sm text-slate-300 mb-1.5 flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-emerald-400 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
              {feature}
            </p>
          ))}
           {selectedPlan.features.length > 3 && <p className="text-xs text-slate-400 mt-1.5">...and more features.</p>}

        </div>
        <div className="mt-8 border-t border-slate-700 pt-6">
          <div className="flex justify-between text-sm text-slate-300 mb-1.5">
            <span>{t('stripeCheckoutPage.subtotal')}</span>
            <span>${planPriceNumeric.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-300 mb-3">
            <span>{t('stripeCheckoutPage.tax')} <span className="text-xs text-slate-500">({(mockTaxRate * 100).toFixed(0)}%)</span></span>
            <span>${taxAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-white">
            <span>{t('stripeCheckoutPage.totalDueToday')}</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Right Panel (Light) */}
      <div className="w-full md:w-3/5 lg:w-2/3 bg-white dark:bg-slate-50 p-6 sm:p-10 md:p-12 lg:p-16 overflow-y-auto">
        <form onSubmit={handlePaymentSubmit}>
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-800 mb-4">{t('stripeCheckoutPage.contactInformation')}</h2>
            <Input
              label={t('stripeCheckoutPage.emailAddress')}
              type="email"
              value={user?.email || ''}
              readOnly
              disabled
              className="bg-slate-100 dark:!bg-slate-200 !text-slate-500 dark:!text-slate-600 cursor-not-allowed"
            />
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-800 mb-4">{t('stripeCheckoutPage.paymentMethod')}</h2>
            <div className="space-y-3">
                {[
                    {id: 'card', label: t('stripeCheckoutPage.paymentMethods.card'), icon: <CreditCardIcon className="text-blue-600 dark:text-blue-500" />},
                    {id: 'alipay', label: t('stripeCheckoutPage.paymentMethods.alipay'), icon: <AlipayIcon />},
                    {id: 'cashapp', label: t('stripeCheckoutPage.paymentMethods.cashAppPay'), icon: <CashAppIcon />},
                    {id: 'bank', label: t('stripeCheckoutPage.paymentMethods.bank'), icon: <BankIcon className="text-slate-700 dark:text-slate-600"/>, note: t('stripeCheckoutPage.paymentMethods.bankNote')},
                ].map(method => (
                    <button
                        key={method.id}
                        type="button"
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`w-full flex items-center p-3.5 border rounded-lg transition-all duration-150 text-left
                                    ${paymentMethod === method.id 
                                        ? 'border-blue-500 ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500' 
                                        : 'border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:hover:border-slate-500 bg-white dark:bg-slate-100/80'
                                    }`}
                    >
                        <span className="mr-3">{method.icon}</span>
                        <span className="font-medium text-slate-700 dark:text-slate-700">{method.label}</span>
                        {method.note && <span className="ml-auto text-xs text-emerald-600 dark:text-emerald-500 bg-emerald-100 dark:bg-emerald-700/30 px-2 py-0.5 rounded-full">{method.note}</span>}
                    </button>
                ))}
            </div>
          </section>

          {paymentMethod === 'card' && (
            <section className="mb-8 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-100">
                <h3 className="text-md font-semibold text-slate-700 dark:text-slate-700 mb-4">{t('stripeCheckoutPage.cardInformation.title')}</h3>
                <div className="space-y-4">
                    <Input 
                        label={t('stripeCheckoutPage.cardInformation.cardNumber')} 
                        type="text" 
                        name="cardNumber"
                        value={cardNumber} 
                        onChange={e => setCardNumber(e.target.value)} 
                        placeholder="0000 0000 0000 0000" 
                        required 
                        className="dark:!bg-white dark:!text-slate-900"
                    />
                    <div className="flex space-x-4">
                        <Input 
                            label={t('stripeCheckoutPage.cardInformation.expiryDate')} 
                            type="text" 
                            name="expiryDate"
                            value={expiryDate} 
                            onChange={e => setExpiryDate(e.target.value)} 
                            placeholder="MM / YY" 
                            required 
                            className="w-1/2 dark:!bg-white dark:!text-slate-900"
                        />
                        <Input 
                            label={t('stripeCheckoutPage.cardInformation.cvc')} 
                            type="text" 
                            name="cvc"
                            value={cvc} 
                            onChange={e => setCvc(e.target.value)} 
                            placeholder="CVC" 
                            required 
                            className="w-1/2 dark:!bg-white dark:!text-slate-900"
                        />
                    </div>
                    <Input 
                        label={t('stripeCheckoutPage.cardInformation.cardholderName')} 
                        type="text" 
                        name="cardholderName"
                        value={cardholderName} 
                        onChange={e => setCardholderName(e.target.value)} 
                        placeholder={t('stripeCheckoutPage.cardInformation.cardholderNamePlaceholder')} 
                        required 
                        className="dark:!bg-white dark:!text-slate-900"
                    />
                    <div>
                        <label htmlFor="country" className="block text-sm font-medium text-slate-700 dark:text-slate-700 mb-1">{t('stripeCheckoutPage.cardInformation.country')}</label>
                        <select 
                            id="country" 
                            name="country"
                            value={billingCountry}
                            onChange={e => setBillingCountry(e.target.value)}
                            required
                            className="block w-full py-2 px-3 border border-slate-300 dark:border-slate-400 bg-white dark:!bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-slate-900 dark:!text-slate-900"
                        >
                            {mockCountries.map(country => (
                                <option key={country.code} value={country.code}>{country.name}</option>
                            ))}
                        </select>
                    </div>
                    <Input 
                        label={t('stripeCheckoutPage.cardInformation.addressLine1')} 
                        type="text" 
                        name="addressLine1"
                        value={addressLine1}
                        onChange={e => setAddressLine1(e.target.value)}
                        placeholder={t('stripeCheckoutPage.cardInformation.addressLine1Placeholder')} 
                        required 
                        className="dark:!bg-white dark:!text-slate-900"
                    />
                    <Input 
                        label={t('stripeCheckoutPage.cardInformation.addressLine2')} 
                        type="text" 
                        name="addressLine2"
                        value={addressLine2}
                        onChange={e => setAddressLine2(e.target.value)}
                        placeholder={t('stripeCheckoutPage.cardInformation.addressLine2Placeholder')} 
                        className="dark:!bg-white dark:!text-slate-900"
                    />
                     <div className="flex space-x-4">
                        <Input 
                            label={t('stripeCheckoutPage.cardInformation.city')} 
                            type="text" 
                            name="city"
                            value={city}
                            onChange={e => setCity(e.target.value)}
                            required 
                            className="w-1/2 dark:!bg-white dark:!text-slate-900"
                        />
                        <Input 
                            label={t('stripeCheckoutPage.cardInformation.postalCode')} 
                            type="text" 
                            name="postalCode"
                            value={postalCode}
                            onChange={e => setPostalCode(e.target.value)}
                            required 
                            className="w-1/2 dark:!bg-white dark:!text-slate-900"
                        />
                    </div>
                </div>
            </section>
          )}

          {/* Removed the old inline message for non-card methods */}
          {/* It's now handled by the `error` state and displayed below */}

          {error && <div className="mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-md text-sm dark:bg-red-900/30 dark:text-red-300 dark:border-red-600" role="alert">{error}</div>}

          <div className="mt-8">
            <Button 
                type="submit" 
                variant="primary" 
                size="lg" 
                className="w-full !py-3.5 text-lg" 
                isLoading={isLoading} 
                disabled={isSubscribeButtonDisabled}
                title={subscribeButtonTitle}
            >
              <LockClosedIcon/> {t('stripeCheckoutPage.subscribeNowButton', { amount: `$${totalAmount.toFixed(2)}` })}
            </Button>
          </div>

          <p className="mt-6 text-xs text-slate-500 dark:text-slate-500 text-center">
            {t('stripeCheckoutPage.termsPrefix')}
            <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-400">{t('stripeCheckoutPage.termsLink')}</a> {t('stripeCheckoutPage.and')} <a href="#" className="underline hover:text-slate-700 dark:hover:text-slate-400">{t('stripeCheckoutPage.privacyLink')}</a>.
            <br/>{t('stripeCheckoutPage.mockPaymentDisclaimer')}
          </p>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-500 text-center">
            {t('stripeCheckoutPage.poweredByStripe')}
          </p>
        </form>
      </div>
    </div>
  );
};

export default StripeCheckoutPage;
