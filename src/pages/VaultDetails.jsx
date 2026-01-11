import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import { useAccount } from 'wagmi';
import { 
  fetchVaultById, 
  fetchUserVaultStats, 
  withdrawFromVault,
  clearVaultMessages 
} from '../redux/slices/vaultSlice';

const VaultDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { address: account } = useAccount();
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Get data from Redux store
  const { currentVault: vault, userStats, loading, error, successMessage } = useSelector(
    (state) => state.vault
  );

  // Fetch vault details on mount
  useEffect(() => {
    if (id) {
      dispatch(fetchVaultById(id));
    }
    if (account) {
      dispatch(fetchUserVaultStats(account));
    }
  }, [dispatch, id, account]);

  // Handle success/error messages
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearVaultMessages());
    }
    if (error) {
      toast.error(error);
      dispatch(clearVaultMessages());
    }
  }, [successMessage, error, dispatch]);

  // Filter transactions for this specific vault
  const vaultTransactions = userStats.recentActivity?.filter(activity => 
    activity.vaultId === parseInt(id)
  ) || [];

  // Loading state
  if (loading.vault) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 mx-auto mb-4 animate-spin text-brandPrimary-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading vault details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!vault && !loading.vault) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <h2 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            Vault Not Found
          </h2>
          <p className="mb-4 text-gray-600 dark:text-gray-400">
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
      
      // Dispatch withdraw action
      await dispatch(withdrawFromVault({ 
        vaultId: vault.vaultId, 
        amount: vault.balance 
      })).unwrap();
      
      // Refresh vault data
      dispatch(fetchVaultById(id));
      
    } catch (error) {
      console.error('Withdrawal error:', error);
      // Error toast is handled by useEffect
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

  if (!vault) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-brandDark-700"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Vault #{vault.vaultId}
          </h1>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            {vault.tokenSymbol} Savings Vault
          </p>
        </div>
        <span className={getStatusColor(vault.status)}>
          {vault.status}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Vault Overview */}
          <div className="card">
            <h2 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
              Vault Overview
            </h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
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
              
              <div className="w-full h-3 bg-gray-200 rounded-full dark:bg-dark-600">
                <div
                  className="h-3 transition-all duration-300 rounded-full bg-gradient-to-r from-brandPrimary-500 to-brandSecondary-500"
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
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Transaction History
            </h3>
            
            <div className="space-y-3">
              {vaultTransactions.length > 0 ? (
                vaultTransactions.map((tx) => (
                  <div
                    key={tx._id}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-dark-700"
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
                        <p className="font-medium text-gray-900 capitalize dark:text-white">
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
                        <span className="text-xs text-green-600 capitalize dark:text-green-400">
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <Clock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
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
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Actions
            </h3>
            
            <div className="space-y-3">
              {vault.isUnlocked ? (
                <button
                  onClick={handleWithdraw}
                  disabled={isWithdrawing || loading.action}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isWithdrawing || loading.action ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>Withdraw Funds</span>
                    </>
                  )}
                </button>
              ) : (
                <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
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
              
              <button className="w-full btn-secondary">
                <Download className="w-4 h-4" />
                <span>Export Data</span>
              </button>
              
              {vault.transactionHash && (
                <a
                  href={`https://etherscan.io/tx/${vault.transactionHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-secondary"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>View on Etherscan</span>
                </a>
              )}
            </div>
          </div>

          {/* Vault Details */}
          <div className="card">
            <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
              Vault Details
            </h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Vault ID:</span>
                <span className="font-mono text-gray-900 dark:text-white">#{vault.vaultId}</span>
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
                <span className="font-mono text-xs text-gray-900 dark:text-white">
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