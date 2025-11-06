"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beams = new Array(6).fill(true);
  const pathLengths = [
    "M-380 -189C-380 -189 -312 216 152 343C616 470 684 875 684 875",
    "m-373 -197c0 0 69 404 533 531 464 127 533 537 533 537",
    "m-373 -197c0 0 69 404 533 531 464 127 533 537 533 537",
    "m-373 -197c0 0 69 404 533 531 464 127 533 537 533 537",
    "m-373 -197c0 0 69 404 533 531 464 127 533 537 533 537",
    "m-373 -197c0 0 69 404 533 531 464 127 533 537 533 537",
  ];
  const [pathIndex, setPathIndex] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPathIndex((prevIndex) => (prevIndex + 1) % pathLengths.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [pathLengths.length]);

  return (
    <div
      className={`absolute inset-0 h-full w-full bg-neutral-950 ${className}`}
    >
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        viewBox="0 0 696 316"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="absolute inset-0 h-full w-full"
      >
        <g clipPath="url(#clip0_1065_8)">
          {beams.map((_, i) => (
            <motion.path
              key={`beam-${i}`}
              d={pathLengths[i % pathLengths.length]}
              stroke={`url(#gradient-${i})`}
              strokeOpacity="0.4"
              strokeWidth="0.5"
            />
          ))}
        </g>
        <defs>
          {beams.map((_, i) => (
            <linearGradient
              key={`gradient-${i}`}
              id={`gradient-${i}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop stopColor="#18CCFC" stopOpacity="0"></stop>
              <stop stopColor="#18CCFC"></stop>
              <stop offset="32.5%" stopColor="#6344F5"></stop>
              <stop offset="100%" stopColor="#AE48FF" stopOpacity="0"></stop>
            </linearGradient>
          ))}
          <clipPath id="clip0_1065_8">
            <rect width="696" height="316" fill="white"></rect>
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};