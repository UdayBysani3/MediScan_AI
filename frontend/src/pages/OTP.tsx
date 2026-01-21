import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/AuthContext';
import { Phone, Lock, Key, ArrowRight, AlertTriangle, Loader2, CheckCircle, RefreshCw, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { mobileNumber, isRegister } = location.state || {};

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // First verify OTP
      console.log('Verifying OTP:', { mobileNumber, otp });

      const otpResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          mobile: mobileNumber,
          otp: otp
        }),
      });

      const otpData = await otpResponse.json();
      console.log('OTP verification response:', otpData);

      if (!otpResponse.ok) {
        throw new Error(otpData.message || 'Invalid OTP');
      }

      if (isRegister) {
        // Get registration data from session storage
        const regData = JSON.parse(sessionStorage.getItem('registrationData') || '{}');
        console.log('Registration data:', regData);

        if (!regData.mobile || !regData.password || !regData.name) {
          throw new Error('Registration data not found. Please try registering again.');
        }

        // Complete registration
        const registerResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: regData.name,
            mobile: mobileNumber,
            password: regData.password,
            accountType: 'free',
            analysisCount: 0
          })
        });

        const registerData = await registerResponse.json();
        console.log('Registration response:', registerData);

        if (!registerResponse.ok) {
          throw new Error(registerData.error || 'Registration failed');
        }

        // Use registration response data for login
        login(registerData.user, registerData.token);
        sessionStorage.removeItem('registrationData'); // Clean up
        toast.success('Registration successful! Welcome to MediScan AI.');
        navigate('/dashboard');
      } else {
        // For login flow (if applicable in future, currently mainly used for verify after Register or Login logic)
        // Assuming login endpoint handles login after verification or this page is skipped for simple login
        // But keeping logic for robustness if used for login verification
        const loginResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            mobile: mobileNumber,
            otpVerified: true
          })
        });

        const loginData = await loginResponse.json();
        console.log('Login response:', loginData);

        if (!loginResponse.ok) {
          throw new Error(loginData.error || 'Login failed');
        }

        login(loginData.user, loginData.token);
        toast.success('Login successful!');
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-50 via-white to-pink-50 relative flex items-center justify-center antialiased overflow-hidden py-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-pink-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="z-10 w-full max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 items-center">

          {/* Left Side - OTP Verification Illustration */}
          <div className="hidden lg:flex flex-col items-center justify-center relative">
            {/* Floating Animated Icons */}
            <motion.div
              className="absolute top-10 left-10 bg-purple-100 p-4 rounded-full"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Smartphone className="h-8 w-8 text-purple-600" />
            </motion.div>

            <motion.div
              className="absolute top-20 right-10 bg-pink-100 p-4 rounded-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Lock className="h-8 w-8 text-pink-600" />
            </motion.div>

            {/* Static Image */}
            <motion.div
              className="relative"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <img
                src="/assets/passwordMediscan.webp"
                alt="OTP Verification Illustration"
                className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
              />
            </motion.div>

            <div className="mt-8 text-center">
              <h2 className="text-3xl font-bold text-slate-800 mb-2">Verify Your Identity</h2>
              <p className="text-slate-600 text-lg">Secure two-factor authentication</p>
            </div>
          </div>

          {/* Right Side - OTP Form */}
          <div className="w-full">
            <div className="bg-white relative border-slate-200 w-full h-auto rounded-2xl p-8 border shadow-lg">

              <div className="w-full text-center mb-6">
                <div className="mx-auto bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-slate-900">Enter Verification Code</h1>
                <p className="text-slate-600 text-sm mt-2">
                  We've sent a 6-digit code to <span className="font-semibold text-purple-700">{mobileNumber}</span>
                </p>
              </div>

              {error && (
                <div className="w-full mb-4">
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                </div>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="w-full space-y-2">
                  <Label htmlFor="otp" className="text-slate-700">
                    <Key className="inline h-4 w-4 mr-2" />One-Time Password (OTP)
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="bg-slate-50 border-slate-200 focus:ring-purple-500 focus:border-purple-500 text-center text-3xl tracking-[1em] font-mono h-14"
                    maxLength={6}
                    autoFocus
                  />
                </div>

                <div className="w-full pt-4">
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying...</>
                    ) : (
                      <>Verify & Proceed <ArrowRight className="ml-2 h-5 w-5" /></>
                    )}
                  </Button>
                </div>
              </form>

              <div className="w-full mt-6 text-center text-sm text-slate-600">
                Didn't receive the code?{' '}
                <button
                  onClick={() => toast.info('Resend feature coming soon!')}
                  className="font-semibold text-purple-600 hover:underline"
                >
                  Resend Code
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPPage;
