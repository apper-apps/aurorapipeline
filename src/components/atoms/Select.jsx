import React, { forwardRef } from "react";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";

const Select = forwardRef(({ 
  label,
  error,
  options = [],
  placeholder = "Select option...",
  className = "",
  children,
  ...props 
}, ref) => {
  const baseClasses = "w-full px-4 py-3 border border-gray-200 rounded-xl bg-white text-gray-900 transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent hover:border-gray-300 appearance-none";
  
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            baseClasses,
            error && "border-red-300 focus:ring-red-500",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <ApperIcon name="ChevronDown" className="h-5 w-5 text-gray-400" />
        </div>
      </div>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;