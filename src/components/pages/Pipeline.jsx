import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import PipelineBoard from "@/components/organisms/PipelineBoard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import MetricCard from "@/components/molecules/MetricCard";
import { DealsService } from "@/services/api/dealsService";
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Sales Pipeline</h1>
          <p className="text-gray-600 mt-2">Track and manage your deals through the sales process</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" icon="Download">
            Export
          </Button>
          <Button variant="ghost" icon="BarChart3">
            Forecast
          </Button>
          <Button variant="primary" icon="Plus">
            New Deal
          </Button>
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard
          title="Pipeline Value"
          value={formatCurrency(totalPipelineValue)}
          change={12}
          icon="DollarSign"
          trend="up"
          color="success"
        />
        <MetricCard
          title="Total Deals"
          value={deals.length}
          change={8}
          icon="BarChart3"
          trend="up"
          color="primary"
        />
        <MetricCard
          title="Avg Deal Size"
          value={formatCurrency(avgDealSize)}
          change={5}
          icon="TrendingUp"
          trend="up"
          color="warning"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${conversionRate}%`}
          change={3}
          icon="Target"
          trend="up"
          color="secondary"
        />
      </div>
      
      <div className="h-[calc(100vh-20rem)]">
        <PipelineBoard />
      </div>
    </div>
  );
};

export default Pipeline;