import leadsData from "@/services/mockData/leads.json";

let leads = [...leadsData];

export const LeadsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...leads];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return leads.find(lead => lead.Id === parseInt(id)) || null;
  },

  async create(leadData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...leads.map(l => l.Id), 0);
    const newLead = {
      ...leadData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    leads.push(newLead);
    return { ...newLead };
  },

  async update(id, leadData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = leads.findIndex(lead => lead.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    leads[index] = {
      ...leads[index],
      ...leadData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...leads[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = leads.findIndex(lead => lead.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    const deletedLead = leads.splice(index, 1)[0];
    return { ...deletedLead };
  },

  async convertToContact(id) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const index = leads.findIndex(lead => lead.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    const lead = leads[index];
    // In a real app, this would create a contact and possibly a deal
    leads.splice(index, 1);
    return { ...lead };
  },

  async getBySource(source) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return leads.filter(lead => lead.source === source);
  },

  async getByStatus(status) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return leads.filter(lead => lead.status === status);
  }
};