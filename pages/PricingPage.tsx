// Code Complete Review: 20240815120000
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PricingCard from '../components/Payment/PricingCard';
import { PricingPlanDetails, UserPlan } from '../types';
import { useAuth } from '../hooks/useAuth';
import { APP_ROUTES } from '../constants';
// PaymentModal is no longer directly opened from here for paid plans
// import PaymentModal from '../components/Payment/PaymentModal'; 
import { useTranslation } from '../hooks/useTranslation';

export const pricingPlansData: PricingPlanDetails[] = [
  {
    id: UserPlan.FREE,
    name: 'Starter',
    price: 'Free',
    features: [
      'Basic AI Chat Access',
      'Text-based Prompts',
      'Limited Chat History (Local)',
      'Standard Support (Community)',
      'Access to Code Playground (Basic AI)',
    ],
    isCurrent: false,
  },
  {
    id: UserPlan.PREMIUM,
    name: 'Premium',
    price: '$9.99',
    features: [
      'All Starter Features, plus:',
      'Image Uploads (up to 20 images, 10MB total)',
      'Voice Input (EN/KM)',
      'Google Search Grounding in Chat',
      'Mermaid Diagram Generation',
      'Extended Chat History Features (Export/Import)',
      'AI Image Generator Access',
      'AI File Converter Tools (Image-to-Text, Text Refiner)',
      'Priority Email Support',
    ],
    isPopular: true,
    isCurrent: false,
  },
  {
    id: UserPlan.PREMIUM_ULTRA2,
    name: 'Premium Ultra2',
    price: '$19.99',
    features: [
        'All Premium Features, plus:',
        'Image Uploads (up to 50 images, 25MB total)',
        'Highest Priority AI Access (Conceptual)',
        'Early Access to New Features (Conceptual)',
        'Dedicated Ultra Support Channel (Conceptual)',
    ],
    isUltra: true,
    isCurrent: false,
  }
];

const PricingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  // const [selectedPlanForModal, setSelectedPlanForModal] = useState<PricingPlanDetails | null>(null); // Not used anymore

  const handleSelectPlan = (planId: UserPlan) => {
    const planDetails = pricingPlansData.find(p => p.id === planId);
    if (planDetails) {
      if (planId === UserPlan.FREE) {
        alert(t('pricingPage.freePlanSelectedAlert'));
        return;
      }
      // For paid plans, navigate to the new StripeCheckoutPage
      navigate(APP_ROUTES.STRIPE_CHECKOUT, { state: { plan: planDetails } });
      // setSelectedPlanForModal(planDetails); // No longer opening PaymentModal directly
    }
  };
  
  // Map original plan data to translated data, ensuring features are also translated
  // and fall back to original English text if a translation for a specific feature is missing.
  const translatedPricingPlans = pricingPlansData.map(plan => {
    const planIdKey = `pricingPage.plans.${plan.id}`;
    return {
      ...plan,
      name: t(`${planIdKey}.name`, { defaultValue: plan.name }),
      price: plan.id === UserPlan.FREE ? t(`${planIdKey}.price`, { defaultValue: "Free" }) : plan.price,
      features: plan.features.map((feature, index) => 
        t(`${planIdKey}.features.${index}`, { defaultValue: feature })
      )
    };
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-blue-100 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900/50 py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated decorative elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-300 dark:bg-blue-700 rounded-full opacity-20 dark:opacity-10 filter blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300 dark:bg-emerald-600 rounded-full opacity-10 dark:opacity-5 filter blur-3xl animate-pulse animation-delay-400"></div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-16 animate-fadeInUp">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-accent dark:from-blue-400 dark:via-blue-300 dark:to-emerald-400 sm:text-6xl leading-tight tracking-tight">
            {t('pricingPage.header.title')}
          </h1>
          <p className="mt-6 text-xl text-slate-700 dark:text-slate-300 max-w-3xl mx-auto">
            {t('pricingPage.header.subtitle')}
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {translatedPricingPlans.map((plan, index) => (
            <div key={plan.id} className={`animate-fadeInUp animation-delay-${index * 200}`}>
              <PricingCard
                plan={plan}
                onSelectPlan={handleSelectPlan}
                isCurrentUserPlan={user?.plan === plan.id}
              />
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-slate-500 dark:text-slate-400 animate-fadeInUp animation-delay-600 space-y-2">
            <p>{t('pricingPage.footer.note')}</p>
            <p className="italic">{t('pricingPage.footer.mockDataNote')}</p>
        </div>
      </div>
      {/* PaymentModal is no longer triggered directly from this page for plan selection
      {selectedPlanForModal && (
          <PaymentModal 
            isOpen={!!selectedPlanForModal} 
            onClose={() => setSelectedPlanForModal(null)} 
            plan={selectedPlanForModal} 
          />
      )} 
      */}
    </div>
  );
};

export default PricingPage;

// Add new translations for PricingPage to en.json and km.json
// For en.json:
/*
  "pricingPage.header.title": "Unlock Your AI Potential",
  "pricingPage.header.subtitle": "Choose a plan tailored to your needs and elevate your AI experience.",
  "pricingPage.footer.note": "All prices are in USD. Subscriptions are mock and for demonstration purposes only.",
  "pricingPage.footer.mockDataNote": "Note: For mock payment simulation of paid plans, example card details (Card Number, MM/YY, CVC, Cardholder Name, Address, etc.) will be pre-filled on the checkout page for your convenience.",
  "pricingPage.freePlanSelectedAlert": "You are currently on or can use the Starter plan without payment.",
  "pricingPage.plans.FREE.name": "Starter",
  "pricingPage.plans.FREE.price": "Free",
  "pricingPage.plans.FREE.features.0": "Basic AI Chat Access",
  "pricingPage.plans.FREE.features.1": "Text-based Prompts",
  "pricingPage.plans.FREE.features.2": "Limited Chat History (Local)",
  "pricingPage.plans.FREE.features.3": "Standard Support (Community)",
  "pricingPage.plans.FREE.features.4": "Access to Code Playground (Basic AI)",
  "pricingPage.plans.PREMIUM.name": "Premium",
  "pricingPage.plans.PREMIUM.features.0": "All Starter Features, plus:",
  "pricingPage.plans.PREMIUM.features.1": "Image Uploads (up to 20 images, 10MB total)",
  "pricingPage.plans.PREMIUM.features.2": "Voice Input (EN/KM)",
  "pricingPage.plans.PREMIUM.features.3": "Google Search Grounding in Chat",
  "pricingPage.plans.PREMIUM.features.4": "Mermaid Diagram Generation",
  "pricingPage.plans.PREMIUM.features.5": "Extended Chat History Features (Export/Import)",
  "pricingPage.plans.PREMIUM.features.6": "AI Image Generator Access",
  "pricingPage.plans.PREMIUM.features.7": "AI File Converter Tools (Image-to-Text, Text Refiner)",
  "pricingPage.plans.PREMIUM.features.8": "Priority Email Support",
  "pricingPage.plans.PREMIUM_ULTRA2.name": "Premium Ultra2",
  "pricingPage.plans.PREMIUM_ULTRA2.features.0": "All Premium Features, plus:",
  "pricingPage.plans.PREMIUM_ULTRA2.features.1": "Image Uploads (up to 50 images, 25MB total)",
  "pricingPage.plans.PREMIUM_ULTRA2.features.2": "Highest Priority AI Access (Conceptual)",
  "pricingPage.plans.PREMIUM_ULTRA2.features.3": "Early Access to New Features (Conceptual)",
  "pricingPage.plans.PREMIUM_ULTRA2.features.4": "Dedicated Ultra Support Channel (Conceptual)"
*/

// For km.json:
/*
  "pricingPage.header.title": "ដោះសោសក្តានុពល AI របស់អ្នក",
  "pricingPage.header.subtitle": "ជ្រើសរើសគម្រោងដែលស័ក្តិសមនឹងតម្រូវការរបស់អ្នក និងបង្កើនបទពិសោធន៍ AI របស់អ្នក។",
  "pricingPage.footer.note": "តម្លៃទាំងអស់គិតជាដុល្លារអាមេរិក។ ការជាវគឺជាការក្លែងធ្វើ និងសម្រាប់គោលបំណងបង្ហាញតែប៉ុណ្ណោះ។",
  "pricingPage.footer.mockDataNote": "ចំណាំ៖ សម្រាប់ការក្លែងធ្វើការទូទាត់នៃគម្រោងបង់ប្រាក់ ព័ត៌មានលម្អិតនៃកាតគំរូ (លេខកាត, MM/YY, CVC, ឈ្មោះម្ចាស់កាត, អាសយដ្ឋាន ។ល។) នឹងត្រូវបានបំពេញជាមុននៅលើទំព័រទូទាត់ដើម្បីភាពងាយស្រួលរបស់អ្នក។",
  "pricingPage.freePlanSelectedAlert": "អ្នកកំពុងប្រើប្រាស់ ឬអាចប្រើគម្រោង Starter ដោយមិនចាំបាច់បង់ប្រាក់។",
  "pricingPage.plans.FREE.name": "ចាប់ផ្តើម",
  "pricingPage.plans.FREE.price": "ឥតគិតថ្លៃ",
  "pricingPage.plans.FREE.features.0": "ការចូលប្រើ AI Chat មូលដ្ឋាន",
  "pricingPage.plans.FREE.features.1": "ការណែនាំផ្អែកលើអត្ថបទ",
  "pricingPage.plans.FREE.features.2": "ប្រវត្តិជជែកមានកំណត់ (ក្នុងเครื่อง)",
  "pricingPage.plans.FREE.features.3": "ការគាំទ្រស្តង់ដារ (សហគមន៍)",
  "pricingPage.plans.FREE.features.4": "ការចូលប្រើកន្លែងសាកល្បងកូដ (AI មូលដ្ឋាន)",
  "pricingPage.plans.PREMIUM.name": "Premium",
  "pricingPage.plans.PREMIUM.features.0": "មុខងារ Starter ទាំងអស់ បូកបន្ថែម៖",
  "pricingPage.plans.PREMIUM.features.1": "ការបញ្ចូលរូបភាព (រហូតដល់ ២០ រូបភាព, សរុប ១០MB)",
  "pricingPage.plans.PREMIUM.features.2": "ការបញ្ចូលដោយសំឡេង (EN/KM)",
  "pricingPage.plans.PREMIUM.features.3": "ការស្វែងរក Google ក្នុង Chat",
  "pricingPage.plans.PREMIUM.features.4": "ការបង្កើតដ្យាក្រាម Mermaid",
  "pricingPage.plans.PREMIUM.features.5": "មុខងារប្រវត្តិជជែកកម្រិតខ្ពស់ (នាំចេញ/នាំចូល)",
  "pricingPage.plans.PREMIUM.features.6": "ការចូលប្រើអ្នកបង្កើតរូបភាព AI",
  "pricingPage.plans.PREMIUM.features.7": "ឧបករណ៍បម្លែងឯកសារ AI (រូបភាពទៅអត្ថបទ, កែលម្អអត្ថបទ)",
  "pricingPage.plans.PREMIUM.features.8": "ការគាំទ្រតាមអ៊ីមែលអាទិភាព",
  "pricingPage.plans.PREMIUM_ULTRA2.name": "Premium Ultra2",
  "pricingPage.plans.PREMIUM_ULTRA2.features.0": "មុខងារ Premium ទាំងអស់ បូកបន្ថែម៖",
  "pricingPage.plans.PREMIUM_ULTRA2.features.1": "ការបញ្ចូលរូបភាព (រហូតដល់ ៥០ រូបភាព, សរុប ២៥MB)",
  "pricingPage.plans.PREMIUM_ULTRA2.features.2": "ការចូលប្រើ AI អាទិភាពខ្ពស់បំផុត (គោលគំនិត)",
  "pricingPage.plans.PREMIUM_ULTRA2.features.3": "ការចូលប្រើមុខងារថ្មីមុនគេ (គោលគំនិត)",
  "pricingPage.plans.PREMIUM_ULTRA2.features.4": "បណ្តាញគាំទ្រ Ultra ពិសេស (គោលគំនិត)"
*/