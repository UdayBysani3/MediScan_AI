"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedProgressProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export const AnimatedProgress = React.forwardRef<
  HTMLDivElement,
  AnimatedProgressProps
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <motion.div
      className={cn(
        "h-full w-full flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all",
        indicatorClassName
      )}
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ 
        duration: 0.5, 
        ease: "easeInOut",
        type: "spring",
        stiffness: 100
      }}
    >
      <motion.div
        className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{
          x: [-100, 100],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "linear",
        }}
      />
    </motion.div>
  </div>
));

AnimatedProgress.displayName = "AnimatedProgress";