// Code Complete Review: 20240815120000
import React, { useState } from 'react';
import { PricingPlanDetails, UserPlan } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import { paymentService } from '../../services/paymentService';
import Modal from '../Common/Modal';
import Button from '../Common/Button';
import LoadingSpinner from '../Common/LoadingSpinner';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlanDetails | null;
}

const CreditCardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
        <title>Credit Card</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
);

const QRIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mr-2">
        <title>QR Code</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 013.75 9.375v-4.5zM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5zM13.5 14.625L13.5 14.625" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.625v4.5a1.125 1.125 0 01-1.125 1.125h-4.5a1.125 1.125 0 01-1.125-1.125v-4.5" />
    </svg>
);


const PaymentModal: React.FC<PaymentModalProps> = ({ isOpen, onClose, plan }) => {
  const { user, updateUserPlan } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePayment = async (method: string) => {
    if (!user || !plan) return;

    setIsLoading(true);
    setPaymentStatus('idle');
    setErrorMessage('');

    try {
      const result = await paymentService.processPaymentAndUpgrade(user.id, plan.id as UserPlan, method);
      if (result.success) {
        updateUserPlan(plan.id as UserPlan);
        setPaymentStatus('success');
        setTimeout(() => {
            onClose();
            setPaymentStatus('idle');
        }, 2000);
      } else {
        setPaymentStatus('error');
        setErrorMessage(result.message || 'Payment failed.');
      }
    } catch (err) {
      setPaymentStatus('error');
      setErrorMessage((err as Error).message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!plan) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Upgrade to ${plan.name} Plan`}>
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-8">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Processing your payment...</p>
        </div>
      ) : paymentStatus === 'success' ? (
        <div className="text-center p-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-accent mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <title>Success</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-semibold text-darkgray dark:text-slate-100 mb-2">Payment Successful!</h3>
          <p className="text-gray-600 dark:text-gray-300">You have been upgraded to the {plan.name} plan.</p>
        </div>
      ) : paymentStatus === 'error' ? (
         <div className="text-center p-8">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 dark:text-red-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <title>Error</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-2xl font-semibold text-darkgray dark:text-slate-100 mb-2">Payment Failed</h3>
          <p className="text-red-600 dark:text-red-400">{errorMessage}</p>
        </div>
      ) : (
        <div className="p-4">
          <p className="text-lg text-center text-gray-700 dark:text-gray-200 mb-6">
            Confirm your upgrade to <strong>{plan.name}</strong> for <strong>{plan.price}/month</strong>.
          </p>
          <div className="space-y-4">
            {/* Mock payment method selection */}
            <Button 
              onClick={() => handlePayment('Mock Credit Card')} 
              className="w-full"
              leftIcon={<CreditCardIcon />}
            >
              Pay with Mock Credit Card
            </Button>
            <Button 
              onClick={() => handlePayment('Mock QR Code Payment')} 
              className="w-full"
              leftIcon={<QRIcon />}
            >
              Pay with Mock QR Code
            </Button>
          </div>
          <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-6">
            This is a simulated payment. No real charges will be made.
          </p>
        </div>
      )}
    </Modal>
  );
};

export default PaymentModal;