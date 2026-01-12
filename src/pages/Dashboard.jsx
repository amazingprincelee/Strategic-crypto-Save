import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusCircle,
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRightLeft,
  Loader2,
  TrendingDown,
  Wallet,
  ExternalLink,
  Zap,
  BarChart3,
  Shield,
  ChevronRight
} from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { fetchDashboard, fetchVaults } from '../redux/slices/dashboardSlice';
import { fetchArbitrageOpportunities } from '../redux/slices/arbitrageslice';
import ConnectButton from '../components/Web3/ConnectButton';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({ address });
  const formattedBalance = balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH';

  // Get data from Redux stores
  const { stats, recentActivity, vaults, loading: dashboardLoading, error } = useSelector((state) => state.dashboard);
  const { opportunities, loading: arbitrageLoading } = useSelector((state) => state.arbitrage || { opportunities: [], loading: {} });

  const [activeTab, setActiveTab] = useState('overview'); // overview, vaults, arbitrage

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchVaults({ limit: 3 }));
    dispatch(fetchArbitrageOpportunities({ minProfit: 0.1, minVolume: 100, topCoins: 10 }));
  }, [dispatch]);

  // Loading state
  if (dashboardLoading.dashboard || dashboardLoading.vaults) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  const recentVaults = vaults || [];
  const topOpportunities = (opportunities || []).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
            Manage your crypto savings and discover arbitrage opportunities
          </p>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Portfolio Value */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio Value</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.portfolioValue?.toLocaleString() || '0'}
              </p>
              <p className="mt-1 text-xs text-green-600">+12.5% this month</p>
            </div>
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20">
              <DollarSign className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        {/* Active Vaults */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Active Vaults</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {stats.activeVaults || 0}
              </p>
              <p className="mt-1 text-xs text-blue-600">Earning rewards</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
              <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        {/* Arbitrage Opportunities */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Live Opportunities</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                {opportunities?.length || 0}
              </p>
              <p className="mt-1 text-xs text-green-600">
                {opportunities?.length > 0 ? `Best: ${opportunities[0]?.profitMargin?.toFixed(2)}%` : 'Scanning...'}
              </p>
            </div>
            <div className="relative p-3 bg-green-100 rounded-full dark:bg-green-900/20">
              <ArrowRightLeft className="w-6 h-6 text-green-600 dark:text-green-400" />
              {arbitrageLoading.opportunities && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 text-green-600 animate-spin" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Total Returns */}
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Returns</p>
              <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalReturns?.toLocaleString() || '0'}
              </p>
              <p className="mt-1 text-xs text-purple-600">All time</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900/20">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content: Two Column Layout */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* LEFT: Vaults Section */}
        <div className="space-y-4">
          {/* Wallet Connection Card */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Wallet
                </h3>
              </div>
              {isConnected && (
                <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Connected
                </span>
              )}
            </div>

            {isConnected ? (
              <div className="space-y-3">
                <div>
                  <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Address</p>
                  <p className="font-mono text-xs text-gray-900 break-all dark:text-white">
                    {address}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-sm text-gray-600 dark:text-gray-400">Balance</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {formattedBalance}
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Connect your wallet to create vaults and start earning
                </p>
                <ConnectButton isAuthenticated={true} />
              </div>
            )}
          </div>

          {/* Your Vaults */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Your Vaults
              </h3>
              <Link to="/create-vault" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Create New
              </Link>
            </div>

            {recentVaults.length > 0 ? (
              <div className="space-y-3">
                {recentVaults.map((vault) => (
                  <Link
                    key={vault._id}
                    to={`/vault/${vault._id}`}
                    className="block p-4 transition-all border border-gray-200 rounded-lg hover:border-primary-500 hover:shadow-md dark:border-gray-700"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {vault.name || 'Unnamed Vault'}
                      </h4>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">Amount</p>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${vault.amount?.toLocaleString() || '0'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">APY</p>
                        <p className="font-semibold text-green-600">
                          {vault.apy || '5.0'}%
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
                <Link
                  to="/dashboard"
                  className="flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  View All Vaults
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center">
                <Shield className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  No vaults yet. Create your first vault to start earning!
                </p>
                <Link to="/create-vault" className="btn-primary">
                  <PlusCircle className="w-4 h-4" />
                  Create Vault
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Arbitrage Section */}
        <div className="space-y-4">
          {/* Arbitrage Overview */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <div className="absolute w-3 h-3 bg-green-500 rounded-full -top-1 -right-1 animate-pulse"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Live Arbitrage
                </h3>
              </div>
              <Link to="/arbitrage" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
                View All
              </Link>
            </div>

            <div className="p-4 mb-4 border-l-4 border-blue-500 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>💡 Real-time opportunities</strong> from 50+ exchanges powered by CoinGecko API
              </p>
            </div>

            {/* Top Opportunities */}
            {arbitrageLoading.opportunities ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 mx-auto mb-2 animate-spin text-primary-600" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">Scanning markets...</p>
                </div>
              </div>
            ) : topOpportunities.length > 0 ? (
              <div className="space-y-3">
                {topOpportunities.map((opp, index) => (
                  <div
                    key={opp.id || index}
                    className={`p-4 border rounded-lg ${
                      index === 0
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/10'
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center w-8 h-8 font-bold text-white rounded-full bg-gradient-to-br from-primary-500 to-secondary-500">
                          {opp.coin?.charAt(0)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{opp.coin}</h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">{opp.coinName}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center px-2 py-1 text-sm font-bold text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-300">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {opp.profitMargin?.toFixed(2)}%
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <span className="px-2 py-1 bg-blue-100 rounded dark:bg-blue-900">{opp.buyExchange}</span>
                      <ArrowRightLeft className="w-3 h-3" />
                      <span className="px-2 py-1 bg-purple-100 rounded dark:bg-purple-900">{opp.sellExchange}</span>
                    </div>
                  </div>
                ))}
                <Link
                  to="/arbitrage"
                  className="flex items-center justify-center gap-2 py-2 text-sm font-medium transition-colors text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                  View All Opportunities
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            ) : (
              <div className="py-8 text-center">
                <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                  No opportunities found
                </p>
                <Link to="/arbitrage" className="text-sm font-medium text-primary-600 hover:text-primary-700">
                  Adjust settings →
                </Link>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Activity
                </h3>
              </div>
            </div>

            {recentActivity && recentActivity.length > 0 ? (
              <div className="space-y-3">
                {recentActivity.slice(0, 3).map((activity, index) => (
                  <div key={activity._id || index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg dark:border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full dark:bg-green-900">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.type || 'Transaction'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.createdAt ? new Date(activity.createdAt).toLocaleString() : 'Recent'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      {activity.amount ? `$${parseFloat(activity.amount).toLocaleString()}` : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link to="/create-vault" className="block card hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20">
              <PlusCircle className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Create Vault</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Start earning rewards</p>
            </div>
          </div>
        </Link>

        <Link to="/arbitrage" className="block card hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900/20">
              <ArrowRightLeft className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">Scan Arbitrage</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Find opportunities</p>
            </div>
          </div>
        </Link>

        <Link to="/profile" className="block card hover:shadow-lg">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/20">
              <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">View Analytics</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track performance</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;