import { DealsService } from "@/services/api/dealsService";
import { ContactsService } from "@/services/api/contactsService";
import { formatCurrency } from "@/utils/formatters";

export const DashboardService = {
  async getDashboard() {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const deals = await DealsService.getAll();
    const contacts = await ContactsService.getAll();
    
    // Calculate metrics
const totalRevenue = deals
      .filter(deal => deal.stage_c === "deal-closed")
      .reduce((sum, deal) => sum + deal.value_c, 0);
    
const activeDeals = deals.filter(deal => deal.stage_c !== "deal-closed").length;
    const newLeads = Math.floor(Math.random() * 15) + 5; // Mock data
    const conversionRate = Math.floor(Math.random() * 30) + 15; // Mock data
    
    // Pipeline overview
    const pipeline = [
      {
name: "Cold Lead",
        count: deals.filter(d => d.stage_c === "cold-lead").length,
        value: formatCurrency(deals.filter(d => d.stage_c === "cold-lead").reduce((sum, d) => sum + d.value_c, 0))
      },
      {
name: "Hot Lead", 
        count: deals.filter(d => d.stage_c === "hot-lead").length,
        value: formatCurrency(deals.filter(d => d.stage_c === "hot-lead").reduce((sum, d) => sum + d.value_c, 0))
      },
      {
name: "Estimate Sent",
        count: deals.filter(d => d.stage_c === "estimate-sent").length,
        value: formatCurrency(deals.filter(d => d.stage_c === "estimate-sent").reduce((sum, d) => sum + d.value_c, 0))
      },
      {
name: "Closed",
        count: deals.filter(d => d.stage_c === "deal-closed").length,
        value: formatCurrency(deals.filter(d => d.stage_c === "deal-closed").reduce((sum, d) => sum + d.value_c, 0))
      }
    ];

    // Recent activities (mock data)
    const recentActivities = [
      {
        id: 1,
        description: "New lead from website form - Sarah Johnson",
        timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
        type: "lead",
        icon: "UserPlus"
      },
      {
        id: 2,
        description: "Deal closed - Enterprise Software License ($45,000)",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        type: "deal",
        icon: "DollarSign"
      },
      {
        id: 3,
        description: "Meeting scheduled with Michael Chen - GrowthCo Inc",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
        type: "meeting",
        icon: "Calendar"
      },
      {
        id: 4,
        description: "Proposal sent to CloudFirst Ltd ($75,000)",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(), // 6 hours ago
        type: "proposal",
        icon: "FileText"
      },
      {
        id: 5,
        description: "New contact added - David Kim from DataDriven Analytics",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(), // 8 hours ago
        type: "contact",
        icon: "Users"
      }
    ];

    // Top performers (mock data)
    const topPerformers = [
      {
        id: 1,
        name: "John Smith",
        deals: 8,
        revenue: formatCurrency(245000),
        growth: 23
      },
      {
        id: 2,
        name: "Jane Doe", 
        deals: 6,
        revenue: formatCurrency(187000),
        growth: 18
      },
      {
        id: 3,
        name: "Mike Johnson",
        deals: 5,
        revenue: formatCurrency(156000),
        growth: 15
      },
      {
        id: 4,
        name: "Sarah Wilson",
        deals: 4,
        revenue: formatCurrency(98000),
        growth: 12
      }
    ];

    return {
      metrics: {
        totalRevenue: formatCurrency(totalRevenue),
        revenueChange: 12,
        activeDeals,
        dealsChange: 8,
        conversionRate,
        conversionChange: 5,
        newLeads,
        leadsChange: 15
      },
      pipeline,
      recentActivities,
      topPerformers
    };
  }
};