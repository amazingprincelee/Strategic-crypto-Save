import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Github, Twitter, MessageCircle, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <footer className="bg-white dark:bg-brandDark-800 border-t border-gray-200 dark:border-brandDark-700 mt-auto">
      <div className={`${isAuthenticated ? 'ml-64' : ''} transition-all duration-300`}>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/images/logo.png" 
                alt="Strategic Crypto Save" 
                className="w-8 h-8 object-contain"
              />
              <span className="text-xl font-bold text-brandDark-600 dark:text-white">
                Strategic Crypto Save
              </span>
            </div>
            <p className="text-brandDark-600 dark:text-gray-400 mb-4 max-w-md">
              A decentralized savings platform that helps you build wealth through strategic cryptocurrency investments with time-locked vaults.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://github.com" 
                className="text-brandDark-600 dark:text-gray-400 hover:text-brandDark-800 dark:hover:text-white transition-colors duration-200"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                className="text-brandDark-600 dark:text-gray-400 hover:text-brandDark-800 dark:hover:text-white transition-colors duration-200"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://discord.com" 
                className="text-brandDark-600 dark:text-gray-400 hover:text-brandDark-800 dark:hover:text-white transition-colors duration-200"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a 
                href="https://strategiccryptosave.com" 
                className="text-brandDark-600 dark:text-gray-400 hover:text-brandDark-800 dark:hover:text-white transition-colors duration-200"
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-brandDark-600 dark:text-white uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-3">
                <li>
                  <Link 
                    to="/dashboard" 
                    className="text-brandDark-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/vaults" 
                    className="text-brandDark-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Vaults
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/create-vault" 
                    className="text-brandDark-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Create Vault
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile" 
                    className="text-brandDark-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold text-brandDark-600 dark:text-white uppercase tracking-wider mb-4">
              Resources
            </h3>
            <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className="text-brandDark-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-brandDark-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Support
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-brandDark-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-brandDark-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
                  >
                    Terms of Service
                  </a>
                </li>
              </ul>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-brandDark-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-brandDark-500 dark:text-gray-400 text-sm">
              © {currentYear} Strategic Crypto Save. All rights reserved.
            </p>
            <p className="text-brandDark-500 dark:text-gray-400 text-sm mt-2 md:mt-0">
              Built with ❤️ for the DeFi community
            </p>
          </div>
        </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;