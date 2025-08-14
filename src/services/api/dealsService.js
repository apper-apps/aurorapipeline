import dealsData from "@/services/mockData/deals.json";

let deals = [...dealsData];

export const DealsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...deals];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return deals.find(deal => deal.Id === parseInt(id)) || null;
  },

  async create(dealData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...deals.map(d => d.Id), 0);
    const newDeal = {
      ...dealData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) throw new Error("Deal not found");
    
    deals[index] = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...deals[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = deals.findIndex(deal => deal.Id === parseInt(id));
    if (index === -1) throw new Error("Deal not found");
    
    const deletedDeal = deals.splice(index, 1)[0];
    return { ...deletedDeal };
  },

  async getByStage(stage) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return deals.filter(deal => deal.stage === stage);
  }
};