"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const FloatingNav = ({
    navItems,
    className,
}: {
    navItems: {
        name: string;
        link: string;
        icon?: React.ReactElement;
    }[];
    className?: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 1, y: -100 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
                duration: 0.2,
            }}
            className={cn(
                "flex max-w-fit fixed top-6 inset-x-0 mx-auto border border-gray-200 rounded-full bg-white/80 backdrop-blur-lg shadow-lg z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
                className
            )}
        >
            {navItems.map((navItem: any, idx: number) => (
                <a
                    key={`link=${idx}`}
                    href={navItem.link}
                    className={cn(
                        "relative items-center flex space-x-1 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    )}
                >
                    <span className="block sm:hidden">{navItem.icon}</span>
                    <span className="hidden sm:block text-sm font-medium">{navItem.name}</span>
                </a>
            ))}
        </motion.div>
    );
};
