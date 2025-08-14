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
            className="text-4xl font-display font-black bg-gradient-to-r from-orange-500 via-red-500 via-pink-500 to-purple-500 bg-clip-text text-transparent animate-pulse"
            animate={{ 
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
            }}
            transition={{ 
              duration: 3.5, 
              repeat: Infinity,
              ease: "linear"
            }}
            style={{
              backgroundSize: "250% 250%"
            }}
          >
            🏢 Accounts Management 🏢
          </motion.h1>
          <motion.p 
            className="text-lg font-semibold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            🚀 Manage your company accounts and EPIC business relationships! 💼
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
              className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white hover:from-indigo-500 hover:to-purple-600 border-0 shadow-lg hover:shadow-indigo-400/50 font-bold"
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
              icon="BarChart3"
              className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white hover:from-cyan-500 hover:to-blue-600 border-0 shadow-lg hover:shadow-cyan-400/50 font-bold"
            >
              📈 Reports
            </Button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.15, rotate: [0, -10, 10, 0] }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ["0 0 20px rgba(249, 115, 22, 0.3)", "0 0 40px rgba(249, 115, 22, 0.6)", "0 0 20px rgba(249, 115, 22, 0.3)"]
            }}
            transition={{ 
              boxShadow: { duration: 2, repeat: Infinity }
            }}
          >
            <Button 
              variant="primary" 
              icon="Plus"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-lg hover:shadow-orange-400/50 font-bold"
            >
              ✨ Add Account
            </Button>
          </motion.div>
</div>
      </motion.div>

      {/* Search and Filters */}
<motion.div
        whileHover={{ scale: 1.01 }}
        className="relative"
      >
        <Card className="p-6 bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 border-2 border-transparent shadow-xl hover:shadow-orange-400/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-lg blur-sm opacity-10 animate-pulse"></div>
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row gap-4">
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
              >
                <SearchBar
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="🔍 Search accounts by name, industry, or website..."
                  className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg focus:shadow-xl focus:border-orange-300 transition-all duration-300"
                />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
              >
                <FilterBar
                  filters={[
                    {
                      label: "🏢 Type",
                      value: typeFilter,
                      onChange: setTypeFilter,
                      options: typeOptions
                    },
                    {
                      label: "❤️ Health",
                      value: healthFilter,
                      onChange: setHealthFilter,
                      options: healthOptions
                    }
                  ]}
                  className="bg-white/80 backdrop-blur-sm border-2 border-white/50 shadow-lg"
                />
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Account Stats */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          whileHover={{ scale: 1.08, rotate: [0, 2, -2, 0] }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(34, 197, 94, 0.3)", "0 0 40px rgba(34, 197, 94, 0.6)", "0 0 20px rgba(34, 197, 94, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 2, repeat: Infinity }
          }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 text-white shadow-2xl hover:shadow-green-400/50 border-0">
            <motion.div 
              className="text-4xl font-black mb-2"
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              💚 {accounts.filter(a => a.health === 'excellent').length}
            </motion.div>
            <div className="text-white/90 font-bold text-lg">🌟 Excellent Health</div>
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
              animate={{ scale: [1, 1.2, 1], y: [0, -5, 5, 0] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              🧡 {accounts.filter(a => a.health === 'good').length}
            </motion.div>
            <div className="text-white/90 font-bold text-lg">👍 Good Health</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, y: -5 }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(239, 68, 68, 0.3)", "0 0 40px rgba(239, 68, 68, 0.6)", "0 0 20px rgba(239, 68, 68, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 3, repeat: Infinity }
          }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-red-400 via-rose-500 to-pink-500 text-white shadow-2xl hover:shadow-red-400/50 border-0">
            <motion.div 
              className="text-4xl font-black mb-2"
              animate={{ scale: [1, 1.3, 1], x: [0, -3, 3, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            >
              🚨 {accounts.filter(a => a.health === 'poor' || a.health === 'critical').length}
            </motion.div>
            <div className="text-white/90 font-bold text-lg">⚠️ At Risk</div>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.08, rotate: [0, 5, -5, 0] }}
          animate={{ 
            boxShadow: ["0 0 20px rgba(59, 130, 246, 0.3)", "0 0 40px rgba(59, 130, 246, 0.6)", "0 0 20px rgba(59, 130, 246, 0.3)"]
          }}
          transition={{ 
            boxShadow: { duration: 2.3, repeat: Infinity }
          }}
        >
          <Card className="p-6 text-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-500 text-white shadow-2xl hover:shadow-blue-400/50 border-0">
            <motion.div 
              className="text-2xl font-black mb-2"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2.5, repeat: Infinity }}
            >
              💰 {formatCurrency(accounts.reduce((sum, account) => sum + account.totalRevenue, 0))}
            </motion.div>
            <div className="text-white/90 font-bold text-lg">💵 Total Revenue</div>
          </Card>
        </motion.div>
      </div>

      {/* Accounts List */}
<motion.div
        whileHover={{ scale: 1.005 }}
        className="relative"
      >
        <Card className="overflow-hidden bg-gradient-to-br from-white via-orange-50/30 to-pink-50/30 border-2 border-transparent shadow-2xl hover:shadow-orange-400/20 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 via-red-500/5 to-pink-500/5 rounded-lg animate-pulse"></div>
          <div className="relative z-10">
            {filteredAccounts.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-orange-400 via-red-500 to-pink-500 text-white">
                    <tr>
                      <th className="text-left py-4 px-6 font-black text-sm">🏢 ACCOUNT</th>
                      <th className="text-left py-4 px-6 font-black text-sm">🏷️ TYPE</th>
                      <th className="text-left py-4 px-6 font-black text-sm">🏭 INDUSTRY</th>
                      <th className="text-left py-4 px-6 font-black text-sm">❤️ HEALTH</th>
                      <th className="text-left py-4 px-6 font-black text-sm">👥 CONTACTS</th>
                      <th className="text-left py-4 px-6 font-black text-sm">💰 REVENUE</th>
                      <th className="text-left py-4 px-6 font-black text-sm">📅 LAST ACTIVITY</th>
                      <th className="text-left py-4 px-6 font-black text-sm">⚡ ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account, index) => (
                      <motion.tr
                        key={account.Id}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: index * 0.05, type: "spring", stiffness: 100 }}
                        whileHover={{ 
                          scale: 1.01,
                          backgroundColor: "rgba(249, 115, 22, 0.1)",
                          boxShadow: "0 5px 15px rgba(0, 0, 0, 0.1)"
                        }}
                        className={`border-b-2 border-gradient-to-r from-orange-100 to-pink-100 transition-all duration-300 cursor-pointer ${
                          index % 2 === 0 ? 'bg-white/80' : 'bg-gradient-to-r from-orange-50/50 to-pink-50/50'
                        }`}
                      >
                        <td className="py-4 px-6">
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                          >
                            <div className="font-black text-gray-900 text-base">{account.name}</div>
                            <div className="text-sm font-semibold text-orange-600">{account.website}</div>
                            <div className="text-sm font-medium text-pink-600">{account.location}</div>
                          </motion.div>
                        </td>
                        <td className="py-4 px-6">
                          <motion.div
                            whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                          >
                            <Badge 
                              variant="primary" 
                              size="sm"
                              className="bg-gradient-to-r from-purple-400 to-indigo-500 text-white border-0 shadow-md font-bold"
                            >
                              🏷️ {account.type}
                            </Badge>
                          </motion.div>
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-800">{account.industry}</td>
                        <td className="py-4 px-6">
                          <motion.div 
                            className="flex items-center gap-2"
                            whileHover={{ scale: 1.1 }}
                          >
                            <motion.div
                              animate={{ 
                                rotate: [0, 360],
                                scale: [1, 1.2, 1]
                              }}
                              transition={{ 
                                rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                                scale: { duration: 2, repeat: Infinity }
                              }}
                            >
                              <ApperIcon 
                                name={getHealthIcon(account.health)} 
                                className={`w-5 h-5 ${
                                  account.health === 'excellent' ? 'text-green-500' :
                                  account.health === 'good' ? 'text-orange-500' :
                                  'text-red-500'
                                }`} 
                              />
                            </motion.div>
                            <Badge 
                              variant={getHealthBadge(account.health)} 
                              size="sm"
                              className={`${
                                account.health === 'excellent' ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                account.health === 'good' ? 'bg-gradient-to-r from-orange-400 to-yellow-500' :
                                'bg-gradient-to-r from-red-400 to-pink-500'
                              } text-white border-0 shadow-md font-bold`}
                            >
                              {account.health === 'excellent' ? '💚' : account.health === 'good' ? '🧡' : '❤️'} {account.health}
                            </Badge>
                          </motion.div>
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-700">👥 {account.contactCount}</td>
                        <td className="py-4 px-6 font-black text-lg text-green-600">
                          💰 {formatCurrency(account.totalRevenue)}
                        </td>
                        <td className="py-4 px-6 text-gray-700 text-sm font-semibold">
                          📅 {formatDate(account.lastActivity)}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <motion.div
                              whileHover={{ scale: 1.15, rotate: [0, -5, 5, 0] }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                icon="Plus"
                                onClick={() => handleCreateOpportunity(account)}
                                className="text-xs bg-gradient-to-r from-purple-400 to-indigo-500 hover:from-purple-500 hover:to-indigo-600 text-white border-0 shadow-md font-bold"
                              >
                                ⚡ Opportunity
                              </Button>
                            </motion.div>
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Button
                                size="sm"
                                variant="ghost"
                                icon="Edit"
                                onClick={() => handleEdit(account)}
                                className="text-xs bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-blue-500 hover:to-cyan-600 text-white border-0 shadow-md"
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
                                onClick={() => handleDelete(account)}
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
                icon="Building2"
                title="🏢 No accounts found"
                description={searchTerm ? "🔍 No accounts match your search criteria." : "🚀 Add your first account to start managing business relationships."}
                actionText="✨ Add Account"
              />
            )}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Accounts;