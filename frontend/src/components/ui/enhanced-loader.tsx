"use client";
import React from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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
    <div className="text-center space-y-6">
      <motion.div 
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <Loader2 className="h-16 w-16 text-blue-600 mx-auto" />
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="text-2xl">{icon}</div>
        </motion.div>
      </motion.div>
      
      <motion.h3 
        className="text-2xl font-semibold text-gray-900"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        {message}
      </motion.h3>
      
      {progress > 0 && (
        <div className="max-w-md mx-auto">
          <motion.div
            className="w-full bg-gray-200 rounded-full h-3 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              <motion.div
                className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: [-100, 100] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </motion.div>
          </motion.div>
          <motion.p 
            className="text-sm text-gray-500 mt-3"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            {progress.toFixed(0)}% complete
          </motion.p>
        </div>
      )}
    </div>
  );
};