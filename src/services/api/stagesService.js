import stagesData from "@/services/mockData/stages.json";

let stages = [...stagesData];

export const StagesService = {
  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...stages];
  },

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    return stages.find(stage => stage.Id === parseInt(id)) || null;
  },

  async create(stageData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    const maxId = Math.max(...stages.map(s => s.Id), 0);
    const newStage = {
      ...stageData,
      Id: maxId + 1
    };
    stages.push(newStage);
    return { ...newStage };
  },

  async update(id, stageData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    const index = stages.findIndex(stage => stage.Id === parseInt(id));
    if (index === -1) throw new Error("Stage not found");
    
    stages[index] = {
      ...stages[index],
      ...stageData,
      Id: parseInt(id)
    };
    return { ...stages[index] };
  },

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = stages.findIndex(stage => stage.Id === parseInt(id));
    if (index === -1) throw new Error("Stage not found");
    
    const deletedStage = stages.splice(index, 1)[0];
    return { ...deletedStage };
  }
};