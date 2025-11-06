import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext';
import { User, Phone, Lock, ArrowRight, Eye, EyeOff, AlertTriangle, Loader2, Key } from 'lucide-react';
import { toast } from 'sonner';

const Register: React.FC = () => {
    // State for the form steps
    const [step, setStep] = useState<'details' | 'otp'>('details');

    // State for user details
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    
    // State for OTP
    const [otp, setOtp] = useState('');

    // General state
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const { handleAuthSuccess } = useAuth(); // We'll use this from AuthContext

    // Step 1: Handle sending the OTP
    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (!name.trim() || !/^[6-9]\d{9}$/.test(mobile) || password.length < 6) {
            setError('Please fill all fields correctly: valid name, 10-digit mobile, and password of at least 6 characters.');
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
            setStep('otp'); // Move to the next step
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Handle verifying the OTP and completing registration
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
            handleAuthSuccess(data.user, data.token); // Log the user in and redirect
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-md mx-auto p-4">
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <h1 className="text-3xl font-bold text-blue-600">MediScan</h1>
                        <CardTitle className="text-2xl">
                            {step === 'details' ? 'Create Your Account' : 'Verify Your Number'}
                        </CardTitle>
                        <CardDescription>
                            {step === 'details' 
                                ? 'Join to get AI-powered medical analysis' 
                                : `Enter the 6-digit OTP sent to ${mobile}`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {step === 'details' ? (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name"><User className="inline h-4 w-4 mr-2" />Full Name</Label>
                                    <Input id="name" type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="mobile"><Phone className="inline h-4 w-4 mr-2" />Mobile Number</Label>
                                    <Input id="mobile" type="tel" placeholder="Enter your 10-digit mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required maxLength={10} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password"><Lock className="inline h-4 w-4 mr-2" />Password</Label>
                                    <div className="relative">
                                        <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                        </button>
                                    </div>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...</> : <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="otp"><Key className="inline h-4 w-4 mr-2" />One-Time Password (OTP)</Label>
                                    <Input id="otp" type="text" placeholder="Enter the 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required maxLength={6} />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : <>Create Account <ArrowRight className="ml-2 h-4 w-4" /></>}
                                </Button>
                                <Button variant="link" onClick={() => { setStep('details'); setError(''); }}>
                                    Back to details
                                </Button>
                            </form>
                        )}
                        
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{' '}
                            <button onClick={() => navigate('/login')} className="font-semibold text-blue-600 hover:underline">
                                Sign In
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;