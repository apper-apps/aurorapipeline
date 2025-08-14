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
import { AccountsService } from "@/services/api/accountsService";
import { formatDate, formatCurrency } from "@/utils/formatters";

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Accounts Management</h1>
          <p className="text-gray-600 mt-2">Manage your company accounts and business relationships</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" icon="Download">
            Export
          </Button>
          <Button variant="ghost" icon="BarChart3">
            Reports
          </Button>
          <Button variant="primary" icon="Plus">
            Add Account
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
              placeholder="Search accounts by name, industry, or website..."
            />
          </div>
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
          />
        </div>
      </Card>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {accounts.filter(a => a.health === 'excellent').length}
          </div>
          <div className="text-gray-600">Excellent Health</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {accounts.filter(a => a.health === 'good').length}
          </div>
          <div className="text-gray-600">Good Health</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {accounts.filter(a => a.health === 'poor' || a.health === 'critical').length}
          </div>
          <div className="text-gray-600">At Risk</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {formatCurrency(accounts.reduce((sum, account) => sum + account.totalRevenue, 0))}
          </div>
          <div className="text-gray-600">Total Revenue</div>
        </Card>
      </div>

      {/* Accounts List */}
      <Card className="overflow-hidden">
        {filteredAccounts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Account</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Type</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Industry</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Health</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Contacts</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Revenue</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Last Activity</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account, index) => (
                  <motion.tr
                    key={account.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`border-b border-gray-100 hover:bg-gradient-to-r hover:from-primary-50 hover:to-secondary-50 transition-all duration-200 ${
                      index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="py-4 px-6">
                      <div>
                        <div className="font-medium text-gray-900">{account.name}</div>
                        <div className="text-sm text-gray-600">{account.website}</div>
                        <div className="text-sm text-gray-500">{account.location}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="primary" size="sm">
                        {account.type}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{account.industry}</td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <ApperIcon name={getHealthIcon(account.health)} className="w-4 h-4" />
                        <Badge variant={getHealthBadge(account.health)} size="sm">
                          {account.health}
                        </Badge>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-700">{account.contactCount}</td>
                    <td className="py-4 px-6 font-medium text-gray-900">
                      {formatCurrency(account.totalRevenue)}
                    </td>
                    <td className="py-4 px-6 text-gray-600 text-sm">
                      {formatDate(account.lastActivity)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          icon="Plus"
                          onClick={() => handleCreateOpportunity(account)}
                          className="text-xs"
                        >
                          Opportunity
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          icon="Edit"
                          onClick={() => handleEdit(account)}
                          className="text-xs"
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          icon="Trash2"
                          onClick={() => handleDelete(account)}
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
            icon="Building2"
            title="No accounts found"
            description={searchTerm ? "No accounts match your search criteria." : "Add your first account to start managing business relationships."}
            actionText="Add Account"
          />
        )}
      </Card>
    </div>
  );
};

export default Accounts;