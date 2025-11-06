import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Phone, Lock, ArrowRight, AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth(); // Using the REAL login function
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);
        try {
            // This now calls our corrected AuthContext function
            await login(mobile, password);
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
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>Sign in to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertTriangle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="mobile"><Phone className="inline h-4 w-4 mr-2" />Mobile Number</Label>
                                <Input id="mobile" type="tel" placeholder="Enter your mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password"><Lock className="inline h-4 w-4 mr-2" />Password</Label>
                                 <div className="relative">
                                    <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                                     <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>
                             <div className="text-right text-sm">
                                {/* This is where you would build the OTP password reset flow later */}
                                <button type="button" onClick={() => navigate('/forgot-password')} className="font-semibold text-blue-600 hover:underline">
                                    Forgot Password?
                                </button>
                            </div>
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...</> : <>Sign In <ArrowRight className="ml-2 h-4 w-4" /></>}
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Don't have an account?{' '}
                            <button onClick={() => navigate('/register')} className="font-semibold text-blue-600 hover:underline">
                                Create Account
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;