import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const location = useLocation();
  const [searchValue, setSearchValue] = useState("");

const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
    { name: "Leads", href: "/leads", icon: "UserPlus" },
    { name: "Contacts", href: "/contacts", icon: "Users" },
    { name: "Accounts", href: "/accounts", icon: "Building2" },
    { name: "Pipeline", href: "/pipeline", icon: "BarChart3" },
    { name: "Analytics", href: "/analytics", icon: "TrendingUp" },
    { name: "Settings", href: "/settings", icon: "Settings" },
  ];

  const isActive = (href) => location.pathname === href;

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
<Link to="/" className="flex items-center space-x-3">
<div className="w-8 h-8 bg-slate-700 rounded-lg flex items-center justify-center">
                <ApperIcon name="Zap" className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-display font-bold text-slate-800">
                SalesCRM Pro
              </h1>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="relative group"
                >
<div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? "text-slate-700 bg-slate-100"
                      : "text-gray-600 hover:text-slate-700 hover:bg-slate-50"
                  }`}>
                    <ApperIcon name={item.icon} className="w-4 h-4" />
                    <span>{item.name}</span>
                  </div>
                  {isActive(item.href) && (
<motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-4 left-0 right-0 h-0.5 bg-slate-600"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </nav>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
<div className="hidden md:block w-80">
              <SearchBar
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search leads, contacts, deals..."
              />
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" icon="Bell" className="hidden md:flex" />
              <Button variant="primary" icon="Plus" className="hidden md:flex">
                Quick Add
              </Button>
            </div>

            <Button variant="ghost" icon="Bell">
              <span className="sr-only">Notifications</span>
            </Button>

<div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
              <ApperIcon name="User" className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;