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
            className="text-4xl font-display font-black bg-gradient-to-r from-green-500 via-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "300% 300%"
            }}
          >
            🎯 Leads Management 🎯
          </motion.h1>
          <motion.p 
            className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            ⚡ Capture, qualify, and convert leads into AMAZING customers! 🚀
          </motion.p>
        </div>
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              icon="Download"
              className="bg-gradient-to-r from-blue-400 to-indigo-500 text-white hover:from-blue-500 hover:to-indigo-600 border-0 shadow-lg hover:shadow-blue-400/50 font-bold"
            >
              📊 Export
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              icon="Upload"
              className="bg-gradient-to-r from-emerald-400 to-green-500 text-white hover:from-emerald-500 hover:to-green-600 border-0 shadow-lg hover:shadow-emerald-400/50 font-bold"
            >
              📤 Import
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ["0 0 20px rgba(236, 72, 153, 0.3)", "0 0 40px rgba(236, 72, 153, 0.6)", "0 0 20px rgba(236, 72, 153, 0.3)"]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <Button 
              variant="primary" 
              icon="Plus"
              className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white border-0 shadow-lg hover:shadow-pink-400/50 font-bold"
            >
              ✨ Add Lead
            </Button>
          </motion.div>
</div>
      </motion.div>

      {/* Search and Filters */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className="relative"
      >
        <Card className="p-6 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border-2 border-transparent shadow-xl hover:shadow-cyan-400/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 rounded-lg blur-sm opacity-10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Search leads by name, email, or company..."
                  className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg focus:shadow-xl focus:border-cyan-300 transition-all duration-300"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
              >
                <FilterBar
                  filters={[
                    {
                      label: "📈 Status",
                      value: statusFilter,
                      onChange: setStatusFilter,
                      options: statusOptions
                    },
                    {
                      label: "🌟 Source",
                      value: sourceFilter,
                      onChange: setSourceFilter,
                      options: sourceOptions
                    }
                  ]}
                  className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Leads Stats */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.08, rotate: [0, 2, -2, 0] }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(59, 130, 246, 0.3)", "0 0 40px rgba(59, 130, 246, 0.6)", "0 0 20px rgba(59, 130, 246, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 2, repeat: Infinity }
          }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-blue-400 via-cyan-500 to-indigo-500 text-white shadow-2xl hover:shadow-blue-400/50 border-0">
            <motion.div 
              className="text-4xl font-black mb-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ✨ {leads.filter(l => l.status === 'new').length}
            </motion.div>
            <div className="text-white/90 font-bold text-lg">🆕 New Leads</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, rotate: [0, -2, 2, 0] }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(249, 115, 22, 0.3)", "0 0 40px rgba(249, 115, 22, 0.6)", "0 0 20px rgba(249, 115, 22, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 2.5, repeat: Infinity }
          }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-orange-400 via-amber-500 to-yellow-500 text-white shadow-2xl hover:shadow-orange-400/50 border-0">
            <motion.div 
              className="text-4xl font-black mb-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              📞 {leads.filter(l => l.status === 'contacted').length}
            </motion.div>
            <div className="text-white/90 font-bold text-lg">🤝 Contacted</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, y: -5 }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(34, 197, 94, 0.3)", "0 0 40px rgba(34, 197, 94, 0.6)", "0 0 20px rgba(34, 197, 94, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 3, repeat: Infinity }
          }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 text-white shadow-2xl hover:shadow-green-400/50 border-0">
            <motion.div 
              className="text-4xl font-black mb-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              🎯 {leads.filter(l => l.status === 'qualified').length}
            </motion.div>
            <div className="text-white/90 font-bold text-lg">✅ Qualified</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, rotate: [0, 5, -5, 0] }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(168, 85, 247, 0.3)", "0 0 40px rgba(168, 85, 247, 0.6)", "0 0 20px rgba(168, 85, 247, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 2.3, repeat: Infinity }
          }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-purple-400 via-violet-500 to-indigo-500 text-white shadow-2xl hover:shadow-purple-400/50 border-0">
            <motion.div 
              className="text-4xl font-black mb-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              🚀 {Math.round(leads.filter(l => l.status === 'qualified').length / Math.max(leads.length, 1) * 100)}%
            </motion.div>
            <div className="text-white/90 font-bold text-lg">📈 Conversion Rate</div>
          </Card>
        </motion.div>
      </div>

      {/* Leads List */}
<motion.div
        whileHover={{ scale: 1.005 }}
        className="relative"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-transparent shadow-2xl hover:shadow-blue-400/20 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 rounded-lg animate-pulse"></div>
          <div className="relative z-10">
            {filteredLeads.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 text-white">
                    <tr>
                      <th className="text-left py-4 px-6 font-black text-sm">👤 LEAD</th>
                      <th className="text-left py-4 px-6 font-black text-sm">🏢 COMPANY</th>
                      <th className="text-left py-4 px-6 font-black text-sm">🌟 SOURCE</th>
                      <th className="text-left py-4 px-6 font-black text-sm">📊 STATUS</th>
                      <th className="text-left py-4 px-6 font-black text-sm">🎯 SCORE</th>
                      <th className="text-left py-4 px-6 font-black text-sm">💰 VALUE</th>
                      <th className="text-left py-4 px-6 font-black text-sm">📅 CREATED</th>
                      <th className="text-left py-4 px-6 font-black text-sm">⚡ ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.map((lead, index) => (
                      <motion.tr
                        key={lead.Id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                        whileHover={{ 
                          scale: 1.01,
                          backgroundColor: "rgba(59, 130, 246, 0.1)",
                          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
                        }}
                        className={`border-b-2 border-gradient-to-r from-blue-100 to-purple-100 transition-all duration-300 cursor-pointer ${
                          index % 2 === 0 ? 'bg-white/80' : 'bg-gradient-to-r from-blue-50/50 to-purple-50/50'
                        }`}
                      >
                        <td className="py-4 px-6">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="font-black text-gray-900 text-base">{lead.name}</div>
                            <div className="text-sm font-semibold text-blue-600">{lead.email}</div>
                            <div className="text-sm font-medium text-purple-600">{lead.phone}</div>
                          </motion.div>
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-800">{lead.company}</td>
                        <td className="py-4 px-6">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                          >
                            <Badge 
                              variant="primary" 
                              size="sm"
                              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white border-0 shadow-md font-bold"
                            >
                              ⭐ {lead.source}
                            </Badge>
                          </motion.div>
                        </td>
                        <td className="py-4 px-6">
                          <motion.div
                            whileHover={{ scale: 1.1, y: -2 }}
                          >
                            <Badge 
                              variant={getStatusBadge(lead.status)} 
                              size="sm"
                              className={`${
                                lead.status === 'new' ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                                lead.status === 'contacted' ? 'bg-gradient-to-r from-orange-400 to-yellow-500' :
                                lead.status === 'qualified' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                'bg-gradient-to-r from-gray-400 to-slate-500'
                              } text-white border-0 shadow-md font-bold`}
                            >
                              🚀 {lead.status}
                            </Badge>
                          </motion.div>
                        </td>
                        <td className="py-4 px-6">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: 10 }}
                          >
                            <Badge 
                              variant={getScoreBadge(lead.score)} 
                              size="sm"
                              className={`${
                                lead.score >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                lead.score >= 60 ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                                'bg-gradient-to-r from-red-400 to-pink-500'
                              } text-white border-0 shadow-md font-bold`}
                            >
                              🎯 {lead.score}/100
                            </Badge>
                          </motion.div>
                        </td>
                        <td className="py-4 px-6 font-black text-lg text-green-600">
                          💰 {formatCurrency(lead.estimatedValue)}
                        </td>
                        <td className="py-4 px-6 text-gray-700 text-sm font-semibold">
                          📅 {formatDate(lead.createdAt)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {lead.status === 'qualified' && (
                              <motion.div
                                whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Button
                                  size="sm"
                                  variant="primary"
                                  icon="ArrowRight"
                                  onClick={() => handleConvertToContact(lead)}
                                  className="text-xs bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-500 hover:to-green-600 text-white border-0 shadow-md font-bold"
                                >
                                  ✨ Convert
                                </Button>
                              </motion.div>
                            )}
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                icon="Edit"
                                onClick={() => toast.info(`Editing ${lead.name}...`)}
                                className="text-xs bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white border-0 shadow-md"
                              />
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: -10 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                icon="Trash2"
                                onClick={() => handleDelete(lead)}
                                className="text-xs bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white border-0 shadow-md"
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
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Leads;