import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/components/AuthContext';

const OTPPage: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { mobileNumber, isRegister } = location.state || {};

  const handleVerify = async () => {
    if (!otp) {
      setError('Please enter the OTP.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      // First verify OTP
      console.log('Verifying OTP:', { mobileNumber, otp });

      const otpResponse = await fetch('http://localhost:8000/verify-otp', {
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
          throw new Error('Registration data not found');
        }

        // Complete registration
        const registerResponse = await fetch('http://localhost:5000/register', {
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
        navigate('/dashboard');
      } else {
        // For login flow
        const loginResponse = await fetch('http://localhost:5000/login', {
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
        navigate('/dashboard');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Enter OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">An OTP has been sent to {mobileNumber}.</p>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="mb-4"
          />
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button onClick={handleVerify} disabled={loading} className="w-full">
            {loading ? 'Verifying...' : 'Verify'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default OTPPage;
