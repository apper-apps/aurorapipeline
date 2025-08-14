import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { DealsService } from "@/services/api/dealsService";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import MetricCard from "@/components/molecules/MetricCard";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import contactsData from "@/services/mockData/contacts.json";
import dealsData from "@/services/mockData/deals.json";
import leadsData from "@/services/mockData/leads.json";
import stagesData from "@/services/mockData/stages.json";
import accountsData from "@/services/mockData/accounts.json";
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

  const totalPipelineValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const avgDealSize = deals.length > 0 ? Math.round(totalPipelineValue / deals.length) : 0;
  const closedDeals = deals.filter(deal => deal.stage === "deal-closed").length;
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
            className="text-4xl font-display font-black bg-gradient-to-r from-cyan-500 via-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent animate-pulse"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "200% 200%"
            }}
          >
            🚀 Sales Pipeline 🚀
          </motion.h1>
          <motion.p 
            className="text-lg font-semibold bg-gradient-to-r from-cyan-600 to-purple-600 bg-clip-text text-transparent mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ⚡ Track and manage your deals through the AMAZING sales process! 🎯
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              icon="Download"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 border-0 shadow-lg hover:shadow-cyan-400/50 font-bold"
            >
              📊 Export
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              icon="BarChart3"
              className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:from-indigo-500 hover:to-purple-600 border-0 shadow-lg hover:shadow-indigo-400/50 font-bold"
            >
              📈 Forecast
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ["0 0 20px rgba(139, 92, 246, 0.3)", "0 0 40px rgba(139, 92, 246, 0.6)", "0 0 20px rgba(139, 92, 246, 0.3)"]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <Button 
              variant="primary" 
              icon="Plus"
              className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white border-0 shadow-lg hover:shadow-purple-400/50 font-bold"
            >
              ✨ New Deal
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Pipeline Metrics */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.08, rotate: [0, 2, -2, 0] }}
          animate={{ 
            boxShadow: ["0 0 25px rgba(34, 197, 94, 0.4)", "0 0 50px rgba(34, 197, 94, 0.7)", "0 0 25px rgba(34, 197, 94, 0.4)"]
          }}
          transition={{ 
            boxShadow: { duration: 2, repeat: Infinity }
          }}
        >
          <MetricCard
            title="💰 Pipeline Value"
            value={formatCurrency(totalPipelineValue)}
            change={12}
            icon="DollarSign"
            trend="up"
            color="success"
            className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white border-0 shadow-2xl hover:shadow-green-400/60 transform hover:rotate-1"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, y: -5 }}
          animate={{ 
            boxShadow: ["0 0 25px rgba(59, 130, 246, 0.4)", "0 0 50px rgba(59, 130, 246, 0.7)", "0 0 25px rgba(59, 130, 246, 0.4)"]
          }}
          transition={{ 
            boxShadow: { duration: 2.3, repeat: Infinity }
          }}
        >
          <MetricCard
            title="🎯 Total Deals"
            value={deals.length}
            change={8}
            icon="BarChart3"
            trend="up"
            color="primary"
            className="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 text-white border-0 shadow-2xl hover:shadow-blue-400/60 transform hover:-rotate-1"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
          animate={{ 
            boxShadow: ["0 0 25px rgba(251, 191, 36, 0.4)", "0 0 50px rgba(251, 191, 36, 0.7)", "0 0 25px rgba(251, 191, 36, 0.4)"]
          }}
          transition={{ 
            boxShadow: { duration: 2.7, repeat: Infinity }
          }}
        >
          <MetricCard
            title="📈 Avg Deal Size"
            value={formatCurrency(avgDealSize)}
            change={5}
            icon="TrendingUp"
            trend="up"
            color="warning"
            className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 text-white border-0 shadow-2xl hover:shadow-yellow-400/60 transform hover:rotate-1"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, x: 5 }}
          animate={{ 
            boxShadow: ["0 0 25px rgba(168, 85, 247, 0.4)", "0 0 50px rgba(168, 85, 247, 0.7)", "0 0 25px rgba(168, 85, 247, 0.4)"]
          }}
          transition={{ 
            boxShadow: { duration: 2.1, repeat: Infinity }
          }}
        >
          <MetricCard
            title="🚀 Conversion Rate"
            value={`${conversionRate}%`}
            change={3}
            icon="Target"
            trend="up"
            color="secondary"
            className="bg-gradient-to-br from-purple-400 via-pink-500 to-rose-600 text-white border-0 shadow-2xl hover:shadow-purple-400/60 transform hover:-rotate-1"
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