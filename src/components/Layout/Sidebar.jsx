import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Shield, 
  User, 
  BarChart3,
  Settings,
  HelpCircle,
  TrendingUp,
  X
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Arbitrage',
      href: '/arbitrage',
      icon: TrendingUp,
      badge: 'New'
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
    <>
      {/* MOBILE: Dark overlay when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 
          bg-white dark:bg-brandDark-800 
          border-r border-gray-200 dark:border-brandDark-700 
          overflow-y-auto z-50
          transition-transform duration-300 ease-in-out
          
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* MOBILE: Close button (only visible on mobile) */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-brandDark-700 lg:hidden">
          <span className="text-lg font-semibold text-gray-900 dark:text-white">
            Menu
          </span>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-brandDark-700 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose} // Close sidebar on mobile when clicking a link
                className={`
                  flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium 
                  transition-colors
                  ${active
                    ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
                    : 'text-brandDark-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-brandDark-700 hover:text-brandDark-700 dark:hover:text-gray-200'
                  }
                `}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </div>
                {item.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold text-white bg-green-600 rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Quick Stats */}
        <div className="p-4 mx-4 mt-4 border-t border-gray-200 dark:border-brandDark-700">
          <h3 className="mb-3 text-xs font-semibold tracking-wider text-gray-500 uppercase dark:text-gray-400">
            Quick Stats
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Total Saved</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">$0.00</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Vaults</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Opportunities</span>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">0</span>
            </div>
          </div>
        </div>

        {/* Version Info */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="text-xs text-center text-gray-500 dark:text-gray-400">
            v1.0.0 Beta
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;