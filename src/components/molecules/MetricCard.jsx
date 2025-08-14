import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency, formatPercentage } from "@/utils/formatters";

const MetricCard = ({ 
  title, 
  value, 
  change, 
  changeType = "percentage",
  icon, 
  trend = "up",
  color = "primary" 
}) => {
  const getTrendIcon = () => {
    return trend === "up" ? "TrendingUp" : "TrendingDown";
  };

  const getTrendColor = () => {
    return trend === "up" ? "text-green-600" : "text-red-600";
  };

  const getIconBg = () => {
    const colorMap = {
      primary: "bg-gradient-to-r from-primary-100 to-secondary-100",
      success: "bg-gradient-to-r from-green-100 to-emerald-100",
      warning: "bg-gradient-to-r from-yellow-100 to-orange-100",
      error: "bg-gradient-to-r from-red-100 to-pink-100",
    };
    return colorMap[color] || colorMap.primary;
  };

  const getIconColor = () => {
    const colorMap = {
      primary: "text-primary-600",
      success: "text-green-600",
      warning: "text-yellow-600",
      error: "text-red-600",
    };
    return colorMap[color] || colorMap.primary;
  };

  const formatValue = (val) => {
    if (typeof val === "number" && val > 1000) {
      return formatCurrency(val);
    }
    return val;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card className="p-6 bg-gradient-to-br from-white to-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatValue(value)}
            </p>
            {change !== undefined && (
              <div className={`flex items-center gap-1 mt-2 ${getTrendColor()}`}>
                <ApperIcon name={getTrendIcon()} className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {changeType === "percentage" ? formatPercentage(change) : change}
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-xl ${getIconBg()}`}>
            <ApperIcon name={icon} className={`w-6 h-6 ${getIconColor()}`} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default MetricCard;