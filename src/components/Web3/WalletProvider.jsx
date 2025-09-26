import React, { useEffect } from 'react';
import { WagmiConfig } from 'wagmi';
import { wagmiConfig } from '../../config/wagmi';
// Initialize Web3Modal
import '../../config/web3modal';

const WalletProvider = ({ children }) => {
  useEffect(() => {
    // Handle WalletConnect errors gracefully
    const handleWalletConnectError = (error) => {
      // Only log WalletConnect WebSocket errors, don't throw them
      if (error.message && error.message.includes('WebSocket connection failed')) {
        console.warn('WalletConnect WebSocket connection failed - this is normal and will retry automatically:', error.message);
        return;
      }
      
      // Log other errors but don't break the app
      console.warn('WalletConnect error:', error);
    };

    // Add global error handler for unhandled promise rejections
    const handleUnhandledRejection = (event) => {
      if (event.reason && event.reason.message && 
          (event.reason.message.includes('WebSocket connection failed') || 
           event.reason.message.includes('relay.walletconnect'))) {
        // Prevent the error from being logged as unhandled
        event.preventDefault();
        handleWalletConnectError(event.reason);
      }
    };

    // Add error event listener
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return (
    <WagmiConfig config={wagmiConfig}>
      {children}
    </WagmiConfig>
  );
};

export default WalletProvider;