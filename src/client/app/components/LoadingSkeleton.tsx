"use client";
import React from "react";

const CustomSkeleton = ({ className = "", width, height, ...props }: any) => (
  <div
    className={`bg-gray-200 rounded animate-pulse relative overflow-hidden ${className}`}
    style={{ width, height }}
    {...props}
  >
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-shimmer" />
  </div>
);

const LoadingSkeleton = () => (
  <div className="w-full p-12">
    {/* Header section */}
    <div className="flex items-center space-x-3 mb-8">
      <CustomSkeleton className="h-6 w-1" />
      <CustomSkeleton className="h-6 w-32" />
    </div>
    
    {/* Grid of cards */}
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }, (_, index) => (
        <div key={index} className="space-y-3">
          <CustomSkeleton className="h-48 w-full rounded-lg" />
          <div className="space-y-2">
            <CustomSkeleton className="h-4 w-3/4" />
            <CustomSkeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
    
    <style jsx>{`
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
      
      .animate-shimmer {
        animation: shimmer 1.5s infinite;
      }
    `}</style>
  </div>
);

export default LoadingSkeleton;