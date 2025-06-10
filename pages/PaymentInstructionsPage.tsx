// Code Complete Review: 20240815120000
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PricingPlanDetails, UserPlan } from '../types';
import { paymentService } from '../services/paymentService';
import { APP_ROUTES } from '../constants';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Modal from '../components/Common/Modal';
import AppLogo from '../components/Common/AppLogo';
import { useTranslation } from '../hooks/useTranslation';

// --- Icons ---
const CheckCircleIcon = ({ className = "w-16 h-16 text-accent" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Success</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationCircleIcon = ({ className = "w-16 h-16 text-red-500 dark:text-red-400" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Error</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
);

const BanknotesIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>Bank Transfer</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
  </svg>
);

const QrCodeIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <title>ABA QR Code</title>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 14.625L13.5 14.625" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.625v4.5a1.125 1.125 0 01-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5" />
  </svg>
);

// Simple Mock QR Code SVG
const MockQrCodeSvg = ({ size = 144 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className="bg-white dark:bg-slate-200 p-1 rounded-md shadow-sm">
        <title>Mock ABA QR Code</title>
        <defs><rect id="q" width="4" height="4"/></defs>
        <path className="fill-slate-800 dark:fill-slate-700" d="M4 4h18v18H4z M8 8h10v10H8z m21 0h10v10H29z M4 29h10v10H4z"/>
        <use href="#q" x="8" y="29" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="13" y="29" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="29" y="8" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="34" y="8" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="8" y="34" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="13" y="34" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="29" y="13" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="34" y="13" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="29" y="29" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="34" y="34" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="39" y="39" className="fill-slate-800 dark:fill-slate-700"/>
        <use href="#q" x="43" y="43" className="fill-slate-800 dark:fill-slate-700"/>
    </svg>
);


export const PaymentInstructionsPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateUserPlan } = useAuth();
  const { t } = useTranslation();
  
  const [selectedPlan, setSelectedPlan] = useState<PricingPlanDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

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

  const handleConfirmPayment = () => {
    setShowConfirmationModal(true);
  };

  const processMockPayment = async () => {
    setShowConfirmationModal(false);
    if (!user || !selectedPlan) return;

    setIsLoading(true);
    setPaymentError(null);

    try {
      const result = await paymentService.processPaymentAndUpgrade(user.id, selectedPlan.id as UserPlan, "Mock Payment");
      if (result.success) {
        updateUserPlan(selectedPlan.id as UserPlan);
        setShowSuccessModal(true);
        setTimeout(() => {
          setShowSuccessModal(false);
          navigate(APP_ROUTES.CHAT);
        }, 3000);
      } else {
        setPaymentError(result.message || t('paymentInstructionsPage.error.generic'));
      }
    } catch (err) {
      setPaymentError((err as Error).message || t('paymentInstructionsPage.error.unexpected'));
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

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-10">
           <AppLogo className="w-36 h-auto mx-auto mb-6 opacity-90" />
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-4xl">
            {t('paymentInstructionsPage.header.title', { planName: selectedPlan.name })}
          </h1>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-300">
            {t('paymentInstructionsPage.header.subtitle', { planName: selectedPlan.name, planPrice: selectedPlan.price })}
          </p>
        </header>

        {paymentError && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/40 border border-red-300 dark:border-red-700 rounded-md text-sm text-red-700 dark:text-red-300" role="alert">
            {paymentError}
          </div>
        )}

        <div className="bg-white dark:bg-slate-800 shadow-2xl dark:shadow-slate-900/60 rounded-xl p-6 md:p-10 border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-8 text-center border-b border-slate-200 dark:border-slate-700 pb-4">
            {t('paymentInstructionsPage.methods.title')}
          </h2>
          
          <div className="space-y-10">
            {/* ABA QR Payment Card */}
            <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-600 transition-shadow hover:shadow-lg">
              <div className="flex items-center text-primary dark:text-blue-400 mb-4">
                <QrCodeIcon className="w-8 h-8 mr-3 " />
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{t('paymentInstructionsPage.methods.aba.title')}</h3>
              </div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="flex-shrink-0 p-2 bg-white dark:bg-slate-200 rounded-lg shadow-inner">
                    <MockQrCodeSvg size={128}/>
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 space-y-1">
                  <p>{t('paymentInstructionsPage.methods.aba.scan')}</p>
                  <p><strong>{t('paymentInstructionsPage.methods.aba.accountNameLabel')}:</strong> AI PLUS KHMER CHAT (Mock)</p>
                  <p><strong>{t('paymentInstructionsPage.methods.aba.amountLabel')}:</strong> {selectedPlan.price}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{t('paymentInstructionsPage.methods.aba.ensureMatch')}</p>
                </div>
              </div>
            </div>

            {/* Bank Transfer Card */}
            <div className="bg-slate-50 dark:bg-slate-700/50 p-6 rounded-lg shadow-md border border-slate-200 dark:border-slate-600 transition-shadow hover:shadow-lg">
              <div className="flex items-center text-primary dark:text-blue-400 mb-4">
                <BanknotesIcon className="w-8 h-8 mr-3" />
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100">{t('paymentInstructionsPage.methods.bankTransfer.title')}</h3>
              </div>
              <div className="space-y-1.5 text-sm text-slate-700 dark:text-slate-300">
                <p><strong>{t('paymentInstructionsPage.methods.bankTransfer.bankNameLabel')}:</strong> ACLEDA Bank Plc. (Mock)</p>
                <p><strong>{t('paymentInstructionsPage.methods.bankTransfer.accountNameLabel')}:</strong> AI PLUS KHMER CHAT (Mock)</p>
                <p><strong>{t('paymentInstructionsPage.methods.bankTransfer.accountNumberLabel')}:</strong> 000123456789 (Mock)</p>
                <p><strong>{t('paymentInstructionsPage.methods.bankTransfer.amountLabel')}:</strong> {selectedPlan.price} USD</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">{t('paymentInstructionsPage.methods.bankTransfer.referenceNote', { email: user?.email || 'your_email@example.com' })}</p>
              </div>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-700 text-center">
            <p className="text-md text-slate-600 dark:text-slate-300 mb-6">
              {t('paymentInstructionsPage.confirmation.prompt')}
            </p>
            <Button onClick={handleConfirmPayment} variant="primary" size="lg" isLoading={isLoading} disabled={isLoading} className="px-10 py-3 text-lg shadow-lg hover:shadow-primary/40 transform hover:scale-105 transition-all duration-300">
              {t('paymentInstructionsPage.confirmation.button')}
            </Button>
          </div>
        </div>

        <p className="mt-10 text-center text-xs text-slate-500 dark:text-slate-400">
          {t('paymentInstructionsPage.footer.disclaimer')}
        </p>
        <div className="mt-6 text-center">
          <Link to={APP_ROUTES.PRICING} className="text-sm text-primary hover:underline dark:text-blue-400">
            &larr; {t('paymentInstructionsPage.footer.backLink')}
          </Link>
        </div>
      </div>

      <Modal isOpen={showConfirmationModal} onClose={() => setShowConfirmationModal(false)} title={t('paymentInstructionsPage.confirmModal.title')}>
        <p className="text-slate-700 dark:text-slate-200 mb-8 text-center text-lg">
          {t('paymentInstructionsPage.confirmModal.message', { planPrice: selectedPlan.price, planName: selectedPlan.name })}
        </p>
        <div className="flex justify-center space-x-4">
          <Button variant="outline" onClick={() => setShowConfirmationModal(false)} className="px-6">{t('button.cancel')}</Button>
          <Button variant="primary" onClick={processMockPayment} className="px-6">{t('paymentInstructionsPage.confirmModal.confirmButton')}</Button>
        </div>
      </Modal>

      <Modal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} title={t('paymentInstructionsPage.successModal.title')}>
        <div className="text-center py-6">
          <AppLogo className="w-24 h-auto mx-auto mb-5 text-primary dark:text-blue-400" />
          <CheckCircleIcon className="mx-auto mb-5 text-green-500" />
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 mb-3">
            {t('paymentInstructionsPage.successModal.header')}
          </h3>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            {t('paymentInstructionsPage.successModal.message', { planName: selectedPlan.name })}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-3">
            {t('paymentInstructionsPage.successModal.redirectMessage')}
          </p>
        </div>
      </Modal>
    </div>
  );
};

// Add new translations for PaymentInstructionsPage to en.json and km.json
// For en.json:
/*
  "paymentInstructionsPage.header.title": "Payment for {{planName}} Plan",
  "paymentInstructionsPage.header.subtitle": "You are upgrading to the {{planName}} plan for {{planPrice}}/month.",
  "paymentInstructionsPage.methods.title": "Payment Methods",
  "paymentInstructionsPage.methods.aba.title": "ABA Bank QR Payment",
  "paymentInstructionsPage.methods.aba.scan": "Scan the QR code using your ABA Mobile App.",
  "paymentInstructionsPage.methods.aba.accountNameLabel": "Account Name",
  "paymentInstructionsPage.methods.aba.amountLabel": "Amount",
  "paymentInstructionsPage.methods.aba.ensureMatch": "Ensure the payment details match before confirming in your app.",
  "paymentInstructionsPage.methods.bankTransfer.title": "Bank Transfer",
  "paymentInstructionsPage.methods.bankTransfer.bankNameLabel": "Bank Name",
  "paymentInstructionsPage.methods.bankTransfer.accountNameLabel": "Account Name",
  "paymentInstructionsPage.methods.bankTransfer.accountNumberLabel": "Account Number",
  "paymentInstructionsPage.methods.bankTransfer.amountLabel": "Amount",
  "paymentInstructionsPage.methods.bankTransfer.referenceNote": "Please include your email address ({{email}}) in the transfer reference/description if possible.",
  "paymentInstructionsPage.confirmation.prompt": "After completing your payment using one of the methods above, please click the button below. Your account will be upgraded once the payment is (mock) verified.",
  "paymentInstructionsPage.confirmation.button": "I Have Paid - Confirm My Upgrade",
  "paymentInstructionsPage.footer.disclaimer": "This is a simulated payment process. No real financial transactions will occur.",
  "paymentInstructionsPage.footer.backLink": "Back to Pricing Plans",
  "paymentInstructionsPage.error.generic": "Payment failed. Please try again.",
  "paymentInstructionsPage.error.unexpected": "An unexpected error occurred during payment.",
  "paymentInstructionsPage.confirmModal.title": "Confirm Payment Completion",
  "paymentInstructionsPage.confirmModal.message": "Have you completed the payment of {{planPrice}} for the {{planName}} plan?",
  "paymentInstructionsPage.confirmModal.confirmButton": "Yes, I Have Paid",
  "paymentInstructionsPage.successModal.title": "Upgrade Successful!",
  "paymentInstructionsPage.successModal.header": "Upgrade Complete!",
  "paymentInstructionsPage.successModal.message": "Congratulations! Your plan has been successfully upgraded to {{planName}}.",
  "paymentInstructionsPage.successModal.redirectMessage": "You will be redirected shortly."
*/

// For km.json:
/*
  "paymentInstructionsPage.header.title": "ការชำระប្រាក់สำหรับគម្រោង {{planName}}",
  "paymentInstructionsPage.header.subtitle": "អ្នកកំពុងដំឡើងទៅគម្រោង {{planName}} ក្នុងតម្លៃ {{planPrice}}/ខែ។",
  "paymentInstructionsPage.methods.title": "វិធីសាស្រ្តชำระប្រាក់",
  "paymentInstructionsPage.methods.aba.title": "ការชำระប្រាក់តាម ABA QR",
  "paymentInstructionsPage.methods.aba.scan": "ស្កេន QR កូដដោយប្រើកម្មវិធី ABA Mobile របស់អ្នក។",
  "paymentInstructionsPage.methods.aba.accountNameLabel": "ឈ្មោះគណនី",
  "paymentInstructionsPage.methods.aba.amountLabel": "จำนวนเงิน",
  "paymentInstructionsPage.methods.aba.ensureMatch": "សូមប្រាកដថាព័ត៌មានលម្អិតនៃការชำระប្រាក់ត្រឹមត្រូវមុនពេលបញ្ជាក់ក្នុងកម្មវិធីរបស់អ្នក។",
  "paymentInstructionsPage.methods.bankTransfer.title": "ការโอนเงินតាមធនាคาร",
  "paymentInstructionsPage.methods.bankTransfer.bankNameLabel": "ឈ្មោះធនាគារ",
  "paymentInstructionsPage.methods.bankTransfer.accountNameLabel": "ឈ្មោះគណនី",
  "paymentInstructionsPage.methods.bankTransfer.accountNumberLabel": "លេខគណនី",
  "paymentInstructionsPage.methods.bankTransfer.amountLabel": "จำนวนเงิน",
  "paymentInstructionsPage.methods.bankTransfer.referenceNote": "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក ({{email}}) ក្នុងការอ้างอิง/ការពិពណ៌នាការโอน ប្រសិនបើអាច។",
  "paymentInstructionsPage.confirmation.prompt": "បន្ទាប់ពីបញ្ចប់ការชำระប្រាក់របស់អ្នកដោយប្រើវិធីសាស្រ្តណាមួយខាងលើ សូមចុចប៊ូតុងខាងក្រោម។ គណនីរបស់អ្នកនឹងត្រូវបានដំឡើងនៅពេលការชำระប្រាក់ត្រូវបានផ្ទៀងផ្ទាត់ (ក្លែងធ្វើ)។",
  "paymentInstructionsPage.confirmation.button": "ខ្ញុំបានชำระប្រាក់ហើយ - បញ្ជាក់ការដំឡើងរបស់ខ្ញុំ",
  "paymentInstructionsPage.footer.disclaimer": "នេះគឺជាដំណើរការชำระប្រាក់ក្លែងធ្វើ។ គ្មានប្រតិបត្តិการทางการเงินពិតប្រាកដណាមួយកើតឡើងឡើយ។",
  "paymentInstructionsPage.footer.backLink": "ត្រឡប់ទៅគម្រោងតម្លៃវិញ",
  "paymentInstructionsPage.error.generic": "ការชำระប្រាក់បរាជ័យ។ សូម​ព្យាយាម​ម្តង​ទៀត។",
  "paymentInstructionsPage.error.unexpected": "មានកំហុសដែលមិននឹកស្មានដល់កើតឡើងកំឡុងពេលชำระប្រាក់។",
  "paymentInstructionsPage.confirmModal.title": "បញ្ជាក់ការបញ្ចប់ការชำระប្រាក់",
  "paymentInstructionsPage.confirmModal.message": "តើអ្នកបានបញ្ចប់ការชำระប្រាក់จำนวน {{planPrice}} សម្រាប់គម្រោង {{planName}} ហើយឬនៅ?",
  "paymentInstructionsPage.confirmModal.confirmButton": "បាទ/ចាស ខ្ញុំបានชำระប្រាក់ហើយ",
  "paymentInstructionsPage.successModal.title": "ការដំឡើងជោគជ័យ!",
  "paymentInstructionsPage.successModal.header": "ការដំឡើងបានបញ្ចប់!",
  "paymentInstructionsPage.successModal.message": "សូមអបអរសាទរ! គម្រោងរបស់អ្នកត្រូវបានដំឡើងទៅ {{planName}} ដោយជោគជ័យ។",
  "paymentInstructionsPage.successModal.redirectMessage": "អ្នកនឹងត្រូវបានបញ្ជូនបន្តក្នុងពេលឆាប់ៗនេះ។"
*/
