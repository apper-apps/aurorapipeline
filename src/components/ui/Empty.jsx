import React from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  icon = "Inbox",
  title = "No data found",
  description = "Get started by adding your first item.",
  actionText = "Add New",
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-100 to-secondary-100 flex items-center justify-center mb-4">
        <ApperIcon name={icon} className="w-8 h-8 text-primary-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        {description}
      </p>
      {onAction && (
        <Button 
          onClick={onAction}
          variant="primary"
          icon="Plus"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default Empty;