const { ApperClient } = window.ApperSDK;

// Initialize ApperClient
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const tableName = 'lead_c';

export const LeadsService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "source_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "estimated_value_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
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
        console.error("Error fetching leads:", error?.response?.data?.message);
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
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "source_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "estimated_value_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
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
        console.error(`Error fetching lead with ID ${id}:`, error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async create(leadData) {
    try {
      const params = {
        records: [
          {
            Name: leadData.Name,
            email_c: leadData.email_c,
            phone_c: leadData.phone_c,
            company_c: leadData.company_c,
            title_c: leadData.title_c,
            source_c: leadData.source_c,
            status_c: leadData.status_c,
            score_c: parseInt(leadData.score_c),
            estimated_value_c: parseFloat(leadData.estimated_value_c),
            notes_c: leadData.notes_c,
            created_at_c: new Date().toISOString(),
            updated_at_c: new Date().toISOString()
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
          console.error(`Failed to create leads ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating lead:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return null;
    }
  },

  async update(id, leadData) {
    try {
      const updateData = {
        Id: parseInt(id)
      };

      // Only include updateable fields
      if (leadData.Name !== undefined) updateData.Name = leadData.Name;
      if (leadData.email_c !== undefined) updateData.email_c = leadData.email_c;
      if (leadData.phone_c !== undefined) updateData.phone_c = leadData.phone_c;
      if (leadData.company_c !== undefined) updateData.company_c = leadData.company_c;
      if (leadData.title_c !== undefined) updateData.title_c = leadData.title_c;
      if (leadData.source_c !== undefined) updateData.source_c = leadData.source_c;
      if (leadData.status_c !== undefined) updateData.status_c = leadData.status_c;
      if (leadData.score_c !== undefined) updateData.score_c = parseInt(leadData.score_c);
      if (leadData.estimated_value_c !== undefined) updateData.estimated_value_c = parseFloat(leadData.estimated_value_c);
      if (leadData.notes_c !== undefined) updateData.notes_c = leadData.notes_c;

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
          console.error(`Failed to update leads ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating lead:", error?.response?.data?.message);
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
          console.error(`Failed to delete leads ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        }

        return successfulDeletions.length > 0;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting lead:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return false;
    }
  },

  async convertToContact(id) {
    try {
      // First get the lead data
      const lead = await this.getById(id);
      if (!lead) {
        throw new Error("Lead not found");
      }

      // Create contact using contact service
      const contactData = {
        Name: lead.Name,
        email_c: lead.email_c,
        phone_c: lead.phone_c,
        company_c: lead.company_c,
        lead_source_c: lead.source_c,
        created_at_c: new Date().toISOString()
      };

      // Initialize contact service ApperClient
      const contactClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const contactParams = {
        records: [contactData]
      };

      const contactResponse = await contactClient.createRecord('contact_c', contactParams);

      if (!contactResponse.success) {
        throw new Error("Failed to create contact");
      }

      // Delete the lead after successful contact creation
      await this.delete(id);

      return lead;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error converting lead to contact:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      throw error;
    }
  },

  async getBySource(source) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "source_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "estimated_value_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "source_c",
            Operator: "EqualTo",
            Values: [source]
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
        console.error("Error fetching leads by source:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  },

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "email_c" } },
          { field: { Name: "phone_c" } },
          { field: { Name: "company_c" } },
          { field: { Name: "title_c" } },
          { field: { Name: "source_c" } },
          { field: { Name: "status_c" } },
          { field: { Name: "score_c" } },
          { field: { Name: "estimated_value_c" } },
          { field: { Name: "notes_c" } },
          { field: { Name: "created_at_c" } },
          { field: { Name: "updated_at_c" } }
        ],
        where: [
          {
            FieldName: "status_c",
            Operator: "EqualTo",
            Values: [status]
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
        console.error("Error fetching leads by status:", error?.response?.data?.message);
      } else {
        console.error(error.message);
      }
      return [];
    }
  }
};