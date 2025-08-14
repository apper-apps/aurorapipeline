import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import FilterBar from "@/components/molecules/FilterBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { LeadsService } from "@/services/api/leadsService";
import { formatDate, formatCurrency } from "@/utils/formatters";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Leads Management</h1>
          <p className="text-gray-600 mt-2">Capture, qualify, and convert leads into customers</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" icon="Download">
            Export
          </Button>
          <Button variant="ghost" icon="Upload">
            Import
          </Button>
          <Button variant="primary" icon="Plus">
            Add Lead
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads by name, email, or company..."
            />
          </div>
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
          />
        </div>
      </Card>

      {/* Leads Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {leads.filter(l => l.status === 'new').length}
          </div>
          <div className="text-gray-600">New Leads</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {leads.filter(l => l.status === 'contacted').length}
          </div>
          <div className="text-gray-600">Contacted</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {leads.filter(l => l.status === 'qualified').length}
          </div>
          <div className="text-gray-600">Qualified</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {Math.round(leads.filter(l => l.status === 'qualified').length / Math.max(leads.length, 1) * 100)}%
          </div>
          <div className="text-gray-600">Conversion Rate</div>
        </Card>
      </div>

      {/* Leads List */}
      <Card className="overflow-hidden">
        {filteredLeads.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Lead</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Company</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Source</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Score</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Value</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Created</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.map((lead, index) => (
                  <motion.tr
                    key={lead.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{lead.name}</div>
                        <div className="text-sm text-gray-600">{lead.email}</div>
                        <div className="text-sm text-gray-500">{lead.phone}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{lead.company}</td>
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
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {formatCurrency(lead.estimatedValue)}
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {lead.status === 'qualified' && (
                          <Button
                            size="sm"
                            variant="primary"
                            icon="ArrowRight"
                            onClick={() => handleConvertToContact(lead)}
                            className="text-xs"
                          >
                            Convert
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          icon="Edit"
                          onClick={() => toast.info(`Editing ${lead.name}...`)}
                          className="text-xs"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon="Trash2"
                          onClick={() => handleDelete(lead)}
                          className="text-xs text-red-600 hover:text-red-700"
                        />
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
            title="No leads found"
            description={searchTerm ? "No leads match your search criteria." : "Start capturing leads to grow your business."}
            actionText="Add Lead"
          />
        )}
      </Card>
    </div>
  );
};

export default Leads;