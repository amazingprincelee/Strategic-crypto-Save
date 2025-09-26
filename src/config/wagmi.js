import { createConfig, configureChains } from 'wagmi';
import { mainnet, sepolia, hardhat } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { infuraProvider } from 'wagmi/providers/infura';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { InjectedConnector } from 'wagmi/connectors/injected';

// Get environment variables
const infuraApiKey = import.meta.env.VITE_INFURA_API_KEY;
const walletConnectProjectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID;

// Configure chains and providers
const getChains = () => {
  const environment = import.meta.env.VITE_ENVIRONMENT;
  
  if (environment === 'development') {
    return [hardhat, sepolia]; // Include both for development
  } else if (environment === 'testnet') {
    return [sepolia];
  } else if (environment === 'production') {
    return [mainnet];
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

// Configure connectors
const connectors = [
  new MetaMaskConnector({
    chains,
    options: {
      shimDisconnect: true,
    },
  }),
  new WalletConnectConnector({
    chains,
    options: {
      projectId: walletConnectProjectId || 'default-project-id',
      metadata: {
        name: 'Strategic Crypto Save',
        description: 'A decentralized savings platform for cryptocurrency',
        url: 'https://strategiccryptosave.com',
        icons: ['https://strategiccryptosave.com/icon.png'],
      },
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

export { chains };