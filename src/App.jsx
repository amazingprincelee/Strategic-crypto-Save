import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CryptoArbitrage from './components/Cryptoarbitrage/Cryptoarbitrage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import WalletProvider from './components/Web3/WalletProvider';
import { SocketProvider } from './components/socket/SocketContext'; 
import Settings from './components/Settings/Settings'

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateVault from './pages/CreateVault';
import VaultDetails from './pages/VaultDetails';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* SocketProvider wraps the app to provide real-time notification updates */}
      <SocketProvider>
        <WalletProvider>
            <Router>
                  <div className="min-h-screen transition-colors duration-300 bg-gray-50 dark:bg-brandDark-900">
               <Routes>
                    {/* Public Routes - Outside Layout (no sidebar) */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes - Inside Layout (with sidebar) */}
                    <Route element={<Layout />}>
                      <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/create-vault" element={<CreateVault />} />
                        <Route path="/vault/:id" element={<VaultDetails />} />
                        <Route path="/vaults" element={<Dashboard />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/arbitrage" element={<CryptoArbitrage />} />
                        <Route path="/settings" element={<Settings />} />
                      </Route>
                    </Route>

                    {/* 404 Route */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                    
                    {/* Toast Notifications */}
                    <ToastContainer
                      position="top-right"
                      autoClose={5000}
                      hideProgressBar={false}
                      newestOnTop={false}
                      closeOnClick
                      rtl={false}
                      pauseOnFocusLoss
                      draggable
                      pauseOnHover
                      theme="colored"
                      className="mt-16"
                    />
                  </div>
            </Router>
        </WalletProvider>
      </SocketProvider>
    </QueryClientProvider>
  );
}

export default App;