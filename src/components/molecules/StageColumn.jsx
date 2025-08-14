import React from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import DealCard from "@/components/molecules/DealCard";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatters";

const StageColumn = ({ 
  stage, 
  deals, 
  onDrop, 
  onDragOver,
  onUpdateValue,
  onUpdatePriority,
  onLogActivity,
  onArchive,
  isDropZoneActive = false 
}) => {
  const handleDragOver = (e) => {
    e.preventDefault();
    if (onDragOver) onDragOver(stage.id);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain");
    if (onDrop) onDrop(dealId, stage.id);
  };

  const getTotalValue = () => {
return deals.reduce((sum, deal) => sum + deal.value_c, 0);
  };

  const getStageIcon = (stageName) => {
    switch (stageName.toLowerCase()) {
      case "cold lead": return "Snowflake";
      case "hot lead": return "Flame";
      case "estimate sent": return "FileText";
      case "deal closed": return "CheckCircle";
      default: return "Circle";
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`h-full ${isDropZoneActive ? 'drop-zone-active' : ''} transition-all duration-200`}
    >
      <Card className={`h-full flex flex-col p-4 ${stage.color} border-l-4`}>
        {/* Stage Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ApperIcon 
name={getStageIcon(stage.Name)} 
              className="w-5 h-5 text-primary-600" 
            />
            <h3 className="font-display font-semibold text-gray-900">
              {stage.Name}
            </h3>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {deals.length} deals
            </div>
            <div className="text-xs text-gray-600">
              {formatCurrency(getTotalValue())}
            </div>
          </div>
        </div>

        {/* Deals List */}
        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
          {deals.length > 0 ? (
            <motion.div layout className="space-y-3">
              {deals.map((deal) => (
                <DealCard
                  key={deal.Id}
                  deal={deal}
                  onUpdateValue={onUpdateValue}
                  onUpdatePriority={onUpdatePriority}
                  onLogActivity={onLogActivity}
                  onArchive={onArchive}
                />
              ))}
            </motion.div>
          ) : (
            <div className="flex-1 flex items-center justify-center py-8">
              <div className="text-center text-gray-400">
                <ApperIcon name="Inbox" className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No deals in this stage</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default StageColumn;