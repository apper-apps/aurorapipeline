const { ApperClient } = window.ApperSDK;

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'account_c';

export const AccountsService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "website_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "employees_c" } },
          { field: { Name: "health_c" } },
          { field: { Name: "contact_count_c" } },
          { field: { Name: "total_revenue_c" } },
          { field: { Name: "last_activity_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
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
        console.error("Error fetching accounts:", error?.response?.data?.message);
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
          { field: { Name: "website_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "employees_c" } },
          { field: { Name: "health_c" } },
          { field: { Name: "contact_count_c" } },
          { field: { Name: "total_revenue_c" } },
          { field: { Name: "last_activity_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } }
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
        console.error(`Error fetching account with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(accountData) {
    try {
      const params = {
        records: [
          {
            Name: accountData.Name,
            website_c: accountData.website_c,
            industry_c: accountData.industry_c,
            type_c: accountData.type_c,
            location_c: accountData.location_c,
            employees_c: parseInt(accountData.employees_c),
            health_c: accountData.health_c,
            contact_count_c: parseInt(accountData.contact_count_c),
            total_revenue_c: parseFloat(accountData.total_revenue_c),
            notes_c: accountData.notes_c,
            created_at_c: new Date().toISOString()
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
          console.error(`Failed to create accounts ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating account:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, accountData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (accountData.Name !== undefined) updateData.Name = accountData.Name;
      if (accountData.website_c !== undefined) updateData.website_c = accountData.website_c;
      if (accountData.industry_c !== undefined) updateData.industry_c = accountData.industry_c;
      if (accountData.type_c !== undefined) updateData.type_c = accountData.type_c;
      if (accountData.location_c !== undefined) updateData.location_c = accountData.location_c;
      if (accountData.employees_c !== undefined) updateData.employees_c = parseInt(accountData.employees_c);
      if (accountData.health_c !== undefined) updateData.health_c = accountData.health_c;
      if (accountData.contact_count_c !== undefined) updateData.contact_count_c = parseInt(accountData.contact_count_c);
      if (accountData.total_revenue_c !== undefined) updateData.total_revenue_c = parseFloat(accountData.total_revenue_c);
      if (accountData.last_activity_c !== undefined) updateData.last_activity_c = accountData.last_activity_c;
      if (accountData.notes_c !== undefined) updateData.notes_c = accountData.notes_c;

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
          console.error(`Failed to update accounts ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating account:", error?.response?.data?.message);
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
          console.error(`Failed to delete accounts ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting account:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async getByType(type) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "website_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "employees_c" } },
          { field: { Name: "health_c" } },
          { field: { Name: "contact_count_c" } },
          { field: { Name: "total_revenue_c" } },
          { field: { Name: "last_activity_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "type_c",
            Operator: "EqualTo",
            Values: [type]
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
        console.error("Error fetching accounts by type:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByHealth(health) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "website_c" } },
          { field: { Name: "industry_c" } },
          { field: { Name: "type_c" } },
          { field: { Name: "location_c" } },
          { field: { Name: "employees_c" } },
          { field: { Name: "health_c" } },
          { field: { Name: "contact_count_c" } },
          { field: { Name: "total_revenue_c" } },
          { field: { Name: "last_activity_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } }
        ],
        where: [
          {
            FieldName: "health_c",
            Operator: "EqualTo",
            Values: [health]
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
        console.error("Error fetching accounts by health:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};