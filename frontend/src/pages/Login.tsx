import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, ArrowRight, AlertTriangle, Loader2, Eye, EyeOff, Stethoscope, Activity, HeartPulse } from 'lucide-react';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            await login(mobile, password);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-teal-50 relative flex items-center justify-center antialiased overflow-hidden">
            <BackgroundBeams className="absolute top-0 left-0 w-full h-full z-0 opacity-30" />

            <div className="z-10 w-full max-w-6xl mx-auto px-4 py-8">
                <div className="grid lg:grid-cols-2 gap-8 items-center">

                    {/* Left Side - Doctor Illustration with Animations */}
                    <motion.div
                        className="hidden lg:flex flex-col items-center justify-center relative"
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Floating Animated Icons */}
                        <motion.div
                            className="absolute top-10 left-10 bg-blue-100 p-4 rounded-full"
                            animate={{ y: [-15, 0] }}
                            transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <Stethoscope className="h-8 w-8 text-blue-600" />
                        </motion.div>

                        <motion.div
                            className="absolute top-20 right-10 bg-teal-100 p-4 rounded-full"
                            animate={{ y: [0, 15] }}
                            transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse" }}
                        >
                            <HeartPulse className="h-8 w-8 text-teal-600" />
                        </motion.div>

                        {/* Static Image */}
                        <motion.div
                            className="relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src="/assets/login.png"
                                alt="Login Illustration"
                                className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        {/* Welcome Text */}
                        <motion.div
                            className="mt-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back!</h2>
                            <p className="text-slate-600 text-lg">Sign in to access your medical dashboard</p>
                        </motion.div>
                    </motion.div>

                    {/* Right Side - Login Form with Static Card */}
                    <div className="w-full">
                        <div className="bg-white relative border-slate-200 w-full h-auto rounded-2xl p-8 border shadow-lg">

                            <div className="w-full text-center mb-6">
                                <div className="mx-auto bg-gradient-to-br from-blue-500 to-teal-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <Stethoscope className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold text-slate-900 flex items-center justify-center gap-2">
                                    MediScan <Activity className="h-5 w-5 text-green-500 animate-pulse" />
                                </h1>
                                <p className="text-slate-600 text-sm max-w-sm mt-2 mx-auto">
                                    Advanced AI Medical Analysis Platform
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                {error && (
                                    <div className="w-full">
                                        <Alert variant="destructive" className="items-center">
                                            <AlertTriangle className="h-4 w-4" />
                                            <AlertDescription>{error}</AlertDescription>
                                        </Alert>
                                    </div>
                                )}

                                <div className="w-full space-y-2">
                                    <Label htmlFor="mobile" className="text-slate-700">
                                        <Phone className="inline h-4 w-4 mr-2" />Mobile Number
                                    </Label>
                                    <Input
                                        id="mobile"
                                        type="tel"
                                        placeholder="Enter your mobile number"
                                        value={mobile}
                                        onChange={(e) => setMobile(e.target.value)}
                                        required
                                        className="bg-slate-50 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>

                                <div className="w-full space-y-2">
                                    <Label htmlFor="password" className="text-slate-700">
                                        <Lock className="inline h-4 w-4 mr-2" />Password
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Enter your password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="bg-slate-50 border-slate-200 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>

                                <div className="w-full flex justify-between items-center text-sm pt-2">
                                    <button type="button" onClick={() => navigate('/forgot-password')} className="font-semibold text-blue-600 hover:underline">
                                        Forgot Password?
                                    </button>
                                </div>

                                <div className="w-full pt-4">
                                    <Button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
                                    </Button>
                                </div>
                            </form>

                            <div className="w-full mt-6 text-center text-sm text-slate-600">
                                Don't have an account?{' '}
                                <button onClick={() => navigate('/register')} className="font-semibold text-blue-600 hover:underline">
                                    Create Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;