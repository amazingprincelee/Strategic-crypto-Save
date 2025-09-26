import { createWeb3Modal } from '@web3modal/wagmi';
import { wagmiConfig, chains, projectId, sepolia } from './wagmi';

// Initialize Web3Modal immediately when this module is imported
createWeb3Modal({
  wagmiConfig,
  projectId,
  chains,
  defaultChain: sepolia,
  metadata: {
    name: 'Strategic Crypto Save',
    description: 'A decentralized savings platform for cryptocurrency',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://strategiccryptosave.com',
    icons: ['https://strategiccryptosave.com/icon.png'],
  },
  themeMode: 'light',
  themeVariables: {
    '--w3m-color-mix': '#00D4AA',
    '--w3m-color-mix-strength': 15,
  },
});