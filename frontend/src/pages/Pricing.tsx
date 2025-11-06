import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { Check, Crown, Zap, ArrowRight, Star, Sparkles, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { pricingPlans, PricingPlan } from '@/lib/stripe';

// This tells TypeScript that the Razorpay object will be available on the global window object.
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user,token } = useAuth();
  const handleUpgrade = async (plan: PricingPlan) => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }
    
    // If the plan is free, handle it without payment
    if (plan.id === 'free') {
      navigate('/dashboard'); 
      return;
    }

    try {
    // 1. Call your Node.js backend to create a Razorpay order
    const orderResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/create-order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add token
        },
        body: JSON.stringify({ amount: plan.price }),
    });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order on the server.');
      }

      const order = await orderResponse.json();

      // 2. Configure Razorpay options for the checkout modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // ❗ IMPORTANT: Replace with your actual Razorpay Key ID
        amount: order.amount,
        currency: order.currency,
        name: 'MediScan',
        description: `Payment for ${plan.name} Plan`,
        order_id: order.id,
        handler: async function (response: any) {
          // 3. This function is called after a successful payment.
          // Now, verify the payment signature on your backend for security.
           const verifyResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify-payment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Add token
        },
        body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
        }),
    });
          
          const result = await verifyResponse.json();
          if (result.status === 'success') {
            // 4. If verification is successful, navigate the user to their dashboard.
            alert('Payment Successful! Welcome to MediScan Premium.');
            navigate('/dashboard');
          } else {
            alert('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: user.name || 'MediScan User',
          contact: user.mobile || '',
        },
        theme: {
          color: '#3399cc',
        },
      };

      // 5. Create a new Razorpay instance and open the payment window
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      console.error("Payment Error:", error);
      alert("An error occurred while processing the payment. Please try again.");
    }
  };
  
  const getPlanIcon = (planId: string) => {
    switch (planId) {
      case 'free': return <Zap className="h-8 w-8 text-blue-600" />;
      case 'monthly': return <Crown className="h-8 w-8 text-green-600" />;
      case 'yearly': return <Calendar className="h-8 w-8 text-purple-600" />;
      default: return <Zap className="h-8 w-8" />;
    }
  };

  const getPlanColor = (planId: string) => {
    switch (planId) {
      case 'free': return 'border-blue-200 hover:border-blue-300';
      case 'monthly': return 'border-green-200 hover:border-green-300';
      case 'yearly': return 'border-purple-200 hover:border-purple-300 ring-2 ring-purple-200';
      default: return 'border-gray-200';
    }
  };

  const getSavingsText = () => {
    const monthlyPrice = 150;
    const yearlyPrice = 1200;
    const yearlyEquivalent = monthlyPrice * 12;
    const savings = yearlyEquivalent - yearlyPrice;
    const savingsPercentage = Math.round((savings / yearlyEquivalent) * 100);
    
    return {
      savings,
      percentage: savingsPercentage,
      monthlyEquivalent: yearlyEquivalent
    };
  };

  const savingsInfo = getSavingsText();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-indigo-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center space-y-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Choose Your
              <span className="block bg-gradient-to-r from-blue-600 via-green-600 to-indigo-600 bg-clip-text text-transparent">
                MediScan Plan
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI-powered medical imaging analysis with specialized models for skin disease, diabetic retinopathy, and brain tumor detection.
            </p>
          </motion.div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className={`relative h-full ${getPlanColor(plan.id)} transition-all duration-300 hover:shadow-xl hover:-translate-y-2`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 text-sm">
                      <Star className="h-4 w-4 mr-1" />
                      Best Value
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(plan.id)}
                  </div>
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-6">
                    <span className="text-5xl font-bold text-gray-900">
                      {plan.currency}{plan.price}
                    </span>
                    <span className="text-gray-600 text-lg">
                      /{plan.interval}
                    </span>
                  </div>
                  {plan.id === 'yearly' && (
                    <div className="mt-2 text-sm text-green-600 font-medium">
                      Save ₹{savingsInfo.savings} ({savingsInfo.percentage}% off)
                    </div>
                  )}
                  <CardDescription className="mt-4 text-base">
                    {plan.id === 'free' && 'Perfect for trying out our AI models'}
                    {plan.id === 'monthly' && 'Great for regular users'}
                    {plan.id === 'yearly' && 'Best value with 2 months free!'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full py-6 text-lg ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transform hover:scale-105' 
                        : plan.id === 'monthly'
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-105'
                        : 'transform hover:scale-105'
                    } transition-all duration-200`}
                    variant={plan.id === 'free' ? 'outline' : 'default'}
                    onClick={() => handleUpgrade(plan)}
                  >
                    {plan.id === 'free' ? (
                      <>
                        <Zap className="mr-2 h-5 w-5" />
                        Start Free Trial
                      </>
                    ) : plan.id === 'monthly' ? (
                      <>
                        <Crown className="mr-2 h-5 w-5" />
                        Choose Monthly
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Choose Yearly
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* ... The rest of your JSX remains unchanged ... */}
      </div>
    </div>
  );
};

export default Pricing;