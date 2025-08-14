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
      <div>
        <h2 className="text-2xl font-display font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-600 mt-1">Track your sales performance and pipeline health</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Deals"
          value={analytics.totalDeals}
          change={analytics.dealsChange}
          icon="BarChart3"
          trend="up"
          color="primary"
        />
        <MetricCard
          title="Pipeline Value"
          value={analytics.pipelineValue}
          change={analytics.pipelineChange}
          icon="DollarSign"
          trend="up"
          color="success"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${analytics.conversionRate}%`}
          change={analytics.conversionChange}
          icon="Target"
          trend="up"
          color="warning"
        />
        <MetricCard
          title="Avg Deal Size"
          value={analytics.avgDealSize}
          change={analytics.avgDealChange}
          icon="TrendingUp"
          trend="down"
          color="error"
        />
      </div>

      {/* Stage Performance */}
      <Card className="p-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">Pipeline Stage Performance</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {analytics.stagePerformance.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="bg-gradient-to-r from-primary-100 to-secondary-100 rounded-xl p-4 mb-3">
                <div className="text-2xl font-bold text-primary-600 mb-1">
                  {stage.count}
                </div>
                <div className="text-sm text-gray-600">deals</div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{stage.name}</h4>
              <p className="text-sm text-gray-600">{stage.value}</p>
              <div className="mt-2 text-xs text-gray-500">
                Avg: {stage.avgDays} days
              </div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Conversion Funnel */}
      <Card className="p-6">
        <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">Conversion Funnel</h3>
        <div className="space-y-4">
          {analytics.conversionFunnel.map((stage, index) => (
            <motion.div
              key={stage.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                <span className="text-sm text-gray-600">{stage.deals} deals ({stage.percentage}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary-500 to-secondary-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${stage.percentage}%` }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
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