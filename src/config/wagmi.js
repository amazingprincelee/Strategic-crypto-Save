// Web3Modal will be initialized in WalletProvider
import { createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia, polygon, polygonMumbai } from 'wagmi/chains';
import { infuraProvider } from 'wagmi/providers/infura';
import { publicProvider } from 'wagmi/providers/public';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { InjectedConnector } from 'wagmi/connectors/injected';

// Get environment variables
const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY;
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// Configure chains and providers
const getChains = () => {
  const environment = import.meta.env.VITE_ENVIRONMENT;
  
  if (environment === 'development') {
    return [sepolia, polygonMumbai]; // Include testnets for development
  } else if (environment === 'testnet') {
    return [sepolia, polygonMumbai];
  } else if (environment === 'production') {
    return [mainnet, polygon];
  } else {
    // Default to sepolia testnet if no environment is set
    return [sepolia];
  }
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  getChains(),
  [
    ...(infuraApiKey ? [infuraProvider({ apiKey: infuraApiKey })] : []),
    publicProvider(), // Fallback provider
  ]
);

// Create connectors
const connectors = [
  new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
    },
  }),
  new InjectedConnector({
    chains,
    options: {
      name: 'Injected',
      shimDisconnect: true,
    },
  }),
];

// Create wagmi config
export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Export project ID for Web3Modal initialization in WalletProvider
export const projectId = walletConnectProjectId || 'd77f88a21bd9ea69547c2b23b71953ef';

export { chains, sepolia };