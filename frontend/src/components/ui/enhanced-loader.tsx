"use client";
import React from "react";
import { motion } from "framer-motion";
import { Stethoscope, Activity } from "lucide-react";

interface EnhancedLoaderProps {
  icon?: React.ReactNode;
  message?: string;
  progress?: number;
}

export const EnhancedLoader: React.FC<EnhancedLoaderProps> = ({
  icon,
  message = "Processing...",
  progress = 0
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8">
      {/* Main elegant loader container */}
      <div className="relative w-full max-w-md">

        {/* Outer rotating circle */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-48 h-48" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="80"
              fill="none"
              stroke="url(#gradient1)"
              strokeWidth="2"
              strokeDasharray="8 8"
              opacity="0.3"
            />
            <defs>
              <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Middle spinning ring */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: -360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        >
          <svg className="w-40 h-40" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r="70"
              fill="none"
              stroke="url(#gradient2)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeDasharray="220 220"
              strokeDashoffset="110"
            />
            <defs>
              <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10B981" />
                <stop offset="50%" stopColor="#3B82F6" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Center icon container */}
        <div className="relative flex items-center justify-center h-48">
          {/* Pulsing background */}
          <motion.div
            className="absolute w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 rounded-full"
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />

          {/* Icon */}
          <motion.div
            className="relative z-10 text-5xl"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {icon || <Stethoscope className="h-16 w-16 text-blue-600" />}
          </motion.div>

          {/* Orbiting medical icons */}
          <motion.div
            className="absolute"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-32 h-32">
              <div className="absolute top-0 left-1/2 -translate-x-1/2">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </motion.div>

          <motion.div
            className="absolute"
            animate={{ rotate: -360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <div className="relative w-32 h-32">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
                <Activity className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Message with elegant typography */}
      <motion.div
        className="mt-8 text-center space-y-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <h3 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
            {message}
          </h3>
        </motion.div>

        <p className="text-sm text-slate-500 font-medium">
          Please wait while we analyze your medical data
        </p>
      </motion.div>

      {/* Elegant progress bar */}
      {progress > 0 && (
        <motion.div
          className="w-full max-w-md mt-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          {/* Progress percentage */}
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-slate-600">Processing</span>
            <motion.span
              className="text-sm font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent"
              key={progress}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
            >
              {progress.toFixed(0)}%
            </motion.span>
          </div>

          {/* Progress bar container */}
          <div className="relative h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            {/* Animated background shimmer */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: [-200, 400] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />

            {/* Progress fill */}
            <motion.div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 via-blue-600 to-green-500 rounded-full shadow-lg"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              {/* Shimmering overlay */}
              <motion.div
                className="h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                animate={{ x: [-100, 200] }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>

          {/* Progress stages */}
          <div className="flex justify-between mt-4 px-1">
            {['Uploading', 'Processing', 'Analyzing', 'Complete'].map((stage, index) => {
              const stageProgress = (index + 1) * 25;
              const isActive = progress >= stageProgress - 25;
              const isComplete = progress >= stageProgress;

              return (
                <motion.div
                  key={stage}
                  className="flex flex-col items-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <motion.div
                    className={`w-2 h-2 rounded-full mb-1 ${isComplete ? 'bg-green-500' : isActive ? 'bg-blue-500' : 'bg-slate-200'
                      }`}
                    animate={isActive && !isComplete ? { scale: [1, 1.3, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className={`text-xs ${isActive ? 'text-slate-700 font-medium' : 'text-slate-400'
                    }`}>
                    {stage}
                  </span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Subtle animated dots */}
      <div className="flex items-center gap-2 mt-6">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
};