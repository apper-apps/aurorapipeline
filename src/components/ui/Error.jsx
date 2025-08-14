import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Error = ({ 
  message = "Something went wrong",
  description = "Please try again or contact support if the problem persists.",
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-red-100 to-pink-100 flex items-center justify-center mb-4">
        <ApperIcon name="AlertCircle" className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {message}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      {showRetry && onRetry && (
        <Button 
          onClick={onRetry}
          variant="primary"
          icon="RefreshCw"
        >
          Try Again
        </Button>
      )}
    </div>
  );
};

export default Error;