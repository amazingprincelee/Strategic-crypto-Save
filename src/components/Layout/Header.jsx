import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Bell, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown, 
  Menu, 
  X,
  Moon,
  Sun
} from 'lucide-react';
import { logout } from '../../store/slices/authSlice';
import { useTheme } from '../../store/useTheme';
import NotificationDropdown from '../Notifications/NotificationDropdown';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { theme, toggleTheme, isDark } = useTheme();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsUserDropdownOpen(false);
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setIsUserDropdownOpen(false);
  };

  return (
    <>
      <header className="bg-white dark:bg-brandDark-900 shadow-lg border-b border-gray-200 dark:border-brandDark-700 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/images/logo.png" 
                alt="Strategic Crypto Save Logo" 
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold text-brandDark-900 dark:text-white">
                Strategic Crypto Save
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {isAuthenticated && (
                <>
                  <Link 
                    to="/dashboard" 
                    className="text-brandDark-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link 
                    to="/create-vault" 
                    className="text-brandDark-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Create Vault
                  </Link>
                </>
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-brandDark-700 transition-colors"
                title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-brandDark-600 dark:text-gray-300" />
                )}
              </button>

              {/* Notifications */}
              {isAuthenticated && <NotificationDropdown />}

              {/* User Profile */}
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-brandDark-700 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  </button>

                  {/* Profile Dropdown */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-brandDark-800 rounded-lg shadow-lg border border-gray-200 dark:border-brandDark-700 py-2">
                      <div className="px-4 py-2 border-b border-gray-200 dark:border-brandDark-700">
                        <p className="text-sm font-medium text-brandDark-900 dark:text-white">
                          {user?.username || user?.email || 'User'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {user?.email}
                        </p>
                      </div>
                      
                      <button
                        onClick={handleProfileClick}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-left text-brandDark-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-brandDark-700 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Profile Settings</span>
                      </button>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-brandDark-700 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-brandDark-700 transition-colors"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5 text-brandDark-600 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-brandDark-600 dark:text-gray-300" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-brandDark-700 py-4">
              <nav className="flex flex-col space-y-2">
                {isAuthenticated && (
                  <>
                    <Link 
                      to="/dashboard" 
                      className="px-4 py-2 text-brandDark-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/create-vault" 
                      className="px-4 py-2 text-brandDark-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Create Vault
                    </Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;