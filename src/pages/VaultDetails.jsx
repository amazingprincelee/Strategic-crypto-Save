import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Clock,
  Unlock,
  Download,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { vaultDetailsAPI } from '../services/api';
import { useWallet } from '../contexts/WalletContext';

const VaultDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { account } = useWallet();
  const queryClient = useQueryClient();
  // Fetch vault details
  const { data: vaultData, isLoading: vaultLoading, error: vaultError } = useQuery({
    queryKey: ['vault', id],
    queryFn: () => vaultDetailsAPI.getById(id),
    enabled: !!id,
  });

  // Fetch user vault stats for additional transaction data
  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['vaultStats', account],
    queryFn: () => vaultDetailsAPI.getUserStats(account),
    enabled: !!account,
  });

  const vault = vaultData?.data?.vault;
  const recentActivity = statsData?.data?.recentActivity || [];
  
  // Filter transactions for this specific vault
  const vaultTransactions = recentActivity.filter(activity => 
    activity.vaultId === parseInt(id)
  );

  // Loading state
  if (vaultLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brandPrimary-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading vault details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (vaultError || !vault) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Vault Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The vault you're looking for doesn't exist or you don't have access to it.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const handleWithdraw = async () => {
    if (!vault.isUnlocked) {
      toast.error('Vault is still locked. Cannot withdraw yet.');
      return;
    }

    try {
      setIsWithdrawing(true);
      
      // This would typically involve blockchain interaction
      // For now, we'll show a message that this requires blockchain integration
      toast.info('Withdrawal requires blockchain interaction. This feature will be available when connected to the blockchain.');
      setShowWithdrawModal(false);
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'locked':
        return 'status-locked';
      case 'unlocked':
        return 'status-active';
      case 'withdrawn':
        return 'status-inactive';
      default:
        return 'status-locked';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-brandDark-700 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Vault #{vault.vaultId}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {vault.tokenSymbol} Savings Vault
          </p>
        </div>
        <span className={getStatusColor(vault.status)}>
          {vault.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Vault Overview */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Vault Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Current Balance
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {parseFloat(vault.balance || 0).toFixed(4)} {vault.tokenSymbol}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Deposited
                  </p>
                  <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                    {parseFloat(vault.totalDeposited || 0).toFixed(4)} {vault.tokenSymbol}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Withdrawn
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {parseFloat(vault.totalWithdrawn || 0).toFixed(4)} {vault.tokenSymbol}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Lock Duration
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {vault.lockDurationDays} days
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Status
                  </p>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                    {vault.isUnlocked ? 'Unlocked' : 'Locked'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Days Until Unlock
                  </p>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">
                    {vault.daysUntilUnlock || 0} days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Lock Period Progress
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  Created: {formatDate(vault.createdAt)}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  Unlocks: {formatDate(vault.unlockTime)}
                </span>
              </div>
              
              <div className="w-full bg-gray-200 dark:bg-dark-600 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-brandPrimary-500 to-brandSecondary-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${Math.max(0, Math.min(100, ((vault.lockDurationDays - vault.daysUntilUnlock) / vault.lockDurationDays) * 100))}%` }}
                />
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.max(0, Math.min(100, ((vault.lockDurationDays - vault.daysUntilUnlock) / vault.lockDurationDays) * 100)).toFixed(1)}% Complete
                </p>
              </div>
            </div>
          </div>

          {/* Transaction History */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Transaction History
            </h3>
            
            <div className="space-y-3">
              {vaultTransactions.length > 0 ? (
                vaultTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'deposit' 
                          ? 'bg-blue-100 dark:bg-blue-900' 
                          : 'bg-green-100 dark:bg-green-900'
                      }`}>
                        {tx.type === 'deposit' ? (
                          <DollarSign className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white capitalize">
                          {tx.type}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {formatDate(tx.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {tx.type === 'withdrawal' ? '+' : ''}{parseFloat(tx.amount).toFixed(4)} {vault.tokenSymbol}
                      </p>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span className="text-xs text-green-600 dark:text-green-400 capitalize">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Actions
            </h3>
            
            <div className="space-y-3">
              {vault.isUnlocked ? (
                <button
                  onClick={handleWithdraw}
                  className="btn-primary w-full"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Withdraw Funds</span>
                </button>
              ) : (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Funds Locked
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        {vault.daysUntilUnlock || 0} days remaining
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <button className="btn-secondary w-full">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              
              <a
                href={`https://etherscan.io/tx/${vault.transactionHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full"
              >
                <ExternalLink className="w-4 h-4" />
                <span>View on Etherscan</span>
              </a>
            </div>
          </div>

          {/* Vault Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Vault Details
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Vault ID:</span>
                <span className="text-gray-900 dark:text-white font-mono">#{vault.vaultId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Created:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(vault.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Unlock Date:</span>
                <span className="text-gray-900 dark:text-white">{formatDate(vault.unlockTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Token:</span>
                <span className="text-gray-900 dark:text-white font-mono text-xs">
                  {vault.tokenSymbol}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default VaultDetails;