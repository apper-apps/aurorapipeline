import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { LeadsService } from "@/services/api/leadsService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import { formatCurrency, formatDate } from "@/utils/formatters";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [creating, setCreating] = useState(false);

  // Load leads data
  const loadLeads = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await LeadsService.getAll();
      setLeads(data);
    } catch (err) {
      setError("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  // Handle export functionality
  const handleExport = async () => {
    try {
      toast.info("Preparing export...");
      
      // Get all leads data
      const allLeads = await LeadsService.getAll();
      
      if (!allLeads || allLeads.length === 0) {
        toast.warning("No leads to export");
        return;
      }

      // Create CSV headers
      const headers = [
        'Name', 'Email', 'Phone', 'Company', 'Title', 'Source', 
        'Status', 'Score', 'Estimated Value', 'Notes', 'Created At'
      ];

      // Convert leads data to CSV format
      const csvContent = [
        headers.join(','),
        ...allLeads.map(lead => [
          `"${lead.Name || ''}"`,
          `"${lead.email_c || ''}"`,
          `"${lead.phone_c || ''}"`,
          `"${lead.company_c || ''}"`,
          `"${lead.title_c || ''}"`,
          `"${lead.source_c || ''}"`,
          `"${lead.status_c || ''}"`,
          lead.score_c || 0,
          lead.estimated_value_c || 0,
          `"${(lead.notes_c || '').replace(/"/g, '""')}"`,
          lead.created_at_c ? new Date(lead.created_at_c).toLocaleDateString() : ''
        ].join(','))
      ].join('\n');

      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `leads_export_${new Date().toISOString().split('T')[0]}.csv`;
      link.click();
      
      toast.success(`Exported ${allLeads.length} leads successfully`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error("Failed to export leads");
    }
  };

  // Handle import functionality
  const handleImport = async () => {
    if (!importFile) {
      toast.error("Please select a file to import");
      return;
    }

    setImporting(true);
    try {
      const text = await importFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        toast.error("CSV file must contain headers and at least one data row");
        return;
      }

      // Parse CSV headers and data
      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
      const data = lines.slice(1);

      const leadsToCreate = [];
      
      for (let i = 0; i < data.length; i++) {
        try {
          const values = data[i].split(',').map(v => v.replace(/"/g, '').trim());
          
          const leadData = {
            Name: values[headers.indexOf('name')] || '',
            email_c: values[headers.indexOf('email')] || '',
            phone_c: values[headers.indexOf('phone')] || '',
            company_c: values[headers.indexOf('company')] || '',
            title_c: values[headers.indexOf('title')] || '',
            source_c: values[headers.indexOf('source')] || 'website',
            status_c: values[headers.indexOf('status')] || 'new',
            score_c: parseInt(values[headers.indexOf('score')]) || 0,
            estimated_value_c: parseFloat(values[headers.indexOf('estimated value')]) || 0,
            notes_c: values[headers.indexOf('notes')] || ''
          };

          // Basic validation
          if (leadData.Name && leadData.email_c) {
            leadsToCreate.push(leadData);
          }
        } catch (err) {
          console.error(`Error parsing row ${i + 1}:`, err);
        }
      }

      if (leadsToCreate.length === 0) {
        toast.error("No valid leads found in the file");
        return;
      }

      // Create leads one by one to handle individual errors
      let successCount = 0;
      for (const leadData of leadsToCreate) {
        try {
          await LeadsService.create(leadData);
          successCount++;
        } catch (error) {
          console.error('Error creating lead:', error);
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully imported ${successCount} leads`);
        loadLeads(); // Refresh the leads list
        setShowImportModal(false);
        setImportFile(null);
      }
      
      if (successCount < leadsToCreate.length) {
        toast.warning(`${leadsToCreate.length - successCount} leads failed to import`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error("Failed to import leads");
    } finally {
      setImporting(false);
    }
  };

  // Handle add lead functionality
  const handleAddLead = async (formData) => {
    setCreating(true);
    try {
      const result = await LeadsService.create(formData);
      if (result) {
        toast.success("Lead created successfully");
        setShowAddModal(false);
        loadLeads(); // Refresh the leads list
      } else {
        toast.error("Failed to create lead");
      }
    } catch (error) {
      console.error('Error creating lead:', error);
      toast.error("Failed to create lead");
    } finally {
      setCreating(false);
    }
  };

  // Helper functions
  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);
  const openImportModal = () => setShowImportModal(true);
  const closeImportModal = () => {
    setShowImportModal(false);
    setImportFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setImportFile(file);
    } else {
      toast.error("Please select a valid CSV file");
      setImportFile(null);
    }
};

  const handleConvertToContact = async (lead) => {
    try {
      await LeadsService.convertToContact(lead.Id);
      setLeads(prev => prev.filter(l => l.Id !== lead.Id));
      toast.success(`${lead.Name} converted to contact successfully`);
    } catch (err) {
      toast.error("Failed to convert lead");
    }
  };

  const handleUpdateStatus = async (lead, newStatus) => {
    try {
      const updatedLead = await LeadsService.update(lead.Id, { status_c: newStatus });
      setLeads(prev => prev.map(l => l.Id === lead.Id ? updatedLead : l));
      toast.success("Lead status updated");
    } catch (err) {
      toast.error("Failed to update lead status");
    }
  };
const handleDelete = async (lead) => {
    if (!window.confirm(`Are you sure you want to delete ${lead.Name}?`)) return;

    try {
      await LeadsService.delete(lead.Id);
      setLeads(prev => prev.filter(l => l.Id !== lead.Id));
      toast.success("Lead deleted successfully");
    } catch (err) {
      toast.error("Failed to delete lead");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      'new': 'primary',
      'contacted': 'warning',
      'qualified': 'success',
      'unqualified': 'error'
    };
    return variants[status] || 'primary';
  };

  const getScoreBadge = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };

const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email_c?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company_c?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status_c === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source_c === sourceFilter;
    return matchesSearch && matchesStatus && matchesSource;
  });

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'unqualified', label: 'Unqualified' }
  ];

  const sourceOptions = [
    { value: 'all', label: 'All Sources' },
    { value: 'website', label: 'Website' },
    { value: 'social', label: 'Social Media' },
    { value: 'referral', label: 'Referral' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'trade-show', label: 'Trade Show' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadLeads} />;

  return (
<div className="space-y-6">
{/* Header */}
      <motion.div 
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div>
          <motion.h1 
            className="text-4xl font-display font-bold text-slate-800"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            Leads Management
          </motion.h1>
          <motion.p 
            className="text-lg font-medium text-slate-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Capture, qualify, and convert leads into customers.
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
<Button 
              variant="ghost" 
              icon="Download"
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm"
              onClick={handleExport}
            >
              Export
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              icon="Upload"
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm"
              onClick={openImportModal}
            >
              Import
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="primary" 
              icon="Plus"
              className="bg-slate-700 hover:bg-slate-800 text-white border-0 shadow-md"
              onClick={openAddModal}
            >
              Add Lead
            </Button>
          </motion.div>
        </div>
      </motion.div>

{/* Search and Filters */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-6 bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col md:flex-row gap-4">
            <motion.div 
              className="flex-1"
              whileHover={{ scale: 1.01 }}
            >
              <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search leads by name, email, or company..."
                className="bg-white border border-slate-300 shadow-sm focus:shadow-md focus:border-slate-400 transition-all duration-200"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.01 }}
            >
              <FilterBar
                filters={[
                  {
                    label: "Status",
                    value: statusFilter,
                    onChange: setStatusFilter,
                    options: statusOptions
                  },
                  {
                    label: "Source",
                    value: sourceFilter,
                    onChange: setSourceFilter,
                    options: sourceOptions
                  }
                ]}
                className="bg-white border border-slate-300 shadow-sm"
              />
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Leads Stats */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 text-center bg-slate-50 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-slate-800 mb-2">
{leads.filter(l => l.status_c === 'new').length}
            </div>
            <div className="text-slate-600 font-medium text-lg">New Leads</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 text-center bg-orange-50 border border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-orange-700 mb-2">
{leads.filter(l => l.status_c === 'contacted').length}
            </div>
            <div className="text-orange-600 font-medium text-lg">Contacted</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 text-center bg-green-50 border border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-green-700 mb-2">
{leads.filter(l => l.status_c === 'qualified').length}
            </div>
            <div className="text-green-600 font-medium text-lg">Qualified</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 text-center bg-blue-50 border border-blue-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-blue-700 mb-2">
{Math.round(leads.filter(l => l.status_c === 'qualified').length / Math.max(leads.length, 1) * 100)}%
            </div>
            <div className="text-blue-600 font-medium text-lg">Conversion Rate</div>
          </Card>
        </motion.div>
      </div>

      {/* Leads List */}
<motion.div
        whileHover={{ scale: 1.001 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {filteredLeads.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">LEAD</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">COMPANY</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">SOURCE</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">STATUS</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">SCORE</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">VALUE</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">CREATED</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead, index) => (
                    <motion.tr
                      key={lead.Id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ backgroundColor: "rgba(241, 245, 249, 0.8)" }}
                      className={`border-b border-slate-200 transition-colors duration-200 cursor-pointer ${
                        index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                      }`}
                    >
                      <td className="py-4 px-6">
                        <motion.div
                          whileHover={{ scale: 1.02 }}
                        >
<div className="font-semibold text-gray-900 text-base">{lead.Name}</div>
                          <div className="text-sm font-medium text-slate-600">{lead.email_c}</div>
                          <div className="text-sm font-medium text-slate-600">{lead.phone_c}</div>
                        </motion.div>
                      </td>
<td className="py-4 px-6 font-medium text-gray-800">{lead.company_c}</td>
                      <td className="py-4 px-6">
                        <Badge variant="primary" size="sm">
{lead.source_c}
                        </Badge>
                      </td>
<td className="py-4 px-6">
                        <Badge variant={getStatusBadge(lead.status_c)} size="sm">
                          {lead.status_c}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getScoreBadge(lead.score_c)} size="sm">
                          {lead.score_c}/100
                        </Badge>
                      </td>
<td className="py-4 px-6 font-semibold text-lg text-green-600">
                        {formatCurrency(lead.estimated_value_c)}
                      </td>
                      <td className="py-4 px-6 text-gray-700 text-sm font-medium">
                        {formatDate(lead.created_at_c)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
{lead.status_c === 'qualified' && (
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="sm"
                                variant="primary"
                                icon="ArrowRight"
                                onClick={() => handleConvertToContact(lead)}
                                className="text-xs bg-green-600 hover:bg-green-700 text-white border-0 shadow-sm"
                              >
                                Convert
                              </Button>
                            </motion.div>
                          )}
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
icon="Edit"
                              onClick={() => toast.info(`Editing ${lead.Name}...`)}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 border-0"
                            />
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              icon="Trash2"
                              onClick={() => handleDelete(lead)}
                              className="text-xs bg-red-100 hover:bg-red-200 text-red-600 border-0"
                            />
                          </motion.div>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                  </tbody>
</table>
              </div>
            ) : (
              <Empty
                icon="UserPlus"
                title="🎯 No leads found"
                description={searchTerm ? "🔍 No leads match your search criteria." : "🚀 Start capturing leads to grow your business."}
actionText="✨ Add Lead"
                onAction={openAddModal}
              />
            )}
)}
        </Card>
      </motion.div>

      {/* Add Lead Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add New Lead</h2>
                <Button
                  variant="ghost"
                  icon="X"
                  onClick={closeAddModal}
                  className="text-gray-400 hover:text-gray-600"
                />
              </div>

              <AddLeadForm 
                onSubmit={handleAddLead} 
                onCancel={closeAddModal}
                creating={creating}
              />
            </div>
          </motion.div>
        </div>
      )}

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Import Leads</h2>
                <Button
                  variant="ghost"
                  icon="X"
                  onClick={closeImportModal}
                  className="text-gray-400 hover:text-gray-600"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    CSV should contain: Name, Email, Phone, Company, Title, Source, Status, Score, Estimated Value, Notes
                  </p>
                </div>

                {importFile && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">
                      <ApperIcon name="Check" size={16} className="inline mr-1" />
                      File selected: {importFile.name}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    variant="ghost"
                    onClick={closeImportModal}
                    disabled={importing}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleImport}
                    disabled={!importFile || importing}
                    icon={importing ? "Loader" : "Upload"}
                    className={importing ? "animate-pulse" : ""}
                  >
                    {importing ? "Importing..." : "Import"}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// Add Lead Form Component
function AddLeadForm({ onSubmit, onCancel, creating }) {
  const [formData, setFormData] = useState({
    Name: '',
    email_c: '',
    phone_c: '',
    company_c: '',
    title_c: '',
    source_c: 'website',
    status_c: 'new',
    score_c: 0,
    estimated_value_c: 0,
    notes_c: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.Name || !formData.email_c) {
      toast.error("Name and Email are required");
      return;
    }

    if (formData.email_c && !/\S+@\S+\.\S+/.test(formData.email_c)) {
      toast.error("Please enter a valid email address");
      return;
    }

    onSubmit(formData);
  };

  const sourceOptions = [
    { value: 'website', label: 'Website' },
    { value: 'social', label: 'Social Media' },
    { value: 'referral', label: 'Referral' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'trade-show', label: 'Trade Show' }
  ];

  const statusOptions = [
    { value: 'new', label: 'New' },
    { value: 'contacted', label: 'Contacted' },
    { value: 'qualified', label: 'Qualified' },
    { value: 'unqualified', label: 'Unqualified' }
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            name="email_c"
            value={formData.email_c}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            name="phone_c"
            value={formData.phone_c}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company
          </label>
          <input
            type="text"
            name="company_c"
            value={formData.company_c}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            name="title_c"
            value={formData.title_c}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <select
            name="source_c"
            value={formData.source_c}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sourceOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            name="status_c"
            value={formData.status_c}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statusOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Score (0-100)
          </label>
          <input
            type="number"
            name="score_c"
            value={formData.score_c}
            onChange={handleChange}
            min="0"
            max="100"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Value ($)
          </label>
          <input
            type="number"
            name="estimated_value_c"
            value={formData.estimated_value_c}
            onChange={handleChange}
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <textarea
          name="notes_c"
          value={formData.notes_c}
          onChange={handleChange}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={creating}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={creating}
          icon={creating ? "Loader" : "Plus"}
          className={creating ? "animate-pulse" : ""}
        >
          {creating ? "Creating..." : "Create Lead"}
        </Button>
      </div>
    </form>
  );
}

export default Leads;