import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { Check, Crown, Zap, ArrowRight, Star, Sparkles, Calendar, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { pricingPlans, PricingPlan } from '@/lib/stripe';
import { BackgroundGradientAnimation } from '@/components/ui/background-gradient-animation';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { Button as MovingBorderButton } from '@/components/ui/moving-border';

// This tells TypeScript that the Razorpay object will be available on the global window object.
declare global {
  interface Window {
    Razorpay: any;
  }
}

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();

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
        body: JSON.stringify({
          amount: Number(plan.price),
          planType: plan.id // Pass plan ID (monthly or yearly)
        }),
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
        description: `Payment for ${plan.name} - ${plan.scanLimit} scans (${plan.validityDays} days)`,
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
              planType: plan.id // Pass plan ID for verification
            }),
          });

          const result = await verifyResponse.json();
          if (result.status === 'success') {
            // 4. If verification is successful, navigate the user to their dashboard.
            const expiryDate = new Date(result.planDetails.expiryDate);
            const formattedDate = expiryDate.toLocaleDateString('en-IN');
            alert(`Payment Successful! You now have ${result.planDetails.maxScans} scans valid until ${formattedDate}.`);
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
      case 'free': return <Zap className="h-10 w-10 text-blue-500" />;
      case 'monthly': return <Crown className="h-10 w-10 text-amber-500" />;
      case 'yearly': return <Star className="h-10 w-10 text-purple-500 fill-purple-500" />;
      default: return <Zap className="h-10 w-10" />;
    }
  };

  const getSavingsText = () => {
    const monthlyPrice = 150; // ₹150 for 100 scans
    const monthlyScans = 100;
    const pricePerScanMonthly = monthlyPrice / monthlyScans; // ₹1.5 per scan

    const yearlyPrice = 1500; // ₹1500 for 5000 scans
    const yearlyScans = 5000;
    const pricePerScanYearly = yearlyPrice / yearlyScans; // ₹0.3 per scan

    const savingsPerScan = pricePerScanMonthly - pricePerScanYearly;
    const savingsPercentage = Math.round((savingsPerScan / pricePerScanMonthly) * 100);

    return {
      pricePerScanMonthly: pricePerScanMonthly.toFixed(2),
      pricePerScanYearly: pricePerScanYearly.toFixed(2),
      savingsPercentage,
      totalValue: (yearlyScans * pricePerScanMonthly) - yearlyPrice
    };
  };

  const savingsInfo = getSavingsText();

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50">
      <Navbar />

      {/* Background with Gradient Animation */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(240, 250, 255)"
          gradientBackgroundEnd="rgb(255, 255, 255)"
          firstColor="59, 130, 246"
          secondColor="34, 197, 94"
          thirdColor="168, 85, 247"
        />
      </div>

      <div className="relative z-10 pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center gap-2 mb-4"
          >
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold border border-blue-200">
              Pricing Plans
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-slate-900 tracking-tight"
          >
            Invest in Your Health with <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 animate-gradient-x">
              MediScan AI
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-slate-600 max-w-2xl mx-auto"
          >
            Professional-grade medical imaging analysis accessible to everyone. Choose the plan that fits your needs.
          </motion.p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <CardContainer className="inter-var w-full h-full">
                <CardBody className={`relative group/card w-full h-full rounded-3xl p-6 border transition-all duration-300 ${plan.popular
                  ? 'bg-slate-900 border-slate-800 text-white'
                  : 'bg-white/80 backdrop-blur-sm border-slate-200 hover:border-blue-300 hover:shadow-xl'
                  }`}>

                  {/* Popular Badge */}
                  {plan.popular && (
                    <CardItem
                      translateZ="50"
                      className="absolute -top-4 left-0 right-0 flex justify-center"
                    >
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-1.5 text-sm font-bold shadow-lg border-0">
                        <Sparkles className="w-4 h-4 mr-1 text-yellow-200" />
                        MOST POPULAR
                      </Badge>
                    </CardItem>
                  )}

                  {/* Card Header */}
                  <div className="flex flex-col items-center text-center mb-8 pt-4">
                    <CardItem translateZ="60" className="mb-4 bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl shadow-sm">
                      {getPlanIcon(plan.id)}
                    </CardItem>

                    <CardItem translateZ="50" className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                      {plan.name}
                    </CardItem>

                    <CardItem translateZ="40" className="flex items-baseline justify-center gap-1">
                      <span className={`text-5xl font-extrabold ${plan.popular ? 'text-white' : 'text-slate-900'}`}>
                        {plan.currency}{plan.price}
                      </span>
                      <span className={`text-lg ${plan.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                        /{plan.interval}
                      </span>
                    </CardItem>

                    {plan.id === 'yearly' && (
                      <CardItem translateZ="30" className="mt-2 text-sm text-yellow-300 font-bold bg-yellow-500/20 px-3 py-1 rounded-full">
                        {savingsInfo.savingsPercentage}% cheaper per scan!
                      </CardItem>
                    )}
                  </div>

                  {/* Features List */}
                  <CardItem translateZ="30" className="w-full space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${plan.popular ? 'bg-blue-500/20 text-blue-400' : 'bg-green-100 text-green-600'
                          }`}>
                          <Check className="w-4 h-4" />
                        </div>
                        <span className={`text-sm ${plan.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </CardItem>

                  {/* Action Button */}
                  <div className="mt-auto">
                    {plan.popular ? (
                      <CardItem translateZ="60" className="w-full flex justify-center">
                        <MovingBorderButton
                          borderRadius="12px"
                          onClick={() => handleUpgrade(plan)}
                          className="bg-slate-900 text-white border-slate-800 font-bold text-lg w-full"
                        >
                          Get 5000 Scans
                        </MovingBorderButton>
                      </CardItem>
                    ) : (
                      <CardItem translateZ="50" className="w-full">
                        <Button
                          size="lg"
                          className="w-full rounded-xl py-6 text-lg font-semibold bg-white border-2 border-slate-200 text-slate-900 hover:bg-slate-50 hover:border-blue-300 transition-all shadow-sm"
                          variant="outline"
                          onClick={() => handleUpgrade(plan)}
                        >
                          {plan.id === 'free' ? 'Try For Free' : `Get ${plan.scanLimit} Scans`}
                        </Button>
                      </CardItem>
                    )}
                  </div>

                </CardBody>
              </CardContainer>
            </motion.div>
          ))}
        </div>

        {/* Security / Trust Badge */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center justify-center gap-8 py-8 px-12 bg-white/50 backdrop-blur-md rounded-2xl border border-white/60 shadow-lg">
            <div className="flex items-center gap-2 text-slate-600">
              <ShieldCheck className="h-6 w-6 text-green-500" />
              <span className="font-semibold">Secure Payment</span>
            </div>
            <div className="h-8 w-px bg-slate-200"></div>
            <div className="flex items-center gap-2 text-slate-600">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="font-semibold">Money Worthy Scans</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Pricing;