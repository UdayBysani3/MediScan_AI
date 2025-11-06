"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Settings, LogOut, CreditCard, Activity, Calendar, Mail, Phone, MapPin } from "lucide-react";
import { useAuth } from "@/components/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

export const SidebarProfile: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="fixed left-0 top-0 h-full z-50">
      {/* Hover Trigger Area */}
      <motion.div
        className="w-4 h-full bg-transparent cursor-pointer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      />
      
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="fixed left-0 top-0 h-full w-80 bg-white/95 backdrop-blur-lg border-r border-gray-200 shadow-2xl"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Profile Header */}
            <motion.div 
              className="p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-green-50"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center text-white text-xl font-bold"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </motion.div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{user.name}</h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                  <Badge 
                    variant="secondary" 
                    className="mt-1 bg-blue-100 text-blue-800"
                  >
                    {user.subscription} Plan
                  </Badge>
                </div>
              </div>
            </motion.div>

            {/* Profile Stats */}
            <motion.div 
              className="p-6 border-b border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="font-medium text-gray-900 mb-4">Account Overview</h4>
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  className="bg-blue-50 rounded-lg p-3 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Activity className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Scans Used</p>
                  <p className="font-semibold text-blue-900">{user.scansUsed}</p>
                </motion.div>
                <motion.div 
                  className="bg-green-50 rounded-lg p-3 text-center"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <CreditCard className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-xs text-gray-600">Remaining</p>
                  <p className="font-semibold text-green-900">{user.maxScans - user.scansUsed}</p>
                </motion.div>
              </div>
              
              {/* Usage Progress */}
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Usage Progress</span>
                  <span>{Math.round((user.scansUsed / user.maxScans) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(user.scansUsed / user.maxScans) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Profile Details */}
            <motion.div 
              className="p-6 border-b border-gray-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h4 className="font-medium text-gray-900 mb-4">Profile Information</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-sm">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">{user.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Member since {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-3 text-sm">
                  <Activity className="h-4 w-4 text-gray-500" />
                  <span className="text-gray-700">Last active: Today</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div 
              className="p-6 space-y-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h4 className="font-medium text-gray-900 mb-4">Quick Actions</h4>
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left"
                  onClick={() => navigate('/upload')}
                >
                  <Activity className="h-4 w-4 mr-3" />
                  New Medical Scan
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left"
                  onClick={() => navigate('/pricing')}
                >
                  <CreditCard className="h-4 w-4 mr-3" />
                  Upgrade Plan
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  variant="ghost" 
                  className="w-full justify-start text-left"
                >
                  <Settings className="h-4 w-4 mr-3" />
                  Account Settings
                </Button>
              </motion.div>

              <div className="pt-4 border-t border-gray-200">
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Sign Out
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};