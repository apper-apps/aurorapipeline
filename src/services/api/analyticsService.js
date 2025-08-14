import { DealsService } from "@/services/api/dealsService";
import { StagesService } from "@/services/api/stagesService";

export const AnalyticsService = {
  async getDashboard() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const deals = await DealsService.getAll();
    const stages = await StagesService.getAll();
    
    const totalDeals = deals.length;
const pipelineValue = deals.reduce((sum, deal) => sum + deal.value_c, 0);
const closedDeals = deals.filter(deal => deal.stage_c === "deal-closed").length;
    const conversionRate = totalDeals > 0 ? Math.round((closedDeals / totalDeals) * 100) : 0;
    const avgDealSize = totalDeals > 0 ? Math.round(pipelineValue / totalDeals) : 0;

const stagePerformance = stages.map(stage => {
      const stageDeals = deals.filter(deal => deal.stage_c === stage.Name);
      const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value_c, 0);
      const avgDays = Math.floor(Math.random() * 30) + 10; // Mock average days
      
return {
        name: stage.Name,
        count: stageDeals.length,
        value: `$${(stageValue / 1000).toFixed(0)}k`,
        avgDays
      };
    });

const conversionFunnel = stages.map((stage, index) => {
      const stageDeals = deals.filter(deal => deal.stage_c === stage.Name);
      const maxDeals = Math.max(...stages.map(s => deals.filter(d => d.stage_c === s.Name).length));
      const percentage = maxDeals > 0 ? Math.round((stageDeals.length / maxDeals) * 100) : 0;
      
return {
        name: stage.Name,
        deals: stageDeals.length,
        percentage
      };
    });

    return {
      totalDeals,
      dealsChange: 12, // Mock change percentage
      pipelineValue,
      pipelineChange: 8,
      conversionRate,
      conversionChange: 5,
      avgDealSize,
      avgDealChange: -3,
      stagePerformance,
      conversionFunnel
    };
  }
};