import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { Check, Crown, Zap, ArrowRight, Star, Sparkles, Calendar, ShieldCheck, Minus, Plus } from 'lucide-react';
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
  const [scanCount, setScanCount] = useState(0);
  const [showClinicModal, setShowClinicModal] = useState(false);
  const [showHospitalModal, setShowHospitalModal] = useState(false);
  const PRICE_PER_SCAN = 20;

  // Small Business (Clinic) Plans
  const smallBusinessPlans = {
    monthly: pricingPlans.find(p => p.id === 'small-business-monthly'),
    yearly: pricingPlans.find(p => p.id === 'small-business-yearly')
  };

  // Large Business (Hospital) Plans - from stripe.ts
  const largeBusinessPlans = {
    monthly: pricingPlans.find(p => p.id === 'large-business-monthly'),
    yearly: pricingPlans.find(p => p.id === 'large-business-yearly')
  };

  const handleUpgrade = async (plan: PricingPlan | 'custom' | any) => {
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    // Handle custom scan pricing
    if (plan === 'custom') {
      if (scanCount === 0) {
        alert('Please select at least 1 scan to purchase.');
        return;
      }

      const totalAmount = scanCount * PRICE_PER_SCAN;

      try {
        // Call backend to create a Razorpay order for custom scans
        const orderResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/create-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            amount: totalAmount,
            planType: 'custom',
            scanCount: scanCount
          }),
        });

        if (!orderResponse.ok) {
          throw new Error('Failed to create order on the server.');
        }

        const order = await orderResponse.json();

        // Configure Razorpay options
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: order.amount,
          currency: order.currency,
          name: 'MediScan',
          description: `Payment for ${scanCount} scans (₹${PRICE_PER_SCAN} per scan)`,
          order_id: order.id,
          handler: async function (response: any) {
            const verifyResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                planType: 'custom',
                scanCount: scanCount
              }),
            });

            const result = await verifyResponse.json();
            if (result.status === 'success') {
              alert(`Payment Successful! You now have ${scanCount} scans added to your account.`);
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

        const rzp = new window.Razorpay(options);
        rzp.open();

      } catch (error) {
        console.error("Payment Error:", error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';

        if (errorMessage.includes('order') || errorMessage.includes('Order')) {
          alert("❌ Failed to create payment order. Please check your internet connection and try again.");
        } else if (errorMessage.includes('verify') || errorMessage.includes('verification')) {
          alert("⚠️ Payment was processed but verification failed. Please contact support with your payment details. Our team will verify your purchase manually.");
        } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
          alert("🌐 Network error. Please check your internet connection and retry.");
        } else {
          alert(`❌ An error occurred: ${errorMessage}. Please try again or contact support if the issue persists.`);
        }
      }
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
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('order') || errorMessage.includes('Order')) {
        alert("❌ Failed to create payment order. Please check your internet connection and try again.");
      } else if (errorMessage.includes('verify') || errorMessage.includes('verification')) {
        alert("⚠️ Payment was processed but verification failed. Please contact support with your payment details.");
      } else if (errorMessage.includes('network') || errorMessage.includes('Network')) {
        alert("🌐 Network error. Please check your internet connection and retry.");
      } else {
        alert(`❌ An error occurred: ${errorMessage}. Please try again or contact support if the issue persists.`);
      }
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
    const monthlyPrice = 500; // ₹500 for 100 scans
    const monthlyScans = 100;
    const pricePerScanMonthly = monthlyPrice / monthlyScans; // ₹5 per scan

    const yearlyPrice = 5000; // ₹5000 for 5000 scans
    const yearlyScans = 5000;
    const pricePerScanYearly = yearlyPrice / yearlyScans; // ₹1 per scan

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
          {/* Custom Scan Pricing Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0 }}
          >
            <CardContainer className="inter-var w-full h-full">
              <CardBody className="relative group/card w-full h-full rounded-3xl p-6 border bg-white/80 backdrop-blur-sm border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300">

                {/* Card Header */}
                <div className="flex flex-col items-center text-center mb-8 pt-4">
                  <CardItem translateZ="60" className="mb-4 bg-slate-50 p-4 rounded-2xl shadow-sm">
                    <Zap className="h-10 w-10 text-blue-500" />
                  </CardItem>

                  <CardItem translateZ="50" className="text-2xl font-bold mb-2 text-slate-900">
                    Custom Scans
                  </CardItem>

                  <CardItem translateZ="40" className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-5xl font-extrabold text-slate-900">
                      ₹{scanCount * PRICE_PER_SCAN}
                    </span>
                  </CardItem>

                  <CardItem translateZ="30" className="text-sm text-slate-500">
                    ₹{PRICE_PER_SCAN} per scan
                  </CardItem>
                </div>

                {/* Scan Counter */}
                <CardItem translateZ="40" className="w-full mb-6">
                  <div className="flex items-center justify-center gap-4 bg-slate-50 rounded-xl p-4">
                    <Button
                      onClick={() => setScanCount(Math.max(0, scanCount - 1))}
                      disabled={scanCount === 0}
                      size="icon"
                      variant="outline"
                      className="h-12 w-12 rounded-lg border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      <Minus className="h-5 w-5" />
                    </Button>

                    <div className="flex flex-col items-center min-w-[100px]">
                      <span className="text-4xl font-bold text-slate-900">{scanCount}</span>
                      <span className="text-xs text-slate-500 mt-1">scans</span>
                    </div>

                    <Button
                      onClick={() => setScanCount(scanCount + 1)}
                      size="icon"
                      variant="outline"
                      className="h-12 w-12 rounded-lg border-2 border-slate-300 hover:border-blue-500 hover:bg-blue-50 transition-all"
                    >
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>
                </CardItem>

                {/* Features List */}
                <CardItem translateZ="30" className="w-full space-y-4 mb-8">
                  {[
                    'Pay only for what you need',
                    'All 3 disease models',
                    'No expiration'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-slate-600">
                        {feature}
                      </span>
                    </div>
                  ))}
                </CardItem>

                {/* Action Button */}
                <div className="mt-auto">
                  <CardItem translateZ="50" className="w-full">
                    <Button
                      size="lg"
                      className="w-full rounded-xl py-6 text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                      onClick={() => handleUpgrade('custom')}
                      disabled={scanCount === 0}
                    >
                      {scanCount === 0 ? 'Select Scans' : `Buy ${scanCount} Scan${scanCount > 1 ? 's' : ''}`}
                    </Button>
                  </CardItem>
                </div>

              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Small Business (Clinics) Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CardContainer className="inter-var w-full h-full">
              <CardBody className="relative group/card w-full h-full rounded-3xl p-6 border bg-white border-blue-200 hover:border-blue-400 hover:shadow-xl transition-all duration-300 overflow-visible">
                {/* Blue gradient fading from edges to center */}
                <div className="absolute inset-0 rounded-3xl -z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200/60 via-blue-100/40 to-transparent rounded-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-blue-200/60 via-blue-100/40 to-transparent rounded-3xl"></div>
                  <div className="absolute inset-0 bg-white/60 rounded-3xl"></div>
                </div>

                {/* Card Header */}
                <div className="flex flex-col items-center text-center mb-8 pt-4">
                  <CardItem translateZ="60" className="mb-4 bg-white p-4 rounded-2xl shadow-md">
                    <Crown className="h-10 w-10 text-blue-500" />
                  </CardItem>

                  <CardItem translateZ="50" className="text-2xl font-bold mb-2 text-slate-900">
                    Small Business
                  </CardItem>

                  <CardItem translateZ="40" className="text-base text-slate-600 mb-4">
                    Perfect for Clinics & Small Practices
                  </CardItem>
                </div>

                {/* Features List */}
                <CardItem translateZ="30" className="w-full space-y-4 mb-8">
                  {[
                    'Flexible monthly & yearly plans',
                    'Up to 5000 scans per year',
                    'All 3 disease models',
                    'Priority support',
                    'Cost-effective pricing'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </CardItem>

                {/* Action Button */}
                <div className="mt-auto">
                  <CardItem translateZ="50" className="w-full">
                    <Button
                      size="lg"
                      className="w-full rounded-xl py-6 text-lg font-semibold bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                      onClick={() => setShowClinicModal(true)}
                    >
                      View Plans <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardItem>
                </div>

              </CardBody>
            </CardContainer>
          </motion.div>

          {/* Large Business (Hospitals) Card */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CardContainer className="inter-var w-full h-full">
              <CardBody className="relative group/card w-full h-full rounded-3xl p-6 border bg-white border-emerald-200 hover:border-emerald-400 hover:shadow-xl transition-all duration-300 overflow-visible">
                {/* Green gradient fading from edges to center */}
                <div className="absolute inset-0 rounded-3xl -z-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-200/60 via-emerald-100/40 to-transparent rounded-3xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-tl from-emerald-200/60 via-emerald-100/40 to-transparent rounded-3xl"></div>
                  <div className="absolute inset-0 bg-white/60 rounded-3xl"></div>
                </div>

                {/* Card Header */}
                <div className="flex flex-col items-center text-center mb-8 pt-4">
                  <CardItem translateZ="60" className="mb-4 bg-white p-4 rounded-2xl shadow-md">
                    <Star className="h-10 w-10 text-emerald-500 fill-emerald-500" />
                  </CardItem>

                  <CardItem translateZ="50" className="text-2xl font-bold mb-2 text-slate-900">
                    Large Business
                  </CardItem>

                  <CardItem translateZ="40" className="text-base text-slate-600 mb-4">
                    Enterprise Solution for Hospitals
                  </CardItem>
                </div>

                {/* Features List */}
                <CardItem translateZ="30" className="w-full space-y-4 mb-8">
                  {[
                    'High-volume scan packages',
                    'Up to 10,000 scans per year',
                    'All 3 disease models',
                    'Priority & dedicated support',
                    'Analytics dashboard',
                    'Account manager'
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-600">
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-sm text-slate-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </CardItem>

                {/* Action Button */}
                <div className="mt-auto">
                  <CardItem translateZ="50" className="w-full">
                    <Button
                      size="lg"
                      className="w-full rounded-xl py-6 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                      onClick={() => setShowHospitalModal(true)}
                    >
                      View Plans <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardItem>
                </div>

              </CardBody>
            </CardContainer>
          </motion.div>
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

        {/* Clinic Plans Modal */}
        {showClinicModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-blue-900/40 via-slate-900/50 to-emerald-900/40 backdrop-blur-md"
            onClick={() => setShowClinicModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-emerald-400/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl -z-10"></div>

              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                      Small Business Plans
                    </h2>
                  </div>
                  <p className="text-slate-600 text-lg ml-14">Perfect for clinics and small medical practices</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100 transition-all hover:rotate-90 duration-300"
                  onClick={() => setShowClinicModal(false)}
                >
                  <span className="text-3xl text-slate-400">×</span>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Monthly Plan */}
                {smallBusinessPlans.monthly && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group relative border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-400 transition-all hover:shadow-2xl bg-gradient-to-br from-white to-blue-50/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

                    <div className="relative">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                          <Calendar className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">Monthly Plan</h3>
                          <p className="text-sm text-blue-600 font-medium">Flexible monthly billing</p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-extrabold text-slate-900">
                            {smallBusinessPlans.monthly.currency}{smallBusinessPlans.monthly.price}
                          </span>
                          <span className="text-xl text-slate-500 font-medium">/{smallBusinessPlans.monthly.interval}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-lg mb-2">
                          <ShieldCheck className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{smallBusinessPlans.monthly.scanLimit} scans • {smallBusinessPlans.monthly.validityDays} days validity</span>
                        </div>
                        <p className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full inline-block">
                          ₹{(smallBusinessPlans.monthly.price / smallBusinessPlans.monthly.scanLimit).toFixed(2)} per scan
                        </p>
                      </div>

                      <div className="space-y-3 mb-8">
                        {smallBusinessPlans.monthly.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-0.5 p-1 bg-emerald-100 rounded-full">
                              <Check className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-sm text-slate-700 leading-relaxed">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-7 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                        onClick={() => {
                          setShowClinicModal(false);
                          handleUpgrade(smallBusinessPlans.monthly);
                        }}
                      >
                        Choose Monthly Plan →
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Yearly Plan */}
                {smallBusinessPlans.yearly && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group relative border-2 border-emerald-400 rounded-2xl p-8 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-2xl transition-all overflow-visible"
                  >
                    {/* Best Value Badge */}
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1 rotate-12 z-10">
                      <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                      BEST VALUE
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-50"></div>

                    <div className="relative">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                          <Crown className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">Yearly Plan</h3>
                          <p className="text-sm text-emerald-600 font-bold bg-white/60 px-2 py-0.5 rounded-full inline-block">
                            Save {savingsInfo.savingsPercentage}%!
                          </p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-extrabold text-slate-900">
                            {smallBusinessPlans.yearly.currency}{smallBusinessPlans.yearly.price}
                          </span>
                          <span className="text-xl text-slate-500 font-medium">/{smallBusinessPlans.yearly.interval}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700 bg-white/60 px-4 py-2 rounded-lg font-medium mb-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          <span>{smallBusinessPlans.yearly.scanLimit} scans • {smallBusinessPlans.yearly.validityDays} days validity</span>
                        </div>
                        <p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full inline-block">
                          ₹{(smallBusinessPlans.yearly.price / smallBusinessPlans.yearly.scanLimit).toFixed(2)} per scan
                        </p>
                      </div>

                      <div className="space-y-3 mb-8">
                        {smallBusinessPlans.yearly.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-0.5 p-1 bg-emerald-200 rounded-full">
                              <Check className="h-4 w-4 text-emerald-700" />
                            </div>
                            <span className="text-sm text-slate-800 font-medium leading-relaxed">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-7 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg"
                        onClick={() => {
                          setShowClinicModal(false);
                          handleUpgrade(smallBusinessPlans.yearly);
                        }}
                      >
                        Choose Yearly Plan →
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Trust indicators */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">DPDP Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">Trusted by 500+ Clinics</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Hospital Plans Modal */}
        {showHospitalModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-br from-blue-900/40 via-slate-900/50 to-emerald-900/40 backdrop-blur-md"
            onClick={() => setShowHospitalModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white/95 backdrop-blur-xl rounded-3xl p-10 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-emerald-400/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-emerald-400/10 to-blue-400/10 rounded-full blur-3xl -z-10"></div>

              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-emerald-500 rounded-xl">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                      Hospital Enterprise Plans
                    </h2>
                  </div>
                  <p className="text-slate-600 text-lg ml-14">Enterprise solutions for hospitals and large medical facilities</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-slate-100 transition-all hover:rotate-90 duration-300"
                  onClick={() => setShowHospitalModal(false)}
                >
                  <span className="text-3xl text-slate-400">×</span>
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Monthly Hospital Plan */}
                {largeBusinessPlans.monthly && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="group relative border-2 border-blue-200 rounded-2xl p-8 hover:border-blue-400 transition-all hover:shadow-2xl bg-gradient-to-br from-white to-blue-50/30"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

                    <div className="relative">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                          <Calendar className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">Monthly Plan</h3>
                          <p className="text-sm text-blue-600 font-medium">Flexible monthly billing</p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-extrabold text-slate-900">
                            {largeBusinessPlans.monthly.currency}{largeBusinessPlans.monthly.price}
                          </span>
                          <span className="text-xl text-slate-500 font-medium">/{largeBusinessPlans.monthly.interval}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 bg-blue-50 px-4 py-2 rounded-lg mb-2">
                          <ShieldCheck className="h-4 w-4 text-blue-600" />
                          <span className="font-medium">{largeBusinessPlans.monthly.scanLimit} scans • {largeBusinessPlans.monthly.validityDays} days validity</span>
                        </div>
                        <p className="text-xs text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full inline-block">
                          ₹{(largeBusinessPlans.monthly.price / largeBusinessPlans.monthly.scanLimit).toFixed(2)} per scan
                        </p>
                      </div>

                      <div className="space-y-3 mb-8">
                        {largeBusinessPlans.monthly.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 + idx * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-0.5 p-1 bg-emerald-100 rounded-full">
                              <Check className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-sm text-slate-700 leading-relaxed">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-7 rounded-xl shadow-lg hover:shadow-xl transition-all text-lg"
                        onClick={() => {
                          setShowHospitalModal(false);
                          handleUpgrade(largeBusinessPlans.monthly);
                        }}
                      >
                        Choose Monthly Plan →
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Yearly Hospital Plan */}
                {largeBusinessPlans.yearly && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="group relative border-2 border-emerald-400 rounded-2xl p-8 bg-gradient-to-br from-emerald-50 to-teal-50 hover:shadow-2xl transition-all overflow-visible"
                  >
                    {/* Best Value Badge */}
                    <div className="absolute -top-3 -right-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg flex items-center gap-1 rotate-12 z-10">
                      <Star className="h-3 w-3 fill-yellow-300 text-yellow-300" />
                      BEST VALUE
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 opacity-50"></div>

                    <div className="relative">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="p-4 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-lg">
                          <Crown className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-900">Yearly Plan</h3>
                          <p className="text-sm text-emerald-600 font-bold bg-white/60 px-2 py-0.5 rounded-full inline-block">
                            Save 17% annually!
                          </p>
                        </div>
                      </div>

                      <div className="mb-8">
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className="text-5xl font-extrabold text-slate-900">
                            {largeBusinessPlans.yearly.currency}{largeBusinessPlans.yearly.price}
                          </span>
                          <span className="text-xl text-slate-500 font-medium">/{largeBusinessPlans.yearly.interval}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-700 bg-white/60 px-4 py-2 rounded-lg font-medium mb-2">
                          <ShieldCheck className="h-4 w-4 text-emerald-600" />
                          <span>{largeBusinessPlans.yearly.scanLimit} scans • {largeBusinessPlans.yearly.validityDays} days validity</span>
                        </div>
                        <p className="text-xs text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full inline-block">
                          ₹{(largeBusinessPlans.yearly.price / largeBusinessPlans.yearly.scanLimit).toFixed(2)} per scan
                        </p>
                      </div>

                      <div className="space-y-3 mb-8">
                        {largeBusinessPlans.yearly.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + idx * 0.05 }}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-0.5 p-1 bg-emerald-200 rounded-full">
                              <Check className="h-4 w-4 text-emerald-700" />
                            </div>
                            <span className="text-sm text-slate-800 font-medium leading-relaxed">{feature}</span>
                          </motion.div>
                        ))}
                      </div>

                      <Button
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold py-7 rounded-xl shadow-xl hover:shadow-2xl transition-all text-lg"
                        onClick={() => {
                          setShowHospitalModal(false);
                          handleUpgrade(largeBusinessPlans.yearly);
                        }}
                      >
                        Choose Yearly Plan →
                      </Button>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Trust indicators */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-center gap-8 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-blue-600" />
                    <span className="font-medium">HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                    <span className="font-medium">Trusted by 100+ Hospitals</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Pricing;