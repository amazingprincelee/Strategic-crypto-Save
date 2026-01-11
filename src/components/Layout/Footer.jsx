import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  Github, 
  Twitter, 
  MessageCircle, 
  Mail,
  Shield,
  TrendingUp,
  Lock,
  Zap,
  ChevronUp,
  ExternalLink,
  ArrowUpRight
} from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { token } = useSelector(state => state.auth);
  const isAuthenticated = !!token;
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Show scroll to top button when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative mt-auto bg-white border-t border-gray-200 dark:bg-brandDark-800 dark:border-brandDark-700">
      {/* Main Footer Content */}
      <div className={`transition-all duration-300 ${isAuthenticated ? 'lg:ml-64' : ''}`}>
        <div className="container px-4 py-12 mx-auto max-w-7xl">
          
          {/* Top Section - Grid */}
          <div className="grid grid-cols-1 gap-8 mb-8 sm:grid-cols-2 lg:grid-cols-5">
            
            {/* Brand & Description */}
            <div className="sm:col-span-2">
              <div className="flex items-center mb-4 space-x-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Strategic Save
                </span>
              </div>
              <p className="mb-4 text-sm leading-relaxed text-gray-600 dark:text-gray-400 max-w-sm">
                Secure your crypto future with time-locked vaults and discover profitable arbitrage opportunities across multiple exchanges. Built for the DeFi community.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-3">
                <a 
                  href="https://twitter.com/strategicsave" 
                  className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-brandDark-700 hover:text-primary-600"
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://github.com/strategicsave" 
                  className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-brandDark-700 hover:text-primary-600"
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a 
                  href="https://discord.gg/strategicsave" 
                  className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-brandDark-700 hover:text-primary-600"
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label="Discord"
                >
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a 
                  href="mailto:support@strategicsave.com" 
                  className="p-2 text-gray-600 transition-colors rounded-lg hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-brandDark-700 hover:text-primary-600"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
                Features
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/arbitrage" 
                    className="flex items-center text-sm text-gray-600 transition-colors group hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    <span>Arbitrage Scanner</span>
                    <span className="ml-1 text-xs font-semibold text-green-600">New</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/create-vault" 
                    className="flex items-center text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    <Lock className="w-4 h-4 mr-2 text-blue-500" />
                    <span>Crypto Vaults</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/dashboard" 
                    className="flex items-center text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    <Zap className="w-4 h-4 mr-2 text-yellow-500" />
                    <span>Analytics</span>
                  </Link>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="flex items-center text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    <Shield className="w-4 h-4 mr-2 text-purple-500" />
                    <span>Security Audit</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
                Resources
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="/docs" 
                    className="inline-flex items-center text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    Documentation
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
                <li>
                  <a 
                    href="/api" 
                    className="inline-flex items-center text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    API Reference
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </li>
                <li>
                  <a 
                    href="/blog" 
                    className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a 
                    href="/help" 
                    className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    Help Center
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="mb-4 text-sm font-semibold tracking-wider text-gray-900 uppercase dark:text-white">
                Legal
              </h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="/terms" 
                    className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a 
                    href="/privacy" 
                    className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a 
                    href="/cookies" 
                    className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a 
                    href="/disclaimer" 
                    className="text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  >
                    Risk Disclaimer
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats Bar - Shows platform stats */}
          <div className="grid grid-cols-2 gap-4 py-6 mb-8 border-y border-gray-200 dark:border-brandDark-700 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                $2.5M+
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Total Value Locked
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                1,234+
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Active Vaults
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                150+
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Daily Opportunities
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                9
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                Supported Exchanges
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="flex flex-col items-center justify-between pt-6 space-y-4 sm:flex-row sm:space-y-0">
            <div className="text-sm text-center text-gray-600 dark:text-gray-400 sm:text-left">
              <p>© {currentYear} Strategic Save. All rights reserved.</p>
              <p className="mt-1 text-xs">
                Built with 🚀 for the DeFi community
              </p>
            </div>

            {/* Supported Networks */}
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-600 dark:text-gray-400">Supported on:</span>
              <div className="flex items-center space-x-2">
                <div className="flex items-center px-2 py-1 space-x-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-brandDark-700 dark:text-gray-300">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <span>Ethereum</span>
                </div>
                <div className="flex items-center px-2 py-1 space-x-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-brandDark-700 dark:text-gray-300">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-blue-500"></div>
                  <span>Polygon</span>
                </div>
                <div className="flex items-center px-2 py-1 space-x-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md dark:bg-brandDark-700 dark:text-gray-300">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
                  <span>BSC</span>
                </div>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="p-4 mt-8 text-xs leading-relaxed text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-brandDark-700 dark:border-brandDark-600 dark:text-gray-400">
            <strong className="text-gray-700 dark:text-gray-300">⚠️ Risk Disclaimer:</strong> Cryptocurrency investments carry significant risk. 
            Time-locked vaults are irreversible until maturity. Arbitrage trading involves market, execution, and liquidity risks. 
            Past performance does not guarantee future results. Always DYOR (Do Your Own Research) and never invest more than you can afford to lose.
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className={`
            fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-lg
            bg-primary-600 text-white hover:bg-primary-700
            transition-all duration-300 transform hover:scale-110
            ${isAuthenticated ? 'lg:right-6' : 'right-6'}
          `}
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
};

export default Footer;