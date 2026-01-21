import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { User, Phone, Lock, ArrowRight, Eye, EyeOff, AlertTriangle, Loader2, Key, UserPlus, Shield, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const Register: React.FC = () => {
    const [step, setStep] = useState<'details' | 'otp'>('details');
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { handleAuthSuccess } = useAuth();

    // Validation functions
    const nameValidation = useMemo(() => {
        if (!name) return { valid: false, message: '' };
        if (name.length < 3) return { valid: false, message: 'Name must be at least 3 characters' };
        if (!/^[a-zA-Z\s]+$/.test(name)) return { valid: false, message: 'Name should contain only letters' };
        return { valid: true, message: 'Valid name' };
    }, [name]);

    const mobileValidation = useMemo(() => {
        if (!mobile) return { valid: false, message: '' };
        if (!/^[6-9]\d{9}$/.test(mobile)) return { valid: false, message: 'Enter a valid 10-digit mobile number starting with 6-9' };
        return { valid: true, message: 'Valid mobile number' };
    }, [mobile]);

    const passwordValidation = useMemo(() => {
        if (!password) return { valid: false, message: '', strength: 0 };

        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const strength = Object.values(checks).filter(Boolean).length;

        if (password.length < 6) return { valid: false, message: 'Password must be at least 6 characters', strength: 0 };
        if (password.length < 8) return { valid: false, message: 'Password should be at least 8 characters for better security', strength: 1 };
        if (!checks.uppercase || !checks.lowercase) return { valid: false, message: 'Include both uppercase and lowercase letters', strength: 2 };
        if (!checks.number) return { valid: false, message: 'Include at least one number', strength: 3 };
        if (!checks.special) return { valid: false, message: 'Include at least one special character (!@#$%^&*)', strength: 4 };

        return { valid: true, message: 'Strong password', strength: 5 };
    }, [password]);

    const confirmPasswordValidation = useMemo(() => {
        if (!confirmPassword) return { valid: false, message: '' };
        if (password !== confirmPassword) return { valid: false, message: 'Passwords do not match' };
        return { valid: true, message: 'Passwords match' };
    }, [password, confirmPassword]);

    const isFormValid = useMemo(() => {
        return nameValidation.valid &&
            mobileValidation.valid &&
            passwordValidation.valid &&
            confirmPasswordValidation.valid;
    }, [nameValidation, mobileValidation, passwordValidation, confirmPasswordValidation]);

    const getPasswordStrengthColor = () => {
        const strength = passwordValidation.strength;
        if (strength <= 1) return 'bg-red-500';
        if (strength === 2) return 'bg-orange-500';
        if (strength === 3) return 'bg-yellow-500';
        if (strength === 4) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getPasswordStrengthText = () => {
        const strength = passwordValidation.strength;
        if (strength <= 1) return 'Weak';
        if (strength === 2) return 'Fair';
        if (strength === 3) return 'Good';
        if (strength === 4) return 'Strong';
        return 'Very Strong';
    };

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!isFormValid) {
            setError('Please fill all fields correctly before proceeding.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/send-registration-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mobile }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to send OTP');

            toast.success(`An OTP has been sent to ${mobile}`);
            setStep('otp');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyAndRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (otp.length !== 6) return setError('Please enter the 6-digit OTP.');

        setIsLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify-and-register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, mobile, password, otp }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Registration failed');

            toast.success('Registration successful! Welcome.');
            handleAuthSuccess(data.user, data.token);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-blue-50 relative flex items-center justify-center antialiased overflow-hidden py-8">
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-20 right-10 w-96 h-96 bg-green-200/30 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
            </div>

            <div className="z-10 w-full max-w-6xl mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-8 items-center">

                    {/* Left Side - Doctor with Clipboard Illustration */}
                    <div
                        className="hidden lg:flex flex-col items-center justify-center relative"
                    >
                        {/* Animated Icons */}
                        <motion.div
                            className="absolute top-10 left-10 bg-green-100 p-4 rounded-full"
                            animate={{ rotate: [0, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        >
                            <UserPlus className="h-8 w-8 text-green-600" />
                        </motion.div>

                        <motion.div
                            className="absolute top-20 right-10 bg-blue-100 p-4 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Shield className="h-8 w-8 text-blue-600" />
                        </motion.div>

                        {/* Static Register Image */}
                        <motion.div
                            className="relative"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.8 }}
                        >
                            <img
                                src="/assets/register.png"
                                alt="Register Illustration"
                                className="w-full max-w-md h-auto object-contain drop-shadow-2xl"
                            />
                        </motion.div>

                        <motion.div
                            className="mt-8 text-center"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                        >
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Join MediScan!</h2>
                            <p className="text-slate-600 text-lg">Create your account for AI-powered health insights</p>
                        </motion.div>
                    </div>

                    {/* Right Side - Registration Form */}
                    <div className="w-full">
                        <div className="bg-white relative border-slate-200 w-full h-auto rounded-2xl p-8 border shadow-lg">

                            <div className="w-full text-center mb-6">
                                <div className="mx-auto bg-gradient-to-br from-green-500 to-blue-500 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                                    <UserPlus className="h-8 w-8 text-white" />
                                </div>
                                <h1 className="text-2xl font-bold text-slate-900">
                                    {step === 'details' ? 'Create Your Account' : 'Verify Your Number'}
                                </h1>
                                <p className="text-slate-600 text-sm mt-2">
                                    {step === 'details'
                                        ? 'Join to get AI-powered medical analysis'
                                        : `Enter the 6-digit OTP sent to ${mobile}`}
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

                            {step === 'details' ? (
                                <form onSubmit={handleSendOtp} className="space-y-4">
                                    {/* Name Field */}
                                    <div className="w-full space-y-2">
                                        <Label htmlFor="name" className="text-slate-700">
                                            <User className="inline h-4 w-4 mr-2" />Full Name
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="name"
                                                type="text"
                                                placeholder="Enter your full name"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className={`bg-slate-50 pr-10 transition-all ${name ? (nameValidation.valid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') : 'border-slate-200 focus:ring-green-500'
                                                    }`}
                                            />
                                            {name && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {nameValidation.valid ? (
                                                        <Check className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <X className="h-5 w-5 text-red-500" />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {/* Mobile Field */}
                                    <div className="w-full space-y-2">
                                        <Label htmlFor="mobile" className="text-slate-700">
                                            <Phone className="inline h-4 w-4 mr-2" />Mobile Number
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="mobile"
                                                type="tel"
                                                placeholder="Enter your 10-digit mobile"
                                                value={mobile}
                                                onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                                maxLength={10}
                                                className={`bg-slate-50 pr-10 transition-all ${mobile ? (mobileValidation.valid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') : 'border-slate-200 focus:ring-green-500'
                                                    }`}
                                            />
                                            {mobile && (
                                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                    {mobileValidation.valid ? (
                                                        <Check className="h-5 w-5 text-green-500" />
                                                    ) : (
                                                        <X className="h-5 w-5 text-red-500" />
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    {/* Password Field */}
                                    <div className="w-full space-y-2">
                                        <Label htmlFor="password" className="text-slate-700">
                                            <Lock className="inline h-4 w-4 mr-2" />Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="password"
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="Create a strong password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={`bg-slate-50 pr-10 transition-all ${password ? (passwordValidation.valid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') : 'border-slate-200 focus:ring-green-500'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                        {password && (
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                            style={{ width: `${(passwordValidation.strength / 5) * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className={`text-xs font-medium ${passwordValidation.strength <= 1 ? 'text-red-500' :
                                                        passwordValidation.strength === 2 ? 'text-orange-500' :
                                                            passwordValidation.strength === 3 ? 'text-yellow-500' :
                                                                passwordValidation.strength === 4 ? 'text-blue-500' : 'text-green-500'
                                                        }`}>
                                                        {getPasswordStrengthText()}
                                                    </span>
                                                </div>

                                            </div>
                                        )}
                                    </div>

                                    {/* Confirm Password Field */}
                                    <div className="w-full space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-slate-700">
                                            <Lock className="inline h-4 w-4 mr-2" />Confirm Password
                                        </Label>
                                        <div className="relative">
                                            <Input
                                                id="confirmPassword"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                placeholder="Re-enter your password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className={`bg-slate-50 pr-10 transition-all ${confirmPassword ? (confirmPasswordValidation.valid ? 'border-green-500 focus:ring-green-500' : 'border-red-500 focus:ring-red-500') : 'border-slate-200 focus:ring-green-500'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>

                                    </div>

                                    <div className="w-full pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            disabled={!isFormValid || isLoading}
                                        >
                                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...</> : <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>}
                                        </Button>
                                        {!isFormValid && (name || mobile || password || confirmPassword) && (
                                            <p className="text-xs text-slate-500 mt-2 text-center">Complete all fields correctly to continue</p>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                                    <div className="w-full space-y-2">
                                        <Label htmlFor="otp" className="text-slate-700">
                                            <Key className="inline h-4 w-4 mr-2" />One-Time Password (OTP)
                                        </Label>
                                        <Input
                                            id="otp"
                                            type="text"
                                            placeholder="Enter the 6-digit OTP"
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                            required
                                            maxLength={6}
                                            className="bg-slate-50 border-slate-200 focus:ring-green-500 focus:border-green-500 text-center text-2xl tracking-widest"
                                        />
                                    </div>

                                    <div className="w-full pt-4">
                                        <Button
                                            type="submit"
                                            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                            disabled={isLoading || otp.length !== 6}
                                        >
                                            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>}
                                        </Button>
                                    </div>

                                    <div className="w-full text-center">
                                        <Button variant="link" onClick={() => { setStep('details'); setError(''); }}>
                                            Back to details
                                        </Button>
                                    </div>
                                </form>
                            )}

                            <div className="w-full mt-6 text-center text-sm text-slate-600">
                                Already have an account?{' '}
                                <button onClick={() => navigate('/login')} className="font-semibold text-green-600 hover:underline">
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

export default Register;