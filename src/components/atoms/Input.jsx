import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Input = forwardRef(({ 
  type = "text",
  label,
  error,
  leftIcon,
  rightIcon,
  className = "",
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 placeholder-gray-500 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-300";
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <ApperIcon name={leftIcon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            baseClasses,
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error && "border-red-300 focus:ring-red-500",
            className
          )}
          {...props}
        />
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <ApperIcon name={rightIcon} className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Input.displayName = "Input";

export default Input;