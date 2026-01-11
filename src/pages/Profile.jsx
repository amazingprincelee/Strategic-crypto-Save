import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User, 
  Settings, 
  Shield, 
  Bell,
  Wallet,
  Activity,
  Download,
  ExternalLink
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';
import { useAccount, useBalance, useDisconnect } from 'wagmi';

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const { address } = useAccount();
  const { data: balance } = useBalance({ address });
  const { disconnect } = useDisconnect();
  const formattedBalance = balance ? `${parseFloat(balance.formatted).toFixed(4)} ${balance.symbol}` : '0.0000 ETH';
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleDisconnectWallet = async () => {
    disconnect();
    dispatch(logout());
  };

  const exportData = () => {
    // Mock data export functionality
    const data = {
      user: user,
      wallet: address,
      exportDate: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'crypto-save-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile & Settings
        </h1>
        <p className="mt-1 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Overview */}
      <div className="card">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user?.name || 'Anonymous User'}
            </h2>
            <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
              {address}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Balance: {formattedBalance} ETH
            </p>
          </div>
          <button
            onClick={handleDisconnectWallet}
            className="btn-secondary"
          >
            Disconnect Wallet
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-brandDark-600">
        <nav className="flex -mb-px space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Account Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Display Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user?.name || ''}
                    className="input-field"
                    placeholder="Enter your display name"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    defaultValue={user?.email || ''}
                    className="input-field"
                    placeholder="Enter your email"
                  />
                </div>
                <button className="btn-primary">
                  Save Changes
                </button>
              </div>
            </div>

            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Wallet Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div className="flex items-center space-x-3">
                    <Wallet className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Connected Wallet
                      </p>
                      <p className="font-mono text-sm text-gray-600 dark:text-gray-400">
                        {address}
                      </p>
                    </div>
                  </div>
                  <button className="text-sm text-primary-600 hover:text-primary-700">
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Data & Privacy
              </h3>
              <div className="space-y-4">
                <button
                  onClick={exportData}
                  className="flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                >
                  <Download className="w-4 h-4" />
                  <span>Export My Data</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Security Settings
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Wallet Authentication
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Signed in with wallet signature
                    </p>
                  </div>
                  <span className="status-active">Active</span>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-dark-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      Transaction Signing
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      All transactions require wallet confirmation
                    </p>
                  </div>
                  <span className="status-active">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
                Notification Preferences
              </h3>
              <div className="space-y-4">
                {[
                  { id: 'vault-unlock', label: 'Vault Unlock Notifications', description: 'Get notified when your vaults are ready to unlock' },
                  { id: 'deposits', label: 'Deposit Confirmations', description: 'Receive confirmations for successful deposits' },
                  { id: 'withdrawals', label: 'Withdrawal Notifications', description: 'Get notified about withdrawal transactions' },
                  { id: 'rewards', label: 'Reward Updates', description: 'Notifications about earned rewards and interest' },
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {notification.label}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {notification.description}
                      </p>
                    </div>
                    <button className="relative inline-flex items-center h-6 rounded-full w-11 bg-primary-600">
                      <span className="inline-block w-4 h-4 transform translate-x-6 bg-white rounded-full" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;