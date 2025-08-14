import React, { useContext } from 'react';
import { useSelector } from 'react-redux';
import { AuthContext } from '../../App';
import Button from './Button';
import ApperIcon from '../ApperIcon';

const LogoutButton = () => {
  const { logout } = useContext(AuthContext);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="w-8 h-8 bg-slate-400 rounded-full flex items-center justify-center">
        <ApperIcon name="User" className="w-4 h-4 text-white" />
      </div>
    );
  }

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.emailAddress) {
      return user.emailAddress[0].toUpperCase();
    }
    return 'U';
  };

  const getName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.emailAddress) {
      return user.emailAddress;
    }
    return 'User';
  };

  return (
    <div className="flex items-center gap-3">
      <div className="hidden md:flex flex-col items-end">
        <span className="text-sm font-medium text-gray-900">{getName()}</span>
        <span className="text-xs text-gray-500">{user?.emailAddress}</span>
      </div>
      <div className="w-8 h-8 bg-gradient-to-r from-primary to-primary-dark rounded-full flex items-center justify-center text-white font-semibold text-sm">
        {getInitials()}
      </div>
      <Button 
        variant="ghost" 
        icon="LogOut" 
        onClick={handleLogout}
        className="text-gray-600 hover:text-red-600"
        title="Logout"
      >
        <span className="sr-only">Logout</span>
      </Button>
    </div>
  );
};

export default LogoutButton;