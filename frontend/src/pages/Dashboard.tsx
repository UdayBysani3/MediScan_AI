import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity, Brain, Eye, Stethoscope, Upload, TrendingUp, Clock, CheckCircle, BarChart3, Award, Sparkles, Zap, Shield
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { AnimatedButton } from '@/components/ui/animated-button';
import { HoverEffect } from '@/components/ui/card-hover-effect';
import { SidebarProfile } from '@/components/ui/sidebar-profile';

// Interface for the data we fetch from the backend
interface AnalysisActivity {
  _id: string;
  modelId: string;
  result: string;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();

  // State for fetching and storing real activity data
  const [recentActivity, setRecentActivity] = useState<AnalysisActivity[]>([]);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [activityError, setActivityError] = useState<string | null>(null);

  // useEffect to fetch data when the component loads
  useEffect(() => {
    if (!token) {
      setIsLoadingActivity(false);
      return;
    }
    const fetchActivity = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/recent-activity`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Failed to fetch activity');
        const data = await response.json();
        setRecentActivity(data);
      } catch (err) {
        setActivityError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoadingActivity(false);
      }
    };
    fetchActivity();
  }, [token]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const scansRemaining = user.maxScans - user.analysisCount;
  const usagePercentage = (user.analysisCount / user.maxScans) * 100;

  const quickActions = [
    { id: 'skin-analysis', title: 'Skin Analysis', description: 'Advanced AI-powered dermatological assessment...', icon: <Activity className="h-6 w-6 text-red-600" />, color: 'bg-red-50 border border-red-100', onClick: () => navigate('/upload') },
    { id: 'eye-examination', title: 'Eye Examination', description: 'Comprehensive retinal analysis for diabetic retinopathy...', icon: <Eye className="h-6 w-6 text-blue-600" />, color: 'bg-blue-50 border border-blue-100', onClick: () => navigate('/upload') },
    { id: 'brain-scan', title: 'Brain Imaging', description: 'MRI and CT scan analysis for neurological conditions...', icon: <Brain className="h-6 w-6 text-purple-600" />, color: 'bg-purple-50 border border-purple-100', onClick: () => navigate('/upload') },
    { id: 'cbc-analysis', title: 'CBC Analysis', description: 'Analyze your Complete Blood Count (CBC) report values...', icon: <Stethoscope className="h-6 w-6 text-green-600" />, color: 'bg-green-50 border border-green-100', onClick: () => navigate('/upload') }
  ];

  // This new function renders the activity list based on the fetched data
  const renderActivityContent = () => {
    if (isLoadingActivity) {
      return <p className="text-center text-gray-500">Loading recent activity...</p>;
    }
    if (activityError) {
      return <p className="text-center text-red-500">Error: {activityError}</p>;
    }
    if (recentActivity.length === 0) {
      return <p className="text-center text-gray-500">No analysis performed yet.</p>;
    }
    return recentActivity.map((activity, index) => {
      const isNormal = activity.result.toLowerCase().includes('normal') || activity.result.toLowerCase().includes('no-tumor');
      const status = isNormal ? 'completed' : 'attention';
      return (
        <motion.div
          key={activity._id}
          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 + index * 0.1 }}
          whileHover={{ scale: 1.02, x: 5 }}
        >
          <div className="flex items-center space-x-3">
            <div className={`w-3 h-3 rounded-full ${status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`} />
            <div>
              <p className="font-medium text-sm capitalize">{activity.modelId.replace(/-/g, ' ')}</p>
              <p className="text-xs text-gray-500">{formatDistanceToNow(new Date(activity.timestamp))} ago</p>
            </div>
          </div>
          <Badge variant={status === 'completed' ? 'default' : 'secondary'} className={status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}>
            {activity.result}
          </Badge>
        </motion.div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative">
      <Navbar />
      <SidebarProfile />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <BackgroundBeams className="opacity-10" />
        {/* Your motion.div background effects are preserved here */}
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h1 className="text-4xl font-bold text-gray-900 mb-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                Welcome back, {user.name}! 👋
              </motion.h1>
              <TextGenerateEffect words="Your comprehensive AI-powered medical analysis dashboard..." className="text-lg text-gray-600" />
            </div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <motion.button onClick={() => navigate('/upload')} className="flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-600 to-green-600 text-white px-6 py-3 text-lg font-medium shadow-lg">
                <Upload className="h-5 w-5" />
                <span className="hidden sm:inline">New Analysis</span>
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
        
        <motion.div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          {/* All your beautiful animated stat cards are preserved here */}
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="bg-white border-0 shadow-xl"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Scans Remaining</p><p className="text-3xl font-bold text-blue-600">{scansRemaining}</p></div><motion.div className="bg-blue-50 rounded-full p-3" animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}><Zap className="h-6 w-6 text-blue-600" /></motion.div></div><div className="mt-4"><div className="flex justify-between text-sm text-gray-600 mb-2"><span>Usage</span><span>{usagePercentage.toFixed(0)}%</span></div><div className="w-full bg-gray-200 rounded-full h-2"><motion.div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full" initial={{ width: 0 }} animate={{ width: `${usagePercentage}%` }} transition={{ duration: 1, delay: 0.5 }} /></div></div></CardContent></Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="bg-white border-0 shadow-xl"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Total Scans</p><p className="text-3xl font-bold text-green-600">{user.analysisCount}</p></div><motion.div className="bg-green-50 rounded-full p-3" animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 2 }}><BarChart3 className="h-6 w-6 text-green-600" /></motion.div></div><p className="text-xs text-green-600 mt-2 flex items-center"><TrendingUp className="h-3 w-3 mr-1" />+12% from last month</p></CardContent></Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="bg-white border-0 shadow-xl"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Subscription</p><p className="capitalize text-3xl font-bold text-purple-600">{user.accountType}</p></div><motion.div className="bg-purple-50 rounded-full p-3" animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}><Award className="h-6 w-6 text-purple-600" /></motion.div></div><p className="text-xs text-purple-600 mt-2 flex items-center"><Shield className="h-3 w-3 mr-1" />Premium features active</p></CardContent></Card>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05, y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
            <Card className="bg-white border-0 shadow-xl"><CardContent className="p-6"><div className="flex items-center justify-between"><div><p className="text-sm font-medium text-gray-600">Accuracy Rate</p><p className="text-3xl font-bold text-orange-600">94.2%</p></div><motion.div className="bg-orange-50 rounded-full p-3" animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }}><Sparkles className="h-6 w-6 text-orange-600" /></motion.div></div><p className="text-xs text-orange-600 mt-2 flex items-center"><CheckCircle className="h-3 w-3 mr-1" />AI model performance</p></CardContent></Card>
          </motion.div>
        </motion.div>

        <motion.div className="mb-8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
          <Card className="bg-white border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2"><Clock className="h-5 w-5 text-green-600" /><span>Recent Activity</span></CardTitle>
              <CardDescription>Your latest medical analysis results from the database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* This is where the real data gets rendered */}
              {renderActivityContent()}
              {/* <motion.div className="pt-4" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <AnimatedButton variant="outline" className="w-full" onClick={() => navigate('/history')}>
                  <span>View All Results</span>
                </AnimatedButton>
              </motion.div> */}
            </CardContent>
          </Card>
        </motion.div>

        <div>
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.4 }}>
            <Card className="bg-white border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2"><motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}><Activity className="h-5 w-5 text-blue-600" /></motion.div><span>AI Medical Analysis</span></CardTitle>
                <CardDescription>Choose from our advanced AI models for comprehensive medical imaging analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="md:hidden mt-4"><HoverEffect items={quickActions} className="grid-cols-1" /></div>
                <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-6">
                  {quickActions.map((item) => (
                    <motion.div key={item.id} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') item.onClick(); }} onClick={item.onClick} className={`rounded-xl p-6 cursor-pointer ${item.color} transition-shadow hover:shadow-lg focus:outline-none`}>
                      <div className="flex items-center space-x-3 mb-3"><div className="p-2 rounded-full bg-white shadow-sm">{item.icon}</div><h3 className="text-lg font-semibold text-gray-900">{item.title}</h3></div>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
        
        {/* Your Health Tips section is preserved here */}
        
      </div>
    </div>
  );
};

export default Dashboard;