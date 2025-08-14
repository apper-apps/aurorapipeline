import accountsData from "@/services/mockData/accounts.json";

let accounts = [...accountsData];

export const AccountsService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...accounts];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return accounts.find(account => account.Id === parseInt(id)) || null;
  },

  async create(accountData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    const maxId = Math.max(...accounts.map(a => a.Id), 0);
    const newAccount = {
      ...accountData,
      Id: maxId + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    accounts.push(newAccount);
    return { ...newAccount };
  },

  async update(id, accountData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const index = accounts.findIndex(account => account.Id === parseInt(id));
    if (index === -1) throw new Error("Account not found");
    
    accounts[index] = {
      ...accounts[index],
      ...accountData,
      Id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    return { ...accounts[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = accounts.findIndex(account => account.Id === parseInt(id));
    if (index === -1) throw new Error("Account not found");
    
    const deletedAccount = accounts.splice(index, 1)[0];
    return { ...deletedAccount };
  },

  async getByType(type) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return accounts.filter(account => account.type === type);
  },

  async getByHealth(health) {
    await new Promise(resolve => setTimeout(resolve, 200));
    return accounts.filter(account => account.health === health);
  }
};