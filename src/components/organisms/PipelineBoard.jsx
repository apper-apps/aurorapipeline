import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import StageColumn from "@/components/molecules/StageColumn";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { DealsService } from "@/services/api/dealsService";
import { StagesService } from "@/services/api/stagesService";

const PipelineBoard = () => {
  const [deals, setDeals] = useState([]);
  const [stages, setStages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [activeDropZone, setActiveDropZone] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [dealsData, stagesData] = await Promise.all([
        DealsService.getAll(),
        StagesService.getAll()
      ]);
      setDeals(dealsData);
      setStages(stagesData);
    } catch (err) {
      setError("Failed to load pipeline data");
      toast.error("Failed to load pipeline data");
    } finally {
      setLoading(false);
    }
  };

  const handleDealMove = async (dealId, newStage) => {
    try {
      const deal = deals.find(d => d.Id === parseInt(dealId));
      if (!deal || deal.stage === newStage) return;

      const updatedDeal = { ...deal, stage: newStage, updatedAt: new Date().toISOString() };
      await DealsService.update(deal.Id, updatedDeal);
      
      setDeals(prevDeals => 
        prevDeals.map(d => 
          d.Id === deal.Id ? updatedDeal : d
        )
      );

      toast.success(`Deal moved to ${stages.find(s => s.id === newStage)?.name || newStage}`);
    } catch (err) {
      toast.error("Failed to move deal");
    }
    setActiveDropZone(null);
  };

  const handleDragOver = (stageId) => {
    setActiveDropZone(stageId);
  };

  const getDealsForStage = (stageId) => {
    return deals.filter(deal => deal.stage === stageId);
  };

  if (loading) return <Loading variant="pipeline" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (stages.length === 0) return <Empty title="No pipeline stages" description="Configure your sales stages to get started." />;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {stages.map((stage) => {
          const stageDeals = getDealsForStage(stage.id);
          return (
            <StageColumn
              key={stage.id}
              stage={stage}
              deals={stageDeals}
              onDrop={handleDealMove}
              onDragOver={handleDragOver}
              isDropZoneActive={activeDropZone === stage.id}
            />
          );
        })}
      </div>
    </motion.div>
  );
};

export default PipelineBoard;