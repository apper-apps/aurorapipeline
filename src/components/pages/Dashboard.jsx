import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { DashboardService } from "@/services/api/dashboardService";
import ApperIcon from "@/components/ApperIcon";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Pipeline from "@/components/pages/Pipeline";
import contactsData from "@/services/mockData/contacts.json";
import dealsData from "@/services/mockData/deals.json";
import leadsData from "@/services/mockData/leads.json";
import stagesData from "@/services/mockData/stages.json";
import accountsData from "@/services/mockData/accounts.json";
import { formatCurrency, formatDate } from "@/utils/formatters";

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await DashboardService.getDashboard();
      setDashboard(data);
    } catch (err) {
      setError("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = (action) => {
    toast.info(`Opening ${action}...`);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboard} />;
  if (!dashboard) return null;

  return (
<div className="space-y-8">
      {/* Header */}
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
            Sales Dashboard
          </motion.h1>
          <motion.p 
            className="text-lg font-medium text-slate-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Welcome back! Here's your sales overview and recent activities.
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              icon="RefreshCw" 
              onClick={loadDashboard}
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 border-0 shadow-lg hover:shadow-cyan-400/50 transition-all duration-300"
            >
              ⚡ Refresh
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ["0 0 20px rgba(236, 72, 153, 0.3)", "0 0 30px rgba(236, 72, 153, 0.6)", "0 0 20px rgba(236, 72, 153, 0.3)"]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <Button 
              variant="primary" 
              icon="Plus"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg hover:shadow-pink-400/50 font-bold"
            >
              🎯 New Lead
            </Button>
</motion.div>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <MetricCard
            title="Total Revenue"
            value={dashboard.metrics.totalRevenue}
            change={dashboard.metrics.revenueChange}
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
            title="Active Deals"
            value={dashboard.metrics.activeDeals}
            change={dashboard.metrics.dealsChange}
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
            title="Conversion Rate"
            value={`${dashboard.metrics.conversionRate}%`}
            change={dashboard.metrics.conversionChange}
            icon="Target"
            trend="up"
            color="warning"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <MetricCard
            title="New Leads"
            value={dashboard.metrics.newLeads}
            change={dashboard.metrics.leadsChange}
            icon="UserPlus"
            trend="up"
            color="primary"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
{/* Sales Pipeline Overview */}
        <div className="lg:col-span-2">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-display font-bold text-slate-800">
                  Sales Pipeline
                </h3>
                <Link to="/pipeline">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      icon="ArrowRight"
                      className="bg-slate-600 text-white hover:bg-slate-700 border-0 shadow-md"
                    >
                      View Full Pipeline
                    </Button>
                  </motion.div>
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {dashboard.pipeline.map((stage, index) => (
                  <motion.div
                    key={stage.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="text-center"
                  >
                    <div className={`${
                      index === 0 ? 'bg-slate-100' :
                      index === 1 ? 'bg-blue-50' :
                      index === 2 ? 'bg-green-50' :
                      'bg-orange-50'
                    } rounded-xl p-5 mb-3 shadow-md hover:shadow-lg transition-shadow`}>
                      <div className="text-3xl font-bold text-slate-700 mb-2">
                        {stage.count}
                      </div>
                      <div className="text-sm text-slate-600 font-medium mb-2">{stage.name}</div>
                      <div className="text-xl font-semibold text-slate-800">
                        {stage.value}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

{/* Quick Actions */}
        <div>
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="p-6 bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-display font-bold text-slate-800 mb-6">
                Quick Actions
              </h3>
              <div className="space-y-3">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    icon="UserPlus"
                    className="w-full justify-start bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm text-left"
                    onClick={() => handleQuickAction("Add New Lead")}
                  >
                    Add New Lead
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    icon="Users"
                    className="w-full justify-start bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm text-left"
                    onClick={() => handleQuickAction("Add Contact")}
                  >
                    Add Contact
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    icon="Building2"
                    className="w-full justify-start bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm text-left"
                    onClick={() => handleQuickAction("Add Account")}
                  >
                    Add Account
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    icon="BarChart3"
                    className="w-full justify-start bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm text-left"
                    onClick={() => handleQuickAction("Create Opportunity")}
                  >
                    Create Opportunity
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    icon="Calendar"
                    className="w-full justify-start bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm text-left"
                    onClick={() => handleQuickAction("Schedule Meeting")}
                  >
                    Schedule Meeting
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    variant="ghost"
                    icon="Mail"
                    className="w-full justify-start bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm text-left"
                    onClick={() => handleQuickAction("Send Email Campaign")}
                  >
                    Send Email Campaign
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Activities & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
{/* Recent Activities */}
<motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-display font-bold text-slate-800">
                Recent Activities
              </h3>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Button 
                  variant="ghost" 
                  size="sm" 
                  icon="MoreHorizontal"
                  className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0"
                />
              </motion.div>
            </div>
            <div className="space-y-4">
              {dashboard.recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-start gap-3 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors duration-200"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    index % 4 === 0 ? 'bg-blue-100 text-blue-600' :
                    index % 4 === 1 ? 'bg-green-100 text-green-600' :
                    index % 4 === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-purple-100 text-purple-600'
                  }`}>
                    <ApperIcon name={activity.icon} className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900 leading-relaxed">{activity.description}</p>
                    <p className="text-xs font-medium text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                  </div>
                  <Badge 
                    variant={activity.type === 'deal' ? 'success' : 'primary'} 
                    size="sm"
                  >
                    {activity.type}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

{/* Top Performers */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-display font-bold text-slate-800">
                Top Performers
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                icon="Trophy"
                className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-0"
              />
            </div>
            <div className="space-y-4">
              {dashboard.topPerformers.map((performer, index) => (
                <motion.div
                  key={performer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center justify-between p-4 rounded-lg shadow-sm transition-all duration-200 ${
                    index === 0 ? 'bg-amber-50 border border-amber-200' :
                    index === 1 ? 'bg-gray-50 border border-gray-200' :
                    'bg-orange-50 border border-orange-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm ${
                      index === 0 ? 'bg-amber-500' :
                      index === 1 ? 'bg-gray-500' :
                      'bg-orange-500'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">{performer.name}</p>
                      <p className="text-sm font-medium text-gray-600">{performer.deals} deals closed</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-xl text-gray-900">{performer.revenue}</p>
                    <p className="text-sm font-medium text-green-600">
                      +{performer.growth}%
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;