import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Key, ArrowRight, AlertTriangle, Loader2, CheckCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const ForgotPasswordPage: React.FC = () => {
    const [step, setStep] = useState<'enterMobile' | 'enterOtp'>('enterMobile');
    const [mobile, setMobile] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/send-password-reset-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to send OTP');

            toast.success('OTP has been sent to your mobile number.');
            setStep('enterOtp');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (newPassword.length < 6) return setError('Password must be at least 6 characters long.');
        if (newPassword !== confirmPassword) return setError('Passwords do not match.');

        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile, otp, newPassword }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to reset password');

            toast.success('Your password has been reset successfully!');
            navigate('/login');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
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

                    {/* Left Side - Password Reset Illustration */}
                    <div className="hidden lg:flex flex-col items-center justify-center relative">
                        {/* Floating Animated Icons */}
                        <motion.div
                            className="absolute -top-5 -left-16 bg-purple-100 p-5 rounded-full shadow-lg z-20"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 3, repeat: Infinity }}
                        >
                            <RefreshCw className="h-10 w-10 text-purple-600" />
                        </motion.div>

                        <motion.div
                            className="absolute -top-10 -right-16 bg-pink-100 p-5 rounded-full shadow-lg z-20"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Lock className="h-10 w-10 text-pink-600" />
                        </motion.div>

                        <motion.div
                            className="absolute -bottom-8 -left-12 bg-blue-100 p-4 rounded-full shadow-lg z-20"
                            animate={{ scale: [1, 1.1, 1] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                        >
                            <Key className="h-8 w-8 text-blue-600" />
                        </motion.div>

                        {/* Static Image */}
                        <motion.div
                            className="relative z-10"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src="/assets/passwordMediscan.webp"
                                alt="Password Reset Illustration"
                                className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        <motion.div
                            className="mt-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Secure Reset</h2>
                            <p className="text-slate-600 text-lg">We'll help you get back to your account safely</p>
                        </motion.div>
                    </div>

                    {/* Right Side - Password Reset Form */}
                    <div className="w-full">
                        <div className="bg-white relative border-slate-200 w-full h-auto rounded-2xl p-8 border shadow-lg">

                            <div className="w-full text-center mb-6">
                                <div className="mx-auto bg-gradient-to-br from-purple-500 to-pink-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <Lock className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900">Reset Your Password</h1>
                                <p className="text-slate-600 text-sm mt-2">
                                    {step === 'enterMobile'
                                        ? 'Enter your mobile number to receive an OTP.'
                                        : `Enter the OTP sent to ${mobile} and your new password.`}
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

                            {step === 'enterMobile' ? (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    <div className="w-full space-y-2">
                                        <Label htmlFor="mobile" className="text-slate-700">
                                            <Phone className="inline h-4 w-4 mr-2" />Mobile Number
                                        </Label>
                                        <Input
                                            id="mobile"
                                            type="tel"
                                            placeholder="Enter your registered mobile number"
                                            value={mobile}
                                            onChange={(e) => setMobile(e.target.value)}
                                            required
                                            className="bg-slate-50 border-slate-200 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>

                                    <div className="w-full pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...</> : <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>}
                                        </Button>
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleResetPassword} className="space-y-4">
                                    <div className="w-full space-y-2">
                                        <Label htmlFor="otp" className="text-slate-700">
                                            <Key className="inline h-4 w-4 mr-2" />One-Time Password (OTP)
                                        </Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter the 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value)}
                                            required
                                            className="bg-slate-50 border-slate-200 focus:ring-purple-500 focus:border-purple-500 text-center text-2xl tracking-widest"
                                            maxLength={6}
                                        />
                                    </div>

                                    <div className="w-full space-y-2">
                                        <Label htmlFor="newPassword" className="text-slate-700">
                                            <Lock className="inline h-4 w-4 mr-2" />New Password
                                        </Label>
                                        <Input
                                            id="newPassword"
                                            type="password"
                                            placeholder="Min. 6 characters"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className="bg-slate-50 border-slate-200 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>

                                    <div className="w-full space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-slate-700">
                                            <Lock className="inline h-4 w-4 mr-2" />Confirm New Password
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            placeholder="Confirm your new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            className="bg-slate-50 border-slate-200 focus:ring-purple-500 focus:border-purple-500"
                                        />
                                    </div>

                                    <div className="w-full pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</> : <>Reset Password <CheckCircle className="ml-2 h-4 w-4" /></>}
                                        </Button>
                                    </div>
                                </form>
                            )}

                            <div className="w-full mt-6 text-center text-sm text-slate-600">
                                Remember your password?{' '}
                                <button onClick={() => navigate('/login')} className="font-semibold text-purple-600 hover:underline">
                                    Sign In
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;