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
            className="text-4xl font-display font-black bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 via-green-500 to-yellow-500 bg-clip-text text-transparent animate-pulse"
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
            ⚡ Sales Dashboard ⚡
          </motion.h1>
          <motion.p 
            className="text-lg font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🚀 Welcome back! Here's your EPIC sales overview and recent activities! 🎯
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
          whileHover={{ scale: 1.05, rotate: [0, 1, -1, 0] }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(34, 197, 94, 0.3)", "0 0 40px rgba(34, 197, 94, 0.6)", "0 0 20px rgba(34, 197, 94, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 2, repeat: Infinity }
          }}
        >
          <MetricCard
            title="💰 Total Revenue"
            value={dashboard.metrics.totalRevenue}
            change={dashboard.metrics.revenueChange}
            icon="DollarSign"
            trend="up"
            color="success"
            className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 text-white border-0 shadow-2xl hover:shadow-green-400/50"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(59, 130, 246, 0.3)", "0 0 40px rgba(59, 130, 246, 0.6)", "0 0 20px rgba(59, 130, 246, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 2.5, repeat: Infinity }
          }}
        >
          <MetricCard
            title="📊 Active Deals"
            value={dashboard.metrics.activeDeals}
            change={dashboard.metrics.dealsChange}
            icon="BarChart3"
            trend="up"
            color="primary"
            className="bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 text-white border-0 shadow-2xl hover:shadow-blue-400/50"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, y: -5 }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(251, 191, 36, 0.3)", "0 0 40px rgba(251, 191, 36, 0.6)", "0 0 20px rgba(251, 191, 36, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 3, repeat: Infinity }
          }}
        >
          <MetricCard
            title="🎯 Conversion Rate"
            value={`${dashboard.metrics.conversionRate}%`}
            change={dashboard.metrics.conversionChange}
            icon="Target"
            trend="up"
            color="warning"
            className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 text-white border-0 shadow-2xl hover:shadow-yellow-400/50"
          />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.05, rotate: [0, 2, -2, 0] }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(168, 85, 247, 0.3)", "0 0 40px rgba(168, 85, 247, 0.6)", "0 0 20px rgba(168, 85, 247, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 2.2, repeat: Infinity }
          }}
        >
          <MetricCard
            title="🌟 New Leads"
            value={dashboard.metrics.newLeads}
            change={dashboard.metrics.leadsChange}
            icon="UserPlus"
            trend="up"
            color="secondary"
            className="bg-gradient-to-br from-purple-400 via-pink-500 to-rose-500 text-white border-0 shadow-2xl hover:shadow-purple-400/50"
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Pipeline Overview */}
<div className="lg:col-span-2">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Card className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 border-2 border-transparent bg-clip-padding shadow-2xl hover:shadow-indigo-400/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg blur-sm opacity-20 animate-pulse"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <motion.h3 
                    className="text-2xl font-display font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                    animate={{ 
                      textShadow: ["0 0 10px rgba(99, 102, 241, 0.5)", "0 0 20px rgba(99, 102, 241, 0.8)", "0 0 10px rgba(99, 102, 241, 0.5)"]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🔥 Sales Pipeline 🔥
                  </motion.h3>
                  <Link to="/pipeline">
                    <motion.div
                      whileHover={{ scale: 1.1, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        icon="ArrowRight"
                        className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 border-0 shadow-lg hover:shadow-indigo-400/50 font-bold"
                      >
                        🚀 View Full Pipeline
                      </Button>
                    </motion.div>
                  </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {dashboard.pipeline.map((stage, index) => (
                    <motion.div
                      key={stage.name}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                      whileHover={{ 
                        scale: 1.08, 
                        rotate: [0, 2, -2, 0],
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.2)"
                      }}
                      className="text-center"
                    >
                      <motion.div 
                        className={`bg-gradient-to-br ${
                          index === 0 ? 'from-cyan-400 to-blue-500' :
                          index === 1 ? 'from-green-400 to-emerald-500' :
                          index === 2 ? 'from-yellow-400 to-orange-500' :
                          'from-purple-400 to-pink-500'
                        } rounded-xl p-5 mb-3 shadow-xl`}
                        animate={{
                          boxShadow: [
                            "0 0 20px rgba(59, 130, 246, 0.3)", 
                            "0 0 40px rgba(59, 130, 246, 0.6)", 
                            "0 0 20px rgba(59, 130, 246, 0.3)"
                          ]
                        }}
                        transition={{ 
                          boxShadow: { duration: 2 + index * 0.5, repeat: Infinity }
                        }}
                      >
                        <motion.div 
                          className="text-3xl font-black text-white mb-2"
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                        >
                          {stage.count}
                        </motion.div>
                        <div className="text-sm text-white/90 font-semibold mb-2">{stage.name}</div>
                        <div className="text-xl font-bold text-white">
                          {stage.value}
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
<div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative"
          >
            <Card className="p-6 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 border-2 border-transparent shadow-2xl hover:shadow-pink-400/30 transition-all duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 rounded-lg blur-sm opacity-20 animate-pulse"></div>
              <div className="relative z-10">
                <motion.h3 
                  className="text-2xl font-display font-black bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-6"
                  animate={{ 
                    textShadow: ["0 0 10px rgba(236, 72, 153, 0.5)", "0 0 20px rgba(236, 72, 153, 0.8)", "0 0 10px rgba(236, 72, 153, 0.5)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ⚡ Quick Actions ⚡
                </motion.h3>
                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      icon="UserPlus"
                      className="w-full justify-start bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 border-0 shadow-lg hover:shadow-cyan-400/50 font-bold text-left"
                      onClick={() => handleQuickAction("Add New Lead")}
                    >
                      🎯 Add New Lead
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      icon="Users"
                      className="w-full justify-start bg-gradient-to-r from-green-400 to-emerald-500 text-white hover:from-green-500 hover:to-emerald-600 border-0 shadow-lg hover:shadow-green-400/50 font-bold text-left"
                      onClick={() => handleQuickAction("Add Contact")}
                    >
                      👥 Add Contact
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      icon="Building2"
                      className="w-full justify-start bg-gradient-to-r from-orange-400 to-red-500 text-white hover:from-orange-500 hover:to-red-600 border-0 shadow-lg hover:shadow-orange-400/50 font-bold text-left"
                      onClick={() => handleQuickAction("Add Account")}
                    >
                      🏢 Add Account
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      icon="BarChart3"
                      className="w-full justify-start bg-gradient-to-r from-purple-400 to-pink-500 text-white hover:from-purple-500 hover:to-pink-600 border-0 shadow-lg hover:shadow-purple-400/50 font-bold text-left"
                      onClick={() => handleQuickAction("Create Opportunity")}
                    >
                      📈 Create Opportunity
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      icon="Calendar"
                      className="w-full justify-start bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:from-indigo-500 hover:to-purple-600 border-0 shadow-lg hover:shadow-indigo-400/50 font-bold text-left"
                      onClick={() => handleQuickAction("Schedule Meeting")}
                    >
                      📅 Schedule Meeting
                    </Button>
                  </motion.div>
                  <motion.div
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="ghost"
                      icon="Mail"
                      className="w-full justify-start bg-gradient-to-r from-pink-400 to-rose-500 text-white hover:from-pink-500 hover:to-rose-600 border-0 shadow-lg hover:shadow-pink-400/50 font-bold text-left"
                      onClick={() => handleQuickAction("Send Email Campaign")}
                    >
                      📧 Send Email Campaign
                    </Button>
                  </motion.div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Recent Activities & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
{/* Recent Activities */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <Card className="p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border-2 border-transparent shadow-2xl hover:shadow-blue-400/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-lg blur-sm opacity-20 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <motion.h3 
                  className="text-2xl font-display font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  animate={{ 
                    textShadow: ["0 0 10px rgba(59, 130, 246, 0.5)", "0 0 20px rgba(59, 130, 246, 0.8)", "0 0 10px rgba(59, 130, 246, 0.5)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🎉 Recent Activities 🎉
                </motion.h3>
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon="MoreHorizontal"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 border-0 shadow-lg hover:shadow-blue-400/50"
                  />
                </motion.div>
              </div>
              <div className="space-y-4">
                {dashboard.recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      scale: 1.03, 
                      x: 10,
                      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                    }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-white/80 to-white/60 backdrop-blur-sm hover:from-white/90 hover:to-white/70 transition-all duration-300 border border-white/30"
                  >
                    <motion.div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${
                        index % 4 === 0 ? 'bg-gradient-to-r from-cyan-400 to-blue-500' :
                        index % 4 === 1 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                        index % 4 === 2 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                        'bg-gradient-to-r from-purple-400 to-pink-500'
                      }`}
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 3,
                        delay: index * 0.5,
                        repeat: Infinity
                      }}
                    >
                      <ApperIcon name={activity.icon} className="w-5 h-5 text-white" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 leading-relaxed">{activity.description}</p>
                      <p className="text-xs font-semibold bg-gradient-to-r from-gray-600 to-gray-500 bg-clip-text text-transparent mt-1">{formatDate(activity.timestamp)}</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                    >
                      <Badge 
                        variant={activity.type === 'deal' ? 'success' : 'primary'} 
                        size="sm"
                        className={`${
                          activity.type === 'deal' 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white border-0 shadow-md' 
                            : 'bg-gradient-to-r from-blue-400 to-indigo-500 text-white border-0 shadow-md'
                        } font-bold`}
                      >
                        {activity.type}
                      </Badge>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

{/* Top Performers */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative"
        >
          <Card className="p-6 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 border-2 border-transparent shadow-2xl hover:shadow-yellow-400/30 transition-all duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500 rounded-lg blur-sm opacity-20 animate-pulse"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <motion.h3 
                  className="text-2xl font-display font-black bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent"
                  animate={{ 
                    textShadow: ["0 0 10px rgba(251, 191, 36, 0.5)", "0 0 20px rgba(251, 191, 36, 0.8)", "0 0 10px rgba(251, 191, 36, 0.5)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🏆 Top Performers 🏆
                </motion.h3>
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.2, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    icon="Trophy"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white hover:from-yellow-500 hover:to-orange-600 border-0 shadow-lg hover:shadow-yellow-400/50"
                  />
                </motion.div>
              </div>
              <div className="space-y-4">
                {dashboard.topPerformers.map((performer, index) => (
                  <motion.div
                    key={performer.id}
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: index * 0.15, type: "spring", stiffness: 100 }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: "0 15px 30px rgba(0, 0, 0, 0.2)"
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl shadow-lg transition-all duration-300 ${
                      index === 0 ? 'bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300' :
                      index === 1 ? 'bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400' :
                      'bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-300'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg ${
                          index === 0 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
                          index === 1 ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                          'bg-gradient-to-r from-amber-500 to-yellow-600'
                        }`}
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity, delay: index * 0.3 }
                        }}
                      >
                        {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                      </motion.div>
                      <div>
                        <p className="font-black text-gray-900 text-lg">{performer.name}</p>
                        <p className="text-sm font-semibold text-gray-700">🎯 {performer.deals} deals closed</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl text-gray-900">{performer.revenue}</p>
                      <motion.p 
                        className="text-sm font-bold text-green-700"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        🚀 +{performer.growth}%
                      </motion.p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;