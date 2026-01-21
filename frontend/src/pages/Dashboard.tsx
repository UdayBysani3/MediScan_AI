import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow, format, isSameDay, parseISO } from 'date-fns';
import {
  Stethoscope, Upload, TrendingUp, Clock, CheckCircle, BarChart3, Award, Sparkles, Zap, Shield, Calendar as CalendarIcon
} from 'lucide-react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { CardContainer, CardBody, CardItem } from '@/components/ui/3d-card';
import { SidebarProfile } from '@/components/ui/sidebar-profile';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import '../styles/flatpickr-custom.css';
import { cn } from '@/lib/utils';

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
  const [date, setDate] = useState<Date | undefined>(new Date());

  // useEffect to fetch data when the component loads
  useEffect(() => {
    if (!token) {
      setIsLoadingActivity(false);
      return;
    }
    const fetchActivity = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_BASE_URL;
        if (!apiUrl) throw new Error('API URL missing');

        const response = await fetch(`${apiUrl}/recent-activity`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch activity: ${response.status}`);
        }

        const data = await response.json();
        setRecentActivity(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setActivityError(err instanceof Error ? err.message : 'Unknown error');
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

  // Filter activities based on selected date
  const filteredActivity = recentActivity.filter(activity =>
    date ? isSameDay(new Date(activity.timestamp), date) : true
  );

  const renderActivityContent = () => {
    if (isLoadingActivity) {
      return <p className="text-center text-slate-500">Loading recent activity...</p>;
    }
    if (activityError) {
      return <p className="text-center text-red-500">Error: {activityError}</p>;
    }
    if (filteredActivity.length === 0) {
      return (
        <div className="text-center py-8">
          <Stethoscope className="h-12 w-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 font-medium">No activity found for this date</p>
          <p className="text-slate-400 text-sm mt-1">Try selecting a different date or upload a new scan</p>
        </div>
      );
    }
    return filteredActivity.map((activity, index) => {
      const isNormal = activity.result.toLowerCase().includes('normal') || activity.result.toLowerCase().includes('no-tumor');
      const status = isNormal ? 'completed' : 'attention';
      return (
        <motion.div
          key={activity._id}
          className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.1 }}
        >
          <div className="flex items-center space-x-4">
            <div className={`w-2.5 h-2.5 rounded-full ${status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}`} />
            <div>
              <p className="font-bold text-slate-800 capitalize text-sm">{activity.modelId.replace(/-/g, ' ')}</p>
              <p className="text-xs text-slate-500 flex items-center mt-0.5">
                <Clock className="w-3 h-3 mr-1" />
                {formatDistanceToNow(new Date(activity.timestamp))} ago
              </p>
            </div>
          </div>
          <Badge variant="outline" className={`${status === 'completed' ? 'text-green-700 border-green-300 bg-green-50 font-medium' : 'text-orange-700 border-orange-300 bg-orange-50 font-medium'} text-xs`}>
            {activity.result}
          </Badge>
        </motion.div>
      );
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 relative pt-20 overflow-x-hidden">
      <Navbar />
      <SidebarProfile />

      {/* Subtle Medical Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-full mx-auto px-3 sm:px-4 lg:px-6 py-8 pl-10 pr-10">
        {/* Welcome Section */}
        <div className="max-w-7xl mx-auto px-8">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <motion.h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  Welcome, <span className="bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent"> {user.name}</span>
                </motion.h1>
                <p className="text-lg text-slate-600 font-normal">Your AI-powered medical imaging analysis dashboard</p>
              </div>

              <motion.button
                onClick={() => navigate('/upload')}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-600 hover:from-blue-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Upload className="h-5 w-5" />
                <span>New Analysis</span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid with 3D Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
          {/* Scans Remaining */}
          <CardContainer className="inter-var w-full h-full">
            <CardBody className="bg-white relative group/card hover:shadow-2xl hover:shadow-blue-500/[0.1] border-slate-200 w-full h-full rounded-2xl p-6 border transition-all">
              <CardItem translateZ="50" className="flex items-center justify-between w-full mb-3">
                <p className="text-slate-600 font-semibold text-sm">Scans Remaining</p>
                <div className="bg-blue-50 p-2.5 rounded-lg">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
              </CardItem>
              <CardItem translateZ="60" className="text-4xl font-extrabold text-slate-900 mb-3">
                {scansRemaining}
              </CardItem>
              <CardItem translateZ="40" className="w-full">
                <div className="flex justify-between text-xs text-slate-500 mb-2 font-medium">
                  <span>Usage</span>
                  <span>{usagePercentage.toFixed(0)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full transition-all duration-1000 shadow-sm" style={{ width: `${usagePercentage}%` }}></div>
                </div>
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Total Scans */}
          <CardContainer className="inter-var w-full h-full">
            <CardBody className="bg-white relative group/card hover:shadow-2xl hover:shadow-teal-500/[0.1] border-slate-200 w-full h-full rounded-2xl p-6 border transition-all">
              <CardItem translateZ="50" className="flex items-center justify-between w-full mb-3">
                <p className="text-slate-600 font-semibold text-sm">Total Analyses</p>
                <div className="bg-teal-50 p-2.5 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-teal-600" />
                </div>
              </CardItem>
              <CardItem translateZ="60" className="text-4xl font-extrabold text-slate-900 mb-3">
                {user.analysisCount}
              </CardItem>
              <CardItem translateZ="40" className="text-xs text-teal-600 font-semibold flex items-center">
                <TrendingUp className="h-3.5 w-3.5 mr-1" /> +12% from last month
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Subscription */}
          <CardContainer className="inter-var w-full h-full">
            <CardBody className="bg-white relative group/card hover:shadow-2xl hover:shadow-indigo-500/[0.1] border-slate-200 w-full h-full rounded-2xl p-6 border transition-all">
              <CardItem translateZ="50" className="flex items-center justify-between w-full mb-3">
                <p className="text-slate-600 font-semibold text-sm">Subscription</p>
                <div className="bg-indigo-50 p-2.5 rounded-lg">
                  <Award className="h-6 w-6 text-indigo-600" />
                </div>
              </CardItem>
              <CardItem translateZ="60" className="text-2xl font-extrabold text-slate-900 mb-3 capitalize">
                {user.accountType} Plan
              </CardItem>
              <CardItem translateZ="40" className="text-xs text-indigo-600 font-semibold flex items-center">
                <Shield className="h-3.5 w-3.5 mr-1" /> Premium features active
              </CardItem>
            </CardBody>
          </CardContainer>

          {/* Accuracy */}
          <CardContainer className="inter-var w-full h-full">
            <CardBody className="bg-white relative group/card hover:shadow-2xl hover:shadow-emerald-500/[0.1] border-slate-200 w-full h-full rounded-2xl p-6 border transition-all">
              <CardItem translateZ="50" className="flex items-center justify-between w-full mb-3">
                <p className="text-slate-600 font-semibold text-sm">AI Accuracy</p>
                <div className="bg-emerald-50 p-2.5 rounded-lg">
                  <Sparkles className="h-6 w-6 text-emerald-600" />
                </div>
              </CardItem>
              <CardItem translateZ="60" className="text-4xl font-extrabold text-slate-900 mb-3">
                94.2%
              </CardItem>
              <CardItem translateZ="40" className="text-xs text-emerald-600 font-semibold flex items-center">
                <CheckCircle className="h-3.5 w-3.5 mr-1" /> Clinically validated
              </CardItem>
            </CardBody>
          </CardContainer>
        </div>

        {/* Recent Activity */}
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <Clock className="h-6 w-6 mr-3 text-teal-600" />
              Activity History <span className="text-slate-400 ml-2 text-sm font-normal">({filteredActivity.length})</span>
            </h2>


            {/* Professional Flatpickr Date Picker */}
            <div className="flex items-center gap-3">
              <span className="text-slate-600 font-semibold text-sm">Analysis On:- </span>
              <div className="relative">

                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-500 z-10 pointer-events-none" />
                <Flatpickr
                  value={date}
                  onChange={(selectedDates) => {
                    setDate(selectedDates[0] || new Date());
                  }}
                  options={{
                    dateFormat: "F j, Y",
                    defaultDate: new Date(),
                    maxDate: new Date(),
                    allowInput: true,
                    disableMobile: true,
                  }}
                  className="pl-10 pr-4 py-2.5 w-[240px] border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:border-blue-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all shadow-sm cursor-pointer"
                  placeholder="Select a date"
                />
              </div>

              {date && !isSameDay(date, new Date()) && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setDate(new Date())}
                  className="px-4 py-2.5 bg-gradient-to-r from-slate-100 to-slate-200 hover:from-slate-200 hover:to-slate-300 text-slate-700 font-medium text-sm rounded-xl transition-all shadow-sm"
                >
                  Today
                </motion.button>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-[420px] flex flex-col">
            <div className={cn(
              "overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-slate-100 hover:scrollbar-thumb-slate-400",
              filteredActivity.length === 0 && !isLoadingActivity && "flex items-center justify-center flex-1"
            )}>
              {renderActivityContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;