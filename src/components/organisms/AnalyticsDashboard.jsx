import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import Card from "@/components/atoms/Card";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { AnalyticsService } from "@/services/api/analyticsService";

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await AnalyticsService.getDashboard();
      setAnalytics(data);
    } catch (err) {
      setError("Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading analytics..." />;
  if (error) return <Error message={error} onRetry={loadAnalytics} />;
  if (!analytics) return <Error message="No analytics data available" />;

  return (
<div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2 
          className="text-3xl font-display font-black bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 bg-clip-text text-transparent"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "linear"
          }}
          style={{
            backgroundSize: "200% 200%"
          }}
        >
          📊 Analytics 📊
        </motion.h2>
        <motion.p 
          className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          🚀 Track your sales performance and pipeline health with STYLE! 🎯
        </motion.p>
      </motion.div>

      {/* Metrics Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, 3, -3, 0] }}
          animate={{ 
            boxShadow: ["0 0 30px rgba(59, 130, 246, 0.4)", "0 0 60px rgba(59, 130, 246, 0.8)", "0 0 30px rgba(59, 130, 246, 0.4)"]
          }}
          transition={{ 
            boxShadow: { duration: 2, repeat: Infinity }
          }}
        >
          <MetricCard
            title="🎯 Total Deals"
            value={analytics.totalDeals}
            change={analytics.dealsChange}
            icon="BarChart3"
            trend="up"
            color="primary"
            className="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 text-white border-0 shadow-2xl hover:shadow-blue-400/70"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1, y: -8 }}
          animate={{ 
            boxShadow: ["0 0 30px rgba(34, 197, 94, 0.4)", "0 0 60px rgba(34, 197, 94, 0.8)", "0 0 30px rgba(34, 197, 94, 0.4)"]
          }}
          transition={{ 
            boxShadow: { duration: 2.5, repeat: Infinity }
          }}
        >
          <MetricCard
            title="💰 Pipeline Value"
            value={analytics.pipelineValue}
            change={analytics.pipelineChange}
            icon="DollarSign"
            trend="up"
            color="success"
            className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 text-white border-0 shadow-2xl hover:shadow-green-400/70"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: [0, -3, 3, 0] }}
          animate={{ 
            boxShadow: ["0 0 30px rgba(251, 191, 36, 0.4)", "0 0 60px rgba(251, 191, 36, 0.8)", "0 0 30px rgba(251, 191, 36, 0.4)"]
          }}
          transition={{ 
            boxShadow: { duration: 3, repeat: Infinity }
          }}
        >
          <MetricCard
            title="🚀 Conversion Rate"
            value={`${analytics.conversionRate}%`}
            change={analytics.conversionChange}
            icon="Target"
            trend="up"
            color="warning"
            className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-600 text-white border-0 shadow-2xl hover:shadow-yellow-400/70"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1, x: 8 }}
          animate={{ 
            boxShadow: ["0 0 30px rgba(239, 68, 68, 0.4)", "0 0 60px rgba(239, 68, 68, 0.8)", "0 0 30px rgba(239, 68, 68, 0.4)"]
          }}
          transition={{ 
            boxShadow: { duration: 2.2, repeat: Infinity }
          }}
        >
          <MetricCard
            title="📊 Avg Deal Size"
            value={analytics.avgDealSize}
            change={analytics.avgDealChange}
            icon="TrendingUp"
            trend="down"
            color="error"
            className="bg-gradient-to-br from-red-400 via-pink-500 to-rose-600 text-white border-0 shadow-2xl hover:shadow-red-400/70"
          />
        </motion.div>
      </div>

      {/* Stage Performance */}
<motion.div
        whileHover={{ scale: 1.02 }}
        className="relative"
      >
        <Card className="p-6 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 border-2 border-transparent shadow-2xl hover:shadow-purple-400/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-lg blur-sm opacity-20 animate-pulse"></div>
          <div className="relative z-10">
            <motion.h3 
              className="text-2xl font-display font-black bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent mb-6"
              animate={{ 
                textShadow: ["0 0 15px rgba(168, 85, 247, 0.5)", "0 0 25px rgba(168, 85, 247, 0.8)", "0 0 15px rgba(168, 85, 247, 0.5)"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔥 Pipeline Stage Performance 🔥
            </motion.h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {analytics.stagePerformance.map((stage, index) => (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, y: 30, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                  whileHover={{ 
                    scale: 1.12, 
                    rotate: [0, 5, -5, 0],
                    boxShadow: "0 15px 35px rgba(0, 0, 0, 0.2)"
                  }}
                  className="text-center"
                >
                  <motion.div 
                    className={`bg-gradient-to-br ${
                      index === 0 ? 'from-cyan-400 to-blue-500' :
                      index === 1 ? 'from-green-400 to-emerald-500' :
                      index === 2 ? 'from-yellow-400 to-orange-500' :
                      'from-purple-400 to-pink-500'
                    } rounded-xl p-6 mb-4 shadow-xl`}
                    animate={{
                      boxShadow: [
                        "0 0 25px rgba(168, 85, 247, 0.3)", 
                        "0 0 50px rgba(168, 85, 247, 0.6)", 
                        "0 0 25px rgba(168, 85, 247, 0.3)"
                      ]
                    }}
                    transition={{ 
                      boxShadow: { duration: 2 + index * 0.5, repeat: Infinity }
                    }}
                  >
                    <motion.div 
                      className="text-4xl font-black text-white mb-2"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        rotate: [0, 10, -10, 0]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity, 
                        delay: index * 0.3 
                      }}
                    >
                      {stage.count}
                    </motion.div>
                    <div className="text-sm text-white/90 font-bold">🎯 deals</div>
                  </motion.div>
                  <motion.h4 
                    className="font-black text-gray-900 mb-2 text-lg"
                    whileHover={{ scale: 1.1 }}
                  >
                    {stage.name}
                  </motion.h4>
                  <p className="text-base font-bold text-purple-600">{stage.value}</p>
                  <motion.div 
                    className="mt-2 text-sm font-semibold text-pink-600"
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                  >
                    ⏱️ Avg: {stage.avgDays} days
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </Card>
      </motion.div>
      {/* Conversion Funnel */}
      <Card className="p-6">
<motion.h3 
          className="text-2xl font-display font-black bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent mb-6"
          animate={{ 
            textShadow: ["0 0 15px rgba(59, 130, 246, 0.5)", "0 0 25px rgba(59, 130, 246, 0.8)", "0 0 15px rgba(59, 130, 246, 0.5)"]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🌈 Conversion Funnel 🌈
        </motion.h3>
        <div className="space-y-6">
          {analytics.conversionFunnel.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -30, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: index * 0.15, type: "spring", stiffness: 80 }}
              whileHover={{ 
                scale: 1.03, 
                x: 10,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
              }}
              className="relative p-4 rounded-xl bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm border border-white/30"
            >
              <div className="flex items-center justify-between mb-3">
                <motion.span 
                  className="text-lg font-black text-gray-900"
                  whileHover={{ scale: 1.05 }}
                >
                  🎯 {stage.name}
                </motion.span>
                <motion.span 
                  className="text-sm font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                >
                  {stage.deals} deals ({stage.percentage}%)
                </motion.span>
              </div>
              <div className="w-full bg-gradient-to-r from-gray-200 to-gray-300 rounded-full h-4 overflow-hidden shadow-inner">
                <motion.div
                  className={`h-full bg-gradient-to-r ${
                    index === 0 ? 'from-cyan-400 via-blue-500 to-indigo-500' :
                    index === 1 ? 'from-green-400 via-emerald-500 to-teal-500' :
                    index === 2 ? 'from-yellow-400 via-orange-500 to-red-500' :
                    'from-purple-400 via-pink-500 to-rose-500'
                  } shadow-lg`}
                  initial={{ width: 0 }}
                  animate={{ 
                    width: `${stage.percentage}%`,
                    boxShadow: [
                      "0 0 10px rgba(59, 130, 246, 0.5)", 
                      "0 0 20px rgba(59, 130, 246, 0.8)", 
                      "0 0 10px rgba(59, 130, 246, 0.5)"
                    ]
                  }}
                  transition={{ 
                    width: { duration: 1.2, delay: index * 0.3, ease: "easeOut" },
                    boxShadow: { duration: 2, repeat: Infinity, delay: index * 0.5 }
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsDashboard;