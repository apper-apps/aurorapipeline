import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { DealsService } from "@/services/api/dealsService";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import MetricCard from "@/components/molecules/MetricCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
// Mock data imports removed - now using database services
import { formatCurrency } from "@/utils/formatters";

const Pipeline = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await DealsService.getAll();
      setDeals(data);
    } catch (err) {
      toast.error("Failed to load deals");
    } finally {
      setLoading(false);
    }
  };

const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value_c, 0);
  const avgDealSize = deals.length > 0 ? Math.round(totalPipelineValue / deals.length) : 0;
  const closedDeals = deals.filter(deal => deal.stage_c === "deal-closed").length;
  const conversionRate = deals.length > 0 ? Math.round((closedDeals / deals.length) * 100) : 0;

  return (
<div className="space-y-6">
<motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div>
          <motion.h1 
            className="text-4xl font-display font-bold text-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Sales Pipeline
          </motion.h1>
          <motion.p 
            className="text-lg font-medium text-slate-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Track and manage your deals through the sales process.
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              icon="Download"
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm"
            >
              Export
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              icon="BarChart3"
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm"
            >
              Forecast
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="primary" 
              icon="Plus"
              className="bg-slate-700 hover:bg-slate-800 text-white border-0 shadow-md"
            >
              New Deal
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Pipeline Metrics */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <MetricCard
            title="Pipeline Value"
            value={formatCurrency(totalPipelineValue)}
            change={12}
            icon="DollarSign"
            trend="up"
            color="success"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <MetricCard
            title="Total Deals"
            value={deals.length}
            change={8}
            icon="BarChart3"
            trend="up"
            color="primary"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <MetricCard
            title="Avg Deal Size"
            value={formatCurrency(avgDealSize)}
            change={5}
            icon="TrendingUp"
            trend="up"
            color="warning"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <MetricCard
            title="Conversion Rate"
            value={`${conversionRate}%`}
            change={3}
            icon="Target"
            trend="up"
            color="primary"
          />
        </motion.div>
      </div>
      
      <div className="h-[calc(100vh-20rem)]">
        <PipelineBoard />
      </div>
    </div>
  );
};

export default Pipeline;