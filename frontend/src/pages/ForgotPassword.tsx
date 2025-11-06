import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, Key, ArrowRight, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

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
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/verify-password-reset-otp`, {
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
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="w-full max-w-md mx-auto p-4">
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                        <CardDescription>
                            {step === 'enterMobile' 
                                ? 'Enter your mobile number to receive an OTP.' 
                                : `Enter the OTP sent to ${mobile} and your new password.`}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <Alert variant="destructive" className="mb-4">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {step === 'enterMobile' ? (
                            <form onSubmit={handleSendOtp} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mobile"><Phone className="inline h-4 w-4 mr-2" />Mobile Number</Label>
                                    <Input id="mobile" type="tel" placeholder="Enter your registered mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...</> : <>Send OTP <ArrowRight className="ml-2 h-4 w-4" /></>}
                                </Button>
                            </form>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="otp"><Key className="inline h-4 w-4 mr-2" />One-Time Password (OTP)</Label>
                                    <Input id="otp" type="text" placeholder="Enter the 6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword"><Lock className="inline h-4 w-4 mr-2" />New Password</Label>
                                    <Input id="newPassword" type="password" placeholder="Min. 6 characters" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword"><Lock className="inline h-4 w-4 mr-2" />Confirm New Password</Label>
                                    <Input id="confirmPassword" type="password" placeholder="Confirm your new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Resetting...</> : <>Reset Password <CheckCircle className="ml-2 h-4 w-4" /></>}
                                </Button>
                            </form>
                        )}
                         <div className="mt-4 text-center text-sm">
                            Remember your password?{' '}
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

export default ForgotPasswordPage;