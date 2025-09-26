import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Shield, 
  User, 
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Create Vault',
      href: '/create-vault',
      icon: PlusCircle,
    },
    {
      name: 'My Vaults',
      href: '/vaults',
      icon: Shield,
    },
    {
      name: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
    },
    {
      name: 'Profile',
      href: '/profile',
      icon: User,
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
    },
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
    },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-brandDark-800 border-r border-gray-200 dark:border-brandDark-700 overflow-y-auto">
      <nav className="p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                  : 'text-brandDark-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brandDark-700 hover:text-brandDark-700 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-200 dark:border-brandDark-700 mt-4">
        <h3 className="text-xs font-semibold text-brandDark-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Quick Stats
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-brandDark-600 dark:text-gray-400">Total Saved</span>
            <span className="text-sm font-medium text-brandDark-700 dark:text-white">$0.00</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brandDark-600 dark:text-gray-400">Active Vaults</span>
            <span className="text-sm font-medium text-brandDark-700 dark:text-white">0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-brandDark-600 dark:text-gray-400">Locked Funds</span>
            <span className="text-sm font-medium text-brandDark-700 dark:text-white">$0.00</span>
          </div>
        </div>
      </div>

      {/* Version Info */}
      <div className="absolute bottom-4 left-4 right-4">
        <div className="text-xs text-brandDark-500 dark:text-gray-400 text-center">
          v1.0.0 Beta
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;