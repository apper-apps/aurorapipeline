import React from "react";
import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading...", variant = "default" }) => {
  if (variant === "skeleton") {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-card p-6">
            <div className="animate-pulse">
              <div className="flex space-x-4">
                <div className="rounded-full bg-gradient-to-r from-gray-200 to-gray-300 h-12 w-12"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4"></div>
                  <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (variant === "pipeline") {
    return (
      <div className="grid grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface rounded-xl p-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="bg-white rounded-lg p-3 shadow-card">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 animate-pulse"></div>
        <ApperIcon 
          name="Loader2" 
          className="w-6 h-6 text-white absolute top-3 left-3 animate-spin" 
        />
      </div>
      <p className="mt-4 text-gray-600 font-medium">{message}</p>
    </div>
  );
};

export default Loading;