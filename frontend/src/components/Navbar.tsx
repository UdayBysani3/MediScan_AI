"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from '@/components/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Home,
  CreditCard,
  LayoutDashboard,
  Upload,
  LogOut,
  Settings,
  Sparkles
} from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/', icon: <Home className="h-4 w-4" /> },
    { name: 'Pricing', path: '/pricing', icon: <CreditCard className="h-4 w-4" /> },
    ...(user ? [
      { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="h-4 w-4" /> },
      { name: 'Upload', path: '/upload', icon: <Upload className="h-4 w-4" /> },
    ] : [])
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white backdrop-blur-sm border-b border-slate-200 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center cursor-pointer group"
            onClick={() => navigate('/')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <img
              src="/assets/MediScanLogo.png"
              alt="MediScan AI Logo"
              className="h-12 w-auto group-hover:drop-shadow-lg transition-all duration-300"
            />
          </motion.div>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item, idx) => (
              <motion.button
                key={idx}
                onClick={() => navigate(item.path)}
                className={cn(
                  "relative px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300",
                  location.pathname === item.path
                    ? "text-white"
                    : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                )}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {location.pathname === item.path && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  {item.icon}
                  {item.name}
                </span>
              </motion.button>
            ))}
          </div>

          {/* User Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    className="relative"
                  >
                    <Button variant="ghost" className="relative h-14 w-14 rounded-full p-0 group">
                      {/* Animated gradient border */}
                      <motion.div
                        className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-green-500 to-blue-600 rounded-full opacity-75 blur"
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          ease: "linear"
                        }}
                        style={{ backgroundSize: '200% 200%' }}
                      ></motion.div>

                      {/* Glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-blue-400 to-green-400 rounded-full opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"
                      ></motion.div>

                      {/* Avatar */}
                      <Avatar className="h-14 w-14 border-3 border-white shadow-xl relative z-10 ring-2 ring-blue-500/20 group-hover:ring-blue-500/40 transition-all duration-300">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 via-blue-500 to-green-600 text-white font-bold text-xl shadow-inner">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Pulse indicator */}
                      <motion.div
                        className="absolute -top-0.5 -right-0.5 h-4 w-4 bg-gradient-to-br from-green-400 to-green-600 rounded-full border-2 border-white shadow-lg z-20"
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [1, 0.8, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      ></motion.div>
                    </Button>
                  </motion.div>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="w-72 mt-3 p-0 border-0 bg-white/95 backdrop-blur-xl shadow-2xl rounded-2xl overflow-hidden"
                  align="end"
                  forceMount
                >
                  {/* Header with gradient background */}
                  <motion.div
                    className="relative p-4 bg-gradient-to-br from-blue-600 via-blue-500 to-green-600 overflow-hidden"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* Animated background pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                    </div>

                    <div className="flex items-center gap-4 relative z-10">
                      <motion.div whileHover={{ scale: 1.1, rotate: 5 }} transition={{ type: "spring", stiffness: 300 }}>
                        <Avatar className="h-16 w-16 border-3 border-white/30 shadow-xl ring-4 ring-white/20">
                          <AvatarFallback className="bg-white/20 backdrop-blur-sm text-white font-bold text-2xl">
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <div className="flex flex-col flex-1">
                        <motion.p
                          className="font-bold text-white text-lg drop-shadow-sm"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          {user.name}
                        </motion.p>
                        <motion.p
                          className="text-sm text-white/90 font-medium"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.15 }}
                        >
                          {user.mobile}
                        </motion.p>
                        <motion.div
                          className="mt-1.5 px-2.5 py-0.5 bg-white/20 backdrop-blur-sm rounded-full w-fit"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          <span className="text-xs text-white font-semibold flex items-center gap-1">
                            <Sparkles className="h-3 w-3" />
                            Active User
                          </span>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <DropdownMenuItem
                      onClick={() => navigate('/dashboard')}
                      className="cursor-pointer rounded-xl my-1 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center w-full">
                        <div className="mr-3 p-2 rounded-lg bg-blue-100 group-hover:bg-blue-500 transition-colors duration-300">
                          <LayoutDashboard className="h-4 w-4 text-blue-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-blue-600 transition-colors duration-300">Dashboard</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate('/upload')}
                      className="cursor-pointer rounded-xl my-1 py-3 hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center w-full">
                        <div className="mr-3 p-2 rounded-lg bg-green-100 group-hover:bg-green-500 transition-colors duration-300">
                          <Upload className="h-4 w-4 text-green-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-green-600 transition-colors duration-300">Upload Scan</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => navigate('/pricing')}
                      className="cursor-pointer rounded-xl my-1 py-3 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center w-full">
                        <div className="mr-3 p-2 rounded-lg bg-purple-100 group-hover:bg-gradient-to-r group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                          <CreditCard className="h-4 w-4 text-purple-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">Upgrade Plan</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-2" />

                    <DropdownMenuItem
                      onClick={() => navigate('/forgot-password')}
                      className="cursor-pointer rounded-xl my-1 py-3 hover:bg-gradient-to-r hover:from-gray-50 hover:to-blue-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center w-full">
                        <div className="mr-3 p-2 rounded-lg bg-gray-100 group-hover:bg-gray-500 transition-colors duration-300">
                          <Settings className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <span className="font-semibold text-gray-700 group-hover:text-gray-800 transition-colors duration-300">Change Password</span>
                      </div>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="cursor-pointer rounded-xl my-1 py-3 hover:bg-gradient-to-r hover:from-red-50 hover:to-orange-50 transition-all duration-300 group"
                    >
                      <div className="flex items-center w-full">
                        <div className="mr-3 p-2 rounded-lg bg-red-100 group-hover:bg-red-500 transition-colors duration-300">
                          <LogOut className="h-4 w-4 text-red-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <span className="font-semibold text-red-600 group-hover:text-red-700 transition-colors duration-300">Log out</span>
                      </div>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                  className="hidden md:flex text-gray-700 hover:text-blue-600 font-semibold hover:bg-gray-50"
                >
                  Sign In
                </Button>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => navigate('/register')}
                    className="relative bg-gradient-to-r from-blue-600 to-green-600 hover:shadow-xl text-white font-semibold px-6 py-6 rounded-xl overflow-hidden group"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-green-600 to-blue-600"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10 flex items-center gap-2">
                      <Sparkles className="h-4 w-4" />
                      Get Started
                    </span>
                  </Button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;