const { ApperClient } = window.ApperSDK;

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'deal_c';

export const DealsService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "contact_name_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "assigned_to_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "last_activity_c" } },
          { field: { Name: "last_activity_type_c" } }
        ],
        orderBy: [
          {
            fieldName: "created_at_c",
            sorttype: "DESC"
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "contact_name_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "assigned_to_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "last_activity_c" } },
          { field: { Name: "last_activity_type_c" } }
        ]
      };

      const response = await apperClient.getRecordById(tableName, id, params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching deal with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(dealData) {
    try {
      const params = {
        records: [
          {
            Name: dealData.Name,
            title_c: dealData.title_c,
            value_c: parseFloat(dealData.value_c),
            stage_c: dealData.stage_c?.Name || dealData.stage_c, // Handle lookup field
            priority_c: dealData.priority_c,
            contact_id_c: dealData.contact_id_c?.Name || dealData.contact_id_c, // Handle lookup field
            contact_name_c: dealData.contact_name_c,
            company_c: dealData.company_c,
            assigned_to_c: dealData.assigned_to_c,
            created_at_c: new Date().toISOString(),
            updated_at_c: new Date().toISOString(),
            last_activity_c: new Date().toISOString(),
            last_activity_type_c: dealData.last_activity_type_c || "Created"
          }
        ]
      };

      const response = await apperClient.createRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create deals ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, dealData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (dealData.Name !== undefined) updateData.Name = dealData.Name;
      if (dealData.title_c !== undefined) updateData.title_c = dealData.title_c;
      if (dealData.value_c !== undefined) updateData.value_c = parseFloat(dealData.value_c);
      if (dealData.stage_c !== undefined) updateData.stage_c = dealData.stage_c?.Name || dealData.stage_c;
      if (dealData.priority_c !== undefined) updateData.priority_c = dealData.priority_c;
      if (dealData.contact_id_c !== undefined) updateData.contact_id_c = dealData.contact_id_c?.Name || dealData.contact_id_c;
      if (dealData.contact_name_c !== undefined) updateData.contact_name_c = dealData.contact_name_c;
      if (dealData.company_c !== undefined) updateData.company_c = dealData.company_c;
      if (dealData.assigned_to_c !== undefined) updateData.assigned_to_c = dealData.assigned_to_c;
      if (dealData.last_activity_c !== undefined) updateData.last_activity_c = dealData.last_activity_c;
      if (dealData.last_activity_type_c !== undefined) updateData.last_activity_type_c = dealData.last_activity_type_c;

      // Always update the updated_at timestamp
      updateData.updated_at_c = new Date().toISOString();

      const params = {
        records: [updateData]
      };

      const response = await apperClient.updateRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return null;
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update deals ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(tableName, params);

      if (!response.success) {
        console.error(response.message);
        return false;
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete deals ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting deal:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async getByStage(stage) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "title_c" } },
          { field: { Name: "value_c" } },
          { field: { Name: "stage_c" } },
          { field: { Name: "priority_c" } },
          { field: { Name: "contact_id_c" } },
          { field: { Name: "contact_name_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "assigned_to_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } },
          { field: { Name: "last_activity_c" } },
          { field: { Name: "last_activity_type_c" } }
        ],
        where: [
          {
            FieldName: "stage_c",
            Operator: "EqualTo",
            Values: [stage]
          }
        ]
      };

      const response = await apperClient.fetchRecords(tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching deals by stage:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};