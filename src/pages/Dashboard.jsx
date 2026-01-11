import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  PlusCircle,
  TrendingUp,
  DollarSign,
  Clock,
  Shield,
  ArrowDownRight,
  Loader2
} from 'lucide-react';
import { useAccount, useBalance } from 'wagmi';
import { fetchDashboard, fetchVaults } from '../redux/slices/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const formattedBalance = balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH';

  // Get data from Redux store
  const { stats, recentActivity, vaults, loading, error } = useSelector((state) => state.dashboard);

  // Fetch dashboard data on mount
  useEffect(() => {
    dispatch(fetchDashboard());
    dispatch(fetchVaults({ limit: 3 }));
  }, [dispatch]);

  // Loading state
  if (loading.dashboard || loading.vaults) {
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
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="mb-2 text-red-600 dark:text-red-400">Failed to load dashboard data</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  const recentVaults = vaults || [];
  const recentTransactions = recentActivity || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col mb-6 sm:flex-row sm:items-center sm:justify-between sm:mb-8">
        <div className="mb-4 sm:mb-0">
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-600 sm:text-base dark:text-gray-400 sm:mt-2">
            Welcome back! Here's an overview of your crypto savings.
          </p>
        </div>
        <div className="flex-shrink-0">
           <Link
             to="/create-vault"
             className="w-full btn-primary sm:w-auto"
           >
             <PlusCircle className="w-5 h-5" />
             <span>Create Vault</span>
           </Link>
         </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 truncate sm:text-sm dark:text-gray-400">
                Total Invested
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                ${stats.totalInvested?.toLocaleString() || '0'}
              </p>
              <p className="mt-1 text-xs text-green-600 sm:text-sm">
                +12.5% this month
              </p>
            </div>
            <div className="flex-shrink-0 p-2 rounded-full sm:p-3 bg-primary-500">
              <DollarSign className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 truncate sm:text-sm dark:text-gray-400">
                Active Vaults
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                {stats.activeVaults || 0}
              </p>
              <p className="mt-1 text-xs text-green-600 sm:text-sm">
                +1 this week
              </p>
            </div>
            <div className="flex-shrink-0 p-2 rounded-full sm:p-3 bg-secondary-500">
              <Shield className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 truncate sm:text-sm dark:text-gray-400">
                Portfolio Value
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                ${stats.portfolioValue?.toLocaleString() || '0'}
              </p>
              <p className="mt-1 text-xs text-blue-600 sm:text-sm">
                Secured in vaults
              </p>
            </div>
            <div className="flex-shrink-0 p-2 rounded-full sm:p-3 bg-accent-500">
              <TrendingUp className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-600 truncate sm:text-sm dark:text-gray-400">
                Total Investments
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 sm:text-2xl dark:text-white">
                {stats.totalInvestments || 0}
              </p>
              <p className="mt-1 text-xs text-orange-600 sm:text-sm">
                All time
              </p>
            </div>
            <div className="flex-shrink-0 p-2 bg-orange-500 rounded-full sm:p-3">
              <Clock className="w-5 h-5 text-white sm:w-6 sm:h-6" />
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Info */}
      <div className="card">
        <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
          Wallet Information
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
              Connected Address
            </p>
            <p className="font-mono text-sm text-gray-900 break-all dark:text-white">
              {address || 'Not connected'}
            </p>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
              Balance
            </p>
            <p className="font-semibold text-gray-900 dark:text-white">
              {formattedBalance}
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Overview and Recent Activity */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 sm:gap-6">
        {/* Portfolio Overview */}
        <div className="card">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
              Portfolio Overview
            </h3>
            <TrendingUp className="w-4 h-4 text-green-500 sm:w-5 sm:h-5" />
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 sm:text-base dark:text-gray-400">Total Value</span>
              <span className="text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
                ${stats.portfolioValue?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 sm:text-base dark:text-gray-400">Total Returns</span>
              <span className="text-sm font-semibold text-green-600 sm:text-base">
                ${stats.totalReturns?.toLocaleString() || '0'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 sm:text-base dark:text-gray-400">Active Vaults</span>
              <span className="text-sm font-semibold text-gray-900 sm:text-base dark:text-white">
                {stats.activeVaults || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base font-semibold text-gray-900 sm:text-lg dark:text-white">
              Recent Activity
            </h3>
            <Clock className="w-4 h-4 text-blue-500 sm:w-5 sm:h-5" />
          </div>
          <div className="space-y-3">
            {recentTransactions.length > 0 ? recentTransactions.slice(0, 2).map((transaction, index) => (
              <div key={transaction._id || index} className="flex items-center justify-between">
                <div className="flex items-center flex-1 min-w-0 space-x-2 sm:space-x-3">
                  <div className="flex items-center justify-center flex-shrink-0 bg-green-100 rounded-full w-7 h-7 sm:w-8 sm:h-8 dark:bg-green-900">
                    <ArrowDownRight className="w-3 h-3 text-green-600 sm:w-4 sm:h-4 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate sm:text-sm dark:text-white">
                      {transaction.type || 'Transaction'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'Recent'}
                    </p>
                  </div>
                </div>
                <span className="flex-shrink-0 text-xs font-semibold text-green-600 sm:text-sm">
                  {transaction.amount ? `$${parseFloat(transaction.amount).toLocaleString()}` : 'N/A'}
                </span>
              </div>
            )) : (
              <div className="py-4 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Vaults */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Your Vaults
            </h2>
            <Link
              to="/vaults"
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentVaults.length > 0 ? recentVaults.map((vault) => (
              <div
                key={vault._id || vault.vaultId}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-brandDark-700"
              >
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Vault #{vault.vaultId || vault._id}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {vault.tokenSymbol || 'ETH'} • {vault.lockDurationDays || 0} days • {vault.status || 'active'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {parseFloat(vault.balance || 0).toFixed(4)} {vault.tokenSymbol || 'ETH'}
                  </p>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                    vault.status === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    vault.status === 'unlocked' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                  }`}>
                    {vault.status || 'active'}
                  </span>
                </div>
              </div>
            )) : (
              <div className="py-8 text-center">
                <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-2 text-gray-600 dark:text-gray-400">No vaults yet</p>
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
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {recentTransactions.length > 0 ? recentTransactions.map((transaction, index) => (
              <div
                key={transaction._id || index}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-brandDark-700"
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
                      {transaction.type || 'Investment'} #{transaction.vaultId || 'N/A'}
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
              <div className="py-8 text-center">
                <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="mb-2 text-gray-600 dark:text-gray-400">No recent activity</p>
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