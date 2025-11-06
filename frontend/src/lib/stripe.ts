import { loadStripe, Stripe } from '@stripe/stripe-js';

// This would be your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISH_KEY; // Replace with actual key

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);
  }
  return stripePromise;
};

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'month' | 'year' | 'trial';
  features: string[];
  popular?: boolean;
  stripePriceId: string;
  scanLimit?: number;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Trial',
    price: 0,
    currency: '₹',
    interval: 'trial',
    scanLimit: 5,
    features: [
      '5 AI scans total',
      'All 3 disease models',
      'Basic support',
      'Standard resolution results'
    ],
    stripePriceId: ''
  },
  {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 150,
    currency: '₹',
    interval: 'month',
    features: [
      'Unlimited AI scans',
      'All 3 disease models',
      'Priority support',
      'High-resolution results',
      'Export reports (PDF)',
      'Email notifications',
      'Advanced analytics',
      'DPDP Act 2023 compliant storage'
    ],
    popular: false,
    stripePriceId: 'price_monthly_150'
  },
  {
    id: 'yearly',
    name: 'Yearly Plan',
    price: 1200,
    currency: '₹',
    interval: 'year',
    features: [
      'Unlimited AI scans',
      'All 3 disease models',
      'Priority support',
      'High-resolution results',
      'Export reports (PDF)',
      'Email notifications',
      'Advanced analytics',
      'DPDP Act 2023 compliant storage',
      'API access',
      'Custom model training',
      '24/7 phone support',
      '2 months free (save ₹300)'
    ],
    popular: true,
    stripePriceId: 'price_yearly_1200'
  }
];

export const createCheckoutSession = async (priceId: string) => {
  // This would typically make a call to your backend
  // For demo purposes, we'll simulate the process
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        url: `https://checkout.stripe.com/pay/cs_test_${Math.random().toString(36).substr(2, 9)}`
      });
    }, 1000);
  });
};