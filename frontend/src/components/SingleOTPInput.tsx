import React, { useState } from 'react';
import { Input } from '@/components/ui/input';

interface SingleOTPInputProps {
    onComplete: (otp: string) => void;
    disabled?: boolean;
    maxLength?: number;
}

const SingleOTPInput: React.FC<SingleOTPInputProps> = ({ 
    onComplete, 
    disabled = false, 
    maxLength = 6 
}) => {
    const [otp, setOtp] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '');
        setOtp(value);

        if (value.length === maxLength) {
            onComplete(value);
        }
    };

    return (
        <Input
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={maxLength}
            placeholder={`Enter ${maxLength}-digit OTP`}
            value={otp}
            onChange={handleChange}
            disabled={disabled}
            className="text-center text-2xl tracking-widest h-12"
            style={{ letterSpacing: '0.5em' }}
        />
    );
};

export default SingleOTPInput;