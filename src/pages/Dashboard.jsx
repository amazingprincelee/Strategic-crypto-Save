import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  PlusCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { dashboardAPI, vaultAPI } from '../services/api';

const Dashboard = () => {
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const formattedBalance = balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH';

  // Fetch dashboard data
  const { data: dashboardData, isLoading: isDashboardLoading, error: dashboardError } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardAPI.getDashboard(),
    select: (response) => response.data.data,
  });

  // Fetch vaults data
  const { data: vaultsData, isLoading: isVaultsLoading } = useQuery({
    queryKey: ['vaults'],
    queryFn: () => vaultAPI.getAll({ limit: 3 }),
    select: (response) => response.data.vaults || [],
  });

  // Loading state
  if (isDashboardLoading || isVaultsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary-600" />
          <span className="text-gray-600 dark:text-gray-400">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Error state
  if (dashboardError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-2">Failed to load dashboard data</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentVaults = vaultsData || [];
  const recentTransactions = dashboardData?.recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
            Welcome back! Here's an overview of your crypto savings.
          </p>
        </div>
        <div className="flex-shrink-0">
           <Link
             to="/create-vault"
             className="btn-primary w-full sm:w-auto"
           >
             <PlusCircle className="w-5 h-5" />
             <span>Create Vault</span>
           </Link>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                Total Invested
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${stats.totalInvested?.toLocaleString() || '0'}
              </p>
              <p className="text-xs sm:text-sm mt-1 text-green-600">
                +12.5% this month
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-full bg-primary-500 flex-shrink-0">
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                Active Vaults
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.activeVaults}
              </p>
              <p className="text-xs sm:text-sm mt-1 text-green-600">
                +1 this week
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-full bg-secondary-500 flex-shrink-0">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                Portfolio Value
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                ${stats.portfolioValue?.toLocaleString() || '0'}
              </p>
              <p className="text-xs sm:text-sm mt-1 text-blue-600">
                Secured in vaults
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-full bg-accent-500 flex-shrink-0">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                Total Investments
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalInvestments || 0}
              </p>
              <p className="text-xs sm:text-sm mt-1 text-orange-600">
                All time
              </p>
            </div>
            <div className="p-2 sm:p-3 rounded-full bg-orange-500 flex-shrink-0">
              <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Wallet Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Connected Address
            </p>
            <p className="text-gray-900 dark:text-white font-mono text-sm">
              {address}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              ETH Balance
            </p>
            <p className="text-gray-900 dark:text-white font-semibold">
              {formattedBalance} ETH
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Overview and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Portfolio Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Portfolio Overview
            </h3>
            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Total Value</span>
              <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                ${stats.portfolioValue?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Total Returns</span>
              <span className="text-sm sm:text-base font-semibold text-green-600">
                ${stats.totalReturns?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm sm:text-base text-gray-600 dark:text-gray-400">Active Vaults</span>
              <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
                {stats.activeVaults || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h3>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Vault Deposit</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-green-600 flex-shrink-0">+$500.00</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-medium text-gray-900 dark:text-white truncate">Vault Created</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                </div>
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400 flex-shrink-0">Emergency Fund</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Vaults */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Vaults
            </h2>
            <Link
              to="/vaults"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentVaults.length > 0 ? recentVaults.map((vault) => (
              <div
                key={vault._id || vault.vaultId}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-brandDark-700 rounded-lg"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Vault #{vault.vaultId}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {vault.tokenSymbol} • {vault.lockDurationDays} days • {vault.status}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {parseFloat(vault.balance || 0).toFixed(4)} {vault.tokenSymbol}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    vault.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    vault.status === 'unlocked' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {vault.status}
                  </span>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">No vaults yet</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Create your first vault to start saving</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recent Transactions
            </h2>
            <Link
              to="/transactions"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? recentTransactions.map((transaction, index) => (
              <div
                key={transaction._id || index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-brandDark-700 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.status === 'active' 
                      ? 'bg-green-100 dark:bg-green-900' 
                      : 'bg-blue-100 dark:bg-blue-900'
                  }`}>
                    <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Investment #{transaction.vaultId || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {transaction.amount ? `$${parseFloat(transaction.amount).toLocaleString()}` : 'Amount N/A'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {transaction.status || 'pending'}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'Date N/A'}
                  </p>
                </div>
              </div>
            )) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 mb-2">No recent activity</p>
                <p className="text-sm text-gray-500 dark:text-gray-500">Your investment activity will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;