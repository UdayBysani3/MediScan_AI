import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

interface User {
    id: string;
    name: string;
    mobile: string;
    accountType: 'free' | 'monthly' | 'yearly';
    analysisCount: number;
    maxScans: number;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (mobile: string, password: string) => Promise<void>;
    register: (name: string, mobile: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
    refreshUser: () => Promise<void>;
    handleAuthSuccess: (userData: User, userToken: string) => void; // <-- 1. ADD THIS LINE
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedToken = localStorage.getItem('mediscan_token');
        const storedUser = localStorage.getItem('mediscan_user');
        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const handleAuthSuccess = (userData: User, userToken: string) => {
        const userWithDefaults = { ...userData, maxScans: userData.maxScans || 5 };
        
        localStorage.setItem('mediscan_user', JSON.stringify(userWithDefaults));
        localStorage.setItem('mediscan_token', userToken);
        setUser(userWithDefaults);
        setToken(userToken);
        navigate('/dashboard');
    };

    const register = async (name: string, mobile: string, password: string) => {
        // This function can be left as is, or you can choose to remove it if you
        // are only using the new OTP flow. For now, it's fine to keep.
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, mobile, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Registration failed');
        handleAuthSuccess(data.user, data.token);
    };

    const login = async (mobile: string, password: string) => {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mobile, password }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Login failed');
        handleAuthSuccess(data.user, data.token);
    };

    const logout = () => {
        localStorage.removeItem('mediscan_user');
        localStorage.removeItem('mediscan_token');
        setUser(null);
        setToken(null);
        navigate('/login');
    };
    
    const refreshUser = async () => {
        const storedToken = localStorage.getItem('mediscan_token');
        if (!storedToken) return;

        try {
            const response = await fetch(`${API_URL}/me`, {
                headers: { 'Authorization': `Bearer ${storedToken}` }
            });
            if (!response.ok) { logout(); return; }
            const freshUserData: User = await response.json();
            localStorage.setItem('mediscan_user', JSON.stringify(freshUserData));
            setUser(freshUserData);
        } catch (error) {
            console.error("Failed to refresh user data:", error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isLoading, refreshUser, handleAuthSuccess }}> {/* <-- 2. ADD IT HERE */}
            {!isLoading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};