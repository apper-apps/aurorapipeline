import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { LeadsService } from "@/services/api/leadsService";
import ApperIcon from "@/components/ApperIcon";
import FilterBar from "@/components/molecules/FilterBar";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import { formatCurrency, formatDate } from "@/utils/formatters";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");

  useEffect(() => {
    loadLeads();
  }, []);

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

  const handleConvertToContact = async (lead) => {
    try {
      await LeadsService.convertToContact(lead.Id);
      setLeads(prev => prev.filter(l => l.Id !== lead.Id));
      toast.success(`${lead.name} converted to contact successfully`);
    } catch (err) {
      toast.error("Failed to convert lead");
    }
  };

  const handleUpdateStatus = async (lead, newStatus) => {
    try {
      const updatedLead = await LeadsService.update(lead.Id, { status: newStatus });
      setLeads(prev => prev.map(l => l.Id === lead.Id ? updatedLead : l));
      toast.success("Lead status updated");
    } catch (err) {
      toast.error("Failed to update lead status");
    }
  };

  const handleDelete = async (lead) => {
    if (!window.confirm(`Are you sure you want to delete ${lead.name}?`)) return;

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
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    
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
              {leads.filter(l => l.status === 'new').length}
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
              {leads.filter(l => l.status === 'contacted').length}
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
              {leads.filter(l => l.status === 'qualified').length}
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
              {Math.round(leads.filter(l => l.status === 'qualified').length / Math.max(leads.length, 1) * 100)}%
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
                          <div className="font-semibold text-gray-900 text-base">{lead.name}</div>
                          <div className="text-sm font-medium text-slate-600">{lead.email}</div>
                          <div className="text-sm font-medium text-slate-600">{lead.phone}</div>
                        </motion.div>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-800">{lead.company}</td>
                      <td className="py-4 px-6">
                        <Badge variant="primary" size="sm">
                          {lead.source}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getStatusBadge(lead.status)} size="sm">
                          {lead.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant={getScoreBadge(lead.score)} size="sm">
                          {lead.score}/100
                        </Badge>
                      </td>
                      <td className="py-4 px-6 font-semibold text-lg text-green-600">
                        {formatCurrency(lead.estimatedValue)}
                      </td>
                      <td className="py-4 px-6 text-gray-700 text-sm font-medium">
                        {formatDate(lead.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          {lead.status === 'qualified' && (
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
                              onClick={() => toast.info(`Editing ${lead.name}...`)}
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
/>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Leads;