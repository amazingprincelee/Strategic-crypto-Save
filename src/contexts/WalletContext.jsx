import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAccount, useBalance, useNetwork, useConnect, useDisconnect } from 'wagmi';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);

  const { address, isConnected, connector } = useAccount();
  const { chain } = useNetwork();
  const { connect, connectors, error: connectError, isLoading: connectLoading } = useConnect();
  const { disconnect } = useDisconnect();

  // Get ETH balance
  const { data: balance, isLoading: balanceLoading } = useBalance({
    address,
    enabled: !!address,
    watch: true,
  });

  // Handle connection errors
  useEffect(() => {
    if (connectError) {
      setConnectionError(connectError.message);
      toast.error(`Connection failed: ${connectError.message}`);
    }
  }, [connectError]);

  // Clear error when successfully connected
  useEffect(() => {
    if (isConnected) {
      setConnectionError(null);
      setIsConnecting(false);
    }
  }, [isConnected]);

  const connectWallet = async (connectorId) => {
    try {
      setIsConnecting(true);
      setConnectionError(null);

      const selectedConnector = connectors.find(c => c.id === connectorId);
      if (!selectedConnector) {
        throw new Error('Connector not found');
      }

      await connect({ connector: selectedConnector });
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Wallet connection error:', error);
      setConnectionError(error.message);
      toast.error(`Failed to connect wallet: ${error.message}`);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      await disconnect();
      toast.info('Wallet disconnected');
    } catch (error) {
      console.error('Disconnect error:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const switchNetwork = async (chainId) => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${chainId.toString(16)}` }],
        });
      }
    } catch (error) {
      console.error('Network switch error:', error);
      toast.error('Failed to switch network');
    }
  };

  const addNetwork = async (networkConfig) => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [networkConfig],
        });
      }
    } catch (error) {
      console.error('Add network error:', error);
      toast.error('Failed to add network');
    }
  };

  const formatBalance = (balance) => {
    if (!balance) return '0';
    return parseFloat(ethers.utils.formatEther(balance.value)).toFixed(4);
  };

  const formatAddress = (address, chars = 4) => {
    if (!address) return '';
    return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
  };

  const getExplorerUrl = (hash, type = 'tx') => {
    if (!chain) return '';
    
    const baseUrls = {
      1: 'https://etherscan.io',
      5: 'https://goerli.etherscan.io',
      11155111: 'https://sepolia.etherscan.io',
      31337: 'http://localhost:8545', // Hardhat
    };

    const baseUrl = baseUrls[chain.id] || 'https://etherscan.io';
    return `${baseUrl}/${type}/${hash}`;
  };

  const value = {
    // Connection state
    address,
    isConnected,
    isConnecting: isConnecting || connectLoading,
    connectionError,
    connector,
    
    // Network info
    chain,
    
    // Balance
    balance,
    balanceLoading,
    formattedBalance: formatBalance(balance),
    
    // Available connectors
    connectors,
    
    // Actions
    connectWallet,
    disconnectWallet,
    switchNetwork,
    addNetwork,
    
    // Utilities
    formatAddress,
    formatBalance,
    getExplorerUrl,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};