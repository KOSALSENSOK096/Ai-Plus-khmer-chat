// Code Complete Review: 20240815120000
import React from 'react';
import { PricingPlanDetails, UserPlan } from '../../types';
import Button from '../Common/Button';
import { useTranslation } from '../../hooks/useTranslation'; // Import useTranslation

const CheckIcon = ({ className = "w-5 h-5 text-accent" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className}>
        <title>Feature available</title>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
);

const StarIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
    <title>Popular</title>
    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.39-3.423 3.399a.75.75 0 00.427 1.276l5.261.712 2.096 4.847a.75.75 0 001.342 0l2.096-4.847 5.261-.712a.75.75 0 00.427-1.276l-3.423-3.399-4.753-.39-1.83-4.401z" clipRule="evenodd" />
  </svg>
);


interface PricingCardProps {
  plan: PricingPlanDetails;
  onSelectPlan: (planId: UserPlan) => void;
  isCurrentUserPlan: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ plan, onSelectPlan, isCurrentUserPlan }) => {
  const { t } = useTranslation();
  const cardBaseStyle = "bg-white dark:bg-slate-800 rounded-xl p-6 sm:p-8 flex flex-col transition-all duration-300 ease-in-out transform hover:scale-[1.03] shadow-lg hover:shadow-2xl dark:shadow-slate-900/50 dark:hover:shadow-slate-800/70";
  
  let cardSpecificStyle = "border border-slate-200 dark:border-slate-700";
  if (plan.isUltra) {
    cardSpecificStyle = "border-transparent bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 dark:from-purple-900/30 dark:via-pink-900/30 dark:to-rose-900/30 relative before:absolute before:inset-0 before:rounded-xl before:p-0.5 before:bg-gradient-to-br before:from-purple-500 before:via-pink-500 before:to-rose-500 before:content-[''] before:z-[-1]";
  } else if (plan.isPopular) {
    cardSpecificStyle = "border-2 border-primary dark:border-primary shadow-primary/30 dark:shadow-primary/20";
  }
  
  if (isCurrentUserPlan) {
    cardSpecificStyle += " ring-2 ring-accent dark:ring-accent ring-offset-2 dark:ring-offset-slate-800 scale-105";
  }

  return (
    <div className={`${cardBaseStyle} ${cardSpecificStyle} relative`}>
      {plan.isPopular && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-blue-600 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow-lg flex items-center">
          <StarIcon className="mr-1.5 text-yellow-300" /> POPULAR
        </div>
      )}
      <h3 className={`text-2xl font-bold text-center mb-3 ${plan.isUltra ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 dark:from-purple-400 dark:via-pink-400 dark:to-rose-400" : "text-slate-800 dark:text-slate-100"}`}>{plan.name}</h3>
      <p className={`text-4xl font-extrabold text-center mb-6 ${plan.isUltra ? "text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500" : "text-primary dark:text-blue-400"}`}>
        {plan.price}
        {plan.id !== UserPlan.FREE && <span className="text-base font-normal text-slate-500 dark:text-slate-400">/month</span>}
      </p>
      <ul className="space-y-2.5 mb-8 flex-grow">
        {plan.features.map((feature, index) => (
          <li key={index} className="flex items-start text-sm">
            <CheckIcon className="w-5 h-5 mr-2.5 mt-0.5 flex-shrink-0 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-300">{feature}</span>
          </li>
        ))}
      </ul>
      {isCurrentUserPlan ? (
        <Button variant="outline" disabled className="w-full mt-auto !bg-accent/10 !border-accent/50 !text-accent cursor-default">
          {t('pricingCard.currentPlan')}
        </Button>
      ) : plan.id === UserPlan.FREE ? (
         <Button variant="primary" onClick={() => onSelectPlan(plan.id)} className="w-full mt-auto opacity-70 cursor-not-allowed" disabled>
          {t('pricingCard.freePlan')}
        </Button>
      ) : (
        <Button 
          variant={plan.isUltra ? "secondary" : "primary"} // Different variant for ultra
          onClick={() => onSelectPlan(plan.id)} 
          className={`w-full mt-auto transition-transform duration-150 ease-in-out hover:scale-105 ${plan.isUltra ? '!bg-gradient-to-r !from-purple-600 !via-pink-500 !to-rose-500 hover:!from-purple-700 hover:!via-pink-600 hover:!to-rose-600 !text-white !border-transparent' : ''}`}
        >
          {t('pricingCard.choosePlan')}
        </Button>
      )}
    </div>
  );
};

export default PricingCard;

// Add new translations for PricingCard to en.json and km.json
// For en.json:
/*
  "pricingCard.currentPlan": "Current Plan",
  "pricingCard.freePlan": "Free Plan",
  "pricingCard.choosePlan": "Choose Plan"
*/

// For km.json:
/*
  "pricingCard.currentPlan": "គម្រោងបច្ចុប្បន្ន",
  "pricingCard.freePlan": "គម្រោងឥតគិតថ្លៃ",
  "pricingCard.choosePlan": "ជ្រើសរើសគម្រោង"
*/
