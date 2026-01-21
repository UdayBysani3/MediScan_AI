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
  scanLimit: number;
  validityDays: number;
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Free Plan',
    price: 0,
    currency: '₹',
    interval: 'trial',
    scanLimit: 5,
    validityDays: 0, // No expiration for free plan
    features: [
      '5 AI scans (lifetime)',
      'All 3 disease models',
      'Basic support',
      'Standard resolution results',
      'No expiration'
    ],
    stripePriceId: ''
  },
  {
    id: 'monthly',
    name: 'Monthly Pack',
    price: 150,
    currency: '₹',
    interval: 'month',
    scanLimit: 100,
    validityDays: 31,
    features: [
      '100 AI scans',
      'Valid for 31 days',
      'All 3 disease models',
      'Priority support',
      'High-resolution results',
      'Advanced analytics',
      'DPDP Act 2023 compliant storage'
    ],
    popular: false,
    stripePriceId: 'price_monthly_150'
  },
  {
    id: 'yearly',
    name: 'Yearly Pack',
    price: 1500,
    currency: '₹',
    interval: 'year',
    scanLimit: 5000,
    validityDays: 365,
    features: [
      '5000 AI scans',
      'Valid for 365 days',
      'All 3 disease models',
      'Priority support',
      'High-resolution results',
      'Advanced analytics',
      'DPDP Act 2023 compliant storage',
      'API access',
      'Custom model training',
      '24/7 phone support',
      'Best value! (₹0.30 per scan)'
    ],
    popular: true,
    stripePriceId: 'price_yearly_1500'
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