import React, { useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency, formatDistanceToNow } from "@/utils/formatters";

const DealCard = ({ 
  deal, 
  onDrag,
  onUpdateValue,
  onUpdatePriority,
  onLogActivity,
  onArchive,
  isDragging = false 
}) => {
  const [showActions, setShowActions] = useState(false);

  const handleDragStart = (e) => {
    e.dataTransfer.setData("text/plain", deal.Id);
    if (onDrag) onDrag(deal);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "high";
      case "medium": return "medium";
      case "low": return "low";
      default: return "default";
    }
  };

  const getDaysInStage = () => {
    const daysDiff = Math.floor((new Date() - new Date(deal.updatedAt)) / (1000 * 60 * 60 * 24));
    return daysDiff;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ scale: 1.02 }}
      className={`relative ${isDragging ? 'deal-card-dragging' : ''}`}
    >
      <Card
        draggable
        onDragStart={handleDragStart}
        hover
        className="p-4 cursor-move"
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1 line-clamp-2">
              {deal.title}
            </h4>
            <p className="text-sm text-gray-600">
              {deal.contactName} • {deal.company}
            </p>
          </div>
          <Badge variant={getPriorityColor(deal.priority)} size="sm">
            {deal.priority}
          </Badge>
        </div>

        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Value</span>
            <span className="font-semibold text-primary-600">
              {formatCurrency(deal.value)}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>{getDaysInStage()} days in stage</span>
            <span>{formatDistanceToNow(deal.lastActivity)} ago</span>
          </div>
        </div>

        {deal.lastActivityType && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
            <ApperIcon name="Clock" className="w-3 h-3" />
            Last: {deal.lastActivityType}
          </div>
        )}

        {showActions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 pt-2 border-t border-gray-100"
          >
            <Button
              size="sm"
              variant="ghost"
              icon="DollarSign"
              onClick={() => onUpdateValue && onUpdateValue(deal)}
              className="flex-1 text-xs"
            >
              Update
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon="MessageSquare"
              onClick={() => onLogActivity && onLogActivity(deal)}
              className="flex-1 text-xs"
            >
              Activity
            </Button>
            <Button
              size="sm"
              variant="ghost"
              icon="Archive"
              onClick={() => onArchive && onArchive(deal)}
              className="text-xs text-gray-400 hover:text-red-600"
            >
              <ApperIcon name="Archive" className="w-3 h-3" />
            </Button>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};

export default DealCard;