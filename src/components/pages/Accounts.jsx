import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { AccountsService } from "@/services/api/accountsService";
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

const Accounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [healthFilter, setHealthFilter] = useState("all");

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await AccountsService.getAll();
      setAccounts(data);
    } catch (err) {
      setError("Failed to load accounts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (account) => {
    if (!window.confirm(`Are you sure you want to delete ${account.name}?`)) return;

    try {
      await AccountsService.delete(account.Id);
      setAccounts(prev => prev.filter(a => a.Id !== account.Id));
      toast.success("Account deleted successfully");
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  const handleEdit = (account) => {
    toast.info(`Editing ${account.name}...`);
  };

  const handleCreateOpportunity = (account) => {
    toast.info(`Creating opportunity for ${account.name}...`);
  };

  const getHealthBadge = (health) => {
    const variants = {
      'excellent': 'success',
      'good': 'warning',
      'poor': 'error',
      'critical': 'error'
    };
    return variants[health] || 'primary';
  };

  const getHealthIcon = (health) => {
    const icons = {
      'excellent': 'TrendingUp',
      'good': 'Minus',
      'poor': 'TrendingDown',
      'critical': 'AlertTriangle'
    };
    return icons[health] || 'Minus';
  };

  const filteredAccounts = accounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.industry.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.website.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || account.type === typeFilter;
    const matchesHealth = healthFilter === 'all' || account.health === healthFilter;
    
    return matchesSearch && matchesType && matchesHealth;
  });

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'enterprise', label: 'Enterprise' },
    { value: 'mid-market', label: 'Mid-Market' },
    { value: 'small-business', label: 'Small Business' },
    { value: 'startup', label: 'Startup' }
  ];

  const healthOptions = [
    { value: 'all', label: 'All Health' },
    { value: 'excellent', label: 'Excellent' },
    { value: 'good', label: 'Good' },
    { value: 'poor', label: 'Poor' },
    { value: 'critical', label: 'Critical' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadAccounts} />;

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
            Accounts Management
          </motion.h1>
          <motion.p 
            className="text-lg font-medium text-slate-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Manage your company accounts and business relationships.
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
              icon="BarChart3"
              className="bg-slate-100 text-slate-700 hover:bg-slate-200 border-0 shadow-sm"
            >
              Reports
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
              Add Account
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
                placeholder="Search accounts by name, industry, or website..."
                className="bg-white border border-slate-300 shadow-sm focus:shadow-md focus:border-slate-400 transition-all duration-200"
              />
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.01 }}
            >
              <FilterBar
                filters={[
                  {
                    label: "Type",
                    value: typeFilter,
                    onChange: setTypeFilter,
                    options: typeOptions
                  },
                  {
                    label: "Health",
                    value: healthFilter,
                    onChange: setHealthFilter,
                    options: healthOptions
                  }
                ]}
                className="bg-white border border-slate-300 shadow-sm"
              />
            </motion.div>
          </div>
        </Card>
      </motion.div>

      {/* Account Stats */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 text-center bg-green-50 border border-green-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-green-700 mb-2">
              {accounts.filter(a => a.health === 'excellent').length}
            </div>
            <div className="text-green-600 font-medium text-lg">Excellent Health</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 text-center bg-orange-50 border border-orange-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-orange-700 mb-2">
              {accounts.filter(a => a.health === 'good').length}
            </div>
            <div className="text-orange-600 font-medium text-lg">Good Health</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 text-center bg-red-50 border border-red-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-4xl font-bold text-red-700 mb-2">
              {accounts.filter(a => a.health === 'poor' || a.health === 'critical').length}
            </div>
            <div className="text-red-600 font-medium text-lg">At Risk</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="p-6 text-center bg-slate-50 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
            <div className="text-2xl font-bold text-slate-800 mb-2">
              {formatCurrency(accounts.reduce((sum, account) => sum + account.totalRevenue, 0))}
            </div>
            <div className="text-slate-600 font-medium text-lg">Total Revenue</div>
          </Card>
        </motion.div>
      </div>

      {/* Accounts List */}
<motion.div
        whileHover={{ scale: 1.001 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="overflow-hidden bg-white border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300">
          {filteredAccounts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">ACCOUNT</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">TYPE</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">INDUSTRY</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">HEALTH</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">CONTACTS</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">REVENUE</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">LAST ACTIVITY</th>
                    <th className="text-left py-4 px-6 font-semibold text-sm text-slate-700">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAccounts.map((account, index) => (
                    <motion.tr
                      key={account.Id}
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
                          <div className="font-semibold text-gray-900 text-base">{account.name}</div>
                          <div className="text-sm font-medium text-slate-600">{account.website}</div>
                          <div className="text-sm font-medium text-slate-600">{account.location}</div>
                        </motion.div>
                      </td>
                      <td className="py-4 px-6">
                        <Badge variant="primary" size="sm">
                          {account.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-800">{account.industry}</td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <ApperIcon 
                            name={getHealthIcon(account.health)} 
                            className={`w-5 h-5 ${
                              account.health === 'excellent' ? 'text-green-600' :
                              account.health === 'good' ? 'text-orange-600' :
                              'text-red-600'
                            }`} 
                          />
                          <Badge variant={getHealthBadge(account.health)} size="sm">
                            {account.health}
                          </Badge>
                        </div>
                      </td>
                      <td className="py-4 px-6 font-medium text-gray-700">{account.contactCount}</td>
                      <td className="py-4 px-6 font-semibold text-lg text-green-600">
                        {formatCurrency(account.totalRevenue)}
                      </td>
                      <td className="py-4 px-6 text-gray-700 text-sm font-medium">
                        {formatDate(account.lastActivity)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              icon="Plus"
                              onClick={() => handleCreateOpportunity(account)}
                              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 border-0 shadow-sm"
                            >
                              Opportunity
                            </Button>
                          </motion.div>
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              icon="Edit"
                              onClick={() => handleEdit(account)}
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
                              onClick={() => handleDelete(account)}
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
                icon="Building2"
                title="🏢 No accounts found"
                description={searchTerm ? "🔍 No accounts match your search criteria." : "🚀 Add your first account to start managing business relationships."}
actionText="✨ Add Account"
              />
            )}
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Accounts;