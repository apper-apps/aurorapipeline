import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { DashboardService } from "@/services/api/dashboardService";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your sales overview and recent activities</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" icon="RefreshCw" onClick={loadDashboard}>
            Refresh
          </Button>
          <Button variant="primary" icon="Plus">
            New Lead
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Revenue"
          value={dashboard.metrics.totalRevenue}
          change={dashboard.metrics.revenueChange}
          icon="DollarSign"
          trend="up"
          color="success"
        />
        <MetricCard
          title="Active Deals"
          value={dashboard.metrics.activeDeals}
          change={dashboard.metrics.dealsChange}
          icon="BarChart3"
          trend="up"
          color="primary"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${dashboard.metrics.conversionRate}%`}
          change={dashboard.metrics.conversionChange}
          icon="Target"
          trend="up"
          color="warning"
        />
        <MetricCard
          title="New Leads"
          value={dashboard.metrics.newLeads}
          change={dashboard.metrics.leadsChange}
          icon="UserPlus"
          trend="up"
          color="secondary"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Pipeline Overview */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-display font-semibold text-gray-900">Sales Pipeline</h3>
              <Link to="/pipeline">
                <Button variant="ghost" size="sm" icon="ArrowRight">
                  View Full Pipeline
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {dashboard.pipeline.map((stage, index) => (
                <motion.div
                  key={stage.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 mb-3">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {stage.count}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">{stage.name}</div>
                    <div className="text-lg font-semibold text-primary-600">
                      {stage.value}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-display font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-3">
              <Button
                variant="ghost"
                icon="UserPlus"
                className="w-full justify-start"
                onClick={() => handleQuickAction("Add New Lead")}
              >
                Add New Lead
              </Button>
              <Button
                variant="ghost"
                icon="Users"
                className="w-full justify-start"
                onClick={() => handleQuickAction("Add Contact")}
              >
                Add Contact
              </Button>
              <Button
                variant="ghost"
                icon="Building2"
                className="w-full justify-start"
                onClick={() => handleQuickAction("Add Account")}
              >
                Add Account
              </Button>
              <Button
                variant="ghost"
                icon="BarChart3"
                className="w-full justify-start"
                onClick={() => handleQuickAction("Create Opportunity")}
              >
                Create Opportunity
              </Button>
              <Button
                variant="ghost"
                icon="Calendar"
                className="w-full justify-start"
                onClick={() => handleQuickAction("Schedule Meeting")}
              >
                Schedule Meeting
              </Button>
              <Button
                variant="ghost"
                icon="Mail"
                className="w-full justify-start"
                onClick={() => handleQuickAction("Send Email Campaign")}
              >
                Send Email Campaign
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Activities & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activities */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-900">Recent Activities</h3>
            <Button variant="ghost" size="sm" icon="MoreHorizontal" />
          </div>
          <div className="space-y-4">
            {dashboard.recentActivities.map((activity, index) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <ApperIcon name={activity.icon} className="w-4 h-4 text-primary-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(activity.timestamp)}</p>
                </div>
                <Badge variant={activity.type === 'deal' ? 'success' : 'primary'} size="sm">
                  {activity.type}
                </Badge>
              </motion.div>
            ))}
          </div>
        </Card>

        {/* Top Performers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-display font-semibold text-gray-900">Top Performers</h3>
            <Button variant="ghost" size="sm" icon="Trophy" />
          </div>
          <div className="space-y-4">
            {dashboard.topPerformers.map((performer, index) => (
              <motion.div
                key={performer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-r from-primary-50 to-secondary-50"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{performer.name}</p>
                    <p className="text-sm text-gray-600">{performer.deals} deals closed</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{performer.revenue}</p>
                  <p className="text-sm text-green-600">+{performer.growth}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;